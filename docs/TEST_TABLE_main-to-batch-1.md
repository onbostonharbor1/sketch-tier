# Test table: `main` to `claude/batch-1`

Every change from `main` through `claude1`, then `claude/docs`, then `claude/sweep-1`, then `claude/batch-1`, in order.
Column 1 is the change (commit ids). Column 2 is what to test or look for. Tags used in column 2:

- **ACTION:** something you do by hand, on the PC.
- **CLEANUP:** code removed or tidied with no intended change to what the app does. Look for breakage next to it.
- **NEW:** new behaviour.
- **Failure looks like:** the sign that the change is broken.

Automated tests (`npm run test:tabs`, `npm run test:node`, `npm run lint:globals`, `npm run check:imports`,
`npm run check:ids`) pass on this branch in the Linux sandbox. They cannot see Windows, `sketchpad.bat`, real files,
real printing, or how pictures look. The detailed hand checks are in `docs/CHECKLIST_sweep-1.md` (T1 to T22) and
`docs/CHECKLIST_batch-1.md` (B1 to B16). This table points to them rather than repeating every step.

Undo for any commit: `git revert <commit>`. Each row gives the commit where it is clear which one to revert.

---

## Part A: `main` to `claude1`

### A1. Foundations (Phases 1 to 3)

| Change | What to test or look for |
|---|---|
| `50d88c3` Comment-only change | Nothing to test. |
| `02b89c2` Slice 0: registry line drawing goes through `drawLine` | **Draw:** open several objects (Cycloid, a Parabola, a Regular Polygon, Patterns > First Build). They draw as before: same shape, colour and line thickness. **Failure looks like:** a blank canvas, lines drawn in the wrong colour, or a console error naming `drawLine`. |
| `9f18063` Final mode draws only points; `pointsOnly`, dimming and the validator change removed | **CLEANUP** (`pointsOnly` removed). **Draw:** turn on final mode (points only). Only the points show, no lines. Turn it off: lines return. **Failure looks like:** lines still drawn in final mode, or no points at all. |
| `6c32968` Cycloid: the radius control changes the drawn size | **ACTION:** Draw > Cycloid, move the Radius slider. The drawing grows and shrinks. The later batch-1 commit `2cbf270` re-checked this; the sandbox says it works. Confirm on the PC. **Failure looks like:** the slider moves but the drawing does not change. |
| `e1a7677` Phase 2: missing imports fixed, window globals declared, `uiCallbacks` and legacy `uiState` entries removed | **CLEANUP.** Open every tab. **Failure looks like:** a red "X is not defined" or "Cannot read properties of undefined" in the console, or a button that does nothing. |
| `87cbe52` Phase 1: tab-switch test, Edit Manifest fixes, start-up stage logging, ESLint globals report | **ACTION:** run `npm run lint:globals` (expect 0 errors, 7 known warnings) and `npm run test:tabs` once as a baseline. **Edit Manifest** on any item: dialog opens; OK saves. **Failure looks like:** lint errors, or the dialog saving nothing. |
| `ff22c59` Phase 3: Notes popup (header comments), Show Script, Open in VS Code or Emacs | **ACTION:** caption menu v > Notes on several items: text appears. Show Script: text appears in the side panel. **Open in VS Code** on an item in a folder with a space in its name (e.g. `Curve Stitch`). **Failure looks like:** Notes empty or wrong item's text, or VS Code not opening (the Windows quoting is the usual cause; see `node/` and the sweep checklist T2). |
| `1248da9` Emacs button removed; Notes added to Patterns, Gallery, Utilities | **CLEANUP** (Emacs button). **ACTION:** Notes in Patterns, Gallery and Utilities. **Failure looks like:** Notes missing on one of those tabs. |

### A2. Figures shell and insertion (Phases 5 and 6a)

