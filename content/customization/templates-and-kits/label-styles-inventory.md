---
title: "Label Styles Inventory"
section: "customization/templates-and-kits"
order: 25
visibility: public
tags: [label-styles, point-label, station-label, profile-label, pipe-label, parcel-label, template]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Label Styles"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3A17C7E1-6E82-4E27-AE43-12BCC3F19F06
    verified: 2026-05-06
---

> **TL;DR**
> 1. Label styles define **what information appears** (station, elevation, grade, bearing, distance) and **how it looks** (text height, font, orientation, layer). They are separate from object styles.
> 2. A complete template needs label styles for points, alignments (station + curve), profiles (grade + crest/sag), pipes/structures, and parcels.
> 3. Build label styles from **components**: text, reference text, lines, ticks, blocks. Each component has its own content, position, and formatting.

## Point labels

Point labels display information from COGO points.

| Style name | Components | Use |
|---|---|---|
| Full (PNEZD) | Point #, Northing, Easting, Elevation, Description | Survey data review |
| Plan — Number and Elevation | Point #, Elevation | Plan sheet annotation |
| Plan — Description Only | Description | Topo plan labeling |
| Control | Point #, Northing, Easting, Elevation, Description | Control sheet |
| Stake-out | Point #, Northing, Easting, Description | Field stake-out |
| No Label | (empty) | Points that should display the symbol only |

Point label styles are typically assigned through point groups. Create a point group for "Topo" that uses the "Plan — Number and Elevation" label, another for "Control" that uses the full label, etc.

### Key components in a point label

- **Point Number** — `<[Point Number]>` property field.
- **Elevation** — `<[Point Elevation(Uft|P2|RN|AP|Sn|TP|B2)]>` (US feet, 2 decimal places).
- **Description** — `<[Full Description]>` or `<[Raw Description]>`.
- **Leader** — optional; connect the text to the point marker when dragged.

## Alignment labels

### Station labels

| Style name | Display | Use |
|---|---|---|
| Major Station | Station number at each major station (e.g., every 100 ft) with a tick mark | Plan view centerline stationing |
| Minor Station | Station at each minor station (e.g., every 50 ft or 25 ft) with a short tick | Dense stationing for detail sheets |
| Geometry Point | Station at PC, PT, PI, PCC, PRC points | Horizontal curve data |

### Curve labels

| Style name | Components | Use |
|---|---|---|
| Curve Data | Delta, Radius, Length, Tangent, Chord | Curve table or inline |
| Bearing and Distance | Bearing, Distance for tangent segments | Plat / legal description |

Station label sets combine major, minor, and geometry-point labels into a single assignable set.

## Profile labels

| Style name | Components | Use |
|---|---|---|
| Crest Curve | K, Length, VPI Station, VPI Elevation, High Point Station | Crest vertical curve annotation |
| Sag Curve | K, Length, VPI Station, VPI Elevation, Low Point Station | Sag vertical curve annotation |
| Grade Break | Station, Elevation, Grade In, Grade Out | PVI annotation |
| Grade | Percent grade between grade breaks | Along tangent segments |

Profile label sets are applied to profile views and typically show grade labels on tangent segments and curve data at vertical curves.

## Pipe and structure labels

### Pipe labels

| Style name | Components | Use |
|---|---|---|
| Plan — Size and Material | Diameter, Material, Length | Plan view pipe annotation |
| Plan — Size and Slope | Diameter, Slope (%) | Plan view with hydraulic info |
| Profile — Invert In/Out | Upstream invert, Downstream invert, Slope, Length | Profile view |

### Structure labels

| Style name | Components | Use |
|---|---|---|
| Plan — Name and Rim | Structure name, Rim elevation | Plan view |
| Profile — Rim and Inverts | Rim elevation, all pipe inverts | Profile view |
| Profile — Rim and Sump | Rim, lowest invert, sump depth | Sanitary profiles |

## Parcel labels

### Area labels

| Style name | Components | Use |
|---|---|---|
| Lot Number and Area | Parcel number, area (sq ft and acres) | Subdivision plats |
| Area Only | Area in acres | Preliminary plans |

### Segment labels

| Style name | Components | Use |
|---|---|---|
| Bearing and Distance | Bearing (DMS), Distance (ft) | Property boundaries |
| Curve Data | Delta, Radius, Arc Length, Chord Bearing, Chord Distance | Curved boundary segments |

## Building label style components

Each label style is composed of components:

- **Text** — a text string with property fields: `<[Station Value(Uft|FS|P2)]>`.
- **Reference text** — pulls data from a referenced object (e.g., a profile label referencing an alignment station).
- **Line** — a drawn line element (leader, tick mark).
- **Tick** — a short perpendicular mark at the label anchor.
- **Block** — an inserted block reference (e.g., a north arrow or custom symbol).

Use the Label Style Composer dialog to add, arrange, and format components. Set text heights in plotted units (e.g., 0.08" or 0.10") so they scale correctly with the drawing annotation scale.

## Related

- [DWT setup](dwt-setup.md)
- [Object styles inventory](object-styles-inventory.md)
- [Template layers](template-layers.md)
- [Country kits](country-kits.md)
