---
title: "AutoLISP for Civil 3D"
section: "customization/lisp"
order: 10
visibility: public
tags: [lisp, autolisp, customization]
updated: 2026-05-06
---

> **TL;DR**
> 1. LISP is great for AutoCAD-side automation (drawing manipulation, layer juggling, batch tasks). For deep Civil 3D object access, use the **.NET API** instead.
> 2. Load LISP via `APPLOAD` for one-off, or via the `acad.lsp` / `acaddoc.lsp` files for auto-load. Best practice: a single `<company>-startup.lsp` that loads everything else.
> 3. **Visual LISP** (`VLIDE` / `VLISP`) is the IDE; `vl-load-com` enables COM access — required for some Civil 3D and Map 3D objects.

## Pages

- [Useful routines index](useful-routines-index.md)
- [Loading LISP at startup](loading-at-startup.md)
- [Visual LISP IDE basics](visual-lisp-ide.md)
- [VL-load-com and COM access](vl-load-com.md)
- [Calling Civil 3D commands from LISP](calling-civil3d-from-lisp.md)
- [Common LISP patterns (selection sets, entget, ssget)](common-patterns.md)
- [Distributing LISP to a team](distributing-lisp.md)

## Related

- [.NET API](../dotnet-api/index.md)
- [Dynamo](../dynamo/index.md)