| Change | What to test or look for |
|---|---|
| `2781507` Phase 5: Figures shell | **ACTION:** Figures tab: Categories, Create Figure (only on Categories), subtabs, caption bar. **Failure looks like:** no way to create a figure, or a subtab that cannot be closed. |
| `a5132bd` Insert objects into figures; Create Figure button teardown fixed | **ACTION:** new figure, insert a line, a parabola, another line. Each appears as a layer. **Failure looks like:** insert does nothing; a figure leaves old drawing behind after you create another. |
| `4e33075` Layer numbers in sidebar, click-to-top order, dimming, insert offsets | **ACTION:** insert the same object twice: the second copy is offset, not on top of the first. Click a layer number: it moves to the top of the drawing. Inactive layers are dimmed. **Failure looks like:** identical objects on the same spot; wrong layer on top. |
| `a87e063` Show checkbox in the subtab bar; heading removed; final mode ignores hidden layers | **ACTION:** untick a layer's Show; the layer disappears; final mode does not show it. **Failure looks like:** a hidden layer still drawn in final mode. |
| `bab1844` Figure tools move to the caption bar | **ACTION:** the figure tools (Save, menu, etc.) are in the caption bar, not elsewhere on the page. |
| `3de23fd` Show All preview button | **ACTION:** Show All: every layer shows, ignoring Show ticks. **Failure looks like:** Show All leaves some layers hidden. |

### A3. Points model and points mode (Phases 6a to 6c)

| Change | What to test or look for |
|---|---|
| `87ecbde` Point model, 8b magic points and ruler notes in PHASES.md; hit-radius utility | Documentation mostly. **ACTION:** the hit radius (figure caption menu item) is in `uiState.figures.hitRadius`; change it and the handles are easier or harder to grab. |
| `8b350c9` Phase 6b: points mode with numbered anchored and free points | **ACTION:** tick **Points Mode**; numbered points appear on each layer. Click a point to place a free point. **Failure looks like:** no numbers, or numbers that change when unrelated layers change. |
| `4c2929c` Phase 6b revisions: Points Mode checkbox, active layer only, discs not dragged, handles live in both modes, selected disc ring | **ACTION:** discs do not drag; only handles do. Only the active layer's points are live. The selected disc has a ring. **Failure looks like:** a disc dragging on its own. |
| `6ee1a5a` Phase 6c: layer colours on strip numbers and discs; discs dimmed 50%; Show All checkbox; tools grayed in points mode; free discs draggable | **ACTION:** colours match between the number strip and the discs; discs look dimmed; caption tools are greyed in points mode; free discs drag. **Failure looks like:** tools active in points mode; free discs not dragging. |
| `9d21ccf`, `f2e746a`, `7c740be`, `90fe2b3`, `244a57f`, `b8fb975`, `6770246`, `3f3f728`, `6e571e8`, `7ee8f40`, `2f90e58`, `b5911f0` PHASES.md and CLAUDE.md wording only | Documentation. Nothing to run. |
| `6e571e8` Break-apart route and `drawLine`-based layer transform recorded | Documentation. |

### A4. Handles, arrow keys, layer transform, centroid (Phases 7, 7b, 7c, 7d)

| Change | What to test or look for |
|---|---|
| `3daaefe` Phase 7: arrow-key nudging of the selected handle through `moveHandle`; fixes for click slip, hidden active layer, handle-less objects | **ACTION:** click a handle, press an arrow key: it moves 1 px; with Shift, 10 px. Click a handle on a hidden layer: nothing happens. Select an object with no handles (e.g. some Patterns): no error. **Failure looks like:** a handle moves on arrow keys but not on drag, or a click on an object with no handles throws. |
| `cfc5362` Bounding box command, template pulldown, template X | **ACTION:** caption bounding box command: the box appears around the layer. Template pulldown lists templates. **Dismissing a template (X)** is noted as open in PHASES.md; expect it to be unfinished. |
| `5b04cb0` Phase 7b: layer transform, centroid, bounding box, rotate | **ACTION:** drag the centroid: the whole layer moves; the handles and discs move with it. Rotate the layer. Check that the handles still sit on the drawn shape after moving and rotating. **Failure looks like:** handles left behind after a move, or a layer that rotates about the wrong point. |
| `83ef0c2` Phase 7c: Break apart (Regular Polygon becomes parabola layers) | **ACTION:** Regular Polygon, Break apart: parabola layers appear. Each moves on its own. **Failure looks like:** the pieces do not match the original polygon, or a piece is missing. |
| `dc0215f` CLAUDE.md: second purpose recorded | Documentation. |
| `14c9faa` Phase 7d: `infrastructure()` widened to Regular Polygon, Inverse Star, Radiate | **ACTION:** Draw > Regular Polygon, Inverse Star, Radiate: infrastructure discs sit on their lines. Discs ride along when the object moves. **Failure looks like:** discs floating off the lines or in the wrong place. |
| `55b4078` Phase 7d second pass: `infrastructure()` for node-ring objects; points-mode cursor; Phase 8 spec rewrite | **ACTION:** the cursor in points mode changes (pointer over a point). Node-ring objects have infrastructure discs. |

