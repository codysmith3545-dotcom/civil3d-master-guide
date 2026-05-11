---
title: "LAYXREF-COLOR — Set all xref layers to one color"
section: "customization/lisp/library/layer"
tags: [autolisp, lisp, layer, xref]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `LAYXREF-COLOR` recolors every xref-dependent layer in the current drawing to one AutoCAD Color Index.
> 2. Identifies xref layers by the `|` pipe in the layer name (e.g. `SURVEY|C-TOPO`).
> 3. Honors `VISRETAIN` by going through the native `LAYER` command.

## Command

`LAYXREF-COLOR`

## What it does

Walks the layer table and, for every name containing a pipe character (the AutoCAD convention for xref-dependent layers), issues `_.LAYER _C <color> <name>` to override the color in the host drawing.

Typical use: a surveyor delivers a topo xref with brilliant red/yellow/green layers and you want the underlay to plot as a quiet ACI 8 grey behind your design.

## Prompts

1. **AutoCAD Color Index for all xref layers [1-255]:** an integer 1-255. Common picks: `8` (dark grey), `9` (light grey), `254` (near-white on dark background).

## Notes & gotchas

- Only AutoCAD Color Index is supported. For true color or color-book values, use the `LAYER` dialog or extend this routine with `vla-put-TrueColor`.
- The change is preserved across reloads **only if `VISRETAIN` is set to a value that retains layer property overrides** (the default in modern AutoCAD).
- Run again after binding the xref — once bound, layers are no longer "xref-dependent" by the `|` test, so the routine becomes a no-op for those layers.
- Does not touch the source xref drawing.

## Source listing

Source: ./layxref-color.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
