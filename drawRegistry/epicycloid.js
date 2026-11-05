/* drawRegistry/epicycloid.js
   ============================================================
   Epicycloid (curve library)
   ============================================================
   A circle rolling round the outside of a circle: lobes cusps.
   The points come from epicycloidPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: lobes: 3.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { epicycloidPoints } from "/draw/curves.js";

window.drawRegistry_epicycloid = makeRingObject({
  name:        "Epicycloid",
  id:          "epicycloid",
  category:    "curves",
  description: "A circle rolling round the outside of a circle: lobes cusps.",
  tags:        ["roulette", "spirograph"],
  points:      epicycloidPoints,
  closed:      true,
  params:      { lobes: 3 },
  controls:    {
      lobes: { widget: "range", min: 1, max: 12, step: 1, label: "Lobes:" }
  }
});
