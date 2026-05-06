---
title: "Template Page Setups"
section: "customization/templates-and-kits"
order: 35
visibility: public
tags: [page-setup, plot, ctb, stb, ansi, sheet-size, layout, template]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Page Setups"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3A17C7E1-6E82-4E27-AE43-12BCC3F19F06
    verified: 2026-05-06
---

> **TL;DR**
> 1. Include page setups for all standard sheet sizes in your DWT: **ANSI D (24x36)**, **ANSI E (36x48)**, **11x17 (half-size)**, and **letter (8.5x11)**. Each setup specifies printer, paper size, CTB/STB, and scale.
> 2. Assign the company **CTB (color-dependent plot style table)** to each page setup so that every layout plots consistently without manual configuration.
> 3. Use named page setups rather than relying on individual layout settings — this allows a single update to propagate across all layouts that reference the setup.

## Standard sheet sizes for civil engineering

| Name | Dimensions | Typical use | Scale |
|---|---|---|---|
| ANSI D | 24" x 36" | Full-size plan sheets (most common) | 1" = 20' to 1" = 100' |
| ANSI E | 36" x 48" | Large-area plans, campus maps | 1" = 50' to 1" = 200' |
| ARCH D | 24" x 36" | Same size as ANSI D but Architectural | 1" = 20' to 1" = 50' |
| 11" x 17" (Tabloid) | 11" x 17" | Half-size prints, review sets | Half of full-size scale |
| Letter | 8.5" x 11" | Report exhibits, individual details | Varies |

ANSI D (24x36) is the industry standard for plan sets in land development and transportation.

## Creating page setups in the template

### Step 1: Create a layout tab

Each layout tab represents a potential sheet. The template should include at least one layout configured for each sheet size, or use named page setups that can be applied to any layout.

### Step 2: Configure the page setup

In the layout tab, right-click > Page Setup Manager > New:

| Setting | Example (ANSI D full-size) |
|---|---|
| Printer/plotter | DWG To PDF.pc3 (or company plotter) |
| Paper size | ANSI full bleed D (24.00 x 36.00 Inches) |
| Plot area | Layout |
| Plot offset | 0, 0 (centered) |
| Plot scale | 1:1 (the viewport handles the model-to-paper scale) |
| Plot style table | Company.ctb |
| Plot with plot styles | Yes |
| Plot object lineweights | Yes |

### Step 3: Named page setups

Create named page setups for each size:

| Setup name | Paper size | Printer | CTB |
|---|---|---|---|
| FULL-24x36-PDF | ANSI D | DWG To PDF.pc3 | Company.ctb |
| FULL-24x36-PLOTTER | ANSI D | HP DesignJet.pc3 | Company.ctb |
| HALF-11x17-PDF | ANSI B (11x17) | DWG To PDF.pc3 | Company.ctb |
| LETTER-PDF | Letter | DWG To PDF.pc3 | Company.ctb |

Named page setups can be applied to any layout via Page Setup Manager > Set Current.

## CTB vs STB

| Method | How it works | Recommendation |
|---|---|---|
| CTB (Color-Dependent) | Plot properties (lineweight, screening) are assigned by color number | Most common in civil engineering; simpler to manage |
| STB (Style-Dependent) | Plot properties are assigned by named style, independent of color | More flexible but more complex; less common in civil |

Most civil engineering firms use CTB. The template should include the company CTB file and assign it in every page setup. Common CTB assignments:

| Color | Lineweight | Use |
|---|---|---|
| 1 (red) | 0.35 mm | Road centerlines, property lines |
| 2 (yellow) | 0.25 mm | Proposed contours |
| 3 (green) | 0.25 mm | Existing features |
| 4 (cyan) | 0.18 mm | Light linework |
| 7 (white/black) | 0.35 mm | Primary linework and text |
| 8 (gray) | 0.18 mm | Existing topography |
| 251-255 (grays) | 0.09-0.13 mm | Screening and background |

## Viewport scales

Standard viewport scales for civil engineering plan sheets:

| Scale | 1 inch = | Use |
|---|---|---|
| 1:240 | 20 ft | Detail plans, small sites |
| 1:360 | 30 ft | Medium sites |
| 1:480 | 40 ft | Typical plan sheets |
| 1:600 | 50 ft | Larger sites |
| 1:1200 | 100 ft | Overview/key plans |

Set the annotation scale to match the viewport scale so that labels and text display at the correct plotted size.

## Title block

Include the company title block as a block reference in each layout. The title block should contain attributes for:

- Project name, number, and address.
- Sheet title and number.
- Designer, checker, reviewer names and dates.
- Revision table.
- Company name, address, and PE stamp block.

## Related

- [DWT setup](dwt-setup.md)
- [Template layers](template-layers.md)
- [Distributing templates](distributing-templates.md)
- [Object styles inventory](object-styles-inventory.md)
