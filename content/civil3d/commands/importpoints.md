---
title: "ImportPoints"
section: "civil3d/commands"
order: 202
visibility: public
command: ImportPoints
category: points
ribbon: "Insert tab > Import panel > Points from File (or Toolspace > Prospector > Points > right-click > Import)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreatePoints, ExportPoints, CreateDescriptionKeys, CreatePointGroup]
symptoms:
  - "How do I bring an ASCII point file into Civil 3D?"
  - "Which point file format do I pick — PNEZD, PENZD, NEZ?"
  - "Why are my imported points all at the wrong elevation?"
  - "How do I add the imported points to a point group automatically?"
  - "How do I import points into the survey database instead of the drawing?"
tags: [points, import, ascii, pnezd, point-file-format]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Importing point data"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-09F3893E-9C0D-4B92-A66D-44E1FFFE1A5C
    verified: 2026-05-06
---

> **TL;DR**
> 1. Imports points from an ASCII file (`.txt`, `.csv`, `.prn`) using a named point file format (e.g., `PNEZD (comma delimited)`).
> 2. Pick or create a format that matches the column order in your file. Wrong format means swapped N/E or missing description.
> 3. Can add the imported points to a target point group on the way in — useful for keeping every import isolated.

## When to use

When the field crew or another consultant delivers a point file, or when you need to merge points from another drawing exported earlier.

## Workflow

1. Confirm the source file's column order. Open the file in a text editor — common patterns are `PNEZD` (point, northing, easting, elevation, description) and `PENZD`.
2. Run `ImportPoints` (Insert ribbon → **Points from File**).
3. Click the **+** to add a source file; pick a matching format from the dropdown. If none fits, click the new-format button and define one.
4. Optionally tick **Add Points to Point Group** and pick or create a group like `Imported_2026-05-06`.
5. Optionally tick **Advanced Options** to do coordinate transformation or zero elevations replaced with surface elevation.
6. Click **OK**. Inspect the resulting points in Prospector → Points and confirm count and a spot-check coordinate.

## Common gotchas

- Most U.S. survey files are PNEZD comma-delimited; engineering exports may be PENZD. Wrong format swaps northings and eastings — points land in the wrong hemisphere.
- The point file format must include a description column for description keys to fire. If your file lacks descriptions, points come in styled by drawing default.
- Importing a duplicate point number prompts you to renumber, merge, or skip. "Merge" overwrites coordinates of the existing point.
- Survey database imports use a different command path (`ImportSurveyData`) and do not touch the drawing's COGO point list directly.

## Related commands

- [CreatePoints](createpoints.md)
- [ExportPoints](exportpoints.md)
- [CreateDescriptionKeys](createdescriptionkeys.md)
- [CreatePointGroup](createpointgroup.md)
