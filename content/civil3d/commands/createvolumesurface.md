---
title: "CreateVolumeSurface"
section: "civil3d/commands"
order: 215
visibility: public
command: CreateVolumeSurface
category: surfaces
ribbon: "Home tab > Create Ground Data panel > Surfaces > Create Surface (pick TIN Volume Surface in the dialog)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateSurface, ComputeVolumes, RebuildSurface]
symptoms:
  - "How do I make a persistent cut/fill surface that updates as I edit grading?"
  - "Volume surface vs grid volume — which one do I pick?"
  - "How do I plot cut/fill banding for a sheet?"
  - "Why is my volume surface zero everywhere?"
  - "How do I add a boundary that limits where volumes are calculated?"
tags: [surfaces, volume-surface, tin-volume, earthwork, cut-fill]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Volume Surfaces"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3E7FC2C9-2B9C-4ACD-9D2B-2EAF9C1B3EF7
    verified: 2026-05-06
---

> **TL;DR**
> 1. A TIN Volume Surface is a derived surface whose Zs are (Comparison − Base). It rebuilds when either parent rebuilds.
> 2. Use it for plotted cut/fill banding, persistent volume reporting, and as input to construction limits.
> 3. Add an Outer boundary to restrict the volume to the project area; otherwise it spans the overlap of both parents.

## When to use

When you need a permanent, plottable cut/fill artifact — not just a one-shot number — that will stay in sync with grading edits.

## Workflow

1. Run `CreateSurface` (or this command) and pick **TIN Volume Surface** as the type.
2. Set **Base Surface** to existing ground and **Comparison Surface** to the design surface (corridor surface, grading surface, FG).
3. Pick a style — usually an elevation banding style colored by cut (cool) and fill (warm).
4. Click OK. The volume surface appears in Prospector with a derivation icon.
5. Add an Outer boundary aligned to the construction limits or the project polygon.
6. Read the cubic-yard number from Surface Properties → Statistics → Volume.
7. Plot or label using the surface's elevation analysis or contour-band style.

## Common gotchas

- A volume surface is only meaningful where both parents have data. Outside that overlap, the volume surface has no triangles.
- If the comparison surface has stale snapshots, the volume reads stale. Rebuild parents before reading volume surface stats.
- Style precedence: an elevation banding style with too few bands will hide thin slivers of cut or fill.
- Adding the boundary as **Outer** is preferred over a Hide; Hide boundaries don't remove the data from the volume calc, only the display.

## Related commands

- [CreateSurface](createsurface.md)
- [ComputeVolumes](computevolumes.md)
- [RebuildSurface](rebuildsurface.md)
