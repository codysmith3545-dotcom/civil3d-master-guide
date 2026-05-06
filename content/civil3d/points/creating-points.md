---
title: "Creating Points"
section: "civil3d/points"
order: 40
visibility: public
tags: [points, create-points, cogo, manual, import, intersection, alignment]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [CreatePoints, POINTSIMPORT, CREATEPOINTGROUP]
updated: 2026-05-06
---

> **TL;DR**
> 1. The `CreatePoints` toolbar (Home tab > Create Ground Data > Points > Point Creation Tools) is the central hub for generating COGO points in the drawing. It groups methods by category: manual, intersection, alignment, surface, interpolation, import, and miscellaneous.
> 2. For bulk data from the field, use `POINTSIMPORT` (file-based) or the survey module (`IMPORTSURVEYDATA`). `CreatePoints` is for design-time point creation — placing proposed utility structures, calculating intersections, staking offsets, and similar tasks.
> 3. Before creating points, set the default description, starting point number, and elevation prompts in the toolbar's settings row. This avoids repetitive data entry.

## The CreatePoints toolbar

Run `CreatePoints` or go to Home tab > Create Ground Data panel > Points dropdown > Point Creation Tools. The toolbar docks at the top of the drawing window and has two sections:

- **Settings row** (top): default description, default elevation, next point number, prompt toggles.
- **Tool buttons** (bottom): organized by creation method.

### Settings row

| Setting | Purpose |
|---|---|
| Default Description | Pre-fills the description for every point created until changed. Set to the current feature code (e.g. `IP SET`) before placing a series of identical points. |
| Default Elevation | Pre-fills the elevation. Use `<none>` to create 2D points (Z = 0 or undefined). |
| Prompt For Descriptions | When on, Civil 3D asks for a description on each point. Turn off when batch-placing points with the same code. |
| Prompt For Elevations | When on, prompts for elevation. Turn off for 2D design points. |

## Creation methods

### Manual

- **Manual**: click a location in the drawing; enter point number, elevation, and description when prompted. The most basic method.
- **Geodetic Direction and Distance**: enter a latitude/longitude and a bearing/distance to compute a point. Requires a coordinate zone set in Drawing Settings.
- **Northing/Easting**: type coordinates directly at the command line.
- **Latitude/Longitude**: type geographic coordinates; Civil 3D converts to the drawing's coordinate system.

### Intersection

These methods solve for the intersection of two geometry elements and place a point there:

- **Direction/Direction**: two bearings from two known points; the intersection is the new point.
- **Distance/Distance**: two distances from two known points; yields two possible solutions (select one).
- **Direction/Distance**: a bearing from one point and a distance from another.
- **Direction/Perpendicular**: a bearing from one point perpendicular to a line through another.
- **Object/Object**: intersection of two AutoCAD entities (lines, arcs, polylines).

Intersection tools are heavily used in boundary retracement: given record bearings and distances from found monuments, compute the missing corner.

### Alignment-based

- **Station/Offset**: specify an alignment, a station, and an offset to place a point relative to the centerline. Useful for proposed structures along a road.
- **Automatic — at alignment geometry points**: places points at PCs, PTs, PIs, and other key stations along a selected alignment.
- **Measure alignment**: places points at regular station intervals along an alignment.

### Surface-based

- **On Surface**: pick a point on a surface and Civil 3D sets the elevation from the TIN model.
- **Polyline/Contour vertices**: places points at every vertex of a selected polyline, reading elevations from a surface if available.

### Interpolation

- **Interpolate by relative location**: divides a span between two known points and places intermediate points with interpolated elevations.
- **Interpolate by number of points**: creates N equally spaced points between two existing points.

### Import

The toolbar includes an import shortcut that launches `POINTSIMPORT`. This is functionally identical to right-clicking Points in Prospector > Create. See [Point import and export formats](import-export-formats.md).

### Miscellaneous

- **Resection**: computes the instrument position from angle observations to three or more known points.
- **Convert AutoCAD Points to COGO Points**: promotes plain AutoCAD POINT entities (from `PDMODE` rendering) into Civil 3D COGO points.
- **Convert SoftDesk Point Blocks**: legacy migration tool for old SoftDesk/LDD point blocks.

## Controlling point numbering

Point numbers are assigned sequentially from the "Next Point Number" value in the CreatePoints toolbar settings. To control numbering:

- Set `Next Point Number` before starting a placement session.
- Drawing Settings > Point > Point Identity > Next Automatic Point Number: the persistent default for new point creation.
- Duplicate policy (Drawing Settings > Point > Point Identity > If Point Number Already Exists): options are `Notify` (prompt), `Add to Point List`, `Use Next Available`, `Overwrite`, or `Merge`.

Establish a numbering convention early: for example, survey field points 1-9999, design points 10001+, staking points 20001+.

## Placing points with grips

After creation, COGO points can be moved with grips like any AutoCAD object. Grip-moving updates the point's coordinates. If the point is a member of a surface or used in an alignment, those objects update accordingly.

For precise repositioning, use the Properties palette (change Northing/Easting/Elevation) or `EditPoints` panorama.

## Bulk creation from polylines

A common workflow for design: draw a polyline representing a utility run or curb line, then create points at each vertex:

1. `CreatePoints` > Polyline/Contour vertices.
2. Select the polyline.
3. Civil 3D places a COGO point at each vertex with the elevation from the polyline's Z values (or from a surface if prompted).
4. Assign a description prefix so all points receive the correct code.

## Common gotchas

- **Points not appearing.** Check that the `_All Points` point group is not set to an empty style or that a higher-priority group is not hiding the new points. Also verify the point's elevation is not placing the marker far above or below the current view (switch to plan view).
- **Wrong coordinate system.** Creating a point by Latitude/Longitude when no coordinate zone is set produces a point at raw lat/lon values (e.g. Northing = 39.7, Easting = -86.1), not projected coordinates.
- **Description key not matching.** If the default description typed in the toolbar does not match any description key, the point gets the drawing's default style. Check spelling and wildcard patterns.
- **Undo behavior.** `UNDO` reverses the last point creation. Multiple undo steps remove points in reverse order. Points that were already added to a surface may leave a hole in the TIN after undo.
- **Prompt fatigue.** Leaving all prompts on when placing 50 catch basins means typing the same description 50 times. Turn off Prompt For Descriptions, set Default Description to `CB`, and click locations.

## Related

- [Point import and export formats](import-export-formats.md)
- [Description keys](description-keys.md)
- [Point groups](point-groups.md)
- [Point editing](point-editing.md)
- [Survey points vs COGO points](../survey/survey-points-vs-cogo-points.md)
