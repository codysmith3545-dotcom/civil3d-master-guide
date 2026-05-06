---
title: "Alignment commands"
section: "civil3d/commands/by-category"
order: 40
visibility: public
tags: [commands, alignments, geometry, offsets, design-criteria]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Alignments are the horizontal control geometry — centerlines, ROW lines, offsets, or rails.
> 2. You can build them by tracing existing geometry (`CreateAlignmentFromObjects`) or by interactive layout (`CreateAlignmentLayout`).
> 3. Design checks and a design criteria file (e.g., AASHTO 2018) flag entities that violate radius/length rules at the configured speed.

## Commands in this category

- `CreateAlignmentFromObjects` — see [createalignmentfromobjects.md](../createalignmentfromobjects.md)
- `CreateAlignmentLayout` — see [createalignmentlayout.md](../createalignmentlayout.md)
- `EditAlignmentGeometry` — see [editalignmentgeometry.md](../editalignmentgeometry.md)
- `CreateOffsetAlignment` — see [createoffsetalignment.md](../createoffsetalignment.md)
- `AlignmentProperties` — switch design criteria, station equations, reference surfaces.
- `EditAlignmentLabelGroup` — manage labels along the alignment as a set.
- `CreateAlignmentReference` — bring a data-shortcut alignment into the active drawing as a read-only reference.
- `ReverseAlignmentDirection` — flip stationing.
- `StationOffsetAlignmentLabels` — add user-placed station/offset labels.

## Typical workflow

1. Establish design speed and pick a design criteria file in template.
2. `CreateAlignmentFromObjects` if you already have a polyline; otherwise `CreateAlignmentLayout`.
3. Inspect with `EditAlignmentGeometry` and resolve any design-check warnings.
4. Build offsets for ROW, edge of pavement, or curb returns with `CreateOffsetAlignment`.
5. Promote to a data shortcut so profiles and corridors in other drawings can reference it.

## Related

- [Alignments section](../../alignments/index.md)
- [Profile commands](profiles.md)
- [Corridor commands](corridors.md)
- [AASHTO design summary](../../../standards/aashto/index.md)
