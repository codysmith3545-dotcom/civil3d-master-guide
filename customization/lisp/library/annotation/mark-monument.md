---
title: "MARK-MONUMENT — Insert monument block with auto-filled attributes"
section: customization/lisp/library/annotation
tags: [autolisp, lisp, annotation, monument, survey]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type a monument block name, monument type, and date.
> 2. Pick points; the routine inserts the block and auto-fills any of these attribute tags: `NORTHING`, `EASTING`, `ELEV` (or `ELEVATION`), `TYPE`, `DATE`.

## Command

`c:MARK-MONUMENT`

## What it does

After collecting the block name, monument type, and date once, the routine loops on `getpoint`. For each picked point it issues `_.-INSERT` at scale 1, rotation 0. After insertion it walks the new block's attribute sub-entities with `entnext`, matches each attribute tag against the well-known set above, and writes the appropriate value (NE coords formatted to 3 decimals, elevation to 2). Attributes whose tag does not match are left alone.

Block must already exist in the drawing or be discoverable on the support file search path. The auto-fill is case-insensitive on the attribute tag.

## Prompts

1. `Monument block name:`
2. `Monument type (e.g. 5/8" rebar w/cap):`
3. `Date string (e.g. 2026-05-11):`
4. `Pick monument point (Enter to quit):` (loops)

## Notes & gotchas

- AutoCAD picks return points as `(X Y Z)`. Northing = Y, Easting = X — the routine handles this swap.
- Endpoint osnap is forced; turn off if you need free picks.
- If your office uses different attribute tag names (e.g. `MON_N`, `MON_E`), edit the `cond` block in `fill-attribs`.
- This does not create a Civil 3D COGO point. Pair with `MARK-MONUMENT` + a `CREATEPOINTSFROMBLOCKS` workflow for that.

## Source listing

Full source in [`mark-monument.lsp`](mark-monument.lsp). Auto-fill core:

```lisp
(cond
  ((= att-tag "NORTHING") (setq val (rtos n 2 3)))
  ((= att-tag "EASTING")  (setq val (rtos e 2 3)))
  ((= att-tag "ELEV")     (setq val (rtos z 2 2)))
  ((= att-tag "ELEVATION")(setq val (rtos z 2 2)))
  ((= att-tag "TYPE")     (setq val typ))
  ((= att-tag "DATE")     (setq val dt)))
(if val (entmod (subst (cons 1 val) (assoc 1 edata) edata)))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla AutoCAD INSERT + entmod. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
