---
title: "State Plane Indiana — East and West Zones"
section: "jurisdictions/indiana/state"
order: 70
visibility: public
tags: [indiana, state-plane, nad83, coordinate-system]
updated: 2026-05-06
sources:
  - title: "NGS State Plane Coordinate System"
    url: https://geodesy.noaa.gov/INFO/SPCS/
    verified: 2026-05-06
  - title: "Indiana Geographic Information Office"
    url: https://www.in.gov/gis/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Indiana has two State Plane Coordinate System zones: **Indiana East (FIPS 1301)** and **Indiana West (FIPS 1302)**, both transverse Mercator projections on the NAD83 datum.
> 2. The zone boundary falls at approximately **86 degrees 15 minutes West longitude**. All 8 counties in this guide (Marion, Hamilton, Hancock, Shelby, Johnson, Morgan, Hendricks, Boone) fall in **Indiana East**.
> 3. The scale factor at the central meridian (k0) is **0.999966667** for both zones. The combined scale factor at any project site depends on the grid scale factor and the elevation factor — always compute it for the project location.

## Zone parameters

### Indiana East — FIPS 1301

| Parameter | Value |
|---|---|
| Projection | Transverse Mercator |
| Central meridian | 85 degrees 40 minutes West (-85.6667 degrees) |
| Latitude of origin | 37 degrees 30 minutes North (37.5 degrees) |
| Scale factor at central meridian (k0) | 0.999966667 |
| False easting | 100,000 m (NAD83) |
| False northing | 250,000 m (NAD83) |
| Units | Meters (or U.S. survey feet: 1 m = 3.280833333... ft) |

### Indiana West — FIPS 1302

| Parameter | Value |
|---|---|
| Projection | Transverse Mercator |
| Central meridian | 87 degrees 05 minutes West (-87.0833 degrees) |
| Latitude of origin | 37 degrees 30 minutes North (37.5 degrees) |
| Scale factor at central meridian (k0) | 0.999966667 |
| False easting | 900,000 m (NAD83) |
| False northing | 250,000 m (NAD83) |
| Units | Meters (or U.S. survey feet) |

## Zone boundary

The boundary between the East and West zones runs approximately along the 86 degrees 15 minutes West meridian, following county lines. Counties are wholly in one zone or the other — no county is split. The Indiana Geographic Information Office publishes the definitive county-to-zone assignment list.

## 8-county assignment

All 8 counties covered by this guide are in **Indiana East (FIPS 1301)**:

| County | Zone |
|---|---|
| Marion | East |
| Hamilton | East |
| Hancock | East |
| Shelby | East |
| Johnson | East |
| Morgan | East |
| Hendricks | East |
| Boone | East |

Some western Indiana counties (e.g., Vigo, Clay, Sullivan, Parke) are in Indiana West. If a project straddles the zone boundary, choose one zone and note the selection in the project metadata. Do not mix zones on a single plan set.

## NAD83 realizations

Indiana State Plane coordinates are defined on the NAD83 datum. Several realizations exist:

- **NAD83 (original, 1986)** — the initial adjustment. Still referenced in older surveys and plats.
- **NAD83(HARN)** — High Accuracy Reference Network adjustment (mid-1990s). Some Indiana CORS and control monuments were published in this realization.
- **NAD83(2011)** — the current national adjustment, epoch 2010.0. This is the realization that should be used for new survey work and is the basis for current NGS-published coordinates on Indiana CORS stations.

When citing coordinates, always state the realization (e.g., "NAD83(2011), Indiana East Zone, U.S. survey feet"). Differences between NAD83 (original) and NAD83(2011) in Indiana are on the order of 0.5 to 1.0 meter — large enough to matter for boundary work.

## Combined scale factor

Grid coordinates differ from ground distances by a scale factor that varies with location. The combined scale factor (CSF) at a point is:

**CSF = grid scale factor x elevation factor**

- The **grid scale factor** depends on the distance from the central meridian. At the central meridian it equals k0 (0.999966667). It increases away from the central meridian.
- The **elevation factor** accounts for the project's height above the ellipsoid: elevation factor = R / (R + h), where R is the mean radius of the earth (~6,371,000 m or ~20,902,000 ft) and h is the ellipsoid height at the project site.

For the 8-county area, typical combined scale factors range from approximately 0.99993 to 0.99998 (ground distances are slightly longer than grid distances). At a CSF of 0.99995, a 1,000.00-foot ground distance corresponds to a 999.95-foot grid distance — a difference of 0.05 feet (15 mm) per 1,000 feet.

For ALTA surveys and boundary work, state whether coordinates and distances are "grid" or "ground" and cite the CSF used.

## Civil 3D settings

In Civil 3D, set the coordinate system in Drawing Settings > Units and Zone:

- **Zone:** IN83-EF (Indiana East, U.S. Survey Feet) or IN83-E (Indiana East, Meters).
- Assign the coordinate system before importing field data so that transformations are computed correctly.
- If working on a ground-coordinate project, apply a user-defined coordinate system with a modified scale factor, or apply the CSF manually during stakeout.

## Related

- [State of Indiana overview](index.md)
- [Coordinate systems](../../../field-and-boundary/coordinate-systems/index.md)
- [Indiana surveyor licensure pathway](surveyor-licensure-pathway.md)
