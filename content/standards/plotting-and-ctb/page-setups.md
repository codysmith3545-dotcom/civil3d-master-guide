---
title: "Page Setups"
section: "standards/plotting-and-ctb"
order: 20
visibility: public
tags: [page-setup, layout, template, plot, dwt]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [PAGESETUP, PLOT, PUBLISH]
updated: 2026-05-06
---

> **TL;DR**
> 1. A named page setup stores the complete plot configuration: printer, paper size, CTB/STB, plot area, scale, offset, and orientation. Apply a page setup to a layout tab and the plot is fully configured with no manual dialog tweaking.
> 2. Store page setups in the company DWT template so every new drawing inherits them. Common setups: `Full-Size BW` (ARCH D, monochrome CTB), `Half-Size BW` (11x17, monochrome), `PDF-Color` (ARCH D, color).
> 3. Import page setups between drawings with Page Setup Manager > Import. This lets you bring a corrected page setup into an existing drawing without recreating it.

## What a page setup contains

A page setup is a named collection of plot dialog settings:

| Setting | Example value |
|---|---|
| Printer/plotter name | `AutoCAD PDF (General Documentation).pc3` |
| Paper size | `ARCH full bleed D (24.00 x 36.00 Inches)` |
| Plot area | Layout |
| Plot scale | 1:1 |
| Plot offset | 0.000, 0.000 (centered) |
| Plot style table | `Company-Monochrome.ctb` |
| Shaded viewport options | As displayed |
| Plot options | Plot with plot styles, Plot paperspace last |
| Drawing orientation | Landscape |

## Creating a page setup

1. Switch to a layout tab.
2. Output ribbon > Page Setup Manager, or `PAGESETUP`.
3. Click **New**.
4. Name the setup descriptively: `Full-Size-BW-36x24`, `PDF-Color-24x36`, `Half-Size-11x17`.
5. Configure all settings in the Page Setup dialog (same interface as the Plot dialog).
6. Click **OK**. The setup appears in the Page Setup Manager list.
7. Click **Set Current** to apply it to the active layout.

## Applying a page setup to a layout

1. Right-click the layout tab > Page Setup Manager.
2. Select the desired page setup from the list.
3. Click **Set Current**.
4. Close the Page Setup Manager.

The layout now uses that page setup's configuration. When you `Ctrl+P`, the Plot dialog loads pre-filled with those settings.

## Storing page setups in templates

For company-wide consistency, define all standard page setups in the master DWT:

1. Open the company DWT.
2. Create a layout tab for each standard sheet size (or use a single layout and create multiple named page setups).
3. Define page setups: `Full-Size-BW`, `Full-Size-Color`, `Half-Size-BW`, `PDF-BW`, `PDF-Color`, etc.
4. Save the DWT.

Every new drawing started from this template inherits the page setups. Users select the appropriate one without needing to know the printer name, paper size, or CTB file.

## Importing page setups from another drawing

When a page setup needs to be added to an existing drawing that was not started from the current template:

1. Open the target drawing.
2. Output ribbon > Page Setup Manager.
3. Click **Import**.
4. Browse to the source drawing (DWG or DWT) that contains the desired page setup.
5. Select the page setup(s) to import.
6. Click **OK**. The imported setups appear in the list.

This is useful for:

- Updating a project drawing with a newly created page setup without restarting from the template.
- Receiving a drawing from a subconsultant and adding your firm's page setups for plotting.

## Page Setup Manager workflow tips

- **Model tab vs Layout tabs**: page setups can be created for the Model tab as well. Model-tab page setups are useful for quick-printing a model-space view at a specific scale, but layout-tab page setups are the standard for production.
- **Override at plot time**: the Plot dialog allows overriding any page-setup setting before printing. Overrides are temporary unless you save them back to the page setup.
- **Publish respects page setups**: when using `PUBLISH` for batch plotting, each layout's assigned page setup determines its output configuration. This is why consistent page setups across all layouts in a project are important.
- **Page setup override in sheet sets**: Sheet Set Manager allows specifying a page setup override for the entire set, overriding individual layout assignments. Useful for switching the whole set from plotter output to PDF output in one action.

## Recommended page setup names

| Name | Printer | Paper | CTB/STB | Use |
|---|---|---|---|---|
| `Full-BW-Plotter` | HP DesignJet (or firm's plotter) | ARCH D 24x36 | Monochrome CTB | Full-size check prints |
| `Full-BW-PDF` | AutoCAD PDF | ARCH D 24x36 | Monochrome CTB | PDF deliverables |
| `Full-Color-PDF` | AutoCAD PDF | ARCH D 24x36 | Color CTB or "None" | Color PDF exhibits |
| `Half-BW-Printer` | Office laser | 11x17 ANSI B | Monochrome CTB | Half-size review sets |
| `ARCH-E-BW-PDF` | AutoCAD PDF | ARCH E 36x48 | Monochrome CTB | Large plan sheets |

Adjust names and settings to match the firm's printers and standards.

## Related

- [Plotting quick reference](plotting-quick-reference.md)
- [CTB vs STB](ctb-vs-stb.md)
- [PDF publishing](pdf-publishing.md)
- [Common plotting issues](common-plotting-issues.md)
