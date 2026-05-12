---
title: "BEARLABEL-ALL — Label every straight segment of a polyline"
section: "customization/lisp/library/cogo"
tags: [autolisp, lisp, cogo, label, bearing, annotation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `BEARLABEL-ALL` walks the polyline and drops a midpoint TEXT label on every straight segment.
> 2. Arc segments are skipped — see `CURVELABEL-ALL`.
> 3. Asks for text height; default 2.0.

## Command

`BEARLABEL-ALL`

## What it does

Extracts DXF group-10 vertices and group-42 bulges from the polyline. A bulge of zero means a straight segment; non-zero means an arc. Straight segments get labeled with bearing + distance; arcs are skipped.

Labels are kept upright (flip rotation 180 when segment heading is in the bottom half).

## Prompts

1. **Select polyline to label every straight segment:** an LWPOLYLINE.
2. **Text height <2.0>:** positive real or Enter for default.

## Notes & gotchas

- Bulges are positional in DXF: each group-42 belongs to the immediately preceding group-10. If the polyline was edited with `PEDIT` in unusual ways the bulge order can desync; if you see mislabeled arcs/lines, try explode-then-rejoin first.
- Doesn't dedup against existing labels — running twice creates duplicates.
- Labels go on the current layer. Set a label layer before running.
- For Civil 3D parcels and alignments, the native Add Line/Curve Labels tools produce dynamic labels — this routine produces dumb TEXT, which is fine for exhibits but doesn't update on geometry edit.

## Source listing

Source: ./bearlabel-all.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
