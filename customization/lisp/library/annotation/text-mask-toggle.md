---
title: "TEXT-MASK-TOGGLE — Toggle MTEXT background mask"
section: customization/lisp/library/annotation
tags: [autolisp, lisp, annotation, mtext, mask]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Select MTEXT entities.
> 2. If any have a background mask, the routine removes the mask from all. Otherwise, it adds a mask to all using each MTEXT's existing colour/offset defaults.

## Command

`c:TEXT-MASK-TOGGLE`

## What it does

Iterates the selection once to learn the mixed state (any masked? all masked? none masked?). If at least one has `BackgroundFill = :vlax-true` it sets every MTEXT's `BackgroundFill` to `:vlax-false`. Otherwise it sets every MTEXT's `BackgroundFill` to `:vlax-true`, leaving the existing offset and colour as-is (AutoCAD defaults to 1.5x and drawing background).

Toggling is a deliberate "make a decision for me" UX: if your selection is half-and-half, the routine errs toward "remove" so a follow-up call can add fresh masks uniformly.

## Prompts

1. `Select MTEXT to toggle background mask:`

## Notes & gotchas

- MTEXT only. Single-line TEXT does not support a background mask via this property; use a `WIPEOUT` underneath instead.
- This does not change the mask offset or colour. To control those, set `BackgroundFill` then `BackgroundLineMask`/`BackgroundMaskOffset` via the COM API.
- DIMMs, leaders with MText content, and table cells are not handled.

## Source listing

Full source in [`text-mask-toggle.lsp`](text-mask-toggle.lsp). Core toggle:

```lisp
(setq target (if any-masked :vlax-false :vlax-true))
(vla-put-BackgroundFill vobj target)
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | `BackgroundFill` exists on `IAcadMText` since AutoCAD 2007. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
