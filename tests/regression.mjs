/* tests/regression.mjs
   ------------------------------------------------------------
   Regression test: does everything still draw what it drew before?

   This does by machine what Barry does by hand, cycling through the saved
   patterns and looking. Every Draw object (at its default settings) and
   every pattern and gallery script is drawn, and what it drew is compared
   with an approved copy kept in tests/regression/.

   What is compared:
     - The geometry: every line drawn through drawLine, as its two ends
       (drawState.collect). Exact, and it is what nails depend on.
     - For scripts that paint with bare ctx (no drawLine), the picture:
       a small copy of the canvas, compared pixel by pixel. Differences of
       8 levels or less (anti-aliasing) are ignored, and the picture counts
       as changed when more than 0.1% of its pixels differ.
     - Whether it threw an error.
   Each item is drawn twice. One that draws differently the second time
   (random, or animated) is reported as unstable and not compared.

   Needs the app running (npm run dev:all). Run:
       npm run test:regression                    compare with the approved copies
       npm run test:regression -- accept          approve everything as it is now
       npm run test:regression -- accept <text>   approve only names containing <text>
   After a compare, tests/regression/report.html shows the approved and the
   new picture side by side for every change, with an overlay, a flicker and
   a difference picture (not committed). tests/regression/tolerance.json,
   optional, gives an item its own pixel allowance.
   Exit code 1 if anything changed. Items with no approved copy yet are
   listed but do not fail.
   Optional: SKETCHPAD_URL, PW_CHROMIUM (path to a Chromium to use).
   ------------------------------------------------------------ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { ROOT, listAllScripts } from "./scriptList.mjs";

const require = createRequire(import.meta.url);
const { PNG } = require("pngjs");

const URL      = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const DIR      = path.join(ROOT, "tests", "regression");
const APPROVED = path.join(DIR, "approved");          // approved pictures (committed)
const LATEST   = path.join(DIR, "latest");            // this run's pictures (not committed)
const LIST     = path.join(DIR, "approved.json");     // approved geometry and errors (committed)
const PICTURE_WIDTH = 240;                            // pixels across each kept picture
const LEVELS   = 8;                                   // pixel difference ignored as noise
const SHARE    = 0.001;                               // share of pixels that may differ
// Per-item allowances (Tier A): tests/regression/tolerance.json, optional, e.g.
//   { "/gallery/Scripts/Generative/noisy.js": { "levels": 20, "share": 0.01 } }
// An item listed there uses its own levels and share instead of the two above.
const TOLERANCE_FILE = path.join(DIR, "tolerance.json");
const TOLERANCE = fs.existsSync(TOLERANCE_FILE) ? JSON.parse(fs.readFileSync(TOLERANCE_FILE, "utf8")) : {};

const [mode, only] = process.argv.slice(2);
const accepting = mode === "accept";
if (mode && !accepting) { console.error("usage: node tests/regression.mjs [accept [text]]"); process.exit(2); }


// ------------------------------------------------------------
// Drawing one item in the page
// ------------------------------------------------------------
const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page    = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e.message || e).split("\n")[0]));
await page.goto(URL);
await page.waitForFunction(() => window.drawCanvas && window.drawRegistry, null, { timeout: 20000 });
await page.click("#patterns-tab");          // the canvas region scripts draw into
await page.waitForTimeout(500);

// Every line drawn through drawLine is noted in drawState.collect while it
// holds a list. Scripts reset drawState before they run, which would set it
// back to null, so for the test it is made to hold one list that a reset
// cannot replace. This is the only change the test makes to the app.
await page.evaluate(async () => {
  const { drawState } = await import("/draw/drawState.js");
  const lines = [];
  Object.defineProperty(drawState, "collect", { get: () => lines, set: () => {}, configurable: true });
  window.__regressionLines = lines;
});

const drawKeys = await page.evaluate(() =>
  Object.keys(window.drawRegistry).filter((k) => !window.drawRegistry[k].template).sort());

// Draws one item; returns { error, ends, picture } (picture is PNG data).
async function drawItem(item) {
  const before = pageErrors.length;
  const out = await page.evaluate(async ({ kind, name, width }) => {
    const lines = window.__regressionLines;
    lines.length = 0;
    let error = "";
    try {
      if (kind === "draw") {
        const { makeDrawInstance } = await import("/ui/draw/drawInstance.js");
        const { resetCanvas, drawState } = await import("/draw/drawState.js");
        const entry = window.drawRegistry[name];
        resetCanvas();
        drawState.transform = null;
        const ctx = window.drawCanvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, window.drawCanvas.width, window.drawCanvas.height);
        const inst = makeDrawInstance(entry, structuredClone(entry.params));
        inst.init(); inst.update(inst.params); inst.draw();
      } else {
        const { runScriptByPath } = await import("/ui/scriptRunner.js");
        await runScriptByPath(name, "canvas", { enableControls: true });
      }
    } catch (e) { error = String(e && e.message || e).split("\n")[0]; }
    await new Promise((r) => setTimeout(r, 60));      // let a first animation frame run
    const c = window.drawCanvas;
    const small = document.createElement("canvas");
    small.width = width; small.height = Math.round(width * c.height / c.width);
    const sc = small.getContext("2d");
    sc.fillStyle = "#fff"; sc.fillRect(0, 0, small.width, small.height);
    sc.drawImage(c, 0, 0, small.width, small.height);
    return { error, ends: lines.map((p) => [p.x, p.y]), picture: small.toDataURL("image/png") };
  }, { kind: item.kind, name: item.name, width: PICTURE_WIDTH });
  if (!out.error && pageErrors.length > before) out.error = pageErrors.slice(before).join(" | ");
  out.picture = Buffer.from(out.picture.split(",")[1], "base64");
  return out;
}

// The geometry as a short fingerprint: ends rounded to 1/100 px.
function fingerprint(ends) {
  const text = ends.map(([x, y]) => x.toFixed(2) + "," + y.toFixed(2)).join(";");
  return crypto.createHash("sha1").update(text).digest("hex").slice(0, 16);
}

// How many pixels of two pictures differ by more than levels (or all, if sizes differ).
function differingPixels(a, b, levels = LEVELS) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) return { count: A.width * A.height, total: A.width * A.height };
  let count = 0;
  for (let i = 0; i < A.data.length; i += 4) {
    if (Math.abs(A.data[i] - B.data[i]) > levels || Math.abs(A.data[i + 1] - B.data[i + 1]) > levels ||
        Math.abs(A.data[i + 2] - B.data[i + 2]) > levels) count++;
  }
  return { count, total: A.width * A.height };
}

const pictureFile = (name) => name.replace(/^\//, "").replace(/[^A-Za-z0-9._-]+/g, "_") + ".png";


// ------------------------------------------------------------
// Draw everything, twice
// ------------------------------------------------------------
const items = [
  ...drawKeys.map((k) => ({ kind: "draw", name: "draw:" + k, key: k })),
  ...listAllScripts().map((p) => ({ kind: "script", name: p }))
].map((it) => ({ ...it, call: it.kind === "draw" ? it.key : it.name }));

const results = new Map();
for (const it of items) {
  const first  = await drawItem({ kind: it.kind, name: it.call });
  const second = await drawItem({ kind: it.kind, name: it.call });
  const lines  = first.ends.length / 2;
  const fp     = fingerprint(first.ends);
  const stable = first.error === second.error && fp === fingerprint(second.ends) &&
                 (lines > 0 || differingPixels(first.picture, second.picture).count === 0);
  results.set(it.name, { lines, fingerprint: fp, error: first.error, picture: first.picture, stable });
}
await browser.close();


// ------------------------------------------------------------
// Accept: write the approved copies
// ------------------------------------------------------------
const approved = fs.existsSync(LIST) ? JSON.parse(fs.readFileSync(LIST, "utf8")) : {};

if (accepting) {
  fs.mkdirSync(APPROVED, { recursive: true });
  let n = 0;
  for (const [name, r] of results) {
    if (only && !name.includes(only)) continue;
    approved[name] = { lines: r.lines, fingerprint: r.fingerprint, error: r.error, stable: r.stable,
                       picture: pictureFile(name) };
    fs.writeFileSync(path.join(APPROVED, pictureFile(name)), r.picture);
    n++;
  }
  // Items that no longer exist are dropped when everything is accepted.
  if (!only) for (const name of Object.keys(approved)) if (!results.has(name)) {
    fs.rmSync(path.join(APPROVED, approved[name].picture), { force: true });
    delete approved[name];
  }
  const sorted = Object.fromEntries(Object.keys(approved).sort().map((k) => [k, approved[k]]));
  fs.writeFileSync(LIST, JSON.stringify(sorted, null, 1) + "\n");
  console.log(`Approved ${n} item(s). Commit tests/regression/ to keep them.`);
  process.exit(0);
}


// ------------------------------------------------------------
// Compare with the approved copies
// ------------------------------------------------------------
fs.rmSync(LATEST, { recursive: true, force: true });
fs.mkdirSync(LATEST, { recursive: true });
const changed = [], unapproved = [], unstable = [], gone = [];

for (const [name, r] of results) {
  const a = approved[name];
  if (!a) { unapproved.push(name); continue; }
  if (!r.stable || !a.stable) { unstable.push(name); continue; }
  const why = [];
  if (r.error !== a.error) why.push(r.error ? "now fails: " + r.error : "no longer fails (was: " + a.error + ")");
  if (r.lines || a.lines) {
    if (r.lines !== a.lines) why.push(`lines ${a.lines} -> ${r.lines}`);
    else if (r.fingerprint !== a.fingerprint) why.push(`the ${r.lines} lines moved`);
  } else {
    const was = path.join(APPROVED, a.picture);
    const own = TOLERANCE[name] || {};
    const d = fs.existsSync(was) ? differingPixels(fs.readFileSync(was), r.picture, own.levels ?? LEVELS) : { count: 1, total: 1 };
    if (d.count / d.total > (own.share ?? SHARE)) why.push(`picture: ${d.count} of ${d.total} pixels differ`);
  }
  if (why.length) {
    fs.writeFileSync(path.join(LATEST, a.picture), r.picture);
    changed.push({ name, why: why.join("; "), picture: a.picture });
  }
}
for (const name of Object.keys(approved)) if (!results.has(name)) gone.push(name);

// The report: for each change, approved and new side by side, then three
// ways of seeing the difference (Tier A), made in the browser when the
// report is opened: overlay (approved in blue, new in red, both where they
// agree in black), flicker (click to start and stop switching between the
// two) and difference (only the pixels that changed, in red).
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
let html = "<!doctype html><meta charset='utf-8'><title>Regression report</title>" +
  "<style>body{font-family:sans-serif;margin:16px}figure{display:inline-block;margin:4px;text-align:center}" +
  "img,canvas{border:1px solid #999}section{border-bottom:1px solid #ccc;padding:8px 0}</style>" +
  `<h1>Regression report</h1><p>${results.size} items drawn; ${changed.length} changed, ` +
  `${unstable.length} unstable (not compared), ${unapproved.length} not yet approved.</p>`;
for (const c of changed) {
  html += `<section data-approved='approved/${c.picture}' data-latest='latest/${c.picture}'><h3>${esc(c.name)}</h3><p>${esc(c.why)}</p>` +
    `<figure><img src='approved/${c.picture}'><figcaption>approved</figcaption></figure>` +
    `<figure><img src='latest/${c.picture}'><figcaption>now</figcaption></figure>` +
    `<figure><canvas class='overlay'></canvas><figcaption>overlay: blue approved, red now</figcaption></figure>` +
    `<figure><img class='flicker' src='approved/${c.picture}' title='click to flicker'><figcaption class='flickerName'>flicker (click): approved</figcaption></figure>` +
    `<figure><canvas class='difference'></canvas><figcaption>difference</figcaption></figure></section>`;
}
html += `<script>
// Builds the overlay and difference pictures and wires the flicker.
function load(src) { return new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; }); }
function pixels(img) { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
  const x = c.getContext("2d"); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height); }
document.querySelectorAll("section[data-approved]").forEach(async (sec) => {
  const [a, b] = await Promise.all([load(sec.dataset.approved), load(sec.dataset.latest)]);
  const A = pixels(a), B = pixels(b), w = A.width, h = A.height;
  for (const [cls, paint] of [["overlay", (i, o) => {
      const inkA = A.data[i] + A.data[i + 1] + A.data[i + 2] < 600, inkB = B.data[i] + B.data[i + 1] + B.data[i + 2] < 600;
      o.set(inkA && inkB ? [0, 0, 0, 255] : inkA ? [0, 90, 255, 255] : inkB ? [230, 0, 0, 255] : [255, 255, 255, 255], i); }],
    ["difference", (i, o) => {
      const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
      o.set(d > ${3 * LEVELS} ? [230, 0, 0, 255] : [255, 255, 255, 255], i); }]]) {
    const cv = sec.querySelector("canvas." + cls); cv.width = w; cv.height = h;
    const ctx = cv.getContext("2d"), out = ctx.createImageData(w, h);
    if (B.width === w && B.height === h) for (let i = 0; i < out.data.length; i += 4) paint(i, out.data);
    ctx.putImageData(out, 0, 0);
  }
  const fl = sec.querySelector("img.flicker"), name = sec.querySelector(".flickerName");
  let timer = null, showingNew = false;
  fl.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; return; }
    timer = setInterval(() => { showingNew = !showingNew; fl.src = showingNew ? sec.dataset.latest : sec.dataset.approved;
      name.textContent = "flicker (click): " + (showingNew ? "now" : "approved"); }, 600);
  };
});
</script>`;
fs.writeFileSync(path.join(DIR, "report.html"), html);

console.log(`\n${results.size} items drawn (${drawKeys.length} Draw objects, ${results.size - drawKeys.length} scripts).`);
if (unstable.length)   console.log(`Note: ${unstable.length} unstable (draw differently each time), not compared:\n  ` + unstable.join("\n  "));
if (unapproved.length) console.log(`Note: ${unapproved.length} not yet approved (npm run test:regression -- accept):\n  ` + unapproved.join("\n  "));
if (gone.length)       console.log(`Note: ${gone.length} approved but no longer present:\n  ` + gone.join("\n  "));
if (changed.length) {
  console.log(`\nFAIL: ${changed.length} changed. See tests/regression/report.html.`);
  for (const c of changed) console.log("  " + c.name + ": " + c.why);
  console.log("If a change is intended: npm run test:regression -- accept <name>");
  process.exit(1);
}
console.log("\nPASS: everything draws what it drew before.");

// end regression.mjs
