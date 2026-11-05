/* drawRegistry/lissajous.js
   ============================================================
   Lissajous (curve library)
   ============================================================
   A Lissajous figure: x = sin(a t + phase), y = sin(b t).
   The points come from lissajousPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: a: 3, b: 2, phase: 90.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { lissajousPoints } from "/draw/curves.js";

window.drawRegistry_lissajous = makeRingObject({
  name:        "Lissajous",
  id:          "lissajous",
  category:    "curves",
  description: "A Lissajous figure: x = sin(a t + phase), y = sin(b t).",
  tags:        ["lissajous", "parametric"],
  points:      lissajousPoints,
  closed:      true,
  params:      { a: 3, b: 2, phase: 90 },
  controls:    {
      a: { widget: "range", min: 1, max: 9, step: 1, label: "a:" },
      b: { widget: "range", min: 1, max: 9, step: 1, label: "b:" },
      phase: { widget: "range", min: 0, max: 180, step: 5, label: "Phase:" }
  }
});
