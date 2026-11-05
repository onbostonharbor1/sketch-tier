/* drawRegistry/archimedeanSpiral.js
   ============================================================
   Archimedean Spiral (curve library)
   ============================================================
   A spiral from the centre outward, turns turns (not closed).
   The points come from spiralPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: turns: 3.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { spiralPoints } from "/draw/curves.js";

window.drawRegistry_archimedeanSpiral = makeRingObject({
  name:        "Archimedean Spiral",
  id:          "archimedeanSpiral",
  category:    "curves",
  description: "A spiral from the centre outward, turns turns (not closed).",
  tags:        ["spiral"],
  points:      spiralPoints,
  closed:      false,
  params:      { turns: 3 },
  controls:    {
      turns: { widget: "range", min: 1, max: 12, step: 0.5, label: "Turns:" }
  }
});
