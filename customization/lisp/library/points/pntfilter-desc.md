---
title: "PNTFILTER-DESC — Select COGO points by description wildcard"
section: "customization/lisp/library/points"
tags: [autolisp, lisp, points, cogo, civil3d, selection]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. `PNTFILTER-DESC` builds a selection set of every COGO point whose raw description matches a wildcard.
> 2. The selection becomes the AutoCAD pickset, so you can immediately run `ERASE`, `MOVE`, etc. on it.
> 3. Match is case-insensitive via `wcmatch`.

## Command

`PNTFILTER-DESC`

## What it does

Scans all COGO points, reads `RawDescription` via COM, and adds matching entities to a new selection set. The set is pushed to the pickfirst slot using `(sssetfirst nil result)`, which highlights the points and makes them available to the next command as the "previous" selection.

Typical workflow: `PNTFILTER-DESC` → enter `*MH*` → `ERASE` → `P` → Enter, to delete every point with "MH" anywhere in its description.

## Prompts

1. **Description wildcard:** any `wcmatch` pattern. Examples: `EP` (exact "EP"), `EP*` (starts with "EP"), `*MH*` (contains "MH"), `IP,SP,PP` (any of three), `~CL*` (NOT starting with "CL").

## Notes & gotchas

- Tests `RawDescription`, not the description-key-expanded `FullDescription`. Surveyors typically code with raw mnemonics.
- Empty descriptions never match (the `and` short-circuits on `nil`).
- The highlighted preview is gripped — press Escape before pivoting to another tool if you don't want to act on the selection.
- Doesn't unhide frozen/locked layers; if matching points are on frozen layers, they're still selected but invisible.

## Source listing

Source: ./pntfilter-desc.lsp

## Version compatibility

| Civil 3D version | Status                  |
|------------------|-------------------------|
| 2022             | Assumed (COM stable)    |
| 2024             | Assumed (COM stable)    |
| 2025             | Assumed (COM stable)    |
| 2026             | Assumed (COM stable)    |