### A5. Welds (Phase 8)

| Change | What to test or look for |
|---|---|
| `c0f0bf2` Phase 8: welds | **ACTION:** in a figure, drag a corner of one layer onto a corner of another and let go: the two are welded (weld mark shows). Drag one: the other follows. **Failure looks like:** no weld mark; one side does not follow. |
| `e8bfb64` Fix: a welded corner was still splitting on drag | **ACTION:** welded corner drags as one. **Failure looks like:** the two corners separate when dragged. |
| `189ba2c` Fix: right-click acted as a left button; a free disc counted as a corner | **ACTION:** a right-press on a handle does nothing it should not. A free disc is not treated as a corner. **Failure looks like:** right-press drags or welds. |

**Note.** The batch-1 commits below change this area again (the centroid ignores right-press; handle-to-handle welds). The right-press behaviour in A5 is superseded by D1.

---

## Part B: `claude1` to `claude/docs`

| Change | What to test or look for |
|---|---|
| `dca1145` Comment every Figures source file thoroughly | Comment-only. **Failure looks like:** nothing (no code change). |
| `ceb5c76` Rewrite the Tabs help pages against the split code; add the Figures page | **ACTION:** Help from any tab (Commands > Help): the Tabs pages open and read correctly. The Figures page exists. |
| `12e7fee` Ignore Python cache files from the docs builders | `.gitignore` only. |
| `e1b8a47` Subsystems help pages up to date; Point Dragging | **ACTION:** Help > Subsystems > Point Dragging opens. |
| `77c3962` Update the Design Notes; add the Figures undo proposal | Documentation. |
| `4392c1d` Help PDF builder; PDF bookmarks | Documentation. |
| `80fe622` The two PDFs (Figures code, commented; Help Overview) | **ACTION:** open `docs/Figures-code.pdf` and `docs/Help-Overview.pdf`; they open and have bookmarks. |
| `02d7bad` Remaining-Phases PDF; Phase 15 added | **ACTION:** `docs/Remaining-Phases.pdf` opens. |

---

## Part C: `claude/docs` to `claude/sweep-1`

Full detail with tests T1 to T22 is in `docs/CHECKLIST_sweep-1.md`. The table below gives the change and the look-for.

### C1. Node service (behind every Node-backed action)

| Change | What to test or look for |
|---|---|
| `d0cffed` Test setup: lock file synced, bootstrap dev dependency, import check | **ACTION:** `npm install`, then `npm run check:imports` (expect `0 problem(s)`). |
| `47fb051` Node service refuses foreign origins; paths kept inside their folders | **ACTION:** open the app at `http://127.0.0.1:5173` (not `localhost`): Node-backed actions fail (this is intended). Use `localhost` for normal work. **Failure looks like:** HTTP 403 on normal use, or a path outside the project being written. |
| `c9588b5` Node service split into one file per request family | **CLEANUP** (split). **ACTION:** T2: Create Thumbnail, Create Pattern, Save as secondary, Archive, Edit Manifest, Rebuild and Validate, Show Logs, Show Script > Open in VS Code, Help edit. **Failure looks like:** HTTP 400 naming a field, or "unknown requestName" in the Node window. |
| `b73d47c` Node follow-ups: atomic writes, shared helpers, one list of manifest folders, quiet switch | **ACTION:** after a Node-backed action, no file ending `.tmp` is left in the folder. `SKETCHPAD_QUIET=1` stops per-request printing. **Failure looks like:** EPERM or EBUSY in the Node window (Windows refused the rename; the service then copies, so the action should still succeed). |
| `9e6f385` `test:node` grows to 60 checks | `npm run test:node`: prints `60 passed` (later commits raise it to 102). |
| `3b1ff9c` `test:node` runs maintenance on a scratch copy (`SKETCHPAD_ROOT`) | **ACTION:** after `npm run test:node`, `git status` shows no changed manifests in your real repo. **Failure looks like:** manifests changed after a test run. |
| `8130df9` Old manifest scanners removed (about 900 lines) | **CLEANUP.** Covered by the Node checks above. |
| `4e7875f` Stale root copies of the Node scripts and `ui/foo1.js` removed | **CLEANUP.** **Failure looks like:** a Node script not found when started. |
| `ebf1119` `npm run build:static`: a read-only copy any web server can host | **ACTION (optional):** run `npm run build:static`; the output opens from a static server. |

