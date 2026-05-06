---
title: "Civil 3D Layer Mappings"
section: "standards/cad-layer-standards"
order: 20
visibility: public
tags: [civil3d, layers, ncs, object-styles, label-styles]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D objects get their layers from **object styles**, not from the current layer. An alignment's style defines which layer it draws on; changing the style changes the layer.
> 2. Labels get their layers from **label styles**. Text, leader, and tick components each have their own layer assignment within the style.
> 3. To achieve NCS-aligned layering, edit the object and label styles in your template DWT to reference NCS layer names. Do not rely on users setting the current layer before creating objects.

## How Civil 3D assigns layers

Unlike basic AutoCAD, where objects draw on the current layer, Civil 3D objects are layer-controlled by their styles:

- **Object styles** (e.g., a surface style, alignment style, pipe style) have a Display tab with per-component layer assignments. When an alignment is created with the "Proposed" style, its centerline draws on whatever layer that style defines — typically something like `C-ROAD-CNTR`.
- **Label styles** similarly assign layers to each text component, tick component, and leader component.
- **Description key sets** (for points) assign layers based on the point's raw description. A point with description `IP` might map to layer `V-NODE` or `C-TOPO-SPOT`.

This means the layer standard is embedded in the styles, not in user behavior. A well-configured template enforces the layer standard automatically.

## Common NCS-aligned layer mappings

### Surfaces

| Component | NCS layer | Civil 3D style component |
|---|---|---|
| Major contours (existing) | `C-TOPO-MAJR` | Surface style > Display > Major Contour |
| Minor contours (existing) | `C-TOPO-MINR` | Surface style > Display > Minor Contour |
| Proposed contours (major) | `C-GRAD-MAJR` | Separate surface style for proposed surface |
| Proposed contours (minor) | `C-GRAD-MINR` | Separate surface style for proposed surface |
| TIN triangles | `C-TOPO-TRIA` | Surface style > Display > Triangles |
| Border | `C-TOPO-BNDR` | Surface style > Display > Border |
| Spot elevation labels | `C-TOPO-SPOT-TEXT` | Label style layer |

### Alignments

| Component | NCS layer | Notes |
|---|---|---|
| Road centerline | `C-ROAD-CNTR` | Alignment object style |
| Road centerline labels | `C-ROAD-CNTR-TEXT` | Alignment label style |
| Right-of-way alignment | `C-PROP-ROWW` or `C-BNDY-ROWW` | Offset alignment style |
| Edge of pavement | `C-ROAD-EDGE` | Offset alignment style |
| Sanitary sewer alignment | `C-SSWR-CNTR` | Pipe network alignment |
| Storm sewer alignment | `C-STRM-CNTR` | Pipe network alignment |

### Profiles

| Component | NCS layer |
|---|---|
| Existing ground profile | `C-ROAD-PROF-EXST` |
| Proposed profile | `C-ROAD-PROF-PROP` |
| Profile view grid | `C-ROAD-PROF-GRID` |
| Profile labels | `C-ROAD-PROF-TEXT` |

### Pipe networks

| Component | NCS layer |
|---|---|
| Storm pipe | `C-STRM-PIPE` |
| Storm structure | `C-STRM-STRC` |
| Sanitary pipe | `C-SSWR-PIPE` |
| Sanitary structure | `C-SSWR-STRC` |
| Water main | `C-WATR-PIPE` |

### Parcels

| Component | NCS layer |
|---|---|
| Parcel boundary | `C-PROP-BNDY` or `V-BNDY` |
| Parcel labels | `C-PROP-BNDY-TEXT` |
| Lot line | `C-PROP-LOTL` |
| Easement | `C-PROP-ESMN` |

### Points

Point layers are typically controlled by description key sets:

| Point type | NCS layer |
|---|---|
| Control / monuments | `V-NODE` or `V-CTRL` |
| Topographic shots | `V-TOPO` |
| Edge of pavement | `V-ROAD-EDGE` |
| Utility locate | `V-UTIL` |
| Tree / vegetation | `V-TREE` or `L-PLNT` |

## Configuring styles for NCS

1. Open the company template DWT.
2. In Settings > Surface > Surface Styles, edit each style's Display tab. For every component (Major Contour, Minor Contour, Triangles, Border, etc.), set the layer to the NCS-compliant name.
3. Repeat for alignment styles, profile styles, pipe styles, parcel styles, and label styles.
4. Save the DWT. All new drawings started from this template will inherit the NCS layer assignments.

For existing drawings that do not use NCS layers, use the Layer Translator (`LAYTRANS`) to batch-rename layers to the standard. See [Standardizing across a company](standardizing-company-wide.md).

## Layer color and linetype

NCS does not mandate specific colors or linetypes; those are company decisions typically managed by the CTB/STB plot style system. However, conventional assignments include:

- Contours: green (color 3) for existing, red (color 1) for proposed.
- Alignments: red (color 1) for centerlines.
- Pipe networks: blue (color 5) for water, green (color 3) for storm, brown (color 42 or 34) for sanitary.
- Labels: white/black (color 7) for text.

These color choices work in a CTB environment where color maps to lineweight. In an STB environment, colors are display-only and lineweights are assigned by named style.

## Related

- [NCS overview](ncs-overview.md)
- [Layer keys](layer-keys.md)
- [CTB vs STB](../plotting-and-ctb/ctb-vs-stb.md)
