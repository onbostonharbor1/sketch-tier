/* drawSweep.js
   ============================================================
   Draw Tab -- Sweep a setting (Phase 13, as guessed: decision G-6)
   ============================================================
   Role:
     A parameter study. Pick one numeric setting of the open object, a
     range and a count; the side panel shows a grid of small pictures,
     one per value across the range. Click a picture to give the object
     that value. Nothing changes until you click.

   How the pictures are made: for each value, a private copy of the
   object (drawInstance.js) gets the open object's settings with the one
   setting changed, draws on the shared canvas, and is copied down to a
   small picture. The open object is then drawn again, so the canvas
   ends as it began.

   Exports:
     sweepableSettings(info)
     sweepValues(def, from, to, count)
     sweepPictures(info, key, values, size)
     sweepGrid(info, keyA, valuesA, keyB, valuesB, size)   two settings (Tier A)
     parseValueList(text)                                   "3, 5, 8" as numbers
     openSweepPanel()
   ============================================================ */

import { uiState }                from "/ui/uiState.js";
import { resetCanvas }            from "/draw/drawState.js";
import { makeDrawInstance }       from "/ui/draw/drawInstance.js";
import { drawActiveTab }          from "/ui/draw/drawRunner.js";
import { showOffcanvas }          from "/ui/offcanvas.js";

const PICTURE = 140;   // pixels across each picture in the panel


// The settings a sweep can run over: every slider (range control), as
// { key, label, min, max, step }.
export function sweepableSettings(info) {
  const controls = info?.drawRegistry?.controls || {};
  return Object.entries(controls)
    .filter(([key, def]) => def && def.widget === "range" && typeof info.parameters?.[key] === "number")
    .map(([key, def]) => ({ key, label: String(def.label || key).replace(/:\s*$/, ""),
                            min: Number(def.min), max: Number(def.max), step: Number(def.step) || 1 }));
} // end sweepableSettings


// count values evenly across from..to, each on one of the slider's steps.
export function sweepValues(def, from, to, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const raw = count === 1 ? from : from + (to - from) * i / (count - 1);
    // Steps count from the slider's minimum (64, 68, 72 ... not 60, 64 ...),
    // and the value stays inside the slider's range.
    const base = Number.isFinite(def.min) ? def.min : 0;
    let v = base + Math.round((raw - base) / def.step) * def.step;
    if (Number.isFinite(def.min)) v = Math.max(def.min, v);
    if (Number.isFinite(def.max)) v = Math.min(def.max, v);
    const tidy = Number(v.toFixed(6));                       // no 0.30000000000000004
    if (!out.includes(tidy)) out.push(tidy);
  }
  return out;
} // end sweepValues


// One picture (a data URL) per value, of the open object with key set to it.
export function sweepPictures(info, key, values, size = PICTURE) {
  const pics = values.map((v) => ({ value: v, src: pictureOf(info, { [key]: v }, size) }));
  drawActiveTab();                 // the open object, as it was
  return pics;
} // end sweepPictures


// A grid over two settings: one row per value of keyB (down), one picture
// per value of keyA (across). Returns rows of { a, b, src }.
export function sweepGrid(info, keyA, valuesA, keyB, valuesB, size = PICTURE) {
  const rows = valuesB.map((b) => valuesA.map((a) => ({ a, b, src: pictureOf(info, { [keyA]: a, [keyB]: b }, size) })));
  drawActiveTab();                 // the open object, as it was
  return rows;
} // end sweepGrid


// A list typed by Barry ("3, 5, 8, 13") as numbers; anything that is not a
// number is left out. An empty or unreadable list gives [].
export function parseValueList(text) {
  return String(text || "").split(/[,\s]+/).filter((t) => t !== "").map(Number).filter(Number.isFinite);
} // end parseValueList


// One picture of the open object with some settings changed (overrides is
// { key: value, ... }). Draws on the shared canvas and copies it down.
function pictureOf(info, overrides, size) {
  const canvas = window.drawCanvas;
  const params = Object.assign(structuredClone(info.parameters), overrides);
  const inst = makeDrawInstance(Object.getPrototypeOf(info.drawRegistry) || info.drawRegistry, params);
  resetCanvas();
  try {
    inst.init();
    inst.update(inst.params);
    inst.draw();
  } catch (err) {
    console.warn("Sweep: " + JSON.stringify(overrides) + " failed to draw:", err);
  }
  const small = document.createElement("canvas");
  small.width = size; small.height = size;
  const c = small.getContext("2d");
  c.fillStyle = "#fff"; c.fillRect(0, 0, size, size);
  c.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size, size);
  return small.toDataURL("image/png");
} // end pictureOf


/* ============================================================
   openSweepPanel()
   ------------------------------------------------------------
   The side panel: setting, from, to, how many, Sweep. Then the grid.
   ============================================================ */
