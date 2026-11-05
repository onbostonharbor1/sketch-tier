/* drawRegistry/rectangle.js
   ============================================================
   Rectangle (shape palette)
   ============================================================
   A rectangle, its points spread evenly along the sides.
   The points come from rectanglePoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: ratio: 0.6.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { rectanglePoints } from "/draw/curves.js";

window.drawRegistry_rectangle = makeRingObject({
  name:        "Rectangle",
  id:          "rectangle",
  category:    "shapes",
  description: "A rectangle, its points spread evenly along the sides.",
  tags:        ["shape"],
  points:      rectanglePoints,
  closed:      true,
  params:      { ratio: 0.6 },
  controls:    {
      ratio: { widget: "range", min: 0.1, max: 2, step: 0.05, label: "Height / width:" }
  }
});
