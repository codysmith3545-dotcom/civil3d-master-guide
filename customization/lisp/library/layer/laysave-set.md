---
title: "LAYSAVE-SET / LAYREST-SET — Named layer state save and restore"
section: "customization/lisp/library/layer"
tags: [autolisp, lisp, layer, layer-state]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `LAYSAVE-SET` snapshots the current layer state under a name; `LAYREST-SET` restores it.
> 2. Thin wrappers around `LAYERSTATE` so they can be macroed onto a toolbar.
> 3. Captures on/off, freeze/thaw, color, linetype, lineweight, plot style, and viewport freeze.

## Command

`LAYSAVE-SET` and `LAYREST-SET`.

## What it does

Defers to AutoCAD's built-in `LAYERSTATE` command. Two single-purpose wrappers are easier to bind to toolbar buttons or aliases than feeding the multi-option dialog every time.

`LAYSAVE-SET` prompts for a name (and an optional description) and snapshots all layer properties currently in effect for the active layout. `LAYREST-SET` restores a previously saved state by name.

## Prompts

`LAYSAVE-SET`:

1. **Name for new layer state:** any string, must be unique in the drawing.
2. **Description (optional):** press Enter to skip.

`LAYREST-SET`:

1. **Layer state to restore:** name of a previously saved state. No autocomplete — type carefully.

## Notes & gotchas

- Layer states live in the drawing. To share them between drawings, use `LAYERSTATE` and choose Export to write a `.las` file.
- Restoring a state in a different layout than where it was saved may reset viewport-freeze unexpectedly. Save and restore in the same layout.
- If a layer in the saved state has been deleted from the drawing, AutoCAD will report a warning but still restore the rest.
- These wrappers don't expose every `LAYERSTATE` flag (e.g. "restore as overrides"). Use the dialog when you need finer control.

## Source listing

Source: ./laysave-set.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
