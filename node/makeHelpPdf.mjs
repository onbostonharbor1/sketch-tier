/* ===========================================================
   makeHelpPdf.mjs  (Node.js)
   -----------------------------------------------------------
   Makes one PDF of the Help Overview (Design) pages and the Tutorials,
   to read away from the app: a cover, a contents list, then every page.

   Needs the app running (Vite on 5173), because the pages are printed by
   a browser loading them from it, so their styles and pictures appear.

   Run:   npm run help:pdf -- <output.pdf>
          (default output: ./Sketchpad-Help.pdf, which git ignores)

   The order: Overview > Tabs, Subsystems, Design Notes (each A to Z by
   title), then Tutorials 1 to 22.
   =========================================================== */

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const OUT  = path.resolve(process.argv[2] || path.join(ROOT, "Sketchpad-Help.pdf"));


/* pagesIn: the .html files of a help folder, each { file, title }, A to Z by title. */
function pagesIn(rel) {
  const dir = path.join(ROOT, "help", rel);
  return fs.readdirSync(dir).filter((f) => f.endsWith(".html")).map((f) => {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    const m = /<title>([^<]*)<\/title>/i.exec(text);
    return { url: "help/" + rel + "/" + f, title: (m ? m[1] : f).trim(), text };
  }).sort((a, b) => a.title.localeCompare(b.title, "en", { numeric: true }));
} // end pagesIn


/* bodyOf: the inside of a page's body element. */
function bodyOf(text) {
  const m = /<body[^>]*>([\s\S]*)<\/body>/i.exec(text);
  return m ? m[1] : text;
} // end bodyOf


const parts = [
  { heading: "Part 1. Design: Tabs",          pages: pagesIn("Overview/Tabs") },
  { heading: "Part 2. Design: Subsystems",    pages: pagesIn("Overview/Subsystems") },
  { heading: "Part 3. Design: Design Notes",  pages: pagesIn("Overview/Design Notes") },
  { heading: "Part 4. Tutorials",             pages: pagesIn("Tutorials") }
];

let n = 0;
const contents = parts.map((p) => "<h3>" + p.heading + "</h3><ol class='toc'>" +
  p.pages.map((pg) => { pg.id = "pg" + (++n); return "<li><a href='#" + pg.id + "'>" + pg.title + "</a></li>"; }).join("") + "</ol>").join("");
const body = parts.map((p) => "<section class='part'><h1 class='partTitle'>" + p.heading + "</h1></section>" +
  p.pages.map((pg) => "<section class='page' id='" + pg.id + "'>" + bodyOf(pg.text) + "</section>").join("")).join("");
const today = new Date().toISOString().slice(0, 10);
const html = `<!doctype html><html><head><meta charset="utf-8"><base href="${BASE}">
<link rel="stylesheet" href="/help/help_treatise.css">
<style>
  body { margin: 0; }
  .cover { text-align: center; padding-top: 30vh; break-after: page; }
  .cover h1 { font-size: 34pt; margin-bottom: 8pt; }
  .toc { columns: 1; font-size: 10.5pt; }
  .contents { break-after: page; }
  .part { break-before: page; padding-top: 35vh; text-align: center; }
  .partTitle { font-size: 26pt; border: none; }
  .page { break-before: page; }
  img { max-width: 100%; }
  pre { white-space: pre-wrap; }
  table { font-size: 9.5pt; }
</style></head><body>
<div class="cover"><h1>Sketchpad</h1><p style="font-size:16pt">Design pages and tutorials</p>
<p>From the Help Overview and help/Tutorials, branch claude/tier-a, made ${today}.</p></div>
<div class="contents"><h1>Contents</h1>${contents}</div>
${body}
</body></html>`;

const tmp = path.join(ROOT, "help", "_pdfSource.html");     // served by Vite so styles and pictures load
fs.writeFileSync(tmp, html);
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
try {
  const page = await browser.newPage();
  await page.goto(BASE + "help/_pdfSource.html", { waitUntil: "networkidle" });
  await page.pdf({
    path: OUT, format: "Letter", printBackground: true,
    margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: "<div style='font-size:8pt;width:100%;text-align:center;color:#666'>Sketchpad help, page <span class='pageNumber'></span> of <span class='totalPages'></span></div>"
  });
} finally {
  await browser.close();
  fs.rmSync(tmp, { force: true });
}
console.log("Wrote " + OUT + " (" + n + " pages of help in " + parts.length + " parts).");
