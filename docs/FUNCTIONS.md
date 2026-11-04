# Function dictionary

Made by `npm run dictionary` from the comments above each function (tests/functionDictionary.mjs). Do not edit by hand: change the comment, then run it again.

742 functions in ui, draw, classes, drawRegistry, node; 322 without a comment above them.

| Function | Where | What it does |
|---|---|---|
| `_m` | draw/drawUtilities.js:486 | (no comment) |
| `acknowledge` | ui/errorChecklist.js:94 | write "Acknowledged: <key>" to today's error log. |
| `activateCentroid` | ui/figures/figureCentroid.js:219 | Starts listening. |
| `activateGallerySubtab` | ui/gallery/galleryNav.js:172 | (no comment) |
| `activateHomeSubtabButton` | ui/home/homeNav.js:122 | (no comment) |
| `activatePointPicker` | ui/interactor.js:119 | CORE PICKER LOGIC |
| `activatePointsInput` | ui/figures/figurePointer.js:156 | redraw() redraws the whole figure. |
| `activateSubtab` | ui/resultsViewController.js:98 | Applies "active" CSS class to the button matching activeId and removes it from all others within the subtab bar. |
| `activateTab` | ui/setUI.js:109 | (no comment) |
| `activateUtilitySubtab` | ui/utilities/utilitiesNav.js:91 | (no comment) |
| `activateWithReport` | ui/setUI.js:164 | (no comment) |
| `addAnchoredPoint` | ui/figures/figurePoints.js:250 | Allocate the next number and add the point. |
| `addCaptionTools` | ui/figures/figuresNav.js:184 | Puts the figure's tools in the gray caption bar (same row as the title and the "v" menu button). |
| `addCategory` | node/figureFiles.mjs:107 | The folder, an empty manifest, the line in directoryRegistry.json (kept sorted) and the help folder that mirrors it. |
| `addDrawSubtab` | ui/draw/drawNav.js:96 | (no comment) |
| `addFreePoint` | ui/figures/figurePoints.js:267 | transform: the active layer's transform, so the free disc's position can be stored in that layer's object space (ox, oy) and travel with the layer from then on. |
| `addHandlePoint` | ui/figures/figurePoints.js:287 | A disc that rides on handle number h of the layer's object (see "h" in the header). |
| `addPatternSubtab` | ui/patterns/patternsNav.js:99 | (no comment) |
| `adjustStartEnd` | draw/drawEllipse.js:106 | (no comment) |
| `allPairs` | draw/connectors.js:129 | every point joined to every other, each pair once. |
| `appendErrorLog` | node/logAndEditorRequests.mjs:246 | TASK: appendErrorLog DESCRIPTION Appends errors reported by the app (ui/errorReport.js) to today's |
| `appendManifestEntry` | node/writerRequests.mjs:47 | Adds one entry to the end of a manifest (a JSON array). |
| `applyEditManifest` | ui/editManifestDialog.js:286 | (no comment) |
| `applyFollowerMove` | ui/figures/figureWeldMove.js:155 | Moves one follower disc's layer by the canvas delta, choosing handle-move, arm-translate, or whole-layer-translate as described in the header. |
| `applyTheme` | ui/setUI.js:62 | (no comment) |
| `applyTransform` | draw/drawTransform.js:77 | Object space to canvas space: turn about the object-space origin (0, 0) by t.angle, then shift by (t.tx, t.ty). |
| `applyValue` | ui/controls/widgets/rangeWidget.js:112 | (no comment) |
| `applyValue` | ui/controls/widgets/rangeWidget.js:233 | (no comment) |
| `arcCurvature` | draw/drawEllipse.js:284 | (no comment) |
| `archiveActiveSecondaryObject` | ui/draw/drawMenuCmds.js:444 | (no comment) |
| `archiveFigureTab` | ui/figures/figuresSave.js:342 | Moves the saved file to figures/<category>/archive/ and drops its manifest entry (the same service call the other tabs use). |
| `archiveGalleryItem` | ui/gallery/galleryMenuCmds.js:213 | (no comment) |
| `archiveItem` | node/manifestRequests.mjs:450 | TASK: archiveItem  (GENERIC) Payload: { |
| `archiveItem` | ui/archiveItem.js:28 | Canonical call: await archiveItem({ payload: { manifestPath, filename }, |
| `archivePatternsItem` | ui/patterns/patternsMenuCmds.js:133 | (no comment) |
| `archiveSecondary` | ui/draw/secondaryObjects.js:38 | Moves a secondary object to the archive folder. |
| `archiveSecondaryObject` | node/secondaryRequests.mjs:128 | TASK: archiveSecondaryObject |
| `archiveUtilitiesItem` | ui/utilities/utilitiesMenuCmds.js:130 | (no comment) |
| `arcPoints` | draw/drawEllipse.js:228 | PURPOSE: - Replaces the complex, multi-function legacy arc logic. |
| `arcPoints` | draw/shapers.js:67 | n+1 points along a circular arc about centre c, radius r, from fromDeg to toDeg (degrees, clockwise on the canvas because y points down). |
| `armInteractor` | ui/interactor.js:22 | DRAW SIDE: Coordination Logic |
| `armPoint` | ui/figures/figurePoints.js:134 | The point at fraction t along an arm, in canvas space. |
| `armsOf` | ui/figures/figurePoints.js:117 | Exported for figureWelds.js (Phase 8), which has to look across an object's own other arms -- a Parabola's two corner handles, say -- when a weld is made at ... |
| `assertDirectoryExists` | node/serviceFileHelpers.mjs:71 | Fail-fast directory existence check. |
| `assertFileExists` | node/serviceFileHelpers.mjs:82 | Fail-fast file existence check. |
| `assertFileName` | node/figureFiles.mjs:34 | (no comment) |
| `assertSimpleName` | node/safePaths.mjs:52 | The value must be a non-empty string that is a single path segment: no "/" or "\", no NUL character, and not "." or "..". |
| `attachCanvasToRegion` | ui/scriptRunner.js:190 | (no comment) |
| `autoFitParametricToCanvas` | draw/drawParametrics.js:159 | Measures the raw mathematical bounds of the curve and updates the 'scale' and 'mid' properties of the Parametric object to fit the canvas. |
| `background` | draw/background.js:4 | (no comment) |
| `beginStepPass` | ui/draw/drawStep.js:59 | a redraw is starting; count from zero again. |
| `bothUnits` | ui/figures/figurePrint.js:257 | A length in mm as words in both units, for the cover sheet ("4.8 mm (0.188 in)"). |
| `boxOfFigure` | ui/figures/figureTemplates.js:167 | The smallest rectangle round every visible layer that is not a guide, in canvas pixels, or null when nothing has been drawn yet. |
| `breakApartLayer` | ui/figures/figureBreakApart.js:44 | Replaces the active layer's object with its pieces (Phase 7c). |
| `buildAllToAllPairs` | draw/drawLinkedCircles.js:45 | (no comment) |
| `buildCanvasThumbnailBase64` | ui/thumbnails.js:66 | Crops excess whitespace and scales the result to fit within w x h while MAINTAINING ASPECT RATIO. |
| `buildCategoryDescriptor` | ui/categories.js:224 | Helper function to build a category descriptor array from a grouped data structure. |
| `buildCategoryFrame` | ui/categories.js:394 | Utility: create outer #categories wrapper manually. |
| `buildCategoryFrameElement` | ui/categories.js:282 | <div class="category-frame">   <div class="category-header">title</div>   <div class="category-content"></div> |
| `buildCategoryItemElement` | ui/categories.js:314 | <div class="item">   <span>name</span>   [chevron icon if hasSubitems] |
| `buildCirclePairs` | draw/drawLinkedCircles.js:57 | (no comment) |
| `buildControls` | ui/draw/drawStep.js:103 | the stepping controls, appended to #button. |
| `buildControlsIfPresent` | ui/scriptRunner.js:238 | Builds parameter controls ONLY if scriptInfo exists AND caller requests controls. |
| `buildCurveFromParams` | drawRegistry/parametrics.js:133 | (no comment) |
| `buildDrawMenuItems` | ui/draw/drawMenuCmds.js:201 | Legacy descriptor format used by older callers. |
| `buildDrawParameterData` | ui/controls/builders/dataBuilder.js:8 | (no comment) |
| `buildEditManifestHtml` | ui/editManifestDialog.js:94 | buildEditManifestHtml - TABLE LAYOUT (REFINED) |
| `buildFigureScript` | node/createFigureService.mjs:166 | Generates the ES module source for a figure file. |
| `buildFullHelpHtmlDocument` | ui/helpEditor.js:29 | Builds a complete HTML document for saving. |
| `buildGalleryOffcanvasHtml` | ui/gallery/galleryMenuCmds.js:306 | (no comment) |
| `buildGallerySubtabs` | ui/gallery/galleryNav.js:61 | (no comment) |
| `buildHelpItem` | ui/help.js:170 | PURPOSE Build a Help menu item ("Help" or "Create Help") using a recursive manifest tree. |
| `buildHelpJsTreeData` | ui/helpTree.js:82 | Converts the hierarchical help manifest into jsTree data. |
| `buildHomeAdapter` | ui/home/homeNav.js:58 | (no comment) |
| `buildHomeCategoryDescriptor` | ui/home/homeNav.js:219 | (no comment) |
| `buildHomeListFromReport` | node/maintain_manifests.mjs:302 | Aggregates all entries with a 'status' from local manifests into a single Home list. |
| `buildHomeOffcanvasHtml` | ui/home/homeMenuCmds.js:179 | (no comment) |
| `buildParameterControls` | ui/controls/controlsCore.js:59 | UNIVERSAL ENTRY POINT (ROUTER) This function determines which environment is active (Draw tab, Scripts tab, etc.) and delegates to the |
| `buildPatternsOffcanvasHtml` | ui/patterns/patternsMenuCmds.js:255 | (no comment) |
| `buildScriptParameterData` | ui/controls/builders/dataBuilder.js:92 | SCRIPTS TAB DATA BUILDER ENVIRONMENT: Scripts / Tools tab only. |
| `buildSingleControl` | ui/controls/rendering/renderer.js:159 | - Add a new case: "radio" |
| `buildSubtabBar` | ui/resultsViewController.js:64 | Builds the subtab bar inside #subtabs from the adapter's tab definitions. |
| `buildSubtabButton` | ui/gallery/galleryNav.js:105 | (no comment) |
| `buildSubtabButton` | ui/resultsViewController.js:127 | Creates a single <li><button> subtab element. |
| `buildUtilitiesAdapter` | ui/utilities/utilitiesNav.js:41 | (no comment) |
| `buildUtilitiesOffcanvasHtml` | ui/utilities/utilities.js:254 | (no comment) |
| `buildWrappedArm` | draw/drawRegular.js:197 | (no comment) |
| `button` | ui/scriptHistory.js:216 | (no comment) |
| `calculateTintAndShade` | draw/color.js:1 | (no comment) |
| `canBreakApart` | ui/figures/figureBreakApart.js:23 | True when the active layer is visible and its object can come apart (its registry entry has a decompose()). |
| `centroidHit` | ui/figures/figureCentroid.js:142 | True when canvas point (x, y) is on the diamond, or on the rotation handle while the diamond is selected. |
| `changeLine` | draw/drawRegular.js:127 | (no comment) |
| `checkDrawRegistry` | ui/registryCheck.js:95 | (no comment) |
| `checkDrawsThroughDrawLine` | ui/registryCheck.js:116 | The rule: registry objects reach the canvas only through drawLine (draw/drawUtilities.js). |
| `checkFigureFormat` | ui/figures/figureModel.js:194 | (no comment) |
| `checkManifestEntries` | node/maintain_manifests.mjs:215 | Looks for manifest entries that point at nothing, and categories that are listed but not there. |
| `checkRegistryEntry` | ui/registryCheck.js:38 | (no comment) |
| `chords` | draw/connectors.js:87 | within one array, point i joined to point i+skip. |
| `circlePoints` | draw/drawLinkedCircles.js:35 | The numPoints points evenly spaced around one circle, in the same order and starting angle drawLinkedCircles() stitches from. |
| `clamp01` | draw/background.js:108 | (no comment) |
| `clampValue` | ui/controls/widgets/rangeWidget.js:104 | (no comment) |
| `clampValue` | ui/controls/widgets/rangeWidget.js:225 | (no comment) |
| `clear` | ui/menuManager.js:142 | (no comment) |
| `clearCanvas` | ui/draw/drawRunner.js:131 | (no comment) |
| `clearCanvasBackground` | ui/scriptRunner.js:211 | (no comment) |
| `clearCategoryFrame` | ui/categories.js:379 | Utility: clear a category region entirely. |
| `clearDivs` | ui/uiUtilities.js:21 | Empties the core divs shared by all tabs. |
| `clearDrawCaption` | ui/draw/drawMenuCmds.js:176 | (no comment) |
| `clearGalleryCaption` | ui/gallery/galleryNav.js:185 | (no comment) |
| `clearHomeCaption` | ui/home/homeMenuCmds.js:46 | (no comment) |
| `clearHomeLocalState` | ui/home/home.js:160 | (no comment) |
| `clearLaunch` | ui/draw/draw.js:258 | (no comment) |
| `clearPatternsCaption` | ui/patterns/patternsNav.js:196 | (no comment) |
| `clearTimings` | ui/instrument.js:68 | (no comment) |
| `clonePoints` | classes/linkedCircles.js:147 | Creates a deep-ish clone of an array of Points. |
| `clonePoints` | classes/overlayClass.js:156 | Creates a deep-ish clone of an array of Points. |
| `close` | ui/menuManager.js:70 | (no comment) |
| `closeFormsOverlay` | ui/editManifestDialog.js:369 | (no comment) |
| `closeNotesOverlay` | ui/overlay.js:264 | Tears the notes popup down exactly as its close (x) button does. |
| `closeOverlay` | ui/overlay.js:118 | (no comment) |
| `closeTab` | ui/figures/figuresNav.js:466 | Throws the figure away (after asking, if it has unsaved changes), stops every mouse listener that may belong to it, and shows another subtab. |
| `collectRegistryEntries` | ui/draw/drawCategories.js:46 | (no comment) |
| `colourNameToHex` | draw/color.js:72 | (no comment) |
| `comparePoints` | draw/drawUtilities.js:713 | (no comment) |
| `computeHelpPathFromParts` | ui/helpTree.js:223 | Builds the canonical help file path for a leaf. |
| `consumeLaunchIfForDraw` | ui/draw/draw.js:237 | (no comment) |
| `consumeLaunchIfForFigures` | ui/figures/figures.js:196 | If Home launched this tab for a saved figure, clears the launch request and opens the figure. |
| `convertParabPtsToLines` | draw/drawUtilities.js:88 | (no comment) |
| `copyActiveDrawObject` | ui/draw/drawMenuCmds.js:261 | (no comment) |
| `copyFigureTab` | ui/figures/figuresSave.js:269 | Opens a copy of the figure in a new subtab. |
| `corner` | draw/connectors.js:78 | the curve stitch most used in the ideabook. |
| `cornerPartners` | ui/figures/figureWelds.js:94 | A Parabola's two corner handles (line1_pt2 and line2_pt1, say) are two separate fields, independent by default (Phase 7's "fan/bowtie" finding): they only st... |
| `countStatusItems` | node/maintain_manifests.mjs:419 | Counts entries in an array that have a defined status property. |
| `createArms` | draw/drawRegular.js:64 | (no comment) |
| `createEmptyFigure` | ui/figures/figureModel.js:81 | A new, empty figure. |
| `createFigure` | node/createFigureService.mjs:32 | (no comment) |
| `createGalleryPatternPng` | ui/draw/drawExport.js:52 | UI worker for "Create PNG" (Draw tab). |
| `createLinesFromNodesMiddle` | draw/drawRegular.js:74 | (no comment) |
| `createLinesFromNodesOuter` | draw/drawRegular.js:82 | (no comment) |
| `createMenuItem` | ui/menuManager.js:53 | (no comment) |
| `createNewCategory` | node/createFigureService.mjs:120 | Branch B — executed before Branch A when isNewCategory is true. |
| `createNodes` | draw/createNodes.js:21 | (no comment) |
| `createOrJoinWeld` | ui/figures/figureWeldModel.js:59 | Joins the two points into one weld group, merging their groups if each already had one. |
| `createParab` | draw/drawRegular.js:91 | (no comment) |
| `createParabs` | draw/drawRegular.js:107 | Creates an array of parabolas by stitching together corresponding arms from two arrays. |
| `createPatternFromActiveDrawObject` | ui/draw/drawMenuCmds.js:228 | (no comment) |
| `createPatternScript` | ui/draw/drawExport.js:117 | UI worker for Draw command "Create Pattern". |
| `createPatternScriptTextFromDrawRegistry` | ui/draw/drawExport.js:211 | Produces a Patterns-style script file: export function runPattern() { const s = {...} |
| `createPatternThumbnail` | ui/patterns/patternsMenuCmds.js:100 | (no comment) |
| `createPngFromActiveDrawObject` | ui/draw/drawMenuCmds.js:343 | (no comment) |
| `createPrintNodes` | draw/drawUtilities.js:67 | CREATE PRINT NODES |
| `crossHair` | draw/drawUnicorns.js:8 | (no comment) |
| `crossing` | ui/figures/figureMagic.js:66 | Where segments p1-p2 and p3-p4 cross, as { u, v } (fractions along each), or null. |
| `crossings` | ui/figures/figureMagic.js:113 | Every crossing of one arm of the layer with the arms of every visible layer, named by the other arm and counted along this arm. |
| `curveFeatures` | ui/figures/figureMagic.js:77 | Tips and cusps of one list arm, in order along it. |
| `deactivateCentroid` | ui/figures/figureCentroid.js:365 | Removes all four listeners with one abort. |
| `deactivatePointsInput` | ui/figures/figurePointer.js:340 | Removes every points-mode listener (one abort) and hides the interaction layer. |
| `deflectPoint` | draw/drawUtilities.js:585 | (no comment) |
| `deleteLayer` | ui/figures/figureLayers.js:340 | Deletes the active layer. |
| `deletePoint` | ui/figures/figurePoints.js:345 | Removes the point. |
| `deleteTab` | ui/draw/drawNav.js:173 | (no comment) |
| `deriveHomeOriginFromPath` | ui/home/homeResults.js:182 | (no comment) |
| `destroyHelpJsTree` | ui/helpTree.js:47 | Destroys any existing jsTree instance and unhooks events. |
| `disableAllNextPrevOverlays` | ui/nextPrevOverlay.js:147 | Exists for API symmetry and future expansion. |
| `disableNextPrevOverlay` | ui/nextPrevOverlay.js:130 | (no comment) |
| `disarmInteractor` | ui/interactor.js:96 | (no comment) |
| `discOnHandle` | ui/figures/figureWelds.js:210 | A disc on handle h of the layer, found or made. |
| `dispatchService` | node/sketchpadService.mjs:140 | (no comment) |
| `displayPoint` | draw/drawUtilities.js:124 | (no comment) |
| `displayUtilityResult` | ui/utilities/utilitiesDisplay.js:185 | (no comment) |
| `distanceToLine` | draw/shapers.js:206 | how far p is from the line through a and b (from a itself if a and b are the same point). |
| `drawActiveTab` | ui/draw/drawRunner.js:31 | Core execution logic for the active Draw object. |
| `drawALine` | draw/drawUtilities.js:374 | (no comment) |
| `drawAParab` | draw/drawRegular.js:122 | (no comment) |
| `drawCentroid` | ui/figures/figureCentroid.js:159 | Clears the overlay and draws the diamond (and, when selected, the box, stem and rotation handle) of the active layer. |
| `drawCircle` | draw/drawUtilities.js:140 | (no comment) |
| `drawCircularParabola` | draw/drawRegular.js:175 | (no comment) |
| `drawCycloid` | draw/drawUnicorns.js:23 | (no comment) |
| `drawEnd` | draw/drawEllipse.js:70 | (no comment) |
| `drawEulerSpiral` | draw/drawSpirals.js:25 | Example usage: const myCanvas = document.getElementById("myCanvas"); |
| `drawFermatSpiral` | draw/drawSpirals.js:55 | (no comment) |
| `drawFigurePoints` | ui/figures/figurePoints.js:440 | Draws every disc on the main canvas: a filled circle in the color of its layer with a black rim, no number. |
| `drawInCircle` | draw/drawEllipse.js:176 | (no comment) |
| `drawInEllipse` | draw/drawEllipse.js:184 | (no comment) |
| `drawInnerStar` | draw/drawRegular.js:230 | (no comment) |
| `drawInverseStar` | draw/drawRegular.js:243 | (no comment) |
| `drawLine` | draw/drawUtilities.js:384 | (no comment) |
| `drawLines` | draw/drawUtilities.js:234 | (no comment) |
| `drawLinesAround` | draw/drawUtilities.js:286 | PURPOSE - Draw a sequence of straight-line segments between points in ptArray, where each point i is connected to point (i + skip). |
| `drawLinesWithin` | draw/drawUtilities.js:335 | PURPOSE - Draw many straight line segments between points in an array. |
| `drawLinkedCircles` | draw/drawLinkedCircles.js:77 | (no comment) |
| `drawLogarithmicSpiral` | draw/drawSpirals.js:103 |  drawLogarithmicSpiral    r is the radius from the origin. |
| `drawMagicMarks` | ui/figures/figureMagic.js:196 | In points mode, a small open diamond on every magic point of the active layer, so it is visible where a click will land on one. |
| `drawManyLines` | draw/drawUtilities.js:200 | PURPOSE Draw a set of straight-line connections between points in an array, using a configurable skip pattern. |
| `drawManyParabs` | draw/drawRegular.js:118 | (no comment) |
| `drawManyParabs` | draw/drawUtilities.js:100 | (no comment) |
| `drawMysticRose` | draw/drawUnicorns.js:49 | (no comment) |
| `drawNodes` | draw/drawUtilities.js:151 | (no comment) |
| `drawOneCircle` | draw/drawLinkedCircles.js:20 | Circles use ctx.arc, so they have no endpoints. |
| `drawPairs` | draw/drawUtilities.js:748 | draw the lines a connector returned (draw/connectors.js). |
| `drawParab` | draw/drawRegular.js:158 | PURPOSE - Build two arms from two lines and stitch them into a parabola. |
| `drawParabs` | draw/drawUtilities.js:109 | (no comment) |
| `drawParametric` | draw/drawParametrics.js:52 | The primary loop for evaluating, auto-fitting, and drawing the curve segments. |
| `drawPlusMark` | ui/figures/figureWeldMarks.js:60 | (no comment) |
| `drawPolar` | draw/drawParametrics.js:31 | Converts polar function definitions into Cartesian parametric functions and then hands them off to the main drawing engine. |
| `drawPureSpiral` | draw/drawSpirals.js:133 | (no comment) |
| `drawPureSpiralA` | draw/drawSpirals.js:161 | (no comment) |
| `drawPureSpiralB` | draw/drawSpirals.js:187 | (no comment) |
| `drawRabbitPursuitCurve` | draw/drawPursuit.js:7 | (no comment) |
| `drawRadiate` | draw/drawUnicorns.js:61 | (no comment) |
| `drawRegularPolygon` | draw/drawRegular.js:326 | (no comment) |
| `drawRegularPolygonCorner` | draw/drawRegular.js:344 | From each node, draw a curve-stitch parabola. |
| `drawRegularPolygonTouch` | draw/drawRegular.js:366 | (no comment) |
| `drawSpacingMarks` | ui/figures/figurePrint.js:179 | With tabState.showSpacing on: a red ring round both nails of each pair that is too close, joined by a red line. |
| `drawSpeckledRadialGradient` | draw/background.js:69 | PURPOSE Draw a “speckle field” whose density is LOW near the center and HIGH near the edges. |
| `drawSpiral` | draw/drawSpirals.js:209 | (no comment) |
| `drawStart` | draw/drawEllipse.js:32 | Internal Pattern Helpers (Original Logic & Comments) |
| `drawTheodorusSpiral` | draw/drawSpirals.js:262 | (no comment) |
| `drawThumb` | ui/thumbnailSettings.js:116 | (no comment) |
| `drawTriangle` | draw/drawSpirals.js:266 | FUNCTION TO DRAW A SINGLE TRIANGLE SEGMENT |
| `drawWeldMarks` | ui/figures/figureWeldMarks.js:36 | One mark per weld group, at any one member's position (all of a satisfied group's members coincide): a black plus on a white halo, or red while the group's m... |
| `drawWithin` | draw/drawEllipse.js:52 | (no comment) |
| `edgeWeight` | draw/background.js:116 | Probability and alpha both ramp UP toward edges. |
| `editGalleryManifestItem` | ui/gallery/galleryMenuCmds.js:183 | (no comment) |
| `editHomeManifestItem` | ui/home/homeMenuCmds.js:150 | (no comment) |
| `editManifestEntry` | node/manifestRequests.mjs:40 | Payload: { manifestPath : "/home/manifest.json" \| "/patterns/.../manifest.json" \| "/gallery/.../manifest.json" \| "/utilities/.../manifest.json", |
| `editManifestEntryInSingleFile` | node/manifestRequests.mjs:192 | Updates exactly one manifest file in place (array of entries). |
| `editPatternsManifestItem` | ui/patterns/patternsMenuCmds.js:203 | (no comment) |
| `editUtilitiesManifestItem` | ui/utilities/utilitiesMenuCmds.js:99 | (no comment) |
| `enableNextPrevOverlay` | ui/nextPrevOverlay.js:100 | Args: spec = { targetEl: <HTMLElement>, |
| `endStepPass` | ui/draw/drawStep.js:68 | a redraw has finished; bring the slider and the readout up to date (the number of lines can change when a setting changes). |
| `ensureArray` | ui/menuManager.js:28 | (no comment) |
| `ensureGalleryCacheLoaded` | ui/gallery/gallery.js:96 | (no comment) |
| `ensureHomeSavedState` | ui/home/home.js:78 | (no comment) |
| `ensureOverlayElement` | ui/nextPrevOverlay.js:35 | (no comment) |
| `ensurePatternDummyThumb` | node/maintain_manifests.mjs:384 | Ensures a thumbnail image exists for a pattern by copying a dummy file. |
| `ensurePatternsManifestLoaded` | ui/patterns/patterns.js:82 | (no comment) |
| `ensureReady` | ui/menuManager.js:22 | (no comment) |
| `ensureResultsSubtab` | ui/gallery/galleryNav.js:126 | (no comment) |
| `ensureUtilitiesCacheLoaded` | ui/utilities/utilities.js:66 | (no comment) |
| `errorStates` | ui/errorChecklist.js:48 | go through every log line in order and work out, for each different error, whether it is open or ticked. |
| `escapeAttr` | ui/editManifestDialog.js:382 | (no comment) |
| `escapeHtml` | ui/htmlText.js:7 | htmlText.js Text helpers for building HTML strings. |
| `everyNth` | draw/shapers.js:93 | every nth point, beginning at index `start`. |
| `executeScriptToCanvas` | ui/scriptRunner.js:283 | Execute a module into the shared canvas. |
| `executeScriptToText` | ui/scriptRunner.js:354 | Executes a script module and displays its output as text in the DOM. |
| `extendWithArms` | draw/drawEllipse.js:90 | (no comment) |
| `extractBodyInnerHtml` | ui/helpTree.js:25 | Returns the HTML found BETWEEN <body> ... |
| `extractHeaderNotes` | ui/notes.js:19 | (no comment) |
| `fetchJson` | ui/thumbnailMaker.js:120 | (no comment) |
| `figureThumb` | ui/thumbnailSettings.js:112 | (no comment) |
| `fillPanel` | ui/scriptHistory.js:79 | (no comment) |
| `filterControlsByActiveGroups` | ui/controls/builders/groupFilter.js:36 | GROUP VISIBILITY FILTER ENVIRONMENT: Used by both buildDrawParameterData and buildScriptParameterData |
| `findCandidate` | ui/figures/figurePoints.js:170 | The infrastructure point nearest to (x, y) within radius, or null. |
| `findFeature` | ui/figures/figureMagic.js:184 | Where the named feature is now on that arm, as t, or null if the object no longer has it (the other layer moved away, say). |
| `findHandleIndex` | ui/figures/figureWeldMove.js:100 | Matching by position (to a millionth of a pixel) rather than by name works for every object without a table of field names: an arm's a and b are the object's... |
| `findHistory` | node/scriptHistoryRequests.mjs:71 | The history folder and entries for one file, or null when VS Code has none. |
| `findMissingThumbnails` | ui/thumbnailMaker.js:171 | Asks for each picture file. |
| `findOriginalManifestEntryByRootedPath` | node/manifestRequests.mjs:274 | Searches ALL real manifests under: ./patterns, ./gallery, ./utilities For each entry, computes its rooted path using the same |
| `findPoint` | ui/figures/figurePoints.js:220 | The numbered point of the active layer nearest to (x, y) within radius, or null. |
| `formatRebuildReportShared` | ui/rebuildSync.js:58 | (no comment) |
| `formatTimings` | ui/instrument.js:80 | The slowest entries first, then every entry in the order it started. |
| `fromUnits` | ui/figures/figurePrint.js:252 | A length typed in the print units, as mm. |
| `galleryThumb` | ui/thumbnailSettings.js:108 | (no comment) |
| `geometry` | ui/figures/figureCentroid.js:100 | Where everything is, in canvas pixels, or null when the active layer has no centroid right now (none, hidden, nothing drawn, Show All). |
| `getCanvasCoords` | ui/interactor.js:142 | (no comment) |
| `getCurrentCategory` | ui/gallery/galleryState.js:46 | (no comment) |
| `getCurrentCategory` | ui/patterns/patternsState.js:33 | Getters |
| `getCurrentCategory` | ui/utilities/utilitiesState.js:39 | (no comment) |
| `getCurrentDomain` | ui/gallery/galleryState.js:45 | (no comment) |
| `getCurrentDomain` | ui/utilities/utilitiesState.js:38 | Getters |
| `getCurrentIndex` | ui/gallery/galleryState.js:48 | (no comment) |
| `getCurrentIndex` | ui/patterns/patternsState.js:37 | (no comment) |
| `getCurrentIndex` | ui/utilities/utilitiesState.js:41 | (no comment) |
| `getCurrentList` | ui/gallery/galleryState.js:47 | (no comment) |
| `getCurrentList` | ui/utilities/utilitiesState.js:40 | (no comment) |
| `getCurrentTabId` | ui/figures/figuresState.js:57 | (no comment) |
| `getDrawCaptionMenuItems` | ui/draw/drawMenuCmds.js:98 | Always present: Help, Save as PNG, Save as Pattern, Copy Object, Reset Parameters |
| `getFiguresCaptionMenuItems` | ui/figures/figuresCommands.js:157 | Returns the menu as an array of items. |
| `getFiguresRegistry` | ui/figures/figuresState.js:53 | Getters |
| `getGalleryCache` | ui/gallery/gallery.js:109 | (no comment) |
| `getGalleryCache` | ui/gallery/galleryState.js:44 | Getters |
| `getGalleryCaptionMenuItems` | ui/gallery/galleryMenuCmds.js:146 | (no comment) |
| `getHasRunUtility` | ui/utilities/utilitiesState.js:42 | (no comment) |
| `getHomeCaptionMenuItems` | ui/home/homeMenuCmds.js:133 | (no comment) |
| `getHomeManifestGrouped` | ui/home/homeState.js:30 | Getters |
| `getHomeResultsRenderToken` | ui/home/homeState.js:31 | (no comment) |
| `getIdsWithSecondaries` | ui/draw/drawTabState.js:35 | Getter |
| `getIDsWithSecondaries` | ui/draw/secondaryObjects.js:69 | Returns an array of primary IDs that possess at least one secondary object. |
| `getLineEquation` | draw/drawUtilities.js:722 | (no comment) |
| `getLineIntersection` | draw/drawParametrics.js:133 | Traditional line segment intersection using the Determinant/Cramer's Rule approach. |
| `getMidpointSet` | classes/linkedCircles.js:118 | Returns the predefined midpoint array for a given circle count. |
| `getMidpointSet` | classes/overlayClass.js:127 | Returns the predefined midpoint array for a given circle count. |
| `getPatternsCaptionMenuItems` | ui/patterns/patternsMenuCmds.js:237 | (no comment) |
| `getPreviousIndex` | draw/drawUtilities.js:630 | (no comment) |
| `getPrimaryObjectsWithSecondaries` | node/secondaryRequests.mjs:190 | TASK: getPrimaryObjectsWithSecondaries |
| `getSecondaryManifest` | node/secondaryRequests.mjs:163 | TASK: getSecondaryManifest |
| `getTinyMceConfig` | ui/helpEditor.js:62 | Returns a TinyMCE init config object. |
| `getUtilitiesCache` | ui/utilities/utilities.js:75 | (no comment) |
| `getUtilitiesCaptionMenuItems` | ui/utilities/utilitiesMenuCmds.js:81 | (no comment) |
| `groupBySpot` | ui/figures/figurePrint.js:72 | Puts each point into the first group whose first point is within SAME_SPOT_PX of it, or starts a new group. |
| `groupEntriesByCategory` | ui/draw/drawCategories.js:61 | (no comment) |
| `groupHomeEntriesByStatus` | ui/home/homeManifest.js:86 | (no comment) |
| `growingChords` | draw/connectors.js:103 | round a loop, point i joined to point i + skip0 + i*grow. |
| `handleDispatch` | node/sketchpadServer.mjs:184 | DESCRIPTION Reads JSON request body, calls dispatchService(), and returns the result as JSON. |
| `handleNameOf` | ui/figures/figurePoints.js:304 | The name of handle number h, from the object's handleNames (a list, or a prefix such as "circle" for circle1, circle2 ...). |
| `handleRequest` | node/sketchpadServer.mjs:146 | DESCRIPTION Main HTTP router. |
| `handleTabChange` | ui/setUI.js:214 | --- Tab Handling Logic --- |
| `hasUnsavedChanges` | ui/figures/figureModel.js:110 | True when closing this figure subtab would lose work. |
| `hideHelp` | ui/overlay.js:107 | (no comment) |
| `hideOffcanvas` | ui/offcanvas.js:91 | (no comment) |
| `historyRoot` | node/scriptHistoryRequests.mjs:41 | The folder VS Code keeps its local history in, on this computer. |
| `ideabookHasScript` | ui/gallery/galleryResults.js:310 | True if the image has a hint script. |
| `ideabookScriptName` | ui/gallery/galleryResults.js:297 | The script's file name for an image: the image's name, with the few characters the dev server will not serve in a file name (& , # ? % + ;) replaced by "_". |
| `ideabookScriptPath` | ui/gallery/galleryResults.js:302 | The app path of an image's hint script (it may not exist). |
| `includedLayers` | ui/figures/figurePrint.js:61 | The layers that print, by index. |
| `incrementHomeResultsRenderToken` | ui/home/homeState.js:39 | (no comment) |
| `initCanvasLayers` | ui/canvasLayerManager.js:117 | Registers the four canvas overlay layers from the DOM. |
| `initDrawTab` | ui/draw/draw.js:117 | (no comment) |
| `initFiguresTab` | ui/figures/figures.js:131 | Called every time the Figures tab is shown. |
| `initGalleryTab` | ui/gallery/gallery.js:121 | (no comment) |
| `initHelpJsTree` | ui/helpTree.js:262 | Initializes (or re-initializes) jsTree in the left pane. |
| `initHomeTab` | ui/home/home.js:98 | (no comment) |
| `initMenuManager` | ui/menuManager.js:18 | (no comment) |
| `initOverlay` | ui/overlay.js:60 | (no comment) |
| `initPatternsTab` | ui/patterns/patterns.js:90 | (no comment) |
| `initTab` | ui/setUI.js:97 | (no comment) |
| `initUtilityTab` | ui/utilities/utilities.js:86 | (no comment) |
| `insertLayer` | ui/figures/figureLayers.js:136 | Appends a new layer at the top of the stack with the object's default parameters, makes it active, and redraws. |
| `insertTemplate` | ui/figures/figureTemplates.js:190 | choice is a value from TEMPLATE_CHOICES. |
| `inside` | draw/shapers.js:230 | only the points inside the shape (nails within a boundary, or a pattern trimmed to a frame). |
| `inverseStarParabolas` | draw/drawRegular.js:304 | The parabolas drawInverseStar draws, as data instead of pixels (Break apart, v1-finish item 7), in the same shape as regularPolygonParabolas(). |
| `inverseTransform` | draw/drawTransform.js:100 | The object point that the transform sends to canvas point (x, y). |
| `isHtmlFile` | node/generateHelpManifest.mjs:51 | (no comment) |
| `isImagePath` | ui/home/homeResults.js:175 | (no comment) |
| `isInside` | draw/shapers.js:216 | is point p inside the closed shape whose corners are given in order? (The even-odd rule: count how many edges a line from p to the right crosses; odd means i... |
| `isInside` | node/safePaths.mjs:72 | True when targetAbs is rootAbs itself or somewhere below it. |
| `isJsPath` | ui/home/homeResults.js:170 | Path type utilities |
| `isRegistryEntry` | ui/draw/drawInstance.js:25 | drawInstance.js Private copies of Draw registry objects Each object in window.drawRegistry is one shared copy. |
| `isRequestAllowed` | node/sketchpadServer.mjs:80 | (no comment) |
| `isSavedFigure` | ui/figures/figuresSave.js:258 | True when this figure has been saved or opened from a file, so a file for it exists (until Archive moves it away). |
| `isSkippableDir` | node/generateHelpManifest.mjs:55 | (no comment) |
| `isTemplate` | ui/figures/figureTemplates.js:160 | (no comment) |
| `launchDetached` | node/logAndEditorRequests.mjs:207 | Starts a command detached from this service. |
| `launchTabViaSetUI` | ui/home/homeNav.js:301 | (no comment) |
| `layerTransform` | ui/figures/figurePoints.js:153 | The transform of layer number i of the figure, or null. |
| `lineDiff` | ui/scriptHistory.js:45 | The lines of both texts in order, each marked as kept (" "), removed ("-") or added ("+"). |
| `linePoints` | draw/shapers.js:54 | steps+1 points evenly spaced from a to b, both ends included. |
| `lineSpan` | ui/scriptHistory.js:202 | (no comment) |
| `listFilesByExt` | node/maintain_manifests.mjs:399 | Lists files in a directory that match a specific extension, with exclusion support. |
| `listIdeabookScripts` | node/scriptHistoryRequests.mjs:141 | TASK: listIdeabookScripts The hint scripts of one Ideabook category: the .js files in gallery/Ideabook/<category>/scripts/. |
| `listImageFiles` | node/maintain_manifests.mjs:407 | Lists image files in a directory based on standard web extensions. |
| `listInsertableObjects` | ui/figures/figureLayers.js:105 | Registry objects for the Insert pulldown: [{ key, name }], sorted by name. |
| `listLogFiles` | node/logAndEditorRequests.mjs:36 | TASK: listLogFiles DESCRIPTION Returns newest N log files from ./utilities/logfiles. |
| `listScriptHistory` | node/scriptHistoryRequests.mjs:100 | TASK: listScriptHistory Payload:  { path: "/patterns/circles/circle.js" } Returns:  { request, status: "ok", root, found, versions: [ { id, timestamp, iso, s... |
| `listSecondaries` | ui/draw/secondaryObjects.js:54 | Returns the manifest array for a given primary ID. |
| `listThumbnailTargets` | ui/thumbnailMaker.js:50 | (no comment) |
| `loadCategory` | ui/utilities/utilities.js:343 | Legacy Exports (Compatibility) |
| `loadFiguresCategories` | ui/figures/figuresDisplay.js:51 | Reads the category list, then each category's manifest, and hands the result to the shared renderCategories() (ui/categories.js), which draws the same accord... |
| `loadHelpHtmlIntoPane` | ui/helpTree.js:349 | Loads an HTML file and injects the <body> inner HTML into the viewer pane. |
| `loadHelpManifest` | ui/help.js:18 | (no comment) |
| `loadHomeManifest` | ui/home/homeManifest.js:42 | (no comment) |
| `loadHomeManifest_async` | ui/home/homeManifest.js:58 | Home's manifest is a flat array at /home/manifest.json with no directoryRegistry.json. |
| `loadImage` | ui/thumbnailMaker.js:269 | (no comment) |
| `loadScriptModule` | ui/scriptRunner.js:76 | (no comment) |
| `loadScriptModuleFromText` | ui/scriptRunner.js:142 | Loads script text as a module, as if it were the file at path. |
| `loadSecondary` | ui/draw/secondaryObjects.js:79 | Fetches the JSON content of a secondary object. |
| `loadSecondaryObjectInTab` | ui/draw/drawNav.js:365 | (no comment) |
| `loadThumbnailSettings` | ui/thumbnailSettings.js:45 | Called once when this file loads (below). |
| `magicCandidates` | ui/figures/figureMagic.js:153 | Every magic point on the layer's infrastructure, as candidates { layer, arm, t, x, y, feature }. |
| `main` | node/check_ports.mjs:20 | (no comment) |
| `makeArchiveItem` | ui/menuCmds.js:154 | Returns an Archive menu item. |
| `makeDrawInstance` | ui/draw/drawInstance.js:31 | (no comment) |
| `makeEditManifestItem` | ui/menuCmds.js:135 | Returns an Edit Manifest menu item. |
| `makeHelpItem` | ui/menuCmds.js:53 | Returns a Help menu item. |
| `makeNotesItem` | ui/menuCmds.js:178 | Returns a Notes menu item for a source file. |
| `makeRootedPath` | node/manifestRequests.mjs:411 | (no comment) |
| `makeRootedPathFromManifest` | node/maintain_manifests.mjs:341 | Converts a filesystem path from a manifest entry into a browser-rooted web path. |
| `makeScriptHistoryItem` | ui/menuCmds.js:94 | Returns a "Script history..." menu item: the versions VS Code saved of the open script, to run or compare (ui/scriptHistory.js). |
| `makeShowScriptItem` | ui/menuCmds.js:73 | Returns a Show Script menu item. |
| `makeThumbnailItem` | ui/menuCmds.js:116 | Returns a Create Thumbnail menu item. |
| `makeTimestampForFilename` | node/serviceFileHelpers.mjs:93 | Returns: YYYYMMDD_HHMMSS |
| `manifestNodeToJsTreeNode` | ui/helpTree.js:121 | Recursive converter from manifest subtree to a jsTree node. |
| `manifestRoots` | node/safePaths.mjs:32 | (no comment) |
| `mapPoint` | draw/drawTransform.js:162 | being drawn (drawState.transform). |
| `mapTabIdToKey` | ui/setUI.js:50 | (no comment) |
| `markFarthest` | draw/shapers.js:190 | the working part of simplified. |
| `markListsForRedraw` | ui/thumbnailSettings.js:92 | Each tab that lists its items with pictures builds its list again the next time it is opened (the same needsUpdate flag a manifest rebuild uses). |
| `markSelectedThumbnail` | ui/thumbnails.js:7 | thumbnails.js Thumbnail grids (draw, mark the selected one) and making a cropped canvas thumbnail. |
| `markTabClean` | ui/draw/drawNav.js:253 | (no comment) |
| `markTabDirty` | ui/draw/drawNav.js:234 | (no comment) |
| `measureParametricBounds` | draw/drawParametrics.js:200 | Evaluates the curve functions across all sample points to find the mathematical min/max bounding box. |
| `mesh` | draw/connectors.js:151 | a grid given as rows (an array of arrays of points). |
| `midpoint` | draw/drawUtilities.js:483 | (no comment) |
| `mirrored` | draw/shapers.js:134 | every point reflected across the line through a and b. |
| `moved` | draw/shapers.js:47 | a copy of point p at (x, y). |
| `moveFollowerHandle` | ui/figures/figureWeldMove.js:117 | The delta is in canvas pixels but handles are stored in object space, so: handle to canvas, add the delta, back to object space. |
| `moveFreePoint` | ui/figures/figurePoints.js:321 | Drags a free point to (x, y). |
| `moveHandle` | ui/interactor.js:168 | The one place a handle is moved, by drag or by arrow key. |
| `nailBox` | ui/figures/figurePrint.js:138 | Smallest box round the nails, in canvas pixels. |
| `nailsOf` | ui/figures/figurePrint.js:91 | { source: "discs" \| "stitch ends", nails: [{ x, y, label }], coincident: <how many unwelded discs shared a spot> }. |
| `newBounds` | draw/drawTransform.js:170 | An empty extent: every real point will be smaller than Infinity and larger than -Infinity, so the first noteBounds() call sets all four. |
| `newLayerFields` | ui/figures/figureModel.js:149 | The format fields every new layer gets, beside kind, id, visible, color, params and transform (figureLayers.js insertLayer). |
| `newTransform` | draw/drawTransform.js:63 | A fresh identity transform: no turn, no shift. |
| `nextFigureTabId` | ui/figures/figureModel.js:136 | Smallest "tab-figure-N" id not used in the tabs object. |
| `nextUntitledName` | ui/figures/figureModel.js:121 | Smallest "Untitled N" not used by an open figure tab. |
| `nodeDispatch` | ui/nodeLayer.js:44 | DESCRIPTION Sends a dispatch request to the Node service and returns the JSON response. |
| `nodeListIdeabookScripts` | ui/nodeLayer.js:105 | The Ideabook hint scripts of one category (names without .js). |
| `nodeListLogFiles` | ui/nodeLayer.js:88 | (no comment) |
| `nodeListScriptHistory` | ui/nodeLayer.js:99 | VS Code's saved versions of a script (node/scriptHistoryRequests.mjs). |
| `nodeReadLogFile` | ui/nodeLayer.js:93 | (no comment) |
| `nodeReadScriptHistoryVersion` | ui/nodeLayer.js:110 | (no comment) |
| `nodeRebuildAndValidateManifests` | ui/nodeLayer.js:115 | (no comment) |
| `normalizeGalleryEntryPath` | ui/gallery/galleryResults.js:346 | (no comment) |
| `normalizeScriptInfo` | ui/scriptRunner.js:169 | Ensure scriptInfo vocabulary consistency: - scriptInfo.parameters <-> scriptInfo.params |
| `noteBounds` | draw/drawTransform.js:182 | caller has asked for bounds by setting drawState.bounds. |
| `numbersToPoints` | draw/drawUtilities.js:677 | PURPOSE - Normalize mixed “index-or-point” inputs into actual Point objects. |
| `offsetParams` | ui/figures/figureLayers.js:279 | Shifts whatever positions a registry object keeps: its points, midpoint, center or start. |
| `onDomContentLoaded` | ui/setUI.js:228 | (no comment) |
| `onEscape` | ui/offcanvas.js:87 | (no comment) |
| `oneSheetSVG` | ui/figures/figurePrint.js:274 | (no comment) |
| `onHelpTreeNodeSelected` | ui/helpTree.js:302 | jsTree selection handler. |
| `onNext` | ui/patterns/patternsDisplay.js:161 | (no comment) |
| `onPrev` | ui/patterns/patternsDisplay.js:134 | (no comment) |
| `onUtilityItemClick` | ui/utilities/utilitiesDisplay.js:81 | (no comment) |
| `open` | ui/menuManager.js:86 | (no comment) |
| `openEditManifestDialog` | ui/editManifestDialog.js:43 | Opens the shared "Edit Manifest" dialog. |
| `openErrors` | ui/errorChecklist.js:78 | the errors not yet ticked, as { key, line, count }. |
| `openHelpEditor` | ui/overlay.js:126 | Open the help editor. |
| `openHelpEditorTinyMCE` | ui/helpEditor.js:179 | Reuses the SAME help overlay layer. |
| `openHelpHomeOverlay` | ui/help.js:62 | UPDATED: - This becomes the ONE entry point for opening Help. |
| `openInEditor` | node/logAndEditorRequests.mjs:157 | (no comment) |
| `openInsertPanel` | ui/figures/figureInsertPanel.js:28 | (no comment) |
| `openNewFigureTab` | ui/figures/figuresNav.js:439 | Creates an empty, unnamed figure in a new subtab and shows it. |
| `openOverlay` | ui/overlay.js:114 | Panel-style overlay open/close (rarely used) |
| `openSavedFigure` | ui/figures/figuresSave.js:190 | Reads the file, makes a new figure subtab for it and rebuilds the live objects. |
| `openScriptHistory` | ui/scriptHistory.js:71 | (no comment) |
| `openSweepPanel` | ui/draw/drawSweep.js:116 | The side panel: setting, from, to, how many, Sweep. |
| `outside` | draw/shapers.js:236 | only the points outside the shape (a hole left in a pattern). |
| `pairwise` | draw/connectors.js:49 | point i of A joined to point i+offset of B. |
| `para` | ui/scriptHistory.js:210 | (no comment) |
| `parseChecklist` | ui/home/homeChecklist.js:36 | the file split into lines, and the items found among them, each { text, done, at } where at is its line number. |
| `parseErrorLog` | ui/homeAlert.js:58 | The error log (errors_<date>.txt, written by appendErrorLog in node/logAndEditorRequests.mjs): every line that starts with a date is one error. |
| `parseMaintenanceSummary` | ui/homeAlert.js:38 | (no comment) |
| `parseValueList` | ui/draw/drawSweep.js:83 | A list typed by Barry ("3, 5, 8, 13") as numbers; anything that is not a number is left out. |
| `part` | draw/shapers.js:87 | the points from index `from` up to, but not including, index `to`. |
| `patternsThumb` | ui/thumbnailSettings.js:104 | (no comment) |
| `pictureOf` | ui/draw/drawSweep.js:90 | One picture of the open object with some settings changed (overrides is { key: value, ... |
| `placeOf` | ui/errorReport.js:97 | The file and line an error was raised at, from the first line of its stack that names a file of ours ("ui/figures/figureDraw.js:104"). |
| `pointAtArcLength` | draw/drawEllipse.js:194 | Given cumulative arc-lengths (S) and corresponding points (X), returns the interpolated point at the specified arc length. |
| `pointByN` | ui/figures/figureWeldModel.js:36 | (no comment) |
| `pointPickerDotId` | ui/controls/shared/helpers.js:9 | Generate a unique dot ID for point picker overlays |
| `polyline` | draw/connectors.js:140 | each point joined to the next. |
| `polyline` | ui/figures/figureMagic.js:54 | The arm as a list of canvas points, each with its t along the arm. |
| `positionMenu` | ui/menuManager.js:60 | (no comment) |
| `prepareCategoryFolder` | node/writerRequests.mjs:22 | Finds <rootDir>/<category>, makes its images/ folder if it is missing, and checks its manifest.json exists. |
| `prepareSharedCanvas` | ui/thumbnailMaker.js:255 | Puts the shared canvas in #sketchpad on a white page, as running a script does. |
| `printCircNum` | draw/drawUtilities.js:491 | (no comment) |
| `printTemplate` | ui/figures/figurePrint.js:394 | Opens the template in its own window, one sheet per page, ready to print. |
| `printText` | draw/drawUtilities.js:509 | (no comment) |
| `printTitle` | draw/drawUtilities.js:530 | (no comment) |
| `probe` | node/check_ports.mjs:3 | (no comment) |
| `processDrawRegistry` | node/maintain_manifests.mjs:277 | Performs text analysis on DrawRegistry files to extract metadata (id, status, name). |
| `processGalleryImages` | node/maintain_manifests.mjs:147 | Scans Ideabook and Patterns domains in the gallery for image files. |
| `processGalleryScripts` | node/maintain_manifests.mjs:117 | Scans the gallery/Scripts directory and updates local manifests. |
| `processPatterns` | node/maintain_manifests.mjs:84 | Scans the patterns directory and updates local manifest.json files. |
| `processUtilities` | node/maintain_manifests.mjs:180 | Scans Utilities/Tools and Utilities/Lab directories for script files. |
| `propagateAfterChange` | ui/figures/figureWeldMove.js:235 | Compares the welded discs of layerIndex against snapshot (from snapshotWeldMembers, taken before the change) and walks the weld graph outward for every one t... |
| `ptsOnLine` | draw/drawUtilities.js:565 | PTSONLINE Generate equally spaced points along a line segment, using transforms stored in thing.lineTransform. |
| `ptsOnStraightLine` | draw/drawUtilities.js:574 | --- base helper: straight interpolation --- |
| `purge` | ui/errorChecklist.js:86 | write "Purged: <key>" for each key, so those errors no longer appear, even with Show all. |
| `readErrorStates` | ui/errorChecklist.js:102 | every error from every error log the service lists, read oldest first, with its state (errorStates). |
| `readJson` | node/maintain_manifests.mjs:394 | Synchronously reads and parses a JSON file. |
| `readJsonBody` | node/sketchpadServer.mjs:239 | DESCRIPTION Reads the entire request body and parses it as JSON. |
| `readJsonFileSync` | node/serviceFileHelpers.mjs:23 | Reads and parses a JSON file. |
| `readLogFile` | node/logAndEditorRequests.mjs:101 | TASK: readLogFile DESCRIPTION Reads one logfile from ./utilities/logfiles and returns text. |
| `readOpenErrors` | ui/errorChecklist.js:120 | the errors not yet ticked (for Home's alert). |
| `readQuietly` | ui/homeAlert.js:161 | A log's text, or "" if it cannot be read. |
| `readScriptHistoryVersion` | node/scriptHistoryRequests.mjs:119 | TASK: readScriptHistoryVersion Payload:  { path, id }   id as listScriptHistory gave it Returns:  { request, status: "ok", id, timestamp, text } |
| `readSecondaryObject` | node/secondaryRequests.mjs:225 | TASK: readSecondaryObject |
| `rebuildAllManifests` | ui/rebuildSync.js:44 | The complete rebuild (Barry's rule): after anything changes a manifest -- Edit Manifest, Archive, saving a figure, Create Pattern, Create Gallery PNG -- the ... |
| `rebuildControls` | ui/controls/rendering/rebuild.js:33 | CONTROL PANEL REBUILD TRIGGER PURPOSE: Provides a self-contained rebuild mechanism for dynamic |
| `rebuildInstances` | ui/figures/figureLayers.js:244 | For a figure that was read from a file (Phase 10): makes one live object per saved layer, in the same order, the way insertLayer() makes one. |
| `redrawFigure` | ui/figures/figureDraw.js:64 | Clears the canvas and draws every visible layer, bottom to top. |
| `reflowNotes` | ui/notes.js:72 | Header notes are hard-wrapped for the editor. |
| `refreshGalleryFromManifestEdit` | ui/gallery/galleryMenuCmds.js:254 | (no comment) |
| `refreshHomeCategoriesFromManifestEdit` | ui/home/homeManifest.js:111 | (no comment) |
| `refreshInteractor` | ui/interactor.js:92 | Redraws the handles of the armed object. |
| `refreshPoints` | ui/figures/figurePoints.js:370 | Recomputes where each anchored point is from its layer's current geometry, keeping its fraction t. |
| `refreshUtilitiesFromManifestEdit` | ui/utilities/utilities.js:211 | (no comment) |
| `regenerateThumbnails` | ui/thumbnailMaker.js:136 | Makes every picture again, replacing the old ones. |
| `registerTemplates` | ui/figures/figureTemplates.js:152 | (no comment) |
| `registryKeyOf` | ui/draw/drawInstance.js:42 | Walks from the object to the shared copy it was made from (a copy's prototype is the shared copy), and returns that copy's registry key. |
| `regularPolygonParabolas` | draw/drawRegular.js:275 | The parts drawRegularPolygon draws, as data instead of pixels (Phase 7c, Break apart). |
| `rehydratePatternsState` | ui/patterns/patterns.js:197 | (no comment) |
| `removeFromWeld` | ui/figures/figureWeldModel.js:95 | Drops point n out of its weld group, dissolving the group if that leaves fewer than two members. |
| `removePointPickerDots` | ui/controls/shared/helpers.js:16 | Remove all point picker dots from a container |
| `render` | ui/interactor.js:177 | (no comment) |
| `renderCategories` | ui/categories.js:55 | Render an array of category frames into the specified target container. |
| `renderDrawCategories` | ui/draw/drawCategories.js:82 | (no comment) |
| `renderHomeCategories` | ui/home/homeNav.js:210 | (no comment) |
| `renderHomeCategoriesIfReady` | ui/home/homeNav.js:191 | (no comment) |
| `renderHomeChecklist` | ui/home/homeChecklist.js:48 | read the file, show the list, and wire the changes. |
| `renderHomeErrors` | ui/home/homeErrors.js:24 | read the logs, then show the list. |
| `renderHomeImageEntryToText` | ui/home/homeResults.js:115 | (no comment) |
| `renderHomeJsEntryToCanvas` | ui/home/homeResults.js:89 | (no comment) |
| `renderHomeNotes` | ui/home/homeNotes.js:21 | the two buttons and the file's text as it stands. |
| `renderHomeResults` | ui/home/homeResults.js:38 | (no comment) |
| `renderLayerPanel` | ui/figures/figureLayerPanel.js:44 | Layer numbers go in the gray strip left of the canvas (#figure-sidebar); a hidden layer's number is grayed and struck through. |
| `renderParameterControls` | ui/controls/rendering/renderer.js:20 | (no comment) |
| `renderPattern` | draw/drawEllipse.js:19 | INTERNAL EXECUTION ENGINE Consolidated logic for drawing patterns within a set of nodes. |
| `renderPatternThumbGrid` | ui/patterns/patternsDisplay.js:35 | (no comment) |
| `renderScaffoldGuides` | ui/draw/drawRunner.js:87 | Renders the dashed scaffolding for the active drawing's primary arm. |
| `renderSubtabs` | ui/figures/figuresNav.js:105 | Rebuilds the whole bar from uiState.figures.tabs. |
| `renderTarget` | ui/thumbnailMaker.js:198 | Draws the target on the shared canvas and returns the canvas, or null when the target is skipped. |
| `renderThumbnailGrid` | ui/thumbnails.js:21 | (no comment) |
| `renderTickList` | ui/home/homeTickList.js:32 | fill container with the controls and the list. |
| `reportError` | ui/errorReport.js:56 | where: a few words naming what was running ("Figure layer 3 (parabola)"). |
| `reportProblems` | ui/errorReport.js:90 | For a check that finds several problems (the registry check, a figure file check): each problem text is reported as its own error. |
| `resampled` | draw/shapers.js:148 | n points spaced evenly by distance along the path the points make (corner to corner, not closed). |
| `resetActiveDrawObject` | ui/draw/drawMenuCmds.js:301 | (no comment) |
| `resetCanvas` | draw/drawState.js:70 | Clears the bitmap and resets the context state. |
| `resetDrawStateForScript` | draw/drawState.js:54 | Puts drawState back to its starting values before a pattern or gallery script runs, so nothing one script leaves behind reaches the next: the point list (pts... |
| `resetFiguresState` | ui/figures/figuresState.js:82 | Reset (used by init) NOTE: Does NOT clear figuresRegistry -- that cache persists across navigation and is only cleared by explicit cache |
| `resetFigureTab` | ui/figures/figuresSave.js:302 | Throws away the changes since the last save: reads the saved file again and rebuilds the figure from it. |
| `resetGalleryState` | ui/gallery/galleryState.js:64 | (no comment) |
| `resetHomeState` | ui/home/homeState.js:52 | NOTE: homeResultsRenderToken is intentionally NOT reset to 0 here -- resetting it could cause a stale in-flight render from the previous session to match the... |
| `resetPatternsState` | ui/patterns/patternsState.js:57 | Reset (used by init) |
| `resetUtilitiesState` | ui/utilities/utilitiesState.js:61 | NOTE: hasRunUtility is NOT reset -- it persists for the session to keep the Result tab visible. |
| `resolveInside` | node/safePaths.mjs:87 | Joins rootAbs and a relative path from the caller. |
| `resolveManifestPathAllowed` | node/manifestRequests.mjs:344 | DESCRIPTION Resolves a UI-provided manifest path safely and ensures it remains inside ONE of the allowed roots. |
| `restoreDrawTab` | ui/draw/draw.js:163 | (no comment) |
| `restoreGalleryTab` | ui/gallery/gallery.js:168 | (no comment) |
| `restoreHomeTab` | ui/home/home.js:133 | (no comment) |
| `restorePatternsTab` | ui/patterns/patterns.js:133 | (no comment) |
| `restoreTab` | ui/setUI.js:88 | Lifecycle: Restore & Init |
| `restoreUtilityTab` | ui/utilities/utilities.js:160 | (no comment) |
| `reversed` | draw/shapers.js:79 | the same points in the opposite order. |
| `rgbToHex` | draw/color.js:45 | RGB → hex helper |
| `rotated` | draw/shapers.js:118 | every point turned about centre c by deg degrees. |
| `rotateStart` | draw/shapers.js:103 | treat the points as a closed loop and start it at index k. |
| `rotateTransformAbout` | draw/drawTransform.js:140 | Turns the whole picture by d radians about the canvas point (cx, cy). |
| `rulerText` | ui/figures/figureTemplates.js:222 | "Ruler: 300 px (150.0 mm)" for a ruler layer, else "". |
| `run` | ui/scriptHistory.js:158 | Runs the script at scriptPath, or text in its place; true if it ran. |
| `runManifestMaintenance` | node/maintain_manifests.mjs:28 | Main entry point for the maintenance script. |
| `runPattern` | ui/draw/drawExport.js:194 | (no comment) |
| `runScriptByPath` | ui/scriptRunner.js:388 | (no comment) |
| `runSetUI` | ui/setUI.js:177 | (no comment) |
| `runUtilityEntry` | ui/utilities/utilitiesDisplay.js:113 | (no comment) |
| `runUtilityItem` | ui/utilities/utilities.js:352 | (no comment) |
| `sameFile` | node/scriptHistoryRequests.mjs:64 | Two file paths are the same file (Windows ignores case). |
| `saveActiveDrawObjectAsSecondary` | ui/draw/drawMenuCmds.js:368 | Secondary Object Commands |
| `saveActiveSecondaryObject` | ui/draw/drawMenuCmds.js:404 | (no comment) |
| `saveDrawState` | ui/draw/draw.js:195 | (no comment) |
| `saveFigure` | node/figureFiles.mjs:49 | (no comment) |
| `saveFigureAs` | ui/figures/figuresSave.js:74 | Asks for a category and a name, then saves. |
| `saveFigureTab` | ui/figures/figuresSave.js:56 | Save. |
| `saveGalleryState` | ui/gallery/gallery.js:224 | (no comment) |
| `saveHelpFile` | ui/helpEditor.js:263 | Writes Help HTML via Node dispatch: request: "writeHelpFile" payload: { helpPath, html } |
| `saveHomeState` | ui/home/home.js:151 | (no comment) |
| `saveOneSheetSVG` | ui/figures/figurePrint.js:303 | Downloads oneSheetSVG as <figure name>.svg. |
| `savePatternsState` | ui/patterns/patterns.js:175 | (no comment) |
| `saveSecondary` | ui/draw/secondaryObjects.js:20 | Persists a secondary object configuration + thumbnail. |
| `saveSecondaryObject` | node/secondaryRequests.mjs:24 | TASK: saveSecondaryObject Saves one set of Draw settings (a secondary object) as JSON plus a thumbnail under drawRegistry/<primaryId>/, and adds it to that |
| `saveThumbnailSettings` | ui/thumbnailSettings.js:59 | (no comment) |
| `saveUtilityState` | ui/utilities/utilities.js:191 | (no comment) |
| `scaled` | draw/shapers.js:127 | every point moved toward or away from centre c by factor k. |
| `scanDir` | node/generateHelpManifest.mjs:63 | (no comment) |
| `scriptFile` | node/scriptHistoryRequests.mjs:51 | An app path ("/patterns/circles/circle.js") as a file in the repo. |
| `selectLayer` | ui/figures/figureLayers.js:306 | Makes a layer active (a click on its number in the strip). |
| `sendCorsPreflight` | node/sketchpadServer.mjs:307 | DESCRIPTION Responds to browser CORS preflight for POST /dispatch. |
| `sendJson` | node/sketchpadServer.mjs:284 | DESCRIPTION Writes a JSON response with the given HTTP status and includes dev CORS headers for localhost UI access. |
| `sendSave` | ui/figures/figuresSave.js:101 | One round trip. |
| `setAccordionControl` | ui/controls/widgets/accordionWidget.js:9 | (no comment) |
| `setActiveItem` | ui/categories.js:250 | Marks the clicked item as active within the rendered frame. |
| `setActiveTab` | ui/setUI.js:40 | Helpers |
| `setButtonControl` | ui/controls/widgets/buttonWidget.js:8 | (no comment) |
| `setCaptionBar` | ui/caption.js:54 | Builds the caption bar. |
| `setCheckboxControl` | ui/controls/widgets/checkboxWidget.js:8 | (no comment) |
| `setColorControl` | ui/controls/widgets/colorWidget.js:17 | (no comment) |
| `setCommandsButtonHandler` | ui/commandsButton.js:34 | Replaces the Commands button click handler deterministically. |
| `setCommandsButtonLabel` | ui/commandsButton.js:16 | Set the Commands button label for the active top-level tab. |
| `setCurrentCategory` | ui/gallery/galleryState.js:56 | (no comment) |
| `setCurrentCategory` | ui/patterns/patternsState.js:45 | Setters |
| `setCurrentCategory` | ui/utilities/utilitiesState.js:49 | (no comment) |
| `setCurrentDomain` | ui/gallery/galleryState.js:55 | (no comment) |
| `setCurrentDomain` | ui/utilities/utilitiesState.js:48 | Setters |
| `setCurrentIndex` | ui/gallery/galleryState.js:58 | (no comment) |
| `setCurrentIndex` | ui/patterns/patternsState.js:49 | (no comment) |
| `setCurrentIndex` | ui/utilities/utilitiesState.js:51 | (no comment) |
| `setCurrentList` | ui/gallery/galleryState.js:57 | (no comment) |
| `setCurrentList` | ui/utilities/utilitiesState.js:50 | (no comment) |
| `setCurrentTabId` | ui/figures/figuresState.js:69 | (no comment) |
| `setDefaultControl` | ui/controls/widgets/textWidget.js:8 | (no comment) |
| `setDrawAction` | ui/draw/drawMenuCmds.js:188 | No-op placeholder -- parameter controls are injected directly by the draw object's own init()/render(). |
| `setDrawSketchpad` | ui/draw/drawRunner.js:122 | (no comment) |
| `setDrawSubtabs` | ui/draw/drawNav.js:64 | (no comment) |
| `setDrawText` | ui/draw/drawCategories.js:38 | (no comment) |
| `setFiguresAction` | ui/figures/figures.js:232 | Builds the Figures controls in the permanent #button div, under the Commands button, in this order: Show All checkbox      (figure subtabs only) |
| `setFiguresCaption` | ui/figures/figuresCommands.js:132 | title    - caption text (default "Figures") withMenu - true on a figure subtab: shows the "v" menu The menu items are built fresh each time the "v" is pressed |
| `setFiguresRegistry` | ui/figures/figuresState.js:65 | Setters |
| `setFiguresSketchpad` | ui/figures/figures.js:328 | Moves the one shared drawing canvas (window.drawCanvas, used by every tab) into this tab's #sketchpad region, unless it is already there. |
| `setFiguresSubtabs` | ui/figures/figuresNav.js:75 | (no comment) |
| `setFiguresText` | ui/figures/figures.js:320 | The #text region holds the category list. |
| `setGalleryCache` | ui/gallery/galleryState.js:54 | Setters |
| `setHasRunUtility` | ui/utilities/utilitiesState.js:52 | (no comment) |
| `setHelpBrowserDefaultPage` | ui/helpTree.js:374 | Forces the right pane to show /help/index.html every time the Help Browser overlay opens. |
| `setHiddenControl` | ui/controls/widgets/hiddenWidget.js:6 | controls/widgets/hiddenWidget.js HIDDEN WIDGET |
| `setHomeAction` | ui/home/home.js:177 | (no comment) |
| `setHomeCaption` | ui/home/homeMenuCmds.js:56 | (no comment) |
| `setHomeCaptionForResult` | ui/home/homeMenuCmds.js:70 | (no comment) |
| `setHomeManifestGrouped` | ui/home/homeState.js:37 | Setters |
| `setHomeSketchpad` | ui/home/home.js:183 | (no comment) |
| `setHomeSubtabs` | ui/home/homeNav.js:112 | (no comment) |
| `setHomeText` | ui/home/home.js:168 | Region builder stubs |
| `setIdsWithSecondaries` | ui/draw/drawTabState.js:43 | Setter |
| `setInstrumenting` | ui/instrument.js:63 | (no comment) |
| `setLayerVisible` | ui/figures/figureLayers.js:376 | The Show checkbox in the caption bar. |
| `setNailSize` | ui/figures/figurePrint.js:220 | (no comment) |
| `setNumberControl` | ui/controls/widgets/numberWidget.js:22 | (no comment) |
| `setPatternsSubtabs` | ui/patterns/patternsNav.js:43 | (no comment) |
| `setPrintSize` | ui/figures/figurePrint.js:201 | Ask for the printed width of the nails (mm), or the nail diameter and clearance (mm). |
| `setPt` | draw/drawUtilities.js:736 | (no comment) |
| `setRadioControl` | ui/controls/widgets/radioWidget.js:9 | (no comment) |
| `setRangeControl` | ui/controls/widgets/rangeWidget.js:194 | (no comment) |
| `setRangeControlUnified` | ui/controls/widgets/rangeWidget.js:10 | (no comment) |
| `setRangeHeaderControl` | ui/controls/widgets/rangeWidget.js:43 | DESCRIPTION Alternate range control UI: - header line: "Label: <value>" |
| `setSelectControl` | ui/controls/widgets/selectWidget.js:9 | (no comment) |
| `setStaticTextControl` | ui/controls/widgets/textWidget.js:32 | point picker helpers (local to parameterControls.js) |
| `setThumbnailGridControl` | ui/controls/widgets/thumbnailWidget.js:10 | (no comment) |
| `setThumbnailSize` | ui/thumbnailSettings.js:76 | Returns the size actually set (clamped and rounded). |
| `setThumbnailsOn` | ui/thumbnailSettings.js:68 | (no comment) |
| `setUI` | ui/setUI.js:150 | (no comment) |
| `setUtilityCategories` | ui/utilities/utilitiesDisplay.js:38 | (no comment) |
| `setUtilitySubtabs` | ui/utilities/utilitiesNav.js:83 | (no comment) |
| `setVariantAndRedraw` | drawRegistry/parametrics.js:72 | (no comment) |
| `showBar` | ui/errorReport.js:116 | The error bar |
| `showCategoryList` | ui/patterns/patternsNav.js:148 | (no comment) |
| `showDiff` | ui/scriptHistory.js:173 | (no comment) |
| `showGalleryImage` | ui/gallery/galleryResults.js:216 | (no comment) |
| `showGalleryResultsImages` | ui/gallery/galleryResults.js:54 | (no comment) |
| `showGalleryResultsScripts` | ui/gallery/galleryResults.js:111 | (no comment) |
| `showGalleryScript` | ui/gallery/galleryResults.js:243 | (no comment) |
| `showGalleryScriptSource` | ui/gallery/galleryMenuCmds.js:165 | (no comment) |
| `showHelp` | ui/overlay.js:102 | Help Overlay |
| `showHelpOverlay` | ui/overlay.js:134 | overlay.js  (REPLACE showHelpOverlay with this version) |
| `showHomeAlert` | ui/homeAlert.js:73 | Two parts, each shown only when it has something to say and has not been dismissed: - the newest manifest check, when it found problems; |
| `showHomeResultsError` | ui/home/homeResults.js:152 | (no comment) |
| `showIdeabookCategories` | ui/gallery/galleryNav.js:194 | (no comment) |
| `showLine` | ui/draw/drawStep.js:75 | draw up to line k (1 is the first line) and update the readout. |
| `showNextGalleryItem` | ui/gallery/galleryResults.js:183 | (no comment) |
| `showNotesOverlay` | ui/overlay.js:223 | Shows a file's header notes in the same "help" overlay layer and with the same toolbar and body classes as showHelpOverlay. |
| `showOffcanvas` | ui/offcanvas.js:23 | Unified offcanvas display function. |
| `showPanel` | ui/offcanvas.js:60 | Show #offcanvasPanel as it stands (a caller that filled it in itself uses this). |
| `showPatternsCategories` | ui/gallery/galleryNav.js:228 | (no comment) |
| `showPatternScript` | ui/patterns/patternsMenuCmds.js:193 | (no comment) |
| `showPrevGalleryItem` | ui/gallery/galleryResults.js:147 | (no comment) |
| `showScriptOffcanvas` | ui/scriptView.js:15 | (no comment) |
| `showScriptsCategories` | ui/gallery/galleryNav.js:262 | (no comment) |
| `showSecondaryOffcanvas` | ui/draw/drawNav.js:330 | (no comment) |
| `showSelectedPattern` | ui/patterns/patternsDisplay.js:73 | (no comment) |
| `showWeldNotice` | ui/figures/figurePointer.js:120 | A short-lived note in the caption bar (Phase 8: weld created, removed, or nothing nearby to weld). |
| `simplified` | draw/shapers.js:178 | drop points that change nothing. |
| `snapshotOfFigure` | ui/figures/figureModel.js:102 | The figure as text, for telling whether it changed since it was last saved or opened. |
| `snapshotWeldMembers` | ui/figures/figureWeldMove.js:75 | The current canvas position of every welded disc on one layer, taken just before that layer is about to change. |
| `sortCaseInsensitive` | node/generateHelpManifest.mjs:59 | (no comment) |
| `spacingProblems` | ui/figures/figurePrint.js:150 | { ok, message, pairs: [[nailA, nailB, mm]], nails }. |
| `startServer` | node/sketchpadServer.mjs:112 | DESCRIPTION Creates and starts the HTTP server. |
| `startStepping` | ui/draw/drawStep.js:39 | draw everything once to count the lines, then show the controls with the last line marked. |
| `statusForError` | node/sketchpadServer.mjs:91 | A plain Error thrown by a handler for bad input has no system error code and says what is wrong with the request. |
| `stitcher` | draw/drawUtilities.js:539 |    returns an array of lines |
| `stopStepping` | ui/draw/drawStep.js:50 | remove the controls and draw the whole object again. |
| `stripExt` | node/maintain_manifests.mjs:414 | Removes the specified extension from a string. |
| `summaryLines` | node/maintain_manifests.mjs:266 | The lines that go at the top of the log: the problems, then the files added to manifests. |
| `sweepableSettings` | ui/draw/drawSweep.js:37 | The settings a sweep can run over: every slider (range control), as { key, label, min, max, step }. |
| `sweepGrid` | ui/draw/drawSweep.js:74 | A grid over two settings: one row per value of keyB (down), one picture per value of keyA (across). |
| `sweepPictures` | ui/draw/drawSweep.js:65 | One picture (a data URL) per value, of the open object with key set to it. |
| `sweepValues` | ui/draw/drawSweep.js:47 | count values evenly across from..to, each on one of the slider's steps. |
| `switchHomeView` | ui/home/homeNav.js:131 | (no comment) |
| `switchTab` | ui/draw/drawNav.js:194 | (no comment) |
| `switchToCategories` | ui/figures/figuresNav.js:362 | Shows the category list (#text) and hides the drawing area, the layer strip and the controls. |
| `switchToFigureTab` | ui/figures/figuresNav.js:401 | Shows one figure: hides the category list, shows the drawing area and the layer strip, builds the caption bar and its tools, then the layer panel (which also... |
| `switchUtilityTab` | ui/utilities/utilitiesNav.js:99 | (no comment) |
| `syncLayerToCanvas` | ui/canvasLayerManager.js:152 | Sizes and positions the named canvas layer to exactly match the dimensions of referenceCanvas. |
| `syncSystemStateAfterRebuild` | ui/rebuildSync.js:16 | Global Sync: Wipes the manifest cache and sets needsUpdate for all tabs. |
| `templatePages` | ui/figures/figurePrint.js:325 | The template as { pages: [svg text], sheets: { rows, cols }, widthMm, heightMm, nails }. |
| `textColorOn` | ui/figures/figureLayerPanel.js:185 | Black or white, whichever reads better on the given background. |
| `thumbFromEntryPath` | ui/thumbnailSettings.js:130 | Home lists entries from every tab, each with the path of its file: /patterns/<category>/<name>.js /gallery/<domain>/<category>/<name>.js (or an image) |
| `tick` | ui/errorReport.js:168 | Acknowledges one error in the log. |
| `timed` | ui/instrument.js:47 | work is a function that returns a promise (or a plain value). |
| `timesTable` | draw/connectors.js:117 | round a loop of n points, point i joined to point (i*factor) mod n. |
| `toCanvas` | ui/interactor.js:155 | Handles live in object space. |
| `toggleAccordionSection` | ui/controls/widgets/accordionWidget.js:222 | Opens a closed section (and closes the others, so one section is open at a time) or closes an open one. |
| `toggleIdeabookScript` | ui/gallery/galleryResults.js:322 | Run script / Show image. |
| `toggleWeldAt` | ui/figures/figureWelds.js:135 | The right-click action. |
| `toHexColor` | ui/controls/widgets/colorWidget.js:50 | Any CSS color text as "#rrggbb". |
| `toObject` | ui/interactor.js:159 | (no comment) |
| `toSafeName` | node/createFigureService.mjs:249 | Helpers |
| `toUnits` | ui/figures/figurePrint.js:247 | A length in mm, shown in the print units: 3 decimals for inches, 1 for mm. |
| `translated` | draw/shapers.js:112 | every point moved by dx, dy. |
| `translateTransform` | draw/drawTransform.js:121 | The same transform, moved (dx, dy) canvas pixels. |
| `translateWholeLayer` | ui/figures/figureWeldMove.js:131 | The fallback for a node with no real handle of its own. |
| `trimmedRange` | draw/drawRegular.js:405 | The same clamp changeLine() applies, but returning the index window { from, to } instead of a cut-down array. |
| `unitName` | ui/figures/figurePrint.js:242 | "inches" or "millimetres", for questions. |
| `updateDrawCaption` | ui/draw/drawMenuCmds.js:61 | Builds the full caption bar for a draw object tab. |
| `updateFigureButtons` | ui/figures/figuresNav.js:264 | The left command area. |
| `updateGalleryCaption` | ui/gallery/galleryMenuCmds.js:60 | (no comment) |
| `updateLayerInfo` | ui/figures/figureLayerPanel.js:202 | Fills the "Layer N . |
| `updatePatternsCaption` | ui/patterns/patternsMenuCmds.js:53 | Title rule: "{category}: {title}" |
| `updateReadout` | ui/draw/drawStep.js:85 | slider range and position, and the words under it. |
| `updateSecondariesDiscovery` | ui/draw/drawNav.js:315 | (no comment) |
| `updateUtilitiesCaption` | ui/utilities/utilitiesMenuCmds.js:36 | (no comment) |
| `upgradeFigureV1` | ui/figures/figureModel.js:167 | Fills in any format field a figure is missing, with its default, so a file written before a field existed opens the same as a new one. |
| `validateEditManifestSpec` | ui/editManifestDialog.js:69 | (no comment) |
| `validateItems` | ui/menuManager.js:36 | (no comment) |
| `validateLinkMode` | classes/linkedCircles.js:164 | Ensures mode is one of the three supported strings. |
| `validateLinkMode` | classes/overlayClass.js:173 | Ensures mode is one of the three supported strings. |
| `validateNumeric` | ui/controls/shared/helpers.js:24 | Validate and clamp numeric input |
| `validateOpenSecondaryTabs` | ui/draw/drawNav.js:270 | (no comment) |
| `walkFindManifestJson` | node/maintain_manifests.mjs:330 | Recursively searches a directory for manifest.json files. |
| `walkFindManifests` | node/manifestRequests.mjs:388 | (no comment) |
| `weldHandleDrop` | ui/figures/figureWelds.js:249 | Called when a drag of handle h of layer layerIndex ends (see the header). |
| `weldOf` | ui/figures/figureWeldModel.js:46 | The weld group point n belongs to, or null. |
| `wireDrawCommandsButton` | ui/draw/drawMenuCmds.js:463 | (no comment) |
| `wireEditManifestHandlers` | ui/editManifestDialog.js:183 | wireEditManifestHandlers - UPDATED (NO UseCustom BUTTON) |
| `wireFiguresCommandsButton` | ui/figures/figuresCommands.js:65 | The Commands button at the top left opens a slide-in panel ("offcanvas", a Bootstrap term) with two buttons: Rebuild & Validate  asks the Node service to reb... |
| `wireGalleryCommandsButton` | ui/gallery/galleryMenuCmds.js:327 | (no comment) |
| `wireHomeCommandsButton` | ui/home/homeMenuCmds.js:200 | (no comment) |
| `wireInstance` | ui/figures/figureLayers.js:205 | Attaches the callbacks that interactor.js and the weld code use to one layer's live object. |
| `wirePatternsCommandsButton` | ui/patterns/patternsMenuCmds.js:279 | (no comment) |
| `wireUtilitiesCommandsButton` | ui/utilities/utilities.js:282 | (no comment) |
| `writeChecklist` | node/homeListRequests.mjs:23 | (no comment) |
| `writeFigureThumbnail` | ui/figures/figuresSave.js:159 | After a save, the picture for the category list: the figure as Show All draws it (hidden layers included), cropped and scaled to THUMB_FILE_SIZE. |
| `writeFileAtomicSync` | node/serviceFileHelpers.mjs:48 | Writes to a temporary file in the same folder, then renames it over the real file. |
| `writeGalleryPatternPng` | node/writerRequests.mjs:250 | TASK: writeGalleryPatternPng DESCRIPTION Writes TWO PNGs provided by the browser into: |
| `writeHelpFile` | node/writerRequests.mjs:168 | TASK: writeHelpFile  (CREATE OR OVERWRITE) DESCRIPTION Writes Help HTML back to disk. |
| `writeJsonFileSync` | node/serviceFileHelpers.mjs:33 | Writes formatted JSON with a trailing newline. |
| `writeJsonIfChanged` | node/maintain_manifests.mjs:354 | Alphabetizes and stringifies JSON data. |
| `writePatternFromDrawRegistry` | node/writerRequests.mjs:432 | TASK: writePatternFromDrawRegistry Payload: { |
| `writePatternThumbnail` | node/writerRequests.mjs:88 | TASK: writePatternThumbnail DESCRIPTION Writes a PNG thumbnail provided by the browser (200x200 since the category lists show pictures; any size is accepted). |
| `writeThumbnail` | node/thumbnailRequests.mjs:33 | (no comment) |
| `writeToLog` | ui/errorReport.js:105 | Appends one error to today's error log. |
