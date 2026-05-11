---
title: "Alignment Creation and Types"
section: "civil3d/alignments"
order: 14
visibility: public
tags: [alignment, centerline, offset, curb-return, rail, alignment-type]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateAlignmentLayout, CreateAlignmentFromObjects, CreateOffsetAlignment, CreateAlignmentCurbReturn, CreateAlignmentFromCorridor]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Creating Alignments
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-AB47BD2C-7C6B-4E3F-9A2D-1A5B6F7E0C8D
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Alignment Types
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1F6C2A3B-4D5E-6F7A-8B9C-0D1E2F3A4B5C
    verified: 2026-05-11
---

> **TL;DR**
> 1. Civil 3D supports five **alignment types**: **Centerline**, **Offset**, **Curb Return**, **Rail**, and **Miscellaneous**; the type determines available styles, label sets, and behavior (e.g., offsets are dynamic to a parent).
> 2. Three creation paths: **Layout Tools** (sketch tangents/curves/spirals interactively), **From Objects** (convert a polyline/line/arc), and special creators for **Offset**, **Curb Return**, and **From Corridor**.
> 3. Pick the right type up front: changing an alignment type after creation requires recreating the alignment.

## Alignment types

| Type | Use |
|---|---|
| Centerline | Mainline horizontal geometry; carries stationing; the parent for offsets and curb returns. |
| Offset | Dynamic offset of a centerline; updates when the centerline geometry changes. |
| Curb Return | Spiral/arc tangent-to-tangent fit at a roadway intersection between two parent alignments. |
| Rail | Centerline with rail-specific design checks and units (cant instead of superelevation, rail criteria). |
| Miscellaneous | Anything that isn't a roadway centerline (utility runs, ditches, project boundaries). No stationing-driven design checks. |

## Creating from layout tools

Ribbon **Home > Create Design > Alignment > Alignment Creation Tools** (command: `CreateAlignmentLayout`).

Fill the **Create Alignment - Layout** dialog:

- **Name** (e.g., `MAIN-RD`).
- **Type** — pick Centerline, Rail, etc.
- **Description**, **Starting station** (default 0+00).
- **Site** — usually `<None>` to keep alignments out of parcel topology.
- **Style**, **Alignment label set**.
- **Conceptual** — uncheck unless this is a placeholder.
- Optional **Design criteria** file, **Design check set**, **Design speed**.

Click **OK**. The **Alignment Layout Tools** toolbar opens.

Toolbar groups:

- **Tangent-Tangent (No Curves)** / **Tangent-Tangent (With Curves)** — sketch PIs.
- **Fixed Line / Curve / Spiral** — pin a constraint at known geometry.
- **Floating Line / Curve / Spiral** — attach to an existing entity at one end.
- **Free Curve / Spiral** — fit between two existing entities.
- **More Floats / More Frees** — additional spiral combinations.
- **Reverse Sub-entity Direction**.

Pick PIs in the drawing or type coordinates. Right-click to end the command.

## Creating from objects

Ribbon **Home > Create Design > Alignment > Create Alignment from Objects** (command: `CreateAlignmentFromObjects`).

Workflow:

1. Select existing AutoCAD entities (polylines, lines, arcs, splines).
2. Pick the alignment direction.
3. Fill the **Create Alignment from Objects** dialog (same as layout tools, plus **Add curves between tangents** if the source is line-only).

The result is a new alignment whose geometry mirrors the source. Curves are converted to true alignment curves; spirals become spirals if the source is a spline approximating one (otherwise straight curve).

## Offset alignments

Ribbon **Home > Create Design > Alignment > Create Offset Alignment** (command: `CreateOffsetAlignment`).

Dialog:

- **Number of offsets** to the left and right.
- **Incremental offset distance**.
- **Alignment type** — fixed to **Offset**.
- **Style/label set**.
- **Add widening** — optional widening regions where the offset diverges (e.g., turn lanes).

The created alignments stay dynamic to the parent centerline.

## Curb-return alignments

Ribbon **Home > Create Design > Alignment > Create Alignment for Curb Return** (command: `CreateAlignmentCurbReturn`).

Workflow:

1. Pick the entry roadway alignment + side.
2. Pick the exit roadway alignment + side.
3. Civil 3D fits a fillet (arc and optional spirals) at the intersection.
4. Set the **radius** and entry/exit edge offsets in the dialog.
5. Curb-return profiles can be auto-created from the design surface.

## Rail alignments

Same toolbar as centerline, but the alignment type is **Rail** and the design criteria file expects rail criteria (minimum radius by speed, cant rates). Use this when the project is a rail corridor; design checks differ from highway.

## Miscellaneous alignments

Use for non-stationed centerlines: easements, fence lines, utility runs that need a path but not a corridor. They participate in offset/labeling but skip roadway design criteria.

## From corridor

`CreateAlignmentFromCorridor` extracts a feature line from the corridor as a new alignment. Useful when the corridor's daylight or a constructed edge needs to become the parent for further offsets.

## Common errors

- **Wrong type chosen** — type cannot be changed in place; create a new alignment of the correct type and reapply profiles/views.
- **Alignment ends up in a site** — alignments default to `<None>` site; if accidentally placed in a parcel site, parcels may split. Move the alignment to `<None>` via Properties.
- **Curb return doesn't fit** — entry/exit edges have inconsistent offsets; verify the parent offset alignment offsets match the curb return inputs.
- **Offset alignment doesn't update** — it was created as static (from objects); recreate via `CreateOffsetAlignment`.
- **Spiral entity invalid** — sketched A-value out of range for design speed; the entity is created but flagged red. Adjust radii or use a fixed spiral.

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Alignment creation tools (existing page)](alignment-creation-tools.md)
- [Offset alignments](offset-alignments.md)
- [Alignment criteria design](alignment-criteria-design.md)
- [Aligning to a polyline](alignment-from-polyline.md)
