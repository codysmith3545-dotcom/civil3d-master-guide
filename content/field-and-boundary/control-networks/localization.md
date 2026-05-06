---
title: "Localization (Site Calibration)"
section: "field-and-boundary/control-networks"
order: 70
visibility: public
tags: [localization, site-calibration, ground-coordinates, gnss]
updated: 2026-05-06
sources:
  - title: "Trimble — Site Calibration Best Practices"
    url: https://geospatial.trimble.com/
    verified: 2026-05-06
  - title: "NGS — State Plane Coordinate System"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-06
  - title: "Wolf & Ghilani — Elementary Surveying, 16th ed."
    url: https://www.pearson.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. A **site calibration** (localization) transforms GNSS positions to match existing local control coordinates. It computes a best-fit transformation (horizontal shift, rotation, scale; vertical shift and tilt) so that your rover reads the same coordinates as the local system.
> 2. Use a minimum of **4 calibration points**, well-distributed around the project site. More points improve the fit and provide redundancy for quality checks.
> 3. **Residuals** from the calibration are your quality check. If any point's residual exceeds 0.05 ft horizontally or 0.05 ft vertically, investigate before accepting the calibration.
> 4. Always **document the calibration** in the project file: which points were used, what residuals resulted, and the computed transformation parameters. Future surveyors need this to reproduce your coordinate system.

## What localization does

GNSS receivers natively compute positions in a global reference frame (e.g., WGS84 or NAD83(2011) latitude/longitude/ellipsoid height). Most project work uses local coordinates: state plane northing/easting with ground-scale distances, or an arbitrary site coordinate system inherited from a previous survey.

A site calibration (also called localization) computes a mathematical transformation that maps GNSS global positions to the local coordinate system. The transformation typically includes:

