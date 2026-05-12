---
title: "C3D-STYLECHECK — Count Civil 3D point/surface/alignment styles"
section: customization/lisp/library/utilities
tags: [autolisp, lisp, utilities, civil3d, styles, com]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type C3D-STYLECHECK.
> 2. Reports counts of Point Styles, Point Label Styles, Surface Styles, and Alignment Styles in the active drawing.
> 3. Couples to the Civil 3D COM API (`AeccXUiLand.AeccApplication.<ver>`).

## Command

`c:C3D-STYLECHECK`

## What it does

Binds the Civil 3D COM application object. The progid is version-specific (e.g. `AeccXUiLand.AeccApplication.13.5` for Civil 3D 2025; the major number changes by release). The routine probes a small list of known progids and uses the first that succeeds. Once it has `ActiveDocument`, it reads `Styles` and counts the four most-asked collections:

- `PointStyles`
- `PointLabelStyles`
- `SurfaceStyles`
- `AlignmentStyles`

Extending to label styles for alignments, profiles, sections, parcel, and pipe networks is straightforward — add another `vla-get-*` and a `count-collection` line per collection.

## Prompts

None.

## Notes & gotchas

- **COM coupling.** Requires Civil 3D itself, not vanilla AutoCAD. The progid version map for the last few releases is approximately: 2022 = 13.2, 2023 = 13.3, 2024 = 13.4, 2025 = 13.5. Confirm against your install before deploying.
- The progid list in the source is a best-effort probe; if your release uses a newer build, add its version string to the `foreach` list.
- The Civil 3D managed .NET API (`Autodesk.Civil.ApplicationServices`) is more idiomatic for this work; this AutoLISP version exists for offices that prefer LISP-only deployment.

## Source listing

Full source in [`c3d-stylecheck.lsp`](c3d-stylecheck.lsp). Probe pattern:

```lisp
(foreach v '("13.5" "13.4" "13.3" "13.2" "13.1" "13.0" "12.0" "11.0")
  (if (null progid)
    (if (not (vl-catch-all-error-p
              (vl-catch-all-apply
                (function (lambda ()
                  (setq app (vla-GetInterfaceObject acad
                              (strcat "AeccXUiLand.AeccApplication." v))))))))
      (setq progid v))))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Try progid `13.2`. |
| 2024 | not tested in sandbox | Try progid `13.4`. |
| 2025 | not tested in sandbox | Try progid `13.5`. |
| 2026 | not tested in sandbox | Add 2026 progid string when verified. |
