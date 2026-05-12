---
title: "Point Cloud Formats: LAS, LAZ, E57"
section: "civil3d/interop"
order: 60
visibility: public
tags: [point-cloud, las, laz, e57, lidar, recap, civil3d, mobile-mapping]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, recap-pro]
relatedCommands: [POINTCLOUDATTACH, POINTCLOUDCROP, POINTCLOUDLIMITBOX, RECAP]
updated: 2026-05-11
---

> **TL;DR**
> 1. **LAS** (ASPRS LASer) is the open binary format for unstructured aerial/terrestrial lidar; **LAZ** is LAS losslessly compressed (~10–20% original size). **E57** (ASTM E2807) is the open container for *structured* scans (TLS) plus colour imagery and metadata; it is what most TLS vendors use for archive.
> 2. Civil 3D consumes point clouds via **Autodesk ReCap** (`.rcp` project / `.rcs` scan). ReCap reads LAS, LAZ, E57, and many vendor-native formats; you index in ReCap once, then attach the `.rcp` to Civil 3D with `POINTCLOUDATTACH`.
> 3. Pick by use case: **LAZ** for archive and transmittal (best compression), **LAS 1.4** for interoperability with anything that needs raw uncompressed access, **E57** when scan structure (per-station, per-pixel intensity, RGB) matters — boundary surveys, BIM-to-as-built comparison.

## LAS / LAZ

LAS is binary; the spec is published by ASPRS and is at version 1.4 (2019 revision R15). Each file has:

- A **public header** (375 bytes for 1.4) declaring point format, total points, min/max XYZ, system ID, generating software.
- Optional **Variable Length Records (VLRs)** for metadata; coordinate reference system goes here as a WKT VLR (`OGC_WKT`) or as GeoTIFF tags.
- A **point data record** stream. Point Data Record Formats (PDRF) 0–10 differ in which fields are present; PDRF 6/7/8 are the 1.4-only formats supporting GPS time, RGB, and waveform data.

Useful PDRFs in practice:

| PDRF | Has GPS time | Has RGB | Has NIR | Use |
|---|---|---|---|---|
| 1 | yes | no | no | aerial lidar, classic |
| 2 | no | yes | no | photogrammetry-derived |
| 3 | yes | yes | no | colourized aerial |
| 6 | yes | no | no | 1.4 baseline, replaces 1 |
| 7 | yes | yes | no | 1.4 RGB |
| 8 | yes | yes | yes | 1.4 multispectral |

**LAZ** (LASzip) compresses LAS losslessly. The compression is open (LASzip by Martin Isenburg), not patent-encumbered. PDAL, LAStools, and ReCap all read it natively.

### Coordinate system in LAS

The CRS lives in the VLRs. Two encoding paths:

- **GeoTIFF VLRs** (LAS 1.0 – 1.3 default). VLR record IDs 34735, 34736, 34737. Carries an EPSG code or projected CS string in the historical GeoTIFF format.
- **OGC WKT VLR** (LAS 1.4 default). VLR user ID `LASF_Projection`, record ID 2112. Carries a WKT2 (preferred) or WKT1 string.

Civil 3D's ReCap pipeline reads both. If both are present, WKT wins.

## E57

E57 is a single file (`.e57`) that is part XML (the index) and part binary (the data sections). It is the only open format that natively represents **scans as structured grids** — you can recover the per-pixel layout of a panoramic scan, which lets you re-render intensity images, do feature picking against the original 2D image, and run plane extraction efficiently.

Top-level XML structure:

```xml
<e57Root>
  <formatName>ASTM E57 3D Imaging Data File</formatName>
  <coordinateMetadata>...EPSG:2965...</coordinateMetadata>
  <data3D>
    <vectorChild type="Structure">
      <name>Scan001</name>
      <pose>...</pose>
      <points>...binary section pointer...</points>
      <pointFields>
        <cartesianXField/>
        <cartesianYField/>
        <cartesianZField/>
        <intensityField/>
        <colorRedField/>
      </pointFields>
    </vectorChild>
  </data3D>
  <images2D>...</images2D>
</e57Root>
```

Key fields:

