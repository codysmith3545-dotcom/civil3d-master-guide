---
title: "Feature Line Editing"
section: "civil3d/grading"
order: 15
visibility: public
tags: [feature-line, elevation-editing, grade, slope, quick-elevation-editor]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [EditFeatureLineElevations, SetGradeSlopeBetweenPoints, InsertElevationPoint, RaiseLowerFeatureLine, QuickElevationEditor, JoinFeatureLines, FillettFeatureLines]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Edit Feature Line Elevations
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7B8C9D0E-1F2A-3B4C-5D6E-7F8A9B0C1D2E
    verified: 2026-05-06
---

> **TL;DR**
> 1. The `EditFeatureLineElevations` toolbar provides tools for setting grade/slope between points, inserting/deleting elevation points, and raising/lowering the entire feature line or individual segments.
> 2. The **Quick Elevation Editor** (panorama view) lets you edit every vertex elevation numerically in a table — faster than clicking through each point when you have many vertices.
> 3. Geometry editing tools — join, fillet, trim, extend, and weed — modify the plan shape without leaving the feature line object type.

## Elevation editing tools

Select a feature line, then access the elevation editor via: right-click > Edit Elevations, or ribbon: Modify > Edit Elevations > Edit Elevations. The Feature Line Elevation Editor toolbar appears with these tools:

### Set Grade/Slope Between Points

Sets a constant grade (percent) or slope (rise:run) between two selected vertices on the feature line.

1. Click the start vertex.
2. Click the end vertex.
3. Enter the grade as a percentage (e.g., `2.0` for 2%) or as a slope ratio.
4. Civil 3D adjusts all intermediate vertices between the two points to follow that grade linearly.

This is the most-used tool. Typical workflow: set the start and end elevations of a segment (from design data), then apply the grade to interpolate intermediate points.

### Insert Elevation Point

Adds a new vertex at a specified location along the feature line with a specified elevation. Use this when you need a control point mid-segment — for example, a high point on a ridge or a low point in a swale.

Click a location on the feature line and enter the elevation, or accept the interpolated elevation.

### Delete Elevation Point

Removes a vertex from the feature line. The segment spans the gap, interpolating elevation between the remaining adjacent vertices.

### Raise/Lower

Applies a uniform elevation change to the entire feature line or a selected range of vertices.

- **Raise/Lower Entire Feature Line** — shifts every vertex up or down by a specified amount (e.g., raise 0.50 ft to account for subgrade thickness).
- **Raise/Lower Selected Points** — after entering the tool, pick individual vertices and enter a delta elevation.

### Set Elevation by Reference

Sets a vertex elevation relative to a reference object:

- **Surface** — drapes the vertex onto a surface (useful for resetting to existing ground).
- **Another feature line** — sets the vertex at a specified offset elevation from another feature line at the same station.
- **Manual entry** — type an absolute elevation.

### Flatten Grade/Elevations

Two sub-tools:

- **Set Elevations from Surface** — resets all vertices to the reference surface elevation (bulk re-drape).
- **Set Grades** — sets all segments to a single specified grade.

## Quick Elevation Editor

Command: `QuickElevationEditor` (ribbon: select feature line > Modify > Edit Elevations > Quick Elevation Editor).

Opens a panorama (tabular) view listing every vertex with:

| Column | Content |
|---|---|
| Station | Distance along the feature line from the start |
| Elevation | Current vertex elevation (editable) |
| Grade In | Grade of the segment arriving at this vertex |
| Grade Out | Grade of the segment leaving this vertex |
| Length | Segment length to next vertex |

Edit elevations directly in the table. Changes take effect when you close the panorama or click Apply. This is significantly faster than the graphical tools when you have a feature line with many vertices and known design elevations.

## Geometry editing tools

These tools modify the plan-view shape of a feature line without converting it to another object type.

### Join Feature Lines

Command: `JoinFeatureLines` (ribbon: Modify > Edit Geometry > Join).

Combines two feature lines into one continuous feature line. The endpoints must be coincident (or within a specified tolerance). Elevations at the joined point are averaged or taken from one of the two lines (prompted).

### Fillet

Inserts an arc of a specified radius at a PI point (sharp corner) on the feature line. Useful for rounding curb returns or swale transitions.

### Trim and Extend

Standard AutoCAD-style trim and extend, but operating on feature lines. Elevations at new endpoints are interpolated from the existing feature line grades.

### Weed

Removes redundant vertices that fall within a specified distance and angle tolerance of the line between their neighbors. Simplifies feature lines converted from dense survey data or corridor extraction without significantly changing the geometry.

### Stepped Offset

Creates a parallel copy of the feature line at a horizontal offset and a vertical offset. For example, offset a top-of-curb feature line 6 in. horizontally and -6 in. vertically to create a gutter feature line.

## Grip editing

Feature line vertices display as grips in plan and profile views:

- **Plan view grips** — drag horizontally to move the vertex in plan. Elevation is preserved unless snapping to a surface is enabled.
- **Elevation grips** — in a profile view or section view that displays the feature line, drag vertically to change the elevation.
- **Mid-segment grip** — adds a new vertex at the grip location when dragged.

Hold Ctrl while dragging to constrain movement to vertical (elevation change only) or horizontal (plan change only), depending on the view.

## Common workflows

### Pad grading

1. Draw a feature line around the building pad perimeter.
2. Set all vertices to the pad elevation (e.g., 836.00 ft) using Raise/Lower or Quick Elevation Editor.
3. Use Set Grade/Slope Between Points to slope segments toward drainage points (e.g., 2% toward the street).

### Swale design

1. Draw a feature line along the swale centerline.
2. Set the upstream and downstream elevations from the design data.
3. Apply a constant grade between them.
4. Insert elevation points at culvert crossings or grade breaks.

### Matching existing conditions

1. Create a feature line from a survey figure or 3D polyline.
2. Weed unnecessary vertices.
3. Use Set Elevation by Reference > Surface to drape it onto the existing-ground surface.

## Related

- [Feature lines](feature-lines.md)
- [Grading objects](grading-objects.md)
- [Grading groups](grading-groups.md)
- [Troubleshooting grading](troubleshooting-grading.md)
