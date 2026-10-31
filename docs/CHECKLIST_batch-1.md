# Checklist: what to check by hand for `claude/batch-1` (on top of `claude/sweep-1`)

Everything here passes the automated tests (`test:tabs`, `test:node`, lint, imports, ids). These are the things a test
cannot see or that need your PC (Windows, real files, the real Home list). Each says what to do, what a failure looks like,
and how to undo. Branch: `claude/batch-1`. Setup: `git fetch`, `git checkout claude/batch-1`, `npm install`, start as usual.
If `ui/uiState.js` or many files change while Vite is running, stop and restart Vite.

**B1. Tab switching and launching from Home (`80a9961`, `761756f`).** Click through all six tabs twice. Home: open a Draw
registry item from a category (for example one under a status): Draw opens with that object. Failure: the right tab opens
but not the object, or the app stays on Home. Undo: `git revert 761756f 80a9961`.

**B2. Cycloid radius (`2cbf270`, test only).** Draw > Cycloid: move the Radius slider; the drawing grows and shrinks. The
automated test says it works; you noted it did not, so confirm on your PC and tell me if it still fails there.

**B3. Delete layer (`ed8d3b3`).** Figures: new figure, insert three objects (two lines and a parabola), weld one corner of
the first to the second and one corner of the second to the third (your Phase 8 gesture). Caption menu v > Delete layer:
a question appears; Cancel keeps everything; OK removes the layer from the number strip and the drawing, its dots go, and
the weld marks that still join two other layers stay. Numbers of the other layers do not change. Delete the last layer:
the figure is empty and nothing breaks. Failure: a number left in the strip, a weld mark left over, an error in the console.
Undo: `git revert ed8d3b3`.

**B4. Timings (`6ab47c6`).** Utilities > Commands: tick Record timings, use the app (switch tabs, open items), come back:
Show timings lists the slowest first (tab switches, manifest loads, file requests, service calls). Clear timings empties it.
Also try `http://127.0.0.1:5173/?instrument` to record from start-up. With the box unticked nothing is recorded. Your
numbers are the useful ones: send me the slowest ten from a real launch. Undo: `git revert 6ab47c6`.

**B5. Save, Save As, reopen (`0b946fc`, `3668684`). Needs the Node service running (`npm run dev:all`).**
1. Figures: new figure, insert two or three objects, weld two corners. Caption menu v > Save As...: the first box asks the
   category (new name is fine), the second the name. Use a name with a space, such as `First try`.
2. In your project folder: `figures/<category>/First try.json` exists, the category is in `figures/directoryRegistry.json`,
   `figures/<category>/manifest.json` has the entry with status `new`, `help/figures/<category>` exists, and no `.tmp` file.
3. Menu > Save again: no questions, the file is replaced. Make a change and press Save: the change is in the file.
4. Menu > Save As... with the same category and name: it says the name exists and asks to replace. Cancel changes nothing.
5. Try a bad name such as `a:b`: you get a message and nothing is written (Windows would refuse the name anyway).
6. Close the figure subtab (the x): with a change since saving it asks; right after saving it does not. Choosing a different
   layer to look at is not a change. Close it.
7. Figures > Categories: the category lists your figure. Click it: it opens in a new subtab with the layers, colours,
   hidden layers, stacking and welds as saved. Drag a handle: a weld still carries the other end. Click it again in the list
   while it is open: it just shows the open one.
8. Try a harder one: a figure with a hidden layer, a deleted layer, a changed layer colour, a moved or rotated layer; save,
   close, reopen; all as left.
Failure: an alert box with a message, a console error, a layer drawn differently after reopening. Undo:
`git revert 3668684 0b946fc` (the saved files stay; delete them by hand).

**B6. Figures in Home (`761756f`).** Utilities > Commands > Rebuild & Validate (this adds figures that have a status to
Home). Edit Manifest on your figure (Figures has no Edit Manifest item yet; use Utilities or edit
`figures/<category>/manifest.json`: `status` to `working`). Rebuild again. Home shows the figure under that status: click
it: the Figures tab opens it. Known: Home does not re-read its list when you come back to the tab (the manifest bug you
described); restart the page or Rebuild to see new entries. Undo: `git revert 761756f`.

