---
title: "Coordinate-System Strings During Export"
section: "civil3d/interop"
order: 70
visibility: public
tags: [coordinate-system, epsg, wkt, landxml, ifc, gis, civil3d, projection]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-11
---

> **TL;DR**
> 1. Civil 3D, GIS tools, and Bentley each use their own catalogue of coordinate-system codes — Autodesk's are based on Mentor Graphics' MENTOR strings (e.g. `IN83-EF`), GIS uses **EPSG** integer codes (e.g. `2965`), and ESRI uses its own catalogue (e.g. `NAD_1983_StatePlane_Indiana_East_FIPS_1301_Feet`). LandXML and IFC both prefer EPSG; Civil 3D's exporter writes the Autodesk string into a non-standard attribute and (since 2024) the EPSG code into the standard one when known.
> 2. EPSG embedding in LandXML uses `<CoordinateSystem epsgCode="…">`; in IFC it uses `IfcProjectedCRS.Name` set to `"EPSG:…"` plus an `IfcMapConversion`. In LAS/LAZ it uses an OGC WKT VLR. **Always set this on the source drawing before export — none of the formats can guess it after the fact.**
> 3. The most common bug is **horizontal datum mismatch silently absorbed into vertical** — exporting a NAD83(2011) project to a recipient who reads it as NAD83(1986) leaves coordinates "right" but a 0.1–1.0 m horizontal shift accumulates over the project. Always include both `horizontalDatum` and `verticalDatum`.

## How Civil 3D names coordinate systems

Civil 3D uses **MENTOR coordinate-system codes** inherited from the Autodesk Map / FDO stack. Examples relevant to Indiana:

| MENTOR code | EPSG | ESRI WKID | Description |
|---|---|---|---|
| `IN83-EF` | 2965 | 2965 | NAD83 Indiana East (US ft) |
| `IN83-WF` | 2966 | 2966 | NAD83 Indiana West (US ft) |
| `IN83-EIF` | 7327 | n/a (missing pre-10.8) | NAD83(2011) Indiana East (intl ft) |
| `LL83` | 4269 | 4269 | NAD83 lat/lon |

Set the drawing's coordinate system at `Settings → Edit Drawing Settings → Units and Zone → Selected coordinate system`. The picker shows MENTOR descriptions but the saved value is the MENTOR code.

