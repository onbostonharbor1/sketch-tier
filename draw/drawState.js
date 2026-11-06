// drawState.js
// ===========================================================
// Canvas setup and global context getter
// ===========================================================
//
// Window globals declared here (set below or elsewhere; read by name):
//   window.drawCanvas   the shared canvas element       (set below)
//   window.drawCtx      its 2d context                  (set below, resetCanvas)
//   window.ctx          getter: active layer ctx, else drawCtx (set below)
//   window.drawRegistry draw objects by id    (drawRegistry/drawRegistry.js)
//   window.armInteractor, window.disarmInteractor
//                       canvas point dragging           (ui/interactor.js)
// Gallery scripts use drawCanvas and armInteractor as bare names.
// ===========================================================

export let drawState = {
  title: "",
  // Initial defaults; these will be updated by Tools or setup
  canvasWidth: 800,
  canvasHeight: 800,
  debug: false,
  final: false,
  pts: [],
  ctr: 0,
  // Layer transform (Figures, Phase 7b; see draw/drawTransform.js). Both are
  // null except while a figure layer is drawing.
  transform: null,   // { angle, tx, ty } turning object space into canvas space
  bounds: null,      // { minX, minY, maxX, maxY } of what was drawn, object space
  // Print aids (Figures, Phase 9): while a figure layer draws, the canvas
  // position of every stitch end is pushed here, so a figure without discs
  // can still be printed as nails. Null except while a figure layer draws.
  collect: null,
  // Stepping view (Tier A step 2, ui/draw/drawStep.js): null, or
  // { limit, count, lines, box, redraw, activeLayer, onlyActive, counting,
  // layer }. While set (and counting is not false), drawLine counts every line, draws
  // only the first `limit`, marks line number `limit`, and records each
  // line it is asked for in `lines`.
  step: null,
  // Time limit (6 November 2026): a drawing that runs longer than timeLimit
  // milliseconds is stopped with a message, keeping what it drew, instead of
  // freezing the page. deadline is set by startClock() at the choke points
  // (the Draw redraw, each figure layer, the script runner) and is null
  // otherwise; clockWhat names what is drawing; clockCalls counts drawing
  // calls since the clock started (the clock is read every 256 of them).
  timeLimit: 2000,
  deadline: null,
  clockWhat: "",
  clockCalls: 0
};

// The starting values of every field above, kept so each script run can
// begin from them. Taken once, when this file loads.
const DRAW_STATE_START = JSON.parse(JSON.stringify(drawState));

/**
 * resetDrawStateForScript()
 * Puts drawState back to its starting values before a pattern or gallery
 * script runs, so nothing one script leaves behind reaches the next:
 * the point list (pts) and number counter (ctr) start empty and at 0,
 * final, transform and bounds are cleared, and any field a script added
 * is removed. The canvas size is kept (Utilities sets it on purpose).
 * Without this, scripts that number points through createPrintNodes
 * failed after a script that left points behind (v1-finish item 3).
 */
export function resetDrawStateForScript() {
  const keepW = drawState.canvasWidth;
  const keepH = drawState.canvasHeight;
  for (const key of Object.keys(drawState)) {
    if (!(key in DRAW_STATE_START)) delete drawState[key];
  }
  Object.assign(drawState, JSON.parse(JSON.stringify(DRAW_STATE_START)));
  drawState.canvasWidth  = keepW;
  drawState.canvasHeight = keepH;
}

/**
 * resetCanvas()
 * Clears the bitmap and resets the context state.
 * Uses drawState as the source of truth for dimensions.
 */
export function resetCanvas() {
  const canvas = window.drawCanvas;
  if (!canvas) throw new Error("resetCanvas: window.drawCanvas missing");

  // CRITICAL: Pull dimensions from drawState, NOT hardcoded values
  const w = drawState.canvasWidth;
  const h = drawState.canvasHeight;

  // Resizing the canvas object clears the bitmap and resets state
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("resetCanvas: getContext('2d') returned null");

  window.drawCtx = ctx;

  // Known background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
}

/**
 * setupCanvas() - IIFE
 * Initializes or retrieves the shared canvas.
 */
(function setupCanvas() {
  const CANVAS_ID = "sharedCanvas";
  const canvasHostId = "sketchpad";

  let canvas = document.getElementById(CANVAS_ID);

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = CANVAS_ID;

    // Set initial physical size from drawState defaults
    canvas.width = drawState.canvasWidth;
    canvas.height = drawState.canvasHeight;

    const host = document.getElementById(canvasHostId);
    if (host) {
      host.appendChild(canvas);
    } else {
      document.body.appendChild(canvas);
    }
  } else {
    // If canvas already exists, sync drawState to its current reality
    drawState.canvasWidth = canvas.width;
    drawState.canvasHeight = canvas.height;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("setupCanvas: getContext('2d') returned null");

  window.drawCanvas = canvas;
  window.drawCtx = ctx;
})();

// Global ctx getter logic remains the same
Object.defineProperty(window, "ctx", {
  get() {
    const layer = window.CanvasManager?.getLayer?.();
    if (layer?.ctx) return layer.ctx;
    if (window.drawCtx) return window.drawCtx;
    if (typeof gl === "object" && gl.ctx) return gl.ctx;
    return null;
  },
  configurable: true
});


/* ============================================================
   The time limit (6 November 2026)
   ------------------------------------------------------------
   A timer cannot interrupt code that is running, so a drawing stuck in a
   long loop is stopped from inside: every drawing call (drawLine, and the
   canvas's own lineTo, arc, stroke and fill, for scripts that draw on the
   canvas directly) calls checkClock(), which throws once the deadline has
   passed. The error is caught where errors are caught already and shown
   in the red bar; what was drawn stays on the canvas. A loop that never
   draws is not stopped by this.
   ============================================================ */

/* startClock: the drawing named by what may run for drawState.timeLimit
   milliseconds from now. */
export function startClock(what) {
  drawState.deadline   = performance.now() + drawState.timeLimit;
  drawState.clockWhat  = what || "the drawing";
  drawState.clockCalls = 0;
} // end startClock

/* stopClock: the drawing has finished; no limit applies until the next start. */
export function stopClock() {
  drawState.deadline = null;
} // end stopClock

/* checkClock: throws if the drawing has run past its deadline. Reads the
   clock only every 256 calls, so it costs almost nothing. */
export function checkClock() {
  if (drawState.deadline === null || drawState.deadline === undefined) return;
  drawState.clockCalls++;
  if (drawState.clockCalls % 256 !== 0) return;
  if (performance.now() <= drawState.deadline) return;
  const what = drawState.clockWhat, calls = drawState.clockCalls;
  drawState.deadline = null;                     // stop once; whatever draws next is not stopped again
  throw new Error("Drawing stopped: " + what + " ran longer than " + (drawState.timeLimit / 1000) +
                  " s (about " + calls + " drawing calls). What was drawn is kept. To allow longer, raise drawState.timeLimit.");
} // end checkClock

/* The canvas's own drawing calls check the clock too, so scripts that call
   ctx.lineTo, ctx.arc, ctx.stroke or ctx.fill directly are covered. Each is
   wrapped once: the original runs unchanged after the check. */
(function wrapCanvasCalls() {
  const proto = window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype;
  if (!proto || proto.__sketchpadClock) return;
  for (const name of ["lineTo", "arc", "stroke", "fill"]) {
    const original = proto[name];
    proto[name] = function (...args) { checkClock(); return original.apply(this, args); };
  }
  proto.__sketchpadClock = true;
})();

