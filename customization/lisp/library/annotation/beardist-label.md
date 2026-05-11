---
title: "BEARDIST-LABEL — Bearing + distance label on a picked LINE"
section: customization/lisp/library/annotation
tags: [autolisp, lisp, annotation, bearing-distance, label]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a LINE entity.
> 2. BEARDIST-LABEL drops `Nxx-xx-xxE  dd.dd'` text rotated parallel to the line, offset half a text height to its left.

## Command

`c:BEARDIST-LABEL`

## What it does

Reads the LINE's group 10 (start) and 11 (end) points, computes `angle` and `distance`, converts the angle to a quadrant bearing, and places a TEXT at the midpoint. The text is rotated along the line and flipped 180 deg if the line points into the left half-plane so the label stays readable.

LINE only by design. For polyline-segment labelling, explode the polyline first or extend the routine to use `nentsel` plus a hit-test that walks polyline segments.

## Prompts

1. `Pick line to label (LINE entity):`

## Notes & gotchas

- LINE only. Polyline segments are explicitly rejected with a console hint.
- Drawing units must be decimal feet for the `'` suffix.
- Uses current text style and `DIMTXT` height. Set a survey annotation style and layer before calling.
- The 180-degree flip threshold is at +/-90 degrees; if your office wants north-up rather than parallel-to-line, change the rotation rule.

## Source listing

Full source in [`beardist-label.lsp`](beardist-label.lsp). Core math:

```lisp
(setq dist (distance p1 p2))
(setq ang  (angle p1 p2))
(setq bearing (ang-to-bearing ang))
(setq mid  (polar (polar p1 ang (/ dist 2.0)) (+ ang (/ pi 2.0)) (* ht 0.6)))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Pure AutoLISP. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
