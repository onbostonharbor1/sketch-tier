/* ui/errorChecklist.js
   ------------------------------------------------------------
   Errors as a checklist (Tier A step 3).

   An error stays on the list until Barry ticks it. Ticking writes a line
   to the error log, so the log keeps the whole history and the list can
   be worked out again after a restart:

       2026-11-03 10:12:40  Draw tab, Cycloid: x is undefined  (draw/drawRegular.js:88)
       2026-11-03 10:20:02  Acknowledged: Draw tab, Cycloid: x is undefined

   An error is "open" while some line reporting it has no later
   Acknowledged line with the same text. The same error reported again
   after it was ticked is open again.

   The Home tab's Errors subtab (ui/home/homeErrors.js) lists the open
   errors from every error log; the red error bar (ui/errorReport.js)
   ticks the errors of this session.

   Exports:
     openErrors(logTexts)     pure: the texts of the error logs, oldest
                              first, in; the open errors out, as
                              { key, line, count }, oldest first
     acknowledge(key)         writes the Acknowledged line (Node service)
     readOpenErrors()         reads every error log and returns openErrors
   ------------------------------------------------------------ */

import { nodeDispatch, nodeListLogFiles, nodeReadLogFile } from "/ui/nodeLayer.js";

const ACK = "Acknowledged: ";
const TIME = /^(\d{4}-\d\d-\d\d \d\d:\d\d:\d\d) {2}(.*)$/;


/* openErrors: go through every log line in order. An error line adds to
   its key's count; an Acknowledged line clears that key. The key is the
   line without its time and without the "(file:line)" at the end, so the
   same error from another place in the code still matches. */
export function openErrors(logTexts) {
  const open = new Map();                       // key -> { key, line, count }
  for (const text of logTexts) {
    for (const raw of String(text).split(/\r?\n/)) {
      const m = TIME.exec(raw);
      if (!m) continue;                         // the heading line, or blank
      const rest = m[2];
      if (rest.startsWith(ACK)) {
        open.delete(rest.slice(ACK.length));
        continue;
      }
      const key = rest.replace(/ {2}\([^()]*\)$/, "");
      const old = open.get(key);
      if (old) { old.count++; old.line = raw; }
      else open.set(key, { key, line: raw, count: 1 });
    }
  }
  return [...open.values()];
} // end openErrors


/* acknowledge: write "Acknowledged: <key>" to today's error log. key is the
   error as openErrors gives it, or "where: message" from the error bar. */
export async function acknowledge(key) {
  await nodeDispatch("appendErrorLog", { entries: [{ where: "Acknowledged", message: key, place: "" }] });
} // end acknowledge


/* readOpenErrors: the open errors from every error log the service lists,
   read oldest first. Without the Node service, an empty list. */
export async function readOpenErrors() {
  let files;
  try {
    files = (await nodeListLogFiles(1000)).files || [];
  } catch (err) {
    return [];
  }
  const names = files.map((f) => f.name).filter((n) => n.startsWith("errors_")).sort();
  const texts = [];
  for (const name of names) {
    try { texts.push((await nodeReadLogFile(name)).text || ""); }
    catch (err) { /* a log that cannot be read is skipped */ }
  }
  return openErrors(texts);
} // end readOpenErrors

// end errorChecklist.js