**B7. Title edit does not create a second file.** After B6, change the figure's title in its manifest, open the figure, make
a change, Save. The same `.json` file is replaced and no new file appears. Failure: a new file under the new title.

**B8. The picture comparison (`npm run pixels:compare`) will show one intended difference:** the Utilities Commands panel
(the timings controls). Everything else should be identical to a run from `sweep-1`.

**B10. Copy, Archive, Reset (`be7a108`). Needs the Node service for Archive.**
1. Open a saved figure (B5). Caption menu v > Copy: a new subtab "<name> copy" opens with the same layers; it is unsaved
   (closing it asks). Changing the copy does not change the original.
2. In the original, make a change: menu > Reset is now enabled. Reset asks, then the change is gone and the figure is as
   saved (welds and layers too). Reset is grayed on a figure with no changes or never saved.
3. Menu > Archive (enabled only on a saved figure): asks; then `figures/<category>/archive/<name>.json` exists, the original
   file is gone, the manifest entry is gone, an "Archived" notice shows. The figure stays open and counts as unsaved
   (closing asks; Save As puts it back).
Failure: Archive leaves the file in place or the entry in the manifest; Reset leaves a drawn layer from the unsaved state.
Undo: `git revert be7a108` (archived files stay in `archive/`; move them back by hand).

**B11. Deleted files (`faf235e`).** `draw/zzArchives.js` and `draw/zzFindBezierPoint.js` are gone (your instruction), and
their lint-ignore line. `shorten.js` was not in the repo, so nothing was deleted for it; if you still have one on your PC,
delete it there. Check: the app starts and `npm run lint:globals` shows 0 errors. Undo: `git revert faf235e`.

**B12. Header notes on every script (`4f50256`).** All 195 scripts in `patterns/`, `gallery/` and `utilities/` now
start with a comment that says what they draw (86 got a new one; the others kept theirs). 36 of them also say how they use
transparency (a line starting "Transparency:"). Only comments were added; the one other change is that
`patterns/circles/cycloid.js` lost its first line `// cycloid.js`, which only repeated the file name. Check: in Patterns,
Gallery and Utilities open a few items and use the caption menu v > Notes: the text shows. Skim any you know well, for
example `patterns/builds/firstBuild.js`, `patterns/parametric/param29.js` and `gallery/Scripts/Generative/butterfly.js`, and
tell me what is wrong; I wrote the notes from reading the code and could not check them against the pictures. Two notes flag
things I noticed: `regularCorners.js` and `regularTouching.js` call each other's function, and `joiningPoints.js` looks
unfinished (it passes numbers where other scripts pass points). Undo: `git revert 4f50256`.

**B13. Thumbnails (commits `25c7d84` and `2bbb663`).** Start the app with the Node service running.
1. Utilities > Tools > Thumbnails > **Regenerate thumbnails**: choose Draw, press Regenerate, OK. It reports "Made 14 pictures".
   Check `drawRegistry/<key>/images/thumb_<key>.png` now exist. Then choose Patterns (about 5 seconds), Gallery scripts (about
   5 seconds; it lists animated scripts as skipped and `arcsAndInner` and `voronoi` as failed) and Gallery images (about a
   minute and a half, 782 pictures). Then All, if you like.
2. Open Patterns > Categories, Gallery (Ideabook, Patterns, Scripts), Draw, Figures: each frame shows pictures, not names.
   Hover shows the name; click opens the item as before. Utilities lists still show names. Home shows pictures for items from
   those tabs.
3. **Thumbnails on or off**: untick it; open Patterns: names. Reload the page: still off. Tick it again.
4. **Thumbnail size**: move the slider; open Patterns: the pictures are that size. Try 40, 100, 200 and tell me the size you
   want as the default.
5. **Check Missing Images**: lists items with no picture (should be none after step 1, apart from the skipped scripts).
6. Save a figure (B5): its picture appears in the Figures list. Create Pattern or Create Gallery PNG in Draw: the new item's
   picture is 200 by 200.
Failure: pictures that are blank or cropped oddly (tell me which item), a script listed as failed that you expected to work,
names showing where pictures should be. Undo: `git revert` the thumbnail commits (picture files stay; delete them by hand).

**B9. Loose end.** On GitHub, delete the old branch `claude/phase-8b` (a copy of `sweep-1`). I cannot delete it from here.
