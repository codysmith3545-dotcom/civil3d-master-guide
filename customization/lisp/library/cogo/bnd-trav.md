---
title: "BND-TRAV — Boundary traverse table from a polyline"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, boundary, legal-description, traverse]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `BND-TRAV` writes a CSV table of every course in a closed boundary polyline: course number, from-vertex letter, to-vertex letter, bearing, distance.
> 2. Vertices auto-label A, B, C, ... up to Z, then V26, V27, ... for longer perimeters.
> 3. If the polyline DXF-closed flag is set, the routine adds the closing course from the last vertex back to A.

## Command

`BND-TRAV`

## What it does

Same vertex/segment walk as `INVPLINE`, but the output is structured for inclusion in a legal description draft: courses are numbered 1..N, endpoints are labeled with letters, and bearings are written in survey notation (`N DD-MM-SS E`).

The polyline's DXF 70 closed-flag is honored: if set, a final closing course is appended from the last vertex back to vertex A, **unless** the last vertex coincides with vertex A (in which case there would be no course).

## Prompts

1. **Select closed boundary polyline:** an LWPOLYLINE.
2. **Output CSV path:** absolute path; overwritten.

## Notes & gotchas

- Letters wrap at Z; beyond 26 vertices the labels become `V26`, `V27`, etc. Edit `letter-label` for AA, AB, AC... if you want continued alphabetic labels.
- Bearings are wrapped in CSV double-quotes so embedded commas don't break the table.
- Arc segments are treated as chords. If the boundary has curves, you'll need to label those separately with `CURVELABEL-ALL` and rephrase the legal description accordingly.
- This produces the **data** for a legal description, not the prose. Boilerplate ("THENCE ... a distance of ... feet to a point;") still has to be assembled.
- Closure is not checked; run `TRAVCLOSE` first if the polyline came from field observations.

## Source listing

Source: ./bnd-trav.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
