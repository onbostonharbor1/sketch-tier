# Finishing Version 1: plan and progress

Branch `claude/v1-finish`, started 1 November 2026 from `claude/batch-1` with the figure-file split
(`claude/hopeful-dirac-iirr6d`) merged in.

**To resume:** in the same session say "continue". In a new session: "Continue `claude/v1-finish` from
`docs/V1_FINISH_PLAN.md`." Work resumes at the first item not marked Done. This file is updated and pushed with every
finished item, so it is always the true state.

**Models:** items marked **Opus** need judgement; items marked **Sonnet** are routine. Barry (1 Nov): do not stop to
switch models; keep going until paused.

**Rules for this branch:** every item ends with its tests passing (`lint:globals`, `check:imports`, `check:ids`,
`test:tabs`; `test:node` where Node changes). Every guess on an open question goes in the decisions log below. The figure
file format, once item 1 is done, may only gain fields (never rename or remove), so V2 can always import it.

## Items

| No. | Item | Model | Status |
|---|---|---|---|
| 1 | Figure file format made upgradeable: layer `lid`, `objectVersion`; named handles; layer `role`; `includeInOutput`; `units` and `scale`; `createdBy`; documented in `docs/FIGURE_FORMAT_V1.md`; round-trip test | Opus | Done |
| 2 | Bug: Draw, Figures and Patterns share one set of object settings | Opus | Done |
| 3 | Bug: script state leak (scripts fail after about 100 earlier runs) | Opus | Not started |
| 4 | 8b magic points: midpoints, lobe tips, cusps, crossings, named by feature | Opus | Not started |
| 5 | 9 print aids: units and scale, scale bar, 100 mm calibration line, true-size print, nail spacing check, weld group prints as one nail, output inclusion | Opus | Not started |
| 6 | Templates as layers with a role: guide shapes, ruler, bounding-box template, X hides | Opus | Not started |
| 7 | Break apart for the other composite objects | Opus | Not started |
| 8 | Parametric draggable points | Opus | Not started |
| 9 | 13 Sweep tool (guess: parameter study grid) | Opus | Not started |
| 10 | 12 Insert list as icons with larger preview on hover | Sonnet | Not started |
| 11 | Pursuit (temp): leftover point picker becomes a handle | Sonnet | Not started |
| 12 | Gallery-script facility survey for the V2 legacy adapter (into `V2_IDEAS.md`) | Sonnet | Not started |
| 13 | Checklist for Barry (`docs/CHECKLIST_v1-finish.md`), PHASES.md and NOT_DONE.md updated | Sonnet | Not started |

Skipped on purpose (V2 replaces them): 14 file boundary, 15 commands pattern, one restore shape, START case in tab
activation, `!important` and show/hide cleanup, `validateDrawRegistry`, Node follow-ups.

## In progress

(nothing yet)

## Decisions log (guesses Barry may reverse)

| No. | Item | Question | Guess |
|---|---|---|---|
| G-1 | 5 | Units | Millimetres; scale set from one measurement Barry gives |
| G-2 | 5 | Nail size | Diameter 2 mm, clearance 3 mm, both editable |
| G-3 | 5 | Coincident points that are not welded | Print as one nail, with a warning |
| G-4 | 6 | Template X | Hides the layer; inserting the same template again shows the hidden one |
| G-5 | 8 | Parametric handles | One handle moves the curve, one scales it |
| G-6 | 9 | Sweep tool | A grid of drawings over a range of one setting; click one to keep it |
| G-7 | 7 | Which composites | Inner Star, Inverse Star, Circular Parabola, Mystic Rose |
| G-8 | 1 | Rename `layer.id` to `layer.object`? | No. `id` stays the registry key (read in five places); V2 reads it as the object name. Points keep layer indices, which are permanent; `lid` is always L + index + 1 |
| G-9 | 1 | Registry `version` values (1.0, 2.7 ...) | All set to the whole number 1 as the starting point for saved figures |
