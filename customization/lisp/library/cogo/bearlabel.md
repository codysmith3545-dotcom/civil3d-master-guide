---
title: "BEARLABEL — Label one segment with bearing and distance"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, label, bearing, annotation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `BEARLABEL` picks one line or one polyline segment and drops a single TEXT label at its midpoint, rotated to the segment direction.
> 2. Format: `N12-34-56E  150.00` (bearing then distance, two spaces).
> 3. Auto-flips the label so it always reads left-to-right (no upside-down text).

## Command

`BEARLABEL`

## What it does

`(entsel)` returns both the entity and the pick point. For a LINE, the endpoints come directly from DXF 10/11. For an LWPOLYLINE, the routine extracts every vertex and picks the segment whose midpoint is closest to the pick point — so clicking near a specific segment of a long polyline labels exactly that segment.

Text rotation matches the segment angle but is flipped 180 degrees when the segment angle is in the bottom half of the circle, keeping the label upright.

## Prompts

1. **Pick a line or a polyline segment:** click on or very near the segment to label.

## Notes & gotchas

- Text height is hard-coded to 2.0 drawing units. Edit the `(command "_.TEXT" ...)` line to change.
- Distance is printed to two decimal places. Tweak `(rtos d 2 2)`.
- Justification is middle-center (`_MC`), so the label straddles the segment line. If you want offset-above-line behavior, change to `_BC` (bottom-center) and offset the insertion point perpendicular to the segment direction.
- Arc segments are not detected — picking near an arc bulge in a polyline yields a chord bearing.
- Bearing format omits spaces around the DMS (`N12-34-56E`) for compactness. Change `az-to-bearing` if you want spaces.

## Source listing

Source: ./bearlabel.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
