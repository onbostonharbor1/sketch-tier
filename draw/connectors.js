/* draw/connectors.js
   ============================================================
   Connectors: ways of stitching
   ============================================================
   A connector takes one or two arrays of points and returns the lines to
   draw, as pairs [a, b]. It never draws and never changes its arrays.
   Draw the result with drawPairs (draw/drawUtilities.js), which sends
   every line through drawLine, so Final mode, figure transforms and the
   print aids see them.

   A connector knows nothing about reversing, ranges or every-nth: those
   are shapers (draw/shapers.js), applied to the arrays first. So a rule
   reads as one line, for example
       pairwise(part(A, 0, 10), reversed(B), { offset: 2 })
   and when it is wrong, you look at each array, then at the pairs.

   Nothing is refused (Barry: "try to always do something; let me see
   something bad"). Unequal arms are joined as far as the shorter one goes,
   or spread across the longer with { spread: true }. Odd settings draw
   whatever they draw.

   FUNCTIONS (alphabetical)
     allPairs(pts)               every pair once (the Mystic Rose)
     chords(pts, s)              point i to point i+skip within one array
                                 s: skip (1), wrap (true)
     corner(a, c, b, steps)      the classic curve stitch: arm a->c joined to arm c->b
     growingChords(pts, s)       point i to point i + skip0 + i*grow, round a loop
                                 s: skip0 (30), grow (0.4)
     mesh(rows)                  each point to its right and lower neighbours in a grid
                                 (rows is an array of arrays)
     pairwise(A, B, s)           point i of A to point i+offset of B
                                 s: offset (0), wrap (false), spread (false)
     polyline(pts, s)            consecutive points; s.close joins the ends
     timesTable(pts, s)          point i to point (i*factor) mod n; s: factor (2),
                                 may be negative or fractional
   ============================================================ */

import { linePoints } from "./shapers.js";


/* pairwise: point i of A joined to point i+offset of B.

   s.offset  shifts which point of B each point of A joins (default 0).
   s.wrap    an offset past either end of B wraps round to the other end
             instead of stopping (default false).
   s.spread  when A and B have different lengths, spread the shorter one
             across the longer, so the stitching covers both whole arms
             (default false: stop where the shorter arm ends). */
export function pairwise(A, B, s = {}) {
  const { offset = 0, wrap = false, spread = false } = s;
  const pairs = [];
  if (A.length === 0 || B.length === 0) return pairs;

  if (spread && A.length !== B.length) {
    // Walk the longer arm; take the matching fraction of the shorter one.
    const longer = A.length >= B.length ? A : B;
    const shorter = longer === A ? B : A;
    for (let i = 0; i < longer.length; i++) {
      const j = Math.round(i * (shorter.length - 1) / Math.max(1, longer.length - 1));
      pairs.push(longer === A ? [A[i], shorter[j]] : [shorter[j], B[i]]);
    }
    return pairs;
  }

  for (let i = 0; i < A.length; i++) {
    let j = i + offset;
    if (wrap) j = ((j % B.length) + B.length) % B.length;
    if (j < 0 || j >= B.length) continue;       // past an end of B: nothing to join
    pairs.push([A[i], B[j]]);
  }
  return pairs;
} // end pairwise


/* corner: the curve stitch most used in the ideabook. The arm from a to the
   corner c and the arm from c to b, each with steps+1 points, joined point
   for point: a to c's first, ..., so the lines envelope a curve in the corner. */
export function corner(a, c, b, steps = 12) {
  return pairwise(linePoints(a, c, steps), linePoints(c, b, steps));
} // end corner


/* chords: within one array, point i joined to point i+skip.
   s.skip  how far ahead each line reaches (default 1: neighbours).
   s.wrap  treat the array as a closed loop (default true); if false, lines
           that would reach past the end are left out. */
export function chords(pts, s = {}) {
  const { skip = 1, wrap = true } = s;
  const n = pts.length, pairs = [];
  for (let i = 0; i < n; i++) {
    let j = i + Math.round(skip);
    if (wrap) j = ((j % n) + n) % n;
    if (j < 0 || j >= n) continue;
    pairs.push([pts[i], pts[j]]);
  }
  return pairs;
} // end chords


/* growingChords: round a loop, point i joined to point i + skip0 + i*grow.
   The reach grows as the lines go round, so the envelope curls: the
   teardrops and spirals of many circle boards. */
export function growingChords(pts, s = {}) {
  const { skip0 = 30, grow = 0.4 } = s;
  const n = pts.length, pairs = [];
  for (let i = 0; i < n; i++) {
    const j = ((Math.round(i + skip0 + i * grow) % n) + n) % n;
    pairs.push([pts[i], pts[j]]);
  }
  return pairs;
} // end growingChords


/* timesTable: round a loop of n points, point i joined to point (i*factor)
   mod n. Factor 2 gives a cardioid, 3 a nephroid. Negative and fractional
   factors are allowed; a point joined to itself is left out. */
export function timesTable(pts, s = {}) {
  const { factor = 2 } = s;
  const n = pts.length, pairs = [];
  for (let i = 0; i < n; i++) {
    const j = ((Math.round(i * factor) % n) + n) % n;
    if (j !== i) pairs.push([pts[i], pts[j]]);
  }
  return pairs;
} // end timesTable


/* allPairs: every point joined to every other, each pair once. */
export function allPairs(pts) {
  const pairs = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) pairs.push([pts[i], pts[j]]);
  }
  return pairs;
} // end allPairs


/* polyline: each point joined to the next. s.close also joins the last
   point to the first (only when there are more than two). */
export function polyline(pts, s = {}) {
  const pairs = [];
  for (let i = 0; i + 1 < pts.length; i++) pairs.push([pts[i], pts[i + 1]]);
  if (s.close && pts.length > 2) pairs.push([pts[pts.length - 1], pts[0]]);
  return pairs;
} // end polyline


/* mesh: a grid given as rows (an array of arrays of points). Each point is
   joined to the next point in its row and the point below it in the next
   row. Rows of different lengths join as far as both go. */
export function mesh(rows) {
  const pairs = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r], below = rows[r + 1];
    for (let i = 0; i < row.length; i++) {
      if (i + 1 < row.length) pairs.push([row[i], row[i + 1]]);
      if (below && i < below.length) pairs.push([row[i], below[i]]);
    }
  }
  return pairs;
} // end mesh

// end connectors.js
