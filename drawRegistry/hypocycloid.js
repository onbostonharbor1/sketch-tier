/* drawRegistry/hypocycloid.js
   ============================================================
   Hypocycloid (curve library)
   ============================================================
   A circle rolling round the inside of a circle: a star of cusps.
   The points come from hypocycloidPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: cusps: 3.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { hypocycloidPoints } from "/draw/curves.js";

window.drawRegistry_hypocycloid = makeRingObject({
  name:        "Hypocycloid",
  id:          "hypocycloid",
  category:    "curves",
  description: "A circle rolling round the inside of a circle: a star of cusps.",
  tags:        ["roulette", "spirograph"],
  points:      hypocycloidPoints,
  closed:      true,
  params:      { cusps: 3 },
  controls:    {
      cusps: { widget: "range", min: 2, max: 12, step: 1, label: "Cusps:" }
  }
});
