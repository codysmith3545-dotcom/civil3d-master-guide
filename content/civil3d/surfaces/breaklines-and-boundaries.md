---
title: "Breaklines and Boundaries"
section: "civil3d/surfaces"
order: 20
visibility: public
tags: [surfaces, breaklines, boundaries, tin, triangulation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [ADDSURFACEBREAKLINES, ADDSURFACEBOUNDARIES, EDITSURFACE]
updated: 2026-05-06
---

> **TL;DR**
> 1. Breaklines force the triangulation to follow specific 3D edges (curbs, swales, walls, edges of pavement). Boundaries trim or hide regions of the TIN. Both are first-class members of the surface Definition.
> 2. Use 3D polylines or feature lines for Standard breaklines. 2D polylines work only as Proximity breaklines or paired with elevation-bearing surfaces. Wall breaklines insert a small horizontal offset so the TIN can carry a near-vertical face.
> 3. Add breaklines with `ADDSURFACEBREAKLINES`, boundaries with `ADDSURFACEBOUNDARIES`. Re-add or refresh after editing the source geometry; the surface does not always rebuild from external edits.

## Why breaklines exist

Delaunay triangulation chooses connections by geometry, not by intent. Without a breakline along the top of curb, the TIN can run a triangle from a back-of-walk point straight to a centerline point, missing the curb face entirely. A breakline forces an edge between two specific surface vertices and prohibits triangulation across it.

Linear features that should always be breaklines:

- Top and toe of curb, edge of pavement.
- Drainage swales, ditch flow lines, ridges.
- Pad edges and tops/bottoms of retaining walls.
- Building footprints (also as a hide boundary).
- Stream centerlines and top of bank.

## Breakline types

`ADDSURFACEBREAKLINES` offers six types:

1. **Standard** — uses Z values from the source 3D polyline, feature line, or survey figure. Most common.
2. **Proximity** — 2D polyline; Z is taken from the nearest TIN vertex at each polyline vertex. Useful only when the surface already has good elevation coverage; otherwise produces unpredictable Z.
3. **Wall** — 3D polyline; Civil 3D builds two parallel breaklines at a small horizontal offset (left and right) to allow near-vertical face representation. Specify offset distance and side. Typical 0.01–0.10 ft offset.
4. **From File** — reads a `.flt` text file (point sequences with elevations). Useful for breaklines exported from another platform.
5. **Non-destructive** — preserves the existing TIN around the breakline; instead of re-triangulating, it inserts the breakline as an additional constraint without removing existing edges. Use when the upstream TIN has been hand-edited and must be preserved.

The Mid-ordinate distance parameter (Standard breaklines only) supplements arc segments with intermediate vertices so curved features triangulate smoothly. For typical curb returns, 0.10–0.50 ft (or 30–150 mm) is enough.

## Sources of breakline geometry

- **Survey figures** — pulled directly from the database; right-click the figure > Add as Breakline. Edits in the database propagate after refresh.
- **Feature lines** — Civil 3D's editable 3D line objects. The same feature line can be used for grading and as a breakline. Stay aware that grading edits move the breakline.
- **3D polylines** — created by `3DPOLY`, by surface `Extract Objects`, or by `CREATEFEATURELINEFROMOBJECTS`.
- **Corridor feature lines** — extracted from a corridor (e.g. the top-of-curb feature) and added to a finished-grade surface.

## Breakline rules and crossings

- Breaklines must not cross each other in plan view at differing elevations. If they do, Civil 3D either errors during build (default) or, when "Allow crossing breaklines" is on, picks one Z by the chosen rule (use first, last, highest, lowest, or average). Resolve crossings rather than tolerate them.
- Breaklines and points coincident in plan but at different Z create vertical zero-length triangles; clean by deleting one source.
- Breaklines that share endpoints with existing TIN points should snap exactly; floating-point drift causes spurious tiny triangles.

## Boundaries

`ADDSURFACEBOUNDARIES` accepts a closed polyline or polygon and adds it to Definition. Three types:

- **Outer** — only one is meaningful. Triangles outside are removed. Use the outer boundary to define the project limit instead of relying on max triangle length alone.
- **Hide** — punches a hole. Common for building pads, lakes, or unsurveyed islands.
- **Show** — re-exposes triangulation inside a hide region, useful for nested editing.

The **Non-destructive** option on each type preserves the underlying TIN where the boundary cuts triangles, instead of dropping the partially-clipped triangle. Without it, edge triangles are removed when their centroid falls outside the boundary, producing a serrated edge.

## Working order

Civil 3D evaluates Definition top-down. The recommended order is:

1. Point Groups (and other point sources).
2. Contour Data (if any).
3. Breaklines.
4. Drawing object surface adjustments.
5. Edits (Smooth, Add/Delete Line, etc.).
6. Boundaries (last, so they trim everything above).

Reorder in Definition by dragging or via Surface Properties > Definition.

## Common gotchas

- **2D polyline added as Standard breakline.** All vertices read as Z = 0; the surface dives. Always confirm 3D polyline elevation before adding as Standard.
- **Crossing breaklines silently picked.** A `Crossing breaklines` warning is easy to miss. Run a `Triangles`-style display and look for unexpected ridges.
- **Hide boundary above outer in the list.** Items below the outer are clipped; an outer above a hide can void the hide. Order matters.
- **Wall offset wrong direction.** A wall built on the wrong offset side flips the face and produces a wrong slope analysis.
- **Survey figure broken from database.** A figure inserted into the drawing then exploded loses its database link, and edits in the database no longer push to the surface. Use `Insert into drawing`, not `Explode`.
- **Boundaries not closed.** A self-closing polyline that's actually two endpoints near each other (not snapped) silently fails as a boundary; close with `PEDIT > Close`.

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Volume calculations](volume-calculations.md)
- [Feature lines](../grading/feature-lines.md)
