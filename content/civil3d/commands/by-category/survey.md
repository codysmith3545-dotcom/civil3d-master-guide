---
title: "Survey commands"
section: "civil3d/commands/by-category"
order: 10
visibility: public
tags: [commands, survey, fbk, figures, linework, survey-database]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Survey work in Civil 3D revolves around the survey database (`.sdb`), figures, and field-book (FBK) imports.
> 2. The Survey ribbon tab and the Survey toolspace work hand-in-hand. Most commands here are also reachable from the toolspace right-click menus.
> 3. Coordinate geometry, traverse adjustment, and figure prefix databases are managed inside the survey database, not in drawing.

## Commands in this category

These are the commands you reach for during day-to-day survey processing. Many have only a toolspace entry point.

- `CreatePoints` — see [createpoints.md](../createpoints.md)
- `ImportPoints` — see [importpoints.md](../importpoints.md)
- `ExportPoints` — see [exportpoints.md](../exportpoints.md)
- `EditPoints` — see [editpoints.md](../editpoints.md)
- `CreateDescriptionKeys` — see [createdescriptionkeys.md](../createdescriptionkeys.md)
- `CreatePointGroup` — see [createpointgroup.md](../createpointgroup.md)
- `OpenSurveyToolspace` — opens the Survey tab in Toolspace.
- `CreateSurveyDB` — creates a new local survey database.
- `ImportSurveyData` — imports a field book, LandXML survey, or points file into the active survey database.
- `EditFigureStyle` — edits how survey figures plot.
- `CreateFigureFromObject` — converts polylines/feature lines to survey figures stored in the database.
- `InsertFigure` — inserts a figure stored in the database into the drawing.
- `RunNetworkAdjustment` — least-squares network adjustment inside the survey database (verify in current release).

## Typical workflow

1. Create or open a survey database from the Survey toolspace.
2. Import the FBK that the field crew exported from your data collector software.
3. Inspect figures, linework, and points; resolve any prefix-database mismatches.
4. Insert figures and points into the drawing as needed.
5. Build a surface from the survey points and breaklines (figures with `B` flag).

## Related

- [Survey workflows](../../survey/index.md)
- [Description keys](../../points/description-keys.md)
- [Point commands](points.md)
- [Surface commands](surfaces.md)
