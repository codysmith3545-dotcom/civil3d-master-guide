---
title: "Subassembly Composer"
section: "civil3d/corridors"
order: 40
visibility: public
tags: [subassembly-composer, custom-subassembly, flowchart, pkt-file, subassembly-design]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [IMPORTSUBASSEMBLY, ADDSUBASSEMBLY]
sources:
  - title: "Autodesk Civil 3D Help — Subassembly Composer Overview"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-E5C7D3F5-7E3F-4A5E-8F3D-B7E5D3F5E7A5"
updated: 2026-05-06
---

> **TL;DR**
> 1. **Subassembly Composer** is a standalone application (installed with Civil 3D) that lets you design custom subassemblies using a **flowchart** interface — no programming required. It produces `.pkt` files that import directly into Civil 3D tool palettes.
> 2. The flowchart defines geometry sequentially: each node creates a point, link, or shape. Branching logic (if/else) handles conditions like "if cut, use 2:1 slope; if fill, use 3:1 slope." Input parameters, target references, and output codes are all configured in the flowchart.
> 3. Use Composer when stock subassemblies cannot achieve the geometry you need. For extremely complex logic or API access, .NET subassemblies are the alternative, but Composer covers the majority of custom needs.

## When to use Subassembly Composer

| Scenario | Tool |
|---|---|
| Standard lane, curb, daylight | Stock subassemblies (Tool Palettes) |
| Modified stock behavior (e.g., different slope logic, conditional benching) | Subassembly Composer |
| Complex multi-condition geometry with external data or API calls | .NET subassembly (Visual Studio + Civil 3D API) |
| Quick one-off shape (no parameters needed) | Generic links (`LinkWidthAndSlope`) chained together |

Composer is the right choice when you need custom geometric logic that stock subassemblies do not provide, but the logic can be expressed as a sequence of "place a point, draw a link, check a condition."

## Subassembly Composer interface

Launch from: Start menu > Autodesk > Subassembly Composer for Civil 3D <version>.

The interface has four main areas:

1. **Flowchart canvas** — the central workspace where you build the logic. Drag nodes from the toolbox and connect them with flow arrows.
2. **Toolbox** — lists available node types: Geometry (Point, Link, Shape), Logic (Auxiliary Point, If/Else, Switch, Loop), and Input/Output (Parameter, Target).
3. **Properties panel** — shows the selected node's parameters (offset, elevation, slope, code name, side).
4. **Preview pane** — a cross-section preview that updates as you build the flowchart. Lets you test with sample input values.

## Flowchart building blocks

### Geometry nodes

| Node | What it does |
|---|---|
| **Point** | Places a point at a calculated offset and elevation. Can be relative to origin, previous point, or a surface/alignment target. |
| **Link** | Draws a line (link) between two points. Links define the visible geometry in the corridor cross-section. |
| **Shape** | Creates a closed region (shape) between links. Shapes are used for material definitions (pavement, aggregate, etc.). |

### Logic nodes

| Node | What it does |
|---|---|
| **Auxiliary Point** | A construction point used for calculation but not output to the corridor. |
| **If / Else** | Branches the flowchart based on a condition (e.g., "is the current point above or below the target surface?"). |
| **Switch** | Multi-branch logic for enumerated conditions. |
| **Loop** | Repeats a section of the flowchart (e.g., for benching at regular intervals). |

### Input/Output nodes

| Node | What it does |
|---|---|
| **Input Parameter** | Defines a user-editable parameter (width, slope, depth) that appears in the subassembly's Properties palette in Civil 3D. |
| **Target** | References an external object: surface, alignment, or profile. Configures the target type and default behavior when the target is not assigned. |
| **Output Parameter** | Exports a calculated value (e.g., the actual daylight offset) for use in other subassemblies or corridor reports. |

## Example: custom daylight with conditional benching

A subassembly that daylights to existing ground with these rules:

- Cut: 2:1 slope. If cut height exceeds 12 ft, insert a 6 ft bench and continue at 2:1.
- Fill: 3:1 slope with no benching.

Flowchart outline:

1. **Start** node. Define input parameters: CutSlope (2), FillSlope (3), BenchWidth (6 ft), MaxCutBeforeBench (12 ft).
2. **Target** node: reference the existing-ground surface.
3. **Point** node: place the starting point (received from the previous subassembly's attachment point).
4. **If/Else** node: check if the target surface is above or below the starting point.
   - **If above (fill):** Place a point along a slope of 1:FillSlope until it intersects the target surface. Draw a link. End.
   - **If below (cut):** Enter the cut branch.
5. **Cut branch:** Place a point along a slope of 1:CutSlope. Check if the vertical distance exceeds MaxCutBeforeBench.
   - **If yes:** Place a bench point (offset horizontally by BenchWidth at the same elevation). Loop back to step 5.
   - **If no:** Continue the slope to the target surface intersection. Draw a link. End.
6. **Shape** nodes: define the cut shape and fill shape for material reporting.

## Packaging and distribution

When the flowchart is complete:

1. File > Save. The native format is `.pkt` (Package file).
2. File > Export to produce a `.pkt` ready for import into Civil 3D.
3. In Civil 3D: right-click a Tool Palette tab > Import Subassemblies > select the `.pkt` file.

The `.pkt` file contains the geometry logic, parameter definitions, help documentation, and a preview image. It can be shared with other users or placed on a company network for standardization.

### Versioning

Composer files are version-specific. A subassembly built in the 2025 Composer may not open in the 2022 Composer, but the resulting `.pkt` file is generally forward-compatible. Always test imported subassemblies in the target version of Civil 3D.

## Testing subassemblies

1. In Composer, use the Preview pane to test various input values and target surface positions.
2. After importing into Civil 3D, create a short test corridor (a few hundred feet) with the custom subassembly.
3. Verify: corridor rebuilds without errors, geometry matches the design intent at tangent and curve stations, targets resolve correctly, shapes produce expected material areas.
4. Check edge cases: what happens at the start and end of the corridor, at regions where the target surface does not exist, and at superelevation transitions.

## Limitations of Composer

- Cannot access the Civil 3D API or external data sources (databases, Excel). Use .NET subassemblies for those needs.
- Cannot read data from adjacent subassemblies in the same assembly (e.g., "what is the elevation of the lane crown?"). Subassemblies communicate only through attachment points and corridor codes.
- Complex multi-condition logic can become difficult to manage in the flowchart. If the flowchart exceeds ~50 nodes, consider whether a .NET approach would be cleaner.

## Related

- [Assemblies and subassemblies](assemblies-and-subassemblies.md)
- [Subassembly catalogs and tool palettes](subassembly-catalogs.md)
- [Targets (surface, alignment, profile)](targets.md)
- [Corridor troubleshooting](troubleshooting-corridors.md)
