---
title: "Sheet Set Manager (SSM) with Civil 3D"
section: "civil3d/sheet-set-and-plans-production"
order: 10
visibility: public
tags: [sheet-set-manager, ssm, dst, view-frame, sheet-type, plan-production]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [NEWSHEETSET, SHEETSET, CREATESHEETS]
updated: 2026-05-11
sources:
  - title: "Autodesk AutoCAD Help - About Sheet Sets"
    url: "https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-FF6F8E61-7184-4D0F-A7C6-F8A1A35EB5E0"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - About the Create Sheets Wizard"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4C8E4E66-5C26-4E61-A1A5-5B7DE3E4C5E2"
    verified: 2026-05-11
---

> **TL;DR**
> 1. SSM organizes sheets, paper-space tabs, and plot batches; Civil 3D's Create Sheets wizard adds entries to an SSM `.dst` automatically.
> 2. Sheet types (plan, profile, plan-profile, section, sheet-only) come from the template assigned in the wizard; SSM stores the sheet's tab name, number, and plot device.
> 3. Use SSM custom properties to drive title-block fields - sheet number, total sheets, drawing date, scale, designer - so every sheet renders consistently.

## Sheet set basics

A sheet set is a `.dst` file (XML) that catalogs layouts (paper-space tabs) across one or more drawings. Each entry is a **sheet**; sheets group into **subsets**.

UI path: View tab > Palettes panel > **Sheet Set Manager** (`SHEETSET` to open, `NEWSHEETSET` to create).

The `New Sheet Set` wizard asks for:

- Begin: from a template or from an existing drawing/folder.
- Name and storage folder.
- Default template - the `.dwt` used when SSM creates a new sheet drawing.
- Default plot configuration - the printer/PC3 file used by **Publish to PDF / DWFx / Plotter**.

## Civil 3D integration

Civil 3D's **Create Sheets** wizard (`CREATESHEETS`) populates a sheet set as it generates plan-profile sheets:

1. Output tab > Plan Production panel > Create Sheets.
2. View Frame Group is selected. The wizard offers to create a **new sheet set** or **add to existing**.
3. Output options - drawing per view frame group, drawing per sheet, or all sheets in current drawing. Each sheet drawing becomes a `.dwg` file at the path you set.
4. The wizard registers each sheet in the `.dst`, applying its sheet number and title from the view-frame label.

After the wizard runs, SSM shows the new sheets under the chosen subset. Double-click a sheet to open its layout in the host drawing.

## Sheet types and subsets

Typical Civil 3D plan-set structure mirrors the design:

- Subset: General - title sheet, sheet index, legend.
- Subset: Existing Conditions.
- Subset: Demolition.
- Subset: Site Plan.
- Subset: Plan and Profile (one sheet per view frame).
- Subset: Details.

Each subset can define its own default template, storage folder, and sheet creation prompt.

UI path: in SSM, right-click subset > Properties > set Sheet Creation Template, Sheet Storage Location.

## SSM properties and title-block fields

SSM exposes:

- **Sheet properties**: number, title, description, sheet set custom properties.
- **Sheet set properties**: project number, client, date.

Insert these into the title block as **fields** (`FIELD` command, or Mtext > Insert Field > SheetSet or SheetSetPlaceholder). When SSM creates a sheet, every field bound to a sheet property auto-fills.

For a placeholder field that will not bind until the field is published, use SheetSetPlaceholder; AutoCAD prompts at publish time to evaluate it.

## Publishing

UI path: in SSM, right-click sheet set or subset > **Publish** > Publish to PDF, Publish to DWFx, or Publish using Page Setup Override.

- Page setup override applies the same plot configuration to every sheet (useful for half-size plots).
- The published file order follows the subset/sheet order in SSM. Renumbering happens by drag and drop.

## Common errors

- `Sheet set file is locked` / `Cannot open sheet set, file in use`: SSM stores a `.dst.lock` file. If a previous Civil 3D session crashed, manually delete the lock from the `.dst` folder.
- `Sheet not found - drawing path moved`: a sheet's host `.dwg` was relocated. Right-click the sheet > Properties > Browse to relocate.
- `Field shows ####`: SSM field bound to a property that does not exist (typo or removed property). Recreate the field with the correct property name.
- `Create Sheets did not populate sheet set`: the wizard's `Sheet set` page was left as `None`. Re-run the wizard with a sheet set selected.

## Related

- [Plan-profile plotting](plan-profile-plotting.md)
- [Create sheets by alignment](create-sheets-by-alignment.md)
- [Plan production sheet templates](../plan-production/sheet-templates.md)
- [Plan production sheet sets (overview)](../plan-production/sheet-sets.md)
