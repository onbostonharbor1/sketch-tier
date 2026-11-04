# Checklist: what to check by hand on `claude/tier-a` (and `claude/codespaces`)

Each item is also a line on Home > Checklist, where you tick it. Each says what to do and what failure looks like.
Undo for any item: `git revert` the commit named.

**Setup.** `git fetch`, `git checkout claude/tier-a`, `npm install`, restart Vite and the Node service
(`sketchpad.bat`).

**T1. Shapers and connectors** (a8f4411). `npm run test:shapers`: "20 shaper and connector tests passed". Read
`draw/shapers.js` and `draw/connectors.js`: each function has a block comment, and the header lists them
alphabetically. Nothing uses them yet except the tests; the Ideabook routines are yours to rewire. Failure: a test
fails, or a function you can't follow. Tell me which.

**T2. Step through the drawing** (50b9521). Draw > Cycloid > caption menu v > **Step through the drawing**. The left
column shows `|<  <  >  >|`, a slider and "Line N of N: (x, y) to (x, y), colour". The last line is red. Press `|<`:
only line 1 shows, in red, with a dot at its start. Press `>` a few times, drag the slider, move a Cycloid slider:
the drawing changes and stepping carries on. **Done stepping** draws everything again. Switch tabs while stepping and
come back: stepping has ended. Failure: lines missing after Done; the readout not matching the red line.

**T3. Errors as a checklist** (19e56b3, then the Show all and Purge change). Make an error: F12 console,
`setTimeout(() => { throw new Error("probe") }, 0)`. The red bar lists it with a **Tick** button. Tick it: it leaves
the bar. Make it again and reload: Home's yellow bar says "1 error is not yet ticked". Home > **Errors**: it's listed
with a checkbox. Tick it: it goes. Tick **Show all**: it's back, greyed and ticked. **Purge ticked**, then OK: it's gone
even with Show all. `utilities/logfiles/errors_<today>.txt` still has every line, plus "Acknowledged:" and "Purged:"
lines. Failure: an error that reappears after a tick without happening again.

**T4. Home > Notes** (19e56b3). Shows `home/notes.md`. **Open in VS Code** opens it. Edit and save, then **Reload**:
the new text shows.

**T5. Home > Checklist.** This list. Tick an item: it goes. **Show all**: ticked items show greyed; untick one and it's
back. Type in the box and **Add item** (or press Enter): it's added at the end. **Purge ticked**, then OK: ticked lines
are removed from `home/checklist.md`. Open the file in VS Code: it's a plain Markdown task list, and you can edit it
there too.

**C1. A Codespace from the iPad** (claude/codespaces). On github.com, open the repository, choose the branch, then
Code > Codespaces > Create codespace. Wait for setup: it runs `npm install`, then `npm run dev:all`. Open port 5173
(Ports panel, or the pop-up). Sketchpad opens. Draw works. Figures > Save As works (it uses the Node service), and the
error log is written. Stop the Codespace when done (github.com/codespaces). Failure: "The Node service did not answer";
tell me what the terminal shows.

**C2. The PC after the Codespaces change.** Start as usual. Save a figure, Utilities > Show Logs, Regenerate
thumbnails: all still work. Failure: "did not answer" messages while the Node service window is running.
