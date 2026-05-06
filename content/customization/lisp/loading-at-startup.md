---
title: "Loading LISP at Startup"
section: "customization/lisp"
order: 15
visibility: public
tags: [lisp, autolisp, startup, acad-lsp, acaddoc-lsp, appload, secureload]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide — Automatic Loading"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
---

> **TL;DR**
> 1. Use **acaddoc.lsp** (loaded for every new drawing) rather than acad.lsp (loaded only once per session) for routines you want available in all drawings.
> 2. The **APPLOAD** startup suite provides a GUI to add files that load automatically without editing any LSP file. It is the simplest approach for individual users.
> 3. Set **SECURELOAD = 1** and add your LISP directories to the trusted paths to prevent untrusted code from loading.

## Loading mechanisms

AutoCAD (and Civil 3D, which inherits the same loading system) provides several automatic-load mechanisms, evaluated in this order at startup:

1. **acad.lsp** — loaded once when Civil 3D starts. Not reloaded when a new drawing is opened. Place session-level initializations here (e.g., connecting to a license server, loading COM libraries).
2. **acad20xx.lsp** (version-specific) — loaded once per session, before acad.lsp. Rarely used.
3. **acaddoc.lsp** — loaded every time a drawing is opened or created. This is the standard place for company LISP routines that should be available in every drawing.
4. **APPLOAD startup suite** — files added through the `APPLOAD` dialog's "Startup Suite" are loaded every time a drawing is opened, in addition to the above.
5. **CUI/CUIX menus** — LISP files can be associated with menu macros and loaded on demand.

### Recommended setup

For a company deployment:

```lisp
;; acaddoc.lsp — placed in the support path
;; Loads the company LISP library on every drawing open

(defun s::startup ()
  ;; Load company routines from the network library
  (if (findfile "\\\\server\\cad-standards\\lisp\\company-lib.lsp")
    (load "\\\\server\\cad-standards\\lisp\\company-lib.lsp")
    (princ "\n*** Company LISP library not found. Check network connection. ***")
  )
  (princ)
)
```

The `s::startup` function is called automatically after the drawing is fully initialized. This is preferred over top-level `(load ...)` calls because it ensures the drawing environment is ready.

## acad.lsp vs acaddoc.lsp

| Feature | acad.lsp | acaddoc.lsp |
|---|---|---|
| When loaded | Once per session | Every drawing open/new |
| Scope | Session-level | Document-level |
| Typical use | COM initialization, license checks | Company routines, command definitions |
| System variable | ACADLSPASDOC (if 1, acad.lsp loads per document too) | Always per document |

If `ACADLSPASDOC = 1`, acad.lsp behaves like acaddoc.lsp. The default is 0. Most companies use acaddoc.lsp and leave ACADLSPASDOC at 0.

## APPLOAD startup suite

The `APPLOAD` command opens a dialog where you can:

1. Browse to a .lsp, .fas, .vlx, or .dll file.
2. Click "Load" to load it immediately.
3. Click the "Startup Suite" briefcase icon and add files that load automatically on every drawing open.

This approach is user-specific (stored in the registry) and does not require editing any LSP file. Good for individual users; not suitable for company-wide deployment (use acaddoc.lsp for that).

## SECURELOAD and trusted paths

Since AutoCAD 2014, the `SECURELOAD` system variable controls whether LISP and .NET files from untrusted locations can load:

| SECURELOAD | Behavior |
|---|---|
| 0 | Load all files without warning (not recommended) |
| 1 | Warn before loading from untrusted paths (recommended) |
| 2 | Only load from trusted paths; block all others |

**Trusted paths** are set in Options > Files > Trusted Locations. Add your company LISP network folder here. This prevents malicious LISP files placed in project folders from running automatically.

For deployment, set SECURELOAD via the deployment image or a login script:

```
(setenv "SECURELOAD" "1")
```

## Custom startup.lsp pattern

A common pattern is to have acaddoc.lsp load a master startup file from the network, which in turn loads individual routine files:

```lisp
;; company-lib.lsp — master loader on the network share
(foreach f '("layer-tools.lsp"
             "block-tools.lsp"
             "point-tools.lsp"
             "text-tools.lsp")
  (if (findfile f)
    (load (findfile f))
    (princ (strcat "\nMissing: " f))
  )
)
(princ "\nCompany LISP library loaded.")
(princ)
```

## Related

- [Useful routines index](useful-routines-index.md)
- [Common patterns](common-patterns.md)
- [Distributing LISP](distributing-lisp.md)
- [Visual LISP IDE](visual-lisp-ide.md)
