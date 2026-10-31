/* ui/homeAlert.js
   ------------------------------------------------------------
   The alert bar on the Home tab (#alertBar in index.html).

   Every manifest check (at start-up and Utilities > Rebuild & Validate) writes a log in
   utilities/logfiles whose first lines are a summary:

       PROBLEMS: 2
         patterns/circles: "ghost.js" is listed in manifest.json but the file is missing
         ...
       ADDED: 1
         ...

   showHomeAlert() reads the newest such log and, when it lists problems, shows how many with the
   first few, so that a problem does not wait until someone remembers to open the log files. The
   bar has a Dismiss button; a dismissed log stays quiet, and the next log that has problems shows
   again. If the Node service is not running there is no log to read and the bar stays hidden.

   Exports:
     showHomeAlert()
     parseMaintenanceSummary(text)    pure: the log text in, { problems: [...] } out
   ------------------------------------------------------------ */

import { nodeListLogFiles, nodeReadLogFile } from "/ui/nodeLayer.js";
import { uiState } from "/ui/uiState.js";

const SHOWN = 5;          // how many problems the bar lists


/* ------------------------------------------------------------
   parseMaintenanceSummary(text)
   ------------------------------------------------------------ */
export function parseMaintenanceSummary(text) {

  const lines = String(text).split(/\r?\n/);
  const at = lines.findIndex((l) => /^PROBLEMS: \d+/.test(l));
  if (at < 0) return { problems: [] };

  const problems = [];
  for (let i = at + 1; i < lines.length && lines[i].startsWith("  "); i++) problems.push(lines[i].trim());
  return { problems };

} // end parseMaintenanceSummary


/* ------------------------------------------------------------
   showHomeAlert()
   ------------------------------------------------------------ */
export async function showHomeAlert() {

  const bar = document.getElementById("alertBar");
  if (!bar) return;

  let name, text;
  try {
    const list = await nodeListLogFiles(30);
    const newest = (list.files || []).find((f) => f.name.startsWith("manifestMaintenance_"));
    if (!newest) return;
    name = newest.name;
    text = (await nodeReadLogFile(name)).text;
  } catch (err) {
    return;                                   // no service, no log folder yet: nothing to say
  }

  const { problems } = parseMaintenanceSummary(text);
  if (problems.length === 0 || uiState.homeAlert.dismissedLog === name) {
    bar.innerHTML = "";
    bar.style.display = "none";
    return;
  }

  bar.innerHTML = "";

  const head = document.createElement("div");
  head.className = "alert-head";
  const title = document.createElement("strong");
  title.textContent = "The last manifest check found " + problems.length + (problems.length === 1 ? " problem" : " problems") + ":";
  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "alert-dismiss";
  dismiss.textContent = "Dismiss";
  dismiss.addEventListener("click", () => {
    uiState.homeAlert.dismissedLog = name;
    bar.innerHTML = "";
    bar.style.display = "none";
  });
  head.appendChild(title);
  head.appendChild(dismiss);
  bar.appendChild(head);

  const ul = document.createElement("ul");
  for (const p of problems.slice(0, SHOWN)) {
    const li = document.createElement("li");
    li.textContent = p;
    ul.appendChild(li);
  }
  bar.appendChild(ul);

  const foot = document.createElement("div");
  foot.className = "alert-foot";
  foot.textContent = (problems.length > SHOWN ? "...and " + (problems.length - SHOWN) + " more. " : "") +
                     "Log: " + name + " (Utilities > Show Logs).";
  bar.appendChild(foot);

  bar.style.display = "block";

} // end showHomeAlert

// end homeAlert.js