export function openSweepPanel() {
  const info = uiState.draw.tabs[uiState.draw.activeSubtab];
  if (!info || info.type !== "object") return;
  const settings = sweepableSettings(info);
  if (!settings.length) { window.alert("This object has no slider settings to sweep."); return; }

  showOffcanvas({
    title: "Sweep a setting",
    buildBody: (body) => {
      const options = settings.map((x) => "<option value='" + x.key + "'>" + x.label + "</option>").join("");
      body.innerHTML =
        "<p>Draws the object once for each value of a setting; with a second setting, a grid (first across, " +
        "second down). Click a picture to use its values. A list (\"3, 5, 8\") replaces From, To and Pictures.</p>" +
        "<label>Setting <select id='sweepSetting'>" + options + "</select></label><br>" +
        "<label>From <input id='sweepFrom' type='number' style='width:6em'></label> " +
        "<label>To <input id='sweepTo' type='number' style='width:6em'></label> " +
        "<label>Pictures <input id='sweepCount' type='number' min='2' max='24' value='9' style='width:4em'></label> " +
        "<label>or list <input id='sweepList' type='text' style='width:9em'></label><br>" +
        "<label>Second setting <select id='sweepSetting2'><option value=''>(none)</option>" + options + "</select></label><br>" +
        "<label>From <input id='sweepFrom2' type='number' style='width:6em'></label> " +
        "<label>To <input id='sweepTo2' type='number' style='width:6em'></label> " +
        "<label>Pictures <input id='sweepCount2' type='number' min='2' max='8' value='2' style='width:4em'></label> " +
        "<label>or list <input id='sweepList2' type='text' style='width:9em'></label><br>" +
        "<button id='sweepGo' type='button'>Sweep</button>" +
        "<div id='sweepGrid' style='display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;'></div>";
      const $ = (id) => body.querySelector("#" + id);
      const fill = (sel, from, to) => {
        const x = settings.find((y) => y.key === sel.value);
        if (x) { from.value = x.min; to.value = x.max; }
      };
      $("sweepSetting").onchange  = () => fill($("sweepSetting"), $("sweepFrom"), $("sweepTo"));
      $("sweepSetting2").onchange = () => fill($("sweepSetting2"), $("sweepFrom2"), $("sweepTo2"));
      fill($("sweepSetting"), $("sweepFrom"), $("sweepTo"));

      // The values for one setting: the typed list if there is one, else From..To.
      const valuesOf = (key, from, to, count, list, maxCount) => {
        const typed = parseValueList(list.value);
        if (typed.length) return typed.slice(0, 24);
        const x = settings.find((y) => y.key === key);
        const n = Math.min(maxCount, Math.max(2, Number(count.value) || 2));
        return sweepValues(x, Number(from.value), Number(to.value), n);
      };

      $("sweepGo").onclick = () => {
        const a = settings.find((x) => x.key === $("sweepSetting").value);
        const b = settings.find((x) => x.key === $("sweepSetting2").value);
        const valuesA = valuesOf(a.key, $("sweepFrom"), $("sweepTo"), $("sweepCount"), $("sweepList"), 24);
        const grid = $("sweepGrid");
        grid.innerHTML = "";
        const cells = [];
        if (!b || b.key === a.key) {
          for (const pic of sweepPictures(info, a.key, valuesA)) cells.push({ src: pic.src, set: { [a.key]: pic.value }, label: String(pic.value) });
        } else {
          const valuesB = valuesOf(b.key, $("sweepFrom2"), $("sweepTo2"), $("sweepCount2"), $("sweepList2"), 8);
          grid.style.display = "grid";
          grid.style.gridTemplateColumns = "repeat(" + valuesA.length + ", auto)";
          for (const row of sweepGrid(info, a.key, valuesA, b.key, valuesB)) {
            for (const pic of row) cells.push({ src: pic.src, set: { [a.key]: pic.a, [b.key]: pic.b }, label: pic.a + ", " + pic.b });
          }
        }
        for (const cellInfo of cells) {
          const cell = document.createElement("figure");
          cell.className = "sweep-cell";
          cell.style.cssText = "margin:0; text-align:center; cursor:pointer; border:1px solid #999;";
          cell.title = "Use " + Object.entries(cellInfo.set).map(([k, v]) => k + " = " + v).join(", ");
          cell.innerHTML = "<img src='" + cellInfo.src + "' width='" + PICTURE + "' height='" + PICTURE + "'><figcaption>" + cellInfo.label + "</figcaption>";
          cell.onclick = () => {
            Object.assign(info.parameters, cellInfo.set);
            info.onParamChange?.();       // marks the tab changed
            drawActiveTab();              // redraws and rebuilds the sliders at the new values
            grid.querySelectorAll(".sweep-cell").forEach((c) => { c.style.borderColor = "#999"; });
            cell.style.borderColor = "#d00000";
          };
          grid.appendChild(cell);
        }
      };
    }
  });
} // end openSweepPanel

// end drawSweep.js
