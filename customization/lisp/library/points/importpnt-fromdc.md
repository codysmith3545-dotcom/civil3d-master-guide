---
title: "IMPORTPNT-FROMDC — Import data-collector CSV with format auto-detect"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, import, data-collector]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `IMPORTPNT-FROMDC` reads a Trimble / Topcon / Carlson CSV, sniffs the field order, and asks you to confirm.
> 2. Creates AutoCAD `POINT` + `TEXT` entities at each row. Does **not** create Civil 3D COGO points — see Notes for why.
> 3. Auto-detects header rows (non-numeric first field) and skips them.

## Command

`IMPORTPNT-FROMDC`

## What it does

Opens the chosen CSV, reads the first non-blank line, and guesses the format:

- 4 columns → `PNEZ` (point, northing, easting, elevation, no description)
- 5 columns → `PNEZD` if column 2 numerically > column 3 (typical U.S. state plane where N > E), else `PENZD`
- More columns → `PNEZD` and ignore extras

After confirmation, walks every row and drops an AutoCAD `POINT` at (Easting, Northing, Elevation) with a sibling `TEXT` carrying the point number and description.

Heuristic is intentionally simple; users in metric grids, or where state plane easting > northing, must verify the preview before confirming.

## Prompts

1. **Data collector CSV path:** absolute path to the file.
2. After format display, **Proceed? [Y/N] <Y>:** Enter to accept, `N` to abort.

## Notes & gotchas

- **AutoCAD points, not COGO points.** Creating COGO points requires the Civil 3D `Aecc` automation tree, which exposes a `Points` collection on the active document. Pulling that in cleanly cross-version is a larger surface than this library wants to commit to in a single utility — use Civil 3D's native `Points → Import Points` ribbon command for COGO point creation. This routine is for quick visualization or for drawings where COGO objects are not desired.
- Heuristic is fragile when N and E are similar magnitude (rural local coordinates, project-zero systems). Always eyeball the first imported row before trusting the result.
- The CSV parser is naive: it doesn't handle quoted fields, escaped commas, or BOM bytes. Strip those upstream.
- Text label height is hard-coded to 2.0 drawing units. Adjust the `(command "_.TEXT" ...)` line if your scale differs.

## Source listing

Source: ./importpnt-fromdc.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
