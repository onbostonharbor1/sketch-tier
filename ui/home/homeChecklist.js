/* homeChecklist.js
   ============================================================
   Home Tab -- the Checklist subtab: things Barry is to check
   ============================================================
   Role:
     Shows home/checklist.md as a list with checkboxes (homeTickList.js).
     The file is plain Markdown in GitHub's task-list form, so it reads
     the same in VS Code:

         - [ ] T2 Step through the drawing: Draw > Cycloid > ...
         - [x] F1 Figure files: ...

     Any other line (headings, notes) is kept as it is and not shown as
     an item. Ticking or unticking an item, Purge ticked (removes the
     ticked lines) and Add item (a new unticked line at the end) each
     rewrite the file through the Node service (writeChecklist,
     node/homeListRequests.mjs). Show all shows the ticked items too.
     Details of each check are in the docs/CHECKLIST_*.md file named at
     the end of its line.

   Exports:
     parseChecklist(text)    pure: the file's text in, { lines, items } out
     renderHomeChecklist()   fills #text with the list
   ============================================================ */

import { uiState }        from "/ui/uiState.js";
import { nodeDispatch }   from "/ui/nodeLayer.js";
import { renderTickList } from "/ui/home/homeTickList.js";

const FILE = "/home/checklist.md";
const ITEM = /^- \[( |x|X)\] (.*)$/;


/* parseChecklist: the file split into lines, and the items found among
   them, each { text, done, at } where at is its line number. */
export function parseChecklist(text) {
  const lines = String(text).replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
  const items = [];
  lines.forEach((line, at) => {
    const m = ITEM.exec(line);
    if (m) items.push({ text: m[2], done: m[1] !== " ", at });
  });
  return { lines, items };
} // end parseChecklist


/* renderHomeChecklist: read the file, show the list, and wire the changes. */
export async function renderHomeChecklist() {
  const div = document.getElementById("text");
  if (!div) throw new Error("renderHomeChecklist: #text not found");
  div.style.display = "block";

  let text = "";
  try {
    const resp = await fetch(FILE + "?t=" + Date.now());          // never a cached copy
    if (resp.ok) text = await resp.text();
  } catch (err) { text = ""; }
  const { lines, items } = parseChecklist(text);

  // Every change rewrites the whole file, then shows it again.
  const save = async (newLines) => {
    try {
      await nodeDispatch("writeChecklist", { text: newLines.join("\n") + "\n" });
    } catch (err) {
      window.alert("The checklist was not saved: " + err.message);
    }
    renderHomeChecklist();
  };

  const left = items.filter((i) => !i.done).length;
  renderTickList(div, {
    intro: left + " of " + items.length + " checks left. The details of each are in the docs/CHECKLIST file named at its end.",
    items,
    showAll: uiState.home.showAllChecks,
    canUntick: true,
    onShowAll: (on) => { uiState.home.showAllChecks = on; renderHomeChecklist(); },
    onTick: (item, done) => {
      const copy = [...lines];
      copy[item.at] = "- [" + (done ? "x" : " ") + "] " + item.text;
      save(copy);
    },
    onPurge: () => save(lines.filter((line, at) => !items.some((i) => i.at === at && i.done))),
    onAdd: (newText) => save([...lines, "- [ ] " + newText.replace(/[\r\n]+/g, " ")])
  });
  div.querySelector(".tick-list").id = "homeChecklistList";
} // end renderHomeChecklist

// end homeChecklist.js
