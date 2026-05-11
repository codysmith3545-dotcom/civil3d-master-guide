---
title: "PNTMOVE-BYELEV — Shift COGO point elevations by a delta"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, cogo, civil3d, elevation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `PNTMOVE-BYELEV` adds a signed delta to the elevation of every selected COGO point.
> 2. Confirm prompt before committing — destructive operation, no undo trail in COM.
> 3. Typical use: resolving a benchmark conflict where the topo is high by 0.43 ft.

## Command

`PNTMOVE-BYELEV`

## What it does

Prompts for a selection of COGO points and a real-number delta. After confirmation, writes `Elevation = Elevation + delta` on each via `vlax-put`. Positive delta raises, negative lowers.

## Prompts

1. **Select COGO points to shift vertically:** window or single picks.
2. **Elevation delta:** signed real number in drawing units (e.g. `-0.43`, `1.250`).
3. **About to shift N point(s) by D. Proceed? [Y/N] <Y>:** Enter to confirm.

## Notes & gotchas

- Civil 3D's `Undo` does typically capture COM-set property changes — but cross-version behavior varies. If you must reverse a bad delta, just run the routine again with the opposite sign.
- Doesn't touch surfaces. Points that are members of a surface still need a surface rebuild to push the new elevations into the TIN.
- Description, raw description, point group membership, and label style are untouched.
- A locked point will throw a COM error; the routine doesn't catch it. Unlock first.

## Source listing

Source: ./pntmove-byelev.lsp

## Version compatibility

| Civil 3D version | Status                  |
|------------------|-------------------------|
| 2022             | Assumed (COM stable)    |
| 2024             | Assumed (COM stable)    |
| 2025             | Assumed (COM stable)    |
| 2026             | Assumed (COM stable)    |
