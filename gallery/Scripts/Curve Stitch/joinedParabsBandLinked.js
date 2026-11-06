/* ============================================================
   Joined Parabolas with a linked band (version 2: band and lattice related)
   ============================================================
   Version 1 (joinedParabsBand.js) puts a separate band round Joined
   Parabolas v2: driven by the lattice and spaced to its rhythm. This
   version keeps all of that and adds relationships between the band and
   the lattice (Barry, 6 November 2026: "some kind of interrelationship
   between"), each a setting, so they can be tried one at a time:

     Bridges   lines across the gap from the lattice's outer points to the
               nearest point of the band's inner edge, every Nth outer
               point (0: none). Few bridges keep the mat; many fill it.
     Anchors   from each corner of the lattice, a fan of lines to the band
               points round the band's matching corner (Anchor fan points
               each side; 0: none). Ties the corners without filling the gap.
     Echo      a fifth band pattern: the band filled with the lattice's own
               rule, joined parabolas zigzagging between the inner and
               outer edge (apex alternately out and in, like Type A and
               Type B), Band offset points per half zigzag, Band steps per
               corner.

   Everything else (the lattice, the v2 fixes, the band's gap, width,
   patterns and colours) comes from version 1, whose functions are
   imported.
   ============================================================ */
import { StringThing }   from "/classes/classes.js";
import { drawPairs, drawLine } from "/draw/drawUtilities.js";
import { corner }        from "/draw/connectors.js";
import { armInteractor } from "/ui/interactor.js";
import { seedLattice, stretchLattice, latticePerimeter, latticeCorners,
         bandRings, bandPairs, drawLattice, BAND_PATTERNS } from "./joinedParabsBand.js";


/* echoPairs: the band filled with joined parabolas, the lattice's rule:
   with h = Band offset, corners [inner i, outer i+h, inner i+2h] (apex
   out) and [outer i+h, inner i+2h, outer i+3h] (apex in), stepping round
   the band by 2h. */
function echoPairs(params, rings) {
  const inn = rings.inner.pts, out = rings.outer.pts, n = inn.length;
  const h = Math.max(1, Math.round(params.bandOffset));
  const at = (ring, i) => ring[((i % n) + n) % n];
  const pairs = [];
  for (let i = 0; i < n; i += 2 * h) {
    pairs.push(...corner(at(inn, i), at(out, i + h), at(inn, i + 2 * h), params.bandSteps));
    pairs.push(...corner(at(out, i + h), at(inn, i + 2 * h), at(out, i + 3 * h), params.bandSteps));
  }
  return pairs;
} // end echoPairs


/* nearest: the point of list closest to p. */
function nearest(list, p) {
  let best = list[0], bestD = Infinity;
  for (const q of list) {
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d < bestD) { bestD = d; best = q; }
  }
  return best;
} // end nearest


/* bridgePairs: from every Nth outer lattice point to the nearest point on
   the band's inner edge. */
function bridgePairs(params, rings) {
  const every = Math.round(params.bridgeEvery);
  if (every <= 0) return [];
  return latticePerimeter(params).filter((p, i) => i % every === 0).map((p) => [p, nearest(rings.inner.pts, p)]);
} // end bridgePairs


/* anchorPairs: from each lattice corner, lines to the band's inner points
   within Anchor fan places of the band's matching corner, both ways. */
function anchorPairs(params, rings) {
  const fan = Math.round(params.anchorFan);
  if (fan <= 0) return [];
  const inn = rings.inner.pts, n = inn.length;
  const pairs = [];
  latticeCorners(params).forEach((c, k) => {
    const at = rings.inner.corners[k];
    for (let d = -fan; d <= fan; d++) pairs.push([c, inn[((at + d) % n + n) % n]]);
  });
  return pairs;
} // end anchorPairs


