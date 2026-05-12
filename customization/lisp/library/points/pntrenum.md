---
title: "PNTRENUM — Renumber COGO points by selection order"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, cogo, civil3d]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `PNTRENUM` renumbers Civil 3D COGO points in the order you pick them.
> 2. You choose the starting number and increment.
> 3. The routine pre-checks for collisions with existing point numbers and aborts before any change if it would clash.

## Command

`PNTRENUM`

## What it does

Prompts for a selection set of `AECC_COGO_POINT` objects in pick order, asks for a starting number and an increment, computes the resulting numbers, and verifies none of them collide with point numbers already in use **outside** the selection. If there is any collision, the routine aborts cleanly — nothing has been written yet. Otherwise it walks the selection and assigns `Number` via `(vlax-put obj 'Number ...)`.

## Prompts

1. **Select COGO points in the order you want them renumbered:** click points one at a time. Selection order is preserved.
2. **Starting point number:** integer, e.g. `1000`.
3. **Increment <1>:** integer step; press Enter for `1`.

## Notes & gotchas

- **Selection order matters.** Use single-click; a window selection has indeterminate order.
- The collision check excludes the selection itself, so renumbering 100, 101, 102 → 100, 101, 102 (same numbers, different order) is permitted as long as no third point already owns one of those numbers.
- Civil 3D may refuse a write if a point is locked or if the active point group rules block the change. If you see a COM error mid-loop, some points will have been renumbered already — undo the drawing and start over.
- `Number` is stored as a long integer; values above 2^31-1 will error.

## Source listing

Source: ./pntrenum.lsp

## Version compatibility

| Civil 3D version | Status                  |
|------------------|-------------------------|
| 2022             | Assumed (COM stable)    |
| 2024             | Assumed (COM stable)    |
| 2025             | Assumed (COM stable)    |
| 2026             | Assumed (COM stable)    |
