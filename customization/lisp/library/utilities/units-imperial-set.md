---
title: "UNITS-IMPERIAL-SET — Apply U.S. survey imperial unit defaults"
section: customization/lisp/library/utilities
tags: [autolisp, lisp, utilities, units, imperial, survey]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type UNITS-IMPERIAL-SET.
> 2. Linear = decimal feet (3 dp), angles = surveyor's units (4 dp), `INSUNITS` = feet, `MEASUREMENT` = imperial, `PDMODE` = cross, `PDSIZE` = -3%.
> 3. The prior value of each variable is printed so you can hand-revert.

## Command

`c:UNITS-IMPERIAL-SET`

## What it does

Sets these system variables:

| Var | New value | Meaning |
|---|---|---|
| LUNITS | 2 | Decimal linear |
| LUPREC | 3 | 3 decimal places |
| AUNITS | 4 | Surveyor's units (N45d12'30"E) |
| AUPREC | 4 | 4 decimals on angle DMS |
| INSUNITS | 2 | Insertion units = feet |
| MEASUREMENT | 0 | Imperial |
| PDMODE | 3 | Cross point style |
| PDSIZE | -3 | 3 % of viewport |

These are AutoCAD documented system variables — see [Autodesk system variables reference](https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-A8A0D1F5-92BB-4ED0-93FA-7DCC1F2D3F1A).

## Prompts

None.

## Notes & gotchas

- This sets per-drawing variables. To bake them into every new drawing, save the changes to your `acad.dwt` / `_AutoCAD Civil 3D (Imperial) NCS.dwt` template.
- Civil 3D drawings also have a Drawing Settings dialog (`EditDrawingSettings`) for zone, scale, and abbreviation conventions; this routine does not touch those.
- The "PNEZD survey defaults" wording from the spec refers to the broader convention — actual COGO-point file format defaults live under Toolspace > Settings > User Settings > Point File Formats, also outside vanilla AutoLISP.

## Source listing

Full source in [`units-imperial-set.lsp`](units-imperial-set.lsp). Setter loop:

```lisp
(foreach pair UNITS-IMPERIAL-DEFAULTS*
  (setq prev (getvar (car pair)))
  (princ (strcat "\n  " (car pair) " was " (vl-princ-to-string prev)
                 " -> setting " (vl-princ-to-string (cdr pair))))
  (setvar (car pair) (cdr pair)))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | All sysvars are stock AutoCAD. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
