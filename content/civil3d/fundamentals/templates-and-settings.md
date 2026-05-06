---
title: "Templates and Drawing Settings"
section: "civil3d/fundamentals"
order: 20
visibility: public
tags: [fundamentals, template, dwt, drawing-settings, units, coordinate-system]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [NEW, EDITDRAWINGSETTINGS, SAVEAS, MAPCSASSIGN]
updated: 2026-05-06
---

> **TL;DR**
> 1. A Civil 3D drawing template (`.dwt`) carries layers, blocks, page setups, object/label styles, command settings, and the drawing's units and coordinate system. Start every project from a controlled DWT.
> 2. Drawing-level settings are reached with `EDITDRAWINGSETTINGS` (or right-click the drawing name in Prospector > Edit Drawing Settings). The four tabs are Units and Zone, Transformation, Object Layers, and Abbreviations; ambient settings are a fifth tab.
> 3. Civil 3D ships imperial and metric DWTs in `C:\\ProgramData\\Autodesk\\C3D <year>\\enu\\Template\\`. Don't edit the shipped templates in place — copy, version, and store in a network location referenced by every user's support path.

## Why the template matters

The DWT is where every default lives. If a designer creates a surface and the contour interval is 1 ft, that came from the surface style in the template. If labels point to a leader on a layer named `C-ANNO`, that came from the template's layer table. A weak template guarantees endless rework.

Civil 3D's shipped templates (`_AutoCAD Civil 3D (Imperial) NCS.dwt`, `_AutoCAD Civil 3D (Metric) NCS.dwt`, plus extended NCS variants) are usable as a starting point, but they are not configured for any one office. Treat them as a baseline you copy and customize.

## What lives inside the DWT

- **Drawing settings**: units, scale, coordinate system, abbreviations, ambient settings.
- **Layers and layer states.** Match your office's CAD standard (NCS or in-house).
- **Text styles, dimension styles, multileader styles, table styles.**
- **Object styles and label styles** for every Civil 3D object: points, surfaces, alignments, profiles, profile views, corridors, sections, section views, pipe networks, pressure networks, parcels, feature lines, grading.
- **Command settings.** Defaults for `CreateAlignment`, `CreateSurface`, etc.
- **Description Key Sets** and **Point File Formats** stored in the drawing.
- **Page setups** for plotting, plus title-block blocks if you embed them.
- **Reference templates and external references** are not stored; those bind to the project.

## Drawing settings — the five tabs of EDITDRAWINGSETTINGS

1. **Units and Zone**
   - Drawing units: feet (US Survey foot for most U.S. work) or meters. Imperial scale defaults to 1" = 40' for civil; verify before plotting.
   - Coordinate system Zone: pick from the categories drop-down (e.g. `USA, Indiana` then `NAD83 Indiana East zone, US Foot`). This drives `MAPCSASSIGN` and is needed for any GIS interop or Vault project.
2. **Transformation**
   - Local grid transform if your project uses a low-distortion projection. Most teams leave this off and live in state plane.
3. **Object Layers**
   - Maps each Civil 3D object class to a layer. New surfaces land on `C-TOPO`, alignments on `C-ROAD-CNTR`, etc. Wildcard suffixes (`*`, `-*`) append the object name.
4. **Abbreviations**
   - Strings used by labels: `ROW` for right of way, `BVCS`/`EVCS` for vertical curve stations. Editing here is preferable to overriding inside individual label styles.
5. **Ambient Settings**
   - Defaults for precision, rounding, sign convention, station/elevation/grade formatting. See [Ambient settings](ambient-settings.md) for the full breakdown.

## Workflow for a new template

1. Open a shipped DWT closest to your unit system. Save As `Office_Civil3D_<year>_Imperial.dwt` to a network template folder.
2. Run `EDITDRAWINGSETTINGS` and set units, zone, and object layers to your standard.
3. Replace shipped layers with the office layer standard. Update text/dim styles.
4. Build out object styles and label styles for each object family. Delete shipped styles you do not use; they clutter pull-downs.
5. Add page setups for each plot device and sheet size. Embed the office title block.
6. Add description key sets and point file formats.
7. Add the new template path to `Options > Files > Drawing Template File Location` for every user, or push it via deployment.

## Version differences worth knowing

- Civil 3D 2024 introduced the Project Explorer add-in by default. It does not change DWT format but exposes object data that earlier templates produced via Toolbox reports.
- Civil 3D 2025 changed the default ambient angular precision in some shipped templates; if you upgrade, audit the angle precision setting.
- DWT format is upward compatible only. A 2025 template will not open in 2022. Maintain parallel templates for each major version your team still runs.

## Common gotchas

- **Saving a DWG as DWT** keeps the model space contents. Always start from a DWT and use Save As; never `WBLOCK` random drawings into your template.
- **Coordinate zone mismatch**. If two team members use different zones for the same project, Civil 3D will quietly transform on insert and your control will look wrong by a few feet.
- **Layer 0 and Defpoints** still come along; do not put styles on either.
- **Style purging.** `PURGE` does not remove unused Civil 3D styles. Use `Settings tab > right-click style > Delete` and confirm referenced-by counts.

## Related

- [Workspace and Toolspace](workspace-and-toolspace.md)
- [Ambient settings, units, abbreviations](ambient-settings.md)
- [DWT setup](../../customization/templates-and-kits/dwt-setup.md)
