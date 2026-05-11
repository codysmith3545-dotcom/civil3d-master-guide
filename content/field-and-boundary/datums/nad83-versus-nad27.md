---
title: "NAD83 vs NAD27 — Historical Datums and NADCON Transformations"
section: "field-and-boundary/datums"
order: 10
visibility: public
tags: [nad83, nad27, nadcon, datum-transformation, legacy]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "NGS — NADCON 5.0 (current grid-based transformation)"
    url: https://geodesy.noaa.gov/NCAT/
    verified: 2026-05-11
  - title: "NGS — NAD 27 to NAD 83 background"
    url: https://geodesy.noaa.gov/datums/horizontal/north-american-datum-1983.shtml
    verified: 2026-05-11
  - title: "Dewhurst, W. T. (1990) — NADCON: The application of minimum-curvature-derived surfaces in the transformation of positional data from NAD27 to NAD83 (NOAA TM NOS NGS-50)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS50.pdf
    verified: 2026-05-11
  - title: "NGS — NCAT (NGS Coordinate Conversion and Transformation Tool)"
    url: https://geodesy.noaa.gov/NCAT/
    verified: 2026-05-11
---

> **TL;DR**
> 1. **NAD27** (Clarke 1866 ellipsoid, origin at Meades Ranch, Kansas) was the U.S. horizontal datum from 1927 to 1986. **NAD83** (GRS 80 ellipsoid, geocentric origin) replaced it; the two differ by **roughly 10 to 100 m** in the conterminous U.S., with shifts that vary by location.
> 2. The official NGS transformation between the two is **NADCON** (now NADCON 5.0 inside NCAT). It is a **grid-based bilinear interpolation** with a published accuracy of about **0.15 m (0.5 ft) at 67 percent confidence** in the conterminous U.S.
> 3. Old plats, deeds, and section maps prepared before the late 1980s are usually on NAD27. Treat any inherited coordinate as suspect until the datum is confirmed in writing.

## What each datum is

### NAD27

- **Adopted:** 1927 by the U.S. Coast and Geodetic Survey (predecessor to NGS).
- **Ellipsoid:** Clarke 1866, semi-major axis a = 6,378,206.4 m, flattening 1/f = 294.978698.
- **Origin:** Meades Ranch triangulation station in Osborne County, Kansas. Position fixed, not geocentric.
- **Realization:** Adjusted from triangulation observations made between the 1830s and 1920s. Roughly 25,000 stations in the original adjustment.
- **Use:** Standard for U.S. surveys 1927 through the 1980s. Most published USGS 7.5-minute quadrangle tic marks are on NAD27.

### NAD83

- **Adopted:** 1986 by NGS, replacing NAD27.
- **Ellipsoid:** Geodetic Reference System 1980 (GRS 80), a = 6,378,137.0 m, 1/f = 298.257222101.
- **Origin:** Earth-centered (geocentric), aligned with the BIH 1984.0 reference frame.
- **Realization:** Adjusted from approximately 250,000 horizontal control stations and Doppler satellite observations. The first NAD83 realization is sometimes called NAD83(1986) or simply "NAD83 original."

### Why they differ

Because NAD27 was fixed at a single non-geocentric point and NAD83 is geocentric and aligned to a different ellipsoid, the same physical monument has two different latitude/longitude values in the two systems. The shift is **not constant**: it varies regionally because NAD83's nationwide adjustment redistributed the residual errors that had accumulated in the NAD27 triangulation network.

Typical shifts in the conterminous U.S.:
- Northeast: NAD83 latitudes are ~5 to 25 m **south** of the NAD27 value.
- Mountain West: NAD83 latitudes are ~50 to 100 m **north** of the NAD27 value.
- Indiana (8-county area): NAD83 longitudes are ~25 to 35 m **east** of the NAD27 longitude; latitude shifts are smaller (a few meters).

These are differences on the **graticule**. State Plane coordinates have their own zone-by-zone shifts that are larger because the projection parameters changed.

## NADCON — the official transformation

NADCON is the National Geodetic Survey's grid-based datum transformation. It converts geographic coordinates between NAD27 and NAD83 using a bilinear interpolation from a regular grid of pre-computed shifts.

### Versions

- **NADCON (1990)** — original release, NOAA TM NOS NGS-50 by Dewhurst.
- **NADCON 5.0 (2017-present)** — bundled inside the NCAT (NGS Coordinate Conversion and Transformation) tool. Adds support for additional realizations beyond NAD27 to NAD83(1986), including HARN.

### Accuracy

NGS publishes the following accuracy estimates for NADCON 5.0 (NAD27 to NAD83(1986)) in the conterminous U.S.:

- **0.15 m (0.5 ft) horizontal at 67 percent confidence** for the conterminous U.S.
- Larger errors in Alaska (~0.50 m) and Hawaii (~0.20 m).

This is the limit of the transformation itself; it does not include errors in the source NAD27 coordinate, which are often much larger (1 to 3 m is common for older monuments).

### How to run a NADCON transformation

The current entry point is the NGS NCAT tool: [https://geodesy.noaa.gov/NCAT/](https://geodesy.noaa.gov/NCAT/). Choose the source datum (NAD27), the target datum (NAD83 or a later realization), and submit the latitude/longitude. The tool returns the transformed coordinates and a published accuracy estimate.

For batch transformations, NCAT accepts upload of a coordinate file (NGS .gfile format).

## Civil 3D implications

Civil 3D ships definitions for both NAD27 and NAD83 State Plane zones. To transform between them:

- Set the source drawing's coordinate system in **Settings -> Edit Drawing Settings -> Units and Zone** (e.g., a NAD27 zone such as `IN27-EF`).
- Use the **Transform** functionality (or `MAPCSASSIGN` and `MAPCSADD` map commands) to project coordinates into a target NAD83 zone.

Civil 3D's internal datum transformations rely on the bundled coordinate system definitions and may not use the NGS NADCON grid directly. For boundary-grade transformations, run the coordinates through NCAT and import the transformed values, then verify Civil 3D's transformation against NCAT for at least one published station inside the project area.

## When you encounter NAD27 in the wild

- **County GIS layers from before ~2000** are often still on NAD27 even when the metadata is missing.
- **Older deeds and plats** that cite "Indiana State Plane" without specifying a realization usually mean NAD27 if the survey predates ~1990.
- **USGS 7.5-minute quadrangle tic marks** are on NAD27 unless the sheet has been re-published with NAD83 ticks.
- **PLSS corner coordinates** published by the BLM or county surveyors may be on NAD27 if the field work was done before the local re-survey to NAD83.

When you inherit such data, transform once with NCAT, document the source/target/accuracy in the project metadata, and never re-transform the result back through a different tool — accumulated rounding can introduce sub-foot drift.

## Indiana implications

The Indiana State Plane Coordinate System parameters changed when NAD83 was adopted (different false eastings/northings, different units). Coordinates shown on a NAD27 plat **must** be transformed to the current realization before use in a modern project. See [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md) for the current zone parameters.

## Related

- [NAD83(2011) realization](nad83-2011-realization.md)
- [Coordinate systems](../coordinate-systems/index.md)
- [State Plane Indiana](../../jurisdictions/indiana/state/state-plane-indiana.md)