### C2. UI structure

| Change | What to test or look for |
|---|---|
| `15ec7f0` Unused `render()` fallback removed; stale header, a sort quirk, duplicate keys fixed | **CLEANUP.** **ACTION:** lists sorted as before (Patterns, Gallery). **Failure looks like:** a list in the wrong order. |
| `0a8fd5b` Help pages match the code after the removals | **ACTION:** the Help pages read correctly. |
| `f6e9075` Unused UI code removed; one Draw runner in `ui/draw/` | **CLEANUP.** **ACTION:** Draw opens objects and redraws when a slider moves. **Failure looks like:** Draw opens an object with no handles, or will not redraw on slider changes. |
| `7107356` `nodeDispatch`: says plainly when the Node service is not running | **ACTION:** stop the Node window, then try a Node-backed action. **Expect:** a message that the service did not answer and how to start it. |
| `25900fd` `ui/uiUtilities.js` split | **CLEANUP** (split). **ACTION:** Commands panel opens on all six tabs. **Failure looks like:** "does not provide an export named ..." in the console. |
| `5c25bad` `ui/menuCmds.js` split | **CLEANUP** (split). **ACTION:** Edit Manifest, Show Script, Archive on Patterns, Gallery, Home and Utilities; Create Pattern and Create Gallery PNG in Draw. **Failure looks like:** "does not provide an export named ...". |
| `8e598a0` `ui/help.js` split; TinyMCE loads on first edit | **CLEANUP** (split). **ACTION:** Help: open a page, Edit (wait a moment the first time; instant the second), Save writes, Cancel closes. Create Help on a missing page opens an empty editor. **Failure looks like:** the editor never appears, or no menu bar. |
| `f848f26` `index.html` DIV STRUCTURE comment (comment only); `npm run check:ids` | **ACTION:** `npm run check:ids` prints `every looked-up id is in index.html`. |
| `2626906` `ui/` imports `armInteractor` and `disarmInteractor`; `overlay-nextprev` id fixed | **CLEANUP** (no more `window.` calls). **ACTION:** T5 in the sweep checklist: Draw > Cycloid handles drag and arrow keys nudge; switching tabs removes handles; Gallery > Experimental > variedEllipse still drags (it uses `window.armInteractor`). **Failure looks like:** handles that do not appear, do not move, or stay after leaving the tab. |
| `7e930f9` `clearDivs()` reads one region table (`ui/regions.js`) | **CLEANUP.** **ACTION:** visit every tab twice (T7). **Failure looks like:** leftover content from the previous tab in `#action`, `#caption`, `#text` or the canvas area. |
| `62a08cc` Home canvas page fails fast without `#canvasOverlayLayers` | **ACTION:** Home: open an item that draws. **Failure looks like:** an error at page load naming `#canvasOverlayLayers` (means `index.html` lost the div). |
| `3fa19dd` Encoding damage repaired in comments and the Start–End label | **ACTION:** Chords in Ellipse: the Mode list reads "Start–End", not "Startâ€“End". |
| `6443cf3` Pursuit manifest: duplicate merged | **ACTION:** Gallery > Scripts > Pursuit group: one "Pursuit Curves in Polygon"; count 10 (was 11); it runs. |
| `c27301c` Fast tab clicks; Utilities Result subtab; Gallery script path (with tests) | **ACTION:** click tabs quickly (Draw, Figures, Draw, Patterns); no stray handles, no console error. Utilities: the Result subtab is there and highlighted after leaving and returning. |

### C3. Look and CSS (Bootstrap removed)

| Change | What to test or look for |
|---|---|
| `f74073f` `css/base.css` replaces the Bootstrap stylesheet link | **ACTION:** the 25 screens in the Bootstrap before/after pictures (artifact "Sketchpad: Bootstrap removed, before and after") look the same in both states. Note any differences. |
| `a962472` Bootstrap removed: own side panel and accordion code; no script, no dependency | **ACTION:** T10 and T11 in the sweep checklist. Side panel slides in; closes by X, Escape, and a click on the dim; five open/close cycles leave no dim layer; the page behind does not scroll. Draw > Parametrics accordion opens and closes; "Four Ended" changes the drawing. Turn Wi-Fi off and reload (T14). **Failure looks like:** a panel that will not close, a stuck dim layer, an accordion section that will not open. |
| `71dd92c` CSS duplicate rules merged; empty legacy rule dropped | **CLEANUP.** **ACTION:** T12 and T13: hover highlights on tabs, subtabs, list items and Commands buttons match before; Tab key focus ring appears; a selected thumbnail has a black outline with a white and black ring; Help tree scrolls sideways for long names and is not underlined. **Failure looks like:** a missing highlight or focus ring. |
| `css/tabs.css` comment (in the sweep) | **Known, not a bug from this change:** the active top tab has no shadow today, and did not before. |

