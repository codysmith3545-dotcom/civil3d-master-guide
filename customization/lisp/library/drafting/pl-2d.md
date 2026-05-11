---
title: "PL-2D — Flatten selected entities to Z = 0"
section: customization/lisp/library/drafting
tags: [autolisp, lisp, drafting, flatten, z]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Select polylines, lines, points, text, blocks.
> 2. Each is rewritten with Z = 0 without changing X/Y.

## Command

`c:PL-2D`

## What it does

Walks the selection and rewrites the elevation field appropriate to each entity type:

| Entity type | Field rewritten |
|---|---|
| LWPOLYLINE | DXF group 38 |
| POLYLINE (heavy) | group 10 of every VERTEX sub-entity |
| LINE | group 10 *and* group 11 |
| POINT, TEXT, MTEXT, INSERT, CIRCLE, ARC | group 10 |

X and Y are preserved. Other 3D entities (SPLINE, 3DSOLID, MESH, SURFACE) are silently skipped.

## Prompts

1. `Select entities to flatten to Z=0:`

## Notes & gotchas

- This is "fast and dirty" flatten — it does not project along a custom UCS or honour a normal vector other than world Z. For UCS-aware flatten, use Express Tools `FLATTEN` or `_FLATTEN`.
- AutoCAD's `_FLATTEN` Express Tools command goes further: it converts splines and arcs into 2D representations. `PL-2D` here only sets Z to 0.
- Hatches that were created with seed points containing Z stay valid; their boundaries are 2D anyway.

## Source listing

Full source in [`pl-2d.lsp`](pl-2d.lsp). Dispatch:

```lisp
(cond
  ((= typ "LWPOLYLINE") ... group 38 ...)
  ((= typ "POLYLINE")   ... rewrite VERTEX group 10 ...)
  ((= typ "LINE")       ... rewrite groups 10 and 11 ...)
  ((member typ '("POINT" "TEXT" "MTEXT" "INSERT" "CIRCLE" "ARC"))
                        ... rewrite group 10 ...))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla DXF. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
