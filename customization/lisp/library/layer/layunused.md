---
title: "LAYUNUSED — List layers with no entities"
section: "customization/lisp/library/layer"
tags: [autolisp, lisp, layer, audit, purge]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `LAYUNUSED` reports every layer with zero entities in modelspace or paperspace.
> 2. Optionally writes the list to a text file.
> 3. Never deletes — use AutoCAD's `PURGE` for that, after manual review.

## Command

`LAYUNUSED`

## What it does

For each layer name in the symbol table, runs `(ssget "_X" '((8 . name)))` over the whole drawing. Layers that return `nil` (no entities) are collected, sorted, and printed at the command line.

This intentionally does **not** delete. `LAYUNUSED` is a reporting tool — a human reviews the list, decides whether each layer is genuinely unused or just temporarily empty (e.g. a future-utility placeholder), and then runs `PURGE` selectively.

## Prompts

1. After the list prints: **Write list to file? [Y/N] <N>:** answer `Y` to also save a text file.
2. If yes: **Output TXT path:** absolute path; will overwrite if it exists.

## Notes & gotchas

- "Unused" here means "no entities currently visible to `ssget`." It does **not** detect layers referenced only inside block definitions or layer states. Use `PURGE` if you want AutoCAD's stricter definition.
- Sheet-set, dynamic-block, and reactor processes may briefly create entities on otherwise-empty layers; results can change second to second.
- Layer `0` and `Defpoints` are reported if empty, but you generally should not delete them.
- Frozen layers still have their entities visible to `ssget "_X"` — frozen does not mean "unused."

## Source listing

Source: ./layunused.lsp

## Version compatibility

| Civil 3D version | Status  |
|------------------|---------|
| 2022             | Assumed |
| 2024             | Assumed |
| 2025             | Assumed |
| 2026             | Assumed |
