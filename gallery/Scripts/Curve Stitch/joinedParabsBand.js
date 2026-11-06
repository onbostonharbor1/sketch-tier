/* ============================================================
   Joined Parabolas with a band (version 1: a separate band)
   ============================================================
   Joined Parabolas v2 (from joinedParabs.js), with a band round it:
   a ring of stitching set a gap away from the lattice, with its own
   pattern, to focus the picture (Barry, 6 November 2026: a frame of
   string, with a mat between).

   THE LATTICE (as joinedParabs.js): alternating exterior rows (M points)
   and band rows (M-1 points, half way between); every point a handle;
   Type A corners (apex on the band row), Type B corners (apex on the
   exterior row) and the outer curves at the left and right ends.

   v2 FIXES (from the review of joinedParabs.js)
     1. Width, Height and Scale stretch the points you have dragged
        instead of throwing them away. Only Parabolas/Row and Rows (which
        change the number of points) start the lattice afresh.
     2. armInteractor is imported, not taken from a global.
     3. draw() only draws; clearing the canvas is done by the redraw
        (redrawHandler), so the drawing could later be a figure layer.
     4. Corners are built with corner() from draw/connectors.js and drawn
        with drawPairs: nothing is changed in place.

   THE BAND (this version)
     Driven: it follows the lattice's outer edge (its bounding box) plus
       Gap (the mat), so it grows, moves and stretches with the lattice.
     Rhythm: its points are spaced by the lattice's spacing divided by
       Band density (4: dx/4 across, dy/4 down), so they line up with the
       lattice's columns and rows.
     Band width: the distance from its inner edge to its outer edge.
     Pattern:
       ladder   each inner point joined straight out to its outer point
       slant    each inner point joined to the outer point Offset further on,
                along its own side (no line crosses a corner)
       crossed  slant both ways (a lattice of diamonds)
       corners  a corner stitch in each corner of the band only
     Band colour and Band steps (corner steps) are its own.

   joinedParabsBandLinked.js (version 2) adds relationships between the
   band and the lattice. It imports the functions exported here.

   Exports (for version 2): seedLattice, stretchLattice, buildTriplets,
   latticeBounds, latticePerimeter, latticeCorners, rectRing, bandPairs,
   drawLattice, BAND_PATTERNS.
   ============================================================ */
import { StringThing }   from "/classes/classes.js";
import { drawPairs }     from "/draw/drawUtilities.js";
import { corner, pairwise } from "/draw/connectors.js";
import { armInteractor } from "/ui/interactor.js";

const X0 = 140, Y0 = 120;            // the lattice's top-left point when it is made afresh

export const BAND_PATTERNS = ["ladder", "slant", "crossed", "corners"];


/* seedLattice: params.points made afresh: 2N-1 rows, exterior rows of M
   points and band rows of M-1, spaced dx across and dy down. The array is
   changed in place, so the interactor's reference to it stays good. */
export function seedLattice(params) {
  const M = params.numParabs, N = params.numRows;
  const dx = params.width * params.scale, dy = params.height * params.scale;
  params.points.length = 0;
  for (let row = 0; row < 2 * N - 1; row++) {
    const ext = row % 2 === 0;
    const count = ext ? M : M - 1;
    for (let j = 0; j < count; j++) {
      params.points.push({ x: X0 + (ext ? j * dx : (j + 0.5) * dx), y: Y0 + row * dy });
    }
  }
} // end seedLattice


/* stretchLattice: every point moved so the lattice's spacing goes from
   (oldDx, oldDy) to (newDx, newDy), measured from the first point. Dragged
   points keep their place relative to the others. */
export function stretchLattice(points, oldDx, oldDy, newDx, newDy) {
  if (!points.length || !oldDx || !oldDy) return;
  const o = { x: points[0].x, y: points[0].y };
  for (const p of points) {
    p.x = o.x + (p.x - o.x) * newDx / oldDx;
    p.y = o.y + (p.y - o.y) * newDy / oldDy;
  }
} // end stretchLattice


/* rowStarts: where each row begins in the flat points array. */
function rowStarts(M, N) {
  const starts = [];
  let at = 0;
  for (let row = 0; row < 2 * N - 1; row++) { starts.push(at); at += row % 2 === 0 ? M : M - 1; }
  return starts;
} // end rowStarts


/* buildTriplets: every corner of the lattice as [start, apex, end]
   (Type A, Type B and the two outer curves per pair of rows), exactly as
   joinedParabs.js builds them. */
