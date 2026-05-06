---
title: "CreateAlignmentFromObjects"
section: "civil3d/commands"
order: 220
visibility: public
command: CreateAlignmentFromObjects
category: alignments
ribbon: "Home tab > Create Design panel > Alignment > Create Alignment from Objects"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateAlignmentLayout, EditAlignmentGeometry, CreateOffsetAlignment]
symptoms:
  - "How do I turn a polyline into an alignment?"
  - "How do I make an alignment from existing survey lines and arcs?"
  - "Why does my alignment have warning triangles after conversion?"
  - "How do I keep the original polyline after creating an alignment?"
  - "Which direction does my alignment station from?"
tags: [alignments, convert, polyline, design-criteria]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Creating an Alignment from Objects"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1B4F6F0C-37B1-4A77-9F2A-DB9C12B92D1F
    verified: 2026-05-06
---

> **TL;DR**
> 1. Converts a contiguous chain of polylines, lines, arcs, or splines into an alignment object.
> 2. The pick order at the prompt determines the stationing direction.
> 3. The dialog asks for site, name, type (centerline, offset, curb return, rail), starting station, design criteria, and design check sets.

## When to use

When you already have horizontal geometry — a polyline imported from a survey, an as-built CAD layer, or another consultant's deliverable — and need a Civil 3D alignment built on top of it.

## Workflow

1. Run `CreateAlignmentFromObjects` (Home ribbon → **Alignment** → **Create Alignment from Objects**).
2. Pick the first object near the end you want as **Station 0+00** — pick direction matters.
3. Continue picking adjacent objects, or press Enter to let Civil 3D auto-extend along connected entities.
4. Confirm the proposed direction with the on-screen arrow; press Enter to accept.
5. In the dialog, set **Name**, **Type** (Centerline most common), **Site** (typically `<None>` for road centerlines), **Starting Station**, **Description**.
6. On the **Design Criteria** tab, pick a criteria file (e.g., AASHTO 2018) and tick **Use criteria-based design** + **Use design check set** at design speed (e.g., 35 mph).
7. Tick **Add curves between tangents** if your source has only PI vertices and you want default curves inserted; specify the radius (e.g., 350 ft).
8. Click **OK**. The new alignment is in Prospector and the source objects can optionally be erased.

## Common gotchas

- Ticking **Erase existing entities** removes the source after conversion. If you need a fallback, leave it unticked and clean up later.
- Splines convert poorly — they're approximated as compound curves. If your source has splines, replace them with arcs or use `CreateAlignmentLayout` to draw clean geometry.
- Design-criteria warnings on a converted alignment are common: existing geometry doesn't have to be AASHTO-compliant. Decide whether to ignore (existing) or redesign (proposed).
- Starting-station defaults to `0+00`. Construction projects often need a real beginning station (e.g., `15+50`); set it during creation, not after, to avoid relabeling.

## Related commands

- [CreateAlignmentLayout](createalignmentlayout.md)
- [EditAlignmentGeometry](editalignmentgeometry.md)
- [CreateOffsetAlignment](createoffsetalignment.md)