### C4. Deleted code and packages

| Change | What to test or look for |
|---|---|
| `d4982ff` Unused code and packages removed (approved): `deletePackageScript`, `renamePackageScript`, `editPackageScript`, three radio helpers in Edit Manifest, `serializeParamsObject`, a duplicate `saveSecondaryObject` in `drawExport.js`; packages `@jaames/iro`, `dexie`, `sharp` | **CLEANUP.** **ACTION:** `npm install` removes the three packages. Edit Manifest on any item: pick a preset status, type a custom one, clear it; OK saves. Draw: Create Pattern, Create Gallery PNG, Save as secondary each work. The Coloris picker still opens in Draw. **Failure looks like:** "... is not defined" or "does not provide an export named ...". |
| `daf82c0` Unreachable "show controls" checkbox code, its state field and CSS removed | **CLEANUP.** **ACTION:** Draw > Parametrics: tick and untick "Show Intersection Dots": the drawing changes each time. |
| `911c97b` `npm audit fix`: tinymce 8.3.2 to 8.10.1; vite 7.1.12 to 7.3.7 (lock file only) | **ACTION:** Help editor opens with a menu bar and toolbar; type, Save, reopen: the words are there. Check that every toolbar button and menu item appears. **Failure looks like:** a missing toolbar button or menu item. The fix is to copy `node_modules/tinymce` files into `public/tinymce` again (the skin, plugin and icon files there are from an older copy). Dev server starts and loads. |
| `b22427a`, `571ced4`, `64846dd`, `8ab911a` Checklist wording only | Documentation. |
| `4f875a0`, `4c05c10`, `ee2edb0`, `909225e`, `972d8f8`, `df476e5`, `77fe694`, `d1d344d`, `7acb169`, `3fa6071`, `025c481`, `c55c38c`, `75f0c3a` Checklists, runbook, report | Documentation. Nothing to run. |
| `1e2562d` Offcanvas aliases removed (`showCommandsOffcanvas`, `showOffcanvasPanel`) | **CLEANUP.** **ACTION:** all six Commands panels open; the secondary-thumbnail grid in Draw opens. **Failure looks like:** "is not a function" for those names. |

### C5. Ideabook, tests, tools

| Change | What to test or look for |
|---|---|
| `3be737d` Ideabook: stale `029.JPG` entry removed from `possible/manifest.json` | **ACTION:** Gallery > Ideabook: "possible" shows one fewer picture; 028 and 030 still show; "ok" still shows 029. |
| `a7f13f2` `test:tabs` covers the side panel, accordion, Edit Manifest dialog, Show Script, lazy help editor, Draw handle drag | **ACTION:** `npm run test:tabs` prints `PASS:` ending `no errors`. |
| `bd8c915` `npm run pixels:save` and `pixels:compare` (25 pictures, before and after) | **ACTION:** `npm run pixels:save -- one`, `npm run pixels:save -- two`, `npm run pixels:compare -- one two`: 25 lines, `All 25 pictures match.` Delete the `pixel-refs` folder afterward. Expected difference only in the batch-1 Commands panel (B8). |
| `ab8e17e` `npm run time:startup`; reanalysis report `docs/CHECK_REPORT_2026-10-31.md` | **ACTION:** `npm run time:startup`; compare with about 1.2 s to ready (sandbox). Your PC will differ. |
| `ab8e17e` docs notes on Project-only files | Documentation. |

---

## Part D: `claude/sweep-1` to `claude/batch-1`

Full hand checks: `docs/CHECKLIST_batch-1.md` (B1 to B16). Each row below names the checklist item.

### D1. Phase 8, next pass (merged from `claude/phase-8-next-on-sweep`, merge commit `5ce117e`)

