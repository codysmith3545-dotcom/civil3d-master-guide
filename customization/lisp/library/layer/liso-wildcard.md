---
title: "LISO-WILDCARD — Isolate layers by wildcard"
section: "customization/lisp/library/layer"
tags: [autolisp, lisp, layer]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `LISO-WILDCARD` keeps layers that match your pattern thawed and on, freezes everything else.
> 2. The current layer is always preserved, even if it doesn't match.
> 3. Inverse of `LFRZ-PATTERN`; use the built-in `LAYUNISO` or unfreeze-all to reverse.

## Command

`LISO-WILDCARD`

## What it does

Walks the layer symbol table once. For each layer, if its name matches the pattern (case-insensitive `wcmatch`), the layer is thawed and turned on. Otherwise it is frozen. The current layer (`CLAYER`) is skipped to avoid AutoCAD's "cannot freeze current layer" error.

Useful when isolating a sub-discipline view — for example, isolate `C-ROAD-*` to review only roadway geometry before plotting.

## Prompts

1. **Isolate layers matching pattern:** any `wcmatch` expression. Comma-separated patterns OR together; `~` prefixes negate.

## Notes & gotchas

- This freezes layers individually rather than via a single wildcard freeze, because we also need to thaw matching layers in the same pass.
- Slower on drawings with thousands of layers — each call invokes the `LAYER` command per name.
- To restore visibility, use a saved layer state (`LAYERSTATE`) you snapshotted before isolating, or AutoCAD's `LAYTHW` to thaw everything.
- Does not touch viewport-frozen state (`VPFREEZE`) — adjust paper space separately.

## Source listing

Source: ./liso-wildcard.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
