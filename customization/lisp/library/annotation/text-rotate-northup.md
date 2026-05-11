---
title: "TEXT-ROTATE-NORTHUP — Flip text rotation into the readable half-plane"
section: customization/lisp/library/annotation
tags: [autolisp, lisp, annotation, text, rotation]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Select TEXT/MTEXT.
> 2. Any rotation that puts the text reading "upside down" (rotation 90 to 270 deg) is rotated by 180 deg so it reads from a north-up plan view.

## Command

`c:TEXT-ROTATE-NORTHUP`

## What it does

Iterates the selection. For each entity it reads DXF group 50 (rotation in radians), converts to degrees, normalises to the range -180..+180, and if the rotation falls outside -90..+90 (i.e. the text would read upside-down from a north-up plan view) it subtracts 180 degrees. The new rotation is written back via `entmod` on the group 50 pair.

This does not move the text. The insertion point is preserved; only the rotation changes. For MTEXT the routine relies on the rotation group; if your MTEXT contains stacked or paragraph-formatted text the *content* orientation is unchanged.

## Prompts

1. `Select text/mtext to normalise rotation:`

## Notes & gotchas

- Justification is preserved. Left-aligned text whose insertion point is at the line's start will flip about that insertion point — visually the text moves to the opposite side of the line. For a flip-in-place result, change justification to centre before rotating, or compute a new insertion point.
- Does not affect attributes (group 50 inside ATTRIB lives inside an INSERT). Use a separate pass on attributes if needed.

## Source listing

Full source in [`text-rotate-northup.lsp`](text-rotate-northup.lsp). Core:

```lisp
(setq newrot
  (cond
    ((or (> rot 90.0) (< rot -90.0)) (- rot 180.0))
    (T rot)))
(entmod (subst (cons 50 (* (/ pi 180.0) newrot)) pair edata))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla AutoLISP. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
