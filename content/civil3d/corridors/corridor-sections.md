---
title: "Corridor Sections and Section Views"
section: "civil3d/corridors"
order: 35
visibility: public
tags: [sample-line, section-view, section-view-group, quantity-takeoff, earthwork, material-volume]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATESAMPLELINES, CREATESECTIONVIEW, CREATESECTIONVIEWGROUP, COMPUTEMATERIALS, GENERATEQUANTITYREPORT]
sources:
  - title: "Autodesk Civil 3D Help — Sample Lines and Sections"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-C3E8B3F5-5E5F-4F3E-9D3E-7F7A8E8B3F5D"
updated: 2026-05-06
---

> **TL;DR**
> 1. **Sample lines** are cross-section cut lines placed along an alignment at specified intervals. They sample surfaces (existing ground, corridor surfaces) and corridor data to generate **sections** — 2D cross-section views at each station.
> 2. **Section views** display the sampled data graphically. A **section view group** creates all section views for an alignment at once, arrayed in rows and columns.
> 3. **Quantity takeoff** — `COMPUTEMATERIALS` and `GENERATEQUANTITYREPORT` — uses the sections to compute cut/fill volumes and material quantities between surfaces, typically by the average-end-area method.

## Sample lines

Sample lines define where cross-sections are cut. They are perpendicular to the alignment at each station and extend a specified distance left and right.

### Creating sample lines

1. Home tab > Profile & Section Views panel > Sample Lines > Create Sample Lines (`CREATESAMPLELINES`).
2. Select the alignment.
3. In the Create Sample Line Group dialog:
   - Name the group.
   - Choose which surfaces and corridor data to sample. Check existing ground, corridor top, corridor datum, and any other surfaces relevant to earthwork.
4. Pick sample line creation method:
   - **By Range of Stations** — specify start, end, increment (e.g., every 50 ft), left width, and right width.
   - **At Specific Stations** — click individual stations.
   - **From Corridor Stations** — sample at every corridor frequency station.
5. Click OK. Sample lines appear in the plan view as short perpendicular lines.

### Sample line widths

The left and right widths must extend far enough to capture all relevant surface data. For earthwork, this means extending past the daylight line. A good rule: set the width to 1.5 to 2 times the expected cut/fill width. If the sample line is too narrow, the section will clip the existing ground and volumes will be underestimated.

## Section views

A section view displays one cross-section at a specific station. It shows the sampled surfaces as lines, corridor links as shapes, and optional labels for offsets, elevations, and grades.

### Creating individual section views

1. Home tab > Profile & Section Views panel > Section Views > Create Section View (`CREATESECTIONVIEW`).
2. Select the sample line.
3. Configure the view: style, elevation range, datum, bands, labels.
4. Click a point in the drawing to place the view.

### Creating section view groups

For production, you typically need a section view at every sample line. Use a section view group:

1. Home tab > Profile & Section Views panel > Section Views > Create Multiple Section Views (`CREATESECTIONVIEWGROUP`).
2. Select the sample line group.
3. In the wizard:
   - **General** — group name, style.
   - **Section Placement** — array layout: columns and rows per sheet, spacing between views.
   - **Offset Range** — left and right extents of the view.
   - **Elevation Range** — automatic or manual datum.
   - **Section Display Options** — which surfaces and corridor data to show.
   - **Data Bands** — add offset/elevation bands below the section.
4. Click Create. Civil 3D arrays all section views in the drawing.

Section view groups can be arranged for screen review (dense array) or for plan production (sized to fit sheet viewports).

## Section labels

Sections can display labels for:

- **Grade** — the slope between two points on a surface.
- **Offset and elevation** — at specific offsets from the centerline.
- **Segment labels** — on each corridor link showing width and slope.
- **Area labels** — shaded cut/fill areas in each section.

Label styles follow the standard Civil 3D label-style system and are configured in the section view properties or through the Annotate tab.

## Quantity takeoff (earthwork volumes)

### Compute Materials

1. Analyze tab > Volumes and Materials panel > Compute Materials (`COMPUTEMATERIALS`).
2. Select the alignment and sample line group.
3. Define material mappings:
   - **EG to Datum (cut/fill)** — compares existing ground surface to the corridor datum surface. This gives total earthwork.
   - **Datum to Top (paving)** — compares the datum surface to the finished grade surface. This gives pavement structure volume.
   - **Custom** — define any two surfaces to compare.
4. For each mapping, choose the quantity type:
   - **Cut** — volume where the existing surface is above the design surface.
   - **Fill** — volume where the existing surface is below the design surface.
   - **Cut and Fill** — both.
5. Click OK. Civil 3D computes cross-sectional areas at each sample line.

### Volume calculation method

Civil 3D uses the **average-end-area method** by default:

```
Volume between two stations = ((Area1 + Area2) / 2) * Distance
```

This is the standard method for highway earthwork in the U.S. It is slightly conservative (overestimates) on curved alignments, which is generally acceptable for bidding purposes.

For more accuracy on curves, the **prismoidal method** can be used (available via third-party extensions or manual calculation), but the average-end-area method is accepted by virtually all U.S. DOTs including INDOT.

### Generate Quantity Report

1. Analyze tab > Volumes and Materials panel > Generate Quantity Report (`GENERATEQUANTITYREPORT`).
2. Select the alignment, sample line group, and material list.
3. Choose output format: XML (which opens in a browser as a formatted table) or CSV.
4. The report lists:
   - Station-by-station cut and fill areas and cumulative volumes.
   - Material-specific quantities (topsoil strip, aggregate base, HMA pavement).
   - Mass haul data (cumulative volume for mass diagram plotting).

### Material lists and Total Volume Table

After computing materials, you can insert a **Total Volume Table** in the drawing:

1. Analyze tab > Volumes and Materials panel > Total Volume Table.
2. Select the alignment and material list.
3. The table displays total cut, total fill, net volume, and material quantities.

## Tips

- Always verify that sample lines extend far enough. If the existing-ground surface is clipped at the edges, rerun with wider sample lines.
- For accurate earthwork, sample at the same stations as the corridor frequency. Using `From Corridor Stations` avoids interpolation errors.
- Topsoil stripping is handled as a separate material with its own surface (existing ground minus strip depth). Create a stripping surface by offsetting the existing-ground surface down by the strip depth.
- Section views can display pipe networks if pipes cross the sample line. Enable this in the Section Display Options during section-view creation.

## Related

- [Corridor surfaces](corridor-surfaces.md)
- [Corridor frequency and regions](frequency-and-regions.md)
- [Sections in plan production](../plan-production/sections-in-plan-production.md)
- [Assemblies and subassemblies](assemblies-and-subassemblies.md)
