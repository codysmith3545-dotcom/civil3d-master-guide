---
title: "Common Plotting Issues"
section: "standards/plotting-and-ctb"
order: 50
visibility: public
tags: [plot, troubleshooting, lineweight, ctb, viewport, scale]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [PLOT, PAGESETUP, LWDISPLAY, CONVERTPSTYLES]
updated: 2026-05-06
---

> **TL;DR**
> 1. Most plotting problems come from three sources: the **CTB/STB file** not being assigned or found, the **viewport scale** or plot area being wrong, and **layer/style overrides** producing unexpected output.
> 2. Always preview before plotting. The plot preview shows exactly what the plotter will produce, including lineweights, colors, and clipping.
> 3. Systematic diagnosis: check the page setup first, then the plot style table, then the viewport properties, then individual object/layer overrides.

## Lineweights not showing

**Symptom**: all lines plot at the same thin weight, or lineweights appear on screen but not in the plot.

| Cause | Fix |
|---|---|
| "Plot with plot styles" is unchecked | In the Plot dialog > Plot options, check "Plot with plot styles" |
| CTB/STB file not assigned | In the Plot dialog > Plot style table, select the correct `.ctb` or `.stb` file |
| CTB file maps all colors to "Use object lineweight" but object lineweights are all Default | Either set lineweights in the CTB (recommended) or set layer lineweights in the Layer Properties Manager |
| `LWDISPLAY` is off (on-screen only) | Toggle `LWDISPLAY` on at the status bar. This affects display, not plotting — but helps diagnose visually |
| STB drawing with no named styles assigned to layers | Open Layer Properties Manager and assign a named plot style to each layer |

## Wrong scale

**Symptom**: the drawing prints too large, too small, or at an unexpected scale.

| Cause | Fix |
|---|---|
| Plot scale set to "Fit to paper" instead of 1:1 | For layout-tab plots, set plot scale to 1:1. The viewport handles the drawing scale |
| Viewport scale is wrong | Double-click the viewport, then set the viewport scale in the status bar (e.g., 1"=40', 1:500) |
| Plot area set to "Display" or "Extents" instead of "Layout" | Set plot area to "Layout" for standard layout-tab plots |
| Paper size mismatch | The layout is configured for ARCH D but the plot dialog shows ANSI A. Select the correct paper size |
| Units mismatch | A drawing in meters plotted with an inches-based page setup. Verify units in `UNITS` and the page setup |

## CTB file not found

**Symptom**: the Plot dialog shows the CTB name in red or says "Not found." Lineweights revert to defaults.

**Cause**: the `.ctb` file is not in any of the configured plot style search paths.

**Fix**:

1. Check the plot style path: `OPTIONS` > Files > Printer Support File Path > Plot Style Table Search Path.
2. Verify the CTB file exists at that location. Default path: `C:\Users\<username>\AppData\Roaming\Autodesk\AutoCAD <version>\enu\Plotters\Plot Styles\`.
3. Copy the company's CTB to that path, or add the network folder containing the CTB to the search paths.
4. Restart AutoCAD if the file was added while the program was running (not always required, but resolves caching issues).

## Colors not matching expected output

**Symptom**: objects plot in unexpected colors (e.g., everything plots as the object color instead of black).

| Cause | Fix |
|---|---|
| CTB set to "Use object color" for all entries | Edit the CTB (Plot Style Table Editor). Set each entry's color to Black (or the desired output color) |
| No CTB assigned (plotting without a plot style) | Assign a CTB in the Plot dialog |
| STB "Normal" style set to "Use object color" | Edit the STB and set the Normal style's color to Black if monochrome output is desired |
| True Color or Color Book colors on objects | CTB only maps ACI colors 1–255. Objects with True Color bypass the CTB. Set object color ByLayer using an ACI color |

## Viewport-specific overrides not plotting

**Symptom**: a viewport layer override (VP Freeze, VP Color, VP Lineweight) set in one viewport does not affect the plotted output.

**Possible causes**:

1. **VP override on the wrong viewport.** Double-click into the correct viewport before setting VP overrides. Each viewport has its own override set.
2. **Layer override is VP Freeze but the layer is thawed globally.** VP Freeze only works within the specific viewport; confirm you are checking the right one.
3. **PSLTSCALE or MSLTSCALE conflict.** Linetype scale in paper space vs model space can cause linetypes to appear differently in each viewport. Set `PSLTSCALE = 1` for viewport-scaled linetypes or `PSLTSCALE = 0` for model-space-based linetypes.
4. **Annotation scale mismatch.** Annotative objects may not display in a viewport whose annotation scale does not match the object's scale list. Add the viewport scale to the object's annotation scale list.

## Civil 3D-specific plotting issues

| Issue | Diagnosis | Fix |
|---|---|---|
| Surface contours plot too heavy or too light | Surface style assigns contours to a color that maps to the wrong CTB pen | Edit the surface style > Display tab > change the contour component's color to match the desired CTB pen |
| Alignment labels missing in plot | Labels are on a frozen or VP-frozen layer | Thaw the label layer in the viewport |
| Profile view grid does not plot | Profile view style has grid on a no-plot layer | Change the layer's plot flag to Plot, or change the style's layer assignment |
| Pipe network structures plot as wireframe | The structure style's Display tab has the solid/rendered component off in Plan view | Edit the structure style to show the correct components |
| Corridor surface contours do not appear | The corridor surface has not been rebuilt, or the surface style applied to the corridor extraction does not show contours | Rebuild the corridor; check the extracted surface's style |

## General troubleshooting steps

1. **Plot Preview.** Always start here. If the preview looks wrong, the plot will be wrong. Diagnose in the preview before sending to the printer.
2. **Check the page setup.** Output ribbon > Page Setup Manager. Verify printer, paper size, CTB, and scale.
3. **Check the CTB/STB.** Open the Plot Style Table Editor and review the color-to-lineweight mapping.
4. **Check layer states.** Use `LAYWALK` to isolate layers and verify their on/off, freeze/thaw, and plot/no-plot states.
5. **Check object overrides.** Select a problem object, open Properties (`Ctrl+1`), and verify that color, linetype, and lineweight are set to ByLayer.
6. **Test on a simple drawing.** If the issue persists, plot a simple test drawing (a few lines at different colors) to determine whether the problem is drawing-specific or system-wide.

## Related

- [CTB vs STB](ctb-vs-stb.md)
- [Plotting quick reference](plotting-quick-reference.md)
- [Lineweight conventions](lineweight-conventions.md)
- [Page setups](page-setups.md)
