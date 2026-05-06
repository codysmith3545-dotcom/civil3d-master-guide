---
title: "ExportPoints"
section: "civil3d/commands"
order: 203
visibility: public
command: ExportPoints
category: points
ribbon: "Output tab > Export panel > Export Points (or Toolspace > Prospector > Points > right-click > Export)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [ImportPoints, CreatePoints, EditPoints, CreatePointGroup]
symptoms:
  - "How do I export Civil 3D points to a TXT/CSV?"
  - "How do I export only the points in a specific point group?"
  - "Why are my exported coordinates rounded?"
  - "How do I get a PNEZD file out for the field crew?"
  - "Why does export show fewer points than I expected?"
tags: [points, export, ascii, pnezd, point-file-format]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Exporting point data"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-DA1F3C6E-A5C4-4EAC-BF0B-25C99F38913B
    verified: 2026-05-06
---

> **TL;DR**
> 1. Writes selected points to an ASCII file using a named point file format.
> 2. By default, only points in the chosen point group (or `_All Points`) are exported. Locked points are exported normally.
> 3. Coordinate rounding is controlled by the format's column precision, not by drawing units; pick or build a high-precision format for staking files.

## When to use

When the field crew, contractor, or another consultant needs an ASCII deliverable, or when you want to round-trip points through a tool that only reads text files.

## Workflow

1. From the Output ribbon, click **Export Points**.
2. Pick the format that matches the recipient's expectation (commonly PNEZD comma-delimited).
3. Pick the point group whose points you want to export. The full set is in `_All Points`.
4. Pick the destination filename.
5. If the format strips a column you actually need (e.g., description), pick a different format or define a new one with the columns and precision required.
6. Open the resulting file in a text editor to confirm format and a spot-check row.

## Common gotchas

- The default `PNEZD (comma delimited)` format rounds elevation to three decimals. For machine-control or stake files needing four decimals, define a custom format.
- "Limit to points drawing area" exports only points whose markers fall inside the current drawing extents — unintuitive when you've zoomed.
- Newline conventions are Windows CRLF. Some downstream tools (older data collectors) want bare LF; convert if needed.
- Exporting `_All Points` exports every point in the drawing including survey-locked ones. Filter via a point group if you only want design-side points.

## Related commands

- [ImportPoints](importpoints.md)
- [CreatePoints](createpoints.md)
- [EditPoints](editpoints.md)
- [CreatePointGroup](createpointgroup.md)
