---
title: "RADIALSTAKE — Radial stakeout report from a base + backsight"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, stakeout, field]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `RADIALSTAKE` produces a per-target row of distance, azimuth, and angle-right-from-backsight, ready for the field.
> 2. Pick base, backsight, then target points one at a time. Enter on the target prompt stops.
> 3. Output is a CSV.

## Command

`RADIALSTAKE`

## What it does

Acts like a total-station setup in reverse: from a known base and known backsight, the routine computes for each target:

- Horizontal distance from base.
- Azimuth (north-clockwise) from base to target.
- Angle right — the clockwise turn from the backsight direction to the target direction, normalized to `[0, 360)`.

Results print to the command line for in-the-moment checks and write to a CSV for transferring to the data collector.

## Prompts

1. **Base setup point:** click or coordinates.
2. **Backsight point:** click or coordinates.
3. **Output TXT path:** absolute path.
4. **Target point Tn [Enter to stop]:** click each target; Enter to end.

## Notes & gotchas

- Angle right is normalized to a positive turn `[0, 360)`. If your field convention prefers shortest turn (signed +/- 180), modify the normalization.
- Distances are 2D planar. Vertical component is not produced.
- No instrument-height or rod-height handling — you handle that in the field.
- Targets are stored as T1, T2... Rename in the CSV if you have point IDs.
- This is a planning tool, not a control-network adjustment tool. No least-squares.

## Source listing

Source: ./radialstake.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
