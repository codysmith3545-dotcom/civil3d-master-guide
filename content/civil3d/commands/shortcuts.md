---
title: "Civil 3D Keyboard Shortcuts & Aliases"
section: "civil3d/commands"
order: 5
visibility: public
tags: [commands, shortcuts, aliases, pgp]
updated: 2026-05-06
---

> **TL;DR**
> 1. AutoCAD shortcuts come from `acad.pgp`. Civil 3D-specific aliases live in `aeccland.pgp`. Both are plain-text command-alias files.
> 2. Edit them with `EDITALIASES` (Express Tools) or directly in `%APPDATA%\Autodesk\<release>\enu\Support\`. Run `REINIT` after editing to pick up changes without restart.
> 3. Aliases are per-user; deploy a company-standard PGP through your Civil 3D deployment package or a startup script.

## File locations

- **AutoCAD aliases:** `%APPDATA%\Autodesk\AutoCAD <release>\R<ver>\enu\Support\acad.pgp`
- **Civil 3D aliases:** `%APPDATA%\Autodesk\C3D <release>\enu\Support\aeccland.pgp`

## Editing

- **Express Tools → Tools → Command Alias Editor** (`EDITALIASES`).
- Or open the `.pgp` file in a text editor — entries look like `L,    *LINE` (alias, comma, star, command).
- Run `REINIT` and tick "PGP file" to reload.

## Common AutoCAD aliases (keep memorized)

| Alias | Command |
|---|---|
| `L` | LINE |
| `PL` | PLINE |
| `C` | CIRCLE |
| `M` | MOVE |
| `CO` / `CP` | COPY |
| `RO` | ROTATE |
| `S` | STRETCH |
| `T` / `MT` | MTEXT |
| `DT` | TEXT (single-line) |
| `H` / `BH` | HATCH |
| `LA` | LAYER |
| `LT` | LINETYPE |
| `LW` | LWEIGHT |
| `MA` | MATCHPROP |
| `B` | BLOCK |
| `I` | INSERT |
| `X` | EXPLODE |
| `F` | FILLET |
| `CHA` | CHAMFER |
| `O` | OFFSET |
| `MI` | MIRROR |
| `TR` | TRIM |
| `EX` | EXTEND |
| `J` | JOIN |
| `SC` | SCALE |
| `AR` | ARRAY |
| `AL` | ALIGN |
| `MEA` | MEASUREGEOM |
| `LI` | LIST |
| `ID` | ID |
| `DIST` | DIST |
| `Z` | ZOOM |
| `P` | PAN |
| `RE` | REGEN |
| `REA` | REGENALL |
| `OS` | OSNAP |
| `UN` | UNITS |
| `OP` | OPTIONS |
| `PR` | PROPERTIES |
| `PU` | PURGE |
| `AA` | AREA |

## Common Civil 3D aliases (defaults from `aeccland.pgp`)

These vary by release; the list below is representative. Always verify against your installed PGP.

| Alias | Command | Notes |
|---|---|---|
| `CP` | CreatePoints | conflicts with COPY in stock acad.pgp; many companies remap |
| `EP` | EditPoints | |
| `CG` | CreateAlignmentLayout | "create geometry" — variant per company |
| `CS` | CreateSurface | |
| `RS` | RebuildSurface | |
| `AB` | AddBreaklines | |
| `EFE` | EditFeatureLineElevations | |

## Civil 3D command-line conventions

- Commands prefixed with `Aecc` are the legacy explicit names — most are aliased to friendlier names (`CreateAlignmentEntities` → `Aecc...`).
- Underscore `_` prefix forces the English command name regardless of language pack.
- Hyphen `-` prefix (e.g., `-LAYER`) suppresses the dialog and runs the command-line version.

## Distributing a company PGP

1. Maintain a master `<company>-acad.pgp` and `<company>-aeccland.pgp` under version control.
2. On each user's workstation, replace the per-user file (or symlink to a network copy).
3. Document remapped aliases in your company CAD standard so newcomers don't get surprised.

## Related

- [Command-line cheatsheet](command-line-cheatsheet.md)
- [Templates & country kits](../../customization/templates-and-kits/index.md)
