---
title: "TRAVCLOSE — Traverse closure on a polyline"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, traverse, closure, precision]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `TRAVCLOSE` reports latitude error, departure error, linear misclosure, perimeter, and 1:N precision for the selected polyline.
> 2. Operates on the polyline as drawn: chord legs only — arc bulges are ignored.
> 3. Treats the polyline as open; "gap to start" is also reported so you can spot an unclosed traverse.

## Command

`TRAVCLOSE`

## What it does

Sums per-segment `dx` (departure) and `dy` (latitude) along the polyline. Linear closure is `sqrt(lat^2 + dep^2)`. Precision is reported as `perimeter / closure`, traditionally expressed as `1:N`.

Also prints the distance from the polyline's last vertex back to its first vertex — for a closed-loop traverse where you didn't snap the closing leg exactly to the starting station, this gap value tells you immediately how much you missed by.

## Prompts

1. **Select polyline traverse:** any LWPOLYLINE.

## Notes & gotchas

- Arc bulges ignored. If your traverse has curve legs, decompose them or use Civil 3D parcel topology.
- Open vs. closed: this routine doesn't insist the polyline be closed; it tells you how much it isn't. If you drew the polyline open and the start equals the end you'll get zero "gap to start" and the lat/dep sums equal that gap.
- Precision report rounds to whole feet of the denominator via `(rtos prec 2 0)`. To see the full denominator increase precision.
- This is grid closure. State-plane scale factor, sea-level correction, and instrument errors are out of scope.

## Source listing

Source: ./travclose.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
