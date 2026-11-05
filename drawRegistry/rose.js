/* drawRegistry/rose.js
   ============================================================
   Rose (curve library)
   ============================================================
   A rose curve: k petals for odd k, 2k for even k.
   The points come from rosePoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: k: 5.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { rosePoints } from "/draw/curves.js";

window.drawRegistry_rose = makeRingObject({
  name:        "Rose",
  id:          "rose",
  category:    "curves",
  description: "A rose curve: k petals for odd k, 2k for even k.",
  tags:        ["rose", "polar"],
  points:      rosePoints,
  closed:      true,
  params:      { k: 5 },
  controls:    {
      k: { widget: "range", min: 0, max: 12, step: 1, label: "Petals (k):" }
  }
});
