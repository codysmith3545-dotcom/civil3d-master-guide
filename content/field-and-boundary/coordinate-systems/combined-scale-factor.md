---
title: "Combined Scale Factor"
section: "field-and-boundary/coordinate-systems"
order: 40
visibility: public
tags: [combined-scale-factor, grid-to-ground, elevation-factor, state-plane, indiana]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — State Plane Coordinate System"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Combined scale factor (CSF) = grid scale factor x elevation factor. It converts between grid distances (on the state plane projection) and ground distances (what you measure with a tape or total station on the earth's surface).
> 2. For most of Indiana, CSF is between 0.99993 and 1.00010. On a 1,000 ft line, the grid-to-ground difference is typically 0.07 to 0.10 ft — significant for boundary surveys, negligible for small-site topo.
> 3. Always state whether your coordinates and distances are grid or ground. Mixing the two without disclosure causes real problems for future surveyors.

## Components

### Grid scale factor (k)

The grid scale factor accounts for the distortion introduced by projecting the curved earth onto a flat coordinate system. In a Transverse Mercator projection (used for both Indiana zones), k varies with distance from the central meridian:

- **On the central meridian**, k is at its minimum (less than 1 for a secant projection). For Indiana East Zone (FIPS 1301), k on the central meridian is approximately 0.999966667. For Indiana West Zone (FIPS 1302), it is approximately 0.999966667.
- **Away from the central meridian**, k increases. At the edges of the zone, k exceeds 1.

The grid scale factor at a specific point can be obtained from NGS tools (e.g., the NGS Coordinate Conversion and Transformation Tool — NCAT) or calculated from the projection parameters.

### Elevation factor (EF)

The elevation factor accounts for the difference between a distance measured at ground elevation and the equivalent distance at the ellipsoid. It is:

```
EF = R / (R + h)
```

Where:
- R = mean radius of the earth at the point (~20,906,000 ft for Indiana latitudes)
- h = ellipsoid height of the point in feet

For a site at 800 ft ellipsoid height (typical for central Indiana):

```
EF = 20,906,000 / (20,906,000 + 800) = 0.999962
```

The elevation factor is always less than 1 for points above the ellipsoid, meaning ground distances are always longer than their ellipsoid equivalents.

Note: h is the **ellipsoid height**, not the orthometric (NAVD88) elevation. In Indiana, the geoid separation (N) is approximately -32 to -36 m, so ellipsoid height = orthometric elevation + N. For a site at 800 ft NAVD88 elevation, the ellipsoid height is roughly 800 - 108 = 692 ft (approximately). Use the actual geoid model value for precision work.

### Combined scale factor

```
CSF = k x EF
```

For a point in central Indiana, near the central meridian, at 800 ft ellipsoid height:

```
CSF = 0.999967 x 0.999962 = 0.999929
```

To convert: Ground distance = Grid distance / CSF. Grid distance = Ground distance x CSF.

On a 1,000.00 ft ground line: Grid distance = 1,000.00 x 0.999929 = 999.93 ft. The difference is 0.07 ft.

## When CSF matters

| Survey type | CSF significance |
|---|---|
| Boundary survey (ALTA/NSPS, lot survey) | Significant. Record distances in deeds are ground distances. If you compute a boundary from state plane coordinates without applying CSF, your distances will disagree with record distances. |
| PLSS section corner work | Significant. Original GLO distances were ground (chain) measurements. |
| Subdivision plat | Significant. Plat dimensions should state whether they are grid or ground. Indiana practice varies by county. |
| Construction staking | Moderate. Contractors measure on the ground. If plans are on grid, apply the conversion. |
| Topographic survey (small site) | Usually negligible. A 500 ft site has ~0.04 ft grid-to-ground difference. |
| Large corridor project (highway, pipeline) | Significant. Over miles, the accumulated difference is substantial. |

## Applying CSF in Civil 3D

Civil 3D stores coordinates as grid (state plane) values. To display or report ground distances:

1. **Drawing Settings > Units and Zone > Scale factor.** Enter 1/CSF (the reciprocal) here if you want the drawing to work in ground coordinates. This applies a single scale factor to the entire drawing.
2. **Point-by-point CSF.** For large projects where CSF varies across the site, a single factor is insufficient. Use a low-distortion projection instead.
3. **Labeling.** Civil 3D line and parcel labels report grid distances by default. To report ground distances, multiply by the inverse of CSF in the label expression, or set the drawing scale factor.

Always label the survey plat or plan with the scale factor used and whether distances are grid or ground.

## Related

- [State Plane Indiana quick reference](state-plane-indiana-quick-reference.md)
- [Setting Civil 3D coordinate system](setting-civil3d-cs.md)
- [Low-distortion projections](low-distortion-projections.md)
- [Datums and projections](datums-and-projections.md)
