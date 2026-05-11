---
title: "PL-ELEV-SET — Set elevation on every vertex of a polyline"
section: customization/lisp/library/drafting
tags: [autolisp, lisp, drafting, polyline, elevation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a polyline.
> 2. Enter a Z.
> 3. LWPOLYLINE: group 38 (elevation) is set; heavy POLYLINE / 3DPOLY: each vertex's group 10 Z is rewritten.

## Command

`c:PL-ELEV-SET`

## What it does

LWPOLYLINEs are 2D entities; their entire elevation is stored in DXF group 38. Heavy POLYLINE (including 3DPOLY which DXF stores as POLYLINE with a flag bit) carries per-vertex Z in the group 10 of each VERTEX sub-entity. The routine detects entity type, takes the appropriate branch, and uses `entmod` to apply the new Z. `entupd` is called on the parent after vertex rewrites so the screen redraws.

## Prompts

1. `Pick polyline to set elevation:`
2. `New elevation Z:`

## Notes & gotchas

- Does not touch X/Y coordinates.
- Does not work on SPLINE — convert to polyline first (`SPLINEDIT > Polyline`).
- For a quick "drop everything to Z=0" use `PL-2D`.

## Source listing

Full source in [`pl-elev-set.lsp`](pl-elev-set.lsp). Vertex Z rewrite:

```lisp
(setq pt (list (car pt) (cadr pt) new-z))
(entmod (subst (cons 10 pt) (assoc 10 edata) edata))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla DXF. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
