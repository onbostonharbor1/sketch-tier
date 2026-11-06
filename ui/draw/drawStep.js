/* drawStep.js
   ============================================================
   Draw Tab: step through the drawing (Tier A step 2)
   ============================================================
   Barry's way of finding drawing errors was to step through the drawing
   in the debugger and watch the lines go down one at a time. This does
   the same on the canvas: the object is drawn up to line k only, line k
   is marked in red (with a dot at its start), and the left column says
   which line it is, where its ends are and what colour it was asked for.

   How it works: drawLine is the one door every registry line goes through
   (CLAUDE.md). While drawState.step is set, drawLine counts the lines it
   is asked for, draws only the first `limit`, marks line `limit`, and
   records every line. So stepping needs nothing from the object itself:
   every Draw object can be stepped as it stands.

   Each redraw (a slider moved, a handle dragged) starts the count again:
   drawRunner.js calls beginStepPass before the object draws and
   endStepPass after. Dragging while stepping therefore shows the first k
   lines of the changed drawing.

   The controls sit in the permanent #button column, tagged "tab-extra",
   so clearDivs() removes them on a tab switch; drawLine then sees the
   box is gone and stops stepping (CLAUDE.md: no ad hoc divs).

   Figures (since 6 November 2026): the figure's caption menu has the same
   command. The figure redraw calls beginStepPass, stepLayer before each
   layer, and endStepPass; the whole figure is stepped in drawing order,
   or, with "Active layer only", just the active layer. The readout names
   the layer of the red line.

   Exports:
     startStepping(options)  Draw and Figures caption menus: "Step through the drawing"
     stepLayer(index)  called by the figure redraw before each layer
     stopStepping()
     beginStepPass()   called by drawActiveTab before the object draws
     endStepPass()     called by drawActiveTab after it draws
   ============================================================ */

import { drawState }     from "/draw/drawState.js";
import { drawActiveTab } from "/ui/draw/drawRunner.js";


/* startStepping: draw everything once to count the lines, then show the
   controls with the last line marked. With no arguments it steps the Draw
   tab's object. Figures passes its own redraw and a layer option:
     redraw       the function that draws the whole picture again
     activeLayer  a function giving the active layer's index, when the
                  "Active layer only" box should be offered (Figures) */
export function startStepping({ redraw = drawActiveTab, activeLayer = null } = {}) {
  if (drawState.step) return;                                  // already stepping
  const box = buildControls(activeLayer !== null);
  if (!box) return;
  drawState.step = { limit: Number.MAX_SAFE_INTEGER, count: 0, lines: [], box,
                     redraw, activeLayer, onlyActive: false, counting: true };
  redraw();                                                    // counts every line
  showLine(drawState.step.lines.length);
} // end startStepping


/* stopStepping: remove the controls and draw the whole picture again. */
export function stopStepping() {
  const step = drawState.step;
  drawState.step = null;
  if (step && step.box) step.box.remove();
  (step && step.redraw ? step.redraw : drawActiveTab)();
} // end stopStepping


/* stepLayer: called by the figure redraw before each layer draws. When
   "Active layer only" is ticked, only the active layer's lines are counted
   and stepped; the other layers draw in full. index is the layer number
   from 0. */
export function stepLayer(index) {
  const step = drawState.step;
  if (!step) return;
  step.layer = index;
  step.counting = !step.onlyActive || (step.activeLayer && index === step.activeLayer());
} // end stepLayer


/* beginStepPass: a redraw is starting; count from zero again. */
export function beginStepPass() {
  if (!drawState.step) return;
  drawState.step.count = 0;
  drawState.step.lines = [];
} // end beginStepPass


/* endStepPass: a redraw has finished; bring the slider and the readout up
   to date (the number of lines can change when a setting changes). */
export function endStepPass() {
  if (drawState.step) updateReadout();
} // end endStepPass


/* showLine: draw up to line k (1 is the first line) and update the readout.
   k is kept between 1 and the number of lines. */
function showLine(k) {
  const step = drawState.step;
  if (!step) return;
  const total = Math.max(1, step.lines.length || 1);
  step.limit = Math.min(Math.max(1, Math.round(k)), total);
  step.redraw();
} // end showLine


/* updateReadout: slider range and position, and the words under it. */
function updateReadout() {
  const step = drawState.step;
  const box = step.box;
  const total = step.lines.length;
  const k = Math.min(step.limit, total);
  const slider = box.querySelector("#drawStepSlider");
  slider.max = String(Math.max(1, total));
  slider.value = String(k);
  const line = step.lines[k - 1];
  const where = (p) => "(" + Math.round(p.x) + ", " + Math.round(p.y) + ")";
  box.querySelector("#drawStepText").textContent = total === 0
    ? "This object drew no lines."
    : "Line " + k + " of " + total + (line.layer !== undefined ? " (layer " + (line.layer + 1) + ")" : "") + ": " +
      where(line.a) + " to " + where(line.b) + ", " + line.color;
} // end updateReadout


/* buildControls: the stepping controls, appended to #button. Returns the
   box, or null if #button is missing. */
function buildControls(offerLayerOnly = false) {
  const buttonDiv = document.getElementById("button");
  if (!buttonDiv) return null;

  const box = document.createElement("span");
  box.id = "drawStepBox";
  box.className = "tab-extra";
  box.innerHTML =
    "<br><b>Step through the drawing</b><br>" +
    "<button type='button' id='drawStepFirst' title='First line'>|&lt;</button> " +
    "<button type='button' id='drawStepPrev' title='Previous line'>&lt;</button> " +
    "<button type='button' id='drawStepNext' title='Next line'>&gt;</button> " +
    "<button type='button' id='drawStepLast' title='Last line'>&gt;|</button><br>" +
    "<input type='range' id='drawStepSlider' min='1' max='1' value='1'><br>" +
    (offerLayerOnly ? "<label><input type='checkbox' id='drawStepOnlyActive'> Active layer only</label><br>" : "") +
    "<span id='drawStepText'></span><br>" +
    "<button type='button' id='drawStepDone' class='cmdButton'>Done stepping</button>";
  buttonDiv.appendChild(box);

  const current = () => drawState.step ? drawState.step.limit : 1;
  box.querySelector("#drawStepFirst").onclick = () => showLine(1);
  box.querySelector("#drawStepPrev").onclick  = () => showLine(current() - 1);
  box.querySelector("#drawStepNext").onclick  = () => showLine(current() + 1);
  box.querySelector("#drawStepLast").onclick  = () => showLine(Number.MAX_SAFE_INTEGER);
  box.querySelector("#drawStepSlider").oninput = (e) => showLine(Number(e.target.value));
  box.querySelector("#drawStepDone").onclick  = stopStepping;
  const only = box.querySelector("#drawStepOnlyActive");
  if (only) only.onchange = () => {                            // count again, then show the last line
    drawState.step.onlyActive = only.checked;
    drawState.step.limit = Number.MAX_SAFE_INTEGER;
    drawState.step.redraw();
    showLine(drawState.step.lines.length);
  };
  return box;
} // end buildControls

// end drawStep.js
