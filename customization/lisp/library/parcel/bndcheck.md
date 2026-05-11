---
title: "BNDCHECK — Audit a boundary polyline"
section: customization/lisp/library/parcel
tags: [autolisp, lisp, parcel, boundary, qa]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick an LWPOLYLINE.
> 2. BNDCHECK prints closure error, perimeter (chord), segment count, curve count, and zero-length-segment count to the command line.

## Command

`c:BNDCHECK`

## What it does

Reads the LWPOLYLINE's DXF group 10 (vertex) and group 42 (bulge) records. Walks segments and reports a short audit so the user can spot common boundary-traverse mistakes: an unclosed polyline that looks closed on screen, duplicate vertices, or curve segments where only the bulge was set without companion radius/arc-length data in a parcel label style.

Perimeter is reported as the sum of straight chord lengths between vertices; for curve segments the actual arc length will differ — the report flags how many curve segments exist so the user knows when to trust the number.

## Prompts

1. `Select boundary polyline to audit:`

## Notes & gotchas

- LWPOLYLINE only. Heavy POLYLINE and 3DPOLYLINE are not supported.
- "Closure error" is reported only when the polyline's closed flag is *not* set. Closed polylines always have closure of exactly 0 by definition.
- "Perimeter (chord)" prints in drawing units; the routine does not assume feet.

## Source listing

Full source is in [`bndcheck.lsp`](bndcheck.lsp).

```lisp
(setq verts nil bulges nil)
(foreach pair edata
  (cond
    ((= 10 (car pair)) (setq verts  (cons (cdr pair) verts)))
    ((= 42 (car pair)) (setq bulges (cons (cdr pair) bulges)))))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Pure AutoLISP, no ActiveX. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
