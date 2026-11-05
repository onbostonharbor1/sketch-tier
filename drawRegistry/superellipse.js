/* drawRegistry/superellipse.js
   ============================================================
   Superellipse (curve library)
   ============================================================
   |x|^p + |y|^p = 1: a circle at 2, a squircle at 4, a star below 1.
   The points come from superellipsePoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: power: 4.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { superellipsePoints } from "/draw/curves.js";

window.drawRegistry_superellipse = makeRingObject({
  name:        "Superellipse",
  id:          "superellipse",
  category:    "curves",
  description: "|x|^p + |y|^p = 1: a circle at 2, a squircle at 4, a star below 1.",
  tags:        ["superellipse"],
  points:      superellipsePoints,
  closed:      true,
  params:      { power: 4 },
  controls:    {
      power: { widget: "range", min: 0.2, max: 10, step: 0.1, label: "Power:" }
  }
});
