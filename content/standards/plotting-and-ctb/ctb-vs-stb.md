---
title: "CTB vs STB"
section: "standards/plotting-and-ctb"
order: 10
visibility: public
tags: [plot, ctb, stb, plot-style, lineweight]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CONVERTPSTYLES, STYLESMANAGER, PLOT]
updated: 2026-05-06
---

> **TL;DR**
> 1. **CTB** (Color-Dependent Plot Styles) maps each AutoCAD color number to a lineweight and screening for print output. Simple to manage; the dominant system in civil engineering and land surveying firms.
> 2. **STB** (Named Plot Styles) assigns a named style (e.g., "Heavy", "Light") to each layer, decoupling screen color from print lineweight. More flexible but requires more setup and discipline.
> 3. Converting between the two is possible with `CONVERTPSTYLES`, but the process is not trivially reversible. Pick one at the firm level and standardize on it.

## Color-Dependent Plot Styles (CTB)

A `.ctb` file defines a table of 255 entries, one per ACI color. Each entry specifies:

- **Print color**: the output color. Most civil firms set all entries to Black (color 7) for monochrome plotting, or use "Use object color" for color prints.
- **Lineweight**: the printed line thickness (e.g., 0.13 mm, 0.18 mm, 0.25 mm, 0.35 mm, 0.50 mm).
- **Screening**: percentage intensity (100 % = full, 50 % = half-tone gray, 0 % = invisible). Useful for plotting existing conditions lighter than proposed work.
- **Linetype**: rarely overridden here; usually left at "Use object linetype."

### How CTB works in practice

1. The designer draws objects with ACI colors set ByLayer.
2. Layers are assigned colors that correspond to the desired lineweight. Example: color 1 (red) = 0.30 mm, color 3 (green) = 0.18 mm, color 7 (white) = 0.25 mm.
3. At plot time, the CTB file translates each color to its lineweight. All colors print as black (or as specified).

### Advantages

- Universally understood in the civil/survey industry. Most firms, subconsultants, and DOTs use CTB.
- Simple mental model: color = lineweight. Easy to train new staff.
- Works with received drawings without knowing the other firm's STB styles.

### Disadvantages

- On-screen color is tied to print weight. You cannot have a red line on screen that prints thin; red always prints at whatever weight the CTB assigns to color 1.
- Limited to 255 unique weight-screening combinations (one per color).
- Color-coding by discipline or feature type is constrained because changing the color changes the lineweight.

## Named Plot Styles (STB)

A `.stb` file defines named styles (e.g., "Normal", "Heavy Border", "Light Screening", "Text"). Each style specifies lineweight, screening, print color, and other properties independently of the object's display color.

### How STB works in practice

1. Create named plot styles in the `.stb` file (Plot Style Manager > right-click > New).
2. Assign a named style to each layer in the Layer Properties Manager (the "Plot Style" column appears only in STB-mode drawings).
3. At plot time, the named style determines the lineweight and screening, regardless of the layer's display color.

### Advantages

- Screen color is independent of print weight. A layer can display as green and print at 0.50 mm without affecting other green layers.
- More expressive: unlimited named styles, not limited to 255 color slots.
- Better alignment with BIM and NCS approaches where display and output are separate concerns.

### Disadvantages

- Less common in civil engineering. Subconsultants and DOTs often expect CTB-based files.
- Every layer must be explicitly assigned a plot style. Forgetting to assign one results in the "Normal" style (default), which may not produce the intended output.
- Training overhead: staff must understand named styles in addition to layers.

## Which do most civil firms use?

CTB dominates in civil engineering and land surveying. Reasons:

- Industry inertia: CTB has been the default since AutoCAD R14/2000.
- Interoperability: when files are exchanged between firms, CTB-based coloring is self-describing. The receiving firm loads their own CTB and gets expected output.
- DOT standards: most state DOTs publish CTB files as part of their CADD standards (e.g., INDOT publishes a `.ctb` with their standard pen assignments).
- Simplicity: the color-to-weight mapping is easy to memorize and teach.

STB is more common in architectural and MEP firms, particularly those using Revit-to-AutoCAD export workflows where color is used for BIM-category coding rather than print weight.

## Converting between CTB and STB

`CONVERTPSTYLES` converts a drawing from one system to the other.

### CTB to STB

1. Open the CTB-mode drawing.
2. Run `CONVERTPSTYLES`.
3. Civil 3D converts each layer's color-based mapping to a named plot style. It creates named styles in the default STB file (e.g., "Style 1", "Style 2") corresponding to the CTB color entries.
4. Manually rename the generated styles to meaningful names.
5. Attach the `.stb` file to the drawing.

### STB to CTB

1. Open the STB-mode drawing.
2. Run `CONVERTPSTYLES`.
3. Civil 3D removes named-style assignments from layers and reverts to CTB mode. Layer colors must now carry the lineweight mapping.
4. Verify that layer colors align with the intended CTB row.

Conversion is drawing-by-drawing. It does not affect the template. For a firm-wide switch, update the template first, then convert active project drawings.

## Recommendation

For civil engineering and land surveying firms that exchange files with DOTs, subconsultants, and contractors: **use CTB**. The interoperability advantages outweigh STB's flexibility.

For firms doing primarily architectural or multidiscipline work with Revit integration: **consider STB** if the entire project team can standardize on it.

Do not mix CTB and STB drawings within a single project. Xrefed drawings inherit the host's plot style type, and mismatches cause unexpected output.

## Related

- [Plotting quick reference](plotting-quick-reference.md)
- [Lineweight conventions](lineweight-conventions.md)
- [Layer keys (properties)](../cad-layer-standards/layer-keys.md)
- [Common plotting issues](common-plotting-issues.md)