export function buildTriplets(params) {
  const M = params.numParabs, N = params.numRows, v = params.points;
  const starts = rowStarts(M, N);
  const pt = (row, col) => v[starts[row] + col];
  const out = [];
  for (let i = 0; i < 2 * N - 2; i++) {
    const extRow  = i % 2 === 0 ? i : i + 1;
    const bandRow = i % 2 === 0 ? i + 1 : i;
    for (let j = 0; j < M - 1; j++) out.push([pt(extRow, j), pt(bandRow, j), pt(extRow, j + 1)]);       // Type A
    for (let j = 0; j < M - 2; j++) out.push([pt(bandRow, j), pt(extRow, j + 1), pt(bandRow, j + 1)]);  // Type B
    if (i % 2 === 0 && i + 2 <= 2 * N - 2) {                                                             // outer curves
      out.push([pt(i, 0), pt(bandRow, 0), pt(i + 2, 0)]);
      out.push([pt(i, M - 1), pt(bandRow, M - 2), pt(i + 2, M - 1)]);
    }
  }
  return out;
} // end buildTriplets


/* latticeBounds: the smallest box round every lattice point. */
export function latticeBounds(points) {
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
} // end latticeBounds


/* latticePerimeter: the lattice's outer points in order round it,
   clockwise from the top left: the top row, the right ends of the
   exterior rows, the bottom row backwards, the left ends upwards. */
export function latticePerimeter(params) {
  const M = params.numParabs, N = params.numRows, v = params.points;
  const starts = rowStarts(M, N);
  const pt = (row, col) => v[starts[row] + col];
  const last = 2 * N - 2;
  const out = [];
  for (let j = 0; j < M; j++) out.push(pt(0, j));
  for (let row = 2; row <= last; row += 2) out.push(pt(row, M - 1));
  for (let j = M - 2; j >= 0; j--) out.push(pt(last, j));
  for (let row = last - 2; row > 0; row -= 2) out.push(pt(row, 0));
  return out;
} // end latticePerimeter


/* latticeCorners: the lattice's four corner points: top left, top right,
   bottom right, bottom left. */
export function latticeCorners(params) {
  const M = params.numParabs, N = params.numRows, v = params.points;
  const starts = rowStarts(M, N);
  const last = 2 * N - 2;
  return [v[starts[0]], v[starts[0] + M - 1], v[starts[last] + M - 1], v[starts[last]]];
} // end latticeCorners


/* rectRing: points round a rectangle, clockwise from the top left. Each
   side gets counts[k] equal steps (counts: top, right, bottom, left), so
   two rings made with the same counts correspond point for point. Returns
   { pts, corners }: corners are the indexes of the four corner points. */
export function rectRing(x0, y0, x1, y1, counts) {
  const sides = [[{ x: x0, y: y0 }, { x: x1, y: y0 }], [{ x: x1, y: y0 }, { x: x1, y: y1 }],
                 [{ x: x1, y: y1 }, { x: x0, y: y1 }], [{ x: x0, y: y1 }, { x: x0, y: y0 }]];
  const pts = [], corners = [];
  sides.forEach(([a, b], k) => {
    corners.push(pts.length);
    const n = Math.max(1, counts[k]);
    for (let i = 0; i < n; i++) pts.push({ x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n });
  });
  return { pts, corners };
} // end rectRing


/* bandRings: the band's inner and outer rings round the lattice: Gap out
   from the lattice's box, then Band width further. Points are spaced by
   the lattice spacing divided by Band density (the rhythm: 2 puts a band
   point at every lattice column and half column), the same counts for
   both rings. */
export function bandRings(params) {
  const b = latticeBounds(params.points);
  const g = params.gap, w = params.bandWidth;
  const per = Math.max(1, Math.round(params.bandDensity || 2));
  const sx = Math.max(3, params.width * params.scale / per), sy = Math.max(3, params.height * params.scale / per);
  const ix0 = b.minX - g, iy0 = b.minY - g, ix1 = b.maxX + g, iy1 = b.maxY + g;
  const across = Math.max(1, Math.round((ix1 - ix0) / sx)), down = Math.max(1, Math.round((iy1 - iy0) / sy));
  const counts = [across, down, across, down];
  return { inner: rectRing(ix0, iy0, ix1, iy1, counts), outer: rectRing(ix0 - w, iy0 - w, ix1 + w, iy1 + w, counts) };
} // end bandRings


/* bandPairs: the band's lines for one of BAND_PATTERNS. */
/* sidePairs: inner point i joined to outer point i+k, but only where both
   lie on the same side of the band, so no line cuts across a corner. */
function sidePairs(rings, k) {
  const inn = rings.inner.pts, out = rings.outer.pts, c = rings.inner.corners, n = inn.length;
  const pairs = [];
  for (let s = 0; s < 4; s++) {
    const start = c[s], end = s < 3 ? c[s + 1] : n;
    for (let i = start; i <= end; i++) {
      const j = i + k;
      if (j >= start && j <= end) pairs.push([inn[i % n], out[j % n]]);
    }
  }
  return pairs;
} // end sidePairs


