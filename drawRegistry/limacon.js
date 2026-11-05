/* drawRegistry/limacon.js
   ============================================================
   Limacon (curve library)
   ============================================================
   A limacon: an oval, a heart or a loop inside a loop, by the loop setting.
   The points come from limaconPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: loop: 1.5.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { limaconPoints } from "/draw/curves.js";

window.drawRegistry_limacon = makeRingObject({
  name:        "Limacon",
  id:          "limacon",
  category:    "curves",
  description: "A limacon: an oval, a heart or a loop inside a loop, by the loop setting.",
  tags:        ["polar"],
  points:      limaconPoints,
  closed:      true,
  params:      { loop: 1.5 },
  controls:    {
      loop: { widget: "range", min: 0, max: 3, step: 0.1, label: "Loop:" }
  }
});
