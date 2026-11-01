# Version 2: ideas to fold in before the specification is redone

Barry adds ideas here as they occur. Nothing in this file changes the specification
(`docs/Sketchpad-V2-Functional-Specification.pdf`, SPV2-FS-001 Rev A) until the two of us have discussed it.
Then the specification is revised in one pass. Newest last.

| No. | Date | Idea | Notes |
|---|---|---|---|
| I-1 | 1 Nov 2026 | Plugin engines | Discussed earlier (Sketchpad v2 Architecture, section 10): output engines (SVG, PDF, plotter, DXF, CNC) and input engines (what produces a drawing). Must be settled before CP-0, because it decides how the kernel, generators and renderers are found and loaded. Open question: does "plugin" also cover adding new makers, shapers, connectors and finders by dropping in a file, the same way generators are added? |
| I-2 | 1 Nov 2026 | Every V1 figure opens in V2 | A hard requirement: V2 cannot pass CP-4 until Barry's real figures open and look right. V1's format is fixed and documented in `docs/FIGURE_FORMAT_V1.md` (layer `lid`, `objectVersion`, `role`, `includeInOutput`, named handle discs, `scale`); the import rules are at the end of that file. Each generator needs a "from V1 settings" mapping, written with its feature list. |
| I-3 | 1 Nov 2026 | Parametrics needs its own discussion | The sampling loops far more than usual (Loops x 60 samples per loop: 4,500 points at the default 75, all drawn and searched); reduce it to the usual. Barry's intersection routine works for some curves and is useless for others: find out which and why. Possible addition: curve tracing and simplification (sample more where the curve bends and less where it is straight, and drop points that change nothing), which would also cut the work above. In V1 the infrastructure arm already thins the curve to 720 points (v1-finish item 4). |
