---
title: "Surface Editing"
section: "civil3d/surfaces"
order: 30
visibility: public
tags: [surfaces, editing, paste-surface, smooth, simplify, swap-edge]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITSURFACE, PASTESURFACE, SMOOTHSURFACE, SIMPLIFYSURFACE, RAISELOWERSURFACE, MINIMIZEFLATAREA]
updated: 2026-05-06
---

> **TL;DR**
> 1. Surface edits are logged in the Definition collection and rebuild with the surface. Key edits: **Paste Surface** (composite one surface onto another), **Smooth Surface** (NNI or Kriging interpolation), **Simplify Surface** (reduce vertices), **Raise/Lower** (shift all elevations), **Swap Edge** / **Add Line** / **Delete Line** (manual triangle cleanup).
> 2. Paste Surface is the primary tool for combining a proposed grading pad into an existing-ground surface. The pasted surface overwrites the parent only where both overlap.
> 3. Edit operations are non-destructive entries in the Definition list. Delete the edit entry to undo it; reorder entries to change precedence.

## Paste Surface

Paste Surface composites a smaller surface onto a larger one, replacing the parent's triangulation in the overlap zone.

1. Right-click the target surface's Definition > Edits > Paste Surface.
2. Select the source surface to paste.
3. Civil 3D adds the paste as a Definition entry. In the overlap area, the pasted surface's triangulation and elevations replace the parent's. Outside the overlap, the parent is unchanged.

Common uses:

- Pasting a proposed building pad onto existing ground to create a composite finished-grade surface.
- Pasting a corridor surface (top links extracted) onto existing ground.
- Combining LIDAR tiles by pasting each tile onto a master surface.

Order matters: later pastes override earlier ones in the same overlap area. If two pasted surfaces conflict, the one lower in the Definition list wins.

## Smooth Surface

Smoothing adds interpolated points between existing TIN vertices to produce a denser, visually softer surface.

1. Right-click the surface > Edit Surface > Smooth Surface, or Surface ribbon > Edit Surface panel > Smooth Surface.
2. Two methods:
   - **NNI (Natural Neighbor Interpolation)** — weights nearby vertices by Voronoi area. Produces a surface that passes exactly through original data points. Best for general terrain smoothing.
   - **Kriging** — geostatistical interpolation with a semivariogram model. More configurable (nugget, sill, range) but requires understanding of the underlying spatial correlation. Use for surfaces derived from sparse sampling.
3. Parameters:
   - **Grid spacing** or **point density** — controls how many new points are inserted. Smaller spacing = more points = smoother but heavier surface.
   - **Output area** — smooth the entire surface or only within a selected region.
4. The smooth operation appends interpolated points to the TIN. It does not move original vertices.

Smoothing a contour-derived surface helps reduce the stair-step artifact between contour lines but does not replace proper breakline placement for drainage accuracy.

## Simplify Surface

Simplify removes vertices that contribute less than a specified tolerance to surface accuracy. Useful for reducing file size after importing dense LIDAR or photogrammetry data.

1. Surface ribbon > Edit Surface > Simplify Surface.
2. Two methods:
   - **Edge Contraction** — collapses short triangle edges, merging the two endpoints into one. Specify maximum change in elevation (vertical tolerance) and optionally a percentage of points to remove.
   - **Point Removal** — removes individual points whose absence changes the surface by less than the specified tolerance.
3. Set the tolerance based on the project's accuracy requirement. For a grading plan at 0.10 ft vertical accuracy, a simplify tolerance of 0.05 ft is safe. For a topo survey at 0.50 ft, a tolerance of 0.25 ft is reasonable.

Simplification is irreversible within that rebuild step. To recover, delete the Simplify entry from Definition.

## Raise/Lower Surface

Shifts every vertex on the surface by a constant elevation value.

1. Right-click surface > Edit Surface > Raise/Lower Surface.
2. Enter a positive value to raise, negative to lower.

Use cases:

- Adjusting a surface to a new datum after a benchmark revision.
- Quickly modeling a uniform fill depth (raise an existing surface by 1.0 ft to simulate a 1 ft blanket fill).
- Correcting a systematic GPS elevation offset.

## Swap Edge

Swaps the shared edge between two adjacent triangles. The four vertices stay the same, but the diagonal connecting them flips.

1. Surface ribbon > Edit Surface > Swap Edge, or `EDITSURFACE` > Swap Edge.
2. Click the triangle edge to swap.

Swap Edge is the primary tool for fixing flat triangles at ridges and valleys where Delaunay triangulation chose the wrong diagonal. After swapping, the surface more accurately represents the terrain break.

## Add Line / Delete Line

- **Add Line** — forces a triangle edge between two surface points. Equivalent to a local breakline.
- **Delete Line** — removes a triangle edge; the surface re-triangulates around it.

Both are manual overrides. Use sparingly; for systematic linear features, a breakline is preferable because it is data-driven rather than hand-edited.

## Delete Point

Removes a vertex and all triangles sharing it, then re-triangulates the void. Useful for eliminating rogue points (bird strikes in LIDAR, errant survey shots).

## Minimize Flat Areas

`MINIMIZEFLATAREA` (Surface ribbon > Edit Surface > Minimize Flat Areas) addresses the flat-triangle problem common with contour-sourced surfaces.

Three methods:

- **Add points to flat triangle edges** — inserts an interpolated vertex on the shared edge between two same-elevation triangles.
- **Add points to flat triangle faces** — inserts a vertex at the centroid of a flat triangle, elevating it slightly by interpolation from neighbors.
- **Swap edges** — batch-swaps edges on flat triangles to break up same-contour connections.

Run all three in sequence (edges, then faces, then swap) for best results. Multiple passes may be needed.

## Edit order and undo

Every edit appends an entry to the Definition collection. Entries rebuild top to bottom. You can:

- Delete an entry to undo it (right-click > Remove).
- Reorder entries by drag (in Surface Properties > Definition tab).
- Temporarily disable an entry by unchecking its "Enabled" flag.

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Breaklines and boundaries](breaklines-and-boundaries.md)
- [Troubleshooting surfaces](troubleshooting-surfaces.md)
