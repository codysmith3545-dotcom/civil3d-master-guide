---
title: "Importing Surfaces"
section: "civil3d/surfaces"
order: 45
visibility: public
tags: [surfaces, import, landxml, dem, geotiff, point-cloud, infraworks]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [IMPORTSURFACE, LANDXMLIN, CREATESURFACE, POINTCLOUDATTACH]
updated: 2026-05-06
---

> **TL;DR**
> 1. LandXML is the standard exchange format for TIN surfaces between Civil 3D, other civil design software, and GPS machine-control systems. Import with `LANDXMLIN` or Insert ribbon > LandXML.
> 2. DEM and GeoTIFF rasters import as grid surfaces. For design work, convert the grid to TIN and add breaklines.
> 3. Point clouds (`.rcp`/`.rcs`) can generate surfaces via `CREATESURFACE` > Add Definition > Point Cloud, but expect millions of vertices. Simplify or region-crop before adding.

## LandXML import

LandXML (`.xml`) is an open schema carrying surfaces, alignments, profiles, parcels, and pipe networks. Most civil engineering software supports it.

1. Insert ribbon > Import > LandXML, or command `LANDXMLIN`.
2. Browse to the `.xml` file. Civil 3D parses its contents and presents a dialog listing the objects found.
3. Check the surfaces (and any other objects) to import. Each surface imports as a new TIN surface in Prospector with its original name.
4. The imported surface is fully editable: add breaklines, boundaries, edits.

Common sources: state DOT design files, contractor machine-control models, third-party grading software, InfraWorks exports.

Verify the coordinate system and units before importing. LandXML files do not always embed CRS metadata; a surface built in state-plane feet imported into a metric drawing will be wildly misplaced.

## DEM and GeoTIFF import

Digital Elevation Models in raster format (`.dem`, `.tif`, `.img`) import as grid surfaces.

1. Create a grid surface (`CREATESURFACE` > Grid Surface).
2. Right-click Definition > DEM Files > Add.
3. Select the file. Civil 3D reads the raster and builds the grid.

For GeoTIFF files that Civil 3D does not recognize natively, use Map 3D's raster tools (Insert > Raster Image / Surface) to convert the raster into a usable surface.

Resolution depends on the source. USGS 1/3 arc-second NED provides approximately 10 m cells. LIDAR-derived DEMs are commonly 1 m or 0.5 m.

## GIS data (shapefiles, geodatabases)

Civil 3D (with Map 3D functionality) can connect to GIS feature classes that carry elevation attributes.

1. Map 3D > Connect to Data (FDO connection) > select SHP or File GDB provider.
2. Add the layer to the drawing.
3. To build a surface from GIS contours or spot elevations, use the contour or drawing-object definition on a new TIN surface, selecting the imported GIS polylines or points.

Alternatively, export the GIS data to a DEM raster in ArcGIS or QGIS and import the raster into Civil 3D as described above.

## InfraWorks interop

InfraWorks produces terrain models from multiple sources (Bing elevation, LIDAR, imported surfaces). To bring an InfraWorks model into Civil 3D:

1. In InfraWorks, select the area of interest and use **Send to Civil 3D** (Model Builder > Export to Civil 3D IMX).
2. In Civil 3D, use `IMPORTINFRAWORKSMODEL` or Insert ribbon > InfraWorks Model.
3. The terrain arrives as a TIN surface. Roads, bridges, and other features come as alignments, profiles, and corridors depending on the model's detail.

For the reverse direction, Civil 3D surfaces export to InfraWorks via IMX or LandXML.

## Point cloud to surface

Terrestrial LIDAR scanners and photogrammetry produce point clouds (`.rcp`, `.rcs`, `.las`, `.laz`). Civil 3D can create a surface directly from an attached point cloud.

1. Attach the point cloud: Insert ribbon > Point Cloud > Attach (`POINTCLOUDATTACH`).
2. Create a new TIN surface.
3. Right-click Definition > Point Clouds > Add.
4. Select the point cloud. Set the region and filtering options:
   - **Window selection** — limit the area to avoid ingesting the entire scan.
   - **Classification filter** — if the cloud is classified (LAS classes), select only class 2 (Ground) to avoid buildings and vegetation.
   - **Thinning** — set a maximum point spacing to reduce density. Without thinning, a typical mobile-LIDAR corridor can produce tens of millions of vertices.
5. Civil 3D builds the TIN.

Post-processing: add breaklines for curbs and swales (the point cloud captures them but does not enforce them as edges), set an outer boundary, run `Simplify Surface` if the vertex count is excessive.

## Import format comparison

| Format | Surface type | Typical source | Notes |
|---|---|---|---|
| LandXML (`.xml`) | TIN | Other civil software, machine control | Preferred for engineered surfaces |
| USGS DEM (`.dem`) | Grid | National Elevation Dataset | 10 m or 30 m resolution |
| GeoTIFF (`.tif`) | Grid | LIDAR derivatives, aerial | Variable resolution; requires CRS match |
| Erdas Imagine (`.img`) | Grid | Remote sensing | Less common in civil work |
| Point cloud (`.rcp`/`.rcs`) | TIN | Terrestrial/mobile LIDAR, photogrammetry | Requires thinning for usable surface |
| IMX (InfraWorks) | TIN | InfraWorks model export | Carries roads, pipes, and terrain together |

## Related

- [Building a TIN surface](building-a-tin-surface.md)
- [Grid surfaces](grid-surfaces.md)
- [Troubleshooting surfaces](troubleshooting-surfaces.md)