- **Horizontal:** Translation (shift in N and E), rotation (azimuth correction), and scale (to convert grid distances to ground distances or match a local system's scale).
- **Vertical:** A tilted plane fit that maps ellipsoid heights to local orthometric elevations.

After calibration, the rover displays coordinates in the local system directly.

## When to localize vs when to use published coordinates

### Use localization when

- The project has existing control in a local or assumed coordinate system that does not correspond to a standard datum and projection.
- Previous surveys established a ground-coordinate system (state plane coordinates scaled to ground) and the new work must match.
- Construction plans are on a ground-coordinate system and stakeout must match the plans.
- The project area has significant elevation (making the combined scale factor appreciably different from 1.0) and the convention is to work in ground coordinates.

### Use published coordinates (no localization) when

- The project is on state plane grid coordinates and all parties agree to work on grid.
- You are establishing new control for a greenfield project with no existing coordinate system.
- Accuracy reporting to FGDC or ASPRS standards is required — these standards assume coordinates in a published datum (NAD83, NAVD88), not a localized system.
- You want maximum reproducibility: any surveyor can return to the site and reproduce the coordinates without needing the calibration file.

### The hybrid approach

Many firms use state plane coordinates with a single combined scale factor applied at the drawing level (in Civil 3D Drawing Settings). This gives ground-scale distances while maintaining a direct, well-documented relationship to the published datum. This avoids the complexity of a full localization while still providing ground-scale measurements.

## Calibration point requirements

### Minimum number

A minimum of **4 calibration points** is required for a robust calibration. Fewer points:

- **1 point:** Can shift the origin but cannot determine rotation or scale. Usable only as a quick check, not a calibration.
- **2 points:** Determines shift, rotation, and scale in the horizontal plane, but with no redundancy. Any error in either point distorts the entire calibration.
- **3 points:** Provides minimal redundancy (1 degree of freedom in horizontal). Marginal.
- **4+ points:** Provides multiple degrees of freedom for quality checking. Use 4 as the minimum; 5-6 is better for larger projects.

### Distribution

Calibration points must be **well-distributed** around the project area:

- Spread the points across the full extent of the site, not clustered in one area.
- Include points at the perimeter of the work area. Localizing with points in the center and then working at the edges is an extrapolation, which degrades accuracy.
- Distribute points in 3D: include points at different elevations if the site has significant relief. This improves the vertical tilt-plane fit.

### Quality of calibration points

Each calibration point must have:

- A known local coordinate (the "target" coordinate in the local system).
- A GNSS observation at the same physical mark.

The accuracy of the calibration is limited by the accuracy of the local coordinates. If the existing control was poorly established, the calibration will faithfully reproduce those errors. Verify that the local control is internally consistent before calibrating to it.

## Performing the calibration

### Field procedure

1. **Identify the calibration points.** These are existing control monuments with known local coordinates.
2. **Occupy each point with the GNSS rover** for a standard observation (15-30 seconds RTK, longer for higher accuracy). Record the GNSS position (in the global datum) and the known local coordinate.
3. **Enter both coordinate pairs** into the data collector's calibration function. Most controllers (Trimble Access, Leica Captivate, Topcon MAGNET) have a built-in site calibration routine.
4. **Run the calibration.** The software computes the best-fit transformation and reports residuals for each point.
5. **Review residuals.** See below.
6. **Accept the calibration.** From this point forward, the rover displays coordinates in the local system.

### Reviewing residuals

The residual at each calibration point is the difference between the transformed GNSS position and the known local coordinate. Residuals should be:

- **Horizontal:** Less than 0.05 ft for typical boundary and topo work. Less than 0.02 ft for construction staking.
- **Vertical:** Less than 0.05 ft for typical work. Less than 0.03 ft for precision grading.

If one point has a significantly larger residual than the others:

1. Check for a **data entry error** (transposed digits, wrong point number, wrong coordinate).
2. Check for a **monument disturbance** (the mark has moved since the original survey).
3. Check for a **GNSS observation problem** (multipath, poor satellite geometry, incorrect antenna height).
4. If the cause cannot be identified, remove the point from the calibration and re-compute. Document why the point was excluded.

## Combined scale factor from localization

The calibration computes a scale factor that relates GNSS-derived distances to local distances. This scale factor is analogous to the combined scale factor (CSF) described in [Combined scale factor](../coordinate-systems/combined-scale-factor.md), but it is empirically derived from the calibration points rather than computed from the projection parameters and elevation.

If the local system is a ground-coordinate system (state plane scaled to ground), the calibration scale factor should be close to the inverse of the theoretical CSF for the project area. If it differs significantly (more than 10 ppm), investigate — the local system may have an additional scaling or the existing control may have systematic errors.

## Documenting the localization

Record the following in the project file:

- **Calibration points used:** Point names/numbers, local coordinates, GNSS coordinates, and residuals.
- **Calibration points excluded** (if any) and the reason for exclusion.
- **Transformation parameters:** Horizontal shift (dN, dE), rotation, scale; vertical shift, tilt-N, tilt-E. Most data collectors can export these.
- **Date and time** of the calibration.
- **GNSS configuration:** Base station or network used, datum, geoid model.
- **Data collector file name** containing the calibration (so it can be reloaded on a return trip).

This documentation is critical for:

- **Reproducibility.** A different crew (or the same crew months later) can reload the calibration and work in the same coordinate system.
- **Quality assurance.** A reviewer can evaluate whether the calibration was performed correctly.
- **Future surveys.** If the project extends or is revisited, the calibration file is the key to maintaining coordinate consistency.

## How Civil 3D coordinate systems interact with localized data

When localized data is imported into Civil 3D:

- The coordinates are already in the local system. Civil 3D sees them as simple N/E/Z values.
- If Civil 3D's drawing is set to a state plane coordinate system, and the localized data is on a ground-coordinate system, there will be a systematic discrepancy (the CSF difference). Either set the drawing to match the local system (using a custom coordinate system or a scale factor in Drawing Settings) or transform the data.
- The localization transformation is external to Civil 3D. Civil 3D does not know about it unless you configure the drawing's coordinate system to match the localized system.
- For maximum transparency, set up the drawing on published state plane coordinates and apply a ground-scale factor in Drawing Settings. This matches a localization that simply scales state plane to ground.

## Related

- [Combined scale factor](../coordinate-systems/combined-scale-factor.md)
- [GNSS RTK](../survey-equipment/gnss-rtk.md)
- [GNSS static](gnss-static.md)
- [Network design](network-design.md)
- [Accuracy standards](accuracy-standards.md)
- [Setting Civil 3D coordinate system](../coordinate-systems/setting-civil3d-cs.md)
