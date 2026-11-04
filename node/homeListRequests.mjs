/* ===========================================================
   homeListRequests.mjs  (Node.js)
   -----------------------------------------------------------
   TASK: writeChecklist

   Writes Barry's list of things to check, ./home/checklist.md, shown on
   Home > Checklist (ui/home/homeChecklist.js). The page sends the whole
   file's new text: one item per line, "- [ ] text" or "- [x] text", as
   in GitHub's task lists, so the file reads the same in VS Code.

   The file is replaced atomically (written beside it, then renamed), so
   a failure part way never leaves half a list.

   Payload:  { text: "<the whole file>" }
   Returns:  { request: "writeChecklist", status: "ok", lines: <number> }
   =========================================================== */

import path from "path";
import { writeFileAtomicSync } from "./serviceFileHelpers.mjs";

const MAX_CHARS = 1000000;        // a list, not a book

export async function writeChecklist(payload = {}) {
  const text = payload.text;
  if (typeof text !== "string") throw new Error("writeChecklist: text missing");
  if (text.length > MAX_CHARS) throw new Error("writeChecklist: text must be under " + MAX_CHARS + " characters");
  const file = path.resolve("./home/checklist.md");
  writeFileAtomicSync(file, text.endsWith("\n") ? text : text + "\n", "utf8");
  return { request: "writeChecklist", status: "ok", lines: text.split("\n").length };
} // end writeChecklist
