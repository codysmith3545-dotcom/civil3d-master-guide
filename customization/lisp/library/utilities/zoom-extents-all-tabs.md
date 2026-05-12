---
title: "ZOOM-EXTENTS-ALL-TABS — Zoom extents on every layout (and model) tab"
section: customization/lisp/library/utilities
tags: [autolisp, lisp, utilities, zoom, layout, publish]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type ZOOM-EXTENTS-ALL-TABS.
> 2. The routine switches to every layout (and model), runs `ZOOM Extents`, then returns to the originally active tab.

## Command

`c:ZOOM-EXTENTS-ALL-TABS`

## What it does

Iterates `AcadDocument.Layouts`. Each iteration sets `CTAB` to the layout's name, calls `ZOOM E`, and continues. The active tab when the routine started is saved and restored at the end so the user's view does not change.

This is the pre-publish equivalent of clicking each layout tab and pressing `Z E` — useful when sheet thumbnails are stale, a Sheet Set is about to be published, or a layout's PSLTSCALE / viewport zoom is suspected of being off.

## Prompts

None.

## Notes & gotchas

- Affects only the *active drawing*. Pair with `BATCH-SAVE` after running if you also want to save the new view state.
- Each layout's last-used view is overwritten by zoom extents.
- Performance: large drawings with many layouts can take several seconds; AutoCAD regenerates each layout's viewport during the zoom.
- Layouts have a Block table flag; the routine relies on `Layouts.Item` iteration which already exposes them in their saved tab order.

## Source listing

Full source in [`zoom-extents-all-tabs.lsp`](zoom-extents-all-tabs.lsp). Loop:

```lisp
(while (< i n)
  (setq lay (vla-Item layouts i))
  (setq name (vla-get-Name lay))
  (setvar "CTAB" name)
  (command "_.ZOOM" "_E")
  (setq i (1+ i)))
(setvar "CTAB" start)
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Stock layouts collection. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
