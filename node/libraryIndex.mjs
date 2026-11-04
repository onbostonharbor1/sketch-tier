/* ===========================================================
   libraryIndex.mjs  (Node.js)
   -----------------------------------------------------------
   TASK: listLibrary -- the category lists, worked out from the folders

   Before this, every list in Sketchpad (Patterns, Gallery, Utilities,
   Figures, saved Draw settings) came from manifest.json files, and a
   list was only as right as its manifest: a file saved without a
   manifest entry did not appear, an entry whose file was gone broke the
   list, and a start-up rebuild (maintain_manifests.mjs) tried to keep
   them in step. Now the folders are the truth:

     - A category is a folder. The order is the one in the folder's
       directoryRegistry.json, then any other folder, A to Z. Folders that
       hold no items are skipped: images, scripts, archive, and any name
       starting with "." or "_" or named "System Volume Information".
     - An item is a file of the right kind in that folder (scripts .js;
       Ideabook and gallery pictures; figures and saved settings .json),
       thumbnails (thumb_*) and the list files themselves excepted.
     - What a file cannot say about itself -- a title different from its
       name, a Home status, the order -- still comes from the folder's
       manifest.json, which is now only that: optional notes. An entry
       whose file is gone is left out. A file with no entry appears, titled
       with its file name, after the listed ones, A to Z.

   So a new file appears the next time the list is read (reload, or
   Rebuild), and nothing can make a list disagree with the folder. There
   is no file watcher (Node's is unreliable on Windows).

   The answer has the shape the page has always read
   (ui/manifest.js): categories in order, and for each the entries
   { filename, path, title, ...notes }.

   Payload:  { basedir }  one of LIBRARIES below
   Returns:  { request: "listLibrary", status: "ok", categories: [name],
               items: [[entry, ...], ...] }   items[i] belongs to categories[i]
   =========================================================== */

import fs from "fs";
import path from "path";

const PICTURES = /\.(png|jpe?g|gif|webp)$/i;
const SCRIPTS  = /\.js$/i;
const JSONS    = /\.json$/i;

// The libraries listed this way, and the files that are items in each.
export const LIBRARIES = {
  "patterns":         SCRIPTS,
  "gallery/Scripts":  SCRIPTS,
  "gallery/Ideabook": PICTURES,
  "gallery/Patterns": PICTURES,
  "utilities/Lab":    SCRIPTS,
  "utilities/Tools":  SCRIPTS,
  "figures":          JSONS,
  "drawRegistry":     JSONS
};

const NOT_CATEGORIES = new Set(["images", "scripts", "archive", "System Volume Information"]);
const NOT_ITEMS = /^(manifest\.json|directoryRegistry\.json|_folder\.json|thumb_.*)$/i;


/* readJsonQuietly: a JSON file's contents, or the fallback if it is
   missing or unreadable (a broken notes file must not break a list). */
function readJsonQuietly(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch (err) { return fallback; }
} // end readJsonQuietly


/* categoriesOf: the category folders of a library, in order. */
export function categoriesOf(baseAbs) {
  if (!fs.existsSync(baseAbs)) return [];
  const folders = fs.readdirSync(baseAbs, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !NOT_CATEGORIES.has(e.name) && !/^[._]/.test(e.name))
    .map((e) => e.name);
  const registry = readJsonQuietly(path.join(baseAbs, "directoryRegistry.json"), []);
  const listed = (Array.isArray(registry) ? registry : []).filter((name) => folders.includes(name));
  const others = folders.filter((name) => !listed.includes(name)).sort((a, b) => a.localeCompare(b));
  return [...listed, ...others];
} // end categoriesOf


/* itemsOf: the items of one category folder, as list entries. */
export function itemsOf(folderAbs, kind) {
  const files = fs.readdirSync(folderAbs, { withFileTypes: true })
    .filter((e) => e.isFile() && kind.test(e.name) && !NOT_ITEMS.test(e.name))
    .map((e) => e.name);
  const notes = readJsonQuietly(path.join(folderAbs, "manifest.json"), []);
  const out = [];
  const used = new Set();
  for (const entry of Array.isArray(notes) ? notes : []) {
    if (!entry || !files.includes(entry.path) || used.has(entry.path)) continue;   // its file is gone
    out.push(entry);
    used.add(entry.path);
  }
  for (const name of files.filter((f) => !used.has(f)).sort((a, b) => a.localeCompare(b))) {
    out.push({ filename: name.replace(/\.[^.]+$/, ""), path: name, title: name });
  }
  return out;
} // end itemsOf


/* listLibrary: the request. */
export async function listLibrary(payload = {}) {
  const basedir = payload.basedir;
  if (!Object.prototype.hasOwnProperty.call(LIBRARIES, basedir)) {
    throw new Error("listLibrary: basedir must be one of " + Object.keys(LIBRARIES).join(", "));
  }
  const baseAbs = path.resolve("./" + basedir);
  const categories = categoriesOf(baseAbs);
  const items = categories.map((c) => itemsOf(path.join(baseAbs, c), LIBRARIES[basedir]));
  return { request: "listLibrary", status: "ok", categories, items };
} // end listLibrary


/* ===========================================================
   TASK: listHomeItems -- the Home list, from the same folders

   Home lists every item that has a status (Queue, fix, Examine,
   favorite, new ...), grouped by status. It used to be home/manifest.json,
   rebuilt from all the other manifests at start-up and after every
   change. Now it is worked out here, on request, from the libraries'
   lists (so an item whose file is gone cannot appear), sorted by title.

   Returns: { request: "listHomeItems", status: "ok",
              items: [ { file, path: "/patterns/polar/polar1.js", title, status } ] }
   =========================================================== */
const HOME_LIBRARIES = ["patterns", "gallery/Scripts", "gallery/Ideabook", "gallery/Patterns",
                        "utilities/Lab", "utilities/Tools", "figures"];

/* listHomeItems: the request (see the header above). */
export async function listHomeItems() {
  const out = [];
  for (const basedir of HOME_LIBRARIES) {
    const baseAbs = path.resolve("./" + basedir);
    for (const category of categoriesOf(baseAbs)) {
      for (const entry of itemsOf(path.join(baseAbs, category), LIBRARIES[basedir])) {
        if (!entry.status) continue;
        out.push({ file: entry.filename || entry.file || "unknown", path: "/" + basedir + "/" + category + "/" + entry.path,
                   title: entry.title || entry.filename || "Untitled", status: entry.status });
      }
    }
  }
  out.sort((a, b) => String(a.title).toLowerCase().localeCompare(String(b.title).toLowerCase()));
  return { request: "listHomeItems", status: "ok", items: out };
} // end listHomeItems
