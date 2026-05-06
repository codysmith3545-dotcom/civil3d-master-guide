---
title: "Object Styles Inventory"
section: "customization/templates-and-kits"
order: 20
visibility: public
tags: [object-styles, surface-style, alignment-style, profile-style, pipe-style, structure-style, template]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Object Styles"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3A17C7E1-6E82-4E27-AE43-12BCC3F19F06
    verified: 2026-05-06
---

> **TL;DR**
> 1. Object styles control the **visual appearance** of Civil 3D objects (colors, linetypes, layers, visibility of components). Every Civil 3D object has an assigned object style.
> 2. A well-configured template needs styles for the objects you use most: surfaces, alignments, profiles, pipe networks, points, and parcels.
> 3. Keep the style count manageable — create styles for distinct visual purposes (e.g., "Existing Contours" vs "Proposed Contours"), not for every minor variation.

## Surface styles

Surface styles control how a TIN or grid surface displays.

| Style name | Display | Layer | Use |
|---|---|---|---|
| Contours 1' and 5' | Minor contours at 1 ft, major at 5 ft | C-TOPO | Existing ground topography |
| Contours 2' and 10' | Minor at 2 ft, major at 10 ft | C-TOPO | Large-area mapping |
| Proposed Contours 1' and 5' | Minor at 1 ft, major at 5 ft (different color) | C-TOPO-PROP | Proposed grading |
| Triangles and Points | TIN triangles and vertices visible | C-TOPO | Surface QC and debugging |
| Border Only | Border line only, no contours | C-TOPO | Background reference |
| Slope Arrows | Slope arrows with color banding | C-TOPO | Drainage analysis |
| Elevation Banding | Color ramp by elevation | C-TOPO | Visualization |

Configure contour intervals, smoothing (on/off), and range settings in each style.

## Alignment styles

| Style name | Display | Layer | Use |
|---|---|---|---|
| Proposed Centerline | Solid line, bold | C-ROAD-CNTR | Proposed road centerline |
| Existing Centerline | Dashed or phantom line | C-ROAD-CNTR-EXST | Existing road centerline |
| Offset | Thin solid line | C-ROAD | Edge of pavement, lane lines |
| ROW | Dash-dot line | C-PROP | Right-of-way |
| Utility | Varies by utility type | — | Utility alignments |

Each alignment style specifies a layer. When you create an alignment and assign a style, the alignment goes on that layer automatically.

## Profile styles

| Style name | Display | Layer | Use |
|---|---|---|---|
| Existing Ground | Green solid line | C-ROAD-PROF-EXST | Surface profile |
| Design Profile | Red solid line | C-ROAD-PROF | Layout (design) profile |
| Finished Grade | Bold red | C-ROAD-PROF | Final finished grade |
| Flowline | Blue line | C-STRM-PROF | Storm sewer flowline profile |

## Pipe network styles

### Pipe styles

| Style name | Display | Use |
|---|---|---|
| Storm — RCP | Gray, solid | Reinforced concrete storm pipe |
| Storm — HDPE | Black, dashed | HDPE storm pipe |
| Storm — CMP | Brown | Corrugated metal pipe |
| Sanitary — PVC | Green | PVC sanitary sewer |
| Water — DI | Blue | Ductile iron water main |

### Structure styles

| Style name | Display | Use |
|---|---|---|
| Manhole — Round | Circle with rim label | Standard round manhole |
| Inlet — Curb | Rectangle with curb symbol | Curb inlet |
| Inlet — Area | Rectangle | Area drain |
| Headwall | Headwall symbol | Pipe outlet structure |
| Cleanout | Small circle | Sanitary cleanout |

## Point styles

| Style name | Symbol | Use |
|---|---|---|
| Monument — Found | Triangle | Found survey monument |
| Monument — Set | Triangle with cross | Set survey monument |
| Benchmark | BM symbol | Vertical control point |
| Grade Shot | Dot | Topo grade shot |
| Tree | Circle with cross | Tree location |
| Utility — Manhole | MH symbol | Located utility manhole |
| Control | Square | Horizontal control point |

Point styles are typically assigned through point groups based on description matching, not individually.

## Parcel styles

| Style name | Display | Use |
|---|---|---|
| Lot | Boundary line with fill | Subdivision lot |
| ROW | Right-of-way line | Road right-of-way parcel |
| Easement | Dash-dot, light fill | Utility or access easement |
| Open Space | Green fill | Common area / open space |

## Style management tips

- **Purge unused styles** periodically — templates can accumulate hundreds of styles from imports and experiments.
- **Use style sets** — group related styles (e.g., "Plan View" set, "Profile View" set) for quick assignment.
- **Name consistently** — prefix with purpose: "Existing", "Proposed", "Demo", "Utility".
- **Control layers through styles** — let the object style assign the layer rather than manually setting layers on individual objects.

## Related

- [DWT setup](dwt-setup.md)
- [Label styles inventory](label-styles-inventory.md)
- [Template layers](template-layers.md)
- [Country kits](country-kits.md)
