---
title: "Sections in Plan Production"
section: "civil3d/plan-production"
order: 30
visibility: public
tags: [cross-section, section-sheet, sample-line, section-view-group, material-list, plan-production]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATESECTIONVIEWGROUP, CREATESAMPLELINES, COMPUTEMATERIALS, CREATESHEETS]
sources:
  - title: "Autodesk Civil 3D Help — Section Views in Plan Production"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-F3B7D5E3-5D7E-4F3B-8D3E-E5F7D3B5E3F7"
updated: 2026-05-06
---

> **TL;DR**
> 1. Cross-section sheets display section views arrayed in rows and columns, showing the existing ground, proposed design, and material areas at each sample-line station.
> 2. Use `CREATESECTIONVIEWGROUP` with the **production layout** option to size and array section views to fit your sheet template. Civil 3D calculates how many sections fit per sheet and generates the layouts.
> 3. Material lists (from `COMPUTEMATERIALS`) and total volume tables can be placed on the section sheets or on a separate summary sheet for earthwork quantity reporting.

## Section sheet workflow

### Prerequisites

- An alignment with sample lines placed at the desired stations (see [Corridor sections](../corridors/corridor-sections.md)).
- Surfaces sampled: existing ground, corridor top, corridor datum (as needed).
- Corridor sections computed (the corridor must be built and up to date).
- A DWT template sized for the section sheets (often the same paper size as plan-profile sheets but with a different viewport arrangement).

### Step 1: Create the section view group

1. Home tab > Profile & Section Views panel > Section Views > Create Multiple Section Views (`CREATESECTIONVIEWGROUP`).
2. Select the sample-line group.
3. In the wizard:
   - **General** — name, section view style.
   - **Section Placement** — choose between **Array** layout (for screen review) or **Production** layout (for sheets).
   - **Offset Range** — left and right extents. Set wide enough to show the full cross-section including daylight.
   - **Elevation Range** — automatic (fits each section) or manual (fixed datum). Automatic is easier; fixed datum gives a consistent visual baseline across sheets.
   - **Section Display Options** — which surfaces and corridor data to draw. Typically: existing ground (dashed), finished grade (solid), corridor shape fills.
   - **Data Bands** — offset/elevation data bands below each section (optional for sections; common for profiles).

### Array vs production layout

| Layout | Use |
|---|---|
| **Array** | Sections tiled in a regular grid in model space. Good for on-screen review and design iteration. Not sized for specific sheets. |
| **Production** | Sections arrayed to fit a specified sheet size and viewport area. Civil 3D calculates rows, columns, and page breaks so sections transfer directly to layouts. |

For plan production, always use the production layout. Specify:

- Sheet width and height (match the DWT).
- Viewport area within the sheet (excluding title block and margins).
- Number of rows and columns per page.
- Spacing between section views.

Civil 3D fills each page, then starts a new page. The result is a set of section-view "pages" in model space, each sized to fit one sheet.

### Step 2: Create sheets from section views

The section-view group can be converted to sheet layouts:

1. Output tab > Plan Production panel > Create Section Sheets.
2. Select the section view group.
3. Choose the DWT template and sheet set.
4. Civil 3D creates one layout per page, with a viewport aimed at the corresponding group of section views.

Alternatively, create layouts manually and aim viewports at each section-view page.

## Section view content

Each section view displays:

- **Existing ground** — a line representing the sampled surface at that station.
- **Proposed design** — corridor links and shapes showing the road cross-section, including pavement, subbase, curbs, shoulders, ditches, and daylight slopes.
- **Material fill patterns** — hatched areas showing cut, fill, topsoil, aggregate, pavement, etc. These correspond to the materials defined in `COMPUTEMATERIALS`.
- **Labels** — station, offset/elevation values, slope annotations, area quantities.

### Material areas on sections

After running `COMPUTEMATERIALS`, the section views can display:

- Shaded or hatched cut and fill areas.
- Material quantities per section (area in sq ft or sq m).
- Cumulative volumes (as labels or in the data bands).

Enable these in section view properties or by adding label styles that reference the computed material data.

## Material lists

A material list is the output of `COMPUTEMATERIALS`. It defines which surfaces are compared and what material categories exist:

- **Earthwork** — EG surface vs. datum surface. Cut and fill volumes.
- **Pavement** — datum surface vs. finished grade surface. Broken into HMA, aggregate base, subbase if multiple surfaces exist.
- **Topsoil** — EG surface vs. stripped surface (EG minus strip depth).

Material lists are associated with the alignment and sample-line group. They can be displayed as:

- Section view fill patterns.
- A Total Volume Table placed in the drawing.
- An XML/CSV report via `GENERATEQUANTITYREPORT`.

## Section sheet sizing

Cross-section views are typically plotted at a larger scale than plan-profile views because the cross-section is narrow (40 to 80 ft wide) and the elevation range is small. Common section scales:

| Scale | Use |
|---|---|
| 1" = 10' (1:120) | Detailed urban sections with curbs and utilities |
| 1" = 20' (1:240) | Standard road sections |
| 1" = 40' (1:480) | Wide rural sections with extensive daylight |

With the production layout, Civil 3D adjusts the number of sections per page based on the chosen scale and section-view size.

## Tips

- Use a consistent elevation range across all sections to make visual comparison easier. If automatic datum is used, sections at different elevations will have different grid positions, which can confuse reviewers.
- Include a station label above each section view. The section view style can display the station in the title.
- For earthwork review, show the cut area in one color (red) and the fill area in another (blue/green). This makes it immediately obvious where cuts and fills occur.
- Place the Total Volume Table on the first or last cross-section sheet, or on a dedicated summary sheet. Include the table in the same sheet set.
- If sections change significantly after sheet creation (e.g., the corridor is redesigned), the section views update automatically in model space. The sheet layouts and viewports do not need to be recreated unless the number of sections changes.

## Related

- [Corridor sections and section views](../corridors/corridor-sections.md)
- [Plan and profile sheets](plan-and-profile-sheets.md)
- [Sheet sets and the Sheet Set Manager](sheet-sets.md)
- [Sheet templates (DWT)](sheet-templates.md)
