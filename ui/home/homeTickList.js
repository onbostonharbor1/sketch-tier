/* homeTickList.js
   ============================================================
   Home Tab -- a list of items with checkboxes
   ============================================================
   Role:
     The one way Home shows a list to work through: Errors
     (homeErrors.js) and Checklist (homeChecklist.js) both use it.
     Each item has a checkbox. A ticked item leaves the list unless
     "Show all" is ticked, which shows the ticked ones too, greyed.
     "Purge ticked" removes ticked items for good (after asking).
     An optional "Add item" box adds a new, unticked item.

     This file only displays the list and calls back. Where the items
     live (the error logs, home/checklist.md) is the caller's business.

   Exports:
     renderTickList(container, spec)
       spec: {
         intro:     a sentence above the list
         items:     [{ text, done }]
         showAll:   boolean
         onShowAll(showAll)       the Show all box changed
         onTick(item, done)       a checkbox changed
         onPurge()                Purge ticked was confirmed
         onAdd(text)              optional: adds the Add item box
         canUntick: boolean       may a ticked item be unticked (Show all)?
       }
   ============================================================ */


/* renderTickList: fill container with the controls and the list. */
export function renderTickList(container, spec) {
  container.innerHTML = "";

  const intro = document.createElement("p");
  intro.textContent = spec.intro;
  container.appendChild(intro);

  // The row of controls: Show all, Purge ticked, and Add item when offered.
  const showLabel = document.createElement("label");
  const showBox = document.createElement("input");
  showBox.type = "checkbox";
  showBox.className = "tick-show-all";
  showBox.checked = !!spec.showAll;
  showBox.onchange = () => spec.onShowAll(showBox.checked);
  showLabel.append(showBox, " Show all (ticked too)");

  const purge = document.createElement("button");
  purge.type = "button";
  purge.className = "cmdButton tick-purge";
  purge.textContent = "Purge ticked";
  const ticked = spec.items.filter((i) => i.done).length;
  purge.disabled = ticked === 0;
  purge.title = "Remove the " + ticked + " ticked item(s) for good";
  purge.onclick = () => {
    if (window.confirm("Remove the " + ticked + " ticked item(s) for good?")) spec.onPurge();
  };
  container.append(showLabel, " ", purge);

  if (spec.onAdd) {
    const addBox = document.createElement("input");
    addBox.type = "text";
    addBox.className = "tick-add-text";
    addBox.size = 50;
    addBox.placeholder = "New item";
    const add = document.createElement("button");
    add.type = "button";
    add.className = "cmdButton tick-add";
    add.textContent = "Add item";
    const doAdd = () => { const t = addBox.value.trim(); if (t) spec.onAdd(t); };
    add.onclick = doAdd;
    addBox.onkeydown = (e) => { if (e.key === "Enter") doAdd(); };
    container.append(document.createElement("br"), addBox, " ", add);
  }

  // The list itself.
  const shown = spec.items.filter((i) => spec.showAll || !i.done);
  const ul = document.createElement("ul");
  ul.className = "tick-list";
  ul.style.listStyle = "none";
  ul.style.paddingLeft = "0";
  for (const item of shown) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = !!item.done;
    box.disabled = item.done && !spec.canUntick;
    box.onchange = () => spec.onTick(item, box.checked);
    label.append(box, " " + item.text);
    if (item.done) label.style.color = "#888";
    li.appendChild(label);
    ul.appendChild(li);
  }
  container.appendChild(ul);

  if (shown.length === 0) {
    const none = document.createElement("p");
    none.textContent = spec.items.length ? "Everything is ticked. Show all to see them." : "Nothing here.";
    container.appendChild(none);
  }
} // end renderTickList

// end homeTickList.js
