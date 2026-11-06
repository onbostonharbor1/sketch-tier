// drawParametrics.js
// ------------------------------------------------------------
// Parametric and Polar Curve Drawing Engine
// ------------------------------------------------------------
// This module provides the logic for rendering mathematical curves
// onto the HTML5 Canvas. It bridges the gap between the "pure model"
// Parametric class and the visual display.
//
// Key Features:
//   1.  Auto-Fitting: Automatically scales and centers any curve
//       to fit within the canvas boundaries using a configurable margin.
//   2.  Circuit Breaker: Prevents infinite drawing or overlapping loops
//       by detecting when a curve has returned to its starting point
//       and moving in its original direction.
//   3.  Intersection Detection: where the curve crosses itself, by
//       findIntersections() in draw/intersections.js (a grid, so fast
//       for long curves; tunable through thing.intersections). Segments
//       2 or fewer apart, and 1% at each segment end, are not counted,
//       to avoid "beading" at segment joints.
//   4.  Polar Support: A wrapper that converts polar coordinates
//       (radius and angle) into Cartesian parametric functions.
// ------------------------------------------------------------

import { Point } from "/classes/classes.js";
import { Parametric } from "/classes/parametric.js";
import { drawLine, printText, displayPoint } from "/draw/drawUtilities.js";
import { findIntersections } from "/draw/intersections.js";

/**
 * drawPolar(s)
 * Converts polar function definitions into Cartesian parametric functions
 * and then hands them off to the main drawing engine.
 */
export function drawPolar(s) {
    if (!s) throw new Error("drawPolar requires a config object");
    if (!s.rad) throw new Error("drawPolar requires rad(t)");

    // Default angle is just 't' (radians) if not provided
    const angleFn = s.angle ? s.angle : function(t) { return t; };

    // Map radius and angle to X and Y
    const p = Object.assign({}, s, {
        funcX: function(t) { return s.rad(t) * Math.cos(angleFn(t)); },
        funcY: function(t) { return s.rad(t) * Math.sin(angleFn(t)); }
    });

    const thing = new Parametric(p);
    drawParametric(thing);
} // end drawPolar

/**
 * drawParametric(thing)
 * The primary loop for evaluating, auto-fitting, and drawing the curve segments.
 */
export function drawParametric(thing) {
    const { pts, funcX, funcY, color, lineWidth, showIntersections } = thing;

    // 1. Calculate scaling and centering before we draw a single pixel
    autoFitParametricToCanvas(thing);

    const segments = [];
    const curve = [];        // the points drawn, in order, for the intersection search

    // 2. Establish "The Start" for the Circuit Breaker logic
    const pStart = new Point(
        thing.scale * funcX(pts[0]) + thing.mid.x,
        thing.scale * funcY(pts[0]) + thing.mid.y
    );

    // Capture the initial vector to ensure we only break when moving the same way
    const firstStepX = (thing.scale * funcX(pts[1]) + thing.mid.x) - pStart.x;
    const firstStepY = (thing.scale * funcY(pts[1]) + thing.mid.y) - pStart.y;

    // 3. Main Sampling Loop
    for (let i = 0; i < pts.length; i++) {
        const t = pts[i];
        const px = thing.scale * funcX(t) + thing.mid.x;
        const py = thing.scale * funcY(t) + thing.mid.y;
        const pCurrent = new Point(px, py);

        if (i > 0) {
            const pPrev = segments[segments.length - 1].p2;
            const newSeg = { p1: pPrev, p2: pCurrent };

            // --- THE CIRCUIT BREAKER ---
            // Don't check for closure until we've moved at least 50 steps away.
            if (i > 50) {
                const distToStart = Math.hypot(pCurrent.x - pStart.x, pCurrent.y - pStart.y);
                const currentStepX = pCurrent.x - pPrev.x;
                const currentStepY = pCurrent.y - pPrev.y;

                // Dot product > 0 means vectors are generally in the same direction.
                const dotProduct = (currentStepX * firstStepX) + (currentStepY * firstStepY);

                // If within 2 pixels and heading 'home', close the circuit.
                if (distToStart < 2.0 && dotProduct > 0) {
                    // BRIDGE: Draw the last closing segment to pStart to eliminate gaps
                    drawLine(pPrev, pStart, color, lineWidth);
                    curve.push(pStart);
                    break; // Terminate drawing early
                }
            }

            // Normal Segment Drawing
            drawLine(newSeg.p1, newSeg.p2, color, lineWidth);
            segments.push(newSeg);
            curve.push(pCurrent);
        } else {
            // First point initialization
            segments.push({ p1: pCurrent, p2: pCurrent });
            curve.push(pCurrent);
        }
    }

    // 4. INTERSECTIONS: where the curve crosses itself, found by the grid
    //    method in draw/intersections.js (fast and tunable; it replaced a
    //    test of every segment against every earlier one). The settings
    //    reproduce the old marks: segments up to 2 apart along the curve
    //    are not tested, and 1% at each end of a segment does not count
    //    (so joints do not "bead"). thing.intersections may override any
    //    of them (see the header of intersections.js).
    if (showIntersections) {
        const found = findIntersections([curve], {
            neighbourSkip: 2, endMargin: 0.01, mergeDistance: 0,
            ...(thing.intersections || {})
        });
        for (const hit of found.points) displayPoint(hit, "red");
        thing.intersectionNotes = found.notes;     // "stopped at ..." if a limit was reached
    }
} // end drawParametric

/**
 * autoFitParametricToCanvas(thing)
 * Measures the raw mathematical bounds of the curve and updates the
 * 'scale' and 'mid' properties of the Parametric object to fit the canvas.
 */
export function autoFitParametricToCanvas(thing) {
    const canvas = document.getElementById("sharedCanvas");
    if (!canvas) throw new Error("autoFit: #sharedCanvas not found");

    const b = measureParametricBounds(thing);
    const width = b.maxX - b.minX;
    const height = b.maxY - b.minY;

    if (width <= 0 || height <= 0) throw new Error("autoFit: invalid bounds");

    const margin = thing.margin || 30;
    const usableW = canvas.width - 2 * margin;
    const usableH = canvas.height - 2 * margin;

    // Maintain aspect ratio: use the smaller of the two possible scales
    const sX = usableW / width;
    const sY = usableH / height;
    thing.scale = (sX < sY) ? sX : sY;

    // Draggable handles (v1-finish item 8): a zoom on top of the fitted
    // size, and the point the curve is centred on (the canvas centre
    // unless thing.centerAt says otherwise). zoom 1 at the canvas centre
    // is exactly the old fit.
    if (thing.zoom) thing.scale *= thing.zoom;
    const cx = thing.centerAt ? thing.centerAt.x : canvas.width / 2;
    const cy = thing.centerAt ? thing.centerAt.y : canvas.height / 2;

    // Calculate centering offset
    thing.mid = new Point(
        cx - thing.scale * ((b.minX + b.maxX) / 2),
        cy - thing.scale * ((b.minY + b.maxY) / 2)
    );

    return b;
} // end autoFitParametricToCanvas

/**
 * measureParametricBounds(thing)
 * Evaluates the curve functions across all sample points to find
 * the mathematical min/max bounding box.
 */
function measureParametricBounds(thing) {
    const { pts, funcX, funcY } = thing;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    for (let i = 0; i < pts.length; i++) {
        const x = funcX(pts[i]), y = funcY(pts[i]);
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    return { minX, maxX, minY, maxY };
} // end measureParametricBounds
