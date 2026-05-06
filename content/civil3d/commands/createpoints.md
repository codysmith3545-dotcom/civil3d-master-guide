---
title: "CreatePoints"
section: "civil3d/commands"
order: 200
visibility: public
command: CreatePoints
category: points
ribbon: "Home tab > Create Ground Data panel > Points (split button) > Point Creation Tools"
shortcut: "CP (default in aeccland.pgp; conflicts with COPY in stock acad.pgp — verify in current release)"
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [ImportPoints, ExportPoints, EditPoints, CreatePointGroup, CreateDescriptionKeys]
symptoms:
  - "How do I drop a Civil 3D point at a specific northing/easting?"
  - "How do I create points along a polyline at intervals?"
  - "How do I make points on a surface at picked locations?"
  - "Why does my new point not pick up a description-key style?"
  - "How do I number points starting at a specific value?"
tags: [points, cogo, create-points, point-creation-tools]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Civil 3D point creation tools"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7C19D4A2-1B2D-4DB7-83CC-72C4F30C12CD
    verified: 2026-05-06
---

> **TL;DR**
> 1. Opens the Point Creation Tools toolbar with about 25 entry methods (manual, by surface, by alignment, by intersection, etc.).
> 2. Default settings (point identity, point style, label style, layer) are inherited from the toolbar's Point Creation settings, not from the command line.
> 3. Description keys fire only on creation; if a point isn't styling correctly, change the raw description and re-trigger key matching from Prospector.

## When to use

Use `CreatePoints` whenever you need to add COGO points to the drawing through any method other than importing from a file. The toolbar covers manual entry, station/offset, slope, intersection, alignment, and surface-driven point creation.

## Workflow

1. From the Home ribbon, expand the Points split button and pick **Point Creation Tools**, or type `CreatePoints` at the command line.
2. Click the wrench icon on the toolbar to open **Point Creation settings**. Set the next point number, default style, default label style, and layer — these stick for the session.
3. Pick the appropriate creation tool for your task (e.g., **Manual**, **Northing/Easting**, **Station/Offset**, **At Intersection**, **On Surface**).
4. Follow the prompts; description keys are evaluated when each point is created if a key set is enabled in the drawing.
5. To start a new run with different defaults, reopen settings rather than retyping at the prompt — the prompt-overrides expire each cycle.
6. Close the toolbar when finished; new points appear in the All Points list and are eligible for any matching point groups.

## Common gotchas

- The `CP` alias in stock `acad.pgp` is `COPY`. Many shops remap `CP` to `CreatePoints` and `CO` to `COPY`; verify on your install.
- Description-key style assignment happens at creation time. After-the-fact key changes do not retro-style existing points unless you run **Apply Description Keys** from the point group right-click menu.
- "Override default elevation" defaults to "yes" on most tools — pay attention or you will end up with points at elevation 0.
- Points on a locked layer or in a locked point group cannot be created or modified; check Prospector → Points → Locked.

## Related commands

- [ImportPoints](importpoints.md)
- [EditPoints](editpoints.md)
- [CreateDescriptionKeys](createdescriptionkeys.md)
- [CreatePointGroup](createpointgroup.md)
