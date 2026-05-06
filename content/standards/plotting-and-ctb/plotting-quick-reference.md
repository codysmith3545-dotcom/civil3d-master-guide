---
title: "Plotting Quick Reference"
section: "standards/plotting-and-ctb"
order: 15
visibility: public
tags: [plot, publish, pdf, dwf, batch-plot, printer]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [PLOT, PUBLISH, PAGESETUP, EXPORTPDF]
updated: 2026-05-06
---

> **TL;DR**
> 1. Plot a single sheet from a layout tab with `PLOT` (Ctrl+P). Select the page setup (which bundles printer, paper size, CTB/STB, and plot area), preview, then plot.
> 2. Batch-plot multiple sheets with `PUBLISH`. Select layouts from the current drawing or a sheet set, choose output type (DWF, PDF, or plotter), and publish all at once.
> 3. For PDF output, use the **AutoCAD PDF** driver or `EXPORTPDF` for reliable vector output with optional layer retention.

## Plotting a single sheet

1. Switch to the layout tab you want to plot.
2. `Ctrl+P` or Output ribbon > Plot.
3. In the Plot dialog:
   - **Page setup**: select a named page setup (recommended) or configure manually.
   - **Printer/plotter**: choose the output device.
   - **Paper size**: match the layout's paper size.
   - **Plot area**: set to "Layout" to plot the entire printable area of the paper.
   - **Plot scale**: 1:1 for layout tabs (the viewport handles the drawing scale). For model-space plots, set the desired scale.
   - **Plot style table (CTB/STB)**: select the correct `.ctb` or `.stb` file.
   - **Plot offset**: center the plot or set to 0,0.
   - **Plot options**: check "Plot with plot styles" and "Plot paperspace last."
4. Click **Preview** to verify. Check lineweights, text legibility, and that nothing is clipped.
5. Click **OK** to plot.

## Using named page setups

Named page setups save the entire Plot dialog configuration (printer, paper size, CTB, scale, offset, orientation) under a name. They eliminate the need to configure the dialog every time.

1. Output ribbon > Page Setup Manager, or `PAGESETUP`.
2. Click **New** or **Modify**.
3. Configure all settings.
4. Click **OK** to save.

When you plot, select the page setup by name and all settings load. Store page setups in the company DWT so every layout inherits them.

See [Page setups](page-setups.md) for detailed workflow.

## Batch plotting with Publish

`PUBLISH` (Output ribbon > Batch Plot) prints multiple layouts in a single operation.

1. Run `PUBLISH`.
2. The Publish dialog lists all layouts in the current drawing. Add layouts from other open drawings or from a Sheet Set.
3. For each entry, verify the page setup assignment. Assign or override as needed.
4. Choose the output type:
   - **Plotter named in page setup** — sends each layout to its assigned printer/plotter.
   - **DWF/DWFx** — creates a multi-sheet DWF file.
   - **PDF** — creates a multi-sheet PDF (Civil 3D 2022+).
5. Click **Publish**.

Publish is the standard tool for generating plan sets. It respects page setups, so each sheet in the set can go to a different paper size or printer if needed.

### Sheet Set Manager integration

If the project uses a Sheet Set (`.dst` file), Publish can pull the sheet list directly from the set:

1. Open Sheet Set Manager (`SSMANAGER`).
2. Right-click the sheet set or a subset > Publish > selected output format.
3. The Publish dialog populates with the sheet set's layouts.

## DWF output

DWF (Design Web Format) is Autodesk's lightweight review format:

- Supports multi-sheet, layers, markups, and precise vector data.
- Viewable in Autodesk Design Review (free).
- Smaller file size than PDF for complex drawings.
- Useful for internal review cycles where the reviewer will use Design Review's markup tools.

## PDF output

PDF is the universal deliverable format. See [PDF publishing](pdf-publishing.md) for detailed guidance. Quick summary:

- **AutoCAD PDF driver** (built-in plotter): vector output with optional layer retention.
- **EXPORTPDF**: command-line export, single or multi-sheet.
- **Publish to PDF**: multi-sheet via the Publish dialog.
- **DWG to PDF**: an alternative built-in driver with fewer options.

## Common printer configurations

| Use case | Printer/plotter | Paper size | Notes |
|---|---|---|---|
| Full-size plan sheet | Large-format plotter (HP DesignJet, Canon, KIP) | ARCH D (24x36 in) or ARCH E (36x48 in) | Use media-size roll or cut sheet |
| Half-size check set | Office laser printer or plotter at 50 % | ARCH B (12x18 in) or 11x17 (ANSI B) | Scale 1:2 or "Fit to paper" |
| PDF deliverable | AutoCAD PDF (General Documentation) | Custom or ARCH D | Vector, black and white |
| PDF review set | AutoCAD PDF | ARCH D | Color, with layers for review |
| DWF review | DWF6 ePlot | N/A (virtual) | Multi-sheet, layer-enabled |

## Troubleshooting quick checks

- **Nothing plots**: verify the layout has a viewport and it is not on a frozen layer. Check that plot area is set to "Layout," not "Display" or "Window."
- **Wrong lineweights**: confirm the CTB file is assigned and "Plot with plot styles" is checked.
- **Clipped output**: paper size in the dialog does not match the layout's configured paper size. Reset via Page Setup Manager.
- **Blurry PDF**: ensure you are using the AutoCAD PDF driver (vector), not a raster-based print-to-PDF utility.

See [Common plotting issues](common-plotting-issues.md) for additional diagnostics.

## Related

- [Page setups](page-setups.md)
- [CTB vs STB](ctb-vs-stb.md)
- [PDF publishing](pdf-publishing.md)
- [Common plotting issues](common-plotting-issues.md)
