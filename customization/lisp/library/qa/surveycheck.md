---
title: "SURVEYCHECK — Drawing audit: layers, text styles, point styles, xrefs"
section: customization/lisp/library/qa
tags: [autolisp, lisp, qa, audit, standards]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type SURVEYCHECK.
> 2. The command-line report flags missing required layers, missing text styles, unresolved xrefs, and frozen layers that still hold entities.

## Command

`c:SURVEYCHECK`

## What it does

Iterates the symbol tables `LAYER`, `STYLE`, and `BLOCK` and matches them against three user-edited lists at the top of the file:

- `SC-REQ-LAYERS*` — layer names that must exist.
- `SC-REQ-TEXTSTYLES*` — text-style names that must exist.
- `SC-REQ-POINTSTYLES*` — Civil 3D point-style names to look for. Note these live in a Civil 3D-specific dictionary, *not* the `STYLE` table; the vanilla check is best-effort.

The xref section lists every external reference block (block table flag bit 4) with its DXF group 1 path so the user can spot unresolved or relocated xrefs.

The "frozen layers still containing entities" check helps spot layers that were frozen as a cleanup step but were never actually emptied — a common deliverable-prep mistake.

## Prompts

None. Edit the three `setq` lists at the top of the file to match your office standard before deploying.

## Notes & gotchas

- The required Civil 3D point-style check is a stub. Real Civil 3D point styles live in `AeccPointStyles` under the Civil 3D dictionary; a complete check requires `(vlax-invoke (vla-get-PointStyles cdoc) ...)` against the Civil 3D COM API. See `c3d-stylecheck` for a starting point.
- Frozen-layer-with-entities scan uses `(ssget "_X" ...)` which can be slow on big drawings.
- Output goes only to the command line. Pipe it through your own logger if you need a file.

## Source listing

Full source in [`surveycheck.lsp`](surveycheck.lsp). Required-list edit point:

```lisp
(setq SC-REQ-LAYERS*
  '("V-BNDY" "V-BNDY-LINE" "V-TPOG" "V-ROAD" "V-NODE" "V-NODE-TEXT"))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla symbol-table reads. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
