# Version 2: ideas to fold in before the specification is redone

Barry adds ideas here as they occur. Nothing in this file changes the specification
(`docs/Sketchpad-V2-Functional-Specification.pdf`, SPV2-FS-001 Rev A) until the two of us have discussed it.
Then the specification is revised in one pass. Newest last.

| No. | Date | Idea | Notes |
|---|---|---|---|
| I-1 | 1 Nov 2026 | Plugin engines | Discussed earlier (Sketchpad v2 Architecture, section 10): output engines (SVG, PDF, plotter, DXF, CNC) and input engines (what produces a drawing). Must be settled before CP-0, because it decides how the kernel, generators and renderers are found and loaded. Open question: does "plugin" also cover adding new makers, shapers, connectors and finders by dropping in a file, the same way generators are added? |
