---
title: "EditPoints"
section: "civil3d/commands"
order: 201
visibility: public
command: EditPoints
category: points
ribbon: "Modify tab > Ground Data panel > Points > Edit Points (or right-click a point group in Prospector > Edit Points)"
shortcut: "EP (default in aeccland.pgp — verify in current release)"
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreatePoints, ImportPoints, ExportPoints, CreatePointGroup]
symptoms:
  - "How do I change a point's elevation, description, or coordinates?"
  - "How do I bulk-edit point descriptions for a whole group?"
  - "Why is my point greyed out and uneditable?"
  - "How do I renumber a range of points?"
  - "How do I unlock a point so I can move it?"
tags: [points, edit-points, panorama, prospector]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Editing COGO Points"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3F5D8C39-2D80-44E0-B0F4-1B30D31E3D9A
    verified: 2026-05-06
---

> **TL;DR**
> 1. Opens the selected points in the Panorama Point Editor where number, location, elevation, raw/full description, and styles are editable.
> 2. Locked points and points belonging to a locked point group are read-only; unlock first.
> 3. Edits made here cannot be undone with `U` reliably across sessions; lean on point groups + description keys instead of bulk hand-edits.

## When to use

When you need to change properties of one or several points without re-importing, especially elevation corrections, description fixes, or point renumbering.

## Workflow

1. Select the point(s) in the drawing, or right-click a point group in Prospector → **Edit Points**.
2. Run `EditPoints` (or it auto-opens after the right-click). Panorama opens with one row per point.
3. Edit any column. Locked rows are flagged and cannot be edited until unlocked.
4. To unlock, right-click → **Unlock**. The lock state is per-point.
5. For bulk renumber, select a range of rows, right-click → **Renumber**, and provide the additive delta or new starting number.
6. Close Panorama; changes persist immediately.

## Common gotchas

- Points are locked from the source — survey database points show as locked in the working drawing. To edit, work in the survey database, not in the drawing.
- Editing a point's coordinates does not move dependent objects automatically (e.g., a feature line that was drawn to that elevation). Rebuild surfaces and feature lines after coordinate edits.
- Renumbering a point that is referenced by a point label override or a label expression can break that label. Search for hard-coded references before renumbering.
- The Panorama editor is modeless; if you Escape out you may lose unsaved column edits in the active row.

## Related commands

- [CreatePoints](createpoints.md)
- [ImportPoints](importpoints.md)
- [ExportPoints](exportpoints.md)
- [CreatePointGroup](createpointgroup.md)
