/* tests/functionDictionary.mjs
   ============================================================
   The function dictionary: every named function in Sketchpad's own code,
   alphabetically, with its file and line and the first sentence of the
   comment just above it. Written to docs/FUNCTIONS.md.
   ============================================================
   Barry asked for an alphabetical dictionary of functions with a line or
   two each. Kept by hand it would go stale; made from the comments it
   cannot. A function with no comment above it is listed with
   "(no comment)", which shows where a block comment is still owed.

   What counts: "function name(" and "async function name(" declarations,
   exported or not, in ui/, draw/, classes/, drawRegistry/ and node/.
   Arrow functions held in variables are not listed.

   The comment used is the block (slash-star ... star-slash) or the run of // lines ending
   on the line just above the function (a blank line in between is allowed).
   Lines made only of = - * characters, and a line repeating the function's
   own name, are skipped, so the first real sentence is shown. If there is
   no comment above, a comment written first inside the function is used.

   Run: npm run dictionary
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./scriptList.mjs";

const FOLDERS = ["ui", "draw", "classes", "drawRegistry", "node"];
const DECL = /^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/;


/* filesIn: every .js and .mjs file under a folder, recursively. */
function filesIn(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesIn(full));
    else if (/\.m?js$/.test(entry.name)) out.push(full);
  }
  return out;
} // end filesIn


/* commentAbove: the comment lines just above line index i, as plain text
   lines (comment marks removed), or [] if there is none. */
function commentAbove(lines, i) {
  let j = i - 1;
  while (j >= 0 && lines[j].trim() === "") j--;
  if (j < 0) return [];
  const out = [];
  if (lines[j].trim().endsWith("*/")) {
    while (j >= 0) {
      out.unshift(lines[j]);
      if (lines[j].includes("/*")) break;
      j--;
    }
    return out.map((l) => l.replace(/\/\*+|\*+\//g, "").replace(/^\s*\*\s?/, "").trim());
  }
  while (j >= 0 && lines[j].trim().startsWith("//")) { out.unshift(lines[j].trim().replace(/^\/\/+\s?/, "")); j--; }
  return out;
} // end commentAbove


/* commentInside: a comment written as the first thing inside the function
   (older code puts its description there), or [] if there is none. */
function commentInside(lines, i) {
  let j = i + 1;
  while (j < lines.length && lines[j].trim() === "") j++;
  if (j >= lines.length) return [];
  const t = lines[j].trim();
  if (t.startsWith("/*")) {
    const out = [];
    while (j < lines.length) { out.push(lines[j]); if (lines[j].includes("*/")) break; j++; }
    return out.map((l) => l.replace(/\/\*+|\*+\//g, "").replace(/^\s*\*\s?/, "").trim()).filter((l) => !l.startsWith("@"));
  }
  const out = [];
  while (j < lines.length && lines[j].trim().startsWith("//")) { out.push(lines[j].trim().replace(/^\/\/+\s?/, "")); j++; }
  return out;
} // end commentInside


/* summaryOf: the first sentence worth reading from a comment. */
function summaryOf(comment, name) {
  const useful = comment.filter((l) => l !== "" && !/^[=\-*_#\s]+$/.test(l) && !new RegExp("^" + name + "\\s*(\\(|$)").test(l));
  if (!useful.length) return "(no comment)";
  let text = useful.slice(0, 3).join(" ");
  const stop = text.search(/\.(\s|$)/);
  if (stop > 0) text = text.slice(0, stop + 1);
  text = text.replace(new RegExp("^" + name + "\\s*:\\s*"), "");
  return text.length > 160 ? text.slice(0, 157) + "..." : text;
} // end summaryOf


const entries = [];
for (const folder of FOLDERS) {
  for (const file of filesIn(path.join(ROOT, folder))) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      const m = DECL.exec(line);
      if (!m) return;
      let summary = summaryOf(commentAbove(lines, i), m[1]);
      if (summary === "(no comment)") summary = summaryOf(commentInside(lines, i), m[1]);
      entries.push({ name: m[1], where: path.relative(ROOT, file).split(path.sep).join("/") + ":" + (i + 1), summary });
    });
  }
}
entries.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }) || a.where.localeCompare(b.where));

const owed = entries.filter((e) => e.summary === "(no comment)").length;
let md = "# Function dictionary\n\nMade by `npm run dictionary` from the comments above each function " +
         "(tests/functionDictionary.mjs). Do not edit by hand: change the comment, then run it again.\n\n" +
         `${entries.length} functions in ${FOLDERS.join(", ")}; ${owed} without a comment above them.\n\n` +
         "| Function | Where | What it does |\n|---|---|---|\n";
for (const e of entries) md += `| \`${e.name}\` | ${e.where} | ${e.summary.replace(/\|/g, "\\|")} |\n`;
fs.writeFileSync(path.join(ROOT, "docs", "FUNCTIONS.md"), md);
console.log(`docs/FUNCTIONS.md: ${entries.length} functions, ${owed} without a comment.`);
