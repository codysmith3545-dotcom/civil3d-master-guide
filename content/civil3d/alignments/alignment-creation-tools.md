---
title: "Alignment Creation Tools"
section: "civil3d/alignments"
order: 15
visibility: public
tags: [alignment, creation, layout, polyline, best-fit]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEALIGNMENTLAYOUT, CREATEALIGNMENTFROMOBJECTS, BESTFITALIGNMENT]
updated: 2026-05-06
---

> **TL;DR**
> 1. Use `CREATEALIGNMENTLAYOUT` for new design alignments drawn from scratch. The Alignment Layout toolbar provides tangent-tangent (with curve), curve through point, and spiral-curve-spiral construction tools.
> 2. Use `CREATEALIGNMENTFROMOBJECTS` to convert an existing polyline, line, or arc into an alignment. Clean up the polyline first (JOIN, remove duplicate vertices, audit arcs).
> 3. Best-fit alignment (`BESTFITALIGNMENT`) creates an alignment statistically fit to a set of points, lines, or arcs. Useful for reconstructing a road centerline from survey data.

## CreateAlignmentLayout

`CREATEALIGNMENTLAYOUT` opens the Create Alignment dialog, then activates the Alignment Layout toolbar for interactive drawing.

### Dialog settings

- **Name**: follow a naming convention (e.g., `CL-MAIN ST`, `ALIGN-01`).
- **Type**: Centerline, Offset, Curb Return, Rail, or Miscellaneous. Type controls corridor behavior and default label set.
- **Site**: assign to a site for parcel interaction, or leave on `<None>` if the alignment does not need to interact with parcels.
- **Style**: controls plan display (color, linetype, arrow direction).
- **Label set**: controls station labels, geometry-point labels, etc.
- **Design criteria file**: links an XML design-criteria file for automatic radius and speed checks.
- **Start station**: set the alignment start station here rather than editing it after creation.

### Alignment Layout toolbar

Once the dialog is accepted, the Layout toolbar appears at the top of the screen (or floating). Key tools, left to right:

| Tool | What it does |
|---|---|
| **Tangent-Tangent (No Curves)** | Draws fixed tangent lines, click to click. No curves inserted between tangents. |
| **Tangent-Tangent (With Curves)** | Draws tangent lines and automatically inserts a free curve at each PI. Curve radius comes from the Curve and Spiral Settings on the toolbar. |
| **Curve on Two Lines** | Inserts a free curve between two existing tangent entities. |
| **Curve Through Point** | Creates a curve that passes through a specified point while staying tangent to an adjacent line. |
| **Spiral-Curve-Spiral** | Inserts a spiral-in, circular curve, and spiral-out between two tangents. Spiral lengths and curve radius come from Curve and Spiral Settings or are entered at the command line. |
| **Free Line/Curve/Spiral** | Draws a single free entity that will adjust to maintain tangency to neighbors. |
| **Float Line/Curve/Spiral** | Draws an entity that floats on one end. |
| **Fixed Line/Curve/Spiral** | Draws a fully constrained entity. Useful for tie-ins to existing geometry. |

### Curve and Spiral Settings

The wrench icon on the toolbar opens Curve and Spiral Settings:

- **Default radius**: applied to auto-inserted curves.
- **Spiral type**: clothoid (most common), Bloss, sinusoidal, etc.
- **Spiral in/out length**: default lengths for SCS (spiral-curve-spiral) insertion.
- **Erase existing entity**: whether picking an existing line replaces it or inserts adjacent to it.

## CreateAlignmentFromObjects

`CREATEALIGNMENTFROMOBJECTS` converts existing AutoCAD geometry (polylines, lines, arcs, or a combination) into a Civil 3D alignment.

1. Run the command.
2. Select the source objects. For a polyline, select the single polyline. For a series of lines and arcs, select all of them in order (or window-select and Civil 3D orders them by connectivity).
3. Pick a direction (the end that will be the start station).
4. Accept the creation dialog (same options as CreateAlignmentLayout).

The resulting alignment entities match the source geometry:

- Polyline straight segments become fixed lines.
- Polyline arcs become fixed curves.
- 3D polylines are projected to plan (Z is ignored for horizontal alignment).

See [Alignment from polyline](alignment-from-polyline.md) for preparation and best practices.

## Best-fit alignment

`BESTFITALIGNMENT` creates an alignment that statistically best fits a set of input entities or points.

### Input types

- **Points (COGO points or AutoCAD points)**: the alignment is fit to pass through or near the point cloud.
- **AutoCAD entities**: lines, arcs, polylines. The alignment fits to the geometry.

### Workflow

1. Run `BESTFITALIGNMENT`.
2. Select input data.
3. The Regression Analysis dialog appears showing the best-fit result with residuals.
4. Choose which entity types to include (tangent, curve, spiral).
5. Accept to create the alignment.

Best-fit is useful for:

- Reconstructing a road centerline from survey edge-of-pavement shots (average the two edges, or fit to centerline shots).
- Creating a design alignment that follows an existing path from aerial/LIDAR mapping.
- Fitting a sewer or utility alignment to as-built manhole locations.

## Choosing the right method

| Scenario | Recommended method |
|---|---|
| New road design from scratch | `CREATEALIGNMENTLAYOUT` |
| Converting a preliminary polyline sketch | `CREATEALIGNMENTFROMOBJECTS` |
| Existing road from survey data | `BESTFITALIGNMENT` from survey points or `CREATEALIGNMENTFROMOBJECTS` from a traced polyline |
| Matching a PDF or scanned plan | Trace a polyline over the reference, then `CREATEALIGNMENTFROMOBJECTS` |

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Alignment from polyline](alignment-from-polyline.md)
- [Design criteria and check sets](design-criteria.md)
- [Editing alignments](editing-alignments.md)
