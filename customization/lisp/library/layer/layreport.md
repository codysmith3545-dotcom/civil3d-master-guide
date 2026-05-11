---
title: "LAYREPORT — Layer inventory to CSV"
section: "customization/lisp/library/layer"
tags: [autolisp, lisp, layer, csv, audit]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `LAYREPORT` dumps every layer to CSV with color, linetype, frozen/locked/on flags, and the count of entities on that layer.
> 2. Useful for drawing audits — quickly see which standard layers are empty and which non-standard layers have content.
> 3. Counts include both modelspace and paperspace entities via `ssget "_X"`.

## Command

`LAYREPORT`

## What it does

Iterates the LAYER symbol table. For each layer, reads DXF group codes 2 (name), 70 (flag bits), 62 (color, negative if off), and 6 (linetype). Bit 1 of flag = frozen; bit 4 = locked.

Entity count uses `(ssget "_X" '((8 . layer-name)))`, which scans the entire database including all layouts. Total count is appended to the prompt summary.

## Prompts

1. **Output CSV path:** an absolute path the routine can write to. Example: `C:\\temp\\layers.csv`. Use double backslashes when typing at the AutoCAD prompt, or forward slashes.

## Notes & gotchas

- Will silently overwrite an existing file at the path.
- Layers with names containing commas or double-quotes are wrapped in quotes; the routine does not double up embedded quotes — avoid such layer names.
- "Color" is the AutoCAD Color Index (1-255). True color / color-book values are not reported (would need DXF 420/430 from the extended data via `vla-get-TrueColor`).
- Frozen-in-viewport state (`VPFREEZE`) is not in this report. Layer-state snapshots cover that.

## Source listing

Source: ./layreport.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
