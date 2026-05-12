---
title: "TRAV — Interactive traverse entry"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, traverse, bearing]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `TRAV` builds a polyline by typing bearing + distance pairs in survey notation (`N 12-34-56 E`, distance).
> 2. Type `C` to close back to the start; press Enter on a bearing prompt to stop.
> 3. Uses U.S. quadrant bearings; degrees-minutes-seconds separated by hyphens.

## Command

`TRAV`

## What it does

Asks for a starting point, then loops:

1. Bearing prompt — accepts `N|S DDD-MM-SS E|W` (case-insensitive, whitespace flexible).
2. Distance prompt — positive real.

For each pair it converts to an AutoLISP angle (east-zero, CCW radians) and walks to the next point via `(polar cur angle distance)`. When the user types `C` (close) or presses Enter, the accumulated point list is drawn as an LWPOLYLINE via the native `PLINE` command.

## Prompts

1. **Start point:** click or type coordinates.
2. Loop:
   - **Bearing [Enter=stop / C=close]:** survey-format bearing or `C` to close back to start.
   - **Distance:** positive real.

## Notes & gotchas

- Bearing parser is strict: exactly three whitespace-separated tokens, middle token has exactly three hyphen-separated numeric parts. Variants like `N12d34'56"E` are **not** accepted.
- Seconds may be fractional (`12-34-56.78`).
- `C` (close) appends the start point as the last vertex but does **not** mark the polyline closed in DXF — visually closed only. If you need a DXF-closed shape, use `PEDIT _Close` afterward.
- No closure check; use `TRAVCLOSE` on the resulting polyline.
- Drawn polyline goes on the current layer with default lineweight.

## Source listing

Source: ./trav.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
