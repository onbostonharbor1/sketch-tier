/* drawRegistry/polygon.js
   ============================================================
   Polygon (shape palette)
   ============================================================
   A regular polygon outline, its points spread evenly along the sides.
   The points come from polygonPoints() in draw/curves.js; everything else (the
   centre and size handles, steps, the stitch choice, colour, line width,
   Figures discs) is made by makeRingObject() in draw/ringObject.js.
   Extra settings: sides: 5.
   ============================================================ */

import { makeRingObject } from "/draw/ringObject.js";
import { polygonPoints } from "/draw/curves.js";

window.drawRegistry_polygon = makeRingObject({
  name:        "Polygon",
  id:          "polygon",
  category:    "shapes",
  description: "A regular polygon outline, its points spread evenly along the sides.",
  tags:        ["shape"],
  points:      polygonPoints,
  closed:      true,
  params:      { sides: 5 },
  controls:    {
      sides: { widget: "range", min: 3, max: 24, step: 1, label: "Sides:" }
  }
});
