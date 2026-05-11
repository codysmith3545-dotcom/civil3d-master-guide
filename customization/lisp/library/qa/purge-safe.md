---
title: "PURGE-SAFE — Purge unused while keeping an office protected list"
section: customization/lisp/library/qa
tags: [autolisp, lisp, qa, purge, cleanup]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Edit the three protected lists at the top of `purge-safe.lsp` to match your office standard.
> 2. Type PURGE-SAFE. Protected layers are locked, `-PURGE All * No` is run, layers are unlocked again.

## Command

`c:PURGE-SAFE`

## What it does

AutoCAD's PURGE will not purge a locked layer. The routine exploits that: every layer in `PURGE-PROTECT-LAYERS*` is locked before PURGE runs, then unlocked after. The `-PURGE All * No` invocation purges every other empty named object in one pass without prompting for confirmation.

The block and text-style protect lists (`PURGE-PROTECT-BLOCKS*`, `PURGE-PROTECT-STYLES*`) are listed in the source as the intended extension; AutoCAD does not give vanilla LISP a "lock-this-style-from-purge" lever, so they are not yet enforced here. A future revision can iterate the symbol tables and temporarily insert a dummy referrer.

## Prompts

None.

## Notes & gotchas

- PURGE-SAFE will modify the drawing — save first.
- Layers that are already locked stay locked at the end (the routine does not restore prior lock state — it only toggles the protected list).
- `-PURGE All` does NOT purge regapps. Add `(command "_.-PURGE" "_Regapps" "*" "_No")` for that.
- Civil 3D-specific objects (alignment styles, surface styles, label styles) are *not* protected by this routine. Use Toolspace > Settings panel manual purge for those.

## Source listing

Full source in [`purge-safe.lsp`](purge-safe.lsp). PURGE call:

```lisp
(command "_.-PURGE" "_All" "*" "_No")
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla `-PURGE`. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
