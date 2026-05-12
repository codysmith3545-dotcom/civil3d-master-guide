---
title: "CURVELABEL — Label an arc with R, L, Delta"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, label, arc, curve]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `CURVELABEL` picks an ARC and drops an MTEXT label near its midpoint with `R=`, `L=`, and central angle (Delta) in DMS.
> 2. Works only on standalone ARC entities, not arc segments inside polylines (use `CURVELABEL-ALL`).
> 3. Default text height 2.0.

## Command

`CURVELABEL`

## What it does

For the selected ARC:

- Center from DXF 10, radius from DXF 40, start angle from DXF 50, end angle from DXF 51 — all standard ARC group codes.
- `delta = end - start`, normalized to `[0, 2π)`.
- `arc length = radius * delta`.
- Label position is the arc midpoint, computed as `(polar center (sa + delta/2) radius)`.

Output format: `R=125.00  L=98.17  \Delta=45-00-00`. The `\Delta` is literal AutoCAD MTEXT — if you want the Greek delta character, change the string to `\\U+0394`.

## Prompts

1. **Pick an arc:** click an ARC entity.
2. **Text height <2.0>:** positive real or Enter.

## Notes & gotchas

- Polyline arc segments are **not** standalone ARC entities. To label them, use `CURVELABEL-ALL` or `EXPLODE` the polyline first.
- AutoCAD ARC entities are always counter-clockwise (start angle to end angle CCW). The routine does not detect or honor a "right-hand vs left-hand" survey convention — both are reported with positive delta.
- For Civil 3D alignment curves, the native curve label styles are richer (chord bearing, tangent, etc.). This routine is for one-off exhibits.
- Label goes on current layer.

## Source listing

Source: ./curvelabel.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
