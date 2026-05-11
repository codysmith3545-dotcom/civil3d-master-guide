---
title: "LFRZ-PATTERN — Freeze layers by wildcard"
section: "customization/lisp/library/layer"
tags: [autolisp, lisp, layer]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type `LFRZ-PATTERN`, enter an AutoCAD wildcard (e.g. `C-STRM-*`), and every matching layer freezes.
> 2. The current layer is skipped — AutoCAD refuses to freeze it.
> 3. Wildcards follow `wcmatch` syntax (`*`, `?`, `#`, `@`, `[abc]`, `~`).

## Command

`LFRZ-PATTERN`

## What it does

Walks the drawing's layer symbol table, counts how many layers match the user-supplied wildcard, then defers to the native `_.LAYER _F <pattern>` command to perform the actual freeze. Using the native command preserves AutoCAD's own validation (current-layer protection, xref layer handling) and triggers any active reactors.

The count is computed in LISP so the report message can show how many layers were actually affected; AutoCAD's own freeze command is silent about counts.

## Prompts

1. **Enter layer wildcard pattern (e.g. C-STRM-\*):** any `wcmatch` expression. Examples:
   - `C-STRM-*` — all storm layers
   - `*-DEMO` — every demo layer
   - `V-*,E-*` — utilities and electrical (comma = OR)
   - `~C-*` — everything except civil (`~` negates)

## Notes & gotchas

- Pattern matching is case-insensitive — names are upcased before comparison.
- Will not freeze the **current layer**. Switch off it first if you need to.
- Layers inside xrefs follow the host's `VISRETAIN` setting; freezing the bound name freezes it locally only.
- Does not thaw anything. Pair with a thaw-all routine if you bake this into a workflow.

## Source listing

Source: ./lfrz-pattern.lsp

## Version compatibility

| Civil 3D version | Status   |
|------------------|----------|
| 2022             | Assumed  |
| 2024             | Assumed  |
| 2025             | Assumed  |
| 2026             | Assumed  |

Uses only core AutoLISP and the `LAYER` command, both stable since AutoCAD R14. No Civil 3D-specific coupling.
