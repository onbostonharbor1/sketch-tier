/* ===========================================================
   copyBuildDocs.mjs  (Node.js)
   -----------------------------------------------------------
   Fills help/BuildDocs, the "Build Documents" group of Home > Help,
   from the build documents in docs/:

     docs/<name>.md   becomes help/BuildDocs/<name>.html, converted to
                      HTML here (a browser shows Markdown as plain text)
     docs/<name>.pdf  becomes help/BuildDocs/<name>.html, a small page
                      that shows docs/<name>.pdf in a frame (the PDF is
                      not copied: 9 MB twice in the repository for nothing)

   help/BuildDocs is emptied first, so a document removed from docs/
   leaves Build Documents too. Run it after the docs change:
       npm run help:builddocs
   docs/build (the scripts that make the PDFs) is not a document and is
   not copied.

   The Markdown converter is deliberately small: headings, paragraphs,
   bulleted and numbered lists, tables, fenced code, quotes, rules, and
   **bold**, *italic*, `code`, [links](url) and ![pictures](url) inside lines. Anything it
   does not know is shown as plain text, never dropped.

   Exports (for tests): markdownToHtml(text), titleOf(text, fallback)
   =========================================================== */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = process.env.SKETCHPAD_ROOT ? path.resolve(process.env.SKETCHPAD_ROOT)
                                        : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");


/* escapeHtml: text made safe to put inside HTML. */
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
} // end escapeHtml


/* inline: the marks inside one line of text: `code`, **bold**, *italic*,
   [text](link). Code is handled first so marks inside it stay as typed. */
function inline(text) {
  const parts = String(text).split(/(`[^`]*`)/);
  return parts.map((part) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) return "<code>" + escapeHtml(part.slice(1, -1)) + "</code>";
    return escapeHtml(part)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, "<img src=\"$2\" alt=\"$1\" style=\"max-width:100%;border:1px solid #999\">")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "<a href=\"$2\">$1</a>");
  }).join("");
} // end inline


/* tableRow: the cells of one Markdown table line ("| a | b |"). */
function tableRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
} // end tableRow


/* markdownToHtml: a Markdown document as the HTML of a page body.
   Works line by line, collecting a block (paragraph, list, table, code)
   until a line that ends it. */
export function markdownToHtml(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    // Fenced code: everything up to the closing ``` as typed.
    if (line.trim().startsWith("```")) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      out.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
      continue;
    }

    // Heading: # to ######.
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) { out.push("<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">"); i++; continue; }

    // Rule.
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

    // Table: a | line followed by a |---| line.
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = tableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(tableRow(lines[i++]));
      out.push("<table><thead><tr>" + head.map((c) => "<th>" + inline(c) + "</th>").join("") + "</tr></thead><tbody>" +
               rows.map((r) => "<tr>" + r.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>").join("") +
               "</tbody></table>");
      continue;
    }

    // Lists: "- ", "* " or "1. " at the start; indented lines continue an item.
    const bullet = /^\s*([-*]|\d+\.)\s+(.*)$/;
    if (bullet.test(line)) {
      const numbered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && (bullet.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const m = bullet.exec(lines[i]);
        if (m) items.push(m[2]); else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      const tag = numbered ? "ol" : "ul";
      out.push("<" + tag + ">" + items.map((t) => "<li>" + inline(t.replace(/^\[( |x)\]\s*/i, (m0, x) => (x === " " ? "&#9744; " : "&#9745; "))) + "</li>").join("") + "</" + tag + ">");
      continue;
    }

    // Quote.
    if (line.startsWith(">")) {
      const q = [];
      while (i < lines.length && lines[i].startsWith(">")) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push("<blockquote>" + inline(q.join(" ")) + "</blockquote>");
      continue;
    }

    // Paragraph: lines up to a blank line or the start of another block.
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|```|\s*([-*]|\d+\.)\s|\|)/.test(lines[i])) para.push(lines[i++]);
    if (para.length === 0) para.push(lines[i++]);     // a line no rule above took: keep it as text
    out.push("<p>" + inline(para.join(" ")) + "</p>");
  }
  return out.join("\n");
} // end markdownToHtml


/* titleOf: the first heading of a Markdown document, else the fallback. */
export function titleOf(text, fallback) {
  const m = /^#{1,6}\s+(.*)$/m.exec(String(text));
  return m ? m[1].replace(/[`*]/g, "").trim() : fallback;
} // end titleOf


/* page: a complete help page around a body. */
function page(title, body) {
  return "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <title>" + escapeHtml(title) +
         "</title>\n  <link rel=\"stylesheet\" href=\"/help/help.css\" />\n</head>\n<body>\n" + body + "\n</body>\n</html>\n";
} // end page


/* copyBuildDocs: empty help/BuildDocs and fill it again from docs/. */
function copyBuildDocs() {
  const docs = path.join(ROOT, "docs"), target = path.join(ROOT, "help", "BuildDocs");
  fs.mkdirSync(target, { recursive: true });
  for (const f of fs.readdirSync(target)) fs.rmSync(path.join(target, f), { force: true });
  let count = 0;
  for (const f of fs.readdirSync(docs).sort()) {
    const full = path.join(docs, f), base = f.replace(/\.(md|pdf)$/i, "");
    if (/\.md$/i.test(f)) {
      const text = fs.readFileSync(full, "utf8");
      const note = "<p class=\"buildDocSource\"><em>Copied from docs/" + escapeHtml(f) + " by npm run help:builddocs.</em></p>\n";
      fs.writeFileSync(path.join(target, base + ".html"), page(titleOf(text, base), note + markdownToHtml(text)));
      count++;
    } else if (/\.pdf$/i.test(f)) {
      const body = "<h1>" + escapeHtml(base.replace(/-/g, " ")) + "</h1>\n<p><a href=\"/docs/" + encodeURI(f) + "\" target=\"_blank\">Open the PDF on its own</a></p>\n" +
                   "<iframe src=\"/docs/" + encodeURI(f) + "\" style=\"width:100%;height:85vh;border:1px solid #999\"></iframe>";
      fs.writeFileSync(path.join(target, base + ".html"), page(base.replace(/-/g, " "), body));
      count++;
    }
  }
  return count;
} // end copyBuildDocs

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log("help/BuildDocs: " + copyBuildDocs() + " documents from docs/.");
}
