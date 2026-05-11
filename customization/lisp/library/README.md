# Civil 3D Master Guide — AutoLISP routine library

A collection of small, vetted AutoLISP routines for daily surveying and Civil 3D work. These are source assets, not narrative documentation — each routine pairs a `.lsp` file with a sibling `.md` that explains usage, prompts, gotchas, and version compatibility.

## Layout

```
customization/lisp/library/
  layer/        Layer management (freeze, isolate, audit, recolor xrefs)
  points/       Civil 3D COGO point operations (export, import, renumber, filter)
  cogo/         Bearing/distance, traverse, labeling, stakeout helpers
  README.md     This file
  index.json    Machine-readable manifest of every routine
```

## How to load a routine

Three options, from one-off to permanent:

1. **One-off, current drawing.** From the command line:

   ```
   (load "C:/path/to/customization/lisp/library/cogo/inv.lsp")
   ```

2. **Session-long.** Type `APPLOAD`, browse to the `.lsp`, and load it. Loaded routines persist until you close the drawing.

3. **Every drawing, automatic.** Type `APPLOAD`, click **Startup Suite**, add the `.lsp` files you want. AutoCAD will load them on every startup.

For team deployment, put the library on a shared drive, add that path to **Options → Files → Trusted Locations** and **Support File Search Path**, and reference the files from `acaddoc.lsp` or the Startup Suite.

## Per-category overview

### `layer/`

- `LFRZ-PATTERN` — freeze layers matching a wildcard.
- `LISO-WILDCARD` — isolate layers matching a wildcard; freeze the rest.
- `LAYREPORT` — CSV inventory of all layers with entity counts.
- `LAYSAVE-SET` / `LAYREST-SET` — named layer-state save/restore wrappers.
- `LAYXREF-COLOR` — recolor every xref-dependent layer.
- `LAYUNUSED` — find layers with zero entities.

### `points/`

- `EXPORTPNT-PNEZD` — dump COGO points to a PNEZD CSV.
- `EXPORTPNT-CSV` — same, but configurable field order.
- `IMPORTPNT-FROMDC` — read a data-collector CSV with auto-detect (Trimble/Topcon/Carlson).
- `PNTRENUM` — renumber COGO points by selection order with collision check.
- `PNTFILTER-DESC` — select COGO points whose raw description matches a wildcard.
- `PNTCHK-DUP` — find duplicate point numbers.
- `PNTMOVE-BYELEV` — apply a signed elevation delta to selected points.

### `cogo/`

- `INV` / `INVPLINE` — inverse two points or every segment of a polyline.
- `TRAV` / `TRAVCLOSE` — keyboard traverse entry; closure on a polyline.
- `BEARLABEL` / `BEARLABEL-ALL` — bearing+distance text labels.
- `CURVELABEL` / `CURVELABEL-ALL` — R/L/Delta arc labels.
- `RADIALSTAKE` — distance + azimuth + angle-right table from a base + backsight.
- `MIDPT-STAKE` — midpoint of two points or half-length point along a polyline.
- `PERP-STAKE` — station and signed offset from a two-point baseline.
- `BND-TRAV` — boundary traverse table for legal descriptions.

## Conventions

All routines in this library follow the same rules:

- **Top-of-file comment block** with routine name, purpose, version compatibility, author, and license line.
- **Command form.** Every command uses `(defun c:NAME ( / locals) ...)` and ends with `(princ)` to suppress the trailing `nil` echo.
- **Localized variables.** Every routine declares its locals after the `/` so nothing leaks into the global namespace.
- **System variables saved and restored.** Where a routine changes `CMDECHO`, `OSMODE`, or `CLAYER`, it saves the prior value and restores it before returning.
- **Pure AutoLISP where possible.** Civil 3D COM (`vla-`, `vlax-`) is used only for COGO point access, and is loaded explicitly with `(vl-load-com)`.
- **Bearing convention.** AutoLISP `(angle p1 p2)` is east-zero, counter-clockwise, radians. Routines convert to north-clockwise azimuth in radians (and then degrees or quadrant bearings) at the boundary, and the `.md` documents the conversion.
- **Drawing units.** Distances are reported in drawing units; routines assume U.S. survey feet but the math is unit-agnostic. Consumers must verify the drawing's unit system.

## Version compatibility

Every routine targets Civil 3D **2022, 2024, 2025, and 2026**. The status in each `.md` is "Assumed" for all versions — the authors verified syntax against the AutoLISP and (where used) Civil 3D `Aecc` COM surfaces that have been stable across this release window, but no end-to-end test in a live drawing has been recorded yet. Treat each routine as a starting point and test on a project copy before production use.

If you verify a routine on a specific version, edit the `.md` table from "Assumed" to "Verified YYYY-MM-DD" and bump the `updated:` date in the frontmatter.

## Contributing

1. Use the conventions above. Read three existing routines before writing your own.
2. Add a `.lsp` and a `.md` together; one without the other gets rejected.
3. Add a one-line entry to `index.json`, in the same shape as the existing entries.
4. Open a PR. CI will check syntax and frontmatter shape.

## License

MIT. See the repo root `LICENSE` file. These routines are free to use, modify, and redistribute. The repo as a whole carries the same license unless a file says otherwise.
