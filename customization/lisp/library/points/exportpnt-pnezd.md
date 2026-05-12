---
title: "EXPORTPNT-PNEZD — Export COGO points to PNEZD CSV"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, cogo, export, civil3d]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `EXPORTPNT-PNEZD` dumps every Civil 3D COGO point to a comma-delimited PNEZD file.
> 2. Coordinates exported at 4-decimal precision in drawing units (typically US survey feet).
> 3. Requires Civil 3D — pure AutoCAD has no `AECC_COGO_POINT` entities.

## Command

`EXPORTPNT-PNEZD`

## What it does

Selects every entity of type `AECC_COGO_POINT` in the drawing using `(ssget "_X" '((0 . "AECC_COGO_POINT")))`, then iterates them via Visual LISP / ActiveX (`vlax-ename->vla-object` + `vlax-get`) to read the COGO point's `Number`, `Northing`, `Easting`, `Elevation`, and `RawDescription` properties. Each becomes one CSV row.

This is a lightweight alternative to Civil 3D's `EXPORTPOINTS` command when you need a quick PNEZD dump and don't want to wrestle with the format-file dialog.

## Prompts

1. **Output PNEZD CSV path:** absolute path. Will overwrite if it exists.

## Notes & gotchas

- **COM coupling.** This routine calls `vla-`/`vlax-` functions on `AECC_COGO_POINT` objects. The property names (`Number`, `Northing`, etc.) are part of the Civil 3D `Aecc.Application` automation surface and have been stable since at least Civil 3D 2018, but Autodesk reserves the right to change them.
- "Raw" description is the field-collected description, not the full description after description-key expansion. Substitute `'FullDescription` if you want the expanded version.
- Drawing units assumed to be feet. Coordinates are written as-is — no unit conversion. If the drawing is metric, headers and consumers must match.
- Decimal precision is hard-coded to 4. Edit the three `(rtos ... 2 4)` calls if your spec differs.
- The exported file uses Windows or Unix line endings depending on how AutoLISP opens the file on your platform; `write-line` writes the platform native sequence.

## Source listing

Source: ./exportpnt-pnezd.lsp

## Version compatibility

| Civil 3D version | Status                  |
|------------------|-------------------------|
| 2022             | Assumed (COM stable)    |
| 2024             | Assumed (COM stable)    |
| 2025             | Assumed (COM stable)    |
| 2026             | Assumed (COM stable)    |
