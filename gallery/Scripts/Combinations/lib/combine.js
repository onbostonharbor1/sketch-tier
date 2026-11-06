/* ============================================================
   Combinations: one drawing made from two existing gallery scripts
   ============================================================
   A combination is an ordinary gallery script in this folder that names
   two existing scripts and draws both on one canvas, as one drawing.
   The two scripts are imported as they are and never edited: everything
   needed to make them live together is done here.

     Copies     each script is copied (Object.create with its params
                cloned, the pattern figure layers use for registry
                objects), so the combination never changes the script as
                it runs on its own.
     Controls   one set shows at a time. A select, "Controls for", picks
                which script's controls are in the panel (the existing
                showsGroup / belongsToGroup mechanism). Keys are given a
                prefix (a_, b_) so the two scripts' color, lineWidth and
                so on stay apart; the scripts never see the prefixes.
     Handles    one set: the first script's points.
     Drawing    the canvas is cleared once, then each copy is brought up
                to date (update) and drawn (draw), first then second.
                redrawHandler of the scripts is never called.

   The two scripts are not related in any way: no shared points, no
   welds, nothing read from one by the other.

   checkCombinable (the analyzer) tries a script and says whether a
   combination can use it, and why not. A combination runs it on both
   its scripts when it starts and refuses, with the reasons, if either
   fails. npm run test:combinable runs it over every gallery script and
   writes combinable.md beside this file.

   Exports: makeCombination, checkCombinable
   ============================================================ */
import { expandSchema } from "/ui/controls/builders/conventions.js";
import { armInteractor } from "/ui/interactor.js";

const PREFIX = ["a_", "b_"];


/* copyOf: a copy of a script's scriptInfo with its own params and state.
   redraw is what the copy calls when it, or its handles, ask to redraw. */
function copyOf(info, redraw) {
  const copy = Object.create(info);
  copy.params = structuredClone(info.params || info.parameters || {});
  copy.parameters = copy.params;
  copy._state = structuredClone(info._state || {});
  copy.redrawHandler = redraw;
  return copy;
} // end copyOf


/* refusals: why a scriptInfo cannot be used by a combination, by
   reading it (no drawing): no draw(), no params, or groups of its own. */
function refusals(info) {
  const out = [];
  if (!info) return ["exports no scriptInfo"];
  if (typeof info.draw !== "function") out.push("scriptInfo has no draw()");
  if (!info.params && !info.parameters) out.push("scriptInfo has no params");
  const schema = expandSchema(info.controls || {});
  if (Object.values(schema).some((d) => d && d.showsGroup)) out.push("its controls have groups of their own (showsGroup)");
  return out;
} // end refusals


/* pictureOf: a short fingerprint of what is on the canvas now. */
function pictureOf() {
  const d = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
  let h = 0;
  for (let i = 0; i < d.length; i += 7) h = (h * 31 + d[i]) | 0;
  return h;
} // end pictureOf


/* drawCopy: clear the canvas, bring a copy up to date and draw it.
   Returns the number of times draw() cleared the canvas itself. */
function drawCopy(copy) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (typeof copy.update === "function") copy.update(copy.params);
  const realClear = ctx.clearRect;
  let clears = 0;
  ctx.clearRect = function (...a) { clears++; return realClear.apply(this, a); };
  try { copy.draw(); } finally { ctx.clearRect = realClear; }
  return clears;
} // end drawCopy


/* checkCombinable: the analyzer. Tries a script as a combination would
   and returns { ok, reasons }. The steps:
     1. it has scriptInfo, params and draw(), and no groups of its own;
     2. a copy draws something without throwing;
     3. the copy's draw() does not clear the canvas;
     4. the copy answers its own settings: changing them changes the
        drawing (a script that reaches for "scriptInfo" by name draws
        from the original instead and fails here);
     5. the original's params are the same afterwards.
   It draws on the canvas; the caller redraws afterwards. */
export function checkCombinable(info) {
  const reasons = refusals(info);
  if (reasons.length) return { ok: false, reasons };
  const before = JSON.stringify(info.params || info.parameters);
  const copy = copyOf(info, () => {});
  try {
    if (typeof copy.init === "function") copy.init();
    const blank = (ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height), pictureOf());
    const clears = drawCopy(copy);
    const first = pictureOf();
    if (first === blank) reasons.push("a copy draws nothing");
    if (clears > 0) reasons.push("its draw() clears the canvas");
    const schema = expandSchema(info.controls || {});
    for (const [key, def] of Object.entries(schema)) {
      if (def && def.widget === "range" && typeof copy.params[key] === "number") {
        const lo = def.min ?? copy.params[key], hi = def.max ?? copy.params[key];
        copy.params[key] = copy.params[key] === hi ? lo : hi;
      }
    }
    drawCopy(copy);
    if (first !== blank && pictureOf() === first) reasons.push("a copy does not answer its own settings (it may use \"scriptInfo\" by name)");
  } catch (err) {
    reasons.push("a copy throws: " + err.message);
  }
  if (JSON.stringify(info.params || info.parameters) !== before) reasons.push("drawing a copy changed the original's params (shared state)");
  return { ok: reasons.length === 0, reasons };
} // end checkCombinable


/* makeCombination: the scriptInfo of a combination of two scripts.
   spec: { title, first, second, firstName, secondName } where first and
   second are the scripts' scriptInfo objects. */
export function makeCombination(spec) {
  const infos = [spec.first, spec.second];
  const names = [spec.firstName, spec.secondName];

  const combo = {
    title: spec.title,
    interactive: true,
    params: { show: names[0] },
    controls: { show: { widget: "select", label: "Controls for", options: names, showsGroup: true } },
    copies: [],

    /* init: check both scripts, make the copies, and build the merged
       params and controls. A script that fails the check stops it here,
       with the reasons, in the error bar. */
    init() {
      infos.forEach((info, i) => {
        const result = checkCombinable(info);
        if (!result.ok) throw new Error(names[i] + " cannot be combined: " + result.reasons.join("; "));
      });
      this.copies = infos.map((info) => copyOf(info, () => this.redrawHandler()));
      this.copies.forEach((copy, i) => {
        if (typeof copy.init === "function") copy.init();
        const schema = expandSchema(infos[i].controls || {});
        for (const [key, def] of Object.entries(schema)) {
          const name = PREFIX[i] + key;
          const own = { ...def, belongsToGroup: names[i] };
          if (def.widget === "button" && typeof def.action === "function") own.action = () => def.action.call(copy);
          this.controls[name] = own;
          if (key in copy.params) this.params[name] = copy.params[key];
        }
      });
      this.params.points = this.copies[0].params.points || [];
      this.parameters = this.params;
    },

    /* update: hand each copy its own settings back, without the prefix. */
    update() {
      this.copies.forEach((copy, i) => {
        for (const key of Object.keys(copy.params)) {
          if (key !== "points" && (PREFIX[i] + key) in this.params) copy.params[key] = this.params[PREFIX[i] + key];
        }
      });
    },

    /* draw: each copy brought up to date and drawn, first then second.
       If the first script replaced its points array, the handles follow. */
    draw() {
      for (const copy of this.copies) {
        if (typeof copy.update === "function") copy.update(copy.params);
        copy.draw();
      }
      if (this.params.points !== this.copies[0].params.points) {
        this.params.points = this.copies[0].params.points;
        armInteractor(this);
      }
    }
  };

  /* redrawHandler: clear once, settings to the copies, draw both. */
  combo.redrawHandler = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    combo.update();
    combo.draw();
  };
  return combo;
} // end makeCombination
