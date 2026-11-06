/* tests/intersections.mjs
   ============================================================
   Tests for draw/intersections.js (Node only, no browser)
   ============================================================
   1. Same answers as testing every pair, on random paths.
   2. Fast: a 20,000-point curve that crosses itself thousands of times.
   3. Odd cases: parallel segments, crossings at joints, closed paths,
      self-only and between-only, the merge distance, the limits.
   Run: npm run test:intersections
   ============================================================ */
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const X = await import(pathToFileURL(path.join(root, "draw/intersections.js")).href);

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (err) { console.log("FAIL " + name + ": " + err.message); process.exitCode = 1; }
}
const P = (x, y) => ({ x, y });

/* bruteForce: every pair of segments tested, the slow way, for comparison. */
function bruteForce(paths, skip = 1, margin = 0) {
  const segs = [];
  paths.forEach((pts, p) => { for (let i = 0; i + 1 < pts.length; i++) segs.push({ p, i, a: pts[i], b: pts[i + 1] }); });
  const out = [];
  for (let m = 0; m < segs.length; m++) for (let k = m + 1; k < segs.length; k++) {
    const s = segs[m], t = segs[k];
    if (s.p === t.p && Math.abs(s.i - t.i) <= skip) continue;
    const h = X.crossingOf(s.a, s.b, t.a, t.b, margin, false);
    if (h) out.push(h.x.toFixed(6) + "," + h.y.toFixed(6));
  }
  return out.sort();
}

/* seeded random numbers, so a failure can be repeated */
let seed = 7;
const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const randomPath = (n) => Array.from({ length: n }, () => P(rand() * 500, rand() * 500));

test("the same crossings as testing every pair, on 30 random sets of paths", () => {
  for (let trial = 0; trial < 30; trial++) {
    const paths = [randomPath(20 + trial), randomPath(15)];
    const fast = X.findIntersections(paths, { mergeDistance: 0 }).points.map((h) => h.x.toFixed(6) + "," + h.y.toFixed(6)).sort();
    assert.deepEqual(fast, bruteForce(paths), "trial " + trial);
  }
});
test("the same with a larger neighbour skip and an end margin (Parametrics' settings)", () => {
  const paths = [randomPath(80)];
  const fast = X.findIntersections(paths, { mergeDistance: 0, neighbourSkip: 2, endMargin: 0.01 }).points
    .map((h) => h.x.toFixed(6) + "," + h.y.toFixed(6)).sort();
  assert.deepEqual(fast, bruteForce(paths, 2, 0.01));
});
test("fast: a 20,000-point curve with thousands of crossings in well under a second", () => {
  const pts = [];
  for (let i = 0; i < 20000; i++) { const t = i / 20000 * 2 * Math.PI * 7; pts.push(P(300 + 250 * Math.sin(3 * t), 300 + 250 * Math.sin(4.02 * t))); }
  const t0 = performance.now();
  const r = X.findIntersections([pts], { mergeDistance: 0, maxCount: 1e9, timeLimit: 1e9 });
  const ms = performance.now() - t0;
  assert.ok(r.points.length > 1000, "crossings found: " + r.points.length);
  assert.ok(ms < 1000, "took " + Math.round(ms) + " ms");
  console.log("  20,000 points: " + r.points.length + " crossings in " + Math.round(ms) + " ms");
});
test("an X crosses once, at its centre, with the segment numbers and fractions", () => {
  const r = X.findIntersections([[P(0, 0), P(10, 10)], [P(0, 10), P(10, 0)]]);
  assert.equal(r.points.length, 1);
  const h = r.points[0];
  assert.ok(Math.abs(h.x - 5) < 1e-9 && Math.abs(h.y - 5) < 1e-9);
  assert.deepEqual([h.a.path, h.a.segment, h.b.path, h.b.segment], [0, 0, 1, 0]);
  assert.ok(Math.abs(h.a.t - 0.5) < 1e-9 && Math.abs(h.b.t - 0.5) < 1e-9);
});
test("parallel and overlapping segments do not count", () => {
  assert.equal(X.findIntersections([[P(0, 0), P(10, 0)], [P(2, 0), P(8, 0)], [P(0, 1), P(10, 1)]]).points.length, 0);
});
test("joints of a path are not crossings; touching end to end is counted only with countEnds", () => {
  const zig = [P(0, 0), P(10, 0), P(10, 10), P(0, 10)];
  assert.equal(X.findIntersections([zig]).points.length, 0);
  const touch = [[P(0, 0), P(10, 0)], [P(5, 0), P(5, 10)]];               // a T: touches at (5, 0)
  assert.equal(X.findIntersections(touch).points.length, 0);
  assert.equal(X.findIntersections(touch, { countEnds: true }).points.length, 1);
});
test("a closed figure-eight: one crossing; the closing segment wraps for neighbour skip", () => {
  const eight = [P(0, 0), P(10, 10), P(10, 0), P(0, 10)];
  assert.equal(X.findIntersections([eight], { closed: true }).points.length, 1);
  assert.equal(X.findIntersections([eight], { closed: false }).points.length, 1);
});
test("mode: self only, between only, both", () => {
  const eight = [P(0, 0), P(10, 10), P(10, 0), P(0, 10)];
  const bar = [P(-5, 5), P(15, 5)];
  assert.equal(X.findIntersections([eight, bar], { mode: "self" }).points.length, 1);
  assert.equal(X.findIntersections([eight, bar], { mode: "between", mergeDistance: 0 }).points.length, 3);   // two at the same spot
  assert.equal(X.findIntersections([eight, bar], { mode: "between" }).points.length, 2);                      // merged into one
  assert.equal(X.findIntersections([eight, bar], { mode: "both", mergeDistance: 0 }).points.length, 4);
});
test("merge distance: two crossings closer than it become one", () => {
  const paths = [[P(0, 0), P(10, 0)], [P(5, -1), P(5, 1)], [P(5.2, -1), P(5.2, 1)]];
  assert.equal(X.findIntersections(paths, { mergeDistance: 0 }).points.length, 2);
  assert.equal(X.findIntersections(paths, { mergeDistance: 0.5 }).points.length, 1);
});
test("maxCount and timeLimit stop the search with a note, keeping what was found", () => {
  const pts = [];
  for (let i = 0; i < 4000; i++) { const t = i / 4000 * 2 * Math.PI * 5; pts.push(P(300 + 250 * Math.sin(3 * t), 300 + 250 * Math.sin(4.02 * t))); }
  const capped = X.findIntersections([pts], { maxCount: 10 });
  assert.equal(capped.points.length, 10);
  assert.match(capped.notes[0], /Stopped at 10 crossings/);
  const timed = X.findIntersections([pts], { timeLimit: -1, mergeDistance: 0 });
  assert.match(timed.notes[0] || "", /Stopped after/);
});
test("nothing is refused: empty paths, one point, one segment", () => {
  assert.deepEqual(X.findIntersections([]).points, []);
  assert.deepEqual(X.findIntersections([[P(1, 1)]]).points, []);
  assert.deepEqual(X.findIntersections([[P(1, 1), P(2, 2)]]).points, []);
});

console.log((process.exitCode ? "FAILED. " : "") + passed + " intersection tests passed.");
