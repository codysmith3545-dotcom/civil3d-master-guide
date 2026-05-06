---
title: "CreateAlignmentLayout"
section: "civil3d/commands"
order: 221
visibility: public
command: CreateAlignmentLayout
category: alignments
ribbon: "Home tab > Create Design panel > Alignment > Alignment Creation Tools"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateAlignmentFromObjects, EditAlignmentGeometry, CreateOffsetAlignment]
symptoms:
  - "How do I draw a fresh alignment from PI to PI?"
  - "How do I add curves with specific radii between tangents?"
  - "How do I make the alignment respect AASHTO design criteria as I draw?"
  - "What's the layout toolbar with arrows and curves icons?"
  - "How do I draw spirals or compound curves?"
tags: [alignments, layout, design-criteria, free-curve, fixed-curve]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Alignment Layout Tools"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7D7A6C95-1A1A-4BAA-B44D-2A5A3A9B4FFF
    verified: 2026-05-06
---

> **TL;DR**
> 1. Opens the Alignment Layout Tools toolbar so you can draw an alignment from PI to PI with full control over tangent/curve/spiral entity types.
> 2. Entity types are **fixed** (defined absolutely, e.g., a curve through three points), **floating** (defined relative to one neighbor), and **free** (filleted between two neighbors).
> 3. Design criteria and check sets, attached at the alignment level, flag entities below minimum radius or curve length at design speed.

## When to use

When designing new horizontal geometry and you want curve-by-curve control instead of converting a polyline.

## Workflow

1. Run `CreateAlignmentLayout` (Home ribbon → **Alignment** → **Alignment Creation Tools**).
2. Fill in the dialog: **Name**, **Type** (Centerline), **Site**, **Starting Station** (e.g., `10+00`), **Description**.
3. On Design Criteria tab, pick a criteria file (AASHTO Greenbook 2018) and design speed (e.g., 35 mph). Tick check sets for Indiana INDOT or other.
4. Click **OK**. The Alignment Layout Tools toolbar appears.
5. Pick **Tangent-Tangent (No curves)** for quick PI placement, then come back and use **Free Curve Fillet (between two entities, radius)** to fillet curves with specific radii.
6. For spiral-curve-spiral entries, pick **Free Spiral-Curve-Spiral** and provide the in-spiral length, radius, out-spiral length.
7. Watch the Panorama (Events) for design-criteria violations as you draw.
8. Close the toolbar when finished; the alignment is in Prospector.

## Common gotchas

- Fixed and floating entities will not move when you edit a neighbor; only free entities re-solve. Most design alignments use free curves between fixed/floating tangents.
- "Tangent-Tangent (with curves)" inserts default curves at every PI using the radius set in the toolbar settings. The default radius rarely matches your design — set it before placing PIs.
- The Panorama "Events" tab is where design check warnings appear. If you don't see violations, confirm a design check set is attached.
- Starting station and station equations cannot be set on the layout toolbar after the fact — open Alignment Properties → Station Control.

## Related commands

- [CreateAlignmentFromObjects](createalignmentfromobjects.md)
- [EditAlignmentGeometry](editalignmentgeometry.md)
- [CreateOffsetAlignment](createoffsetalignment.md)
