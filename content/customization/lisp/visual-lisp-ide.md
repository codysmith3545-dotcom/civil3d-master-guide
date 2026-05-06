---
title: "Visual LISP IDE"
section: "customization/lisp"
order: 20
visibility: public
tags: [lisp, visual-lisp, vlide, vlisp, debugging, ide]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AutoCAD AutoLISP Developer's Guide — Visual LISP Editor"
    url: https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-A0E9D801-8BE9-4BF1-85E8-3807E15F3B71
    verified: 2026-05-06
---

> **TL;DR**
> 1. Open the Visual LISP IDE with the command **VLIDE** (or **VLISP**). It provides syntax highlighting, a console for interactive testing, and a debugger with breakpoints and variable inspection.
> 2. Use the **console** to test expressions interactively before putting them in a file. Use **stepping** (Debug > Step Into/Over) to trace execution line by line.
> 3. For large projects or teams, consider using an external text editor (VS Code with AutoLISP extension) for editing, and VLIDE only for debugging.

## Opening the IDE

Type `VLIDE` at the Civil 3D command line. The IDE opens as a separate window with:

- **Text editor** — syntax-highlighted editor for .lsp files. Color-codes parentheses matching, strings, comments, and built-in functions.
- **Console** — an interactive LISP prompt. Type any expression and see the result immediately. Useful for testing `(ssget)` filters, entity data access, and variable values.
- **Watch window** — monitor variable values during execution.
- **Trace/Stack window** — view the call stack during debugging.

## Key features

### Syntax highlighting and parenthesis matching

The editor color-codes:
- Built-in functions (blue)
- Strings (magenta)
- Comments (green, after semicolons)
- Integers and reals (teal)

Place the cursor on a parenthesis and the matching parenthesis highlights. This is critical for debugging mismatched parentheses, which are the most common LISP syntax error.

### Console

The console window accepts any AutoLISP expression. Use it to:

- Test a function call: `(setq pt (getpoint "\nPick: "))`
- Inspect a variable: `!pt` (the `!` prefix prints the variable value)
- Load a file: `(load "C:/lisp/myfile.lsp")`
- Call a function you just loaded to test it

### Debugging

Set a breakpoint by clicking in the margin next to a line, or by inserting a `(break)` call in the code. Then:

1. Load the file in the IDE.
2. Run the command from the Civil 3D command line.
3. When execution hits the breakpoint, the IDE activates and shows the current line.
4. Use **Step Into** (F8) to enter function calls, **Step Over** (F10) to execute a line without entering sub-functions, and **Step Out** to finish the current function.
5. Hover over variables or use the Watch window to see current values.
6. Use **Continue** (F5) to resume execution.

### Inspecting variables

During a debug pause:
- Hover over a variable name in the editor.
- Type `!variablename` in the console.
- Add variables to the Watch window for persistent monitoring.

For complex data (lists, association lists, entity data), the console prints the full structure.

## When to use VLIDE vs an external editor

| Task | VLIDE | External editor (VS Code) |
|---|---|---|
| Quick testing and console work | Best choice | No console available |
| Debugging with breakpoints | Best choice | Limited |
| Editing large multi-file projects | Workable but dated UI | Better (tabs, search, git integration) |
| Team collaboration with version control | No git integration | Better |
| Syntax highlighting | Good | Good (with AutoLISP extension) |

The VS Code AutoLISP extension (by Autodesk) provides syntax highlighting, basic IntelliSense, and the ability to launch and attach to AutoCAD/Civil 3D for debugging. It is the recommended editor for larger projects, with VLIDE reserved for interactive console work and quick debugging.

## Compiling to FAS and VLX

From the VLIDE, you can compile .lsp files into:

- **FAS** — compiled single file (faster loading, source not readable).
- **VLX** — Visual LISP executable; can bundle multiple .lsp files, DCL dialogs, and other resources into one package.

Compilation is done from the IDE: File > Make Application > New/Existing Application Wizard.

## Related

- [Loading at startup](loading-at-startup.md)
- [Common patterns](common-patterns.md)
- [Distributing LISP](distributing-lisp.md)
- [vl-load-com and COM access](vl-load-com.md)
