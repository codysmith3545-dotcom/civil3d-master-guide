---
title: "Dynamo for Civil 3D Overview"
section: "customization/dynamo"
order: 10
visibility: public
tags: [dynamo, visual-programming, civil3d, automation, nodes, graphs]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Dynamo for Civil 3D Documentation"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-DynamoForCivil3D
    verified: 2026-05-06
  - title: "Dynamo Primer"
    url: https://primer2.dynamobim.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Dynamo for Civil 3D is a **visual programming environment** that ships with Civil 3D (since 2020). It uses a node-and-wire interface where you connect functional blocks to create automated workflows — no text-based coding required.
> 2. Strengths: rapid prototyping, accessible to non-programmers, direct access to Civil 3D objects (alignments, surfaces, profiles, corridors). Weaknesses: slow for large-scale batch operations, limited UI capabilities.
> 3. Launch Dynamo from the **Manage** tab > **Visual Programming** panel > **Dynamo** button in Civil 3D.

## What Dynamo is

Dynamo is a visual programming tool developed by Autodesk. It represents logic as a graph of connected nodes rather than lines of text code. Each node performs an operation (get an object, read a property, do math, set a property), and wires carry data between nodes.

Dynamo for Civil 3D runs inside Civil 3D as an add-in — it is not a standalone application. It has direct access to the Civil 3D object model and can read and modify drawing objects in real time.

## How it differs from LISP and .NET

| Aspect | LISP | .NET | Dynamo |
|---|---|---|---|
| Interface | Text editor + command line | Visual Studio (text) | Visual node graph |
| Learning curve | Moderate | Steep | Gentle |
| Civil 3D object access | None (command-line only) | Full API | Full (via nodes) |
| Performance | Moderate | Fast | Slower for large operations |
| UI capability | DCL dialogs (limited) | WPF/WinForms (full) | Input parameters only |
| Distribution | .lsp/.vlx files | .dll/.bundle | .dyn files |
| Best for | CAD automation tasks | Complex plugins, production tools | Rapid prototyping, data extraction, parameter sweeps |

## Core concepts

### Nodes

Each node is a function. Nodes have input ports (left side) and output ports (right side). Types of nodes:

- **Civil 3D nodes** — select, read, and modify Civil 3D objects (alignments, surfaces, profiles, etc.).
- **Geometry nodes** — create and manipulate geometric primitives (points, lines, surfaces).
- **Math nodes** — arithmetic, trigonometry, rounding, comparisons.
- **List nodes** — create, filter, sort, combine, and iterate lists.
- **String nodes** — concatenation, splitting, formatting.
- **File nodes** — read/write CSV, Excel, JSON files.
- **Code Block** — write DesignScript expressions directly (for users comfortable with text).

### Wires

Wires connect outputs to inputs, carrying data (numbers, strings, objects, lists). A single output can feed multiple inputs. Wire colors indicate data type.

### Lacing

When a node receives a list on one input and a single value on another, lacing determines how they combine:

- **Shortest** — pairs elements up to the shorter list length.
- **Longest** — repeats the last element of the shorter list.
- **Cross product** — every combination.

### Run mode

- **Automatic** — the graph re-executes whenever an input changes.
- **Manual** — the graph runs only when you click "Run."

Use Manual mode when your graph modifies the drawing to avoid unintended repeated changes.

## Launching Dynamo

In Civil 3D: **Manage** tab > **Visual Programming** panel > **Dynamo**. The Dynamo workspace opens as a dockable panel or separate window. The graph runs in the context of the active drawing.

## Typical use cases

- Read all alignment names and stations, export to CSV.
- Assign corridor targets from a spreadsheet.
- Rename a set of surfaces based on a naming convention.
- Create multiple profiles from a surface along parallel alignments.
- Extract pipe network data for import into a hydraulic model.
- Parameter sweeps (test multiple design values and compare results).

## Related

- [First graph](first-graph.md)
- [Civil 3D-specific packages](civil3d-packages.md)
- [Dynamo Player](dynamo-player.md)
- [Limitations](limitations.md)
