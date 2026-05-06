---
title: "Grid Surfaces"
section: "civil3d/surfaces"
order: 40
visibility: public
tags: [surfaces, grid, dem, tin, raster]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATESURFACE, IMPORTSURFACE]
updated: 2026-05-06
---

> **TL;DR**
> 1. A grid surface stores elevations on a regular rectangular matrix instead of irregular triangles. Use it when the source data is already gridded (DEM, GeoTIFF) or when you need uniform cell spacing for analysis.
> 2. Grid surfaces are faster to display at large extents but less accurate at breakline-dependent features (curbs, walls, swales) because the grid cannot honor arbitrary edge alignments.
> 3. Convert between grid and TIN with `CREATESURFACE` (TIN from DEM) or by exporting a TIN to a raster via Map 3D / InfraWorks. Choose the method that matches the downstream use.

## When to use grid vs TIN

| Criterion | Grid surface | TIN surface |
|---|---|---|
| Source data | DEM, USGS NED, LIDAR-derived raster, satellite imagery | Survey points, breaklines, feature lines, contours |
| Breakline support | No — grid cells ignore linear features | Yes — triangulation forced along breaklines |
| Display speed at large scale | Faster — uniform sampling, LOD built in | Slower when vertex count is high |
| Volume accuracy at site scale | Lower — interpolation misses sharp grade breaks | Higher — triangulation follows actual measured points |
| File size | Predictable (rows x cols x cell size) | Variable — depends on vertex density |
| Typical use | Regional terrain backdrop, watershed prelim, corridor background | Design surfaces, grading, earthwork, survey deliverables |

## Creating a grid surface from a DEM

1. Prospector > right-click `Surfaces` > Create Surface > Grid Surface.
2. Name the surface and set a style.
3. Right-click Definition > DEM Files > Add. Browse to the `.dem`, `.tif`, or `.img` raster file.
4. Civil 3D reads the raster header for extents, cell size, and coordinate system. If the DEM uses a different coordinate system than the drawing, the data is reprojected on import (requires the drawing coordinate system to be set).
5. The surface displays at the DEM's native resolution. The grid spacing matches the raster cell size.

Supported raster formats depend on the FDO/GDAL drivers installed with the Civil 3D version. Common formats: USGS DEM (`.dem`), GeoTIFF (`.tif`), ESRI Grid, Erdas Imagine (`.img`).

## Resolution tradeoffs

Grid resolution is the cell size. A 10 m DEM (such as USGS 1/3 arc-second NED) stores one elevation per 10 m cell. A 1 m LIDAR-derived DEM stores 100 times more data per unit area.

- **Too coarse**: terrain features smaller than the cell size are lost. A 30 m DEM cannot represent a 6 m wide ditch.
- **Too fine**: file size and rebuild time increase quadratically with resolution. A 0.5 m grid over a 1 km corridor has 4 million cells.
- **Practical guidance**: for corridor background terrain, 3 m to 10 m is adequate. For site grading design, convert to TIN and add breaklines rather than refining the grid.

## Converting grid to TIN

Civil 3D does not provide a one-click grid-to-TIN conversion. Workarounds:

1. **Export to LandXML then reimport.** Export the grid surface to LandXML (`EXPORTSURFACE`). Open or reimport into a drawing as a TIN surface. The LandXML writer triangulates the grid vertices.
2. **Add the grid surface as a data reference, then paste.** Create a new TIN surface, then paste the grid surface onto it. The paste operation samples the grid at its vertex locations and builds TIN triangles.
3. **Use Map 3D / InfraWorks.** Map 3D can convert raster elevation models to vector TINs with configurable simplification tolerances.

After conversion, add breaklines and boundaries to the new TIN. The grid's interpolated elevations between breakline crossings will be approximate until you add measured linear features.

## Converting TIN to grid

Useful for exporting to GIS or machine control systems that expect raster input.

1. In Map 3D, use the Surface to Raster export or create a raster DEM from the TIN surface.
2. Alternatively, sample the TIN at a regular grid interval using a LISP routine or Dynamo script that queries `Surface.FindElevationAtXY()` across a grid of points, then write the results to a GeoTIFF.
3. InfraWorks imports Civil 3D TINs directly and renders them as a terrain model internally.

## Grid surface limitations in Civil 3D

- Grid surfaces cannot be edited with Swap Edge, Add Line, or Delete Line. Those tools apply only to TIN surfaces.
- Breaklines and boundaries cannot be added to a grid surface Definition. To incorporate linear features, convert to TIN first.
- Volume calculations (composite and TIN volume surface) work between two TIN surfaces or a TIN and a grid, but accuracy is limited by the grid resolution.
- Corridor surfaces, grading groups, and feature-line grading all produce TIN surfaces, not grids.

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Importing surfaces](importing-surfaces.md)
- [Troubleshooting surfaces](troubleshooting-surfaces.md)
