---
title: "Feature Line Elevation Editing"
section: "civil3d/grading"
order: 12
visibility: public
tags: [feature-line, grading, elevation, elevation-editor, mid-ordinate, smooth]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [EditFeatureLineElevations, InsertElevationPoint, DeleteElevationPoint, RaiseLowerFeatureLine, SmoothFeatureLine, GradeExtension]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Editing Feature Line Elevations
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-FB12BAEB-09FB-4C75-9E5B-7F23E55F3FAB
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Elevation Editor
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-CA98C8DC-6D67-4E4F-9F3D-8D5C5F1C6F02
    verified: 2026-05-11
---

> **TL;DR**
> 1. The **Elevation Editor** (Panorama) is the workbench for vertex-by-vertex elevation, grade, and slope editing of a feature line; open from the **Modify > Edit Geometry** panel after selecting a feature line.
> 2. **Elevation points** add elevation control between geometry vertices without splitting the segment; **PI (geometry) points** are the line/curve vertices and define horizontal geometry.
> 3. Use **Insert Elevation Point**, **Set Grade/Slope between points**, **Raise/Lower**, and **Smooth** to build a continuous design profile; verify with the elevation editor and the feature line's quick-profile view.

## Anatomy of a feature line

A feature line is a 3D polyline-like object that lives in a site (or is "from corridor"). Two kinds of vertices exist:

- **PIs (geometry points)**: define horizontal geometry; carry both station and elevation.
- **Elevation points**: insert elevation control between PIs without changing the horizontal geometry.

Both appear as rows in the Elevation Editor with station, elevation, length, and grade columns.

## Opening the Elevation Editor

1. Select the feature line.
2. Ribbon contextual tab **Feature Line > Modify > Edit Elevations > Elevation Editor** (command: `EditFeatureLineElevations`).
3. Panorama opens with all PIs and elevation points listed.

The toolbar across the top of the Elevation Editor exposes most edits: insert elevation point, delete elevation point, raise/lower incremental, set elevation by reference, set grade/slope between points, flatten, and quick elevation profile.

## Common edits

### Insert an elevation point
- Toolbar: **Insert Elevation Point** (command: `InsertElevationPoint`).
- Pick the location along the feature line (often via **Endpoint**, **Nearest**, or **Insert at distance**).
- Enter the new elevation. The grades on either side recompute automatically.

### Delete elevation points
- Select rows in Panorama and click **Delete Elevation Point**, or use `DeleteElevationPoint` and pick along the feature line. PIs cannot be removed this way (use `EditCurbReturn` or feature-line geometry edits).

### Raise/Lower
- Toolbar: **Raise/Lower Incrementally** (command: `RaiseLowerFeatureLine`).
- Enter a positive (raise) or negative (lower) increment to shift selected rows or the entire feature line by a constant amount. Useful for matching a curb reveal change.

### Set elevation by reference
- Toolbar: **Set Elevation by Reference**. Pick a reference point (any AutoCAD point, COGO point, or feature-line vertex), enter offset/grade, and Civil 3D writes the new elevation. This is the standard way to tie a pad corner to a target.

### Set grade or slope between points
- Toolbar: **Set Grade/Slope Between Points**. Pick the start row, enter a grade (% or ratio), and pick the end row. All elevation points in between are recomputed by linear interpolation along the grade.

### Smooth (mid-ordinate)
- Command: `SmoothFeatureLine`.
- Select the feature line, then specify the **mid-ordinate distance**, which is the maximum offset the smoothed curve may take from the chord between vertices. Civil 3D inserts elevation points along an interpolated parabola to remove sharp grade breaks. Smaller mid-ordinate values produce a tighter fit; larger values produce a smoother curve with fewer added points.

### Flatten
- Toolbar: **Flatten Elevations**. Sets a constant or linear elevation across the selected rows. Use this to reset a feature line before redesigning it.

### Quick elevation profile
- Toolbar: **Quick Elevation Edit** opens a temporary profile-style view of the feature line's elevations. Useful for spotting reversed grades or kinks before publishing.

## Common errors

- **"Selected object is not a feature line"** — the command works only on feature lines (not 3D polylines). Convert with `CreateFeatureLinesFromObjects` first.
- **Grades flip sign unexpectedly** — usually an elevation point was inserted on the wrong side of a PI; check station order in Panorama.
- **Smooth produces too many vertices** — increase the mid-ordinate value, or smooth a copy and compare.
- **Elevation Editor is empty** — the feature line is in a different site than the active drawing context, or a Reference feature line; open the source.
- **Cannot delete a vertex** — it's a PI (geometry vertex), not an elevation point. Use **Delete PI** on the Edit Geometry panel.

## Related

- [Feature line editing (overview)](feature-line-editing.md)
- [Grading from feature lines](grading-from-feature-lines.md)
- [Grading criteria sets](grading-criteria-sets.md)
- [Grading troubleshooting](grading-troubleshooting.md)
