---
title: "PERP-STAKE — Station and offset from a two-point baseline"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, stakeout, offset, station]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `PERP-STAKE` projects a target point onto a two-point baseline and reports station along and signed offset.
> 2. Sign convention: `R` (right) = positive, `L` (left) = negative, looking from baseline start toward baseline end.
> 3. Loops on target picks; Enter stops.

## Command

`PERP-STAKE`

## Math

Baseline vector `B = (pb - pa)`, with magnitude `len`. Target vector `T = (tgt - pa)`.

- **Station** = projection of `T` onto unit baseline = `(T · B) / len`.
- **Offset magnitude** = perpendicular component = `|T × B| / len` (z-component of 2D cross).
- **Sign** = the sign of `(B × T)` flipped so right-of-baseline is positive in survey convention.

## Prompts

1. **Baseline start (sta 0+00):** click first baseline endpoint.
2. **Baseline end (direction of increasing station):** click second; arrow direction matters.
3. **Target point [Enter to stop]:** click each target; Enter to end.

## Notes & gotchas

- Station can be negative (target behind the baseline start) or greater than baseline length (target past the end). The routine reports them anyway; treat negative stations as "before start of line."
- Baseline must have non-zero length; the routine catches the degenerate case.
- 2D only. Vertical offset is not produced.
- The baseline is a single straight segment. For station/offset against an alignment with multiple PIs, use Civil 3D alignment + station-offset label or the native `StationOffset` reports.
- Sign convention chosen to match U.S. plan-view survey: "to the right of the line when facing forward."

## Source listing

Source: ./perp-stake.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
