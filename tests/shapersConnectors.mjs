/* tests/shapersConnectors.mjs
   ============================================================
   Tests for draw/shapers.js and draw/connectors.js
   ============================================================
   Both files are plain functions on arrays of points with no imports
   from the page, so they are tested here in Node, without a browser.
   Run: npm run test:shapers
   ============================================================ */

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const S = await import(pathToFileURL(path.join(root, "draw/shapers.js")).href);
const C = await import(pathToFileURL(path.join(root, "draw/connectors.js")).href);

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (err) { console.log("FAIL " + name + ": " + err.message); process.exitCode = 1; }
}
const P = (x, y, z) => (z === undefined ? { x, y } : { x, y, z });
const near = (a, b) => Math.abs(a - b) < 1e-9;
const xs = (pts) => pts.map((p) => Math.round(p.x * 1000) / 1000);

// ---------- shapers ----------
test("linePoints gives steps+1 points, ends included", () => {
  const pts = S.linePoints(P(0, 0), P(10, 0), 5);
  assert.deepEqual(xs(pts), [0, 2, 4, 6, 8, 10]);
});
test("every shaper keeps z", () => {
  const A = [P(0, 0, 7), P(10, 0, 7), P(10, 10, 7)];
  const all = [S.translated(A, 1, 1), S.rotated(A, P(0, 0), 30), S.scaled(A, P(0, 0), 2),
               S.mirrored(A, P(0, 0), P(0, 1)), S.resampled(A, 5), S.simplified(A, 0.1),
               S.linePoints(A[0], A[1], 3), S.arcPoints(P(0, 0, 7), 5, 0, 90, 3)];
  for (const pts of all) for (const p of pts) assert.equal(p.z, 7);
});
test("a Point stays a Point (class kept)", () => {
  class Pt { constructor(x, y) { this.x = x; this.y = y; } }
  const out = S.translated([new Pt(1, 2)], 1, 1);
  assert.ok(out[0] instanceof Pt);
  assert.equal(out[0].x, 2);
});
test("shapers never change their input", () => {
  const A = [P(0, 0), P(1, 0), P(2, 0)];
  const copy = JSON.stringify(A);
  S.reversed(A); S.rotated(A, P(0, 0), 90); S.rotateStart(A, 1); S.everyNth(A, 2);
  assert.equal(JSON.stringify(A), copy);
});
test("part, everyNth, rotateStart", () => {
  const A = [0, 1, 2, 3, 4, 5].map((x) => P(x, 0));
  assert.deepEqual(xs(S.part(A, 1, 3)), [1, 2]);
  assert.deepEqual(xs(S.part(A, -2)), [4, 5]);
  assert.deepEqual(xs(S.everyNth(A, 2)), [0, 2, 4]);
  assert.deepEqual(xs(S.everyNth(A, 0)), [0, 1, 2, 3, 4, 5]);        // 0 counts as 1
  assert.deepEqual(xs(S.rotateStart(A, 2)), [2, 3, 4, 5, 0, 1]);
  assert.deepEqual(xs(S.rotateStart(A, -1)), [5, 0, 1, 2, 3, 4]);
});
test("mirrored across the y axis", () => {
  const out = S.mirrored([P(3, 4)], P(0, 0), P(0, 1));
  assert.ok(near(out[0].x, -3) && near(out[0].y, 4));
});
test("resampled spaces points evenly along a bent path", () => {
  const out = S.resampled([P(0, 0), P(10, 0), P(10, 10)], 5);   // length 20, every 5
  assert.deepEqual(out.map((p) => [Math.round(p.x), Math.round(p.y)]), [[0, 0], [5, 0], [10, 0], [10, 5], [10, 10]]);
});
test("simplified drops points on a straight line, keeps a corner", () => {
  const out = S.simplified([P(0, 0), P(5, 0), P(10, 0), P(10, 10)], 0.1);
  assert.deepEqual(out.map((p) => [p.x, p.y]), [[0, 0], [10, 0], [10, 10]]);
});
test("empty arrays give empty arrays", () => {
  for (const f of [S.reversed, S.part, S.everyNth, S.rotateStart, S.simplified]) assert.deepEqual(f([]), []);
});

