---
title: "BLOCK-EXPLODE-ATTRIBS — Explode blocks but keep attribute values as MText"
section: customization/lisp/library/qa
tags: [autolisp, lisp, qa, block, explode, attribute]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Select block references.
> 2. Each block is exploded, but every ATTRIB inside it is rewritten as an MText at the attribute's insertion point preserving height, rotation, and layer.

## Command

`c:BLOCK-EXPLODE-ATTRIBS`

## What it does

Plain `EXPLODE` turns each ATTRIB back into its source ATTDEF *tag*, losing the value the user typed in. This routine fixes that. Before each explode it walks the block reference's sub-entities, captures every ATTRIB as a tuple of `(insertion-point height rotation layer value)`, runs `EXPLODE`, then writes each captured value as an MText with the original layer/height/rotation.

The result is a flat set of curves + MText that survives a round-trip through DXF/IFC export, vendor file conversion, or any other workflow that does not understand AutoCAD attributes.

## Prompts

1. `Select block references to explode (attributes preserved as MText):`

## Notes & gotchas

- ATTRIBs are emitted as MText, not TEXT, to handle multi-line values. If your office requires single-line TEXT, swap `_.-MTEXT` for `_.TEXT`.
- Nested blocks: a block inside a block becomes loose after the first explode. Re-run for deeper nesting.
- Constant attributes (`ATTDEF` flag bit 2) never appear as ATTRIB sub-entities; their text is in the BLOCK definition and will explode normally.
- Original attribute justification is not preserved; the rewritten MText is bottom-left justified at the original insertion point.

## Source listing

Full source in [`block-explode-attribs.lsp`](block-explode-attribs.lsp). Attribute capture:

```lisp
(setq att-list
  (cons (list (cdr (assoc 10 edata))
              (cdr (assoc 40 edata))
              (if (assoc 50 edata) (cdr (assoc 50 edata)) 0.0)
              (cdr (assoc 8  edata))
              (cdr (assoc 1  edata)))
        att-list))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla EXPLODE + entnext. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
