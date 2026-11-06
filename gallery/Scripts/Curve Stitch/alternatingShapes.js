/* ============================================================
   Alternating Shapes (Barry, 6 November 2026)
   ============================================================
   A grid of cells in which two shapes alternate like a chequerboard: the
   top row starts with the joined-parabola star (the shape of Joined
   Parabolas), then a circle, then the star again; the next row starts
   with a circle.

   Each cell is set by four tips: left, top, right, bottom. A tip on an
   inside edge is shared by the two cells either side of it, and every
   tip is a handle, so one drag reshapes two neighbours at once, as in
   manyRowsColumns.js.

     Star    four corner stitches, from tip to tip with their apex at the
             cell's centre (the four-pointed star of Joined Parabolas).
     Circle  a closed curve through the four tips, stitched with chords
             (each point to the point Skip further round).

   Width, Height and Scale stretch the tips (drags survive); a new Columns
   or Rows, or Reset, makes them afresh.

   Exports for alternatingShapesDefined.js: seedTips, cellTips,
   cellOrder, roundPoints, SHAPES, drawShape, stretchTips.
   ============================================================ */
import { StringThing }   from "/classes/classes.js";
import { drawPairs }     from "/draw/drawUtilities.js";
import { corner, chords, pairwise } from "/draw/connectors.js";
import { armInteractor } from "/ui/interactor.js";

const X0 = 120, Y0 = 100;            // the grid's top-left corner when made afresh

export const SHAPES = ["star", "circle", "petals", "diamond"];


/* seedTips: params.points made afresh. First the tips on the horizontal
   edges, row by row ((rows+1) lines of cols tips), then the tips on the
   vertical edges (rows lines of cols+1 tips). Changed in place, so the
   interactor's reference to the array stays good. */
export function seedTips(params) {
  const C = params.cols, R = params.rows;
  const w = params.width * params.scale, h = params.height * params.scale;
  params.points.length = 0;
  for (let r = 0; r <= R; r++)
    for (let c = 0; c < C; c++) params.points.push({ x: X0 + (c + 0.5) * w, y: Y0 + r * h });
  for (let r = 0; r < R; r++)
    for (let c = 0; c <= C; c++) params.points.push({ x: X0 + c * w, y: Y0 + (r + 0.5) * h });
} // end seedTips


/* stretchTips: every tip moved so the cell size goes from (oldW, oldH) to
   (newW, newH), measured from the grid's top-left corner. */
export function stretchTips(points, oldW, oldH, newW, newH) {
  if (!oldW || !oldH) return;
  for (const p of points) {
    p.x = X0 + (p.x - X0) * newW / oldW;
    p.y = Y0 + (p.y - Y0) * newH / oldH;
  }
} // end stretchTips


/* cellTips: the four tips of cell (r, c) and its centre (their average). */
export function cellTips(params, r, c) {
  const C = params.cols, v = params.points;
  const vStart = (params.rows + 1) * C;
  const top = v[r * C + c], bottom = v[(r + 1) * C + c];
  const left = v[vStart + r * (C + 1) + c], right = v[vStart + r * (C + 1) + c + 1];
  const centre = { x: (top.x + bottom.x + left.x + right.x) / 4, y: (top.y + bottom.y + left.y + right.y) / 4 };
  return { left, top, right, bottom, centre };
} // end cellTips


/* cellOrder: which shape, 0 (first) or 1 (second), cell (r, c) gets.
   chequer: alternating along a row, each row starting with the other;
   rows: whole rows alternate; columns: whole columns alternate; first: all first. */
export function cellOrder(alternate, r, c) {
  if (alternate === "rows")    return r % 2;
  if (alternate === "columns") return c % 2;
  if (alternate === "first")   return 0;
  return (r + c) % 2;
} // end cellOrder


/* roundPoints: n points on a closed curve through the four tips, starting
   at the right tip and going round. The curve follows the tips: drag one
   and that side of the circle stretches. size shrinks it toward the centre. */
export function roundPoints(t, n, size = 1) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = 2 * Math.PI * i / n, cs = Math.cos(a), sn = Math.sin(a);
    const side = cs >= 0 ? t.right : t.left, updown = sn >= 0 ? t.bottom : t.top;
    pts.push({
      x: t.centre.x + size * (Math.abs(cs) * (side.x - t.centre.x) + Math.abs(sn) * (updown.x - t.centre.x)),
      y: t.centre.y + size * (Math.abs(cs) * (side.y - t.centre.y) + Math.abs(sn) * (updown.y - t.centre.y))
    });
  }
  return pts;
} // end roundPoints


/* toward: point p moved fraction f of the way to the centre q. */
function toward(p, q, f) {
  return { x: p.x + (q.x - p.x) * f, y: p.y + (q.y - p.y) * f };
} // end toward


/* shapePairs: the stitch lines of one shape in one cell. s holds the
   shape's settings: kind, steps, skip, size (1: tips to tips; less: shrunk
   toward the centre).
     star     corner stitches tip to tip, apex at the centre
     circle   chords round a closed curve through the tips
     petals   corner stitches tip to tip, apex out at the cell's corner
              (the star turned inside out: a curved square)
     diamond  the four edges tip to tip, each stitched to the opposite edge */
