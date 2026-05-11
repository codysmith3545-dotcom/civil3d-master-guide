---
title: "BNDTXT — Write metes-and-bounds .txt from a polyline"
section: customization/lisp/library/parcel
tags: [autolisp, lisp, parcel, metes-and-bounds, export]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick a closed LWPOLYLINE and supply an output path.
> 2. BNDTXT writes a plain-text metes-and-bounds with one "Course n: Nxx-xx-xxE dd.dd'" line per segment.
> 3. Curve segments emit a `CURVE chord ... (bulge ...)` line and need manual radius/arc clean-up.

## Command

`c:BNDTXT`

## What it does

Reads vertex (group 10) and bulge (group 42) data, converts each segment's angle to a quadrant bearing (helper `ang-to-bearing`), and writes a numbered list of courses to a user-named text file. The file begins with `POINT OF BEGINNING:` (the first vertex's NE coordinates) and ends with `TO THE POINT OF BEGINNING.`

This is a starting point for a deed exhibit, not a finished legal description. It does not handle radius/arc-length math for curve segments — those need a Civil 3D parcel label style or a manual pass.

## Prompts

1. `Select closed LWPOLYLINE to describe:`
2. `Output file path (e.g. C:/temp/lot.txt):` — use forward slashes.

## Notes & gotchas

- LWPOLYLINE only.
- Drawing units must be decimal feet; the `'` suffix is hard-coded.
- Output file is overwritten if it exists.
- Curve courses report bulge value as a hint, not a radius. A bulge of 1.0 is a half-circle; the formula is `R = (chord / 2) * (1 + b^2) / (2 * b)`. Add that math if your office needs it.

## Source listing

Full source in [`bndtxt.lsp`](bndtxt.lsp). Output line format:

```
POINT OF BEGINNING: 1234567.890, 9876543.210
  Course 1: N45-12-30E 132.45'
  Course 2: S44-47-30E 250.00'
  Course 3: CURVE chord N12-00-00W 50.00' (bulge 0.1234) - verify radius/arc data
  ...
TO THE POINT OF BEGINNING.
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Pure AutoLISP, no ActiveX. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
