---
title: "Plan production commands"
section: "civil3d/commands/by-category"
order: 110
visibility: public
tags: [commands, plan-production, view-frames, sheets, sheet-set]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Plan production turns an alignment into a series of plan, profile, or plan-and-profile sheets driven by view frames.
> 2. View frames + match lines come first (`CreateViewFrames`); then sheets are generated into a Sheet Set (`CreateSheets`).
> 3. The output uses templates with named viewports keyed by `ViewportType` (Plan, Profile, Plan-Profile).

## Commands in this category

- `CreateViewFrames` — see [createviewframes.md](../createviewframes.md)
- `CreateSheets` — see [createsheets.md](../createsheets.md)
- `EditViewFrameGroupProperties` — change template, sheet size, alignment.
- `CreateMatchLines` — usually placed automatically by `CreateViewFrames`; can be regenerated here.
- `EditMatchLineProperties` — adjust station, masking, label style.
- `RepathSheetSet` — fix broken references to drawing or template files after a folder move.

## Typical workflow

1. Set up a sheet template with named viewports (Plan, Profile, Plan-Profile).
2. Run `CreateViewFrames`, picking the alignment, station range, sheet template, and viewport scale.
3. Inspect match lines — adjust stationing if a match line lands on a critical feature.
4. Run `CreateSheets` to build the .DST sheet set and source drawings.
5. Open the Sheet Set Manager (`SSM`) to publish the bound set.

## Related

- [Plan production workflows](../../plan-production/index.md)
- [Plot / sheet commands](plot.md)
- [Profile commands](profiles.md)
