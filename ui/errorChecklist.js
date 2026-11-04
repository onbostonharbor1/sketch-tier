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

   Purge ticked (Home > Errors) writes "Purged: ..." lines, and those
   errors no longer appear at all. The log lines themselves are kept.

   Exports:
     errorStates(logTexts)    pure: every error with { key, line, count, done }
     openErrors(logTexts)     pure: the texts of the error logs, oldest
                              first, in; the open errors out, as
                              { key, line, count }, oldest first
     acknowledge(key)         writes the Acknowledged line (Node service)
     purge(keys)              writes the Purged lines (Node service)
     readErrorStates()        reads every error log and returns errorStates
     readOpenErrors()         the same, open errors only
   ------------------------------------------------------------ */

import { nodeDispatch, nodeListLogFiles, nodeReadLogFile } from "/ui/nodeLayer.js";

const ACK = "Acknowledged: ";
const PURGED = "Purged: ";
const TIME = /^(\d{4}-\d\d-\d\d \d\d:\d\d:\d\d) {2}(.*)$/;


/* errorStates: go through every log line in order and work out, for each
   different error, whether it is open or ticked. An error line makes its
   key open (and counts it); an Acknowledged line makes it ticked; a Purged
   line removes it altogether (Purge ticked, on Home > Errors). The key is
   the line without its time and without the "(file:line)" at the end, so
   the same error from another place in the code still matches.
   Returns [{ key, line, count, done }], oldest first. */
export function errorStates(logTexts) {
  const all = new Map();                        // key -> { key, line, count, done }
  for (const text of logTexts) {
    for (const raw of String(text).split(/\r?\n/)) {
      const m = TIME.exec(raw);
      if (!m) continue;                         // the heading line, or blank
      const rest = m[2];
      if (rest.startsWith(ACK)) {
        const e = all.get(rest.slice(ACK.length));
        if (e) e.done = true;
        continue;
      }
      if (rest.startsWith(PURGED)) {
        all.delete(rest.slice(PURGED.length));
        continue;
      }
      const key = rest.replace(/ {2}\([^()]*\)$/, "");
      const old = all.get(key);
      if (old && !old.done) { old.count++; old.line = raw; }
      else {
        all.delete(key);                        // reported again after a tick: open again, at the end
        all.set(key, { key, line: raw, count: 1, done: false });
      }
    }
  }
  return [...all.values()];
} // end errorStates


/* openErrors: the errors not yet ticked, as { key, line, count }. */
export function openErrors(logTexts) {
  return errorStates(logTexts).filter((e) => !e.done).map(({ key, line, count }) => ({ key, line, count }));
} // end openErrors


/* purge: write "Purged: <key>" for each key, so those errors no longer
   appear, even with Show all. The log lines themselves are kept: a log is
   history. */
export async function purge(keys) {
  if (!keys.length) return;
  await nodeDispatch("appendErrorLog", { entries: keys.map((k) => ({ where: "Purged", message: k, place: "" })) });
} // end purge


/* acknowledge: write "Acknowledged: <key>" to today's error log. key is the
   error as openErrors gives it, or "where: message" from the error bar. */
export async function acknowledge(key) {
  await nodeDispatch("appendErrorLog", { entries: [{ where: "Acknowledged", message: key, place: "" }] });
} // end acknowledge


/* readErrorStates: every error from every error log the service lists,
   read oldest first, with its state (errorStates). Without the Node
   service, an empty list. */
export async function readErrorStates() {
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
  return errorStates(texts);
} // end readErrorStates


/* readOpenErrors: the errors not yet ticked (for Home's alert). */
export async function readOpenErrors() {
  return (await readErrorStates()).filter((e) => !e.done);
} // end readOpenErrors

// end errorChecklist.js
