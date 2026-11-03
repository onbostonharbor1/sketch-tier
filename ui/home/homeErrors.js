/* homeErrors.js
   ============================================================
   Home Tab -- the Errors subtab (Tier A step 3)
   ============================================================
   Role:
     Lists every error not yet acknowledged, from all the error logs
     (ui/errorChecklist.js), newest last, each with a Tick button.
     Ticking writes "Acknowledged: ..." to the log, and the error leaves
     the list. An error reported again after it was ticked comes back.

   Exports:
     renderHomeErrors()   fills #text with the checklist
   ============================================================ */

import { readOpenErrors, acknowledge } from "/ui/errorChecklist.js";


/* renderHomeErrors: the checklist, or a line saying there is nothing open. */
export async function renderHomeErrors() {
  const text = document.getElementById("text");
  if (!text) throw new Error("renderHomeErrors: #text not found");
  text.style.display = "block";
  text.innerHTML = "<p>Reading the error logs...</p>";

  const open = await readOpenErrors();
  text.innerHTML = "";

  const head = document.createElement("p");
  head.textContent = open.length === 0
    ? "No open errors. (Errors stay here until ticked; the logs keep everything: Utilities > Show Logs.)"
    : open.length + (open.length === 1 ? " open error" : " open errors") + ", oldest first. Tick one when you have dealt with it.";
  text.appendChild(head);
  if (open.length === 0) return;

  const all = document.createElement("button");
  all.type = "button";
  all.id = "homeErrorsTickAll";
  all.className = "cmdButton";
  all.textContent = "Tick all";
  all.onclick = async () => {
    for (const e of open) await acknowledge(e.key).catch(() => {});
    renderHomeErrors();
  };
  text.appendChild(all);

  const ul = document.createElement("ul");
  ul.id = "homeErrorsList";
  for (const e of open) {
    const li = document.createElement("li");
    li.textContent = e.line + (e.count > 1 ? "  [" + e.count + " times]" : "") + "  ";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Tick";
    btn.onclick = async () => {
      await acknowledge(e.key).catch(() => {});
      renderHomeErrors();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  }
  text.appendChild(ul);
} // end renderHomeErrors

// end homeErrors.js
