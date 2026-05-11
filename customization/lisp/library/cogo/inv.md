---
title: "INV — Inverse between two picked points"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, inverse, bearing, azimuth]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `INV` picks two points and reports bearing (quadrant N/S DDD-MM-SS E/W), horizontal distance, and azimuth.
> 2. Bearings use the U.S. surveyor convention; azimuth is north-clockwise degrees.
> 3. Drawing units assumed to be feet; bearing math is independent of units.

## Command

`INV`

## Conventions

AutoLISP's `(angle p1 p2)` returns radians measured from east, counter-clockwise positive. Survey work uses azimuths measured from **north, clockwise positive**. The conversion is:

```
az_rad = (pi / 2) - a_rad   (then wrap to [0, 2*pi))
```

From azimuth degrees, the quadrant bearing falls out by which 90-degree quadrant the azimuth lives in:

| Azimuth range | Quadrant | Bearing form          |
|---------------|----------|-----------------------|
| 0 to 90       | NE       | N (az) E              |
| 90 to 180     | SE       | S (180 - az) E        |
| 180 to 270    | SW       | S (az - 180) W        |
| 270 to 360    | NW       | N (360 - az) W        |

The routine prints all three numbers so you can pick whichever convention the downstream consumer expects.

## Prompts

1. **From point:** click or type coordinates.
2. **To point:** rubber-band from `From point`.

## Notes & gotchas

- The routine reports planar (2D) distance from `(distance p1 p2)` — AutoLISP's `distance` actually returns 3D if both inputs are 3D, so vertical separation will inflate the value. If you only want horizontal, snap to points whose Z is zero or strip Z manually.
- Seconds are printed to two decimals via `(rtos s 2 2)`. Adjust for your precision spec.
- No state plane or geodetic correction — this is grid bearing, not geodetic.
- Output goes to the command line only; pair with a clipboard utility if you need to paste it.

## Source listing

Source: ./inv.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
