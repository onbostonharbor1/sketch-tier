/* drawRegistry/cardioid.js
   ============================================================
   Cardioid (curve library)
   ============================================================
   The heart curve, with its cusp at the centre.
   The points come from cardioidPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: none.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { cardioidPoints } from "/draw/curves.js";

window.drawRegistry_cardioid = makeRingObject({
  name:        "Cardioid",
  id:          "cardioid",
  category:    "curves",
  description: "The heart curve, with its cusp at the centre.",
  tags:        ["polar"],
  points:      cardioidPoints,
  closed:      true,
  params:      {  },
  controls:    {
      
  }
});
