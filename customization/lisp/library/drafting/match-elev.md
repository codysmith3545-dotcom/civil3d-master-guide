---
title: "MATCH-ELEV — Copy Z elevation between picked entities"
section: customization/lisp/library/drafting
tags: [autolisp, lisp, drafting, elevation, z]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a source entity.
> 2. Select target entities.
> 3. The source's Z (elevation) is written to every target.

## Command

`c:MATCH-ELEV`

## What it does

Reads Z from the source:
- `LWPOLYLINE` — DXF group 38 (`Elevation`).
- `INSERT`, `TEXT`, `MTEXT`, `POINT`, `CIRCLE`, `LINE` — Z of DXF group 10.

Writes Z to each target using the same convention. For `LINE`, both endpoints (groups 10 and 11) are set to the new Z.

## Prompts

1. `Pick source entity (its elevation will be copied):`
2. `Select target entities:`

## Notes & gotchas

- Does not touch 3DPOLYLINE, SPLINE, or 3D solids — those have per-vertex Z. Use `PL-ELEV-SET` for an LWPOLYLINE-vertex bulk-set.
- For LWPOLYLINE this sets the *polyline elevation* (group 38), which AutoCAD applies to all vertices since the LWPOLYLINE is a 2D entity. The X/Y of each vertex is unchanged.
- Blocks with attributes: attribute sub-entities are not touched. Use `BLOCK-EXPLODE-ATTRIBS` first if you need attribute Z copied.

## Source listing

Full source in [`match-elev.lsp`](match-elev.lsp). LWPOLYLINE elevation set:

```lisp
(setq new-edata
  (if (assoc 38 edata)
    (subst (cons 38 z) (assoc 38 edata) edata)
    (append edata (list (cons 38 z)))))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla DXF. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
