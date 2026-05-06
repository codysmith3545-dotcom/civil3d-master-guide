---
title: "AddBreaklines"
section: "civil3d/commands"
order: 211
visibility: public
command: AddBreaklines
category: surfaces
ribbon: "Surface contextual ribbon > Modify panel > Add Data > Breaklines (or Prospector > Surface > Definition > Breaklines > right-click > Add)"
shortcut: "AB (default in aeccland.pgp — verify in current release)"
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateSurface, AddSurfaceBoundary, RebuildSurface, CreateFeatureLineFromObject]
symptoms:
  - "How do I force triangulation along a curb or ditch line?"
  - "Why are my contours crossing through buildings or curbs?"
  - "What's the difference between standard, proximity, and wall breaklines?"
  - "Can I use 3D polylines or feature lines as breaklines?"
  - "Why did my surface break get ignored after adding a breakline?"
tags: [surfaces, breaklines, tin, definition]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Adding Breaklines"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-46C748DE-5CA2-453B-A7C5-31FBA02B6B9D
    verified: 2026-05-06
---

> **TL;DR**
> 1. Forces TIN edges along a line (3D polyline, feature line, survey figure, or 2D polyline using Z values from a surface).
> 2. Types: **Standard** (use the line's Zs), **Proximity** (use existing surface Zs along the path), **Wall** (vertical face), **From File** (FLT file).
> 3. Breaklines aren't elevation data — they have to coincide with point data or carry their own elevations, otherwise the surface will sag along them.

## When to use

Whenever ground geometry has a sharp break that triangulation alone won't capture: top of curb, edge of pavement, ditch flowline, building footprint, top/bottom of bank.

## Workflow

1. Make sure the source lines have the right elevations. 2D polylines have Z=0 unless used with a Proximity breakline.
2. Open Prospector → your surface → Definition → **Breaklines** → right-click → **Add**.
3. Pick the breakline type. **Standard** is the usual choice for 3D polylines and feature lines.
4. Set **Mid-ordinate distance** for curve tessellation (typical 0.1 ft for road work).
5. Pick the lines in the drawing; press Enter.
6. Civil 3D rebuilds the surface (or queues a rebuild if Definition → Build → Rebuild Automatically is off).
7. Verify with the surface set to a triangle style — TIN edges should snap to the breakline path.

## Common gotchas

- Crossing breaklines cause warnings and one path's elevation is dropped at intersections; clean up overlapping survey figures before adding.
- A 2D polyline added as a Standard breakline contributes Z=0 to the TIN — surface elevations will collapse along it. Use **Proximity** or convert to a 3D polyline first.
- Feature lines edited later don't auto-update the surface unless they're added as **dynamic** data — Civil 3D treats most breakline references as static snapshots. Re-add or use grading group / corridor surfaces for dynamic behavior.
- Wall breaklines need an offset and a delta-Z. Forgetting the delta produces a 0-thickness wall that triangulates oddly.

## Related commands

- [CreateSurface](createsurface.md)
- [AddSurfaceBoundary](addsurfaceboundary.md)
- [RebuildSurface](rebuildsurface.md)
- [CreateFeatureLineFromObject](createfeaturelinefromobject.md)
