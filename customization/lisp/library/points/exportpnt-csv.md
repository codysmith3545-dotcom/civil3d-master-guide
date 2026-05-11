---
title: "EXPORTPNT-CSV — Export COGO points with custom field order"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, cogo, export, civil3d, csv]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `EXPORTPNT-CSV` exports COGO points with a field order you specify (e.g. `ENZD`, `PNEZD`, `PENZD`).
> 2. Allowed field codes: `P` (number), `N` (northing), `E` (easting), `Z` (elevation), `D` (description).
> 3. Writes a header row matching the codes you typed.

## Command

`EXPORTPNT-CSV`

## What it does

Same as `EXPORTPNT-PNEZD` but the field order is configurable. You type a code string such as `ENZD` (for a data collector that expects easting first) or `PENZD` (Carlson default). The routine validates each character is one of `P`, `N`, `E`, `Z`, `D` and then writes the CSV with a matching header row.

## Prompts

1. **Field order code:** any combination of `P`, `N`, `E`, `Z`, `D` (case-insensitive). Examples: `PNEZD`, `PENZD`, `ENZD`, `PNE` (no elevation/description).
2. **Output CSV path:** absolute path; overwritten if it exists.

## Notes & gotchas

- Header row uses the literal characters you typed (`P,N,E,Z,D`). If your downstream tool needs spelled-out headers, post-process the file or edit the routine.
- No CSV escaping. If a description contains a comma, the row will be malformed. Strip commas from descriptions or use the PNEZD-only variant for safer output.
- Coordinates at 4 decimal places. Edit `(rtos ... 2 4)` in the helper to change precision.
- Same Civil 3D COM dependency as `EXPORTPNT-PNEZD`.

## Source listing

Source: ./exportpnt-csv.lsp

## Version compatibility

| Civil 3D version | Status                  |
|------------------|-------------------------|
| 2022             | Assumed (COM stable)    |
| 2024             | Assumed (COM stable)    |
| 2025             | Assumed (COM stable)    |
| 2026             | Assumed (COM stable)    |
