---
title: "BATCH-SAVE — Save every open drawing without closing"
section: customization/lisp/library/utilities
tags: [autolisp, lisp, utilities, save, batch]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type BATCH-SAVE.
> 2. Every open drawing with a file path is saved in place; unsaved (never-named) drawings are skipped with a report.

## Command

`c:BATCH-SAVE`

## What it does

Iterates `AcadApplication.Documents` and calls `vla-Save` on each document whose `FullName` looks like a path on disk. The `FullName` check rejects drawings that have never been saved (those have an empty or no-backslash name like `Drawing1.dwg`).

Each saved file is logged to the command line. At the end the routine echoes a summary and a list of any drawings that need a manual `SAVEAS`.

## Prompts

None.

## Notes & gotchas

- `vla-Save` uses each drawing's existing format (DWG version). To force a different version, use `SaveAs` and the DWG-version constant.
- This routine does *not* close any drawings.
- Civil 3D project drawings linked to Data Shortcuts or Vault may briefly lock as they save; running this on a heavy project can take a while.
- The check for a "real" path is a heuristic (`vl-string-search "\\" path`). Linux/macOS paths use forward slashes; if you run Civil 3D under a network share via a UNC path that lacks a backslash for some reason, the drawing will be skipped — adjust the check accordingly.

## Source listing

Full source in [`batch-save.lsp`](batch-save.lsp). Save loop:

```lisp
(while (< i n)
  (setq doc (vla-Item docs i))
  (setq path (vla-get-FullName doc))
  (cond
    ((or (null path) (= path "") (null (vl-string-search "\\" path)))
       ... skip ...)
    (T (vla-Save doc) ...))
  (setq i (1+ i)))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Stock `AcadApplication.Documents`. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
