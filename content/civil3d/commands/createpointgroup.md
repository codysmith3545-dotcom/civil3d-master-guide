---
title: "CreatePointGroup"
section: "civil3d/commands"
order: 205
visibility: public
command: CreatePointGroup
category: points
ribbon: "Toolspace > Prospector > Point Groups > right-click > New (or Modify tab > Ground Data panel > Points > Point Group)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreatePoints, ImportPoints, CreateDescriptionKeys, CreateSurface]
symptoms:
  - "How do I make a group that holds only my topo points?"
  - "How do I include points by raw description like EP* or BR*?"
  - "How do I use a point group to control which points feed a surface?"
  - "Why are points missing from my point group after import?"
  - "How do I exclude survey-locked points from a point group?"
tags: [points, point-groups, queries, surface-data]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Point Groups"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3D5C2B59-2D7A-43D7-AB48-9F2D9A4C9C0C
    verified: 2026-05-06
---

> **TL;DR**
> 1. A point group is a saved query over the drawing's points. It can also include explicit lists and exclusions.
> 2. Groups are how you feed subsets of points to surfaces, label sets, and exports.
> 3. Order in Prospector matters for style overrides — the first group that contains a point and overrides style wins.

## When to use

Whenever you want to operate on a subset of points repeatedly: feed a surface from `Topo` only, label only `EP*` points, export only `Stake_Out`.

## Workflow

1. Right-click **Point Groups** in Prospector → **New**.
2. On **Information**, name the group (e.g., `Topo-EG`) and pick override styles if you want this group to drive display.
3. On **Include**, define the membership: by point number range, raw description matching with wildcards, elevation range, or full inclusion of another group.
4. On **Exclude**, list anything matching the include but to be filtered (e.g., elevation = 0 to drop bad shots).
5. On **Query Builder**, build a complex AND/OR expression if needed.
6. Click **OK**. The group populates immediately; in Prospector you can drag groups to reorder for style precedence.

## Common gotchas

- Point groups are evaluated lazily — after large imports, right-click the group → **Update** if numbers look off.
- The `_All Points` group cannot be deleted and represents every COGO point.
- Style override at the group level only fires if the group is enabled. Disabling a group keeps the points but stops the override.
- Points can belong to multiple groups; the "draw order" of the groups in Prospector decides which group's style applies.

## Related commands

- [CreatePoints](createpoints.md)
- [ImportPoints](importpoints.md)
- [CreateDescriptionKeys](createdescriptionkeys.md)
- [CreateSurface](createsurface.md)
