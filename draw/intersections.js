/* draw/intersections.js
   ============================================================
   Intersections: where lines made of points cross, found fast
   ============================================================
   findIntersections(paths, options) takes one or more paths (each an
   array of points, joined in order) and returns every place where one
   segment crosses another: a path crossing itself, or two paths crossing
   each other. It only computes; it draws nothing and changes nothing.

   How it is fast (a grid). Testing every segment against every other is
   n x n work: 20,000 segments make 200 million tests. Instead an
   invisible grid is laid over the paths, each segment is noted in every
   grid square its box touches, and a segment is tested only against the
   segments already noted in its own squares. Crossing segments always
   share a square, so nothing is missed, and the result is exactly what
   testing every pair gives, in a small fraction of the time.

   Tunable (options, every one with a default):
     cellSize       grid square size in pixels; default: twice the average
                    segment length
     neighbourSkip  segments this close in order along the same path are
                    not tested against each other (default 1: only
                    segments that touch end to end). Stops a mark at every
                    joint ("beading").
     endMargin      a fraction of each segment at each end where a crossing
                    is not counted (default 0: any crossing strictly inside
                    both segments). Parametrics uses 0.01, as before.
     countEnds      count segments that only meet at an end point (default false)
     mergeDistance  crossings closer than this (pixels) become one (default 0.5)
     mode           "both" (default), "self" (a path with itself only) or
                    "between" (different paths only)
     closed         true, or an array of true/false per path: the path's
                    last point joins back to its first (default false)
     maxCount       stop after this many crossings, with a note (default 2000)
     timeLimit      stop after this many milliseconds, with a note (default 1000)

   Returns { points, notes }:
     points  [{ x, y, a: { path, segment, t }, b: { path, segment, t } }]
             a and b name the two segments (path number, segment number
             along it, and how far along it, 0 to 1) so a disc on a crossing
             can find it again after the paths change.
     notes   sentences, empty when nothing was cut short.
   Nothing is refused: empty or one-point paths give no crossings.

   FUNCTIONS (alphabetical)
     crossingOf(p1, p2, p3, p4, margin, ends)  where two segments cross, or null
     findIntersections(paths, options)         the module's one entry point
   ============================================================ */


/* crossingOf: where segment p1-p2 crosses segment p3-p4, as { x, y, ua, ub }
   (ua and ub: how far along each, 0 to 1), or null. Parallel segments never
   cross here. margin: the fraction at each end that does not count. ends:
   whether touching at an end point counts. */
export function crossingOf(p1, p2, p3, p4, margin = 0, ends = false) {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0) return null;
  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  const lo = margin, hi = 1 - margin;
  const inside = ends || margin > 0
    ? (ua >= lo && ua <= hi && ub >= lo && ub <= hi)
    : (ua > 0 && ua < 1 && ub > 0 && ub < 1);
  if (!inside) return null;
  return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y), ua, ub };
} // end crossingOf