function shapePairs(t, s) {
  const f = 1 - s.size;
  const L = toward(t.left, t.centre, f), T = toward(t.top, t.centre, f);
  const Rt = toward(t.right, t.centre, f), B = toward(t.bottom, t.centre, f);
  const c = t.centre, n = Math.max(3, Math.round(s.steps));
  if (s.kind === "circle") return chords(roundPoints(t, n, s.size), { skip: Math.max(1, Math.round(s.skip)) });
  if (s.kind === "petals") {
    const out = [L, T, Rt, B], pairs = [];
    for (let i = 0; i < 4; i++) {
      const a = out[i], b = out[(i + 1) % 4];
      const apex = { x: a.x + b.x - c.x, y: a.y + b.y - c.y };   // the cell corner opposite the centre
      pairs.push(...corner(a, apex, b, n));
    }
    return pairs;
  }
  if (s.kind === "diamond") {
    const line = (a, b) => Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n }));
    return [...pairwise(line(L, T), line(B, Rt)), ...pairwise(line(T, Rt), line(L, B))];
  }
  return [...corner(L, c, T, n), ...corner(T, c, Rt, n), ...corner(Rt, c, B, n), ...corner(B, c, L, n)];
} // end shapePairs


/* drawShape: one shape in one cell, in its colour. */
export function drawShape(t, s) {
  drawPairs(shapePairs(t, s), s.color, s.lineWidth);
} // end drawShape


/* keepTips: the update step both versions share: a new Columns or Rows,
   or a Reset, makes the tips afresh; a new Width, Height or Scale stretches them. */
export function keepTips(info, params) {
  const s = info._state;
  const w = params.width * params.scale, h = params.height * params.scale;
  if (!s.seeded || params.cols !== s.C || params.rows !== s.R) {
    seedTips(params);
    Object.assign(s, { seeded: true, C: params.cols, R: params.rows });
    armInteractor(info);
  } else if (w !== s.w || h !== s.h) {
    stretchTips(params.points, s.w, s.h, w, h);
  }
  s.w = w; s.h = h;
} // end keepTips


export const scriptInfo = {
  title: "Alternating Shapes",
  interactive: true,

  params: {
    cols: 5, rows: 4, width: 90, height: 90, scale: 1, alternate: "chequer",
    steps: 15, circlePoints: 36, circleSkip: 11,
    color: "#0044cc", circleColor: "#aa5500", lineWidth: 1,
    points: []
  },

  controls: {
    cols:         { widget: "range", label: "Columns",       min: 1,   max: 10,  step: 1 },
    rows:         { widget: "range", label: "Rows",          min: 1,   max: 10,  step: 1 },
    width:        { widget: "range", label: "Width",         min: 20,  max: 300, step: 1 },
    height:       { widget: "range", label: "Height",        min: 20,  max: 300, step: 1 },
    scale:        { widget: "range", label: "Scale",         min: 0.5, max: 2,   step: 0.05 },
    alternate:    { widget: "select", label: "Alternate",    options: ["chequer", "rows", "columns", "first"] },
    steps:        { widget: "range", label: "Star steps",    min: 3,   max: 60,  step: 1 },
    circlePoints: { widget: "range", label: "Circle points", min: 6,   max: 120, step: 1 },
    circleSkip:   { widget: "range", label: "Circle skip",   min: 1,   max: 60,  step: 1 },
    color:        { widget: "color", label: "Star colour" },
    circleColor:  { widget: "color", label: "Circle colour" },
    lineWidth:    { widget: "range", label: "Line",          min: 0.25, max: 6,  step: 0.25 },
    reset: {
      widget: "button", label: "Reset", fullRow: true,
      action() {
        /* Make the tips afresh, losing any drags. */
        this._state.seeded = false;
        this.redrawHandler();
      }
    }
  },

  _state: { seeded: false, C: null, R: null, w: null, h: null },

  /* init: the settings object, and the tips if there are none yet. */
  init() {
    this.elements = { thing: new StringThing({ ...this.params }) };
    if (this.params.points.length === 0) this.update(this.params);
  },

  /* update: keep the tips up to date (see keepTips). */
  update(params) {
    keepTips(this, params);
  },

  /* draw: every cell, star or circle by its place. */
  draw() {
    const p = this.params;
    const star   = { kind: "star",   steps: p.steps, size: 1, color: p.color, lineWidth: p.lineWidth };
    const circle = { kind: "circle", steps: p.circlePoints, skip: p.circleSkip, size: 1, color: p.circleColor, lineWidth: p.lineWidth };
    for (let r = 0; r < p.rows; r++)
      for (let c = 0; c < p.cols; c++) drawShape(cellTips(p, r, c), cellOrder(p.alternate, r, c) === 0 ? star : circle);
  }
};

/* redrawHandler: clear the canvas, bring the tips up to date, draw. */
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
