---
title: "Useful LISP Routines Index"
section: "customization/lisp"
order: 10
visibility: public
tags: [lisp, autolisp, routines, productivity, automation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
---

> **TL;DR**
> 1. LISP routines automate repetitive CAD tasks: freezing/thawing layers, extracting block attributes, reporting polyline data, summing lengths, and dumping point coordinates.
> 2. Most useful routines are short (10-50 lines) and solve a single problem. Build a company library of vetted routines loaded at startup.
> 3. The routines below are starting points — adapt them to your standards and test thoroughly before production use.

## Layer management

### Layer freezer/thawer

Select objects and freeze their layers in one click, or thaw all frozen layers. AutoCAD ships with `LAYFRZ` and `LAYTHW` commands, but a custom LISP can add filtering (e.g., freeze all layers matching a wildcard pattern like `C-STRM-*`).

Approach: use `(ssget)` to select objects, extract the layer name with `(cdr (assoc 8 (entget ent)))`, then set the layer's freeze flag via `(entmod)` on the layer table entry or via `(vla-put-Freeze layer :vlax-true)`.

### Layer state snapshot

Save and restore named layer states for different plan views (existing, proposed, demo, utility). AutoCAD has `LAYERSTATE` / `LayerStateManager`, but a LISP wrapper can create one-click buttons for "show existing only" or "show proposed only."

## Block and attribute tools

### Block attribute extractor

Extract attribute values from all instances of a named block into a CSV or tab-delimited text file. Useful for generating sign schedules, manhole schedules, and utility structure tables.

Approach: iterate a selection set filtered for INSERT entities with the target block name, walk the attribute sub-entities with `(entnext)`, and write values with `(write-line)` to an open file.

### Block counter by name

Count all block insertions grouped by block name. Output a summary table to the command line or a text file.

## Polyline and geometry tools

### Polyline vertex reporter

Select a polyline and list every vertex with its X, Y, Z coordinates, segment length, and cumulative length. Useful for verifying alignments and boundary traverses.

Approach: use `(vlax-curve-getPointAtParam)` to walk the polyline parameters, or extract the DXF group 10 vertex data.

### Total length by layer

Select a set of lines, polylines, and arcs and sum their lengths grouped by layer. Useful for quantity take-offs (linear feet of curb, pipe, fence, etc.).

Approach: `(ssget '((0 . "LINE,LWPOLYLINE,ARC")))`, iterate with `(vlax-curve-getDistAtParam ent (vlax-curve-getEndParam ent))` for total length, group by `(assoc 8)`.

### Polyline area reporter

Select closed polylines and report their areas in square feet and acres with the layer name. Useful for disturbed-area calculations and lot-area checks.

## Point coordinate tools

### Point coordinate dumper

Export Civil 3D COGO point numbers, northings, eastings, elevations, and descriptions to a PNEZD text file. While Civil 3D has built-in point export, a LISP routine can add custom filtering (by point group, by description match, by bounding polyline).

Approach: use `(command "EXPORTPOINTS" ...)` or iterate the point group collection via COM.

### Coordinate labeler

Pick points on screen and place a text or mtext entity showing the N, E, Z coordinates formatted to the project precision. Useful for quick spot-elevation labels on exhibits.

## Text tools

### Text-to-MText converter

Select multiple TEXT entities and convert them to a single MTEXT entity, preserving content, height, and approximate position. The built-in `TXT2MTXT` command does this, but a LISP wrapper can add batch processing and layer filtering.

### Find and replace in attributes

Search all block attributes for a string and replace it — similar to `FIND` but targeted to attributes only and with a summary report of changes made.

## Building a company library

1. Create a shared network folder (e.g., `\\server\cad-standards\lisp\`).
2. Add the folder to Civil 3D's trusted paths and support file search path.
3. Load the library at startup via `acaddoc.lsp` — see [Loading at startup](loading-at-startup.md).
4. Version the library with a changelog file.
5. Test every routine on a copy of a real project before deploying.

## Related

- [Loading at startup](loading-at-startup.md)
- [Common patterns](common-patterns.md)
- [Distributing LISP](distributing-lisp.md)
- [Visual LISP IDE](visual-lisp-ide.md)
