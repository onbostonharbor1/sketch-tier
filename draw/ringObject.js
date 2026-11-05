/* draw/ringObject.js
   ============================================================
   The maker for the curve library and shape palette objects
   ============================================================
   Every curve (rose, Lissajous, epicycloid ...) and every shape
   (rectangle, polygon, ellipse) is the same kind of object: a list of
   points on the curve, stitched one of a few ways. Rather than copy the
   same hundred lines into each registry file, each file in drawRegistry/
   describes only what is its own (name, id, the function giving its
   points from draw/curves.js, any extra settings) and calls
   makeRingObject(spec), which builds the registry object around it.

   What every such object has:
     Handles (params.points): [0] the centre, which moves the whole
       object; [1] the size handle, whose distance from the centre is the
       size. Dragging the size handle resizes; moving the size slider
       moves the size handle.
     Settings: steps (how many points on the curve), stitch (outline,
       chords, times table or all pairs), skip (for chords), factor (for
       the times table), colour and line width, plus the object's own.
     Drawing: the points from spec.points(centre, size, steps, params),
       joined by the connector the stitch setting names
       (draw/connectors.js), every line through drawLine (drawPairs).
     Infrastructure (Figures points mode): the curve's points are one arm,
       so a disc can sit on any of them.

   The spec:
     { name, id, category, description, tags,
       points(c, r, n, params),      the curve's points (draw/curves.js)
       closed: true,                 false for an open curve (the spiral)
       params:   { ... },            the object's own settings and defaults
       controls: { ... },            sliders for them (in full, or by name)
       steps: 120, size: 150 }       defaults for those two

   Exports: makeRingObject(spec)
   ============================================================ */

import { polyline, chords, timesTable, allPairs } from "./connectors.js";
import { drawPairs } from "./drawUtilities.js";

const STITCHES = [
  { value: "outline",    label: "Outline" },
  { value: "chords",     label: "Chords (skip)" },
  { value: "timesTable", label: "Times table (factor)" },
  { value: "allPairs",   label: "All pairs" }
];


/* pairsFor: the lines for a list of points, by the stitch setting. */
function pairsFor(pts, p, closed) {
  if (p.stitch === "chords")     return chords(pts, { skip: p.skip, wrap: closed });
  if (p.stitch === "timesTable") return timesTable(pts, { factor: p.factor });
  if (p.stitch === "allPairs")   return allPairs(pts);
  return polyline(pts, { close: closed });
} // end pairsFor


/* makeRingObject: a complete registry object from a spec (see the header). */
export function makeRingObject(spec) {
  const size = spec.size ?? 150;
  return {
    name:        spec.name,
    id:          spec.id,
    version:     1,                        // whole numbers; raise when params change meaning
    handleNames: ["center", "size"],
    category:    spec.category,
    firstOrder:  true,
    source:      "internal",
    tags:        spec.tags || [],
    description: spec.description,
    status:      "",
    hover:       "",
    background:  null,
    overlays:    [],
    transforms:  [],
    elements:    null,
    interactive: true,

    params: {
      midpoint:  { x: 300, y: 300 },
      size,
      steps:     spec.steps ?? 120,
      stitch:    "outline",
      skip:      10,
      factor:    2,
      color:     "#0044cc",
      lineWidth: 1,
      ...(spec.params || {}),
      points:    []
    },

    controls: {
      size:      { widget: "range", min: 20, max: 400, step: 5, label: "Size:" },
      steps:     { widget: "range", min: 3, max: 400, step: 1, label: "Points:" },
      stitch:    { widget: "select", options: STITCHES, label: "Stitch:" },
      skip:      { widget: "range", min: 1, max: 100, step: 1, label: "Skip:" },
      factor:    { widget: "range", min: -10, max: 10, step: 0.1, label: "Factor:" },
      ...(spec.controls || {}),
      color:     { widget: "colorPicker", label: "Color:" },
      lineWidth: { widget: "range", min: 0.25, max: 3, step: 0.25, label: "Line wid.:" }
    },

    /* init: the two handles, from the midpoint and the size, if not set yet. */
    init() {
      const p = this.params;
      if (p.points.length === 0) {
        p.points.push({ x: p.midpoint.x, y: p.midpoint.y });
        p.points.push({ x: p.midpoint.x + p.size, y: p.midpoint.y });
      }
      this.elements = { c: { ...p.points[0] }, h: { ...p.points[1] }, size: p.size };
    },

    /* update: keeps the handles and the size in step. Whatever changed since
       the last update wins: the centre moved (the size handle moves with
       it), the size handle moved (the size follows its distance), or the
       size slider moved (the size handle is put that far to the right). */
    update() {
      const p = this.params, e = this.elements;
      const c = p.points[0], h = p.points[1];
      if (c.x !== e.c.x || c.y !== e.c.y) {
        h.x += c.x - e.c.x;
        h.y += c.y - e.c.y;
      } else if (h.x !== e.h.x || h.y !== e.h.y) {
        p.size = Math.round(Math.hypot(h.x - c.x, h.y - c.y));
      } else if (p.size !== e.size) {
        h.x = c.x + p.size;
        h.y = c.y;
      }
      p.midpoint = { x: c.x, y: c.y };
      this.elements = { c: { ...c }, h: { ...h }, size: p.size };
    },

    /* curvePoints: the object's points now. */
    curvePoints() {
      const p = this.params;
      return spec.points(p.points[0], p.size, p.steps, p);
    },

    /* draw: the points, stitched by the stitch setting. */
    draw() {
      const p = this.params;
      drawPairs(pairsFor(this.curvePoints(), p, spec.closed !== false), p.color, p.lineWidth);
    },

    /* infrastructure: the curve's points as one arm, for discs in Figures. */
    infrastructure() {
      const pts = this.curvePoints();
      return [{ id: "ring", points: pts, steps: pts.length - 1, from: 0, to: pts.length - 1 }];
    }
  };
} // end makeRingObject

// end ringObject.js
