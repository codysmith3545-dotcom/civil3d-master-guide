---
title: "Parcel commands"
section: "civil3d/commands/by-category"
order: 100
visibility: public
tags: [commands, parcels, lots, rights-of-way, subdivision]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Parcels are 2D closed regions tied to a parcel site. They support area labels, line/curve labels, segment labels, and area tables.
> 2. Build by converting closed polylines (`CreateParcelFromObjects`), interactive layout (`CreateParcelByLayout`), or by subdivision (slide-line/swing-line).
> 3. Sites control parcel topology — parcels in the same site adjust each other's geometry. Keep ROW and lots on different sites where appropriate.

## Commands in this category

- `CreateParcelFromObjects` — convert closed polylines or lines to parcels.
- `CreateParcelByLayout` — open the parcel layout toolbar (slide line, swing line, free form).
- `CreateRightOfWay` — generate a ROW parcel offset from an alignment.
- `EditParcelProperties` — change parcel style, area label, name template.
- `AddParcelArea` / `AddParcelSegmentLabel` — add labels.
- `ParcelLayoutTools` — toolbar with subdivision options.
- `ReverseParcelDirection` — flip the segment direction reported in tables.
- `EditParcelSegments` — fix bowties or geometry oddities.

## Typical workflow

1. Decide site organization: usually one site for boundary/ROW, one site for lots.
2. Convert the boundary polyline into a parcel.
3. Subdivide using slide-line or swing-line layout to hit minimum frontage and area requirements.
4. Apply area, segment, and table labels to match the local plat standard (e.g., NCS or county recorder template).
5. Export the parcel mapping check report for the surveyor's seal.

## Related

- [Survey commands](survey.md)
- [Parcels workflows](../../parcels/index.md)
- [Indiana county plat standards](../../../jurisdictions/indiana/index.md)
