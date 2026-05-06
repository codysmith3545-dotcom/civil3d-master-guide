---
title: "Transforming Coordinates"
section: "field-and-boundary/coordinate-systems"
order: 55
visibility: public
tags: [coordinate-transformation, helmert, affine, grid-to-ground, opus, nad83, civil3d]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [TRANSFORMPOINTS, MAPIMPORT]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — OPUS (Online Positioning User Service)"
    url: https://geodesy.noaa.gov/OPUS/
    verified: 2026-05-06
  - title: "NOAA NGS — NCAT (Coordinate Conversion and Transformation Tool)"
    url: https://geodesy.noaa.gov/NCAT/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Coordinate transformations convert points from one coordinate system to another. Common scenarios: OPUS solution (ITRF/IGS) to NAD83(2011), local assumed coordinates to state plane, and grid to ground.
> 2. Civil 3D's TransformPoints command applies a Helmert (similarity) transformation using control-point pairs. For datum transformations, use NGS tools (NCAT, HTDP) before importing into Civil 3D.
> 3. Grid-to-ground conversion is a special case: multiply state plane coordinates by the inverse of the combined scale factor, with an origin shift to avoid large residuals.

## Transformation types

### Helmert (similarity / conformal)

A Helmert transformation preserves shape (angles). It applies a uniform scale, rotation, and translation. Parameters: 2 translations, 1 rotation, 1 scale (2D) or 3+3+1 (3D). This is the standard transformation for converting between two coordinate systems when you have control-point pairs.

Use when: converting local/assumed coordinates to state plane using measured control points; adjusting a project to match a new GNSS control network.

### Affine

An affine transformation allows different scale factors in X and Y, plus rotation and translation. It does not preserve shape — it can shear the data. Parameters: 6 (2D).

Use when: digitizing from a scanned plan that has been stretched non-uniformly (different shrink in X and Y from scanning or photocopying).

### Projective

A projective transformation handles perspective distortion and requires four control-point pairs. It is used for georeferencing aerial photos or scanned maps where perspective effects are present.

### Datum transformation

A datum transformation converts between geodetic datums (e.g., NAD27 to NAD83, NAD83(NSRS2007) to NAD83(2011), ITRF2014 to NAD83(2011)). These are not simple similarity transformations — they involve 7-parameter (Helmert) or 14-parameter (with rates) models, or grid-based models (NADCON, HTDP).

Use NGS tools for datum transformations:
- **NCAT** for single-point conversions between NAD83 realizations, SPC zones, and UTM zones.
- **HTDP** for transformations involving time-dependent reference frames (ITRF, IGS).
- **NADCON** (embedded in NCAT) for NAD27 to NAD83 conversion.

## OPUS solutions

OPUS returns positions in the IGS reference frame (e.g., IGS14) at the epoch of observation. To use these positions in a NAD83(2011) project:

1. **Download the OPUS solution.** Note the coordinates in both IGS14 and NAD83(2011). OPUS provides both.
2. **Use the NAD83(2011) coordinates** directly for Indiana state plane work. These are already transformed by OPUS.
3. **If you need to transform IGS14 to NAD83(2011) yourself** (e.g., for an RTK base position), use HTDP with the observation epoch.

The difference between IGS14 and NAD83(2011) is approximately 1 to 2 meters in Indiana and grows over time due to plate motion. Never use IGS14 coordinates directly in a NAD83 project without transformation.

## Civil 3D TransformPoints

The `TRANSFORMPOINTS` command transforms a selection of COGO points using control-point pairs:

1. Specify source points (points in the current coordinate system).
2. Specify destination points (points in the target coordinate system).
3. Civil 3D computes a best-fit Helmert transformation (translation, rotation, uniform scale).
4. The transformation is applied to all selected points.

Minimum control: 2 point pairs for a 2D Helmert (4 parameters). More pairs provide redundancy and allow residual analysis. Residuals exceeding the expected measurement error indicate a blunder in one or more control points.

## Grid-to-ground conversion

Converting state plane grid coordinates to ground coordinates is a common requirement. Method:

1. **Compute the CSF** at the project centroid (see [combined scale factor](combined-scale-factor.md)).
2. **Choose a project origin.** Pick a point near the project centroid (often a control monument).
3. **Apply the conversion:**

```
Ground_N = (Grid_N - Origin_Grid_N) / CSF + Origin_Ground_N
Ground_E = (Grid_E - Origin_Grid_E) / CSF + Origin_Ground_E
```

Where Origin_Ground is set so that the origin point has convenient ground coordinates (often the same as its grid coordinates, so the difference is zero at the origin and grows with distance).

The simpler approach — multiply all coordinates by 1/CSF — works but shifts the entire coordinate system, producing coordinates that differ from state plane by large amounts at the origin. This can cause confusion.

### In Civil 3D

Set the drawing-level scale factor in Drawing Settings to 1/CSF. This causes all distances computed from the state plane coordinates to be reported as ground distances. The coordinates themselves remain on the grid, but the distances and areas reflect ground values.

## Converting between NAD83 realizations

NAD83(1986), NAD83(HARN), NAD83(NSRS2007), and NAD83(2011) are different realizations of NAD83. Differences between them are typically 0.01 to 0.1 m in Indiana, but they are systematic and should not be ignored for geodetic-quality work. Use NCAT to convert between realizations.

For boundary surveys and site design, the differences between HARN, NSRS2007, and 2011 are within typical survey precision. However, the surveyor should always state which realization was used.

## Related

- [Combined scale factor](combined-scale-factor.md)
- [Setting Civil 3D coordinate system](setting-civil3d-cs.md)
- [NAD83 vs. 2011 vs. WGS84](nad83-vs-2011-vs-wgs84.md)
- [NSRS Modernization](nsrs-modernization.md)
