/* drawRegistry/astroid.js
   ============================================================
   Astroid (curve library)
   ============================================================
   The four-cusped star: x = cos^3 t, y = sin^3 t.
   The points come from astroidPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: none.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { astroidPoints } from "/draw/curves.js";

window.drawRegistry_astroid = makeRingObject({
  name:        "Astroid",
  id:          "astroid",
  category:    "curves",
  description: "The four-cusped star: x = cos^3 t, y = sin^3 t.",
  tags:        ["roulette"],
  points:      astroidPoints,
  closed:      true,
  params:      {  },
  controls:    {
      
  }
});