The drawing also has a separate **Drawing Units** scale and **Working Units** assumption that must agree with the chosen zone (e.g. `IN83-EF` is in US Survey Feet — set drawing units to `Feet` and assume US Survey when the surveyor's monuments use them).

## What gets written to each format

### LandXML

```xml
<CoordinateSystem
  desc="NAD83 Indiana East (US Foot)"
  name="IN83-EF"
  epsgCode="2965"
  horizontalDatum="NAD83"
  verticalDatum="NAVD88"
  ellipsoidName="GRS_1980"
  geoidName="GEOID18"/>
```

- `name` is the Autodesk MENTOR code (Civil 3D 2024+ has begun also writing it as the EPSG code if no MENTOR code is set).
- `epsgCode` is recognised by OpenRoads, TBC, and QGIS-based readers; ignored by some legacy tools.
- `horizontalDatum`, `verticalDatum` are free text but follow EPSG datum-name conventions when possible.
- `ellipsoidName` and `geoidName` are *not* in the official LandXML 2.0 schema but are extensions that Civil 3D writes; the LandXML XSD validator will warn.

### IFC 4.3

IFC uses two related entities: `IfcProjectedCRS` for the projection definition, and `IfcMapConversion` for the affine transformation between the project's local coordinate system and the geographic one.

```step
#200=IFCPROJECTEDCRS('EPSG:2965','NAD83 Indiana East (US ft)','EPSG:6318',
                     $,$,$,#201);
#201=IFCNAMEDUNIT(.LENGTHUNIT., #202);
#210=IFCMAPCONVERSION(#100,#200,178000.0,39000.0,720.0,1.0,0.0,$);
```

The pattern is: project base point at (0,0,0) → `IfcMapConversion` translates by (Easting, Northing, OrthogonalHeight) to land in the projected CRS named by `IfcProjectedCRS`. This keeps geometry near the origin for floating-point precision.

### LAS / LAZ

The CRS lives in a VLR. Modern best practice (LAS 1.4) is the OGC WKT VLR:

```
VLR user_id   = "LASF_Projection"
VLR record_id = 2112
VLR data      = "PROJCRS[\"NAD83 / Indiana East (ftUS)\",..."
```

PDAL or LAStools (`lasinfo -i tile.laz`) will print the WKT or GeoTIFF tags. If neither is present, the file is "unrecorded CRS" and the recipient must set it manually — common cause of misregistered tiles.

### GIS-side (Esri / QGIS)

GIS reads EPSG and WKT. ESRI products additionally accept their own WKID catalogue, which often matches EPSG but historically diverged. PRJ files (`.prj`) shipped alongside shapefiles carry an ESRI WKT (often single-line, missing the `AUTHORITY[]` block). When converting:

- ESRI WKT → EPSG: use a lookup table; `pyproj.CRS.from_wkt(s).to_epsg()` is reliable for projected CRS, less so for compound (3D) CRS.
- EPSG → ESRI WKT: use `pyproj.CRS.from_epsg(n).to_wkt(version="WKT2_2019")`, then add `AUTHORITY` blocks if needed.

## EPSG vs MENTOR vs ESRI: code translation cheatsheet (Indiana)

| Zone (datum, units) | EPSG | MENTOR | ESRI WKID |
|---|---|---|---|
| NAD83 IN East (ftUS) | 2965 | IN83-EF | 2965 |
| NAD83 IN West (ftUS) | 2966 | IN83-WF | 2966 |
| NAD83(2011) IN East (ftUS) | 6494 | IN83/2011-EF | 6494 |
| NAD83(2011) IN West (ftUS) | 6495 | IN83/2011-WF | 6495 |
| NAD83 IN East (m) | 2967 | IN83-E | 2967 |
| NAD83 IN East (intl ft) | 7327 | IN83-EIF | 7327 |
| WGS84 / Web Mercator | 3857 | WORLD-MERCATOR | 102100 (legacy) / 3857 |

**The "feet" gotcha:** EPSG 2965 is **US Survey foot**; EPSG 7327 is **international foot**. Two different zones for the same physical area. They differ by 2 ppm; over a 6 mi section that is 0.06 ft — enough to break monument retracement.

## Vertical datum & geoid

LandXML's `verticalDatum` attribute is free text. Civil 3D writes one of `NAVD88`, `NGVD29`, `MSL`, `Local`, or the user's free string. IFC 4.3 introduces `IfcVerticalDatum` (in proposed extensions) but most exporters still embed vertical datum implicitly through the height axis of the CRS or a custom property.

Geoid model used for orthometric ↔ ellipsoidal conversion (e.g. `GEOID18`, `GEOID12B`) is not part of any standard schema. Civil 3D writes it into LandXML's non-standard `geoidName` attribute; for IFC and other formats, document it in the README that ships with the file.

## Common pitfalls

- **"Coordinates landed in the Pacific Ocean."** EPSG vs ESRI WKID divergence — recipient interpreted 102100 (legacy ESRI Web Mercator) as 102100 EPSG (which doesn't exist), defaulted to lat/lon, and plotted (0,0) at Null Island.
- **"Surface drops 30 m at the boundary."** Geoid model mismatch — sender used GEOID18, recipient applied GEOID12B. The 30 m number suggests the recipient is doing ellipsoidal-to-orthometric conversion when none was needed (your data was already orthometric).
- **"OpenRoads says coordinate system is 'unknown'."** Civil 3D wrote MENTOR `name="IN83-EF"` but no `epsgCode`. Open the LandXML in a text editor and add `epsgCode="2965"` to the `<CoordinateSystem>` element by hand.
- **"My GIS says 'projection mismatch on import'."** The drawing's CRS metadata is correct but the GIS expected a `.prj` sidecar — for shapefile-style ingestion, write a separate ESRI WKT file alongside.
- **"LAS file has no CRS — what now?"** If you know the source, override with `pdal translate in.las out.las --writers.las.a_srs="EPSG:2965"`; if you don't, request it from the data provider — guessing destroys retracement value.
- **"International foot vs US Survey foot — does it really matter?"** Yes. The NGS retired the US Survey foot effective 2023; new state-plane definitions use international feet only. Pre-2023 control + post-2023 design will mix the two unless explicitly normalised.

## Sources

- IOGP, *EPSG Geodetic Parameter Dataset*, [https://epsg.org/](https://epsg.org/), v11.x.
- OGC, *Geographic information — Well-known text representation of coordinate reference systems (WKT2 / ISO 19162:2019)*.
- Autodesk Civil 3D Help, *Coordinate Systems and Transformations*.
- NGS, *State Plane Coordinate System of 2022 — US Survey Foot Deprecation Notice*, NOAA NGS, 2022.
- LandXML 2.0 schema, [http://www.landxml.org/](http://www.landxml.org/).
- buildingSMART, *IFC 4.3 Geographic Coordinate Reference Systems*.
