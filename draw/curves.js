/* draw/curves.js
   ============================================================
   The curve library and the shape palette: points on each curve or shape
   ============================================================
   Each function gives the points of one closed curve or shape, centred on
   c, sized by r (roughly its radius in pixels), n points in all, evenly
   spaced in the curve's own parameter. They only compute points: no
   drawing, no state. The registry objects in drawRegistry/ (made by
   draw/ringObject.js) stitch these points with the connectors in
   draw/connectors.js.

   Points are plain { x, y }. Nothing is refused: odd settings give odd
   curves (a rose with k = 0 is a dot; a superellipse exponent of 0.2 is a
   thin star).

   FUNCTIONS (alphabetical)
     astroidPoints(c, r, n)               a four-cusped star (hypocycloid of 4)
     cardioidPoints(c, r, n)              a heart shape (epicycloid of 1)
     ellipsePoints(c, r, n, s)            an ellipse; s.ratio is height / width
     epicycloidPoints(c, r, n, s)         a circle rolling outside a circle: s.lobes cusps
     hypocycloidPoints(c, r, n, s)        a circle rolling inside a circle: s.cusps cusps
     limaconPoints(c, r, n, s)            a limacon; s.loop (0 to 2) sets the inner loop
     lissajousPoints(c, r, n, s)          x = sin(a t + phase), y = sin(b t): s.a, s.b, s.phase (degrees)
     polygonPoints(c, r, n, s)            a regular polygon, s.sides sides, points spread along the sides
     rectanglePoints(c, r, n, s)          a rectangle; s.ratio is height / width; points along the sides
     rosePoints(c, r, n, s)               a rose r = cos(k t): s.k petals (k odd), 2k petals (k even)
     spiralPoints(c, r, n, s)             an Archimedean spiral, s.turns turns, out to r (not closed)
     superellipsePoints(c, r, n, s)       |x|^p + |y|^p = 1: s.power (2 a circle, 4 a squircle, below 1 a star)
   ============================================================ */

const TAU = 2 * Math.PI;
const RAD = Math.PI / 180;


/* ring: n points, point i at parameter t = i/n of a full turn, from a
   function giving the point (as a fraction of r) for an angle t. The
   helper every closed curve below uses. */
function ring(c, r, n, f) {
  const count = Math.max(3, Math.round(n));
  const out = [];
  for (let i = 0; i < count; i++) {
    const [x, y] = f(TAU * i / count);
    out.push({ x: c.x + r * x, y: c.y + r * y });
  }
  return out;
} // end ring


/* rosePoints: the rose curve r = cos(k t). k odd gives k petals, k even
   2k petals; the curve is traced once over a full turn (twice for odd k,
   which lays the same petals again). */
export function rosePoints(c, r, n, s = {}) {
  const k = Number(s.k ?? 5);
  return ring(c, r, n, (t) => { const m = Math.cos(k * t); return [m * Math.cos(t), m * Math.sin(t)]; });
} // end rosePoints


/* lissajousPoints: x = sin(a t + phase), y = sin(b t). Small whole numbers
   for a and b give the familiar figures (3 and 2 a pretzel). */
export function lissajousPoints(c, r, n, s = {}) {
  const a = Number(s.a ?? 3), b = Number(s.b ?? 2), ph = Number(s.phase ?? 90) * RAD;
  return ring(c, r, n, (t) => [Math.sin(a * t + ph), Math.sin(b * t)]);
} // end lissajousPoints


/* epicycloidPoints: the path of a point on a small circle rolling round
   the outside of a big one; lobes is how many cusps. Scaled so the curve
   reaches r. */
export function epicycloidPoints(c, r, n, s = {}) {
  const k = Number(s.lobes ?? 3);
  const scale = 1 / (k + 2);
  return ring(c, r, n, (t) => [scale * ((k + 1) * Math.cos(t) - Math.cos((k + 1) * t)),
                               scale * ((k + 1) * Math.sin(t) - Math.sin((k + 1) * t))]);
} // end epicycloidPoints


/* hypocycloidPoints: a small circle rolling round the inside of a big one;
   cusps is how many points the star has (3 a deltoid, 4 an astroid). */
export function hypocycloidPoints(c, r, n, s = {}) {
  const k = Number(s.cusps ?? 3);
  const scale = 1 / Math.max(1, k);
  return ring(c, r, n, (t) => [scale * ((k - 1) * Math.cos(t) + Math.cos((k - 1) * t)),
                               scale * ((k - 1) * Math.sin(t) - Math.sin((k - 1) * t))]);
} // end hypocycloidPoints


