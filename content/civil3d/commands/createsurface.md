---
title: "CreateSurface"
section: "civil3d/commands"
order: 210
visibility: public
command: CreateSurface
category: surfaces
ribbon: "Home tab > Create Ground Data panel > Surfaces (split button) > Create Surface"
shortcut: "CS (default in aeccland.pgp — verify in current release)"
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [AddBreaklines, AddSurfaceBoundary, RebuildSurface, CreateVolumeSurface]
symptoms:
  - "How do I start a new TIN surface from scratch?"
  - "What's the difference between a TIN, grid, TIN volume, and grid volume surface?"
  - "How do I name a surface so data shortcuts find it?"
  - "How do I pick a style that shows triangles for QA but contours for plot?"
  - "Why are my new contours invisible?"
tags: [surfaces, tin, create-surface, surface-style]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Creating Surfaces"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-EFC2D478-DF14-4F5F-AC89-4ABE6F86A9FF
    verified: 2026-05-06
---

> **TL;DR**
> 1. Creates an empty surface object of the chosen type (TIN, Grid, TIN Volume, Grid Volume) and registers it in Prospector.
> 2. The dialog only sets identity, style, render material, and base layer — definition data is added afterwards.
> 3. Pick the surface style first by intent (QA-triangles vs plot-contours); style is the easiest knob to flip later.

## When to use

At the start of any surface workflow — existing ground from points or DEM, design surface from grading or corridors, or a volume surface to compare two TINs.

## Workflow

1. From the Home ribbon, expand the Surfaces split button → **Create Surface**.
2. Pick **Type** (usually `TIN surface` for ground data; `TIN volume surface` to subtract two TINs).
3. Set **Name** with a clear convention (e.g., `EG`, `FG-Road`, `Vol-FG-EG`).
4. Choose **Style** — for build-time QA, pick a triangle/border style; switch to a contour style for sheets.
5. Pick the layer (your template should pre-fill `C-TOPO-EG` or similar).
6. Click **OK**. The surface appears in Prospector with an empty Definition tree.
7. Add data: points, breaklines, boundary, drawing objects, DEM, contour data.
8. Inspect under Surface Properties → Statistics that the bounding extents and triangle count match expectations.

## Common gotchas

- A surface with no data still exists in Prospector. Empty surfaces published as data shortcuts will reference fine but draw nothing.
- TIN volume surfaces cannot be edited like a TIN — their geometry is recomputed from base + comparison whenever either parent rebuilds.
- The default surface style draws contours; if your contour interval is larger than your terrain relief, you will see no contour lines. Switch to a style that includes the surface border to confirm the surface exists.
- Once created, the surface type cannot be changed (TIN to Grid or vice versa). Recreate if you picked wrong.

## Related commands

- [AddBreaklines](addbreaklines.md)
- [AddSurfaceBoundary](addsurfaceboundary.md)
- [RebuildSurface](rebuildsurface.md)
- [CreateVolumeSurface](createvolumesurface.md)
