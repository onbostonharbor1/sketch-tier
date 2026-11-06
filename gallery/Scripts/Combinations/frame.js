/* ============================================================
   Frame: a rectangular band of string, on its own
   ============================================================
   The band of joinedParabsBand.js without the lattice: an inner and an
   outer rectangle, Band width apart, with points every Spacing along
   each side, stitched in one of the band patterns (ladder, slant,
   crossed, corners). Its place and size are its own settings; it knows
   nothing of anything else on the canvas.

   Made for combinations (Combinations/lib/combine.js): a frame round another
   script. It runs on its own too. No handles.
   ============================================================ */
import { drawPairs } from "/draw/drawUtilities.js";
import { rectRing, bandPairs, BAND_PATTERNS } from "../Curve Stitch/joinedParabsBand.js";


/* frameRings: the inner and outer rings from the settings. */
function frameRings(p) {
  const x0 = p.frameLeft, y0 = p.frameTop, x1 = x0 + p.frameWidth, y1 = y0 + p.frameHeight;
  const across = Math.max(1, Math.round(p.frameWidth / p.spacing)), down = Math.max(1, Math.round(p.frameHeight / p.spacing));
  const counts = [across, down, across, down];
  const w = p.bandWidth;
  return { inner: rectRing(x0, y0, x1, y1, counts), outer: rectRing(x0 - w, y0 - w, x1 + w, y1 + w, counts) };
} // end frameRings


export const scriptInfo = {
  title: "Frame",

  params: {
    frameLeft: 90, frameTop: 70, frameWidth: 510, frameHeight: 420, bandWidth: 40, spacing: 22,
    bandPattern: "slant", bandOffset: 3, bandSteps: 12, bandColor: "#aa5500", bandLineWidth: 1
  },

  controls: {
    frameLeft:     { widget: "range", label: "Left",          min: 0,   max: 600, step: 1 },
    frameTop:      { widget: "range", label: "Top",           min: 0,   max: 600, step: 1 },
    frameWidth:    { widget: "range", label: "Width",         min: 50,  max: 900, step: 1 },
    frameHeight:   { widget: "range", label: "Height",        min: 50,  max: 900, step: 1 },
    bandWidth:     { widget: "range", label: "Band width",    min: 5,   max: 200, step: 1 },
    spacing:       { widget: "range", label: "Spacing",       min: 4,   max: 100, step: 1 },
    bandPattern:   { widget: "select", label: "Band pattern", options: BAND_PATTERNS },
    bandOffset:    { widget: "range", label: "Band offset",   min: 0,   max: 20,  step: 1 },
    bandSteps:     { widget: "range", label: "Band steps",    min: 3,   max: 60,  step: 1 },
    bandColor:     { widget: "color", label: "Band colour" },
    bandLineWidth: { widget: "range", label: "Band line",     min: 0.25, max: 6,  step: 0.25 }
  },

  /* draw: the band, in its pattern. */
  draw() {
    drawPairs(bandPairs(this.params, frameRings(this.params)), this.params.bandColor, this.params.bandLineWidth);
  }
};

/* redrawHandler: clear the canvas and draw. */
scriptInfo.redrawHandler = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  scriptInfo.draw();
};

/* runPattern: the entry point the script runner calls. */
export function runPattern() {
  scriptInfo.redrawHandler();
}
