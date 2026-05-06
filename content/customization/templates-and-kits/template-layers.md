---
title: "Template Layers (NCS-Aligned)"
section: "customization/templates-and-kits"
order: 30
visibility: public
tags: [layers, ncs, national-cad-standard, naming, template, organization]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "United States National CAD Standard (NCS) v6"
    url: https://www.nationalcadstandard.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Use **NCS-aligned layer names** with discipline prefixes: V- (survey), C- (civil), E- (electrical), L- (landscape), S- (structural). This keeps drawings consistent and interoperable.
> 2. Civil 3D object styles automatically create layers — configure each style to use the correct NCS layer rather than allowing random layer creation.
> 3. Keep the total layer count manageable: a typical civil/survey template needs 50-100 layers, not 500. Purge unused layers before saving the DWT.

## NCS layer naming format

The NCS layer name format is:

`Discipline-Major Group[-Minor Group][-Status]`

Examples:

- `C-ROAD-CNTR` — Civil, Road, Centerline
- `C-STRM-PIPE` — Civil, Storm, Pipe
- `V-TOPO` — Survey, Topography
- `C-PROP` — Civil, Property/ROW

Status suffixes (optional):

- `-EXST` — Existing
- `-DEMO` — Demolition
- `-PROP` — Proposed (sometimes used as a major group instead)
- `-TEMP` — Temporary
- `-FUTR` — Future

## Recommended layers for a civil/survey template

### Survey (V- prefix)

| Layer | Color | Use |
|---|---|---|
| V-TOPO | 8 (gray) | Topographic survey points and linework |
| V-TOPO-CNTR | 8 | Existing contour lines |
| V-TOPO-SPOT | 8 | Spot elevations |
| V-CTRL | 1 (red) | Survey control points |
| V-BNDRY | 7 (white) | Property boundaries (survey) |
| V-BNDRY-ESMT | 3 (green) | Easement lines |
| V-TREE | 92 (olive) | Tree survey |
| V-UTIL | 6 (magenta) | Utility locates |
| V-MISC | 9 | Miscellaneous survey items |

### Civil — Roadway (C-ROAD)

| Layer | Color | Use |
|---|---|---|
| C-ROAD-CNTR | 1 (red) | Proposed road centerline |
| C-ROAD-CNTR-EXST | 14 | Existing road centerline |
| C-ROAD | 7 (white) | Proposed road edge of pavement |
| C-ROAD-CURB | 4 (cyan) | Curb and gutter |
| C-ROAD-SWLK | 4 | Sidewalk |
| C-ROAD-PROF | 1 | Profile (design) |
| C-ROAD-PROF-EXST | 3 | Profile (existing ground) |
| C-ROAD-SECT | 7 | Cross sections |

### Civil — Storm (C-STRM)

| Layer | Color | Use |
|---|---|---|
| C-STRM-PIPE | 150 (blue) | Storm sewer pipes |
| C-STRM-STRC | 150 | Storm structures (manholes, inlets) |
| C-STRM-DITCH | 150 | Ditches and swales |
| C-STRM-POND | 136 | Detention/retention ponds |
| C-STRM-PROF | 150 | Storm sewer profiles |

### Civil — Sanitary (C-SSWR)

| Layer | Color | Use |
|---|---|---|
| C-SSWR-PIPE | 3 (green) | Sanitary sewer pipes |
| C-SSWR-STRC | 3 | Sanitary structures |
| C-SSWR-PROF | 3 | Sanitary sewer profiles |

### Civil — Water (C-WATR)

| Layer | Color | Use |
|---|---|---|
| C-WATR-PIPE | 5 (blue) | Water mains |
| C-WATR-VALV | 5 | Valves and fittings |
| C-WATR-HYDR | 5 | Fire hydrants |

### Civil — Grading and Erosion (C-GRAD, C-EROS)

| Layer | Color | Use |
|---|---|---|
| C-TOPO-PROP | 2 (yellow) | Proposed contours |
| C-GRAD | 2 | Grading (feature lines, grade breaks) |
| C-EROS | 52 (brown) | Erosion control BMPs |

### Property (C-PROP)

| Layer | Color | Use |
|---|---|---|
| C-PROP | 7 (white) | Proposed property lines / ROW |
| C-PROP-ESMT | 3 | Proposed easements |
| C-PROP-SETB | 30 | Setback lines |

### Annotation (C-ANNO)

| Layer | Color | Use |
|---|---|---|
| C-ANNO | 7 | General annotation |
| C-ANNO-DIM | 7 | Dimensions |
| C-ANNO-TABL | 7 | Tables |
| C-ANNO-NOTE | 7 | General notes |

## How Civil 3D creates layers

When you create a Civil 3D object (alignment, surface, pipe network), the object style determines which layer the object is placed on. If the layer does not exist, Civil 3D creates it automatically with default properties.

To control this:

1. Create all expected layers in the template with correct colors, linetypes, and plot styles.
2. Configure each object style to reference the correct layer.
3. Civil 3D will use the existing layer definition rather than creating a new one.

If you do not pre-create the layers, Civil 3D creates them with default properties (white, continuous), which then need manual cleanup.

## Keeping the layer count manageable

- Do not create a layer for every possible variation — use object styles and colors to differentiate within a layer.
- Merge closely related layers (e.g., one `C-STRM-PIPE` layer rather than separate layers for RCP, HDPE, and CMP pipes — differentiate by object style color).
- Purge unused layers before saving the template.
- Run `LAYDEL` (carefully) to remove truly unnecessary layers after confirming they contain no objects.

## Related

- [DWT setup](dwt-setup.md)
- [Object styles inventory](object-styles-inventory.md)
- [Country kits](country-kits.md)
- [Template page setups](template-page-setups.md)
