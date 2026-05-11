---
title: "PNTCHK-DUP — Find duplicate COGO point numbers"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, cogo, civil3d, audit]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `PNTCHK-DUP` reports any COGO point number that appears more than once in the drawing.
> 2. Civil 3D normally prevents duplicates, but legacy merges and `_ImportPoints` from corrupt files can sneak them in.
> 3. Read-only: only reports, never deletes.

## Command

`PNTCHK-DUP`

## What it does

Collects every COGO point's `Number` property, sorts the list, and walks it once looking for adjacent equal values. Each duplicated number is reported.

## Prompts

None.

## Notes & gotchas

- This finds duplicate **numbers**, not duplicate coordinates. Two points at the same XYZ with different numbers are not "duplicates" by this measure — use a coincident-point check for that.
- If duplicates exist, Civil 3D's behavior for `Points` collection lookups becomes undefined; fix duplicates by either deleting the spurious points or renumbering with `PNTRENUM`.
- Large drawings (>50 000 points) — the sort is O(n log n), still fast, but the initial `ssget` allocation grows with point count.

## Source listing

Source: ./pntchk-dup.lsp

## Version compatibility

| Civil 3D version | Status                  |
|------------------|-------------------------|
| 2022             | Assumed (COM stable)    |
| 2024             | Assumed (COM stable)    |
| 2025             | Assumed (COM stable)    |
| 2026             | Assumed (COM stable)    |
