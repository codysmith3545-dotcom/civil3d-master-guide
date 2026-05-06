---
title: "Troubleshooting Surfaces"
section: "civil3d/surfaces"
order: 90
visibility: public
tags: [surfaces, troubleshooting, performance, breaklines, boundaries, rebuild]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [REBUILDSURFACE, EDITSURFACESTYLE, SURFACEPROPERTIES, MINIMIZEFLATAREA, AUDIT]
updated: 2026-05-06
---

> **TL;DR**
> 1. A blank surface is almost always one of three things: maximum triangle length too small, outer boundary excluding all data, or the surface style hiding all display components. Check these first.
> 2. Slow rebuilds come from excessive vertex counts (LIDAR without thinning), crossing breaklines, or Rebuild-Automatic on a large surface. Simplify the surface or switch to manual rebuild.
> 3. Flat triangles, spikes, and "tent poles" point to data quality issues: wrong elevation on a breakline, a 2D polyline at Z=0 added as a standard breakline, or an outlier point.

## Blank surface (nothing displays)

**Symptoms**: The surface exists in Prospector, has definition data, reports a non-zero point count, but nothing appears on screen.

| Cause | Diagnosis | Fix |
|---|---|---|
| Maximum triangle length too small | Surface Properties > Definition > Build > Max Triangle Length is a small number or zero | Increase to a value larger than the longest expected triangle edge, or disable the limit |
| Outer boundary excludes all data | Definition has an outer boundary that does not enclose any vertices | Delete or redefine the boundary to match the data extents |
| Surface style hides components | The active style has all display components (contours, triangles, borders) turned off | Switch to a diagnostic style that shows triangles or borders. Edit style > Display tab > toggle components on |
| Surface out of date | The yellow "out of date" icon appears in Prospector | Right-click > Rebuild, or `REBUILDSURFACE` |
| Wrong coordinate space | Data imported in a different CRS; the surface is built far from the current view | Zoom Extents (`ZE`). If the surface is at the origin and data is in state plane, set the drawing coordinate system and reimport |

## Flat triangles

**Symptoms**: Large areas of the surface show zero slope. Contours bunch together at contour intervals, then skip wide flat areas. Watershed analysis shows extensive "Flat Area" zones.

**Causes**:

- Surface built from contours without running Minimize Flat Areas. Triangles connecting three vertices on the same contour elevation have zero slope.
- Breaklines at a constant elevation (e.g., a building pad edge at 100.00 ft) with no interior grade data.

**Fixes**:

1. Run `Minimize Flat Areas` (Surface ribbon > Edit Surface > Minimize Flat Areas). Apply all three methods in sequence: Add Points to Flat Edges, Add Points to Flat Faces, Swap Edges. Multiple passes may help.
2. Add ridge and swale breaklines between contours to guide the triangulation.
3. For building pads, add an interior point at the pad high point or add slope breaklines.

## Spikes and "tent poles"

**Symptoms**: The surface has isolated extreme highs or lows. Contour lines form tight concentric circles around a single point. Elevation range in Surface Properties shows an unexpected max or min.

**Causes**:

- A 2D polyline (Z = 0) added as a Standard breakline. The TIN drops to elevation 0 along that line.
- A rogue survey point with an incorrect elevation (data entry error, bird strike in LIDAR, multipath GPS error).
- A block insertion point at Z = 0 picked up as a Drawing Object definition source.

**Fixes**:

1. In Prospector, expand the surface's Definition to identify the offending data source.
2. For breaklines: confirm all Standard breaklines are 3D polylines with correct elevations. Use `LIST` on the polyline to check Z values.
3. For points: identify the outlier in the point group, correct or exclude it, and rebuild.
4. For drawing objects: remove the Z=0 object from the definition.

## Crossing breaklines

**Symptoms**: Civil 3D issues a "crossing breaklines" warning at rebuild. The surface may show distorted triangulation or omit triangles near the crossing.

**Cause**: Two breakline polylines cross each other in plan view at different elevations. The TIN cannot honor both edges simultaneously at the intersection.

**Fix**:

1. Surface Properties > Definition > expand Breaklines. Right-click > "Show crossing breaklines" (Civil 3D 2024+). This highlights the crossings.
2. Edit the breakline geometry to eliminate the crossing: add a common vertex at the intersection with the correct elevation, split one breakline, or adjust the alignment so they do not cross.
3. Alternatively, enable "Allow crossing breaklines" in Build settings. Civil 3D resolves the conflict by choosing one breakline's elevation at the crossing. This is a workaround, not a solution — the surface elevation at the crossing will be approximate.

## Missing data in a region

**Symptoms**: A portion of the surface shows no triangulation. There is a hole or gap in the contour display.

**Causes**:

- A Hide boundary is removing that region.
- Maximum triangle length is trimming long edges in sparse-data areas.
- The data source (point group, breakline set) does not cover that area.

**Fixes**:

1. Check for Hide boundaries in Definition > Boundaries.
2. Increase maximum triangle length.
3. Verify point coverage by switching to a Triangles+Points style.

## Slow rebuild

**Symptoms**: Rebuilding the surface takes minutes. The drawing freezes or becomes unresponsive during edits.

**Causes and remedies**:

| Cause | Remedy |
|---|---|
| Millions of vertices (LIDAR, dense photogrammetry) | Simplify Surface to reduce point count within an acceptable vertical tolerance |
| Rebuild-Automatic enabled on a large surface | Turn off auto-rebuild; rebuild manually after completing a batch of edits |
| Many paste operations stacked | Consolidate pastes where possible; each paste re-triangulates the overlap |
| Crossing breaklines triggering iterative resolution | Fix the crossings (see above) |
| Drawing file corruption | Run `AUDIT` with "Fix errors" and `PURGE` to clean the drawing |

## Boundary does not trim correctly

**Symptoms**: Outer boundary does not clip the surface, or a Hide boundary fails to punch a hole.

**Causes**:

- The boundary polyline is not closed. Boundaries require closed polylines or feature lines.
- Boundary type is wrong (Show instead of Hide, or vice versa).
- Order of operations: a later definition entry overrides an earlier boundary. A paste surface added after the boundary can re-triangulate the hidden area.

**Fixes**:

1. Verify the polyline is closed (`LIST` > check "closed" status).
2. Confirm the boundary type in Definition > Boundaries.
3. Reorder definition entries so boundaries apply after all data additions and pastes.

## Contours look wrong

**Symptoms**: Contours are jagged, contours run through buildings, contours do not appear at expected intervals.

| Issue | Fix |
|---|---|
| Jagged contours | Enable contour smoothing in the surface style (Contours tab > Smooth Contours > True, value 5–10) |
| Contours at wrong interval | Check both Surface Properties > Analysis (interval values) and the surface style (index contour frequency). They must be consistent |
| Contours inside a building | Add a Hide boundary around the building footprint |
| Contours not appearing | Verify the surface style has Major/Minor Contour components set to visible on the Display tab; verify the layers are not frozen |

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Breaklines and boundaries](breaklines-and-boundaries.md)
- [Surface editing](surface-editing.md)
- [Surface analysis](surface-analysis.md)
