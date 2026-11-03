/* draw/shapers.js
   ============================================================
   Shapers: things you can do to an array of points
   ============================================================
   A shaper takes an array of points and returns a new array. It never
   changes the array it was given and never draws. Points keep everything
   they carry: a Point stays a Point, and a z value (depth, for later)
   rides along untouched, because each moved point is a copy of the old
   one with only x and y changed.

   How they fit together: make points (linePoints, arcPoints, or any
   object's own arrays), rearrange or reshape them with these, then hand
   the result to a connector (draw/connectors.js), which pairs them up.
   For example:
       pairwise(part(A, 0, 10), reversed(B))
   Each step can be looked at on its own in the debugger.

   In StringThing's way, nothing is refused. A range past the end gives
   what exists; a step of 0 is treated as 1; an empty array gives an
   empty array.

   FUNCTIONS (alphabetical)
     arcPoints(c, r, fromDeg, toDeg, n)  n+1 points along an arc
     everyNth(pts, n, start)    every nth point, beginning at start
     linePoints(a, b, steps)    steps+1 points evenly from a to b
     mirrored(pts, a, b)        the points reflected across the line a-b
     moved(p, x, y)             a copy of p at x, y (keeps z and the class)
     part(pts, from, to)        points from index from up to (not including) to;
                                negative numbers count from the end
     resampled(pts, n)          n points evenly spaced by distance along the path
     reversed(pts)              the same points, last first
     rotated(pts, c, deg)       turned about c by deg degrees
     rotateStart(pts, k)        the same closed loop, starting at index k
     scaled(pts, c, k)          scaled about c by k
     simplified(pts, tol)       points that change nothing (within tol) dropped
     translated(pts, dx, dy)    moved by dx, dy
   ============================================================ */

const RAD = Math.PI / 180;


/* moved: a copy of point p at (x, y). Everything else p carries (its class,
   a z value, a name) is kept. Every shaper makes its points with this. */
export function moved(p, x, y) {
  return Object.assign(Object.create(Object.getPrototypeOf(p)), p, { x, y });
} // end moved


/* linePoints: steps+1 points evenly spaced from a to b, both ends included.
   The first point is a copy of a, so a's extra values (z) carry along. */
export function linePoints(a, b, steps = 10) {
  const n = Math.max(1, Math.round(steps));
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push(moved(a, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
  }
  return out;
} // end linePoints


/* arcPoints: n+1 points along a circular arc about centre c, radius r, from
   fromDeg to toDeg (degrees, clockwise on the canvas because y points down). */
export function arcPoints(c, r, fromDeg, toDeg, n = 10) {
  const steps = Math.max(1, Math.round(n));
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const a = (fromDeg + (toDeg - fromDeg) * i / steps) * RAD;
    out.push(moved(c, c.x + r * Math.cos(a), c.y + r * Math.sin(a)));
  }
  return out;
} // end arcPoints


/* reversed: the same points in the opposite order. */
export function reversed(pts) {
  return [...pts].reverse();
} // end reversed


/* part: the points from index `from` up to, but not including, index `to`.
   A negative index counts back from the end (-1 is the last point), as in
   JavaScript's slice. Past the end you get what exists. */
export function part(pts, from = 0, to = pts.length) {
  return pts.slice(from, to);
} // end part


/* everyNth: every nth point, beginning at index `start`. n below 1 counts as 1. */
export function everyNth(pts, n = 2, start = 0) {
  const step = Math.max(1, Math.round(n));
  const out = [];
  for (let i = start; i < pts.length; i += step) out.push(pts[i]);
  return out;
} // end everyNth


/* rotateStart: treat the points as a closed loop and start it at index k.
   k may be negative or larger than the length; it wraps. */
export function rotateStart(pts, k = 0) {
  const n = pts.length;
  if (n === 0) return [];
  const s = ((Math.round(k) % n) + n) % n;
  return pts.slice(s).concat(pts.slice(0, s));
} // end rotateStart


/* translated: every point moved by dx, dy. */
export function translated(pts, dx = 0, dy = 0) {
  return pts.map((p) => moved(p, p.x + dx, p.y + dy));
} // end translated


/* rotated: every point turned about centre c by deg degrees. */
export function rotated(pts, c, deg = 0) {
  const a = deg * RAD, cos = Math.cos(a), sin = Math.sin(a);
  return pts.map((p) => moved(p,
    c.x + (p.x - c.x) * cos - (p.y - c.y) * sin,
    c.y + (p.x - c.x) * sin + (p.y - c.y) * cos));
} // end rotated


/* scaled: every point moved toward or away from centre c by factor k. */
export function scaled(pts, c, k = 1) {
  return pts.map((p) => moved(p, c.x + (p.x - c.x) * k, c.y + (p.y - c.y) * k));
} // end scaled


/* mirrored: every point reflected across the line through a and b.
   If a and b are the same point, the points come back unchanged. */
export function mirrored(pts, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy;
  if (len2 === 0) return [...pts];
  return pts.map((p) => {
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;   // foot of the perpendicular
    const fx = a.x + t * dx, fy = a.y + t * dy;
    return moved(p, 2 * fx - p.x, 2 * fy - p.y);
  });
} // end mirrored


/* resampled: n points spaced evenly by distance along the path the points
   make (corner to corner, not closed). The first and last points are kept.
   Useful to give two arms the same number of points before stitching. */
export function resampled(pts, n = 10) {
  const count = Math.max(2, Math.round(n));
  if (pts.length < 2) return [...pts];

  // Running distance at each point.
  const at = [0];
  for (let i = 1; i < pts.length; i++) {
    at.push(at[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = at[at.length - 1];
  if (total === 0) return Array.from({ length: count }, () => pts[0]);

  // Walk along the path, placing a point every total/(count-1).
  const out = [];
  let seg = 1;
  for (let k = 0; k < count; k++) {
    const want = total * k / (count - 1);
    while (seg < pts.length - 1 && at[seg] < want) seg++;
    const a = pts[seg - 1], b = pts[seg];
    const len = at[seg] - at[seg - 1];
    const t = len === 0 ? 0 : (want - at[seg - 1]) / len;
    out.push(moved(a, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
  }
  return out;
} // end resampled


/* simplified: drop points that change nothing. A point is dropped when it
   lies within tol of the straight line joining the points either side of
   it (the Ramer-Douglas-Peucker method). The ends are always kept. */
export function simplified(pts, tol = 0.25) {
  if (pts.length < 3) return [...pts];
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  markFarthest(pts, 0, pts.length - 1, tol, keep);
  return pts.filter((p, i) => keep[i]);
} // end simplified


/* markFarthest: the working part of simplified. Between first and last,
   find the point farthest from the line first-last; if it is farther than
   tol, keep it and look again on each side of it. */
function markFarthest(pts, first, last, tol, keep) {
  const a = pts[first], b = pts[last];
  let far = -1, farDist = tol;
  for (let i = first + 1; i < last; i++) {
    const d = distanceToLine(pts[i], a, b);
    if (d > farDist) { far = i; farDist = d; }
  }
  if (far < 0) return;
  keep[far] = true;
  markFarthest(pts, first, far, tol, keep);
  markFarthest(pts, far, last, tol, keep);
} // end markFarthest


/* distanceToLine: how far p is from the line through a and b
   (from a itself if a and b are the same point). */
function distanceToLine(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  if (len === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  return Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / len;
} // end distanceToLine

// end shapers.js
