/* homeNotes.js
   ============================================================
   Home Tab -- the Notes subtab (Tier A step 3)
   ============================================================
   Role:
     Shows Barry's notes and to-do list, home/notes.md, a plain text file
     he edits in VS Code. "Open in VS Code" opens it there (through the
     Node service's openInEditor); "Reload" shows the saved text again.
     The file is never written from here.

   Exports:
     renderHomeNotes()   fills #text with the notes
   ============================================================ */

import { nodeDispatch } from "/ui/nodeLayer.js";

const NOTES_FILE = "/home/notes.md";


/* renderHomeNotes: the two buttons and the file's text as it stands. */
export async function renderHomeNotes() {
  const text = document.getElementById("text");
  if (!text) throw new Error("renderHomeNotes: #text not found");
  text.style.display = "block";
  text.innerHTML = "";

  const open = document.createElement("button");
  open.type = "button";
  open.className = "cmdButton";
  open.textContent = "Open in VS Code";
  const reload = document.createElement("button");
  reload.type = "button";
  reload.className = "cmdButton";
  reload.textContent = "Reload";
  const status = document.createElement("span");
  const body = document.createElement("pre");
  body.id = "homeNotesText";
  body.style.whiteSpace = "pre-wrap";

  open.onclick = async () => {
    try {
      const r = await nodeDispatch("openInEditor", { editor: "vscode", file: NOTES_FILE });
      status.textContent = r && r.status === "ok" ? "" : " Could not open the editor.";
    } catch (err) {
      status.textContent = " Could not open the editor (is the Node service running?).";
    }
  };
  reload.onclick = renderHomeNotes;

  text.append(open, " ", reload, status, body);

  try {
    const resp = await fetch(NOTES_FILE + "?t=" + Date.now());      // never a cached copy
    body.textContent = resp.ok ? await resp.text() : "No notes yet: " + NOTES_FILE + " is missing.";
  } catch (err) {
    body.textContent = "Could not read " + NOTES_FILE + ".";
  }
} // end renderHomeNotes

// end homeNotes.js
