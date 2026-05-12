---
title: "ENTITY-COUNT-BY-LAYER — CSV census of model-space entities by layer and type"
section: customization/lisp/library/qa
tags: [autolisp, lisp, qa, audit, csv, report]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Type ENTITY-COUNT-BY-LAYER and give an output path.
> 2. A CSV is written with `layer,entity_type,count` for every (layer, entity-type) pair present in model space.

## Command

`c:ENTITY-COUNT-BY-LAYER`

## What it does

Walks every model-space entity, bumps an in-memory assoc-list keyed by `"LAYER|TYPE"`, sorts by key, and writes a CSV. The command-line also echoes the summary so quick checks need no file.

This is a useful sanity check before a drawing handoff: a layer expecting 0 entities should report nothing; a layer with 10 000 of one entity type often indicates a converted external file that did not get re-layered.

## Prompts

1. `CSV output path (e.g. C:/temp/entity-count.csv):` — leave blank to skip the file and only echo to the command line.

## Notes & gotchas

- Model space only.
- Entity types are the DXF `0` code (e.g. `LINE`, `LWPOLYLINE`, `INSERT`). Block references all show as `INSERT`; group them externally if you want per-block counts.
- Output file is overwritten if it exists.
- Counts include layout viewport-resident entities only if they live in model space; viewport overrides do not affect the count.

## Source listing

Full source in [`entity-count-by-layer.lsp`](entity-count-by-layer.lsp). Bump helper:

```lisp
(defun bump (key store / pair)
  (setq pair (assoc key store))
  (if pair
    (subst (cons key (1+ (cdr pair))) pair store)
    (cons (cons key 1) store)))
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Vanilla AutoLISP. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
