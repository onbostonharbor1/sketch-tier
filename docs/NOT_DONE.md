# Not done: items from the phase lists

Status as of `claude/batch-1` (31 October 2026). Each item has a number so it can be quoted. "Built, not merged" means
the code is on `claude/batch-1` and waiting for your review. Sources: `PHASES.md`, `docs/WHAT_WAS_DONE_batch-1.md`,
the two checklists, and `docs/Remaining-Phases.pdf`.

## 1. Phase table (PHASES.md)

| No. | Phase | Not done | Notes |
|---|---|---|---|
| 1.1 | 8b Magic points | Not started | More candidate kinds (midpoints, tops of loops, cusps) as weld targets and for parametric objects. |
| 1.2 | 9 Print aids | Not started | Scale bar; minimum nail-spacing check; printing at size. Needs nail size and highlight-vs-list answers from you. |
| 1.3 | 10 Save and recovery | Partly open | Built. The Phase 10 title says "undo", and the as-built section does not list undo. Confirm whether undo is wanted here or belongs in 11. Also not built: saving welds with the figure; move-to-another-category; Show Script for figures. |
| 1.4 | 11 Figure follow-ups | Not started | A collection; you choose what goes in. Delete-layer was pulled into batch-1 (see 3.x). |
| 1.5 | 12 Thumbnails | Partly done | Category pictures built (batch-1). Not done: the Insert list as icons with a larger preview on mouseover; final thumbnail size (default 50, you choose). |
| 1.6 | 13 Sweep tool | Not started | No description on record. |
| 1.7 | 14 Filesystem boundary refactor (C3) | Not started | One place where the app talks to files; "best after Phase 10", which is now built. Starts with a table of every file and Node access, for you to read first. |
| 1.8 | 15 Older tabs on the figuresCommands pattern | Not started | Investigate first: write down the pattern, compare each tab, report with a recommendation per tab. Rebuild only what you choose. |
| 1.9 | 8, next pass | Built, not merged | Handle-to-handle welds and centroid left-button-only are in `claude/batch-1`. Review pending (see 5.x). |
| 1.10 | Batch 1 | Built, not merged | Waiting for your review and the B-checklist (`docs/CHECKLIST_batch-1.md`). |

## 2. Phase sections: open items

| No. | Item | Phase | Status |
|---|---|---|---|
| 2.1 | Dismissing a template (X): hide or destroy | Templates (PHASES "Dismissing a template") | Open. Recommended: hide. Needs delete-layer rules first, which now exist. |
| 2.2 | Inserting a template again while a hidden copy exists: show the hidden one or add a new layer | same | Open. |
| 2.3 | Figure templates: guide shapes (rectangle, circle) as template layers, left out of Show All and print; a temporary ruler; a "Create bounding box" template; a pulldown on the caption bar; the X | End-list item 7 | Not started. Design with you first. |
| 2.4 | Other composite objects for break apart: inner star, inverse star, circular parabola, mystic rose and the rest | 7c | Not done. Each needs its own `decompose()`; Parabola ones are "the same few lines". |
| 2.5 | Curved-arc primitive for an arc piece | 7c | Not built. A new primitive to design, not a reuse. Kept for when the curved group is picked up. |
| 2.6 | `center()` wired into the centroid diamond (7b) | 7d | Not wired. Barry's call: changes the rotation pivot and the box drawn around the object. |
| 2.7 | Parametric objects: draggable points (lobe numbering the first idea) | Open design questions | Not started. |
| 2.8 | Dragging an anchored point off its arm: detach it as a free point, keeping number and layer? | Open design questions (6b) | Open. |
| 2.9 | Rule for which layer moves in a weld, freezing, automatic or asked; weldable object types beyond lines | Open design questions (8) | Partly answered by the 8 next pass. Confirm the rule. |
| 2.10 | Saving welds with the figure | Phase 10 | Not built. |
| 2.11 | Detecting a weld that would make an unreachable cycle before the drag | Phase 8 | Not built. Deliberately relies on the after-the-fact check. |
| 2.12 | Printed template: one number per hole, or two numbers at one spot allowed? | Phase 8 / 6c | Open. 6c answer: a group is one nail; Phase 9 counts each group once. Confirm. |
| 2.13 | Display: a weld group's marker (stacked discs show only the top layer's colour) | 6c review | Open. |
| 2.14 | `printCircNum` and `drawState.ctr` still in `draw/drawUtilities.js` (called by some pattern scripts) | 6c | Kept on purpose. Remove only when those scripts change. |
| 2.15 | Show Script for figures | Phase 10 | Not built. |

## 3. End-of-work list (Remaining-Phases PDF, page 19; from PHASES.md)

