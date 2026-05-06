---
title: "PDF Publishing"
section: "standards/plotting-and-ctb"
order: 40
visibility: public
tags: [pdf, publishing, plot, multi-sheet, layers]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EXPORTPDF, PUBLISH, PLOT]
updated: 2026-05-06
---

> **TL;DR**
> 1. Use the **AutoCAD PDF** plotter driver (built in) for vector PDF output with controllable quality, layer retention, and hyperlink support. Avoid third-party "print to PDF" drivers for production work; they rasterize the output.
> 2. For multi-sheet PDFs, use `PUBLISH` with output set to PDF. Each layout becomes a page in a single PDF file. Sheet Set Manager integration allows publishing the entire plan set in one action.
> 3. Enable **layer retention** in the PDF driver's properties to produce PDFs where viewers (Adobe Acrobat, Bluebeam) can toggle CAD layers on and off. Useful for review sets.

## AutoCAD PDF driver vs DWG to PDF

Civil 3D ships with two built-in PDF plotter drivers:

| Driver | Name in plotter list | Characteristics |
|---|---|---|
| AutoCAD PDF | `AutoCAD PDF (General Documentation).pc3`, `AutoCAD PDF (High Quality Print).pc3`, etc. | Full vector output, layer support, font embedding, hyperlinks. Configurable via Plotter Configuration Editor. |
| DWG to PDF | `DWG To PDF.pc3` | Simpler driver. Produces vector PDF. Fewer configuration options than AutoCAD PDF. No layer toggle support in older versions. |

**Recommendation**: use the AutoCAD PDF driver. It provides the most control and the best output quality. The "General Documentation" variant is the default; "High Quality Print" increases resolution for raster elements (images, OLE objects).

## Single-sheet PDF

1. Switch to the layout tab.
2. `Ctrl+P` or Output ribbon > Plot.
3. Select `AutoCAD PDF (General Documentation).pc3` as the printer.
4. Set paper size to match the layout (e.g., ARCH D 24x36).
5. Set plot style table (CTB/STB) as usual.
6. Click **OK**. A file-save dialog appears; choose the output location and filename.

## Multi-sheet PDF with Publish

1. Run `PUBLISH` (Output ribbon > Batch Plot).
2. Add layouts to the publish list (from the current drawing, other open drawings, or a sheet set).
3. Set "Publish to" to **PDF**.
4. Configure PDF options:
   - **Multi-sheet file** — all layouts in one PDF (default), or
   - **Single-sheet files** — one PDF per layout.
5. Click **Publish**. Choose the output folder.

Multi-sheet PDFs are the standard deliverable format. Each layout becomes a sequentially numbered page. Bookmarks are generated from layout names.

## Sheet Set Manager publishing

For projects using Sheet Set Manager (`.dst`):

1. Open the sheet set (`SSMANAGER`).
2. Right-click the sheet set name (or a subset) > Publish > PDF.
3. The Publish dialog populates with all sheets in the set, in order.
4. Publish.

This is the most efficient workflow for large plan sets because the sheet set defines the sheet order, naming, and page setup assignments.

## Layer retention in PDF

Layer-enabled PDFs allow the viewer to toggle CAD layers, which is valuable for review (turn off proposed to see existing, isolate utilities, etc.).

### Enabling layer retention

1. In the Plot dialog, click the **Properties** button next to the plotter name.
2. In the Plotter Configuration Editor, navigate to Device and Document Settings > Custom Properties.
3. Check **Include layer information**.
4. Optionally, set layer behavior:
   - **Use existing layer settings** — frozen/off layers are off in the PDF; on layers are on.
   - **Include all layers** — all layers are included in the PDF regardless of on/off state in the drawing.

### Viewing layers in PDF

- **Adobe Acrobat Pro/Reader**: View > Navigation Panels > Layers.
- **Bluebeam Revu**: Layers panel in the sidebar.
- **Foxit Reader**: View > Navigation Panels > Layers.

Not all PDF viewers support layer toggling. Verify with the intended recipient's software.

## Hyperlinks in PDF

AutoCAD hyperlinks attached to objects (via `HYPERLINK` command) are preserved in PDF output from the AutoCAD PDF driver. Uses:

- Link a viewport title to the detail sheet.
- Link a note to a specification section.
- Link a sheet index table entry to the corresponding sheet (via bookmarks or page numbers).

Hyperlinks are preserved only when using the AutoCAD PDF driver, not DWG to PDF or third-party drivers.

## PDF quality settings

The AutoCAD PDF driver has several presets:

| Preset | Vector DPI | Raster DPI | Use |
|---|---|---|---|
| General Documentation | 600 | 400 | Standard deliverables |
| High Quality Print | 1200 | 600 | Presentation-quality output |
| Smallest File Size | 150 | 150 | Quick review; not for production |
| Web and Mobile | 150 | 150 | On-screen viewing only |

For plan sets that include aerial imagery or rendered viewports, use "High Quality Print" to avoid raster artifacts. For line-only drawings, "General Documentation" is adequate.

## Font embedding

The AutoCAD PDF driver embeds TrueType fonts automatically. SHX fonts (AutoCAD's native fonts) are converted to geometry (lines and arcs), which preserves appearance but means text is not searchable in the PDF.

For searchable text in PDFs:

- Use TrueType fonts (Arial, Romans, etc.) instead of SHX fonts.
- Or enable "Convert SHX text to geometry" (on by default) and accept that SHX text will not be searchable.

Civil 3D 2024+ includes an option to embed SHX font geometry as real text in PDF output. Check the PDF driver's custom properties for this setting.

## File size management

Large plan sets with aerial imagery can produce PDFs exceeding 100 MB. Strategies:

- Lower the raster DPI for non-production review sets.
- Freeze or remove aerial imagery layers before publishing the final deliverable (include imagery only in exhibit sheets).
- Use PDF compression tools (Adobe Acrobat > Save As > Reduced Size PDF) after publishing.

## Related

- [Plotting quick reference](plotting-quick-reference.md)
- [Page setups](page-setups.md)
- [CTB vs STB](ctb-vs-stb.md)
- [Common plotting issues](common-plotting-issues.md)
