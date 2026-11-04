/* controls/builders/conventions.js
   ============================================================
   Controls by name alone (Tier A, Barry's idea: "just entering
   'line width' would be sufficient for specifying the type of control")
   ============================================================
   A script or Draw object may declare a well-known setting by name only,
   and get the whole control from the table below:

       controls: { lineWidth: true, color: true, steps: true }

   or with one change ({ lineWidth: { max: 3 } } keeps the rest).

   A control is filled from the table only when it says nothing about
   its widget (no widget, type or control field): every control written
   in full, which is every one today, is left exactly as it is.

   Groups: one entry that stands for several. { style: "group" } becomes
   color, lineWidth and alpha, each from the table.

   The table grows as names come up. A name that is not in it, declared
   with nothing, becomes a plain text box (as before).

   Exports:
     CONVENTIONS, GROUPS
     expandSchema(schema)    groups replaced by their members, and every
                             name-only control filled from the table
   ============================================================ */

export const CONVENTIONS = {
  lineWidth:  { widget: "range",  label: "Line width:", min: 0.5, max: 10,  step: 0.5, default: 1 },
  color:      { widget: "color",  label: "Color:",                                    default: "#0000ff" },
  alpha:      { widget: "range",  label: "Transparency:", min: 0, max: 1,   step: 0.05, default: 1 },
  steps:      { widget: "range",  label: "Steps:",      min: 1,   max: 500, step: 1,   default: 20 },
  numSteps:   { widget: "range",  label: "Steps:",      min: 1,   max: 500, step: 1,   default: 20 },
  angle:      { widget: "range",  label: "Angle:",      min: 0,   max: 360, step: 1,   default: 0 },
  rotation:   { widget: "range",  label: "Rotation:",   min: 0,   max: 360, step: 1,   default: 0 },
  radius:     { widget: "range",  label: "Radius:",     min: 5,   max: 400, step: 1,   default: 150 },
  skip:       { widget: "range",  label: "Skip:",       min: 1,   max: 100, step: 1,   default: 1 },
  offset:     { widget: "range",  label: "Offset:",     min: -50, max: 50,  step: 1,   default: 0 },
  factor:     { widget: "range",  label: "Factor:",     min: -10, max: 10,  step: 0.1, default: 2 },
  sides:      { widget: "range",  label: "Sides:",      min: 3,   max: 24,  step: 1,   default: 5 },
  copies:     { widget: "range",  label: "Copies:",     min: 1,   max: 24,  step: 1,   default: 4 }
};

export const GROUPS = {
  style: ["color", "lineWidth", "alpha"]
};


/* saysNothing: true when a control gives no widget of its own, so the
   table may fill it. true, "", null and {} all say nothing; an object
   with only label, min, max, step or default says nothing about its widget. */
function saysNothing(def) {
  if (def === true || def === null || def === undefined || def === "") return true;
  if (typeof def !== "object") return false;
  return def.widget === undefined && def.type === undefined && def.control === undefined;
} // end saysNothing


/* expandSchema: a new schema object (the one given is not changed). */
export function expandSchema(schema) {
  const out = {};
  for (const [key, def] of Object.entries(schema || {})) {
    if (def === "group" && GROUPS[key]) {
      for (const member of GROUPS[key]) out[member] = { ...CONVENTIONS[member] };
      continue;
    }
    if (CONVENTIONS[key] && saysNothing(def)) {
      out[key] = { ...CONVENTIONS[key], ...(typeof def === "object" && def ? def : {}) };
      continue;
    }
    out[key] = def;
  }
  return out;
} // end expandSchema