// ---------- connectors ----------
test("pairwise joins i to i", () => {
  const A = S.linePoints(P(0, 0), P(0, 10), 2), B = S.linePoints(P(10, 0), P(10, 10), 2);
  const pairs = C.pairwise(A, B);
  assert.equal(pairs.length, 3);
  assert.equal(pairs[1][0], A[1]);
  assert.equal(pairs[1][1], B[1]);
});
test("pairwise with unequal arms: stops at the shorter, or spreads", () => {
  const A = S.linePoints(P(0, 0), P(0, 10), 4), B = S.linePoints(P(10, 0), P(10, 10), 2);   // 5 and 3
  assert.equal(C.pairwise(A, B).length, 3);
  const spread = C.pairwise(A, B, { spread: true });
  assert.equal(spread.length, 5);
  assert.equal(spread[4][1], B[2]);                     // last joins last
});
test("pairwise offset stops or wraps", () => {
  const A = [0, 1, 2].map((x) => P(x, 0)), B = [0, 1, 2].map((x) => P(x, 9));
  assert.equal(C.pairwise(A, B, { offset: 1 }).length, 2);
  assert.equal(C.pairwise(A, B, { offset: 1, wrap: true }).length, 3);
  assert.equal(C.pairwise(A, B, { offset: 1, wrap: true })[2][1], B[0]);
});
test("a rule reads as a line: pairwise(part(A), reversed(B))", () => {
  const A = [0, 1, 2, 3].map((x) => P(x, 0)), B = [0, 1, 2, 3].map((x) => P(x, 9));
  const pairs = C.pairwise(S.part(A, 0, 2), S.reversed(B));
  assert.deepEqual(pairs.map(([a, b]) => [a.x, b.x]), [[0, 3], [1, 2]]);
});
test("corner: steps+1 lines, first from a, last to b", () => {
  const pairs = C.corner(P(0, 0), P(0, 10), P(10, 10), 10);
  assert.equal(pairs.length, 11);
  assert.deepEqual([pairs[0][0].x, pairs[0][0].y], [0, 0]);
  assert.deepEqual([pairs[10][1].x, pairs[10][1].y], [10, 10]);
});
test("chords wrap or stop", () => {
  const pts = [0, 1, 2, 3].map((x) => P(x, 0));
  assert.equal(C.chords(pts, { skip: 1 }).length, 4);
  assert.equal(C.chords(pts, { skip: 1, wrap: false }).length, 3);
});
test("timesTable leaves out a point joined to itself; negative factors wrap", () => {
  const pts = S.arcPoints(P(0, 0), 10, 0, 350, 35);   // 36 points
  assert.equal(C.timesTable(pts, { factor: 1 }).length, 0);
  assert.ok(C.timesTable(pts, { factor: -2 }).length > 0);
});
test("allPairs: n(n-1)/2 lines", () => {
  assert.equal(C.allPairs([0, 1, 2, 3, 4].map((x) => P(x, 0))).length, 10);
});
test("polyline and close", () => {
  const pts = [0, 1, 2].map((x) => P(x, 0));
  assert.equal(C.polyline(pts).length, 2);
  assert.equal(C.polyline(pts, { close: true }).length, 3);
});
test("mesh joins right and down; ragged rows join as far as both go", () => {
  const rows = [[P(0, 0), P(1, 0), P(2, 0)], [P(0, 1), P(1, 1)]];
  assert.equal(C.mesh(rows).length, 2 + 2 + 1);        // row 1: 2 across, 2 down; row 2: 1 across
});
test("connectors never throw on empty arrays", () => {
  for (const f of [C.pairwise, C.chords, C.growingChords, C.timesTable, C.allPairs, C.polyline]) f([], []);
  C.mesh([]);
});

console.log((process.exitCode ? "FAILED. " : "") + passed + " shaper and connector tests passed.");
