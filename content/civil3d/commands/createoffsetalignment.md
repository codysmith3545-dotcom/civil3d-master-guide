---
title: "CreateOffsetAlignment"
section: "civil3d/commands"
order: 223
visibility: public
command: CreateOffsetAlignment
category: alignments
ribbon: "Home tab > Create Design panel > Alignment > Create Offset Alignment"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateAlignmentLayout, CreateAlignmentFromObjects, EditAlignmentGeometry]
symptoms:
  - "How do I make EOP and ROW alignments parallel to centerline?"
  - "How do I add lane widening at a specific station?"
  - "Why doesn't my offset update when I edit the parent?"
  - "How do I offset to both sides at once?"
  - "How does this differ from drawing a polyline offset?"
tags: [alignments, offset, parallel, widening, dynamic]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Offset Alignments"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-CC0FBB7C-CE57-489B-AE53-5D58FAE9C20B
    verified: 2026-05-06
---

> **TL;DR**
> 1. Creates a true offset alignment that stays linked to the parent. Edit the centerline, the offset reflows.
> 2. One run can create both left and right offsets at one or more distances (e.g., 12 ft EOP, 25 ft ROW).
> 3. Widenings — local lateral expansions — are added separately on the offset alignment after creation.

## When to use

To produce ROW lines, edge of pavement, curb-return tangent matchlines, sidewalks, and any other geometry that has to track the centerline for the life of the project.

## Workflow

1. Run `CreateOffsetAlignment` (Home ribbon → **Alignment** → **Create Offset Alignment**).
2. Pick the parent centerline alignment.
3. In the dialog, tick **Left**, **Right**, or both. Enter offsets in feet (e.g., **12 ft** for EOP, **25 ft** for ROW).
4. Pick a name template, type (typically **Offset**), and starting station inheritance (usually match parent).
5. Click **OK**. The offset alignments appear and are linked to the parent.
6. To add a widening, select an offset, ribbon → **Add Widening**, give a start/end station and width delta (e.g., +6 ft for a turn lane).
7. Confirm offsets re-flow when you edit parent geometry — they should rebuild without prompting.

## Common gotchas

- A polyline `OFFSET` is static. An offset alignment is dynamic — picking the wrong tool early on can cost a day of rework.
- Widenings require the offset alignment to exist; can't add a widening to a centerline directly.
- Curve return regions (e.g., at intersections) need separate alignments and can't be modeled as widenings — they're their own offset alignments with a curb-return type.
- Offset alignments do not get their own profile automatically. Sample the design surface or define a profile to drive a corridor along the offset.

## Related commands

- [CreateAlignmentLayout](createalignmentlayout.md)
- [CreateAlignmentFromObjects](createalignmentfromobjects.md)
- [EditAlignmentGeometry](editalignmentgeometry.md)
