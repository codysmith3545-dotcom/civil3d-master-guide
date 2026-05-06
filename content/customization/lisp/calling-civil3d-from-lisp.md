---
title: "Calling Civil 3D Commands from LISP"
section: "customization/lisp"
order: 30
visibility: public
tags: [lisp, autolisp, civil3d, command, command-s, automation, workaround]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide — command and command-s Functions"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
  - title: "Autodesk Civil 3D Developer's Guide"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=Civil3D_Developer_Guide
    verified: 2026-05-06
---

> **TL;DR**
> 1. LISP can invoke Civil 3D commands using **(command "COMMANDNAME" ...)** or **(command-s "COMMANDNAME" ...)**, passing arguments as strings that simulate keyboard input.
> 2. LISP has **no direct access to the Civil 3D object model** (alignments, surfaces, profiles, corridors, pipe networks). The .NET API is required for programmatic object creation and modification.
> 3. Workarounds exist: read system variables with `(getvar)`, automate command-line input sequences, and use the COM bridge for limited Civil 3D object access.

## Using (command) with Civil 3D commands

The `(command)` function sends input to the command line as if the user typed it. This works for Civil 3D commands that accept command-line input:

```lisp
;; Export points to a file
(command "EXPORTPOINTS" "C:\\export\\points.csv" "PNEZD" "" "")

;; Create a surface from a point group
(command "CREATESURFACE" "TIN" "EG" "" "PointGroup" "Topo" "")
```

Each argument after the command name corresponds to a prompt response. Use `""` for Enter (accept default) and `pause` to let the user respond interactively at a specific prompt.

### (command) vs (command-s)

| Function | Behavior |
|---|---|
| `(command ...)` | Queues input; allows `pause` for user interaction; allows calling other commands mid-sequence |
| `(command-s ...)` | Synchronous execution; blocks until the command completes; does not allow `pause`; faster and more predictable for fully automated sequences |

Use `(command-s)` when you know all the inputs and want guaranteed completion before the next LISP expression executes.

## Limitations

LISP cannot:

- Create or modify Civil 3D objects programmatically (no equivalent of `CivilDocument.GetCivilDocument()`).
- Read alignment geometry, station/offset, profile elevations, or surface elevations directly.
- Modify corridor parameters, pipe network properties, or label styles.
- Access Civil 3D palettes or dialogs programmatically.

These operations require the Civil 3D .NET API — see [.NET setup](../dotnet-api/setup.md).

## Workarounds

### Reading system variables

Some Civil 3D state is exposed through system variables readable by `(getvar)`:

```lisp
(getvar "CDATE")       ; Current date/time
(getvar "DWGNAME")     ; Drawing name
(getvar "MEASUREMENT") ; Imperial (0) or Metric (1)
```

However, Civil 3D-specific system variables (like current alignment, surface statistics) are limited.

### Command-line automation patterns

For repetitive operations that have command-line interfaces:

```lisp
;; Batch-import multiple point files
(foreach f '("C:\\data\\site1.csv" "C:\\data\\site2.csv" "C:\\data\\site3.csv")
  (command-s "IMPORTPOINTS" f "PNEZD (comma delimited)" "" "")
)
```

```lisp
;; Set the active point group
(command "SETACTIVEPOINTGROUP" "Topo")
```

### COM bridge for limited object access

Using `(vl-load-com)` and the Civil 3D COM type library, you can access some Civil 3D objects — see [vl-load-com](vl-load-com.md). This provides read access to names, layers, and basic properties of surfaces and alignments, but not full geometric data.

### Calling .NET from LISP

A .NET plugin can define commands that LISP calls via `(command)`. This hybrid approach lets LISP orchestrate the workflow while .NET handles the Civil 3D object model:

1. Write a .NET plugin that exposes `[CommandMethod("C3D_GetSurfaceElev")]`.
2. The .NET command reads the surface elevation at a picked point and sets a LISP variable via `Application.SetSystemVariable` or writes to a shared file.
3. LISP calls `(command "C3D_GetSurfaceElev")` and reads the result.

This is more complex but enables LISP scripts to leverage the full Civil 3D API.

### Data exchange via files

For extracting Civil 3D data to LISP:

1. Use Civil 3D's built-in export commands (export points, export surface to LandXML, export alignment to CSV).
2. Read the exported file in LISP with `(open file "r")` and `(read-line)`.
3. Process the data in LISP.

This is viable for batch reporting but not for interactive tools.

## When to stay in LISP vs move to .NET

| Task | LISP | .NET |
|---|---|---|
| Layer management, text editing, block operations | Good fit | Overkill |
| AutoCAD geometry (lines, polylines, circles) | Good fit | Also works |
| Civil 3D object creation/modification | Cannot do | Required |
| Complex UI (dialogs, palettes) | Limited (DCL) | Full WPF/WinForms |
| Performance-critical batch operations | Slower | Faster |

## Related

- [vl-load-com and COM access](vl-load-com.md)
- [Common patterns](common-patterns.md)
- [.NET setup](../dotnet-api/setup.md)
- [Working with objects (.NET)](../dotnet-api/working-with-objects.md)
