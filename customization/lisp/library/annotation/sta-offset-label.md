---
title: "STA-OFFSET-LABEL — Station + offset labels from a reference polyline"
section: customization/lisp/library/annotation
tags: [autolisp, lisp, annotation, station-offset]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a reference polyline (the "alignment").
> 2. Pick any number of points to label.
> 3. Each label reads `STA xx+xx.xx OFF yy.yy R/L`.

## Command

`c:STA-OFFSET-LABEL`

## What it does

The reference can be any curve-like entity: LINE, LWPOLYLINE, POLYLINE, ARC, or SPLINE. For each pick, the routine uses the ActiveX `vlax-curve-*` helpers to find the closest point on the curve, the parameter at that point, and the distance along the curve (raw station from the curve start). Offset is the 2D distance between the pick and the closest point on the curve. Side is determined by the sign of the 2D cross product of the curve's tangent vector at that station with the pick-minus-closest vector — positive => left, negative => right.

The label is an MText drawn at the pick point, using the current `DIMTXT` height.

## Prompts

1. `Select reference alignment polyline:`
2. `Pick point to label (Enter to quit):` (loops)

## Notes & gotchas

- This is *not* a real Civil 3D Alignment label. Real Alignments support station equations, design speed labels, regions, etc. — use ADDLABELS for those.
- Station starts at 0 at the polyline's start vertex. Reverse the polyline first if your stationing should run the other way, or add a station-offset constant.
- Drawing units must be decimal feet for `xx+xx.xx` format to make sense.
- Endpoint+intersection osnaps are forced on during the loop so picks snap cleanly.

## Source listing

Full source in [`sta-offset-label.lsp`](sta-offset-label.lsp). Side detection:

```lisp
(setq side
  (if (> (- (* (cos ang) (- (cadr p) (cadr pAt)))
            (* (sin ang) (- (car p)  (car pAt))))
         0.0)
    "L" "R"))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | `vlax-curve-*` functions are stable across versions. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