| Change | What to test or look for |
|---|---|
| `72d9275` The centroid ignores every button but the left | **ACTION:** right-press on a layer's centroid does not move or rotate the layer (this supersedes A4's right-press behaviour if it moved). **Failure looks like:** a right-press moves the layer. |
| `17883c0` A handle dropped on another handle snaps and welds | **ACTION:** Figures: drag a handle of one layer onto a handle of another (within 10 px): it snaps exactly and a weld forms across the two layers; the notice says "Welded.". Drag one afterward: the other follows. Drag a handle *across* another handle without dropping on it: no weld. Snap radius is `uiState.figures.snapRadius` (10 by default). **Failure looks like:** no snap, snap on a drag that passes over, or a weld that does not carry the other layer. |
| `163afcf` Tests for the above | `test:tabs` covers these stages. |
| `fa33438` and `37a71a9` Header comments and PHASES.md update | Documentation. |
| Merge conflict resolution in `ui/figures/figureLayers.js` | **CLEANUP-relevant.** The handle-drop handler is attached in `wireInstance()`, so figures reopened from a saved file (Phase 10) also get handle-drop welds. **ACTION:** make a weld, save the figure, close, reopen, drop a handle onto another handle: it welds. **Failure looks like:** the drop works on a new figure but not a reopened one. |

### D2. Tab activation and launch from Home (B1)

| Change | What to test or look for |
|---|---|
| `80a9961` Tab activation: unused last-tab write and dead commented blocks removed; a launch intent runs inside the switch | **CLEANUP.** **ACTION:** Home: open a Draw item: Draw opens with that object. Click all six tabs twice. **Failure looks like:** right tab but wrong object, or the app stays on Home. |
| `761756f` Launch request survives until the target tab reads it; Figures in Home; Home to Figures opens the figure | **ACTION:** B6: Home lists figures that have a status; clicking one opens it in Figures. Rebuild & Validate then Home shows the figure. **Failure looks like:** nothing opens, or the figure is missing from Home. Known: Home keeps its list in memory and redraws after Rebuild & Validate or Edit Manifest (not on every return to the tab). If you see a Home reload bug, note exactly what you did. |
| `00eb7f3`, `2cbf270` Test changes; Cycloid radius recheck | **ACTION:** B2: Draw > Cycloid, Radius slider changes the drawing. **You noted it did not work earlier**; the sandbox says it works. Confirm on the PC and report if it still fails. |

### D3. Figures: delete, save, copy, archive, reset (B3, B5, B7, B10)

| Change | What to test or look for |
|---|---|
| `ed8d3b3` Delete layer (tombstone; discs removed; welds keep members on other layers) | **ACTION:** B3. Insert three objects, weld corners in a chain. Caption menu v > Delete layer: asks; Cancel keeps everything; OK removes the layer from the number strip and drawing, its discs go, weld marks that still join two other layers stay. Other numbers do not change. Delete the last layer: figure empty, nothing breaks. **Failure looks like:** a number left in the strip, a weld mark left over, a console error. |
| `0b946fc` Phase 10 node side: `saveFigure` writes `figures/<category>/<name>.json` atomically; keeps manifest and registry | **ACTION:** B5 step 2: the file exists; the category is in `figures/directoryRegistry.json`; the category manifest has the entry with status `new`; `help/figures/<category>` exists; no `.tmp` file left. **Failure looks like:** a `.tmp` file, or a missing manifest entry. |
| `3668684` Phase 10 UI: Save, Save As, open saved figures, ask before closing unsaved | **ACTION:** B5 steps 1 to 6: Save As asks category then name (use `First try`); Save replaces without asking; Save As with an existing name asks to replace; a bad name (`a:b`) is refused with a message; closing with unsaved changes asks, closing right after save does not; choosing a different layer is not a change. **Failure looks like:** closing asks right after saving, or no question when there are unsaved changes. |
| Phase 10 reopen (same commits) | **ACTION:** B5 steps 7 and 8: reopen from Categories; layers, colours, hidden and deleted layers, stacking, welds, point numbers, and any moved or rotated layer all as left. **Failure looks like:** a layer drawn differently after reopening. |
| `be7a108` Copy, Archive, Reset in the caption menu | **ACTION:** B10. Copy opens `<name> copy` as an unsaved subtab; changing it does not change the original. Reset (enabled only when there are changes since save) asks and restores the saved state. Archive (saved figures only) asks, moves the file to `figures/<category>/archive/`, drops the manifest entry, and the figure stays open as unsaved. **Failure looks like:** Archive leaves the file or the manifest entry; Reset leaves a drawn layer from the unsaved state. |
| Title edit does not create a second file (B7 in the checklist; no single commit) | **ACTION:** change a saved figure's title in its manifest, save: the same `.json` is replaced; no new file. **Failure looks like:** a new file under the new title. |

