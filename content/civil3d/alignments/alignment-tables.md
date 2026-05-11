---
title: "Alignment Tables"
section: "civil3d/alignments"
order: 28
visibility: public
tags: [alignment, table, line-table, curve-table, spiral-table, segment-table]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [AddLineCurveTable, AddCurveTable, AddSpiralTable, AddSegmentTable, EditTableStyle]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Alignment Tables
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2B3C4D5E-6F7A-8B9C-0D1E-2F3A4B5C6D7E
    verified: 2026-05-11
---

> **TL;DR**
> 1. Alignment tables (line, curve, spiral, segment) summarize sub-entity geometry in a tabular block on the plan, paired with **tag** labels (`L1`, `C1`) on each entity.
> 2. Add via **Annotate > Labels & Tables > Add Tables > Alignment > [type]**; pick the alignment, choose a table style, and place the table.
> 3. Tables are **dynamic**: edits to alignment geometry update tag values and table rows automatically.

## Table types

| Table | Lists |
|---|---|
| Line | Length, direction, start/end station, start/end coordinates |
| Curve | Radius, length, delta, chord, tangent, station |
| Spiral | A-value, length, radius range, station |
| Segment | All sub-entities in one table (sortable by station) |

## Adding a table

1. Tag the alignment first by switching the **alignment label set** to one whose tangent/curve/spiral styles use **tag**-style annotation (e.g., `L1`, `C1`).
2. Ribbon **Annotate > Labels & Tables > Add Tables > Alignment > [type]** (commands: `AddLineCurveTable`, `AddCurveTable`, `AddSpiralTable`, `AddSegmentTable`).
3. **Add Alignment Table** dialog:
   - **Table style** — pick a style.
   - **Selection** — by alignment, by label, or by tag selection.
   - **Split table** — break into multiple smaller tables when row count exceeds a threshold.
   - **Behavior** — Static (fixed rows) or Dynamic (auto-update).
4. **OK**. Click an insertion point.

## Customizing the style

Edit at **Toolspace > Settings > Alignment > Table Styles > [style]**:

- **Data Properties** tab: pick which columns to include, set column widths, header text, and value formatting.
- **Display** tab: text styles for header, title, body.

Best practice: standardize table styles per sheet size. Combine related entities (curve + spiral) in one segment table when the plan has continuous spiral-curve-spiral geometry.

## Tag prefixes

Tag prefixes (`L`, `C`, `S`) are configured on the **label style** that applies to the entity (Settings > Alignment > Label Styles). Change the prefix to differentiate alignments on the same sheet (e.g., `L1` mainline, `LR1` ramp).

## Common errors

- **Table contains no rows** — the alignment label set isn't using tag-style labels; switch the label set or add tag labels manually.
- **Table doesn't update** — created with **Static** behavior; recreate as Dynamic, or right-click > **Update Table Contents**.
- **Tag numbers skip** — a label style uses a different prefix than the table is filtering by; align both to the same prefix.
- **Split table sub-tables overlap** — manually move them; the split places them stacked at insertion.
- **Column reads `???`** — the table style references a property that the entity type doesn't have (e.g., spiral A-value on a line); edit the style or use a per-type table.

## Related

- [Alignment labels and station equations](alignment-labels-and-station-equations.md)
- [Alignment labels (existing page)](alignment-labels.md)
- [Alignment criteria design](alignment-criteria-design.md)
- [Alignment creation and types](alignment-creation-and-types.md)
