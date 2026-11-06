# What comes next in Sketchpad (Tier A)

Barry, 3 November 2026. Sketchpad (V1) stays the working system. Everything Barry has agreed from the Oceania
specification is listed here as **Tier A**: things that fit Sketchpad's model and go into V1. Oceania's own repository
(`sketchpadNewArch`) keeps the spec, the prototype and the full ordering (its `docs/DIRECTION.md`).

## 1. Changes in the last few days (31 October to 3 November)

The list below starts from what is already in `claude1`, so Tier A is read against the current state.

| Area | What changed | Commits |
|---|---|---|
| Category frames | Frames show pictures instead of names (Draw, Patterns, Gallery, Figures, Home); 200×200 `thumb_<name>.png` in each category's `images` folder; Utilities > Tools > Thumbnails (on or off, size, Regenerate, **Check Missing Images**) | 25c7d84, 2bbb663 |
| Insert by picture | Insert... panel with thumbnails and a larger preview (Phase 12) | 9d81a16 |
| Ideabook | Run script button beside Prev and Next; 282 hint scripts in Pursuit, To Build, working, ok and possible; shared routines (`gallery/Ideabook/scripts/ideabookRoutines.js`) and the pursuit engine; Figure scripts point to their StringThing originals | 94a5d90 to edaef22 |
| Errors | Red error bar on every tab; daily error log; Home summary; registry check at start-up; figure-file check | 45e1759 |
| Regression | `npm run test:regression`: every Draw object, pattern and gallery script compared with an approved copy | b9a2ce1 |
| Script history | VS Code's saved versions of a script, run or compared | 1a85701 |
| Figures | Save, Save As, open, ask before closing (Phase 10); Copy, Archive, Reset; Delete layer; handle-to-handle welds; figure files in an upgradeable format; files split by job | 0b946fc, 3668684, be7a108, ed8d3b3, 17883c0, c433871, 18281fa |
| v1-finish | Draw, Figures and Patterns no longer share settings; scripts no longer depend on earlier scripts; magic points (middles, crossings, lobe tips, cusps); print aids (print size, scale bar, nail spacing check); templates as guide layers; Break apart for Inverse Star; Parametrics centre and size handles; Sweep a setting | c433871 to 1cfee9c |
| Clean-up | Bootstrap and Coloris removed; Node service split by request family, atomic writes, origin check; `clearDivs` reads one region table; header notes on all 195 scripts | a962472, 95f6617, c9588b5, 7e930f9, 4f50256 |

## 2. Tier A

The **V1 now** column says how much exists already: *exists*, *partly* or *new*.

### Geometry and stitching (the "next level")

