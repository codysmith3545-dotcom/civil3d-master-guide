---
title: "MIDPT-STAKE — Midpoint of two points or a polyline by length"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, stakeout, midpoint]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `MIDPT-STAKE` computes the midpoint of two picked points OR the half-length point along a line/polyline.
> 2. Optionally drops a POINT entity at the result.
> 3. Polyline mode walks segment-by-segment to find the true half-length, not just the midpoint of the endpoint chord.

## Command

`MIDPT-STAKE`

## What it does

Two modes:

- **P (Points)** — average the two clicked points: `((x1+x2)/2, (y1+y2)/2)`.
- **L (Line/polyline)** — for a LINE, the average of endpoints. For an LWPOLYLINE, sum each segment length to get total perimeter, then walk segments until accumulated length reaches half. The midpoint is interpolated within the segment that contains the half-length mark.

After reporting, asks whether to drop a POINT entity at the midpoint.

## Prompts

1. **Mode: [P]oints or [L]ine/polyline midpoint <P>:** P or L.
2. P mode: **First point**, **Second point**.
   L mode: **Select line or polyline**.
3. **Drop POINT entity at midpoint? [Y/N] <N>:** Y to place.

## Notes & gotchas

- Polyline arc segments are treated by their chord length, not their true arc length. Pre-explode if you need arc-aware half-length.
- The dropped POINT respects current point style (`PDMODE`/`PDSIZE`); set those before running if you need a visible cross or X.
- 2D midpoints — Z is dropped.
- Stakeout reality check: real-world midpoint staking usually also wants offsets perpendicular to the line; this routine only gives the on-line midpoint. Use `PERP-STAKE` for offsets.

## Source listing

Source: ./midpt-stake.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
