/* homeHelp.js
   ============================================================
   Home Tab -- the Help subtab: Design, Reflections, Build Documents
   ============================================================
   Role:
     A notes and information viewer laid out like the Help browser: a
     contents tree on the left (jsTree, as in ui/helpTree.js) and the
     chosen page on the right. Three groups:

       Design            the pages of help/Overview (the Help browser's
                         Overview), by their subfolders
       Reflections       Barry's own topics, help/Reflections, listed by
                         title, A to Z
       Build Documents   help/BuildDocs, A to Z: the build documents of
                         docs/, copied and converted to HTML by
                         npm run help:builddocs (node/copyBuildDocs.mjs)

     "New reflection..." asks for a title, creates help/Reflections/
     <name>.html, and opens it in the help editor (TinyMCE, the same
     editor the Help browser uses: ui/helpEditor.js). "Edit" edits the
     chosen reflection. Design and Build Documents are read here, not
     edited (Design is edited from the Help browser; Build Documents
     are remade from docs/).

     The lists come from the Node service (listHelpTopics,
     node/homeListRequests.mjs), so a new topic shows at once.

   Exports:
     renderHomeHelp()   fills #text with the tree and the page pane
     reflectionFileName(title)   pure: a title as a safe file name
   ============================================================ */

import "/ui/helpTree.js";                        // loads jQuery and jsTree (window.$)
import { nodeDispatch }                          from "/ui/nodeLayer.js";

const GROUPS = [
  { id: "design",      label: "Design",          folder: "Overview" },
  { id: "reflections", label: "Reflections",     folder: "Reflections" },
  { id: "builddocs",   label: "Build Documents", folder: "BuildDocs" }
];


/* reflectionFileName: a title turned into a file name: letters, digits
   and spaces kept, everything else dropped, spaces as underscores. */
export function reflectionFileName(title) {
  const base = String(title).trim().replace(/[^A-Za-z0-9 ]+/g, "").replace(/\s+/g, "_").slice(0, 60);
  return (base || "Reflection") + ".html";
} // end reflectionFileName


/* topicsOf: the topics of one help folder, A to Z by title. */
async function topicsOf(folder) {
  try {
    const r = await nodeDispatch("listHelpTopics", { folder });
    return (r.topics || []).sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    return [];                                   // no Node service: an empty group
  }
} // end topicsOf


/* treeData: the jsTree nodes. Design keeps the Overview subfolders as
   branches; the other two groups are flat, A to Z. A leaf's id is its
   page path, so a click knows what to load. */
function treeData(lists) {
  return GROUPS.map((g) => {
    const topics = lists[g.id];
    let children;
    if (g.id === "design") {
      const groups = [...new Set(topics.map((t) => t.group))].sort();
      children = groups.map((name) => ({
        text: name || "(top)", state: { opened: false },
        children: topics.filter((t) => t.group === name).map((t) => ({ id: t.path, text: t.title, icon: "jstree-file" }))
      }));
    } else {
      children = topics.map((t) => ({ id: t.path, text: t.title, icon: "jstree-file" }));
    }
    return { id: "group-" + g.id, text: g.label + " (" + topics.length + ")", state: { opened: g.id !== "design" }, children };
  });
} // end treeData


/* showPage: load one help page into the right pane (its <body> only). */
async function showPage(pane, helpPath) {
  try {
    const resp = await fetch(helpPath + "?t=" + Date.now());
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const doc = new DOMParser().parseFromString(await resp.text(), "text/html");
    pane.innerHTML = doc.body ? doc.body.innerHTML : "";
  } catch (err) {
    pane.textContent = "Could not show " + helpPath + ": " + err.message;
  }
} // end showPage


/* renderHomeHelp: the buttons, the tree and the page pane, side by side. */
export async function renderHomeHelp() {
  const text = document.getElementById("text");
  if (!text) throw new Error("renderHomeHelp: #text not found");
  text.style.display = "block";
  text.innerHTML = "";

  const newBtn = document.createElement("button");
  newBtn.type = "button";
  newBtn.className = "cmdButton";
  newBtn.id = "homeHelpNew";
  newBtn.textContent = "New reflection...";
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "cmdButton";
  editBtn.id = "homeHelpEdit";
  editBtn.textContent = "Edit";
  editBtn.disabled = true;
  editBtn.title = "Edit the chosen reflection";

  const row = document.createElement("div");
  row.style.cssText = "display:flex; gap:12px; align-items:flex-start; margin-top:8px;";
  const tree = document.createElement("div");
  tree.id = "homeHelpTree";
  tree.style.cssText = "flex:0 0 300px; max-height:80vh; overflow:auto; border-right:1px solid #ccc;";
  const pane = document.createElement("div");
  pane.id = "homeHelpPane";
  pane.style.cssText = "flex:1 1 auto; max-height:80vh; overflow:auto;";
  pane.textContent = "Choose a topic on the left.";
  row.append(tree, pane);
  text.append(newBtn, " ", editBtn, row);

  const lists = {};
  for (const g of GROUPS) lists[g.id] = await topicsOf(g.folder);

  let chosen = null;                             // { path, title } of the page shown
  const $tree = window.$(tree);
  $tree.jstree({ core: { data: treeData(lists), themes: { dots: false } } });
  $tree.on("select_node.jstree", (evt, data) => {
    const id = data.node.id;
    if (!id.startsWith("/help/")) return;      // a group or a subfolder
    chosen = { path: id, title: data.node.text };
    editBtn.disabled = !id.startsWith("/help/Reflections/");
    showPage(pane, id);
  });

  newBtn.onclick = async () => {
    const title = (window.prompt("Title of the new reflection:") || "").trim();
    if (!title) return;
    const file = reflectionFileName(title);
    const helpPath = "/help/Reflections/" + file;
    if (lists.reflections.some((t) => t.path === helpPath)) {
      window.alert("A reflection already uses the file " + file + ". Choose another title.");
      return;
    }
    // The help editor (and TinyMCE with it) is loaded only when needed.
    const { buildFullHelpHtmlDocument, openHelpEditorTinyMCE } = await import("/ui/helpEditor.js");
    const body = "<h1>" + title.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</h1>\n<p></p>";
    try {
      await nodeDispatch("writeHelpFile", { helpPath, html: buildFullHelpHtmlDocument(title, file, body) });
    } catch (err) {
      window.alert("The reflection was not created: " + err.message);
      return;
    }
    await renderHomeHelp();                      // the new title appears under Reflections
    openHelpEditorTinyMCE(helpPath, title, { initialBodyHtml: body });
  };

  editBtn.onclick = async () => {
    if (!chosen) return;
    const { openHelpEditorTinyMCE } = await import("/ui/helpEditor.js");
    const resp = await fetch(chosen.path + "?t=" + Date.now());
    const doc = new DOMParser().parseFromString(await resp.text(), "text/html");
    openHelpEditorTinyMCE(chosen.path, chosen.title, { initialBodyHtml: doc.body ? doc.body.innerHTML : "" });
  };
} // end renderHomeHelp

// end homeHelp.js
