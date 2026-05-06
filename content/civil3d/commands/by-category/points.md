---
title: "Point commands"
section: "civil3d/commands/by-category"
order: 20
visibility: public
tags: [commands, points, point-groups, description-keys]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D points (COGO points) are a separate object type from AutoCAD `POINT`. They carry number, northing, easting, elevation, raw description, full description, and style references.
> 2. Most operations are driven through the Prospector → Points or Point Groups branches.
> 3. Description keys map raw descriptions like `EP` or `IP` to point styles, label styles, and layers.

## Commands in this category

- `CreatePoints` — see [createpoints.md](../createpoints.md)
- `ImportPoints` — see [importpoints.md](../importpoints.md)
- `ExportPoints` — see [exportpoints.md](../exportpoints.md)
- `EditPoints` — see [editpoints.md](../editpoints.md)
- `CreateDescriptionKeys` — see [createdescriptionkeys.md](../createdescriptionkeys.md)
- `CreatePointGroup` — see [createpointgroup.md](../createpointgroup.md)
- `PointGroupProperties` — open the properties for a single point group.
- `EditPointGroup` — edit query/include/exclude rules.
- `RenumberPoints` — bulk renumber a selection.
- `DatumPoints` — adjust elevations of a selection by a datum delta.
- `LockPoints` / `UnlockPoints` — prevent or allow edits.
- `PointFromCogo` — start the COGO calculator (transient).

## Typical workflow

1. Build a description-key set early so newly-imported points pick up the right styles automatically.
2. Import the points from the surveyor's `.txt` / `.csv`.
3. Verify with `PointGroupProperties` that each group is catching the points you expect.
4. Use `EditPoints` for one-off corrections; use `EditPointGroup` to change behavior for the whole set.

## Related

- [Survey commands](survey.md)
- [Surfaces commands](surfaces.md)
- [Description keys reference](../../points/description-keys.md)