| No. | Item | Status |
|---|---|---|
| 3.1 | Check Coloris: version, loads, works without the dev server | Superseded. Coloris was removed (`95f6617`) for the browser colour input. Confirm on the PC (B14). |
| 3.2 | Update `validateDrawRegistry` once the JSON shape is stable; add the rule that registry draw code draws only through `drawLine` | Not done. No commit found for it. |
| 3.3 | Cycloid radius does not change the drawn size | Fixed in the sandbox (`2cbf270`, test added). Waiting for your check on the PC (B2). |
| 3.4 | Simplify tab activation: Home starts with saved empty like the others; remove the special START case in `setUI.js`; remove dead blocks | Partly done. Dead blocks and the unused last-tab write removed (`80a9961`). The START case is not confirmed removed; check `ui/setUI.js`. |
| 3.5 | Utilities shows its last result again when you come back | Done (built before batch-1; "Utilities redisplay"). Confirm with B1 if you want. |
| 3.6 | One restore shape for all tabs: delete the dead `save()` and `restore()` code (no tab's `save()` is called today); document the convention that is used | Not done. |
| 3.7 | Utilities command for the global hit radius | Optional. Not done. The hit radius is in the Figures caption menu. Drop if unused. |
| 3.8 | HTML help pages: which further pages you want | Open question for you. Most of the Help Overview update is done (`P2` to `P8` in the review table). |
| 3.9 | Delete layer | Done (`ed8d3b3`, batch-1). Was not on the list; listed under 1.4 in its phase. |

## 4. Cleanup and follow-up lists (sweep-1 and batch-1 checklists)

| No. | Item | Where it is written down | Status |
|---|---|---|---|
| 4.1 | Draw, Figures and Patterns share one set of object settings (reproduced) | `CHECKLIST_sweep-1.md` section 6; `NEXT_PASS.md` 1a (Project file) | Not done. Your call. |
| 4.2 | Script state leak: two scripts fail after about 100 earlier scripts | Sweep checklist section 6 | Not done. Needs a look at which `drawState` fields survive `resetCanvas()`. |
| 4.3 | Five moderate advisories (eslint chain, dev only) | Sweep checklist section 6 | Not done. The fix is a breaking eslint change. |
| 4.4 | Confirm two Node scripts are still wanted; one possible duplicate escape function; the manifest-run guard and VS Code quoting (Runbook Job 4); split the Edit Manifest dialog file | `FOLLOWUPS_node-service.md` (Project file); `docs/RUNBOOK_deferred.md` | Not done. Few items left. |
| 4.5 | 46 `!important` lines in the CSS | `docs/RUNBOOK_deferred.md` Jobs 1 to 4 | Not done. Step-by-step for the PC. |
| 4.6 | 46 show/hide lines (`.style.display` assignments) | Runbook Job 2 | Not done. Visibility should move into state, one by one. |
| 4.7 | Fixed `#categories` and `#drawControls` (created by code, not in `index.html`) | Runbook | Not done. |
| 4.8 | Five scripts with no thumbnail (animated); `arcsAndInner` fails without controls; `voronoi` needs the internet; `joiningPoints.js` looks unfinished | Batch-1 checklist B12, B13; `SCRIPTS_to_investigate.md` (Project file) | Not done. |
| 4.9 | `window.interactor` and `window.CanvasManager` tested but never set | Sweep checklist section 5 | Harmless. Remove when convenient. |
| 4.10 | Active top-tab shadow defined in `css/tabs.css` but cancelled by a later `!important` | Sweep checklist section 5 | Known; not caused by the sweep. Decide whether to restore it. |
| 4.11 | Fresh checkout: `utilities/logfiles` does not exist until the first rebuild | Sweep checklist section 5 | Known. Create the folder, or leave it. |
| 4.12 | Help pages that still say "Bootstrap" were not rewritten | Sweep checklist section 6 | Not done. |
| 4.13 | Help Overview PDFs not regenerated after the code changes | Sweep checklist section 6 | Not done. Rebuild with `docs/build`. |

## 5. Batch-1 items waiting on you

| No. | Item | What is needed |
|---|---|---|
| 5.1 | Review and merge `claude/batch-1` | After the B-checklist. Nothing merged to `claude1` or `main`. |
| 5.2 | Final thumbnail size | You choose after trying 40 to 200 (B13 step 4). |
| 5.3 | Cycloid radius confirmation | B2. |
| 5.4 | Confirm the centroid change (right-press ignored) and handle-drop welds | Review N1 and N2 in `docs/TEST_TABLE_main-to-batch-1.md`. |
| 5.5 | Delete `claude/phase-8b` on GitHub | Not done by me (no delete access from here). |
| 5.6 | Delete `claude/phase-8-next` and `claude/phase-8-next-on-sweep` after review | Not done. |
| 5.7 | Barry's "Deferred" and "Dropped" lists | PHASES.md says they belong there; they are not reproduced in the file. Paste them in. |

## 6. Architecture rebuild

Not included yet. I searched the repo, `PHASES.md`, `docs/Remaining-Phases.pdf`, the Claude Project artifacts, and the
Claude Docs "Backlog Triage and Figures Tab Spec (draft 3)" document. None of them contains a discussion of rebuilding
Sketchpad with a unified, updated architecture. The closest material is the end-of-work list (3.6, 3.7), Phase 14 (filesystem
boundary) and Phase 15 (older tabs on the figuresCommands pattern). Please say where the discussion is (a Project file
name, a doc link, or a note you can paste), and it will be added here as its own section.