- `pose` — per-scan transformation (rotation matrix + translation). Lets the consumer keep scans separate or merge them.
- `cartesianBounds` — per-scan bounding box for fast culling.
- `intensityLimits`, `colorLimits` — needed to renormalize intensity/colour for visualisation.

The libE57Format C++ library and the pure-Python `pye57` are the most-used readers.

## Pipeline recipes

### Aerial LAZ to Civil 3D surface

1. Obtain LAZ tiles. Verify CRS with `lasinfo -i tile.laz` (LAStools) or `pdal info tile.laz`.
2. Reproject to project CRS if needed: `pdal pipeline reproject.json` with a `filters.reprojection` step. Avoid this step inside ReCap — its CRS handling for non-trivial transforms is unreliable.
3. Classify ground returns if not already classified: `pdal translate in.laz out.laz smrf` (Simple Morphological Filter).
4. In ReCap Pro: New Project → import the LAZ tiles → indexing produces an `.rcp` and `.rcs` per scan.
5. In Civil 3D: `POINTCLOUDATTACH` the `.rcp`. Use `POINTCLOUDLIMITBOX` to crop interactively.
6. To build a surface: `Surfaces → Create Surface From Point Cloud`. Choose the ground classification(s); the dialog offers Kriging, Average, or Lowest interpolation.

### Terrestrial E57 to Civil 3D for as-built

1. Receive `.e57` per setup from the scan crew.
2. In ReCap Pro: New Project → Register the E57s (ReCap auto-registers if cloud-to-cloud is enabled and survey targets are present).
3. Verify registration error (tension report) — typically aim for < 0.01 ft for tight as-builts.
4. Export `.rcp` + `.rcs` set to a network location.
5. Attach in Civil 3D as above.

### Mobile mapping LAS to Civil 3D

Mobile mapping units (e.g. Trimble MX9, Leica Pegasus) often emit LAS 1.4 PDRF 6 with full waveform. Treat the same as aerial after classification, but expect 10× the point density. Always crop to project corridor before indexing or ReCap will run out of memory mid-index.

## Common pitfalls

- **"ReCap can't index this LAZ — error 'unsupported point data record format'."** ReCap pre-2023 did not support PDRF 6/7/8. Re-export from PDAL with `--writers.las.minor_version=2 --writers.las.dataformat_id=3` to downgrade.
- **Wrong CRS in ReCap.** ReCap reads the CRS but lets the user override it during import. If a user clicks "Auto-detect" without verifying, ReCap may pick the wrong UTM zone for files near a zone boundary. Always confirm the EPSG code before indexing.
- **E57 file opens but only the first scan loads.** `vectorChild` ordering varies; some viewers (Recap older than 2022) only loaded `data3D[0]`. Update ReCap.
- **Intensity is washed out.** Civil 3D normalises intensity using the file's declared `intensityLimits`. If those are missing or wrong, every point shows mid-grey. Re-export the E57 from the scanner's authoring software with proper intensity limits, or run a PDAL `filters.assign` to re-clamp.
- **Surface from cloud is "spiky" along bridges or trees.** Ground classification was incomplete. Re-run `pdal translate ... smrf` with tighter parameters (`smrf.cell=1.0 smrf.window=15`).
- **`.rcp` is enormous and slow on a network drive.** ReCap projects are designed for SSD local storage. Copy to local disk before opening, or use the BIM 360/ACC ReCap upload to host the project in Autodesk Construction Cloud.

## Sources

- ASPRS, *LAS Specification 1.4 R15*, [https://www.asprs.org/wp-content/uploads/2019/07/LAS_1_4_r15.pdf](https://www.asprs.org/wp-content/uploads/2019/07/LAS_1_4_r15.pdf).
- ASTM E2807-11(2019), *Standard Specification for 3D Imaging Data Exchange, Version 1.0*, [https://www.astm.org/e2807-11r19.html](https://www.astm.org/e2807-11r19.html).
- LASzip / LAStools, [https://lastools.github.io/](https://lastools.github.io/).
- libE57Format, [https://github.com/asmaloney/libE57Format](https://github.com/asmaloney/libE57Format).
- PDAL documentation, [https://pdal.io/](https://pdal.io/).
- Autodesk ReCap Pro Help, [https://help.autodesk.com/view/RECAP/](https://help.autodesk.com/view/RECAP/).
