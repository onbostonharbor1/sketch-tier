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

   Exports:
     startStepping()   Draw caption menu: "Step through the drawing"
     stopStepping()
     beginStepPass()   called by drawActiveTab before the object draws
     endStepPass()     called by drawActiveTab after it draws
   ============================================================ */

import { drawState }     from "/draw/drawState.js";
import { drawActiveTab } from "/ui/draw/drawRunner.js";


/* startStepping: draw everything once to count the lines, then show the
   controls with the last line marked. */
export function startStepping() {
  if (drawState.step) return;                                  // already stepping
  const box = buildControls();
  if (!box) return;
  drawState.step = { limit: Number.MAX_SAFE_INTEGER, count: 0, lines: [], box };
  drawActiveTab();                                             // counts every line
  showLine(drawState.step.lines.length);
} // end startStepping


/* stopStepping: remove the controls and draw the whole object again. */
export function stopStepping() {
  const step = drawState.step;
  drawState.step = null;
  if (step && step.box) step.box.remove();
  drawActiveTab();
} // end stopStepping


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
  drawActiveTab();
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
    : "Line " + k + " of " + total + ": " + where(line.a) + " to " + where(line.b) + ", " + line.color;
} // end updateReadout


/* buildControls: the stepping controls, appended to #button. Returns the
   box, or null if #button is missing. */
function buildControls() {
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
  return box;
} // end buildControls

// end drawStep.js
