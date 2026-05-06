---
title: "Feature Lines"
section: "civil3d/grading"
order: 10
visibility: public
tags: [feature-line, grading, 3d-polyline, elevation, site]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateFeatureLine, CreateFeatureLineFromObject, CreateFeatureLineFromAlignment, CreateFeatureLineFromCorridor]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Feature Lines
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-6A7B8C9D-0E1F-2A3B-4C5D-6E7F8A9B0C1D
    verified: 2026-05-06
---

> **TL;DR**
> 1. A feature line is a 3D line object with individually editable vertex elevations — it is the foundation of Civil 3D grading. Unlike a 3D polyline, it belongs to a site (or is siteless in 2018+), supports curves, and can be used as both a grading baseline and a surface breakline.
> 2. Create feature lines from scratch, from existing objects (polylines, survey figures), from alignments, or extracted from corridors. Each method sets initial elevations differently.
> 3. After creation, use the feature line elevation editing tools to assign grades, slopes, and elevations precisely. See [Feature line editing](feature-line-editing.md).

## What a feature line is

A feature line is a Civil 3D object that stores:

- A 2D plan geometry (lines and arcs).
- An elevation at every vertex (PI point).
- Optional intermediate elevation points along segments (added manually or by draping on a surface).

Feature lines differ from 3D polylines in several important ways:

| Characteristic | Feature line | 3D polyline |
|---|---|---|
| Arc support | Yes — true arcs in plan | No — arcs are tessellated to straight segments |
| Elevation editing tools | Full suite (set grade, slope, raise/lower, etc.) | Manual vertex editing only |
| Site membership | Belongs to a site (topology) or siteless | No site concept |
| Grading baseline | Yes — grading objects project from feature lines | No |
| Surface breakline | Yes — can be added as a breakline directly | Yes |
| Corridor extraction | Can be created from corridor feature lines | Not directly |

## Creating feature lines

### From scratch

Command: `CreateFeatureLine` (ribbon: Home > Create Design > Feature Line > Create Feature Line).

1. Specify a site (or choose `<None>` for siteless).
2. Assign a name and style.
3. Optionally assign a reference surface — if set, each vertex elevation defaults to the surface elevation at that point.
4. Draw the feature line by clicking points in plan view. Each click creates a vertex.
5. Enter elevations at the command line as you draw, or accept surface elevations.

### From existing objects

Command: `CreateFeatureLineFromObject` (ribbon: Home > Create Design > Feature Line > Create Feature Lines from Objects).

Accepts:

- **2D polylines** — vertices get elevation from a reference surface or default to 0.
- **3D polylines** — vertices retain their Z values.
- **Survey figures** — vertices retain survey elevations.
- **Lot lines / parcel segments** — converted to feature lines with elevations from a surface.

Options during conversion:

- **Assign elevations** — drape on a surface, or set a constant elevation.
- **Weed points** — remove redundant vertices within a specified tolerance to simplify the geometry.
- **Erase existing entities** — optionally delete the source object after conversion.

### From alignment

Command: `CreateFeatureLineFromAlignment` (ribbon: Home > Create Design > Feature Line > Create Feature Line from Alignment).

This extracts the horizontal geometry of an alignment and creates a feature line. Elevations can come from:

- A profile associated with the alignment.
- A surface.
- Manual assignment after creation.

This is useful when you need a feature line that follows a designed centerline (e.g., a sidewalk edge that parallels an alignment at an offset).

### From corridor

Command: `CreateFeatureLineFromCorridor` (ribbon: select corridor > Corridor tab > Extract Feature Lines).

Corridor feature lines (the 3D lines defined by subassembly points like top-of-curb, edge-of-shoulder, daylight) can be extracted as standalone feature lines. This is the primary method for:

- Adding corridor-derived edges to a finished-grade surface as breaklines.
- Using corridor geometry as a baseline for additional grading outside the corridor.

Extracted feature lines are static snapshots — they do not update when the corridor changes. Re-extract after corridor edits.

## Elevation assignment methods

When creating or editing a feature line, elevations can be assigned by:

| Method | When to use |
|---|---|
| Surface drape | Initial layout when existing ground elevations are acceptable starting points |
| Manual entry | When design elevations are known (e.g., pad elevation = 834.50 ft) |
| Grade/slope between points | Setting a constant grade along a segment (e.g., 2% from building to curb) |
| Profile | When the feature line follows an alignment with a designed profile |
| Relative to another feature line | Maintaining a fixed offset elevation (e.g., gutter 6 in. below top of curb) |

## Feature line styles

Feature line display is controlled by styles (Settings > Feature Line > Feature Line Styles). A style defines:

- Plan-view color, linetype, and lineweight.
- Whether elevation points display as markers.
- Profile and section display settings.

Common practice: use one style for existing-grade feature lines and another for proposed, so they are visually distinct.

## Feature lines as surface breaklines

A feature line can be added directly as a surface breakline (right-click the surface in Prospector > Add Feature Line as Breakline, or use `ADDSURFACEBREAKLINES`). Changes to the feature line elevations propagate to the surface on rebuild.

This dual role — grading baseline and surface breakline — makes feature lines the most versatile elevation object in Civil 3D.

## Related

- [Feature line editing](feature-line-editing.md)
- [Grading objects](grading-objects.md)
- [Sites and feature lines](sites-and-feature-lines.md)
- [Corridor vs feature-line grading](corridor-vs-feature-line-grading.md)