### D4. Cleanups and removals

| Change | What to test or look for |
|---|---|
| `faf235e` Deleted `draw/zzArchives.js` and `draw/zzFindBezierPoint.js`; their lint-ignore line | **CLEANUP** (approved by you). **ACTION:** the app starts; `npm run lint:globals` shows 0 errors. If you still have `shorten.js` on your PC, delete it there (it was never in the repo). **Failure looks like:** an import of one of the deleted files. |

### D5. Timings and instrumentation (B4)

| Change | What to test or look for |
|---|---|
| `6ab47c6` Instrumentation: `timed()` wrapper; Record, Show, Clear timings in Utilities > Commands; `?instrument`; `ui/instrument.js` | **ACTION:** Utilities > Commands: tick Record timings, use the app, Show timings lists the slowest first. Clear empties. `http://127.0.0.1:5173/?instrument` records from start-up. **Send me the slowest ten from a real launch.** With the box unticked nothing is recorded. **Failure looks like:** a Show timings list that is empty after activity, or an error on tab switch when recording is off (should cost nothing when off). |

### D6. Header notes on every script (B12)

| Change | What to test or look for |
|---|---|
| `4f50256` Header notes on all 195 scripts (86 new; 36 with a "Transparency:" line); `patterns/circles/cycloid.js` loses its first line `// cycloid.js` | **ACTION:** in Patterns, Gallery and Utilities, Notes on a few items (e.g. `patterns/builds/firstBuild.js`, `patterns/parametric/param29.js`, `gallery/Scripts/Generative/butterfly.js`). Tell me any note that is wrong. Two notes flag real problems: `regularCorners.js` and `regularTouching.js` call each other's function; `joiningPoints.js` looks unfinished. **Failure looks like:** a note that describes a different script. Comments only; a script's drawing should not change. |

### D7. Thumbnails (B13)

| Change | What to test or look for |
|---|---|
| `25c7d84` Thumbnails step 1: pictures in the category lists (Draw, Patterns, Gallery, Figures, Home); `writeThumbnail` request; picture written on figure Save; Utilities > Tools > Thumbnails (on or off, size) | **ACTION:** B13 steps 2 to 4. Pictures show in frames instead of names; hover shows the name; click still opens; Utilities lists still show names. Thumbnails on or off persists across reload. Size slider changes the pictures. Default is now 50. **Failure looks like:** blank or cropped pictures (say which item), names where pictures should be, a setting that resets after reload. |
| `2bbb663` Thumbnails step 2: Regenerate thumbnails (all or one set), Check Missing Images; picture maker module | **ACTION:** Utilities > Tools > Thumbnails > Regenerate: Draw (`Made 14 pictures`), Patterns (about 5 s), Gallery scripts (about 5 s; animated skipped; `arcsAndInner` and `voronoi` failed), Gallery images (about 90 s, 782 pictures). Check Missing Images lists none apart from skipped scripts. Create Pattern or Create Gallery PNG: the new picture is 200 by 200. **Failure looks like:** a script that should work listed as failed; Regenerate that hangs. |

### D8. Colour control without Coloris (B14)

| Change | What to test or look for |
|---|---|
| `95f6617` Coloris removed (package, style sheet, `main.js` setup, CSS rules, lint global); the browser's colour input is used; colours saved as `#rrggbb` | **CLEANUP** (Coloris). **ACTION:** `npm install`. Draw > Cycloid: Color swatch is blue; pick red: drawing turns red as you choose; reload; a few other Draw objects. Utilities > Lab > Color > Change Color HSL/RGB: both swatches work. **Failure looks like:** a swatch that does nothing; a Coloris-looking popup still present; a named colour (e.g. "blue") that no longer works (it should still draw, shown as hex). |

### D9. Manifest problems and the Home alert bar (B15)

| Change | What to test or look for |
|---|---|
| `7235fa6` The manifest check reports missing files and missing category folders or manifests; log starts with `PROBLEMS: n` and `ADDED: n`; Home alert bar; Rebuild & Validate "Broken files" list | **ACTION:** B15 steps 1 to 4. Add a test entry for a missing file (e.g. `{"filename":"ghost","path":"ghost.js","title":"Ghost"}`) to a Patterns manifest, run Rebuild & Validate, open Home: yellow bar naming the problem; Dismiss hides it for that log. **Remove the test entry afterwards.** **Failure looks like:** no bar although the log lists problems; the bar on other tabs; a log not starting with the summary. |

