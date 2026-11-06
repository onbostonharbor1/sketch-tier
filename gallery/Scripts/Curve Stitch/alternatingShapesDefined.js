/* ============================================================
   Alternating Shapes, each defined (Barry, 6 November 2026)
   ============================================================
   The grid of alternatingShapes.js, but each of the two shapes is yours
   to define: its kind (star, circle, petals, diamond), steps (points
   round a circle), skip (circles only), size (1: tip to tip; less:
   shrunk toward the centre), colour and line. The second shape can be
   the same kind as the first with other settings, a variation of it:
   a star at size 0.6, say, between full stars.

   Grid, tips, handles and alternation come from alternatingShapes.js.
   ============================================================ */
import { StringThing } from "/classes/classes.js";
import { cellTips, cellOrder, drawShape, keepTips, SHAPES } from "./alternatingShapes.js";


export const scriptInfo = {
  title: "Alternating Shapes, each defined",
  interactive: true,

  params: {
    cols: 5, rows: 4, width: 90, height: 90, scale: 1, alternate: "chequer",
    aKind: "star",   aSteps: 15, aSkip: 1,  aSize: 1,   aColor: "#0044cc", aLine: 1,
    bKind: "star",   bSteps: 10, bSkip: 1,  bSize: 0.6, bColor: "#aa5500", bLine: 1,
    points: []
  },

  controls: {
    cols:      { widget: "range", label: "Columns",       min: 1,   max: 10,  step: 1 },
    rows:      { widget: "range", label: "Rows",          min: 1,   max: 10,  step: 1 },
    width:     { widget: "range", label: "Width",         min: 20,  max: 300, step: 1 },
    height:    { widget: "range", label: "Height",        min: 20,  max: 300, step: 1 },
    scale:     { widget: "range", label: "Scale",         min: 0.5, max: 2,   step: 0.05 },
    alternate: { widget: "select", label: "Alternate",    options: ["chequer", "rows", "columns", "first"] },
    aKind:     { widget: "select", label: "First shape",  options: SHAPES },
    aSteps:    { widget: "range", label: "First steps",   min: 3,   max: 120, step: 1 },
    aSkip:     { widget: "range", label: "First skip",    min: 1,   max: 60,  step: 1 },
    aSize:     { widget: "range", label: "First size",    min: 0.1, max: 1.5, step: 0.05 },
    aColor:    { widget: "color", label: "First colour" },
    aLine:     { widget: "range", label: "First line",    min: 0.25, max: 6,  step: 0.25 },
    bKind:     { widget: "select", label: "Second shape", options: SHAPES },
    bSteps:    { widget: "range", label: "Second steps",  min: 3,   max: 120, step: 1 },
    bSkip:     { widget: "range", label: "Second skip",   min: 1,   max: 60,  step: 1 },
    bSize:     { widget: "range", label: "Second size",   min: 0.1, max: 1.5, step: 0.05 },
    bColor:    { widget: "color", label: "Second colour" },
    bLine:     { widget: "range", label: "Second line",   min: 0.25, max: 6,  step: 0.25 },
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

  /* update: keep the tips up to date. */
  update(params) {
    keepTips(this, params);
  },

  /* draw: every cell, with the first or second shape by its place. */
  draw() {
    const p = this.params;
    const a = { kind: p.aKind, steps: p.aSteps, skip: p.aSkip, size: p.aSize, color: p.aColor, lineWidth: p.aLine };
    const b = { kind: p.bKind, steps: p.bSteps, skip: p.bSkip, size: p.bSize, color: p.bColor, lineWidth: p.bLine };
    for (let r = 0; r < p.rows; r++)
      for (let c = 0; c < p.cols; c++) drawShape(cellTips(p, r, c), cellOrder(p.alternate, r, c) === 0 ? a : b);
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