export const scriptInfo = {
  title: "Joined Parabolas with a linked band",
  interactive: true,

  params: {
    numParabs: 4, numRows: 3, width: 90, height: 90, scale: 1, numSteps: 15,
    color: "#0044cc", lineWidth: 1,
    gap: 50, bandWidth: 45, bandPattern: "echo", bandOffset: 2, bandDensity: 2, bandSteps: 10,
    bandColor: "#aa5500", bandLineWidth: 1,
    bridgeEvery: 2, anchorFan: 2, linkColor: "#888888", linkLineWidth: 0.75,
    points: []
  },

  controls: {
    numParabs:     { widget: "range", label: "Parabolas/Row", min: 2,   max: 8,   step: 1 },
    numRows:       { widget: "range", label: "Rows",          min: 1,   max: 6,   step: 1 },
    width:         { widget: "range", label: "Width",         min: 20,  max: 300, step: 1 },
    height:        { widget: "range", label: "Height",        min: 20,  max: 300, step: 1 },
    scale:         { widget: "range", label: "Scale",         min: 0.5, max: 2,   step: 0.05 },
    numSteps:      { widget: "range", label: "Steps",         min: 3,   max: 80,  step: 1 },
    lineWidth:     { widget: "range", label: "Line",          min: 0.25, max: 6,  step: 0.25 },
    color:         { widget: "color", label: "Color" },
    gap:           { widget: "range", label: "Gap (mat)",     min: 0,   max: 200, step: 1 },
    bandWidth:     { widget: "range", label: "Band width",    min: 5,   max: 200, step: 1 },
    bandPattern:   { widget: "select", label: "Band pattern", options: [...BAND_PATTERNS, "echo"] },
    bandOffset:    { widget: "range", label: "Band offset",   min: 0,   max: 20,  step: 1 },
    bandDensity:   { widget: "range", label: "Band density",  min: 1,   max: 8,   step: 1 },
    bandSteps:     { widget: "range", label: "Band steps",    min: 3,   max: 60,  step: 1 },
    bandColor:     { widget: "color", label: "Band colour" },
    bandLineWidth: { widget: "range", label: "Band line",     min: 0.25, max: 6,  step: 0.25 },
    bridgeEvery:   { widget: "range", label: "Bridges every", min: 0,   max: 10,  step: 1 },
    anchorFan:     { widget: "range", label: "Anchor fan",    min: 0,   max: 10,  step: 1 },
    linkColor:     { widget: "color", label: "Link colour" },
    linkLineWidth: { widget: "range", label: "Link line",     min: 0.25, max: 6,  step: 0.25 },
    reset: {
      widget: "button", label: "Reset", fullRow: true,
      action() {
        /* Make the lattice afresh, losing any drags. */
        this._state.seeded = false;
        this.redrawHandler();
      }
    }
  },

  _state: { seeded: false, M: null, N: null, dx: null, dy: null },

  /* init: the settings object, and the lattice if it has no points yet. */
  init() {
    this.elements = { thing: new StringThing({ ...this.params }) };
    if (this.params.points.length === 0) this.update(this.params);
  },

  /* update: as version 1: new M or N or a Reset makes the lattice afresh;
     a new Width, Height or Scale stretches it. */
  update(params) {
    const s = this._state;
    const dx = params.width * params.scale, dy = params.height * params.scale;
    if (!s.seeded || params.numParabs !== s.M || params.numRows !== s.N) {
      seedLattice(params);
      Object.assign(s, { seeded: true, M: params.numParabs, N: params.numRows });
      armInteractor(this);
    } else if (dx !== s.dx || dy !== s.dy) {
      stretchLattice(params.points, s.dx, s.dy, dx, dy);
    }
    s.dx = dx; s.dy = dy;
  },

  /* draw: the band, the links (bridges and anchors), then the lattice on top. */
  draw() {
    const p = this.params;
    const rings = bandRings(p);
    const band = p.bandPattern === "echo" ? echoPairs(p, rings) : bandPairs(p, rings);
    drawPairs(band, p.bandColor, p.bandLineWidth);
    for (const [a, b] of [...bridgePairs(p, rings), ...anchorPairs(p, rings)]) drawLine(a, b, p.linkColor, p.linkLineWidth);
    drawLattice(p);
  }
};

/* redrawHandler: clear the canvas, bring the lattice up to date, draw. */
scriptInfo.redrawHandler = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  scriptInfo.update(scriptInfo.params);
  scriptInfo.draw();
};

/* runPattern: the entry point the script runner calls. */
export function runPattern() {
  scriptInfo.init();
  scriptInfo.redrawHandler();
}
