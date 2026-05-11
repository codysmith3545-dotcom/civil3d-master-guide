---
title: "Volume Surfaces and Comparison"
section: "civil3d/surfaces-analytics"
order: 30
visibility: public
tags: [volume-surface, comparison, cut-fill, earthwork, base-surface, composite]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEVOLUMESURFACE, COMPUTEVOLUMES, ADDSURFACEANALYSIS]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Volume Surfaces"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-A9F0F12F-7A91-46B0-B0FE-3F3F4B62BD83"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Create a TIN Volume Surface"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-04C26A05-1B7A-4F6E-9C2F-B92F1E2EE9B9"
    verified: 2026-05-11
---

> **TL;DR**
> 1. A volume surface is a separate surface object whose elevation at any point equals comparison minus base; positive values are fill, negative values are cut.
> 2. Build with `CREATEVOLUMESURFACE` and pick a base (existing ground) and a comparison (proposed). The surface lives in Prospector under **Surfaces** like any other TIN.
> 3. Stage volume surfaces: subgrade, finished grade, and intermediate phases each get their own surface for accurate phase-by-phase quantities.

## Creating a TIN volume surface

UI path: Home tab > Create Ground Data panel > Surfaces drop-down > **Create Surface** (`CREATEVOLUMESURFACE`).

1. In the Create Surface dialog, set **Type** to `TIN volume surface`.
2. Name the surface (e.g., `EG-FG-Volume`).
3. Set a style and layer.
4. Pick a **Base surface** (typically existing ground).
5. Pick a **Comparison surface** (typically proposed/finished grade).
6. Click OK. The volume surface generates from the union of the two TINs.

Volumes are reported in the volume surface's properties:

- Right-click the volume surface > Surface Properties > **Statistics** tab > Volume sub-tab.
- **Cut volume**, **Fill volume**, and **Net volume** display.
- Units follow the drawing settings (cubic yards or cubic meters).

## Grid volume vs TIN volume

| Volume type | When to use |
|---|---|
| TIN volume | Default. Accurate. Slower on very large surfaces. |
| Grid volume | Large surfaces (multi-square-mile DEMs) or quick checks. User sets X/Y grid spacing. |

UI path is the same; choose `Grid volume surface` instead of `TIN volume surface`. Grid spacing trades accuracy for speed; use a spacing that respects the smallest feature you care about (e.g., 5 ft for site grading).

## Composite volumes vs volume dashboards

Two ways to report cut/fill in Civil 3D:

- **Volume surface property**: gives one total per volume surface. Best for quick checks.
- **Volumes Dashboard**: Analyze tab > Volumes and Materials panel > **Volumes Dashboard**. Creates a panorama listing every volume surface, its bounded volume, and any associated boundary. Supports adding bounded volumes - report only the volume inside a polyline boundary (e.g., a phase line or a parcel).

`COMPUTEVOLUMES` runs a quick two-surface comparison without creating a volume surface object. Useful for one-time checks, but the result is not persisted.

## Visualizing cut and fill

Add an **elevations analysis** to the volume surface:

1. Surface Properties > Analysis tab > Analysis type `Elevations`.
2. Set negative ranges (cut) in one colour ramp and positive ranges (fill) in another.
3. Use a manual range break at 0.0 ft to separate cut from fill.

The result is a cut/fill heatmap that reads at a glance on the plan sheet.

## Staging - subgrade, intermediate, finished

For large earthwork projects, create separate volume surfaces for each design layer:

- `EG-Subgrade-Volume` = subgrade minus existing.
- `Subgrade-FG-Volume` = finished minus subgrade.
- `EG-FG-Volume` = finished minus existing (total).

The three volumes typically reconcile to the total. Differences usually indicate a clipping boundary mismatch.

## Common errors

- `Cannot create TIN volume surface - input surfaces overlap differently`: the two source TINs do not overlap. Verify the base and comparison both cover the same area; trim or extend one as needed.
- `Volume reported is enormous and unrealistic`: one of the source surfaces has a stray high or low point. Sort triangles in Surface Properties > Statistics > Extended; investigate outliers.
- `Net volume is zero but cut and fill are large`: the surfaces are nearly mirror images; this can be correct (balanced earthwork) or it can mean the base/comparison were swapped. Verify the design intent.
- `Volume surface rebuilds slowly`: very dense source TINs. Simplify or weed the inputs (see [Surface simplification and paste](surface-simplification-and-paste.md)).

## Related

- [Surface simplification and paste operations](surface-simplification-and-paste.md)
- [Foundational volume calculations](../surfaces/volume-calculations.md)
- Commands: [CREATEVOLUMESURFACE](../commands/createvolumesurface.md), [COMPUTEVOLUMES](../commands/computevolumes.md)
