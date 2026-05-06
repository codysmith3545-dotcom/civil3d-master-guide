---
title: "Surface Analysis"
section: "civil3d/surfaces"
order: 25
visibility: public
tags: [surfaces, analysis, slope, elevation-banding, watershed, direction-arrows]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [ANALYZESURFACE, CREATESURFACE, EDITSURFACESTYLE]
updated: 2026-05-06
---

> **TL;DR**
> 1. Surface analysis in Civil 3D is driven by **surface styles**: enable the Slope Arrows, Elevation Banding, Slope Banding, Watershed, or Direction Arrows display components and configure their ranges in the Analysis tab of the style.
> 2. Run `ANALYZESURFACE` (or right-click the surface in Prospector > Analyze) to generate **watershed** delineation and **direction arrows**. Slope and elevation banding render automatically once the style ranges are defined.
> 3. Define analysis ranges manually or use "Create Ranges by Number/Equal Interval" to subdivide automatically. Export the legend table to a layout for production sheets.

## Slope analysis

Slope analysis colors every triangle face by its gradient. Two display modes exist in surface styles:

- **Slope Arrows** — draws a colored arrow on each triangle pointing downhill, colored by a slope range table.
- **Slope Banding** — fills each triangle face with a solid color from the range table, producing a heat-map effect.

### Setting up ranges

1. Surface Properties > Analysis tab > Slopes (or Slope Arrows).
2. Click the "Create Ranges" icon. Choose the number of ranges (5 to 8 is typical for civil site work).
3. Civil 3D divides the surface's min–max slope into equal intervals. Adjust breakpoints to match design criteria, for example:
   - 0 %–2 % (flat — potential drainage issue)
   - 2 %–5 % (gentle — ADA-compliant pedestrian range)
   - 5 %–10 % (moderate — mowable)
   - 10 %–25 % (steep — erosion concern)
   - 25 %–50 % (very steep — structural stabilization likely)
   - > 50 % (extreme)
4. Assign colors per range. Use a sequential ramp: greens for flat, yellows for moderate, reds for steep.
5. Switch the surface style to display Slope Banding or Slope Arrows (Display tab > Plan view > set the component to visible).

### Slope direction

Slopes can be reported as **percent**, **degrees**, or **ratio** (horizontal:vertical). The Analysis tab's "Slope" type selector controls which unit the range table uses. Most civil grading work uses percent; geotechnical reports often use degrees.

## Elevation banding

Elevation banding colors the surface by elevation ranges. Workflow mirrors slope analysis:

1. Analysis tab > Elevations > Create Ranges.
2. Set interval (e.g. 2 ft bands for a flat site, 10 ft bands for hilly terrain).
3. Assign a color ramp. A terrain-style blue-green-brown-white hypsometric scheme is conventional.
4. Enable the Elevation Banding component in the style's Display tab.

Elevation banding is useful for quick identification of high/low points, grading check (does the proposed surface drain?), and public-facing exhibit coloring.

## Watershed analysis

Watershed analysis identifies drainage basins on the surface: regions where all surface water flows to a common pour point or boundary exit.

1. Right-click the surface > Analyze > Watersheds, or run `ANALYZESURFACE` and select the Watersheds type.
2. Civil 3D delineates basin boundaries and classifies them:
   - **Boundary Point** — water exits at the surface boundary.
   - **Boundary Segment** — water exits along a boundary edge.
   - **Depression** — water collects in an interior low point (potential pond or inlet location).
   - **Flat Area** — cannot resolve flow direction.
   - **Multi-Drain** — water exits at multiple pour points.
   - **Multi-Drain Notch** — a saddle between two drain paths.
3. Display watershed regions via the Watersheds component in the surface style. Each classification type can be assigned a separate color.
4. Use the Watershed legend table in layouts to list each basin's area and drain-point coordinates.

Watershed analysis depends on correct triangulation. Flat triangles (common with contour-only surfaces) produce large Flat Area classifications. Run `Minimize Flat Areas` before analyzing.

## Direction arrows

Direction arrows show flow direction across every triangle face. They are simpler than watershed analysis — just an arrow per facet pointing in the steepest-descent direction.

1. In the surface style, enable **Directions** on the Display tab.
2. Arrow density is one per triangle, so a high-vertex surface produces dense arrows. Consider simplifying the surface or zooming in for readability.

Direction arrows are a quick visual QA check for grading: arrows should point toward inlets and away from buildings.

## Legend tables

Each analysis type can produce a legend table for insertion into a layout:

1. Annotate ribbon > Add Tables > Add Surface Legend Table.
2. Select the surface and the analysis type (Elevations, Slopes, Slope Arrows, Watersheds, Contours, User-Defined Contours).
3. Pick an insertion point. The table lists each range with its color swatch, value range, and (for watersheds) area.
4. The table is dynamic; it updates when the surface or style changes.

## Performance notes

- Elevation and slope banding render quickly because they reuse existing triangle data.
- Watershed analysis is computationally expensive on large surfaces (millions of points). Run it on a cropped or pasted sub-surface when possible.
- Direction arrows at full density on a dense LIDAR TIN can slow viewport performance. Use a simplified copy for display.

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Troubleshooting surfaces](troubleshooting-surfaces.md)
- [Surface labels and contours](surface-labels-and-contours.md)
