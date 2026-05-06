---
title: "Editing Alignments"
section: "civil3d/alignments"
order: 40
visibility: public
tags: [alignment, editing, geometry-editor, grip-edit, sub-entity]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITGEOMETRY, EDITSUBENTITY, ALIGNMENTPROPERTIES]
updated: 2026-05-06
---

> **TL;DR**
> 1. The **Geometry Editor** (Alignment tab > Modify > Geometry Editor, or `EDITGEOMETRY`) is the primary editing tool. It lists every sub-entity with editable parameters: pass-through point, radius, direction, length, constraint type.
> 2. **Grip editing** in the drawing is the fastest way to adjust alignment geometry visually. Grips appear at entity endpoints, PIs, midpoints, and radius points. Drag a grip and the alignment updates dynamically.
> 3. Understand **locked vs unlocked parameters**. A locked parameter (padlock icon in the Geometry Editor) is fixed and constrains other values. Unlocking it allows Civil 3D to solve it from adjacent geometry. Editing a locked parameter on a float/free entity can break the chain.

## Geometry Editor

The Geometry Editor opens as a Panorama-style toolbar with a tabular list of all sub-entities.

### Columns

| Column | Description |
|---|---|
| Entity # | Sequential number |
| Type | Line, Curve, or Spiral |
| Constraint | Fixed, Float, or Free |
| Pass Through | Coordinates of a point the entity must pass through (if constrained) |
| Direction/Bearing | For lines: bearing direction. For curves: not applicable |
| Radius | Curve radius (blank for lines) |
| Length | Entity length along the alignment |
| Start Station | Station at the entity's start |
| End Station | Station at the entity's end |

### Editing in the table

Click a cell to edit. Editable cells have a white background; read-only cells are grayed. Changing a value (e.g., a curve radius) immediately updates the alignment in the drawing. If the edit causes a conflict (e.g., a free curve cannot maintain tangency at the new radius), Civil 3D highlights the error.

### Lock icons

Each numeric parameter has a lock icon:

- **Locked (closed padlock)**: the value is fixed and will not change when adjacent entities are edited.
- **Unlocked (open padlock)**: the value is computed from adjacent geometry and may change.

Toggle the lock to control which parameters are inputs and which are outputs. For example, lock a curve radius to 500 ft and unlock its length; the length adjusts as adjacent tangents move. Or lock the length and unlock the radius; the radius adjusts instead.

## Grip editing

Select the alignment in the drawing to display grips:

- **Endpoint grips** (blue squares) at the start and end of each sub-entity.
- **PI grips** (triangular) at tangent intersection points. Drag to move the PI; the adjacent curves adjust.
- **Midpoint grips** on curves and spirals. Drag perpendicular to the alignment to change the radius.
- **Radius-point grip** (diamond) for curves. Drag to change the radius while keeping the curve's endpoints fixed.

Grip editing honors the constraint system. Dragging a fixed-entity grip moves only that entity. Dragging near a float or free entity causes the chain to adjust.

### Grip editing tips

- Hold `Ctrl` while dragging to constrain movement to the alignment direction or perpendicular.
- Undo (`Ctrl+Z`) after a grip drag if the result is not as expected. Grip edits are single-undo steps.
- On complex alignments, zoom in to the area of interest before grip-editing to avoid accidentally grabbing a distant grip.

## Sub-entity editor

The Sub-Entity Editor (Alignment tab > Modify > Sub-Entity Editor, or `EDITSUBENTITY`) opens a properties panel for a single selected sub-entity. It shows the same parameters as the Geometry Editor but in a property-sheet format, which is easier to read for a single entity.

1. Activate the command.
2. Click a sub-entity (a line, curve, or spiral segment) in the drawing.
3. The properties panel displays all parameters. Edit as needed.
4. Click the next entity to switch, or press Escape to close.

## Tabular editing (Panorama)

For batch changes, the Geometry Editor's Panorama table allows scrolling through all entities. Sort by column (e.g., sort by Radius to find all curves below a threshold). Edit cells directly.

## When edits break the alignment

An alignment breaks when a sub-entity cannot satisfy its geometric constraints. Symptoms:

- A red "X" or exclamation mark appears on the alignment in plan view.
- The Geometry Editor shows a red-highlighted row.
- Downstream entities may disappear or display incorrectly.

Common causes:

| Cause | Example |
|---|---|
| Two tangents diverge beyond the possible curve radius | Moving a PI so the deflection angle requires a radius smaller than the locked minimum |
| A float entity loses its anchor | Deleting the entity that a float entity was tangent to |
| Spiral parameters are incompatible | Changing a spiral length to a value too large for the adjacent curve radius |
| Station equation conflict | Placing a station equation that overlaps with a geometry edit |

### Recovery

1. Undo (`Ctrl+Z`) if the break just occurred.
2. In the Geometry Editor, find the red-flagged entity. Unlock a parameter or change a value to restore a solvable configuration.
3. As a last resort, delete the offending sub-entity and re-create it.

## Deleting and inserting entities

- **Delete a sub-entity**: select the entity in the Geometry Editor and press the Delete key, or right-click > Delete. Adjacent entities may adjust or break depending on their constraint types.
- **Insert a sub-entity**: use the Alignment Layout toolbar tools (same tools as creation) to add a new entity between existing ones. The new entity's constraint type determines how it integrates.

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Alignment creation tools](alignment-creation-tools.md)
- [Design criteria and check sets](design-criteria.md)
- [Alignment from polyline](alignment-from-polyline.md)
