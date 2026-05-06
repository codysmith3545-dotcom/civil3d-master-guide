---
title: "Plot and sheet commands"
section: "civil3d/commands/by-category"
order: 140
visibility: public
tags: [commands, plot, publish, page-setup, sheet-set, batch-plot]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Production output goes through `PLOT` (single sheet) or `PUBLISH` / Sheet Set Manager (batch). Page setups encapsulate plotter, paper, plot style, and area.
> 2. Use a named page setup imported from a master template so every layout plots identically.
> 3. PDF output is normally `DWG to PDF.pc3` or `AutoCAD PDF (High Quality Print).pc3`. For sealed deliverables, use a known-good plot style table (CTB or STB).

## Commands in this category

- `PLOT` — single layout plot dialog.
- `PUBLISH` — batch plot multiple layouts/sheet sets.
- `PAGESETUP` — page setup manager for the current layout.
- `BATCHPLOT` — alias to publish workflow on some releases.
- `PLOTSTAMP` / `PLOTSTAMPON` — adds a configurable footer to plots.
- `EXPORTPDF` — direct PDF export of the active layout (release-dependent).
- `EXPORTDWFX` / `3DDWFPUBLISH` — DWFx / DWF outputs.
- `OPENSHEETSET` (`SSM`) — open the Sheet Set Manager.
- `STYLESMANAGER` — manage CTB/STB plot style tables.
- `PUBLISHCOLLATE` — control whether multi-sheet PDF combines into one file.

## Typical workflow

1. Build a master page-setup template DWG with company-standard setups (11x17 PDF, 24x36 PDF, plotter, full-bleed, etc.).
2. In each project drawing, `PAGESETUP` → Import — pull the named setups from the master.
3. For a single sheet, `PLOT` and pick the named setup.
4. For a sheet set, `OPENSHEETSET` and Publish; tick "Publish to PDF" with collation as needed.
5. Stamp output with `PLOTSTAMP` if reviewers require a date/file path footer.

## Related

- [Plan production commands](plan-production.md)
- [Drafting and annotation commands](drafting.md)
- [Plan production workflows](../../plan-production/index.md)
