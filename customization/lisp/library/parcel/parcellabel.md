---
title: "PARCELLABEL — Lot number, area, and perimeter bearing/distance labels"
section: customization/lisp/library/parcel
tags: [autolisp, lisp, parcel, label, bearing-distance]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a closed LWPOLYLINE and type a lot number.
> 2. PARCELLABEL drops a centroid MText (lot #, sq ft, ac) and a bearing+distance TEXT alongside every perimeter segment.
> 3. Bearings are quadrant-style (`N45-12-30E`), distances are decimal feet.

## Command

`c:PARCELLABEL`

## What it does

This is a quick deed-exhibit style label builder. It reads the closed polyline's area via the ActiveX `Area` property, then walks each segment vertex by vertex. For each segment it computes the bearing from AutoLISP's east-zero, CCW radian angle (returned by `angle`), converts to north-zero CW azimuth, and formats as a quadrant bearing (`Nxx-xx-xxE`). Distance comes from `(distance p1 p2)`.

Each segment label is placed at the segment midpoint, offset perpendicular to the segment by 0.6 of the current `DIMTXT` height, and rotated parallel to the segment so the label reads along the line.

LWPOLYLINE only — POLYLINE (heavy) is not supported. Arc segments in the polyline are labelled as if they were chords; do not use this on a polyline that contains curves. See BNDTXT for a metes-and-bounds writer that handles curve callouts.

## Prompts

1. `Select closed lot polyline:`
2. `Lot number/label:` — free-form string (e.g. `1`, `A`, `1-R`).

## Notes & gotchas

- Polyline must be straight-segment LWPOLYLINE. Curve bulges are ignored.
- AutoLISP `angle` returns radians, 0 = east, counter-clockwise. The helper `ang-to-bearing` converts to a north-zero, CW quadrant bearing.
- Drawing units must be decimal feet for the `sq ft` / `ac` literals to be correct.
- Labels are drawn on the current layer and current text style. Pre-set `CLAYER` and `TEXTSTYLE` to your annotation defaults.
- For production Civil 3D parcel labels (with style + label style), use Toolspace > Prospector > Parcels and a real Parcel Label Style instead.

## Source listing

Full source is in [`parcellabel.lsp`](parcellabel.lsp) alongside this file. The two key helpers:

```lisp
;; AutoLISP angle (radians, 0=east, CCW) -> Nxx-xx-xxE quadrant bearing string
(defun ang-to-bearing (a / az ns ew d deg mn sc rest str)
  (setq az (- (/ pi 2.0) a))                       ; rotate so 0=north, CW
  (while (< az 0) (setq az (+ az (* 2 pi))))
  (while (>= az (* 2 pi)) (setq az (- az (* 2 pi))))
  (cond
    ((and (>= az 0)          (< az (/ pi 2.0))) (setq ns "N" ew "E" d az))
    ((and (>= az (/ pi 2.0)) (< az pi))         (setq ns "S" ew "E" d (- pi az)))
    ((and (>= az pi)         (< az (* 1.5 pi))) (setq ns "S" ew "W" d (- az pi)))
    (T                                          (setq ns "N" ew "W" d (- (* 2 pi) az))))
  (setq deg (fix (* d (/ 180.0 pi))))
  (setq rest (* (- (* d (/ 180.0 pi)) deg) 60.0))
  (setq mn (fix rest))
  (setq sc (* (- rest mn) 60.0))
  (strcat ns (itoa deg) "-"
          (if (< mn 10) "0" "") (itoa mn) "-"
          (if (< sc 10) "0" "") (rtos sc 2 1) ew))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla LISP + ActiveX `Area` only. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
