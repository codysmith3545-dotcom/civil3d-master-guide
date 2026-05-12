---
title: "BREAK-PL-AT-VERTEX — Break a polyline into two at the nearest vertex"
section: customization/lisp/library/drafting
tags: [autolisp, lisp, drafting, polyline, break]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick an LWPOLYLINE near the vertex you want to break at.
> 2. The vertex closest to your pick is selected automatically.
> 3. BREAK is run with first=second point so no gap is created — the polyline splits into two coincident-vertex polylines.

## Command

`c:BREAK-PL-AT-VERTEX`

## What it does

Builds the vertex list from DXF group 10 entries, finds the closest one to the screen pick, then issues `_.BREAK ent _F pt pt`. AutoCAD's BREAK treats first-point == second-point as "split here, no gap" — the cleanest way to split a polyline without rebuilding it from scratch.

After the break the originally-selected polyline keeps its DXF handle for the segment 0..k portion; the segment k..n half becomes a new entity (a new handle) on the same layer with the same global elevation, linetype, and properties.

## Prompts

1. `Pick polyline near the vertex to break at:` — pick anywhere on the polyline; the routine snaps to the nearest vertex.

## Notes & gotchas

- LWPOLYLINE only. Heavy POLYLINE and 3DPOLYLINE are not supported.
- If the closest vertex is the start or end, the BREAK call will fail because AutoCAD refuses to break at an endpoint. Re-pick near an interior vertex.
- Object snaps are disabled during the BREAK so the routine's coordinate is used exactly.

## Source listing

Full source in [`break-pl-at-vertex.lsp`](break-pl-at-vertex.lsp). Nearest-vertex helper:

```lisp
(foreach v verts
  (setq d (distance v pick))
  (if (< d best-d) (progn (setq best v) (setq best-d d))))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla BREAK. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
