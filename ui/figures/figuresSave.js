/* figuresSave.js
   ============================================================
   Figures Tab -- Save, Save As and Open (Phase 10)
   ============================================================
   Role:
     Saves a figure through the Node service and opens a saved one.
     A saved figure is a JSON file, figures/<category>/<name>.json,
     with its status in the category's manifest.json (the Node side
     is node/figureFiles.mjs).

   What is saved: the figure's plain data (figureModel.js), nothing
   else. The live drawing objects are rebuilt when a figure is
   opened (rebuildInstances in figureLayers.js). View state (mode,
   selection, Show All) is not saved.

   Asking: Save As uses the browser's prompt and confirm boxes, the
   way the Hit radius item does. A name that is already used in that
   category is not replaced until you confirm.

   Showing a figure after saving or opening is figuresNav.js's job. This
   file asks for it with a "figure-show" event on document (detail.tabId),
   which figuresNav.js listens for; importing figuresNav here would make
   a loop of imports.

   Exports:
     saveFigureAs(tabId)
     saveFigureTab(tabId)           Save: same place if saved before
     openSavedFigure(category, fileName)
   ============================================================ */

import { uiState }                   from "/ui/uiState.js";
import { nodeDispatch }              from "/ui/nodeLayer.js";
import { getFiguresRegistry }        from "./figuresState.js";
import { snapshotOfFigure, nextFigureTabId } from "./figureModel.js";
import { rebuildInstances }          from "./figureLayers.js";


/* ------------------------------------------------------------
   saveFigureTab(tabId)
   Save. A figure that has been saved or opened goes to the same
   category and name (replacing the file); a new one asks, as Save As.
   ------------------------------------------------------------ */
export async function saveFigureTab(tabId) {

  const figure = uiState.figures.tabs[tabId]?.figure;
  if (!figure) return false;

  if (figure.category && uiState.figures.tabs[tabId].savedSnapshot !== undefined) {
    return await sendSave(tabId, figure.category, figure.name, true);
  }
  return await saveFigureAs(tabId);

} // end saveFigureTab


/* ------------------------------------------------------------
   saveFigureAs(tabId)
   Asks for a category and a name, then saves. Returns true when
   the file was written.
   ------------------------------------------------------------ */
export async function saveFigureAs(tabId) {

  const tabState = uiState.figures.tabs[tabId];
  const figure   = tabState?.figure;
  if (!figure) return false;

  const known    = getFiguresRegistry() || [];
  const category = window.prompt(
    "Category for this figure." +
    (known.length ? "\nExisting: " + known.join(", ") : "") +
    "\nType one of them or a new name:",
    figure.category || known[0] || "");
  if (category === null) return false;                 // Cancel

  const name = window.prompt("Name for this figure:", figure.name);
  if (name === null) return false;

  return await sendSave(tabId, category.trim(), name.trim(), false);

} // end saveFigureAs


/* ------------------------------------------------------------
   sendSave(tabId, category, name, overwrite)
   One round trip. If the service says the name is taken and this
   was not already a replace, asks, then sends again with overwrite.
   ------------------------------------------------------------ */
async function sendSave(tabId, category, name, overwrite) {

  const tabState = uiState.figures.tabs[tabId];
  const figure   = tabState.figure;

  // A copy with the new name and category, so a refused save leaves the
  // figure as it was.
  const toSave = structuredClone(figure);
  toSave.name     = name;
  toSave.category = category;

  let reply;
  try {
    reply = await nodeDispatch("saveFigure", { category, name, figure: toSave, overwrite });
    if (reply.status === "exists") {
      if (!window.confirm("\"" + name + "\" already exists in " + category + ". Replace it?")) return false;
      reply = await nodeDispatch("saveFigure", { category, name, figure: toSave, overwrite: true });
    }
  } catch (err) {
    window.alert("The figure was not saved.\n\n" + err.message);
    return false;
  }
  if (reply.status !== "ok") {
    window.alert("The figure was not saved.\n\n" + (reply.message || reply.status));
    return false;
  }

  figure.name     = name;
  figure.category = category;
  tabState.savedSnapshot = snapshotOfFigure(figure);
  uiState.figures.needsUpdate = true;                   // the Categories list reloads when next shown

  // Tell figuresNav.js to show the figure again, so the subtab and caption
  // carry the new name. (An event, not an import: figuresNav imports the
  // files that import this one.)
  document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId } }));
  return true;

} // end sendSave


/* ------------------------------------------------------------
   openSavedFigure(category, fileName)
   Reads the file, makes a new figure subtab for it and rebuilds
   the live objects. A figure that is already open is just shown.
   ------------------------------------------------------------ */
export async function openSavedFigure(category, fileName) {

  // The figure's name is its file name without ".json". (The manifest title
  // can be changed with Edit Manifest; the name must stay the file's, or Save
  // would write a second file.)
  const title = fileName.replace(/\.json$/i, "");

  const tabs = uiState.figures.tabs;

  for (const id in tabs) {
    const f = tabs[id].figure;
    if (f && f.category === category && f.name === title) {
      document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId: id } }));
      return id;
    }
  }

  let figure;
  try {
    const res = await fetch("/figures/" + encodeURIComponent(category) + "/" + encodeURIComponent(fileName), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    figure = await res.json();
    if (!figure || !Array.isArray(figure.layers) || !Array.isArray(figure.points) || !Array.isArray(figure.drawOrder)) {
      throw new Error("the file is not a figure");
    }
  } catch (err) {
    window.alert("Could not open " + category + "/" + fileName + ".\n\n" + err.message);
    return null;
  }

  figure.name     = title;
  figure.category = category;

  const tabId = nextFigureTabId(tabs);
  tabs[tabId] = {
    type:             "figure",
    figure,
    mode:             "lines",
    selectedPoint:    null,
    centroidSelected: false
  };

  try {
    rebuildInstances(tabId);
  } catch (err) {
    delete tabs[tabId];
    window.alert("Could not open " + category + "/" + fileName + ".\n\n" + err.message);
    return null;
  }

  tabs[tabId].savedSnapshot = snapshotOfFigure(figure);
  document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId } }));
  return tabId;

} // end openSavedFigure

// end figuresSave.js
