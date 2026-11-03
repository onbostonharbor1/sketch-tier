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
