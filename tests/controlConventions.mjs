/* tests/controlConventions.mjs
   ============================================================
   Tests for controls by name alone (ui/controls/builders/conventions.js)
   and their use by the control data builder. Node only, no browser.
   Run: npm run test:controls
   ============================================================ */
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const C = await import(pathToFileURL(path.join(root, "ui/controls/builders/conventions.js")).href);
const D = await import(pathToFileURL(path.join(root, "ui/controls/builders/dataBuilder.js")).href);

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (err) { console.log("FAIL " + name + ": " + err.message); process.exitCode = 1; }
}

test("a name alone gets the whole control", () => {
  const s = C.expandSchema({ lineWidth: true });
  assert.equal(s.lineWidth.widget, "range");
  assert.equal(s.lineWidth.max, 10);
});
test("a name with one change keeps the rest", () => {
  const s = C.expandSchema({ lineWidth: { max: 3 } });
  assert.equal(s.lineWidth.max, 3);
  assert.equal(s.lineWidth.min, 0.5);
});
test("a control written in full is left exactly as it is", () => {
  const full = { widget: "range", label: "Width", min: 1, max: 2, step: 1 };
  assert.deepEqual(C.expandSchema({ lineWidth: full }).lineWidth, full);
});
test("a group becomes its members", () => {
  assert.deepEqual(Object.keys(C.expandSchema({ style: "group", steps: true })), ["color", "lineWidth", "alpha", "steps"]);
});
test("an unknown name is left alone", () => {
  assert.equal(C.expandSchema({ wobble: true }).wobble, true);
});
test("the data builder uses the table (a script declaring names only)", () => {
  const items = D.buildScriptParameterData({ controls: { style: "group", steps: true }, parameters: { steps: 40 } });
  assert.deepEqual(items.map((i) => i.key + ":" + i.widget), ["color:color", "lineWidth:range", "alpha:range", "steps:range"]);
  assert.equal(items.find((i) => i.key === "steps").value, 40);
  assert.equal(items.find((i) => i.key === "lineWidth").value, 1);    // the table's default
});

console.log((process.exitCode ? "FAILED. " : "") + passed + " control convention tests passed.");