| # | Item | V1 now |
|---|---|---|
| A1 | **Point-array operations (shapers)**: reverse, part, every nth, rotate start, offset, resample, simplify, rotate and scale. Each one a small named function, array in, array out; points keep x, y and z | partly (`ideabookRoutines.js`, `drawUtilities.js`) |
| A2 | **Ways of stitching (connectors)**: pairwise, offset (stop or wrap), corner, segment, growing skip, times table with negative and fractional factors, chords, all pairs, mirror, zigzag, mesh. A connector takes two plain arrays and returns pairs; it knows nothing about reversing or ranges | partly (`ideabookRoutines.js`, the stitcher) |
| A3 | **Stepping view**: draw a layer one line at a time (next, previous, slider), with the current line highlighted and its source shown. V1 route: `drawLine` records every line it draws; stepping redraws the first k | new |
| A4 | **Curve library**: more curves as registry objects (rose, Lissajous, epicycloid and hypocycloid, superellipse, spirals, cardioid, astroid) | partly (Parametrics, Spirals) |
| A5 | **Shape palette**: rectangle, polygon, ellipse and more on the subtab command menu, like Line and Parabola | partly (Line, Parabola) |
| A6 | **Intersections as nail candidates**, with their own mark | partly (crossings among magic points) |
| A7 | **Simplified-curve overlay**, with a precision setting | new |
| A8 | **Clipping shapers**: nails or stitches only inside (or outside) a shape | new |
| A9 | Points carry x, y and z; no function drops z (depth itself later) | new (rule plus test) |
| A10 | "Always do something": unequal arms pair shorter into longer and draw; a failure draws what it managed, marked; assumptions are logged | partly (Barry's practice) |

### Figures

| # | Item | V1 now |
|---|---|---|
| A11 | **Welds as a table of groups**: one row per weld, members named by handle (not by index), values in figure coordinates, a check after each change that every member agrees | partly (Phase 8 welds) |
| A12 | **Undo and redo** in Figures and Draw: snapshots of the figure (or the Draw settings), one gesture one step | new |
| A13 | **Visualization kept apart from the product**: handles, weld marks, magic points and intersections drawn in their own pass, switchable, never printed | partly |
| A14 | Magic and named points shown as an overlay | partly |
| A15 | Bring-to-front on choosing a layer as a view change only (saved order untouched) | partly |
| A16 | **Templates** as starting points; snap as a template property | partly (guide layers) |
| A17 | Document checks when a figure is opened | exists (figure-file check) |
| A18 | Crash recovery: offer what was open after a crash | new |

### Output

| # | Item | V1 now |
|---|---|---|
| A19 | **True-scale SVG template**; PDF by printing the SVG | new |
| A20 | Units (inches by default) and print width per drawing; unknown units assumed to be canvas, and logged | partly (print size) |
| A21 | Spacing check never blocks printing; switchable highlight; clearance starts at 3/16″ | partly |
| A22 | Draggable alignment marks, printed; no tiling engine | new |
| A23 | Nail colour cycle red, green, orange, blue, yellow | new |

### Lists, Home and errors

| # | Item | V1 now |
|---|---|---|
| A24 | **Library index replacing manifests**: folders are the truth; optional `_folder.json` per folder for status, order and hidden; watcher; Rebuild button; one-time migration of manifests | new |
| A25 | **Error checklist**: each distinct error stays until ticked; "acknowledged" logged; a quiet list of assumptions | partly (error bar) |
| A26 | **Home subtabs**: Workbench (statuses), Errors, Notes; later Log, Recent | partly (Home list) |
| A27 | "Important versus interesting" tag (core, keeper, test) on registry objects | new |
| A28 | Duplicate ids: both load, both badged | new |
| A29 | Clickable badges on items with a problem | new |

### Controls, menus and settings

| # | Item | V1 now |
|---|---|---|
| A30 | **One commands table** for menus and buttons (label, when enabled, action), replacing the per-tab menu files; `figuresCommands.js` is the pattern (Phase 15) | partly |
| A31 | Settings page: one place for configurable values, with a Default button on each | new |
| A32 | Name-to-control conventions (`lineWidth` brings its whole control definition) | new |
| A33 | Control groups (`style` = color, lineWidth, alpha) | new |
| A34 | **Sweep** over two settings Barry chooses, 2×2 grid, "here is a list" values; slideshow | partly (one setting) |

### Tests and documentation

| # | Item | V1 now |
|---|---|---|
| A35 | Regression report: overlay, flicker and difference views; per-item tolerance | partly (side by side) |
| A36 | Comment standard (file header, block comment before every function); generated alphabetical function dictionary | partly |
| A37 | Notes popup from headers | exists |
| A38 | Help stays HTML; Markdown optional for new pages | exists |

Already done and dropped from the list: Check Missing Images (Barry's "sweep for images category frames need") is
Utilities > Tools > Thumbnails > Check Missing Images.

## 3. Order of work

Progress: step 1 built (3 Nov 2026): `draw/shapers.js`, `draw/connectors.js`, `drawPairs`, `npm run test:shapers`
(20 tests). The Ideabook routines are not yet rewired to use them; that is for Barry to choose (promotion rule).
Step 2 built (3 Nov 2026): Draw caption menu > Step through the drawing (`ui/draw/drawStep.js`). drawLine counts and
records every line while `drawState.step` is set, draws the first k and marks line k in red; controls in the left column
(first, previous, next, last, slider, readout of the line's ends and colour, Done). Works on every Draw object unchanged.
Figures and scripts: not yet (the same drawLine hook serves them; their controls come later).
Step 3 built (3 Nov 2026): errors as a checklist (`ui/errorChecklist.js`): Tick and Tick all in the error bar write
"Acknowledged: ..." to the error log; Home > Errors lists every error not yet ticked, from all error logs, across
restarts; Home's alert counts unticked errors. Home > Notes shows `home/notes.md`, opened in VS Code from there.

Each step is a phase on its own branch, reviewed and merged by Barry, in this order:

1. A1, A2, A9, A10: the shapers and connectors library (`draw/shapers.js`, `draw/connectors.js`), pulled from the
   Ideabook routines and the stitcher, with tests.
2. A3: the stepping view.
3. A25, A26 (Errors and Notes): the error checklist and the first Home subtabs.
4. A24, then A26 (Workbench): the library index, the migration, and the Workbench.
5. A19 to A23: output.
6. A12: undo.
7. A11, A13 to A15: welds as groups, and the visualization pass.
8. A30 to A34: the commands table, settings, conventions, groups, and Sweep over two settings.
9. A4 to A8, A16, A18, A27 to A29, A35, A36: the rest, in any order Barry likes.

## 4. What else is needed before or during the work

- **Phases, not one batch.** Thirty-eight items is about nine phases. Several touch every tab (A30, A24), so each
  phase is reviewed before the next is built on it.
- **Barry's decisions, wanted when a phase reaches them, not now:**
  - **A11:** whether a weld row stores one value (members read it) or copies (members kept equal). Both are
    described in Oceania's `docs/reviews/owner-comments-revC.md`.
  - **A16:** what a template holds beyond guide layers.
  - **A22:** what an alignment mark looks like.
  - **A31:** which values appear on the settings page first.
- **A12 (undo) needs every figure change to go through a few known functions,** so a snapshot can be taken before
  each one. In V1 that means finding every place that changes a figure. Most of these already sit in
  `figureLayers.js`, `figureWelds.js` and `figureCentroid.js`. Expect that phase to tidy those paths. It's real
  work, not a bolt-on.
- **A24 needs Windows testing on Barry's PC:** Node's file watching misbehaves on Windows and in OneDrive-synced
  folders.

## 5. Status on 4 November 2026 (branch `claude/tier-a`)

Barry, 4 Nov: do everything not yet done; defer anything that can go wrong and whose fix isn't simple, and say so.

**Built 4 Nov:**

| Item | What | Commit |
|---|---|---|
| (new) | Runs in a GitHub Codespace (from the iPad): the page reaches the Node service through Vite (`/dispatch`, `vite.config.js`), `.devcontainer/` | 5b66767 (also on `claude/codespaces`) |
| (new) | Home > Checklist: things to check, with checkboxes, Show all, Purge ticked, Add item (`home/checklist.md`) | 26516f5 |
| A25 | Home > Errors: Show all and Purge ticked | 26516f5 |
| A19, A20, A21, A23 | Inches for print size and nail size (switchable to mm); clearance 3/16 in for new figures; one-sheet true-size SVG with the nail colour cycle; spacing never blocks printing (already so) | de9b798 |
| A8 | Clipping shapers: `inside`, `outside`, `isInside` | a104c2e |
| A34 | Sweep over two settings (grid), typed value lists | a5be4d8 |
| A35 | Regression report: overlay, flicker, difference; `tests/regression/tolerance.json` | fba0b39 |
| A36 | Function dictionary: `npm run dictionary` writes `docs/FUNCTIONS.md` (745 functions, 323 without a comment) | d86f215 |
| A6 | Intersections have their own mark in points mode (purple ring with a cross) | 41ad0c1 |
| A32, A33 | Controls by name alone (conventions table) and control groups (`style`) | ec06239 |
| A15 | Choosing a layer draws it on top without changing the saved order; Keep this layer on top | 7197a32 |

**Deferred: each can go wrong, and the fix isn't simple.**

| Item | Why deferred | What it needs |
|---|---|---|
| A24 library index, A26 Workbench | Changes how every tab gets its lists; Node's file watching misbehaves on Windows and in OneDrive folders; manifests must be migrated | Your go, and testing on the PC |
| A12 undo, A18 crash recovery | Every place that changes a figure must go through a few known functions first; a missed one makes undo lie | A phase of its own: first list every such place |
| A11 welds as groups, A13 visualization pass | Rewrites working weld code and the marks drawn over figures | Your decision: one stored value, or kept-equal copies |
| A30 one commands table | Touches every tab's menu file | Its own phase, with the tab tests before and after |
| A4 curve library, A5 shape palette | New registry objects, and registry names are permanent API | Your list of curves and shapes, and their names |
| A7 simplified-curve overlay | Unclear which curves and where it shows | Your spec |
| A16 templates (beyond guide layers), A22 draggable alignment marks | Not yet specified | Your spec (what a template holds; what a mark looks like) |
| A27 core / keeper / test tag | The tagging is yours | Your list |
| A29 clickable badges | Belongs with the library index (A24) | After A24 |
| A31 settings page | Which values come first | Your list |
| A3 stepping in Figures and scripts | Built for Draw; Figures needs its own controls | A small phase |
| Comment standard | 323 functions have no comment above them (`docs/FUNCTIONS.md`) | Your go for a comments-only sweep |

**Not applicable in V1.** A28 duplicate ids: registry keys can't be duplicated in V1's hand-kept list.

**Waiting for Barry's spec.** A Home subtab that views the HTML notes and information in the help area.

## 6. Barry's answers, 4 November 2026 (later)

- **Before the next tier** (do these first, as their own phases): **A12 undo**, **A18 crash recovery**, **A3 stepping
  in Figures**.
- **A11 welds: settled, no change.** V1 already keeps welds as a table of groups (`figure.welds`, members by disc
  number; `ui/figures/figureWeldModel.js`). When a layer's point count changes, the weld is not changed. If its
  members no longer meet, the weld shows red, and Barry fixes it by hand.
- **A4 and A5, registry names:** derive each name from the shape, descriptive (for example `rose`, `lissajous`,
  `rectangle`). Where a name is ambiguous, record it in a new Markdown file kept for the purpose
  (`help/registryNames.md`), which becomes part of help. Curve library and shape palette are unblocked, to build on
  Barry's go.
- **A27 tags:** explained to Barry; waiting for his answer.
- **Comment sweep:** explained to Barry; waiting for his answer.

## 7. Done 4 November (later)

- **A24 library index:** built (0eb4a8e, d47f9a0). Lists and the Home list come from the folders; manifest.json files are
  notes only; no start-up rebuild. Needs no file watcher (a reload shows new files). Barry: none of Sketchpad is on
  OneDrive.
- **A26 Workbench:** Home > Categories, now fed from the folders, is the workbench (items by status). Renaming it is cosmetic.
- **Home > Help** (Barry's spec): Design, Reflections, Build Documents; New reflection and Edit (d62487e).
- **Comment sweep:** done (1e9a6be).
- **Still before the next tier:** A12 undo, A18 crash recovery, A3 stepping in Figures.
- **Waiting for Barry's go:** A4 curve library and A5 shape palette (naming rule settled); A27 tags (explained).

## 8. Done 5 November 2026

- **A4 curve library and A5 shape palette:** built (76f3986). Rose, Lissajous, Epicycloid, Hypocycloid, Astroid, Cardioid,
  Limacon, Superellipse, Archimedean Spiral; Rectangle, Polygon, Ellipse. Each has centre and size handles, Points,
  Stitch (outline, chords, times table, all pairs), Skip, Factor, colour and line width; discs on its points in Figures.
  Figures caption: Rectangle, Polygon, Ellipse buttons and a Curve list. Names in `docs/registryNames.md`.
- **Help:** Overview page *Curve library and shape palette*; Draw and Figures pages note them.
- **Left before the next tier:** A12 undo, A18 crash recovery, A3 stepping in Figures.

## 9. Done 6 November 2026

- **A3 stepping in Figures:** built (e9341f7). Caption menu > Step through the drawing; whole figure in drawing order,
  or Active layer only; the readout names the layer.
- **Intersections:** `draw/intersections.js` (1a6066d), a grid search, tunable, equal to testing every pair and far
  faster (20,000 points in about 35 ms). Parametrics and the Figures crossing marks use it.
- **Time limit:** (7fcc85e) a drawing past `drawState.timeLimit` (2 s) is stopped with a message, keeping what it drew;
  covers `drawLine` and scripts drawing on the canvas directly. Loops that never draw, and later animation frames, are not
  covered.
- **Left before the next tier:** A12 undo, A18 crash recovery.

