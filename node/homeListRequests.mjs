/* ===========================================================
   homeListRequests.mjs  (Node.js)
   -----------------------------------------------------------
   Home tab requests: writeChecklist (Home > Checklist) and
   listHelpTopics (Home > Help).

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

import fs from "fs";
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


/* ===========================================================
   TASK: listHelpTopics

   The topics in one help folder, for Home > Help (ui/home/homeHelp.js):
   every .html file under help/<folder>, with the title from its <title>
   (or its file name), and the subfolder it is in ("" at the top).
   Only the three folders Home > Help shows may be asked for.

   Payload:  { folder: "Overview" | "Reflections" | "BuildDocs" }
   Returns:  { request: "listHelpTopics", status: "ok",
               topics: [ { path: "/help/Overview/Tabs/draw.html", title, group: "Tabs" } ] }
   =========================================================== */
const HELP_FOLDERS = ["Overview", "Reflections", "BuildDocs"];

export async function listHelpTopics(payload = {}) {
  const folder = payload.folder;
  if (!HELP_FOLDERS.includes(folder)) throw new Error("listHelpTopics: folder must be one of " + HELP_FOLDERS.join(", "));
  const base = path.resolve("./help", folder);
  const topics = [];
  const walk = (dir, group) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full, group ? group + "/" + entry.name : entry.name); continue; }
      if (!/\.html$/i.test(entry.name)) continue;
      const text = fs.readFileSync(full, "utf8");
      const m = /<title>([^<]*)<\/title>/i.exec(text);
      const title = (m && m[1].trim()) || entry.name.replace(/\.html$/i, "");
      topics.push({ path: "/help/" + folder + "/" + (group ? group + "/" : "") + entry.name, title: decodeEntities(title), group });
    }
  };
  walk(base, "");
  return { request: "listHelpTopics", status: "ok", topics };
} // end listHelpTopics


/* decodeEntities: the few HTML entities a title is likely to hold. */
function decodeEntities(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
} // end decodeEntities
