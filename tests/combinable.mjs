/* tests/combinable.mjs
   ============================================================
   npm run test:combinable: runs the combination analyzer
   (gallery/Scripts/Combinations/lib/combine.js, checkCombinable) over every
   gallery script, writes gallery/Scripts/Combinations/combinable.md
   (which can be combined, and why the others cannot), and checks that
   every combination in that folder runs without an error and draws.
   Needs the app running (Vite on 5173, the Node service on 5174).
   ============================================================ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { ROOT, listAllScripts } from "./scriptList.mjs";

const URL = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const DIR = "/gallery/Scripts/Combinations/";
const scripts = listAllScripts().filter((s) => s.startsWith("/gallery/Scripts/"));

const executablePath = process.env.PW_CHROMIUM || undefined;   // as tests/regression.mjs
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
await page.goto(URL);
await page.waitForFunction(() => window.drawCanvas && window.drawRegistry, null, { timeout: 20000 });
await page.waitForTimeout(500);

/* The analyzer, script by script. A script whose module will not load is a failure too. */
const rows = [];
for (const s of scripts) {
  if (s.startsWith(DIR)) continue;
  const r = await page.evaluate(async (s) => {
    try {
      const R = await import("/ui/scriptRunner.js");
      const C = await import("/gallery/Scripts/Combinations/lib/combine.js");
      const mod = await R.loadScriptModule(s);
      return C.checkCombinable(mod.scriptInfo);
    } catch (err) { return { ok: false, reasons: ["does not load: " + err.message] }; }
  }, s);
  rows.push({ s, ...r });
}

/* Every combination: runs, draws, and no page error. */
const combos = scripts.filter((s) => s.startsWith(DIR) && !/\/(lib\/combine|frame)\.js$/.test(s));
const failures = [];
for (const s of combos) {
  const before = pageErrors.length;
  const drew = await page.evaluate(async (s) => {
    const R = await import("/ui/scriptRunner.js");
    const mod = await R.loadScriptModule(s);
    await R.executeScriptToCanvas(mod, s, { canvasRegionId: "sketchpad", enableControls: false });
    const d = window.drawCanvas.getContext("2d").getImageData(0, 0, 800, 600).data;
    let ink = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) ink++;
    return ink;
  }, s);
  if (!drew) failures.push(s + ": drew nothing");
  if (pageErrors.length > before) failures.push(s + ": " + pageErrors.slice(before).join("; "));
}

/* The report. */
const ok = rows.filter((r) => r.ok), bad = rows.filter((r) => !r.ok);
const counts = {};
for (const r of bad) for (const why of r.reasons) { const k = why.replace(/:.*/, ""); counts[k] = (counts[k] || 0) + 1; }
const md = [
  "# Which gallery scripts a combination can use",
  "",
  `Written by \`npm run test:combinable\` on ${new Date().toISOString().slice(0, 10)}; do not edit by hand. ` +
  `${ok.length} of ${rows.length} scripts can be combined.`,
  "",
  "## Reasons, counted",
  "",
  ...Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, n]) => `- ${n}: ${k}`),
  "",
  "## Can be combined",
  "",
  ...ok.map((r) => `- \`${r.s}\``),
  "",
  "## Cannot be combined",
  "",
  ...bad.map((r) => `- \`${r.s}\`: ${r.reasons.join("; ")}`),
  ""
].join("\n");
fs.writeFileSync(path.join(ROOT, "gallery/Scripts/Combinations/combinable.md"), md);

console.log(`combinable: ${ok.length} of ${rows.length}`);
for (const [k, n] of Object.entries(counts)) console.log(`  ${n}: ${k}`);
console.log(`combinations: ${combos.length} run, ${failures.length} failed`);
for (const f of failures) console.log("  FAIL " + f);
await browser.close();
process.exit(failures.length ? 1 : 0);
