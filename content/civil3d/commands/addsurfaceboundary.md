---
title: "AddSurfaceBoundary"
section: "civil3d/commands"
order: 212
visibility: public
command: AddSurfaceBoundary
category: surfaces
ribbon: "Surface contextual ribbon > Modify panel > Add Data > Boundaries (or Prospector > Surface > Definition > Boundaries > right-click > Add)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateSurface, AddBreaklines, RebuildSurface]
symptoms:
  - "How do I clip my surface to the project limits?"
  - "How do I cut a hole in a surface for a building pad?"
  - "What's the difference between Outer, Hide, Show, and Data Clip boundaries?"
  - "Why is my boundary not actually hiding triangles?"
  - "How do I keep contours from extending past the property line?"
tags: [surfaces, boundaries, definition, clip]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Surface Boundaries"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D58A63A1-0A4B-4ED4-B91A-72C8B1391E62
    verified: 2026-05-06
---

> **TL;DR**
> 1. Boundaries clip what the surface shows or builds. Types: **Outer** (limits the entire surface), **Hide** (cuts holes), **Show** (re-exposes inside a Hide), **Data Clip** (drops input data outside before triangulation).
> 2. Use Data Clip to discard far-flung points before they create giant skinny triangles.
> 3. Boundaries are non-destructive — they don't delete points or breaklines; they just mask triangles.

## When to use

Whenever the surface should be limited to a meaningful extent (the project area, the survey limits) or has interior areas that shouldn't triangulate (building pads, water bodies).

## Workflow

1. Draw or select the boundary polyline. It must be closed.
2. Open Prospector → your surface → Definition → **Boundaries** → right-click → **Add**.
3. Pick the boundary **type**:
   - **Outer** — the only triangles kept are inside this polygon.
   - **Hide** — removes triangles inside the polygon.
   - **Show** — re-shows triangles inside a Hide region.
   - **Data Clip** — removes input data outside before TIN build.
4. Set **Non-destructive breakline** to control whether boundary edges become breaklines (usually yes).
5. Pick the polyline; the surface rebuilds and clips accordingly.

## Common gotchas

- Multiple Outer boundaries are unusual but allowed — Civil 3D unions them. Inconsistent overlapping Outers can produce empty surfaces.
- Hide boundaries don't remove the underlying point data, just the triangles. Volume calculations against the surface still consider the masked area as a hole.
- Data Clip is evaluated at build time; large datasets get faster builds when you clip data, not triangles.
- The boundary polyline must be closed and not self-intersecting. Civil 3D rejects with a "boundary is invalid" error.

## Related commands

- [CreateSurface](createsurface.md)
- [AddBreaklines](addbreaklines.md)
- [RebuildSurface](rebuildsurface.md)
