/* drawRegistry/ellipse.js
   ============================================================
   Ellipse (shape palette)
   ============================================================
   An ellipse outline, its points evenly spaced in angle.
   The points come from ellipsePoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: ratio: 0.6.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { ellipsePoints } from "/draw/curves.js";

window.drawRegistry_ellipse = makeRingObject({
  name:        "Ellipse",
  id:          "ellipse",
  category:    "shapes",
  description: "An ellipse outline, its points evenly spaced in angle.",
  tags:        ["shape"],
  points:      ellipsePoints,
  closed:      true,
  params:      { ratio: 0.6 },
  controls:    {
      ratio: { widget: "range", min: 0.1, max: 2, step: 0.05, label: "Height / width:" }
  }
});
