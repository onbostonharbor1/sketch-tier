/* tests/errorReport.mjs
   ------------------------------------------------------------
   Tests the error reporting (ui/errorReport.js) and the checks that use it,
   in the running app:
     1. Start-up is clean: the draw registry check finds nothing, the
        error bar is hidden.
     2. An uncaught error shows in the error bar and is written once to
        today's error log; a repeat is counted in the bar, not logged again.
     3. A figure layer that throws is named in the bar, and the other
        layers still draw.
     4. After a reload, the Home tab's alert says the error log has errors.
     5. Utilities > Show Logs lists the error log under "Error logs".
     6. Validate Draw Registry shows every object, all sound (shape and
        drawing only through drawLine).
     7. Check Figure Files runs, and checkFigureFormat names a figure's
        broken references (a layer not in the registry, a bad drawOrder).
     8. The error checklist: Tick in the bar, Home > Errors (tick, Show all, Purge), Home > Notes.
     9. Home > Checklist: tick, Add item, Show all, Purge ticked (home/checklist.md is restored).
    10. Home > Help: the three groups, a build document shown formatted, New reflection (removed after).
   The error log written here is removed at the end if this test created it.

   Needs the app and the Node service running (npm run dev:all).
   Run: npm run test:errors     Optional: SKETCHPAD_URL, PW_CHROMIUM.
   ------------------------------------------------------------ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./scriptList.mjs";

const URL = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const problems = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) problems.push(what); };

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const logFile = path.join(ROOT, "utilities", "logfiles",
  "errors_" + now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + ".txt");
const logExisted = fs.existsSync(logFile);
const logBefore  = logExisted ? fs.readFileSync(logFile, "utf8") : "";
const newLogText = () => (fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "").slice(logBefore.length);

const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
async function load() {
  await page.goto(URL);
  await page.waitForFunction(() => window.drawRegistry && window.drawCanvas, null, { timeout: 20000 });
  await page.waitForTimeout(1500);
}
const barText = () => page.evaluate(() => {
  const b = document.getElementById("errorBar");
  return b.style.display === "none" ? "" : b.textContent;
});

try {
  console.log("1. Start-up");
  await load();
  check(await barText() === "", "error bar hidden at start-up (registry check clean)");

  console.log("2. An uncaught error");
  await page.evaluate(() => { setTimeout(() => { throw new Error("regression probe one"); }, 0); });
  await page.waitForTimeout(400);
  check((await barText()).includes("regression probe one"), "the error is shown in the bar");
  await page.evaluate(() => { setTimeout(() => { throw new Error("regression probe one"); }, 0); });
  await page.waitForTimeout(400);
  check((await barText()).includes("[2 times]"), "a repeat is counted in the bar");
  const logged = newLogText().split("\n").filter((l) => l.includes("regression probe one"));
  check(logged.length === 1, "written once to " + path.basename(logFile) + " (found " + logged.length + ")");
  check(/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d  Uncaught error: regression probe one/.test(logged[0] || ""), "the log line has time, where and message");

  console.log("3. A figure layer that throws");
  await page.click("#figures-tab");
  await page.waitForTimeout(800);
  await page.locator("#subtabs button", { hasText: "Categories" }).click();   // a new, empty figure
  await page.waitForTimeout(300);
  await page.click("#createFigureButton");
  await page.waitForTimeout(500);
  const layerResult = await page.evaluate(async () => {
    const { uiState } = await import("/ui/uiState.js");
    const { insertLayer } = await import("/ui/figures/figureLayers.js");
    const { redrawFigure } = await import("/ui/figures/figureDraw.js");
    const tabId = uiState.figures.activeSubtab;
    insertLayer(tabId, "drawLine");
    insertLayer(tabId, "parabola");
    const ts = uiState.figures.tabs[tabId];
    const bad = ts.instances[0];
    bad.draw = () => { throw new Error("regression probe layer"); };
    redrawFigure(tabId);
    return { goodLines: (ts.instances[1].stitchEnds || []).length };
  });
  await page.waitForTimeout(400);
  const bar3 = await barText();
  check(/layer 1 \(drawLine\): regression probe layer/.test(bar3), "the bar names the failed layer");
  check(layerResult.goodLines > 0, "the other layer still drew (" + layerResult.goodLines / 2 + " lines)");

  console.log("4. Home after a reload");
  await load();
  const alert = await page.evaluate(() => document.getElementById("alertBar").textContent);
  check(/\d+ errors? (is|are) not yet ticked/.test(alert), "Home says errors are not yet ticked");
  check(alert.includes("regression probe"), "and lists the latest of them");

  console.log("5. Show Logs");
  await page.click("#utilities-tab");
  await page.waitForTimeout(600);
  const logs = await page.evaluate(async () => {
    const mod = await import("/utilities/Tools/Stuff/showLogs.js");
    await mod.runPattern();
    await new Promise((r) => setTimeout(r, 500));
    return { action: document.getElementById("action").textContent, text: document.getElementById("text").textContent };
  });
  check(logs.action.includes("Error logs (newest first):"), "the error log is listed under Error logs");

  console.log("6. Validate Draw Registry");
  const reg = await page.evaluate(async () => {
    const mod = await import("/utilities/Tools/Registry/validateDrawRegistry.js");
    mod.runPattern();
    return Array.from(document.getElementById("text").children).map((e) => e.textContent).join("\n");
  });
  const keys = await page.evaluate(() => Object.keys(window.drawRegistry));
  check(keys.every((k) => reg.includes(k + ": ")), "every registry object is listed");
  // Known, reported to Barry 2 Nov 2026: Linked Circles strokes its circles
  // itself (drawOneCircle), not through drawLine. Anything else is new.
  const flagged = keys.filter((k) => reg.split("\n").some((l) => l.startsWith(k + ": ") && !l.startsWith(k + ": OK")));
  check(flagged.every((k) => k === "linkedCircles"), "no registry problems except the known Linked Circles one" +
        (flagged.length ? " (flagged: " + flagged.join(", ") + ")" : ""));

  console.log("7. Figure files");
  const fig = await page.evaluate(async () => {
    const mod = await import("/utilities/Tools/Registry/checkFigureFiles.js");
    await mod.runPattern();
    const text = document.getElementById("text").textContent;
    const { createEmptyFigure, checkFigureFormat } = await import("/ui/figures/figureModel.js");
    const f = createEmptyFigure("probe");
    const sound = checkFigureFormat(f);
    f.layers.push({ kind: "draw", id: "noSuchObject", lid: "L1", objectVersion: 1, role: "stitch", includeInOutput: true,
                    visible: true, params: {}, transform: { angle: 0, tx: 0, ty: 0 } });
    f.drawOrder = [0, 0, 3];
    return { text, sound, broken: checkFigureFormat(f) };
  });
  check(/figure file\(s\) in \d+ categories/.test(fig.text), "Check Figure Files runs");
  check(fig.sound.length === 0, "a new empty figure passes the check");
  check(fig.broken.some((p) => p.includes("not in the draw registry")), "a layer not in the registry is named");
  check(fig.broken.some((p) => p.includes("twice")) && fig.broken.some((p) => p.includes("does not exist")), "a bad drawOrder is named");

  console.log("8. The error checklist (Tier A step 3)");
  const pure = await page.evaluate(async () => {
    const { openErrors } = await import("/ui/errorChecklist.js");
    const log1 = "ERRORS heading\n2026-11-01 10:00:00  A: one  (ui/x.js:1)\n2026-11-01 10:00:01  A: two\n";
    const log2 = "2026-11-02 09:00:00  Acknowledged: A: one\n2026-11-02 09:00:01  A: two  (ui/y.js:2)\n2026-11-02 09:00:02  A: three\n" +
                 "2026-11-02 09:00:03  Acknowledged: A: three\n2026-11-02 09:00:04  A: three\n";
    return openErrors([log1, log2]).map((e) => e.key + "/" + e.count);
  });
  check(JSON.stringify(pure) === JSON.stringify(["A: two/2", "A: three/1"]), "openErrors: ticked errors leave, repeats count, a later report reopens (" + pure.join(", ") + ")");
  await page.evaluate(() => { setTimeout(() => { throw new Error("regression probe tick"); }, 0); });
  await page.waitForTimeout(500);
  const tickButtons = page.locator("#errorBar li", { hasText: "regression probe tick" }).locator("button", { hasText: "Tick" });
  await tickButtons.click();
  await page.waitForTimeout(600);
  check(!(await barText()).includes("regression probe tick"), "Tick removes the error from the bar");
  check(newLogText().includes("Acknowledged: Uncaught error: regression probe tick"), "and writes Acknowledged to the log");
  await page.click("#home-tab");
  await page.waitForTimeout(800);
  await page.locator("#subtabs button", { hasText: "Errors" }).click();
  await page.waitForTimeout(1200);
  const listed = await page.evaluate(() => document.getElementById("text").textContent);
  check(listed.includes("regression probe one") && !listed.includes("regression probe tick"), "Home > Errors lists open errors, not ticked ones");
  await page.locator("#homeErrorsList li", { hasText: "regression probe one" }).first().locator("input[type=checkbox]").check();
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => document.getElementById("text").textContent);
  check(!after.includes("regression probe one"), "ticking on Home > Errors removes it");
  await page.locator("#text .tick-show-all").check();
  await page.waitForTimeout(1200);
  check((await page.evaluate(() => document.getElementById("text").textContent)).includes("regression probe one"), "Show all shows it again, ticked");
  page.once("dialog", (d) => d.accept());
  await page.locator("#text .tick-purge").click();
  await page.waitForTimeout(1200);
  check(!(await page.evaluate(() => document.getElementById("text").textContent)).includes("regression probe one"), "Purge ticked removes it even with Show all");
  check(newLogText().includes("Purged: Uncaught error: regression probe one"), "and writes Purged to the log");

  console.log("9. Home > Checklist");
  const checklistFile = path.join(ROOT, "home", "checklist.md");
  const checklistBefore = fs.readFileSync(checklistFile, "utf8");
  try {
    fs.writeFileSync(checklistFile, "# Test\n- [ ] alpha check\n- [x] beta check\n");
    await page.locator("#subtabs button", { hasText: "Checklist" }).click();
    await page.waitForTimeout(1000);
    const listText = () => page.evaluate(() => document.getElementById("text").textContent);
    let t = await listText();
    check(t.includes("alpha check") && !t.includes("beta check"), "lists unticked items only");
    await page.locator("#text .tick-add-text").fill("gamma check");
    await page.locator("#text .tick-add").click();
    await page.waitForTimeout(1000);
    check(fs.readFileSync(checklistFile, "utf8").includes("- [ ] gamma check"), "Add item writes a new line to home/checklist.md");
    await page.locator("#homeChecklistList li", { hasText: "alpha check" }).locator("input").check();
    await page.waitForTimeout(1000);
    check(fs.readFileSync(checklistFile, "utf8").includes("- [x] alpha check") && !(await listText()).includes("alpha check"), "ticking writes [x] and hides it");
    await page.locator("#text .tick-show-all").check();
    await page.waitForTimeout(1000);
    t = await listText();
    check(t.includes("alpha check") && t.includes("beta check"), "Show all shows ticked items");
    page.once("dialog", (d) => d.accept());
    await page.locator("#text .tick-purge").click();
    await page.waitForTimeout(1000);
    const left = fs.readFileSync(checklistFile, "utf8");
    check(left === "# Test\n- [ ] gamma check\n", "Purge ticked removes the ticked lines and keeps the rest (" + JSON.stringify(left) + ")");
  } finally {
    fs.writeFileSync(checklistFile, checklistBefore);
  }
  await page.locator("#subtabs button", { hasText: "Notes" }).click();
  await page.waitForTimeout(800);
  const notes = await page.evaluate(() => document.getElementById("homeNotesText")?.textContent || "");
  check(notes.includes("Notes and to-do"), "Home > Notes shows home/notes.md");

  console.log("10. Home > Help");
  const reflectionFile = path.join(ROOT, "help", "Reflections", "Probe_reflection_from_the_test.html");
  try {
    await page.click("#home-tab");
    await page.waitForTimeout(600);
    await page.locator("#subtabs button", { hasText: "Help" }).click();
    await page.waitForTimeout(1500);
    const groups = await page.evaluate(() => [...document.querySelectorAll("#homeHelpTree > ul > li > a")].map((a) => a.textContent));
    check(groups.length === 3 && /^Design \(\d+\)/.test(groups[0]) && /^Reflections \(\d+\)/.test(groups[1]) && /^Build Documents \(\d+\)/.test(groups[2]),
          "three groups: Design, Reflections, Build Documents (" + groups.join(" | ") + ")");
    await page.locator("#homeHelpTree a", { hasText: "Tier A" }).first().click();
    await page.waitForTimeout(800);
    const shown = await page.evaluate(() => document.getElementById("homeHelpPane").innerHTML);
    check(shown.includes("<table>") && shown.includes("Tier A"), "a build document (TIERS.md) shows formatted, with its tables");
    page.once("dialog", (d) => d.accept("Probe reflection from the test"));
    await page.click("#homeHelpNew");
    await page.waitForTimeout(2000);
    check(fs.existsSync(reflectionFile) && fs.readFileSync(reflectionFile, "utf8").includes("<title>Probe reflection from the test</title>"),
          "New reflection creates help/Reflections/<title>.html");
    const editorOpen = await page.evaluate(() => !!document.getElementById("helpEditorArea"));
    check(editorOpen, "and opens it in the help editor");
    await page.evaluate(() => document.getElementById("helpCancelButton")?.click());
    await page.waitForTimeout(500);
    await page.click("#overlayClose");                // close the help overlay as Barry would
    await page.click("#home-tab");
    await page.waitForTimeout(600);
    await page.locator("#subtabs button", { hasText: "Help" }).click();
    await page.waitForTimeout(1500);
    const reflections = await page.evaluate(() => document.getElementById("homeHelpTree").textContent);
    check(reflections.includes("Probe reflection from the test"), "the new reflection is listed by its title");
  } finally {
    fs.rmSync(reflectionFile, { force: true });
  }
} finally {
  await browser.close();
  // Leave the log as it was: remove what this test wrote.
  if (!logExisted) fs.rmSync(logFile, { force: true });
  else fs.writeFileSync(logFile, logBefore);
}

if (problems.length) { console.log("\nFAIL: " + problems.length + " problem(s)."); process.exit(1); }
console.log("\nPASS: errors are shown, logged once, reported at start-up, and the checks work.");

// end errorReport.mjs
