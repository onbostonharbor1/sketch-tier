/* figureDraw.js
   ============================================================
   Figures Tab -- Drawing a Figure
   ============================================================
   Role:
     redrawFigure(), the one place a figure is drawn. Moved here from
     figureLayers.js (2026-11-01), unchanged.

   Drawing: visible layers bottom to top, i.e. drawOrder backwards.
   Every layer except the active one is dimmed (DIM_ALPHA) while
   editing, and so are its discs (DISC_DIM_ALPHA in figurePoints.js).
   Dimming is skipped, and hidden layers are drawn, when
   drawState.final is set or the tab is in preview (Show All), or
   when redrawFigure is called with { dim: false }. Points mode obeys
   the same rules; it only changes what each layer draws (just its
   points) and what a click does.

   Controls: the active layer's controls are built with the same
   buildParameterControls() the Draw tab uses.

   What is on screen, in front-to-back order (each its own canvas,
   stacked; see canvasLayerManager.js):
     interaction  the active object's handles (interactor.js), and in
                  points mode the mouse input (figurePointer.js)
     bbox         the centroid diamond, box and rotation handle
                  (figureCentroid.js)
     main canvas  the layers, then the discs, then the weld marks
                  (redrawFigure below)

   Exports:
     redrawFigure(tabId, { dim })
   ============================================================ */

import { resetCanvas, drawState } from "/draw/drawState.js";
import { newBounds }              from "/draw/drawTransform.js";
import { refreshPoints, drawFigurePoints } from "./figurePoints.js";
import { drawCentroid }           from "./figureCentroid.js";
import { drawWeldMarks }          from "./figureWeldMarks.js";
import { drawMagicMarks }         from "./figureMagic.js";

// Alpha for layers that are not the active one.
const DIM_ALPHA = 0.2;


/* ============================================================
   redrawFigure(tabId)
   ------------------------------------------------------------
   Clears the canvas and draws every visible layer, bottom to top.
   A layer that throws is reported with its index and skipped.

   This is the one place a figure is drawn. Nearly every change ends
   by calling it: a slider, a handle drag (through
   instance.redrawHandler), a disc click, a weld, a mode switch. It
   draws in three passes:
     1. the layers (each object's own draw(), through drawLine)
     2. the discs (figurePoints.js), after recomputing where anchored
        ones now are
     3. the weld marks (figureWelds.js), then the centroid overlay
   ============================================================ */
export function redrawFigure(tabId, { dim = true } = {}) {

  const tabState = uiState.figures.tabs[tabId];
  if (!tabState || !tabState.figure) return;

  resetCanvas();

  const figure    = tabState.figure;
  const instances = tabState.instances || [];
  // Preview (the Show All checkbox, not saved) and final mode draw every
  // layer at full strength, hidden ones included. Layers of kind "template"
  // (guides, a later phase) are left out of both. Points mode sets
  // drawState.final while the layers draw, so they show only their points
  // (one flag, set here, restored below), but it follows the same
  // visibility and dimming rules as lines mode.
  const pointsMode = tabState.mode === "points";
  const showAll    = drawState.final || !!tabState.preview;
  const dimming    = dim && !showAll;
  const wasFinal   = drawState.final;
  if (pointsMode) drawState.final = true;

  // drawOrder is top first; paint bottom to top.
  for (let k = figure.drawOrder.length - 1; k >= 0; k--) {
    const i = figure.drawOrder[k];
    if (showAll && figure.layers[i].kind === "template") continue;
    if (!figure.layers[i].visible && !showAll) continue;

    const inst = instances[i];
    // save()/restore() bracket each layer so its alpha (dimming) and any
    // style it sets do not leak into the next layer.
    ctx.save();
    if (dimming && i !== figure.activeLayer) ctx.globalAlpha = DIM_ALPHA;
    // drawLine maps what the object draws through this layer's transform and
    // notes its extent in drawState.bounds. Both are null again afterwards.
    drawState.transform = figure.layers[i].transform || null;
    drawState.bounds    = newBounds();
    // update() first: it brings the object's internal geometry in line
    // with its params (a slider or a handle may have changed them).
    try {
      inst.update(inst.params);
      inst.draw();
    } catch (err) {
      console.error(`Figure layer ${i + 1} (${figure.layers[i].id}) failed to draw:`, err);
    }
    inst.bounds         = drawState.bounds;    // kept for figureCentroid.js
    drawState.transform = null;
    drawState.bounds    = null;
    ctx.restore();
  }

  drawState.final = wasFinal;

  // Discs are always shown, in both modes, by the same visibility and dimming
  // rules as the layers. Anchored ones follow their layers, so refresh first.
  refreshPoints(tabState);
  drawFigurePoints(tabState, { showAll, dimming });
  drawMagicMarks(tabState);           // points mode only: where the magic points are
  drawWeldMarks(tabState);

  // The active layer's centroid, and its box and rotation handle when selected.
  drawCentroid(tabState);

} // end redrawFigure

// end figureDraw.js
