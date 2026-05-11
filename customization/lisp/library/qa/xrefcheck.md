---
title: "XREFCHECK — Xref status report (resolved, missing, overlay, nested)"
section: customization/lisp/library/qa
tags: [autolisp, lisp, qa, xref, audit]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type XREFCHECK.
> 2. Each xref is listed with `[ATT]` or `[OVR]` (attach vs overlay), `[NESTED]` if nested, its path, and whether the file resolves on disk.

## Command

`c:XREFCHECK`

## What it does

Walks the BLOCK symbol table looking for entries with the xref flag (bit 4 of DXF group 70). For each, it inspects:

- bit 8 of group 70 — overlay vs attach
- bit 32 of group 70 — nested
- group 1 — stored path; tested with `findfile` against the support file search path and absolute path

The report prints one line per xref and ends with a summary count of `total / OK / missing`. Truly circular references are not detected from the local block table alone; AutoCAD itself blocks circular attaches at load time, so a clean drawing never has them.

## Prompts

None.

## Notes & gotchas

- `findfile` only tests the literal path string. If your xrefs use relative paths or are resolved through Project Search Paths, an entry that opens cleanly in AutoCAD may still show as "MISSING ON DISK" here. Run `XREF` to see AutoCAD's own resolved status.
- DXF group 70 bit values: 1=anonymous, 2=non-constant attributes, 4=xref, 8=xref overlay, 16=externally dependent, 32=externally dependent and referenced.
- For a richer report (date/size/last-saved version), iterate `AcadDocument.Database.FileDependencyList` via COM.

## Source listing

Full source in [`xrefcheck.lsp`](xrefcheck.lsp). Bit-decoding core:

```lisp
(setq is-overlay (= 8 (logand 8 (cdr (assoc 70 itm)))))
(setq nested     (= 32 (logand 32 (cdr (assoc 70 itm)))))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Symbol-table only. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
