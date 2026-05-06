---
title: "Civil 3D Country Kits"
section: "customization/templates-and-kits"
order: 15
visibility: public
tags: [country-kit, dwt, template, us-imperial, us-metric, styles, subassembly]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Country Kits"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3A17C7E1-6E82-4E27-AE43-12BCC3F19F06
    verified: 2026-05-06
---

> **TL;DR**
> 1. Country kits are pre-built DWT files shipped with Civil 3D containing **object styles, label styles, layers, design criteria, and subassembly sets** tailored to regional standards.
> 2. The US Imperial kit includes NCS-aligned layers, AASHTO-based design criteria, and US customary label formats. Use it as a starting point rather than building from scratch.
> 3. Country kits install to the Civil 3D template folder — typically `C:\Users\<user>\AppData\Local\Autodesk\C3D <version>\enu\Template\`.

## Available kits

Civil 3D ships with country kits for multiple regions. The most relevant for US practice:

| Kit | File | Description |
|---|---|---|
| US Imperial | `_AutoCAD Civil 3D (US Imperial).dwt` | Basic US customary units template |
| US Imperial NCS | `_AutoCAD Civil 3D (US Imperial) NCS.dwt` | US with NCS-aligned layer names |
| US Metric | `_AutoCAD Civil 3D (US Metric).dwt` | Metric units for federal/DOT metric projects |
| UK | `_AutoCAD Civil 3D (UK).dwt` | UK standards and units |
| Australia | `_AutoCAD Civil 3D (AU).dwt` | Australian standards |

Additional kits exist for Canada, France, Germany, Japan, China, India, Brazil, and others.

## What a country kit includes

### Object styles

Pre-configured visual styles for every Civil 3D object type:

- Surface styles: contour display (major/minor), triangulation, slope arrows, elevation banding.
- Alignment styles: centerline, offset, proposed, existing.
- Profile styles: existing ground (green), design (red), finished grade.
- Pipe styles: by material (RCP, PVC, CMP) with color coding.
- Structure styles: by type (manhole, inlet, headwall).
- Point styles: monument, benchmark, grade shot, tree, utility.

### Label styles

Pre-configured label templates with:

- Text height scaled to annotation.
- Components: value, prefix/suffix, precision.
- US formats: bearings in DMS, stations in 10+00 format, elevations to 0.01 ft.
- Label sets for station labels, grade labels, pipe/structure labels.

### Layers

The NCS version uses National CAD Standard layer names:

- `V-` prefix for survey.
- `C-` prefix for civil.
- `E-` prefix for electrical.
- `L-` prefix for landscape.

Each object style references a specific layer, so Civil 3D objects automatically land on the correct layer when placed.

### Design criteria files

AASHTO design check criteria files that validate:

- Minimum horizontal radius for design speed.
- Minimum K-value for vertical curves.
- Minimum sight distance.
- Maximum grade.

### Subassembly sets

Corridor subassemblies organized by function:

- Lane (with superelevation support).
- Shoulder (paved, gravel, daylight).
- Ditch (V-ditch, trapezoidal).
- Curb and gutter.
- Sidewalk.
- Daylight (cut, fill, benched).

The US kit includes subassemblies sized in feet; the metric kit uses meters.

## Installation location

Country kit DWT files install to:

```
C:\Users\<username>\AppData\Local\Autodesk\C3D <version>\enu\Template\
```

The exact path depends on the Civil 3D version and language. The `enu` folder is for English; other languages have different folder codes.

## Using a country kit as a starting point

1. Open the country kit DWT (File > Open, navigate to the template folder, change the file type to .dwt).
2. Review and modify styles, layers, and settings for your company standards — see [DWT setup](dwt-setup.md).
3. Remove styles you do not use to reduce template bloat (but be cautious — some styles are referenced by others).
4. Save As a new .dwt with your company name.

Do not modify the original country kit files — Civil 3D may overwrite them during updates or reinstallation.

## Related

- [DWT setup](dwt-setup.md)
- [Object styles inventory](object-styles-inventory.md)
- [Label styles inventory](label-styles-inventory.md)
- [Template layers](template-layers.md)
- [Migrating templates](migrating-templates.md)