/* findIntersections: see the header. */
export function findIntersections(paths, options = {}) {
  const o = {
    neighbourSkip: 1, endMargin: 0, countEnds: false, mergeDistance: 0.5,
    mode: "both", closed: false, maxCount: 2000, timeLimit: 1000, ...options
  };
  const notes = [];
  const clock = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
  const started = clock();

  // 1. Every segment: { path, segment, p1, p2 }, and each path's segment count.
  const segs = [], counts = [];
  paths.forEach((pts, path) => {
    const closed = Array.isArray(o.closed) ? !!o.closed[path] : !!o.closed;
    const n = (pts || []).length;
    let count = 0;
    for (let i = 0; i + 1 < n; i++) segs.push({ path, segment: count++, p1: pts[i], p2: pts[i + 1] });
    if (closed && n > 2) segs.push({ path, segment: count++, p1: pts[n - 1], p2: pts[0] });
    counts.push({ count, closed });
  });
  if (segs.length < 2) return { points: [], notes };

  // 2. The grid square size: given, or twice the average segment length.
  let cell = o.cellSize;
  if (!(cell > 0)) {
    const total = segs.reduce((sum, s) => sum + Math.hypot(s.p2.x - s.p1.x, s.p2.y - s.p1.y), 0);
    cell = Math.max(1, 2 * total / segs.length);
  }

  // 3. Are two segments of the same path too close in order to test?
  //    On a closed path the count wraps round (the last touches the first).
  const tooClose = (s, t) => {
    if (s.path !== t.path) return false;
    let gap = Math.abs(s.segment - t.segment);
    const c = counts[s.path];
    if (c.closed) gap = Math.min(gap, c.count - gap);
    return gap <= o.neighbourSkip;
  };
  const wanted = (s, t) => (o.mode === "self" ? s.path === t.path : o.mode === "between" ? s.path !== t.path : true);

  // 4. Walk the segments in order. Test each against the segments already
  //    noted in the squares its box touches, then note it there too.
  const grid = new Map();                        // "column,row" -> [segment numbers]
  const seenBy = new Int32Array(segs.length).fill(-1);   // so a pair sharing two squares is tested once
  const found = [];
  let stopped = false;
  for (let k = 0; k < segs.length && !stopped; k++) {
    const s = segs[k];
    const c0 = Math.floor(Math.min(s.p1.x, s.p2.x) / cell), c1 = Math.floor(Math.max(s.p1.x, s.p2.x) / cell);
    const r0 = Math.floor(Math.min(s.p1.y, s.p2.y) / cell), r1 = Math.floor(Math.max(s.p1.y, s.p2.y) / cell);
    for (let c = c0; c <= c1 && !stopped; c++) {
      for (let r = r0; r <= r1 && !stopped; r++) {
        const key = c + "," + r;
        const here = grid.get(key);
        if (here) {
          for (const m of here) {
            if (seenBy[m] === k) continue;
            seenBy[m] = k;
            const t = segs[m];
            if (tooClose(s, t) || !wanted(s, t)) continue;
            const hit = crossingOf(t.p1, t.p2, s.p1, s.p2, o.endMargin, o.countEnds);
            if (!hit) continue;
            found.push({ x: hit.x, y: hit.y,
                         a: { path: t.path, segment: t.segment, t: hit.ua },
                         b: { path: s.path, segment: s.segment, t: hit.ub } });
            if (found.length >= o.maxCount) {
              notes.push("Stopped at " + o.maxCount + " crossings (maxCount); there may be more.");
              stopped = true;
            }
          }
          here.push(k);
        } else {
          grid.set(key, [k]);
        }
      }
    }
    if (!stopped && (k & 1023) === 0 && clock() - started > o.timeLimit) {
      notes.push("Stopped after " + o.timeLimit + " ms (timeLimit), " + k + " of " + segs.length + " segments searched.");
      stopped = true;
    }
  }

  // 5. Crossings closer than mergeDistance become one (the first found).
  if (!(o.mergeDistance > 0)) return { points: found, notes };
  const merged = [];
  const near = new Map();                        // a coarse grid of kept crossings
  const md = o.mergeDistance;
  for (const p of found) {
    const c = Math.floor(p.x / md), r = Math.floor(p.y / md);
    let dup = false;
    for (let dc = -1; dc <= 1 && !dup; dc++) {
      for (let dr = -1; dr <= 1 && !dup; dr++) {
        for (const q of near.get((c + dc) + "," + (r + dr)) || []) {
          if (Math.hypot(p.x - q.x, p.y - q.y) < md) { dup = true; break; }
        }
      }
    }
    if (dup) continue;
    merged.push(p);
    const key = c + "," + r;
    if (!near.has(key)) near.set(key, []);
    near.get(key).push(p);
  }
  return { points: merged, notes };
} // end findIntersections

// end intersections.js
