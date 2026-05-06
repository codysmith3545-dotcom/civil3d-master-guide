---
title: "Sheet Templates (DWT) and Viewports"
section: "civil3d/plan-production"
order: 40
visibility: public
tags: [dwt, template, title-block, viewport, page-setup, annotation-scale, plan-production]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [SAVEAS, MVIEW, PAGESETUP, FIELDUPDATE]
sources:
  - title: "Autodesk Civil 3D Help — Sheet Templates"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D3F5E7B3-3B7D-4E5F-8F3D-B5E7D3F5B3E7"
updated: 2026-05-06
---

> **TL;DR**
> 1. A **DWT (drawing template)** for plan-production sheets defines the paper size, title block, viewport positions, page setup (plotter, plot style table), and annotation-scale settings. Civil 3D's `CREATESHEETS` command reads the DWT to generate sheet layouts automatically.
> 2. The template must include **pre-defined viewports** — one for the plan area and one for the profile area (on plan-and-profile sheets). Civil 3D identifies these viewports and aims them at the corresponding view-frame extents and profile views.
> 3. Field codes in the title block automatically pull data from the Sheet Set Manager (project name, sheet number, station range, date) so that title information stays synchronized without manual edits.

## Anatomy of a plan-production DWT

A properly configured DWT contains:

### Paper space layout

- **Paper size** — matches the project standard (e.g., 22" x 34" ANSI D, 24" x 36" ARCH D, or A1 metric).
- **Title block** — a block insert with attribute fields. Positioned in paper space.
- **Border** — the sheet border graphic (sometimes part of the title block, sometimes a separate block).
- **Viewports** — rectangular MVIEW objects that define windows into model space. The plan viewport is typically in the upper portion; the profile viewport is in the lower portion.
- **Margins and notes area** — space for general notes, legend, revision table.

### Page setup

The DWT stores a named page setup that defines:

- **Plotter/printer** — "DWG To PDF.pc3" for PDF output, or a physical plotter name.
- **Paper size** — must match the layout paper size.
- **Plot style table** — `.ctb` (color-based) or `.stb` (style-based) file that controls line weights and screening at plot time.
- **Plot area** — typically "Layout" (prints the full paper-space extents).
- **Plot scale** — 1:1 for paper space (the viewport scale handles model-space scaling).

Configure with `PAGESETUP` or right-click the layout tab > Page Setup Manager.

## Viewport configuration in the template

### Plan viewport

The plan viewport occupies the upper portion of the sheet. It should be:

- Sized to accommodate the expected view-frame dimensions at the target plot scale. For a 1" = 50' scale on a 34"-wide sheet, the usable plan viewport might be 28" wide x 12" tall.
- Set to the correct annotation scale (matching the plot scale).
- Locked after positioning.

### Profile viewport

The profile viewport occupies the lower portion. It should be:

- Sized to display the profile view including bands. A typical height is 6" to 10" on a 22" x 34" sheet.
- The same width as the plan viewport so station ticks align vertically.
- Set to the same horizontal scale as the plan viewport.

### How Civil 3D identifies viewports

When `CREATESHEETS` reads the DWT, it looks for viewports by their position and the template's viewport labeling. Civil 3D ships sample DWTs with viewports tagged for "Plan" and "Profile" roles. If using a custom DWT, ensure the viewports are properly configured in the template so the wizard can match them.

Civil 3D's sample templates are located in:

```
C:\ProgramData\Autodesk\C3D <version>\enu\Template\Plan Production\
```

Review these as a starting point before building a custom template.

## Title block and field codes

The title block is typically an AutoCAD block with attributes. Replace static text with field codes to enable automatic updates from the SSM:

### Common field codes

| Attribute | Field expression | Resolves to |
|---|---|---|
| Project name | `%<\AcVar SheetSet.ProjectName>%` | "US 31 Widening" |
| Sheet number | `%<\AcVar Sheet.Number>%` | "C3.01" |
| Sheet title | `%<\AcVar Sheet.Title>%` | "PLAN & PROFILE STA 10+00 TO 20+00" |
| Project number | `%<\AcVar SheetSet.ProjectNumber>%` | "2026-0142" |
| Date | `%<\AcVar Date>%` | "05/06/2026" |
| Revision | `%<\AcVar Sheet.CurrentRevision>%` | "1" |

### Custom properties

Define project-specific custom properties in the SSM (right-click > Properties > Edit Custom Properties). Reference them in title-block fields:

```
%<\AcVar SheetSet.customPropertyName>%
```

For example: `%<\AcVar SheetSet.ClientName>%`, `%<\AcVar SheetSet.EngineerOfRecord>%`.

### Field evaluation

Fields evaluate (resolve) when:

- The layout is opened or regenerated.
- The user runs `UPDATEFIELD` or `REGEN`.
- The sheet is published/printed.

If fields show `####` or `---`, the SSM may not be open or the property may not be defined.

## Annotation scale settings

The DWT should define annotation scales that match the project's plotting scales:

- 1" = 50' for plan sheets.
- 1" = 20' for detail sheets.
- 1" = 10' for cross-section sheets.

Set the default annotation scale for each layout viewport so that annotative objects (text, dimensions, labels) display at the correct size. Civil 3D labels use annotative scaling — their text height adjusts based on the viewport's annotation scale.

Configure in the viewport properties or by double-clicking into the viewport and selecting the annotation scale from the status bar.

## Company logo and graphics

Place the company logo as a block or raster image in the title block area:

- **Block insert** — vector logo (DWG block) scales cleanly at any size.
- **Raster image** — use a high-resolution PNG or TIFF (300 dpi minimum at printed size). Attach with `IMAGEATTACH` and size to fit the title-block logo area.

Embed the image or block in the DWT so it travels with the template. If using a raster image, ensure the image path is relative so the DWT works on different machines.

## Creating a custom DWT

1. Start with a Civil 3D sample template or a blank drawing.
2. Switch to a layout tab. Set the paper size via Page Setup.
3. Draw or insert the title block. Replace static text with field codes.
4. Create the plan viewport (`MVIEW`). Size and position it.
5. Create the profile viewport. Size and position it directly below the plan viewport, matching the width.
6. Set each viewport's scale and annotation scale. Lock both viewports.
7. Add the company logo, general notes template, and revision block.
8. Save As > DWT (Drawing Template File). Store in the project template directory.

## Tips

- Maintain a master DWT per sheet size and discipline. Avoid one-off modifications to individual sheet layouts; instead, update the DWT and regenerate sheets.
- Test the DWT by running `CREATESHEETS` on a sample project before deploying to the full project. Verify that viewports aim correctly and that fields resolve.
- Include a "NOT FOR CONSTRUCTION" watermark in the DWT for preliminary submittals. Replace with the final stamp for construction documents.
- Store DWTs on a company network share referenced by all users via Options > Files > Template Settings. This ensures everyone uses the current version.
- If the project requires both 22" x 34" and 11" x 17" (half-size) deliverables, create two page setups in the same DWT — one for full-size and one for half-size. Publish from the SSM using the appropriate page-setup override.

## Related

- [View frame groups](view-frame-groups.md)
- [Sheet sets and the Sheet Set Manager](sheet-sets.md)
- [Plan and profile sheets workflow](plan-and-profile-sheets.md)
- [Sections in plan production](sections-in-plan-production.md)
