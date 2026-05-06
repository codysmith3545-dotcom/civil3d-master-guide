---
title: "Volume Calculations"
section: "civil3d/surfaces"
order: 30
visibility: public
tags: [surfaces, volumes, earthwork, cut-fill, composite-volume]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [VOLUMESDASHBOARD, CREATEVOLUMESURFACE, CREATEBOUNDEDVOLUME, COMPOSITEVOLUMES]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D offers four volume methods: Composite, TIN volume surface, Bounded volumes, and Section/material list. Composite is the standard for whole-site earthwork; volume surfaces are best when you want a contoured cut/fill map.
> 2. The Volumes Dashboard (`VOLUMESDASHBOARD`) is the unified entry point in 2022+. It manages volume surfaces, bounded volumes, and applied factors (compaction, shrink/swell, expansion).
> 3. Apply cut and fill factors deliberately. Soil reports give shrink/swell percentages; default of 1.0 means no adjustment, which is rarely correct in production.

## Methods at a glance

| Method | What it does | When to use |
|---|---|---|
| Composite | Triangulates the union of both surfaces' triangles, computes prism volumes between coincident facets | Whole-site comparisons, design vs existing |
| TIN Volume Surface | Builds a new surface whose Z is `(top.Z – bottom.Z)` at every coincident vertex; supports contouring | When you want a cut/fill contour map or to grid-mathematically work with the difference |
| Bounded Volume | Composite calculation limited to a closed polygon | Phase volumes, pay-area takeoffs |
| Section / Material List | Sample-line-based, with subassemblies feeding material codes | Roadway corridor earthwork by material |

## Volumes Dashboard workflow

`VOLUMESDASHBOARD` opens a Panorama-style dashboard.

1. Click "Create new volume surface" or "Create new bounded volume".
2. For a volume surface: pick a Base surface (existing) and a Comparison surface (proposed). Civil 3D names it `<Comparison> – <Base>`.
3. Optional: enter cut and fill factors. The factor multiplies raw cut or fill before reporting.
4. The dashboard now lists the surface with raw cut, raw fill, net (cut – fill), adjusted cut, adjusted fill, and adjusted net.
5. Add bounded volumes per phase or pay-area by drawing a polyline and selecting it.

The dashboard refreshes when source surfaces rebuild. Right-click a row > Recompute if the surface has been edited.

## Cut and fill factors

- **Cut factor**: multiplier applied to raw cut volume to account for swell. A factor of 1.20 means each cubic yard of in-place soil expands to 1.20 cubic yards once excavated.
- **Fill factor**: multiplier applied to raw fill volume to account for compaction. A factor of 1.10 means 1.10 cubic yards of loose haul material is needed to produce 1.00 cubic yard of compacted fill.

These come from the geotechnical report; do not invent them. Common ranges (clean sand vs clay vs rock) vary widely. Document the source on the project's earthwork sheet.

## Composite volume math

The composite method overlays both TINs, generates a union of all triangle edges, then for each resulting facet computes the prism between top and base elevations. Total volumes are the sum of all positive prisms (fill) and negative prisms (cut). Composite is more accurate than grid-based methods for steep terrain because it honors all breakline-driven edges.

Caveats:

- Both surfaces must overlap horizontally where you want the result. Outside the overlap, the volume is zero.
- A composite volume surface inherits the maximum triangle length of the union; isolated outlier vertices on one surface but not the other produce long thin facets that distort results.

## TIN volume surface

A TIN volume surface is a real surface whose elevation = top minus base at every coincident vertex. Creates a height-difference surface you can:

- Contour at, say, 1 ft intervals to show cut/fill depth (negative for cut).
- Render with elevation banding by quick-style swap.
- Sample with a profile or section to study cut/fill along a path.

Build via Surfaces ribbon > Create Surface > TIN Volume Surface, picking base and comparison surfaces. Faster than composite for contouring-only purposes; can be slightly less accurate where TINs disagree on triangulation.

## Bounded volumes

A bounded volume reports a subset of a composite volume contained within a closed polygon. Useful for:

- Phase 1 vs Phase 2 earthwork separation on a sequenced site.
- Pay quantities by station range or pay area.
- Ponds, where you want only the depression volume.

Bounded volumes share the underlying composite computation and so inherit its accuracy.

## Section/material list (corridor earthwork)

For roadway projects, sample lines along a corridor produce sections at a chosen interval (e.g. 50 ft for highway, 25 ft for urban). A Material List on the sample line group ties subassembly link codes to material categories (Topsoil Strip, Common Excavation, Embankment) with shrink/swell factors. Volumes are reported by material per station.

This method is the only one that integrates with quantity takeoff for highway pay items. See standard practice in AASHTO's *A Policy on Geometric Design of Highways and Streets* (Green Book) for guidance on cross-section spacing.

## Reporting

- **Volumes Dashboard** export: CSV summary.
- **Earthwork Quantities** report from Toolbox > Reports Manager > Surface category.
- **Section views** with end-area volume tables for the corridor method.
- **LandXML export** of a volume surface for handoff to GPS machine control.

## Common gotchas

- **Mismatched surface extents.** A composite of a city-wide existing TIN against a small site grade returns a tiny number because the overlap is small. Crop the existing surface or use a bounded volume.
- **Tiny triangles produce numerical noise.** A high-density LIDAR existing combined with a sparse design surface yields high-frequency cut/fill that is mostly noise; smooth the design surface with breaklines or paste in a refined region.
- **Wrong factor direction.** A swell factor used as a compaction factor swaps the meaning. Verify with the geotech report.
- **Multiple definition revisions.** A volume surface does not auto-rebuild when its parent updates if Rebuild – Automatic is off. Re-run from the dashboard.
- **Out-of-date corridor sections.** Sample-line earthwork uses cached corridor data; rebuild the corridor and the sample line group before re-running material lists.

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Breaklines and boundaries](breaklines-and-boundaries.md)
- [Grading groups](../grading/grading-groups.md)