/* astroidPoints: the four-cusped hypocycloid, x = cos^3 t, y = sin^3 t. */
export function astroidPoints(c, r, n) {
  return ring(c, r, n, (t) => [Math.cos(t) ** 3, Math.sin(t) ** 3]);
} // end astroidPoints


/* cardioidPoints: the heart, r = (1 + cos t) / 2: the epicycloid with one
   cusp, which sits at the centre c, the curve reaching r to the right. */
export function cardioidPoints(c, r, n) {
  return ring(c, r, n, (t) => { const m = (1 + Math.cos(t)) / 2; return [m * Math.cos(t), m * Math.sin(t)]; });
} // end cardioidPoints


/* limaconPoints: r = (1 + loop cos t) / (1 + loop). loop 1 is the cardioid,
   above 1 an inner loop appears, below 1 a dimpled oval. */
export function limaconPoints(c, r, n, s = {}) {
  const b = Number(s.loop ?? 1.5);
  return ring(c, r, n, (t) => { const m = (1 + b * Math.cos(t)) / (1 + Math.abs(b)); return [m * Math.cos(t), m * Math.sin(t)]; });
} // end limaconPoints


/* superellipsePoints: |x|^p + |y|^p = 1. power 2 is a circle, 4 a squircle,
   1 a diamond, below 1 a star with curved sides. */
export function superellipsePoints(c, r, n, s = {}) {
  const p = Math.max(0.05, Number(s.power ?? 4));
  const sgnPow = (v) => Math.sign(v) * Math.abs(v) ** (2 / p);
  return ring(c, r, n, (t) => [sgnPow(Math.cos(t)), sgnPow(Math.sin(t))]);
} // end superellipsePoints


/* spiralPoints: an Archimedean spiral from the centre out to r, turns
   turns. The one curve here that is not closed. */
export function spiralPoints(c, r, n, s = {}) {
  const turns = Number(s.turns ?? 3);
  const count = Math.max(2, Math.round(n));
  const out = [];
  for (let i = 0; i < count; i++) {
    const f = i / (count - 1), t = TAU * turns * f;
    out.push({ x: c.x + r * f * Math.cos(t), y: c.y + r * f * Math.sin(t) });
  }
  return out;
} // end spiralPoints


/* ellipsePoints: an ellipse of half-width r and half-height r * ratio. */
export function ellipsePoints(c, r, n, s = {}) {
  const ratio = Number(s.ratio ?? 0.6);
  return ring(c, r, n, (t) => [Math.cos(t), ratio * Math.sin(t)]);
} // end ellipsePoints


/* alongCorners: n points spread evenly by distance round the closed
   outline through the corners given, starting at the first corner. Used by
   the rectangle and the polygon so nails fall evenly along the sides. */
function alongCorners(corners, n) {
  const count = Math.max(corners.length, Math.round(n));
  const sides = corners.map((a, i) => [a, corners[(i + 1) % corners.length]]);
  const lengths = sides.map(([a, b]) => Math.hypot(b.x - a.x, b.y - a.y));
  const total = lengths.reduce((s, l) => s + l, 0) || 1;
  const out = [];
  for (let i = 0; i < count; i++) {
    let d = total * i / count, k = 0;
    while (k < sides.length - 1 && d > lengths[k]) { d -= lengths[k]; k++; }
    const [a, b] = sides[k], f = lengths[k] ? d / lengths[k] : 0;
    out.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
  }
  return out;
} // end alongCorners


/* rectanglePoints: a rectangle of half-width r and half-height r * ratio,
   with n points spread round its sides from the top left corner. */
export function rectanglePoints(c, r, n, s = {}) {
  const h = r * Number(s.ratio ?? 0.6);
  const corners = [{ x: c.x - r, y: c.y - h }, { x: c.x + r, y: c.y - h }, { x: c.x + r, y: c.y + h }, { x: c.x - r, y: c.y + h }];
  return alongCorners(corners, n);
} // end rectanglePoints


/* polygonPoints: a regular polygon of the given number of sides, corners
   on a circle of radius r, the first corner at the top, n points spread
   round its sides. */
export function polygonPoints(c, r, n, s = {}) {
  const sides = Math.max(3, Math.round(Number(s.sides ?? 5)));
  const corners = [];
  for (let i = 0; i < sides; i++) {
    const a = -Math.PI / 2 + TAU * i / sides;
    corners.push({ x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) });
  }
  return alongCorners(corners, n);
} // end polygonPoints

// end curves.js
