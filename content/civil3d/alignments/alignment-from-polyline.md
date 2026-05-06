---
title: "Alignment from Polyline"
section: "civil3d/alignments"
order: 45
visibility: public
tags: [alignment, polyline, conversion, tangency, createalignmentfromobjects]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEALIGNMENTFROMOBJECTS, PEDIT, JOIN, OVERKILL]
updated: 2026-05-06
---

> **TL;DR**
> 1. `CREATEALIGNMENTFROMOBJECTS` converts a polyline into a Civil 3D alignment. Prepare the polyline first: join segments, remove duplicate vertices, audit arc tangency, and ensure continuous connectivity.
> 2. Polyline arcs become fixed curves in the alignment. If arcs are not tangent to adjacent segments, the alignment may show non-tangent warnings. Fix the polyline geometry before conversion, not after.
> 3. The source polyline can be preserved or erased after conversion (dialog option). Keeping it risks confusion; erase it or move it to a reference layer.

## Why convert a polyline?

Designers often sketch a preliminary alignment as a polyline before committing to Civil 3D's alignment tools. Sources include:

- A rough centerline traced over aerial imagery or a PDF underlay.
- An imported polyline from another CAD file, GIS shapefile, or survey data collector.
- A proposed utility route drawn with basic AutoCAD tools.

Converting to an alignment gives the line stationing, design-criteria checking, profile hosting, corridor attachment, and label-set capabilities.

## Preparing the polyline

Spending a few minutes cleaning the polyline before conversion prevents hours of alignment editing afterward.

### Join segments

If the path is multiple line/arc segments rather than a single polyline, join them first:

1. `PEDIT` > select one segment > Yes (convert to polyline) > Join > select all segments > Enter.
2. Or use `JOIN` (available in Civil 3D 2020+), which handles non-touching endpoints within a fuzz distance.

Gaps between segments cause `CREATEALIGNMENTFROMOBJECTS` to produce separate alignments per disconnected piece, or to fail.

### Remove duplicate vertices

Duplicate vertices at the same coordinate create zero-length line entities in the alignment. Use `OVERKILL` (Express Tools) to remove overlapping vertices within a tolerance (e.g., 0.001 ft).

### Audit arcs

Polyline arcs store a bulge factor, not a true center-radius definition. When an arc's start/end directions do not match the adjacent straight segment directions, the alignment flags a non-tangent condition.

Check tangency:

1. Select the polyline.
2. Use `LIST` to inspect vertex coordinates and bulge values.
3. At each arc-to-line transition, verify that the arc's end direction matches the line's bearing. If not, redraw the arc with PEDIT > Edit vertex > Straighten/Arc, or use FILLET with the desired radius to create a tangent arc.

### Ensure correct direction

The polyline's draw direction becomes the alignment's stationing direction. If the polyline was drawn east-to-west but you want stationing west-to-east, reverse it with `PEDIT` > Reverse before converting. Reversing an alignment after creation is possible but resets labels and dependent objects.

### Simplify complex polylines

If the polyline has hundreds of short segments (e.g., from a GPS track or GIS export), consider:

1. `PEDIT` > Spline or Fit to smooth, then `PEDIT` > Decurve to flatten back to line-arc segments with fewer vertices.
2. Or use `MAPCLEAN` (Map 3D) with a simplify tolerance to reduce vertex count before conversion.
3. Alternatively, use `BESTFITALIGNMENT` instead of `CREATEALIGNMENTFROMOBJECTS` for heavily segmented data.

## Conversion workflow

1. Run `CREATEALIGNMENTFROMOBJECTS`.
2. Select the polyline (or multiple lines/arcs in sequence).
3. Pick the end of the polyline that should be the alignment start (sets the stationing direction).
4. The Create Alignment from Objects dialog appears:
   - **Add curves between tangents**: if checked, Civil 3D inserts free curves at each vertex where the polyline changes direction. Useful if the polyline is a series of straight segments representing tangent runs.
   - **Erase existing entities**: if checked, the source polyline is deleted after conversion.
   - **Radius for curves**: the default radius for auto-inserted curves.
5. Accept. The alignment is created.

## Post-conversion checks

After conversion, verify the alignment:

1. Open the Geometry Editor. Check for non-tangent warnings (yellow/red icons).
2. Review the entity list: each polyline segment should map to a fixed line or fixed curve.
3. Check the total length. It should match the polyline's length (within rounding from arc conversion).
4. If design criteria are assigned, check for radius violations (the polyline's arcs may not meet minimum radius requirements).
5. Add station labels and geometry-point labels to confirm stationing is correct.

## Preserving vs erasing the source polyline

| Option | Pros | Cons |
|---|---|---|
| Erase after conversion | Clean drawing, no duplicate geometry | Cannot reference the original if the alignment is modified |
| Keep on a reference layer | Can compare alignment to original sketch | Risk of confusion if someone edits the polyline expecting it to update the alignment |

Recommendation: erase the polyline, or immediately move it to a locked, non-plotting reference layer (e.g., `X-REFLINE-NPLT`).

## Related

- [Alignment creation tools](alignment-creation-tools.md)
- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Editing alignments](editing-alignments.md)
