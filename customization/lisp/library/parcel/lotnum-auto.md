---
title: "LOTNUM-AUTO — Auto-number selected lots along a frontage line"
section: customization/lisp/library/parcel
tags: [autolisp, lisp, parcel, numbering]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Select all closed lot polylines, pick a frontage line, pick a starting number.
> 2. LOTNUM-AUTO sorts the lots by their projected position on the frontage line and labels each centroid with `LOT n`.

## Command

`c:LOTNUM-AUTO`

## What it does

Each lot's bounding-box midpoint is projected onto the user-picked frontage vector by computing the scalar projection `(mid - p1) . (p2 - p1)`. The lots are then sorted by that scalar so lot 1 is closest to `p1` and lot N is closest to `p2`. Each gets an MText label `LOT n` at the bounding-box midpoint, on the current layer, at `DIMTXT` height.

This is a quick subdivision-exhibit helper. It does not create Civil 3D parcels, link to a parcel label style, or update an existing label.

## Prompts

1. `Select closed lot polylines to number:` — ssget filtered to closed LWPOLYLINEs.
2. `Pick start point of frontage line:`
3. `Pick end point of frontage line:`
4. `Starting lot number <1>:`

## Notes & gotchas

- The frontage line is used only as a direction reference for sorting. The lots do not need to touch it.
- Re-running on the same lots will stack new labels on top of old ones. Erase prior labels first.
- LWPOLYLINE only.

## Source listing

Full source is in [`lotnum-auto.lsp`](lotnum-auto.lsp).

```lisp
(setq along
  (+ (* (- (car mid) (car p1)) (- (car p2) (car p1)))
     (* (- (cadr mid) (cadr p1)) (- (cadr p2) (cadr p1)))))
;; sort all lots by this scalar to get along-frontage order
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla LISP only. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
