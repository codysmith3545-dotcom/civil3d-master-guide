---
title: "Distributing LISP to a Team"
section: "customization/lisp"
order: 40
visibility: public
tags: [lisp, autolisp, distribution, vlx, fas, cui, cuix, network, deployment]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide — Packaging and Distribution"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
---

> **TL;DR**
> 1. The simplest deployment is a **network share** added to every user's support file search path, with an `acaddoc.lsp` that loads the company library automatically.
> 2. Compile source .lsp files to **FAS** (single-file compiled) or **VLX** (bundled executable) to protect source code and improve load speed.
> 3. For ribbon buttons and menu integration, embed LISP commands in a **CUI/CUIX** file distributed as a partial customization.

## Network path deployment

The most common approach for small to mid-size teams:

1. Place all .lsp files in a shared network folder (e.g., `\\server\cad-standards\lisp\`).
2. Add this path to each user's Civil 3D support file search path (Options > Files > Support File Search Path) and trusted locations.
3. Place an `acaddoc.lsp` in the network folder (or in a path that loads before the user's) that loads the master library file.

When a routine is updated, the CAD manager replaces the file on the network share. The next time a user opens a drawing, the updated routine loads automatically.

### Advantages

- Central control — one copy to maintain.
- Instant updates — no reinstallation needed.
- Simple to set up.

### Disadvantages

- Requires network connectivity (remote/VPN users may have slow loads or failures).
- No version pinning — all users get the latest immediately (which may be undesirable if a change introduces a bug).

## Compiled formats

### FAS (Fast-load AutoLISP)

A single .lsp file compiled to a binary .fas file. The source code is not readable. Load speed is marginally faster than .lsp.

Compile from the VLIDE: Tools > Make Application > Simple (FAS).

### VLX (Visual LISP Executable)

A bundle that can contain multiple .lsp files, DCL dialog definitions, and other resources in a single .vlx file. This is the best format for distributing a self-contained tool.

Compile from the VLIDE: Tools > Make Application > Expert (VLX). The wizard lets you add files to the project.

| Format | Source protected | Multi-file | DCL support | Recommended for |
|---|---|---|---|---|
| .lsp | No | No | External .dcl | Development, open-source sharing |
| .fas | Yes | No | External .dcl | Simple single-file tools |
| .vlx | Yes | Yes | Embedded | Production distribution |

## CUI/CUIX integration

To add ribbon buttons, toolbar buttons, or menu items that run LISP commands:

1. Create a partial CUI/CUIX file (`company-tools.cuix`).
2. In the CUI editor (command `CUI`), create a ribbon tab or toolbar panel.
3. Add buttons with macros that call your LISP commands:
   - Macro: `^C^C(c:MyLispCommand)`
   - Or for a command defined with `(defun c:CMD ...)`: macro `^C^CCMD`
4. Assign icons (16x16 and 32x32 BMP or PNG).
5. Load the partial CUIX via the CUI editor's Transfer tab or via LISP:

```lisp
(command "CUILOAD" "\\\\server\\cad-standards\\cui\\company-tools.cuix")
```

The partial CUIX loads in addition to the main CUIX and persists across sessions.

## Versioning strategies

- **Filename versioning**: `company-lib-v2.3.lsp`. The `acaddoc.lsp` references the current version.
- **Changelog file**: keep a `CHANGELOG.txt` in the network folder documenting each change.
- **Git repository**: store the LISP source in a git repository. The network share holds the compiled/deployed version. This provides history, branching, and code review.
- **Version check at load**: the LISP library prints its version at load time:

```lisp
(princ "\nCompany LISP Library v2.3 (2026-05-06) loaded.")
```

## Deployment via Civil 3D deployment image

For organizations that deploy Civil 3D via an Autodesk deployment image (for new installs):

1. Customize the deployment image to include the network path in support file search paths.
2. Include the partial CUIX in the deployment.
3. Set SECURELOAD and trusted paths in the deployment configuration.

This ensures new installations are configured from day one without manual setup.

## Related

- [Loading at startup](loading-at-startup.md)
- [Visual LISP IDE](visual-lisp-ide.md)
- [Common patterns](common-patterns.md)
- [Useful routines index](useful-routines-index.md)
