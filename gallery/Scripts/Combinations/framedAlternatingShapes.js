/* ============================================================
   Framed Alternating Shapes (a combination)
   ============================================================
   Alternating Shapes (Curve Stitch) inside a Frame, as one drawing. Both
   scripts are imported unchanged; combine.js keeps their controls apart
   ("Controls for" picks which set shows) and arms the shapes' handles.
   ============================================================ */
import { makeCombination } from "./lib/combine.js";
import { scriptInfo as shapes } from "../Curve Stitch/alternatingShapes.js";
import { scriptInfo as frame }  from "./frame.js";

export const scriptInfo = makeCombination({
  title: "Framed Alternating Shapes",
  first: shapes, firstName: "Shapes",
  second: frame, secondName: "Frame"
});

/* runPattern: the entry point the script runner calls. */
export function runPattern() {
  scriptInfo.init();
  scriptInfo.redrawHandler();
}
