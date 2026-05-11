---
title: "BUBBLE-CALLOUT — Numbered callout bubble with xdata link"
section: customization/lisp/library/annotation
tags: [autolisp, lisp, annotation, callout, bubble, xdata]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
---

> **TL;DR**
> 1. Pick points; each gets a circle + centred number.
> 2. The number auto-increments per pick within a session.
> 3. The bubble's CIRCLE entity carries xdata under appid `C3D_BUBBLE` storing the number (group 1070), so a downstream macro can collate bubbles back to a schedule table.

## Commands

- `c:BUBBLE-CALLOUT` — place bubbles in a loop.
- `c:BUBBLE-RESET` — reset the in-memory counter to 1.

## What it does

Each bubble is a CIRCLE of radius `1.2 * DIMTXT` plus an MC-justified single-line TEXT containing the next integer. After placement the circle is annotated with xdata: `(C3D_BUBBLE (1070 . <n>))`. The next number is held in the LISP global `BUBBLE-NEXT*`; it survives across calls in a session and resets when the drawing is reopened or when `BUBBLE-RESET` is run.

The xdata appid is registered via `(regapp ...)` on first call. Downstream automation can find bubbles by selection filter `((-3 ("C3D_BUBBLE")))` and read the number with `(cdr (assoc 1070 ...))` on the xdata sub-list.

## Prompts

1. `Pick bubble centre for #N (Enter to quit):` (loops)

## Notes & gotchas

- The "table row link" is an xdata number, not a hyperlink to a Civil 3D Table object. If you need a real table, generate the table from the xdata after placement.
- Counter is session-scoped. Save the drawing then re-open and the counter starts at 1 again unless you also persist it in a DICTIONARY entry.
- Picks default to no osnap; turn osnaps on manually if you need to snap.

## Source listing

Full source in [`bubble-callout.lsp`](bubble-callout.lsp). Xdata attach:

```lisp
(setq edata (append edata
              (list (list -3
                          (list appid
                                (cons 1070 BUBBLE-NEXT*))))))
(entmod edata)
```

## Version compatibility

| Civil 3D version | Tested | Notes |
|---|---|---|
| 2022 | not tested in sandbox | Stock xdata + CIRCLE + TEXT. |
| 2024 | not tested in sandbox | |
| 2025 | not tested in sandbox | |
| 2026 | not tested in sandbox | |
