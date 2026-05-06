---
title: "Pipe Network Interoperability"
section: "civil3d/pipe-networks"
order: 50
visibility: public
tags: [pipe-network, landxml, ssa, swmm, gis, shapefile, infodrainage, interop, export, import]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [ImportLandXML, ExportLandXML, ExportToSWMM]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Import and Export LandXML
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5F6A7B8C-9D0E-1F2A-3B4C-5D6E7F8A9B0C
    verified: 2026-05-06
---

> **TL;DR**
> 1. **LandXML** is the primary open format for exchanging pipe networks between Civil 3D and other civil design software. Use `ExportLandXML` and `ImportLandXML` for round-trip workflows.
> 2. **SSA** (Storm and Sanitary Analysis) reads Civil 3D pipe networks directly via a shared data model — no file export needed if SSA is installed alongside Civil 3D.
> 3. For GIS delivery, export pipe and structure data to **shapefiles** or **geodatabases** using Map 3D tools (included in Civil 3D). For advanced drainage analysis, connect to **Autodesk InfoDrainage** or third-party tools via LandXML or CSV.

## LandXML import and export

### Exporting

Command: `ExportLandXML` (ribbon: Output > Export > Export to LandXML).

1. Run the command. The Export LandXML dialog lists all exportable objects: surfaces, alignments, profiles, pipe networks, parcels.
2. Check the pipe networks to export. Each network exports as a `<PipeNetworks>` element with pipe geometry, structure locations, invert elevations, and part sizes.
3. Choose the output file path. Click OK.

LandXML captures:

- Pipe: start/end coordinates, inverts, diameter, length, slope, material description.
- Structure: location (X, Y), rim elevation, sump elevation, structure type.

LandXML does not capture:

- Label styles, display settings, or Civil 3D-specific rules.
- Pressure network fittings and appurtenances (LandXML schema support for pressure pipe data is limited).
- Catchment or hydrology data attached to structures.

### Importing

Command: `ImportLandXML` (ribbon: Insert > Import > LandXML).

1. Select the LandXML file.
2. Civil 3D shows a preview of objects. Check pipe networks.
3. Map imported pipe families to your parts catalog entries. If an exact match is not found, Civil 3D uses the closest available size or prompts for manual mapping.
4. Click OK. The network appears in Prospector with imported geometry.

After import, verify:

- Pipe sizes match the intended parts list entries.
- Structure rim elevations align with your surface.
- Connection rules (crown, invert, center) match your design standards.

## Storm and Sanitary Analysis (SSA) integration

SSA (based on the EPA SWMM 5 engine) is tightly integrated with Civil 3D when both are installed:

1. Model the pipe network in Civil 3D with proper geometry and inverts.
2. Attach hydrology data: assign catchment areas to inlet structures using the Hydrology tools (Analyze > Ground Data > Catchment).
3. Launch SSA from Analyze > Storm and Sanitary Analysis.
4. SSA reads the pipe network geometry directly from the drawing — no file export step.
5. Define design storms (SCS Type II, local IDF curves, etc.), boundary conditions, and tailwater.
6. Run the simulation. SSA computes:
   - Peak flow and velocity in each pipe.
   - Depth of flow and pipe capacity ratio (d/D).
   - HGL and surcharge status at each node.
7. Results can be written back to Civil 3D labels and tables for plan annotation.

SSA limitations:

- It uses a simplified hydrologic model (rational method or SCS) for catch basins. Complex hydrology (detention routing, interconnected ponds) is better handled in standalone SWMM or HydroCAD.
- SSA does not model pressure networks.

## Exporting to GIS (shapefile / geodatabase)

Civil 3D includes Autodesk Map 3D functionality. Use it to export pipe networks to GIS formats:

### Shapefile export

1. Select all pipes and structures in the network (use Quick Select or the network filter).
2. Use Map 3D export: Output > Export > Map 3D > SHP.
3. Map Civil 3D properties (pipe diameter, material, slope, invert elevations) to shapefile attribute fields.
4. Export pipes as a polyline shapefile and structures as a point shapefile.

### File geodatabase export

For Esri ArcGIS users:

1. Export via Map 3D using the FDO (Feature Data Object) connection to an ESRI file geodatabase (.gdb).
2. Or export to SHP and convert to GDB in ArcGIS.

GIS deliverables are commonly required for:

- Municipal asset management systems.
- As-built utility mapping.
- FEMA floodplain coordination.

## Connecting to Autodesk InfoDrainage

InfoDrainage is Autodesk's dedicated stormwater management and drainage design tool. It handles complex hydrology, detention design, and water-quality BMP modeling.

Integration workflow:

1. Design the pipe network layout in Civil 3D.
2. Export to LandXML.
3. Import the LandXML into InfoDrainage.
4. Add catchment data, rainfall, and BMP elements in InfoDrainage.
5. Run the analysis.
6. Export updated pipe sizes and inverts back to LandXML.
7. Import the revised LandXML into Civil 3D to update the network.

This round-trip is not seamless — pipe-family mapping and structure-type matching require manual review at each import step. Keep naming conventions consistent to minimize mapping effort.

## Third-party analysis tools

| Tool | Format for import | What it analyzes |
|---|---|---|
| EPA SWMM | .inp file (build from CSV or LandXML converter) | Storm/combined sewer hydraulics and hydrology |
| HydroCAD | Pipe data via CSV or manual entry | Detention pond routing, pipe sizing, rational method |
| WaterGEMS / WaterCAD | LandXML, shapefile, or database import | Pressure pipe hydraulics, fire flow, water quality |
| PCSWMM | .inp file or shapefile | Enhanced SWMM interface with GIS integration |
| StormCAD | LandXML or shapefile | Gravity storm sewer analysis |

## Best practices for interoperability

- **Standardize naming.** Use consistent structure and pipe naming between Civil 3D and analysis software. Mapping is easier when "MH-1" in Civil 3D matches "MH-1" in SWMM.
- **Export early and often.** Do not wait until final design to test the export/import round-trip. Catch mapping issues early.
- **Document pipe-family mappings.** When importing LandXML, the mapping between catalog entries is not saved. Record it in a project log so the next import uses the same mapping.
- **Keep one source of truth.** Decide whether Civil 3D or the analysis software owns the pipe sizes. Avoid editing geometry in both tools independently.

## Related

- [Pipe network analysis](pipe-network-analysis.md)
- [Gravity vs pressure networks](gravity-vs-pressure.md)
- [Pressure networks](pressure-networks.md)
- [Creating pipe networks](creating-pipe-networks.md)
