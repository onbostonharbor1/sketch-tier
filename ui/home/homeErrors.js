/* homeErrors.js
   ============================================================
   Home Tab -- the Errors subtab
   ============================================================
   Role:
     Every error from the error logs (ui/errorChecklist.js), oldest
     first, each with a checkbox (homeTickList.js). Ticking writes
     "Acknowledged: ..." to the log and the error leaves the list; Show
     all shows the ticked ones too (greyed, and they stay ticked: an
     error comes back by happening again). Purge ticked writes
     "Purged: ..." lines, and those errors no longer appear at all. The
     logs keep every line (Utilities > Show Logs).

   Exports:
     renderHomeErrors()   fills #text with the list
   ============================================================ */

import { uiState }                               from "/ui/uiState.js";
import { readErrorStates, acknowledge, purge }   from "/ui/errorChecklist.js";
import { renderTickList }                        from "/ui/home/homeTickList.js";


/* renderHomeErrors: read the logs, then show the list. */
export async function renderHomeErrors() {
  const text = document.getElementById("text");
  if (!text) throw new Error("renderHomeErrors: #text not found");
  text.style.display = "block";
  text.innerHTML = "<p>Reading the error logs...</p>";

  const errors = await readErrorStates();
  const open = errors.filter((e) => !e.done).length;
  renderTickList(text, {
    intro: open === 0
      ? "No open errors. Errors stay here until ticked; the logs keep everything (Utilities > Show Logs)."
      : open + (open === 1 ? " open error" : " open errors") + ", oldest first. Tick one when you have dealt with it.",
    items: errors.map((e) => ({ text: e.line + (e.count > 1 ? "  [" + e.count + " times]" : ""), done: e.done, key: e.key })),
    showAll: uiState.home.showAllErrors,
    canUntick: false,
    onShowAll: (on) => { uiState.home.showAllErrors = on; renderHomeErrors(); },
    onTick: async (item) => { await acknowledge(item.key).catch(() => {}); renderHomeErrors(); },
    onPurge: async () => {
      await purge(errors.filter((e) => e.done).map((e) => e.key)).catch(() => {});
      renderHomeErrors();
    }
  });
  text.querySelector(".tick-list").id = "homeErrorsList";
} // end renderHomeErrors

// end homeErrors.js
