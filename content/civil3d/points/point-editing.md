---
title: "Point Editing"
section: "civil3d/points"
order: 45
visibility: public
tags: [points, edit-points, datum, transform-points, renumber, elevation-adjustment]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [EditPoints, DATUM, TransformPoints, RENUMBERPOINTS, POINTELEVATIONADJUSTMENT]
updated: 2026-05-06
---

> **TL;DR**
> 1. The `EditPoints` panorama (Prospector > Points > right-click > Edit Points) opens a spreadsheet view of all COGO points where you can change point number, northing, easting, elevation, raw description, and full description in bulk.
> 2. `TransformPoints` applies translate, rotate, and/or scale transformations to selected points — essential when importing data in a local coordinate system that must be shifted to state plane.
> 3. `DATUM` adds or subtracts a constant elevation value from selected points. Use it to apply a geoid separation or correct a systematic vertical offset.

## The EditPoints panorama

`EditPoints` (or Prospector > Points > right-click > Edit Points) opens a tabular view of every COGO point in the drawing. Columns include:

| Column | Editable | Notes |
|---|---|---|
| Point Number | Yes | Changing a number that already exists triggers the duplicate-point policy |
| Easting (X) | Yes | Model-space X coordinate |
| Northing (Y) | Yes | Model-space Y coordinate |
| Point Elevation | Yes | Z coordinate |
| Raw Description | Yes | Original field code; editing re-triggers description-key matching if enabled |
| Full Description | Yes | Processed description; manual edits here do not re-trigger keys |
| Point Style | Yes | Dropdown; override at the object level |
| Point Label Style | Yes | Dropdown; override at the object level |

### Sorting and filtering

Click a column header to sort. Right-click the column header for filter options (e.g. show only points with elevation > 750). The panorama is a standard Civil 3D vista — it supports column reordering and persistent display states.

### Bulk editing

Select multiple rows (Shift+click or Ctrl+click), then edit a cell in one row. A dialog asks whether to apply the change to all selected rows. This is the fastest way to change the description of 200 points from `GND` to `GROUND` without a LISP routine.

## DATUM — elevation shift

`DATUM` adds a constant value to the elevation of selected points. Usage:

1. Run `DATUM`.
2. Select points (or type `All` for every point in the drawing).
3. Enter the elevation change (positive = raise, negative = lower).

Common applications:

- **Geoid separation**: GPS elevations are ellipsoidal. If the geoid height is -32.45 ft in the project area, apply `DATUM` with the appropriate offset to convert to orthometric (NAVD 88). Note: this is a rough method; for precise work, apply geoid corrections in the GPS processing software before import.
- **Benchmark correction**: the field crew used a bench elevation of 100.00 for relative work. The published bench is 783.52. Apply a datum of +683.52.
- **Subsidence or seasonal adjustment**: a systematic vertical shift based on new control.

## TransformPoints

`TransformPoints` applies a 2D similarity transformation (translate, rotate, scale) to selected points. The workflow:

1. Run `TransformPoints`.
2. Select points.
3. Choose base point (in current coordinates) and destination point (in target coordinates), or enter translation deltas, rotation angle, and scale factor directly.

Use cases:

- **Local to state plane.** A local-coordinate field file (origin at 5000, 5000) must be shifted to state plane. Define two pairs of known points (local and published coordinates) and let TransformPoints compute the best-fit transformation.
- **Rotate a site.** Import coordinates are rotated relative to project north. TransformPoints applies a rotation about a base point.
- **Scale correction.** A rare case: data collected in ground coordinates must be scaled to grid. Apply the combined scale factor for the project area.

TransformPoints modifies coordinates in place. It does not create new points. `UNDO` reverses the operation.

## Renumbering points

`RENUMBERPOINTS` changes point numbers in bulk. Options:

- **Additive renumber**: add a constant to all selected point numbers (e.g. add 10000 to shift the 1-999 range to 10001-10999).
- **Sequential renumber**: assign a new starting number and increment (e.g. start at 1, increment by 1, renumbering 50 points as 1-50).
- **Swap**: exchange two point numbers.

Renumbering updates all references: point group queries by number, label expressions that display `{Point Number}`, and data shortcuts if applicable. It does not update external files (staking files, reports) — re-export those after renumbering.

## Elevation adjustments

Beyond `DATUM`, Civil 3D offers `POINTELEVATIONADJUSTMENT` for proportional (weighted) vertical correction:

1. Select a range of points along a traverse or level run.
2. Specify the known elevations at the start and end of the run.
3. Civil 3D distributes the vertical misclosure proportionally across the intermediate points based on distance from the start.

This is a simple single-run vertical adjustment. For complex vertical networks, use the survey module's least-squares adjustment.

## Editing descriptions

Changing a point's Raw Description in the EditPoints panorama re-triggers description-key matching (if "Match on description change" is enabled in the drawing settings). This means changing a raw description from `MH-S` to `CB` instantly reassigns the point style, label style, and layer to whatever the description key set defines for `CB*`.

If you edit the Full Description instead, the description key does not re-evaluate. The full description becomes a manual override disconnected from the key set.

## Undoing edits

Most point-editing commands support standard `UNDO`. However:

- Edits made in the EditPoints panorama are committed cell by cell. Each cell change is one undo step. Bulk edits (multiple rows) count as one step.
- `TransformPoints` is a single undo step for all affected points.
- `DATUM` is a single undo step.

For safety on major transformations, save the drawing before running the command.

## Common gotchas

- **Editing survey points.** If the point originated from the survey database, editing its coordinates in the drawing breaks the database link. The database still holds the original coordinates; on next reprocess, the database version wins. To permanently change a survey point, edit the observation in the database and reprocess.
- **Renumber conflicts.** Renumbering point 100 to 200 when point 200 already exists triggers the duplicate-point policy. If set to "Overwrite," the original point 200 is destroyed. Set the policy to "Notify" before bulk renumbering.
- **TransformPoints on surfaces.** If the transformed points are members of a surface, the surface rebuilds with the new coordinates. If the surface was built from a point group query, the rebuild is automatic. If the surface used explicit "Add Points" operations, verify the rebuild manually.
- **Full description drift.** Over time, manual edits to full descriptions create drift from the description-key-generated values. Audit periodically by running `APPLYDESCRIPTIONKEYS` and comparing before/after.
- **Locked points.** Points can be locked (right-click > Lock). Locked points cannot be moved, renumbered, or have their coordinates edited. Unlock before editing.

## Related

- [Creating points](creating-points.md)
- [Point groups](point-groups.md)
- [Point import and export formats](import-export-formats.md)
- [Description keys](description-keys.md)
- [Survey points vs COGO points](../survey/survey-points-vs-cogo-points.md)
