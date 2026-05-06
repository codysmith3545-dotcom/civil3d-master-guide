---
title: "Building a TIN Surface"
section: "civil3d/surfaces"
order: 10
visibility: public
tags: [surfaces, tin, surface, definition, contours]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATESURFACE, ADDSURFACEBOUNDARIES, ADDSURFACEBREAKLINES, REBUILDSURFACE]
updated: 2026-05-06
---

> **TL;DR**
> 1. A TIN surface is a Triangulated Irregular Network of point-defined facets. Build it with `CREATESURFACE` (TIN type), then add definition data: point groups, breaklines, boundaries, contour data, edits.
> 2. Order of operations matters because Civil 3D evaluates definition operations top-down. Standard order: Point Groups → Drawing Objects → DEM/contours → Breaklines → Boundaries → Edits.
> 3. Maximum triangle length and surface style settings determine what shows on screen. A blank surface is usually a too-small max triangle length, an outer boundary, or an "out-of-date" rebuild waiting to be triggered.

## What a TIN is

The TIN is constructed by Delaunay triangulation: every triangle is built so its circumcircle contains no other vertex. Triangle edges are the natural connections; breaklines force specific edges where triangulation would otherwise cross a feature.

Civil 3D stores the TIN as a Surface object with a Definition collection. Each item under Definition is one input source: points, breaklines, boundaries, contour data, drawing objects, edits. Operations are listed in chronological order, and each is rebuildable.

## Creating the surface

1. Prospector > right-click `Surfaces` > Create Surface (`CREATESURFACE`).
2. Type: TIN Surface. Name it (`EG-1`, `Existing Ground`, etc.). Pick a style.
3. OK. The empty surface appears in Prospector with an empty Definition.

## Adding data, in order

### Point Groups

Right-click Definition > Point Groups > Add > select groups. Recommended over `Drawing Object > Points` because the group membership stays current as points are imported.

### Drawing Objects

For ad-hoc inputs: AutoCAD points, blocks with attribute Z values, polylines, 3D faces, lines. Use sparingly; they don't update if the source is edited.

### DEM Files

Imports a `.dem` raster as a regular grid resampled into TIN vertices. Use Map 3D's GIS tools for `.tif` and `.img` rasters; they convert to DEM on insert.

### Contour Data

Adds 2D or 3D polylines as elevation-tagged contours. Two parameters control density:

- **Weeding factors** (distance and angle): drop points where consecutive contour vertices are within these tolerances. Defaults are aggressive; lower for high-detail terrain.
- **Supplementing factors** (distance and mid-ordinate): add intermediate points to long, curved contour segments so triangulation captures curvature. Default 0 (no supplement); increase for sparse contours.

Always run `MINIMIZEFLAT` (Surface ribbon > Edit Surface > Minimize Flat Areas) after contour-only definition; otherwise long, flat triangles span between the same elevation contour and slope to zero.

### Breaklines

Breaklines force the TIN to honor edges along linear features (curbs, swales, ridges). Add via `ADDSURFACEBREAKLINES`. Types:

- **Standard** — 3D polyline; vertices supply Z.
- **Proximity** — 2D polyline; Z pulled from the nearest TIN vertex (use sparingly).
- **Wall** — 3D polyline that creates a vertical wall offset (left/right offset of millimeters/inches to avoid TIN ambiguity).
- **From File** — `.flt` text file format with breakline coordinates.
- **Non-destructive** — preserves underlying triangulation around the breakline rather than re-triangulating.

See [Breaklines and boundaries](breaklines-and-boundaries.md) for detail.

### Boundaries

Three types:

- **Outer** — defines the exterior of the surface; triangles outside are dropped.
- **Hide** — punches a hole (e.g. a building footprint).
- **Show** — re-includes a region inside a hide boundary.

Add with `ADDSURFACEBOUNDARIES`.

### Edits

Manual triangulation cleanup: Add Line, Delete Line, Swap Edge, Add Point, Delete Point, Modify Point, Smooth Surface, Paste Surface, Raise/Lower Surface. Each edit is appended to the Definition log.

## Building parameters

Right-click the surface > Surface Properties > Definition tab, then expand `Build`:

- **Maximum triangle length** — drop edges longer than this. The most common reason a surface goes blank: the value is too small for a sparse data set, or zero because it was reset. Set to a value larger than the longest legitimate edge expected.
- **Convert proximity breaklines to standard** — leave on for cleaner output.
- **Allow crossing breaklines** — leave off; resolve crossings instead.
- **Use maximum triangle length** — main on/off toggle.

## Surface styles

The Style controls what is drawn:

- Borders, contours (major/minor with intervals), triangles, points, slopes, watersheds, elevation banding, directions.
- Most production work uses contour-only with major at 5 ft and minor at 1 ft (or 10 ft / 2 ft for low-relief sites). For QA, switch to a "Triangles" style temporarily to see the underlying TIN.

## Rebuilding

- Right-click the surface > Rebuild. Updates if any definition source has changed.
- `Rebuild – Automatic` toggle on the surface menu does the rebuild for you on every change. Convenient for small projects, expensive on large surfaces.
- `REBUILDSURFACE` from the command line.

## Common gotchas

- **All-flat triangles.** Building from contours without `Minimize Flat Areas` leaves triangles that connect three points at the same elevation. Run the edit, or add ridge/swale breaklines.
- **Vertex elevation 0.** A 2D polyline added as a Standard breakline has Z = 0. The TIN dives to elevation zero along that line.
- **Surface goes blank on insert.** Maximum triangle length is too small. Set it to something larger than your longest expected edge or temporarily disable the limit.
- **Outer boundary doesn't trim**. Boundaries respect the order they appear in Definition. A hide boundary above the outer boundary in the list can re-include trimmed area.
- **Contours imported with weed too aggressive.** Sharp ridges flatten because vertex density was thinned. Re-import with smaller weeding values.
- **Performance.** TINs with millions of vertices are slow; consider a paste of a focused-area surface rather than rebuilding the parent.

## Related

- [Breaklines and boundaries](breaklines-and-boundaries.md)
- [Volume calculations](volume-calculations.md)
- [Point groups](../points/point-groups.md)
