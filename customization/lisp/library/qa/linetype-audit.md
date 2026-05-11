---
title: "LINETYPE-AUDIT — Find entities that override layer linetype/color/lineweight"
section: customization/lisp/library/qa
tags: [autolisp, lisp, qa, audit, bylayer]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type LINETYPE-AUDIT.
> 2. Each model-space entity whose linetype, colour, or lineweight is not ByLayer / ByBlock is listed with its layer and the overridden property.

## Command

`c:LINETYPE-AUDIT`

## What it does

Selects every model-space entity (`(ssget "_X" '((410 . "Model")))`) and reads:

- DXF group 6 (linetype name) — flagged if not `BYLAYER` or `BYBLOCK`.
- DXF group 62 (color index) — flagged if not 256 (`BYLAYER`) or 0 (`BYBLOCK`).
- DXF group 370 (lineweight) — flagged if not -1 (`BYLAYER`), -2 (`BYBLOCK`), or -3 (default).

The report is purely informational; no entities are changed. Pair with `_.CHPROP` or the SETBYLAYER command to fix everything at once.

## Prompts

None.

## Notes & gotchas

- Only model space is scanned. Add a paper-space pass if your title-block sheets need auditing.
- True color and color-book entries are reported as their colour index 0 or 256 if those are present; for a richer breakdown, also read DXF group 420 (true color) and group 430 (color name).
- Hatches and dimensions often legitimately override layer properties for layering reasons; review flagged entities before bulk-fixing.

## Source listing

Full source in [`linetype-audit.lsp`](linetype-audit.lsp). Core override checks:

```lisp
(if (not (or (= (strcase ltype) "BYLAYER")
             (= (strcase ltype) "BYBLOCK")))
  (setq reason (cons (strcat "linetype=" ltype) reason)))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla DXF reads. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
