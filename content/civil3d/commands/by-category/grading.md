---
title: "Grading commands"
section: "civil3d/commands/by-category"
order: 90
visibility: public
tags: [commands, grading, feature-lines, grading-objects, daylight]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D has two grading toolsets: feature lines (3D polylines with elevation editing) and grading objects (a feature line + criteria projecting to a target).
> 2. Grading objects belong to a grading group; the group can build a finished surface for volume comparison.
> 3. Feature lines are the everyday tool for curb returns, pad edges, swale bottoms, and graded breaklines.

## Commands in this category

- `CreateFeatureLineFromObject` — see [createfeaturelinefromobject.md](../createfeaturelinefromobject.md)
- `EditFeatureLineElevations` — see [editfeaturelineelevations.md](../editfeaturelineelevations.md)
- `GradingCreate` — see [gradingcreate.md](../gradingcreate.md)
- `CreateFeatureLines` — draw feature lines interactively.
- `FitCurve` / `Smooth` (feature line) — convert tangents to arcs / weed PVIs.
- `GradingGroupProperties` — set the target surface and volume base.
- `GradingCreateInfill` — fill a closed area between graded edges.
- `EditGradingProperties` — change criteria (slope, distance) on existing grading.
- `ApplyFeatureLineStyle` — change display.

## Typical workflow

1. Lay out the master edge as a feature line — pad outline, top of curb, swale bottom.
2. Set elevations: by reference (to a profile), by grade between PIs, or by surface.
3. From an edge, create grading objects projecting to a target (existing surface, elevation, or distance/slope).
4. Group grading objects so the surface can be regenerated and compared to existing.
5. Build a volume surface of FG vs EG to confirm the cut/fill balance.

## Related

- [Surface commands](surfaces.md)
- [Corridor commands](corridors.md)
- [Grading workflows](../../grading/index.md)
