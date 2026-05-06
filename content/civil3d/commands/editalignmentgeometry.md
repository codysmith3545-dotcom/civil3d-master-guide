---
title: "EditAlignmentGeometry"
section: "civil3d/commands"
order: 222
visibility: public
command: EditAlignmentGeometry
category: alignments
ribbon: "Alignment contextual ribbon > Modify panel > Geometry Editor"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateAlignmentLayout, CreateAlignmentFromObjects, CreateOffsetAlignment]
symptoms:
  - "How do I change the radius of a curve on an existing alignment?"
  - "How do I add or delete a PI?"
  - "Why is the curve I want to edit greyed out?"
  - "How do I flip an entity from fixed to free?"
  - "Where do I see and clear design-criteria warnings?"
tags: [alignments, edit, geometry, panorama, design-criteria]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Editing Alignment Geometry"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-A8F79E1C-1EBE-4F6E-94B5-0C7E2E1CD9F0
    verified: 2026-05-06
---

> **TL;DR**
> 1. Reopens the Alignment Layout Tools toolbar pointing at an existing alignment for entity-level edits.
> 2. The **Sub-Entity Editor** lets you tweak radius, length, direction, deflection, and design speed per entity.
> 3. The Panorama Events tab shows current criteria violations; clear them by editing geometry or relaxing the check set.

## When to use

When an alignment exists but needs a curve adjusted, a tangent extended, a PI moved, or a spiral added — anything beyond what the in-canvas grips can do cleanly.

## Workflow

1. Select the alignment, then on the contextual ribbon click **Geometry Editor**.
2. The Alignment Layout Tools toolbar reopens. Pick **Pick Sub-Entity** and click on the entity you want to edit.
3. The **Sub-Entity Editor** opens with editable fields for radius, length, direction, deflection.
4. To replace a curve type, delete the old free curve and re-place it (e.g., free spiral-curve-spiral).
5. Watch design-check Events; warnings persist until cleared by an edit or by changing the design speed.
6. Add or remove PIs with the **Insert PI** / **Delete PI** tools on the toolbar.
7. Close the toolbar when finished; downstream profiles, corridors, and offset alignments will mark themselves out of date.

## Common gotchas

- Fixed entities are not editable from the canvas grips, only via the sub-entity editor.
- Editing an alignment that has been published as a data shortcut updates downstream drawings only after `SynchronizeReferences` in those drawings.
- Adding a PI between two existing PIs in a tangent run inserts a kink, not a curve. Add the curve next using a free fillet.
- If the sub-entity editor shows fields greyed out, the field is computed from neighbors (free entities) — change a neighbor instead.

## Related commands

- [CreateAlignmentLayout](createalignmentlayout.md)
- [CreateAlignmentFromObjects](createalignmentfromobjects.md)
- [CreateOffsetAlignment](createoffsetalignment.md)
