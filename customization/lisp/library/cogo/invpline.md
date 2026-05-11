---
title: "INVPLINE — Inverse along a polyline, dump to file"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, inverse, polyline, traverse]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `INVPLINE` walks an LWPOLYLINE vertex by vertex and writes a CSV with bearing, distance, and cumulative distance per segment.
> 2. Pair this with `TRAVCLOSE` to inspect a closed traverse.
> 3. **Treats arc segments by their chord.** Use `CURVELABEL-ALL` for arc-aware reporting.

## Command

`INVPLINE`

## What it does

Pulls every DXF group-10 vertex from the selected polyline, walks adjacent pairs, computes bearing + distance, and writes a CSV row per segment. Cumulative distance accumulates so you can see total perimeter at the last row.

## Prompts

1. **Select polyline:** click an LWPOLYLINE (regular 2D polyline). Old-style heavy POLYLINEs are not supported.
2. **Output TXT path:** absolute path; overwritten if it exists.

## Notes & gotchas

- Arc bulges are ignored — bearings are chord bearings. If your polyline has curves and you need true arc geometry, use `CURVELABEL-ALL` or operate on a Civil 3D parcel.
- Distances are 2D planar from `(distance p1 p2)`; vertex Z is not in DXF group 10 of LWPOLYLINEs (those are 2D by definition; the polyline elevation lives in DXF 38).
- Header row is written; downstream Excel users get clean column names.
- Bearings written with embedded double quotes so commas inside (like `N 12-34-56 E`) don't split the CSV cells.

## Source listing

Source: ./invpline.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