export function bandPairs(params, rings) {
  const { inner, outer } = rings;
  const k = Math.round(params.bandOffset);
  if (params.bandPattern === "ladder")  return pairwise(inner.pts, outer.pts);
  if (params.bandPattern === "slant")   return sidePairs(rings, k);
  if (params.bandPattern === "crossed") return [...sidePairs(rings, k), ...sidePairs(rings, -k)];
  // corners: a corner stitch at each corner of the band, arms along the outer edges
  const out = [], n = outer.pts.length, reach = Math.max(1, k);
  for (const c of outer.corners) {
    const a = outer.pts[(c - reach + n) % n], b = outer.pts[(c + reach) % n];
    out.push(...corner(a, outer.pts[c], b, params.bandSteps));
  }
  return out;
} // end bandPairs


/* drawLattice: every corner of the lattice, stitched, in the lattice colour. */
export function drawLattice(params) {
  for (const [a, apex, b] of buildTriplets(params)) drawPairs(corner(a, apex, b, params.numSteps), params.color, params.lineWidth);
} // end drawLattice


export const scriptInfo = {
  title: "Joined Parabolas with a band",
  interactive: true,

  params: {
    numParabs: 4, numRows: 3, width: 90, height: 90, scale: 1, numSteps: 15,
    color: "#0044cc", lineWidth: 1,
    gap: 40, bandWidth: 40, bandPattern: "slant", bandOffset: 3, bandDensity: 4, bandSteps: 12,
    bandColor: "#aa5500", bandLineWidth: 1,
    points: []
  },

  controls: {
    numParabs:     { widget: "range", label: "Parabolas/Row", min: 2,   max: 8,   step: 1 },
    numRows:       { widget: "range", label: "Rows",          min: 1,   max: 6,   step: 1 },
    width:         { widget: "range", label: "Width",         min: 20,  max: 300, step: 1 },
    height:        { widget: "range", label: "Height",        min: 20,  max: 300, step: 1 },
    scale:         { widget: "range", label: "Scale",         min: 0.5, max: 2,   step: 0.05 },
    numSteps:      { widget: "range", label: "Steps",         min: 3,   max: 80,  step: 1 },
    lineWidth:     { widget: "range", label: "Line",          min: 0.25, max: 6,  step: 0.25 },
    color:         { widget: "color", label: "Color" },
    gap:           { widget: "range", label: "Gap (mat)",     min: 0,   max: 200, step: 1 },
    bandWidth:     { widget: "range", label: "Band width",    min: 5,   max: 200, step: 1 },
    bandPattern:   { widget: "select", label: "Band pattern", options: BAND_PATTERNS },
    bandOffset:    { widget: "range", label: "Band offset",   min: 0,   max: 20,  step: 1 },
    bandDensity:   { widget: "range", label: "Band density",  min: 1,   max: 8,   step: 1 },
    bandSteps:     { widget: "range", label: "Band steps",    min: 3,   max: 60,  step: 1 },
    bandColor:     { widget: "color", label: "Band colour" },
    bandLineWidth: { widget: "range", label: "Band line",     min: 0.25, max: 6,  step: 0.25 },
    reset: {
      widget: "button", label: "Reset", fullRow: true,
      action() {
        /* Make the lattice afresh, losing any drags. */
        this._state.seeded = false;
        this.redrawHandler();
      }
    }
  },

  _state: { seeded: false, M: null, N: null, dx: null, dy: null },

  /* init: the settings object, and the lattice if it has no points yet. */
  init() {
    this.elements = { thing: new StringThing({ ...this.params }) };
    if (this.params.points.length === 0) this.update(this.params);
  },

  /* update: a new number of points (M or N) or a Reset makes the lattice
     afresh; a new Width, Height or Scale stretches the points as they are. */
  update(params) {
    const s = this._state;
    const dx = params.width * params.scale, dy = params.height * params.scale;
    if (!s.seeded || params.numParabs !== s.M || params.numRows !== s.N) {
      seedLattice(params);
      Object.assign(s, { seeded: true, M: params.numParabs, N: params.numRows });
      armInteractor(this);
    } else if (dx !== s.dx || dy !== s.dy) {
      stretchLattice(params.points, s.dx, s.dy, dx, dy);
    }
    s.dx = dx; s.dy = dy;
  },

  /* draw: the band first (behind), then the lattice. Draws only; the
     redraw clears the canvas. */
  draw() {
    const p = this.params;
    drawPairs(bandPairs(p, bandRings(p)), p.bandColor, p.bandLineWidth);
    drawLattice(p);
  }
};

/* redrawHandler: clear the canvas, bring the lattice up to date, draw. */
scriptInfo.redrawHandler = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  scriptInfo.update(scriptInfo.params);
  scriptInfo.draw();
};

/* runPattern: the entry point the script runner calls. */
export function runPattern() {
  scriptInfo.init();
  scriptInfo.redrawHandler();
}
