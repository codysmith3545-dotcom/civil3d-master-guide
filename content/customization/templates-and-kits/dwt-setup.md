---
title: "Setting Up a Company DWT"
section: "customization/templates-and-kits"
order: 10
visibility: public
tags: [dwt, template, styles, layers, settings, coordinate-system]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Drawing Templates"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3A17C7E1-6E82-4E27-AE43-12BCC3F19F06
    verified: 2026-05-06
---

> **TL;DR**
> 1. Start from the appropriate **country kit** (typically _AutoCAD Civil 3D (US Imperial) NCS.dwt_) — it includes baseline styles, layers, and label formats aligned to US practice.
> 2. Configure the **coordinate system** (e.g., Indiana State Plane East or West, NAD83), **ambient settings** (precision, units, angular format), and **drawing scale** before building styles.
> 3. Save as a .dwt file with a versioned name (e.g., `CompanyName-C3D-2025-v1.dwt`). Lock it down and distribute to the team — see [Distributing templates](distributing-templates.md).

## Starting point

Do not start from a blank drawing. Civil 3D ships with country-kit DWT files that contain hundreds of pre-configured object styles, label styles, and design criteria. See [Country kits](country-kits.md) for details.

Open the country-kit DWT that most closely matches your practice. For US land development and transportation work, this is typically:

- `_AutoCAD Civil 3D (US Imperial) NCS.dwt` (NCS-aligned layers and styles)
- `_AutoCAD Civil 3D (US Imperial).dwt` (simpler, fewer styles)

## Configuration sequence

### 1. Coordinate system

Settings > Drawing Settings > Units and Zone:

- Set the coordinate system to the project zone (e.g., `IN83-EF` for Indiana State Plane East, NAD83, US feet).
- For a company template, choose the most commonly used zone. Projects in other zones can be overridden per-drawing.

### 2. Ambient settings

Settings > Drawing Settings > Ambient Settings:

| Setting | Recommended value |
|---|---|
| Linear precision | 0.01 (hundredths) for survey, 0.1 for design |
| Angular format | Degrees-Minutes-Seconds (DMS) or Decimal Degrees |
| Angular precision | 1 second (DMS) or 0.0001 degrees |
| Direction format | North Azimuth or Bearing (match your practice) |
| Station format | 10+00 (US standard) |
| Elevation precision | 0.01 |
| Grade/slope format | Percent |

### 3. Drawing scale

Set the intended annotation scale (e.g., 1" = 50' for plan sheets, 1" = 20' for details). This affects text heights, dimension scales, and label component sizes. The scale can be overridden per layout/viewport, but the template should set the most common default.

### 4. Layers

Configure the layer scheme. See [Template layers](template-layers.md) for NCS-aligned recommendations. At minimum:

- Establish your standard layers for survey, civil, and utility disciplines.
- Set layer colors, linetypes, and plot styles.
- Configure which layers Civil 3D object styles create (by editing the styles — each object style specifies a layer).

### 5. Object styles

Configure the visual appearance of Civil 3D objects. See [Object styles inventory](object-styles-inventory.md) for a checklist. Key categories:

- Surface styles (contours, triangles, slope arrows)
- Alignment styles (centerline, offset, ROW)
- Profile styles (existing ground, design profile)
- Pipe and structure styles (by material and size)
- Point styles (by point group)

### 6. Label styles

Configure how labels display information. See [Label styles inventory](label-styles-inventory.md). Key categories:

- Point labels
- Alignment station labels
- Profile grade labels
- Pipe and structure labels
- Parcel labels

### 7. Design criteria files

If your firm uses AASHTO or INDOT design checks, associate the appropriate design criteria file with the template. Civil 3D ships with AASHTO and INDOT criteria files.

### 8. Page setups

Add page setups for standard sheet sizes. See [Template page setups](template-page-setups.md).

## Saving the template

1. Delete any geometry or data from model space (the template should be empty of project-specific content).
2. Run `PURGE` to remove unused blocks, styles, layers, and linetypes.
3. Run `AUDIT` to fix any database errors.
4. File > Save As > Drawing Template (.dwt).
5. Name it with company name, Civil 3D version, and version number: `CompanyName-C3D-2025-v1.dwt`.

## Related

- [Country kits](country-kits.md)
- [Object styles inventory](object-styles-inventory.md)
- [Label styles inventory](label-styles-inventory.md)
- [Template layers](template-layers.md)
- [Template page setups](template-page-setups.md)
- [Distributing templates](distributing-templates.md)
