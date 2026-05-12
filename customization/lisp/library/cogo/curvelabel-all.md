---
title: "CURVELABEL-ALL — Label every arc segment of a polyline"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, label, arc, curve]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `CURVELABEL-ALL` walks an LWPOLYLINE and labels every non-zero-bulge segment with R, L, Delta.
> 2. Bulge math: `delta = 4 * atan(bulge)`, `radius = chord / (2 * sin(delta/2))`.
> 3. Skips straight legs — pair with `BEARLABEL-ALL`.

## Command

`CURVELABEL-ALL`

## What it does

Reads each pair of adjacent vertices plus the bulge value associated with the first of the pair. A bulge is `tan(delta/4)` where `delta` is the included angle of the arc; positive bulge = arc to the left of the chord direction, negative = arc to the right. From bulge and chord length the routine recovers radius, arc length, and the midpoint of the arc (offset from the chord midpoint by the sagitta, on the convex side).

Labels use the same format as `CURVELABEL`: `R=... L=... \Delta=DD-MM-SS`.

## Prompts

1. **Select polyline:** an LWPOLYLINE.
2. **Text height <2.0>:** positive real.

## Notes & gotchas

- Polylines with no bulge data (every segment straight) get a short "no arcs" message.
- Bulge sign: convex direction is automatic from the bulge sign; the label still uses positive delta in the output (typical of survey labeling).
- For an EWP (elevated working point) curve table workflow, this gives you per-curve numbers fast; transcribe to your table.
- Mathematical edge case: bulge near zero but not exactly zero (e.g. 1e-10 leftover from rounding) is still treated as an arc. Threshold-check if you see spurious labels on near-straight segments.

## Source listing

Source: ./curvelabel-all.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
