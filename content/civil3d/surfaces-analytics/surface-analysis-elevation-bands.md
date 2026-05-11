---
title: "Surface Analysis: Elevation Bands"
section: "civil3d/surfaces-analytics"
order: 10
visibility: public
tags: [surface, analysis, elevation, band, hypsometric, range, legend]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [SURFACEPROPERTIES, ADDSURFACEANALYSIS, CREATESURFACELEGENDTABLE]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - To Create an Elevation Surface Analysis"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7C84E3A1-DC9A-4F37-9AE1-1B8F5C8E2EB6"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - About Surface Analyses"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-9F02B9D6-89B8-43B3-928D-3E0F1D0E1FB2"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Elevation bands colour a TIN by user-defined elevation ranges; the surface style controls whether bands draw on plan, 3D, or both.
> 2. Range definition can be by equal intervals, by quantile (equal number of triangles), or by manually set break elevations.
> 3. Add a legend table to caption the analysis on the sheet; the table updates automatically when ranges change.

## Setting up the analysis

UI path: select surface > right-click > Surface Properties (`SURFACEPROPERTIES`) > **Analysis** tab.

1. Set **Analysis type** to `Elevations`.
2. Set **Number of ranges** (e.g., 7).
3. Click the down arrow in the Ranges panel to compute ranges. Civil 3D offers:
   - **Equal interval** - bands of equal height.
   - **Quantile** - bands of equal triangle count.
   - **Standard deviation** - bands sized by spread around the mean.
4. Edit individual range break elevations in the table if needed.
5. Apply an analysis scheme that maps ranges to colours, or set colours one by one.
6. Switch to the **Information** tab and choose a surface style whose **Display** tab has `Elevations` turned on for the views you want (Plan, Model, Section).

## Range computation methods

| Method | Best for |
|---|---|
| Equal interval | General hypsometric maps; easy to read |
| Quantile | Highlighting features when the elevation distribution is skewed |
| Standard deviation | Detecting outliers relative to the mean |
| Manual | Project-specified contour groups, flood elevation breaks |

For floodplain or grading-plan work, manual ranges that match the design contour band are most useful (e.g., 700 to 705 ft, 705 to 710 ft).

## Surface style

The analysis only renders if the surface style enables elevations:

UI path: Toolspace > Settings tab > Surface > Surface Styles > pick the style > edit > **Display** tab.

- Turn on `Elevations` for Plan View Direction (or 3D View Direction) to see the bands.
- Set the layer for the analysis component (often `C-TOPO-ANAL-ELEV`).

If the surface style draws `Border`, `Major Contour`, and `Minor Contour` but not `Elevations`, the analysis runs internally but never displays.

## Legend tables

UI path: Annotate tab > Labels & Tables panel > Add Tables drop-down > Surface > **Add Legend Table**.

1. Pick the surface, then `Elevations` as the analysis type.
2. The legend lists each range with its colour, min/max elevation, and area (if enabled in the table style).
3. The legend is dynamic - rerunning the analysis updates the table.

## Common errors

- Analysis added but no bands visible: surface style does not enable `Elevations` for the active view direction. Edit the style.
- `Cannot create analysis - surface is empty`: the surface has no triangles. Build the surface from data before analyzing.
- Legend rows blank: the analysis was set up but never run. Reopen Surface Properties > Analysis tab and click the **Run analysis** arrow.
- Bands flicker or hide contours: turn off contour display in the style for the same view direction, or set band transparency so contours are visible on top.

## Related

- [Surface analysis: slope and aspect](surface-analysis-slope-and-aspect.md)
- [Volume surfaces and comparison](volume-surfaces-and-comparison.md)
- [Foundational surface analysis](../surfaces/surface-analysis.md)
