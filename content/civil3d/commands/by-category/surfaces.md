---
title: "Surface commands"
section: "civil3d/commands/by-category"
order: 30
visibility: public
tags: [commands, surfaces, tin, breaklines, boundaries, volume-surface]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D surfaces are TINs (or grids) built from a definition of points, breaklines, boundaries, contours, edits, and DEM data.
> 2. The order of operations in the Definition tree controls the result. Add point data first, then breaklines, then boundaries.
> 3. Volume surfaces are a special TIN that subtracts a base from a comparison surface; rebuild them when either parent changes.

## Commands in this category

- `CreateSurface` — see [createsurface.md](../createsurface.md)
- `AddBreaklines` — see [addbreaklines.md](../addbreaklines.md)
- `AddSurfaceBoundary` — see [addsurfaceboundary.md](../addsurfaceboundary.md)
- `RebuildSurface` — see [rebuildsurface.md](../rebuildsurface.md)
- `ComputeVolumes` — see [computevolumes.md](../computevolumes.md)
- `CreateVolumeSurface` — see [createvolumesurface.md](../createvolumesurface.md)
- `AddPointsToSurface` — add COGO points to surface definition.
- `AddDEMFile` — add USGS or other DEM grid as surface data.
- `AddContourData` — add 2D polylines tagged as contour data.
- `EditSurfaceStyle` — change display: contours/triangles/elevation banding.
- `SurfaceProperties` — definition tree, statistics, build settings.
- `ExtractObjectsFromSurface` — pull contours, borders, and major/minor contour polylines into the drawing.
- `WaterDrop` — trace a flow path on the TIN.
- `AnalyzeSurface` — slope, slope arrow, watershed, contour, and elevation analyses.

## Typical workflow

1. `CreateSurface` and pick a TIN style.
2. Add data: points or point groups, then breaklines, then a boundary.
3. `RebuildSurface` after each large change.
4. Inspect under Surface Properties → Statistics for the bounding extents and triangle counts.
5. Build a volume surface against the design surface for earthwork.

## Related

- [Surfaces section](../../surfaces/index.md)
- [Point commands](points.md)
- [Grading commands](grading.md)