### D10. Manifest phase: one start-up run, complete rebuild after changes (B16)

| Change | What to test or look for |
|---|---|
| `1320a48` One start-up run; complete rebuild after manifest changes; default thumbnail size 50 | **ACTION:** B16 steps 1 to 5. Start with `sketchpad.bat`: the check runs once. Edit Manifest, change a status, OK, then Home: new status shows without reload. `node node/maintain_manifests.mjs` from the command line still rebuilds. **Failure looks like:** the check runs more than once at start; Home shows the old status; a missing-file entry disappears (it should stay and be reported). |

### D11. Tests and documentation

| Change | What to test or look for |
|---|---|
| `00eb7f3` `test:tabs` Draw handle-drag stage reads the Cycloid tab directly | Test only. |
| `npm run check:ids`, `check:imports` | Both should pass. |

---

## Cleanups in one place (for a code review)

These change code without meaning to change behaviour. If something breaks, look here first.

- Removed: `pointsOnly`, dimming and the validator change (9f18063); `uiCallbacks` and legacy `uiState` entries (e1a7677); Emacs button (1248da9); old Node manifest scanners (8130df9); stale root Node copies and `ui/foo1.js` (4e7875f); unused `render()` (15ec7f0); unused UI code (f6e9075); `deletePackageScript`, `renamePackageScript`, `editPackageScript`, three radio helpers, `serializeParamsObject`, duplicate `saveSecondaryObject` (d4982ff); unreachable show-controls checkbox code (daf82c0); offcanvas aliases (1e2562d); Bootstrap and its stylesheet link (a962472, f74073f); Coloris (95f6617); `zzArchives.js` and `zzFindBezierPoint.js` (faf235e); dead commented blocks and the unused last-tab write in `ui/setUI.js` (80a9961); `window.` calls in `ui/` (2626906).
- Split: `ui/uiUtilities.js` (25900fd); `ui/menuCmds.js` (5c25bad); `ui/help.js` (8e598a0); Node service into one file per request family (c9588b5).
- Consolidated: `clearDivs()` reads one region table, `ui/regions.js` (7e930f9); duplicate CSS rules merged (71dd92c); Pursuit manifest duplicate (6443cf3); Ideabook stale entry (3be737d).
- Packages: `@jaames/iro`, `dexie`, `sharp` removed; `npm audit fix` bumped tinymce and vite (911c97b).
- Atomic writes in the Node service (b73d47c): files are written to `.tmp` and renamed.

## Known, not changed by this branch

- `window.interactor` and `window.CanvasManager` are tested but never set (harmless).
- `parametrics` needs `#sharedCanvas` (fails if run before any canvas tab opened).
- `voronoi.js` needs the internet for `d3-delaunay`.
- Five moderate advisories remain (eslint chain, dev only); the fix is breaking.
- On a fresh checkout `utilities/logfiles` does not exist until the first rebuild.
- Draw, Figures and Patterns share one set of object settings (reproduced; your call; `NEXT_PASS.md` item 1a).
- Known script issues: `arcsAndInner` fails without controls; five animated scripts have no thumbnail; `joiningPoints.js` unfinished.

## Things only you can do

1. `npm install` (removes Coloris and the three packages; updates TinyMCE and Vite).
2. Start with `sketchpad.bat`. Confirm the manifest check runs once.
3. Run `npm run test:node`, `npm run test:tabs`, `npm run lint:globals`, `npm run check:imports`, `npm run check:ids`. Expected results are in the sweep checklist, section 1.
4. B13: Regenerate thumbnails (Draw, Patterns, Gallery scripts, Gallery images). Then tell me your preferred thumbnail size (try 40 to 200).
5. B2: confirm the Cycloid radius works on Windows.
6. B4: send the slowest ten timings from a real launch.
7. B6 and D2: confirm Home shows Figures under their status; report any Home reload bug with exact steps.
8. B8: `pixels:compare` should show only the Commands panel difference.
9. Delete on GitHub: `claude/phase-8b` (copy of sweep-1), and after review the two Phase 8 next-pass branches (`claude/phase-8-next`, `claude/phase-8-next-on-sweep`).
10. Review the two Phase 8 next-pass decisions in D1 (centroid left-button only; handle-drop welds).
