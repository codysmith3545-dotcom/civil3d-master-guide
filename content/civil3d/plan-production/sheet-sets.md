---
title: "Sheet Sets and the Sheet Set Manager"
section: "civil3d/plan-production"
order: 20
visibility: public
tags: [sheet-set, sheet-set-manager, ssm, dst-file, create-sheets, publish]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATESHEETS, SSM, SSMOPEN, PUBLISH]
sources:
  - title: "Autodesk Civil 3D Help — Sheet Sets"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-B3F5D7E3-5E3F-4B7D-8D3F-E5B7D3F5E3B7"
updated: 2026-05-06
---

> **TL;DR**
> 1. The **Sheet Set Manager** (SSM, opened with `SSM` or Ctrl+4) organizes all plan sheets for a project. It stores sheet metadata — name, number, description, custom properties — in a `.dst` file.
> 2. The `CREATESHEETS` command generates sheet layouts from view frames, automatically linking each layout to the SSM, populating the title block with fields (sheet number, station range), and creating viewports aimed at the correct model-space extents.
> 3. Publishing from the SSM batch-prints or exports the entire sheet set (or a subset) to PDF, DWF, or a plotter in a single operation.

## Sheet Set Manager basics

The SSM is an AutoCAD feature that Civil 3D extends for plan production. It manages sheets across multiple DWG files.

### The .dst file

The sheet set definition is stored in a `.dst` file (an XML file). It contains:

- Sheet set name and properties.
- Sheet entries: each sheet references a layout tab in a specific DWG file.
- Subsets: groups of sheets (e.g., "Plan & Profile", "Cross Sections", "Details").
- Custom properties: project name, client, project number, engineer of record — available as fields in title blocks.
- Publish settings: printer/plotter, paper size, plot style table.

The `.dst` file is typically stored in the project folder alongside the DWG files.

### Opening the SSM

- Ctrl+4, or View tab > Palettes > Sheet Set Manager.
- If no sheet set is open: File > Open Sheet Set > browse to the `.dst` file.

## Creating sheets from view frames

1. Output tab > Plan Production panel > Create Sheets (`CREATESHEETS`).
2. Select the view-frame group.
3. The wizard offers:
   - **Sheet creation method** — create all sheets in one DWG, one sheet per DWG, or add to an existing DWG.
   - **Sheet set** — create a new sheet set or add to an existing one.
   - **Sheet naming** — auto-name sheets using alignment name, sheet number, station range, or a custom format.
4. Click Create. For each view frame, Civil 3D:
   - Creates a layout tab (paper space).
   - Inserts the template's title block.
   - Creates a plan viewport aimed at the view frame's model-space extents.
   - Creates a profile viewport (if the template has one) with a profile view matched to the view frame's station range.
   - Registers the layout as a sheet in the SSM.

### One DWG vs multiple DWGs

| Approach | Pros | Cons |
|---|---|---|
| All sheets in one DWG | Simple file management; easy to reference shared model data | Large file size; slower saves; multi-user conflict |
| One sheet per DWG | Small files; multi-user friendly; faster saves | More files to manage; xrefs needed for model data |

For most Civil 3D projects, all sheets in one DWG (or one DWG per discipline) is practical because the model data already lives in the same file.

## SSM features

### Sheet list

The SSM sheet list shows every sheet in the set. Double-click a sheet to open its layout. Right-click to access:

- Rename or renumber.
- Open/close the drawing.
- Publish selected sheets.
- eTransmit the sheet set.

### Subsets

Organize sheets into groups:

- Plan & Profile Sheets
- Cross-Section Sheets
- Detail Sheets
- Drainage Sheets

Subsets help with publishing (print only one subset) and navigation.

### Custom properties

Define project-wide custom properties that are accessible as fields anywhere in the sheet set:

1. Right-click the sheet set name > Properties.
2. Click Edit Custom Properties.
3. Add properties: "Project Number", "Client Name", "Engineer of Record", "Design Speed", etc.
4. These values appear in title-block fields via `%<\AcVar SheetSet.CustomProperty>%` expressions.

### Sheet-level properties

Each sheet can have its own properties (overriding set-level defaults):

- Sheet number.
- Sheet title.
- Description.
- Custom fields (e.g., station range).

## Fields in title blocks

Civil 3D / AutoCAD fields dynamically populate title-block text. Common field references for plan-production sheets:

| Field | Resolves to |
|---|---|
| `SheetSet.Name` | Sheet set name |
| `SheetSet.ProjectNumber` | Custom property value |
| `Sheet.Number` | Sheet number (e.g., "C3.01") |
| `Sheet.Title` | Sheet title (e.g., "PLAN & PROFILE STA 10+00 TO STA 20+00") |
| `Sheet.CurrentRevision` | Revision number or date |
| View-frame station range | Start and end station of the view frame (set during CREATESHEETS) |

Fields update when the `.dst` file is edited or when the user issues `REGEN` / `UPDATEFIELD`.

## Publishing

The SSM centralizes batch publishing:

1. Right-click the sheet set (or a subset) > Publish.
2. Choose the output:
   - **DWF/DWFx** — lightweight vector format for electronic review.
   - **PDF** — the most common deliverable format.
   - **Plotter** — send directly to a configured plotter/printer.
3. The SSM processes each sheet sequentially, applying the page setup from the layout (or an override).
4. Output goes to a single multi-page file (PDF or DWF) or individual files per sheet.

### Page setup overrides

Each layout has a page setup (printer, paper size, plot style table). The SSM can override these with a named page setup so all sheets publish consistently. Set the override in the SSM's Publish dialog or in the sheet set's Publish Options.

### eTransmit

Right-click the sheet set > eTransmit. Civil 3D packages all DWGs, xrefs, plot style tables, and the `.dst` file into a ZIP for delivery. This ensures the recipient can open the sheet set with all dependencies.

## Tips

- Back up the `.dst` file regularly. If it is corrupted, the sheet set must be recreated manually.
- Use a consistent sheet-numbering scheme across all disciplines (e.g., C3.01 for roadway plan-profile sheet 1, C5.01 for cross-section sheet 1).
- Lock viewports in each layout after creation to prevent accidental zoom/pan. Double-click inside the viewport > set the scale > right-click the viewport border > Display Locked > Yes.
- If sheets need to be reordered, drag them in the SSM. Sheet numbers update if they use auto-increment fields.

## Related

- [View frame groups](view-frame-groups.md)
- [Match lines](match-lines.md)
- [Plan and profile sheets workflow](plan-and-profile-sheets.md)
- [Sheet templates (DWT)](sheet-templates.md)
