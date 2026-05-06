---
title: "Layer Properties"
section: "standards/cad-layer-standards"
order: 40
visibility: public
tags: [layers, color, lineweight, linetype, transparency, plot-style]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [LAYER, LAYMCH, LAYWALK, LWEIGHT]
updated: 2026-05-06
---

> **TL;DR**
> 1. Each layer carries properties: **color**, **linetype**, **lineweight**, **transparency**, **plot/no-plot**, and **plot style** (in STB mode). These properties control how objects on that layer display and print.
> 2. In a **CTB** workflow, color is the master property: the CTB file maps each color number to a printed lineweight and screening percentage. In an **STB** workflow, the named plot style on the layer controls print output directly.
> 3. Set layer properties in the company template DWT. Use the Layer Properties Manager (`LAYER`) to configure all settings. Avoid overriding layer properties at the object level unless there is a specific reason.

## Color

Layer color determines on-screen appearance and, in CTB plotting, the printed lineweight.

- AutoCAD Color Index (ACI) numbers 1 through 255 are available. The first seven have names: 1 = red, 2 = yellow, 3 = green, 4 = cyan, 5 = blue, 6 = magenta, 7 = white/black.
- True Color (RGB) and Color Book colors are also supported but do not interact with CTB plot styles. Use ACI colors if your firm uses CTB.
- Convention: set object color to **ByLayer** so the layer's color governs. Objects set to a specific color override the layer, which defeats the layer-based control system.

## Linetype

Layer linetype determines the dash pattern of lines on that layer.

- **Continuous** — solid line. Default for most layers.
- **Dashed**, **Hidden**, **Center**, **Phantom**, **Dot** — standard linetypes loaded from `acad.lin` or `acadiso.lin`.
- Custom linetypes (e.g., property-line dashes, fence line, utility line with symbols) can be defined in a company `.lin` file.
- Linetype scale (`LTSCALE` and `PSLTSCALE`) affects the visual dash spacing. Set `LTSCALE` to a value appropriate for the drawing's plot scale. `PSLTSCALE = 1` scales linetypes by viewport scale in layout viewports.
- Convention: set object linetype to **ByLayer**.

## Lineweight

Layer lineweight controls the thickness of lines as plotted.

- In CTB mode, lineweight is typically controlled by the CTB file (color-to-lineweight mapping), and the layer lineweight property is often left at **Default** (0.25 mm or as set by `LWEIGHT`).
- In STB mode, lineweight can be set per layer or per named plot style.
- Display lineweights on screen with `LWDISPLAY` (status bar toggle). On-screen display is approximate; plotted output is authoritative.
- Common lineweight assignments: see [Lineweight conventions](../plotting-and-ctb/lineweight-conventions.md).

## Transparency

Layer transparency (0 to 90 %) makes objects on the layer semi-transparent. Useful for:

- Aerial photo underlays (set to 50 %–70 % so linework reads over the image).
- Hatching or color fills that should not obscure underlying features.
- Surface elevation banding shown at reduced opacity.

Transparency must be enabled for plotting: `TRANSPARENCYDISPLAY = 1` in the plot dialog. Some firms disable it to avoid unexpected print results.

Convention: set object transparency to **ByLayer**.

## Plot / No-Plot

Each layer has a plot flag (the printer icon in Layer Properties Manager):

- **Plot** (default) — objects on this layer print.
- **No-Plot** — objects display on screen but do not print. Use for:
  - Construction lines and reference geometry.
  - Viewport boundaries on layout tabs.
  - Temporary markup layers.
  - Internal notes and QA layers.

No-plot layers are distinct from frozen layers: objects on no-plot layers are still visible and selectable in model space.

## Layer interaction with CTB and STB

### CTB (Color-Dependent Plot Styles)

In CTB mode, the layer's color number maps to a row in the `.ctb` file. That row defines:

- Printed color (usually "Use object color" or converted to black).
- Lineweight (e.g., color 1 = 0.30 mm, color 3 = 0.18 mm).
- Screening percentage (e.g., 100 % for full, 50 % for screened).
- Linetype override (rarely used; better to set linetype at the layer).

The layer's own lineweight property is typically ignored in CTB mode because the CTB file overrides it.

### STB (Named Plot Styles)

In STB mode, each layer is assigned a named plot style (e.g., `Normal`, `Heavy`, `Light`, `Non-Plot`). The `.stb` file defines lineweight, screening, and other properties for each named style.

STB decouples color from lineweight: a layer can be any display color while plotting at any lineweight. This is more flexible but requires upfront setup of named styles.

See [CTB vs STB](../plotting-and-ctb/ctb-vs-stb.md) for detailed comparison.

## Layer management commands

| Command | Purpose |
|---|---|
| `LAYER` | Open Layer Properties Manager |
| `LAYWALK` | Step through layers one at a time, isolating each for review |
| `LAYMCH` | Match selected objects to a target layer |
| `LAYISO` | Isolate selected layer(s), fading or locking all others |
| `LAYUNISO` | Restore layers after isolation |
| `LAYMRG` | Merge one layer into another (all objects move to the target) |
| `LAYDEL` | Delete a layer and all its objects |
| `LAYOFF` / `LAYON` | Turn layers off or on by picking objects |
| `LAYFRZ` / `LAYTHW` | Freeze or thaw layers |

## Related

- [NCS overview](ncs-overview.md)
- [Civil 3D layer mappings](civil3d-layer-mappings.md)
- [CTB vs STB](../plotting-and-ctb/ctb-vs-stb.md)
- [Lineweight conventions](../plotting-and-ctb/lineweight-conventions.md)
