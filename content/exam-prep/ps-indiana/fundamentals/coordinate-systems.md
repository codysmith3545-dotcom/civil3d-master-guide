---
title: "Coordinate Systems"
section: "exam-prep/ps-indiana/fundamentals"
order: 30
visibility: public
tags: [exam-prep, coordinate-systems, state-plane, datum]
updated: 2026-05-11
sources:
  - title: "NGS coordinate systems overview"
    url: https://www.ngs.noaa.gov/datums/index.shtml
    verified: 2026-05-11
---

> **TL;DR**
> 1. A coordinate system is defined by a datum (e.g. NAD83(2011) horizontal, NAVD88 vertical), a projection (e.g. Lambert Conformal Conic for Indiana State Plane), and units.
> 2. Indiana has two State Plane zones: East (FIPS 1301) and West (FIPS 1302), both Lambert Conformal Conic on NAD83.
> 3. Grid distances and bearings are not equal to ground distances and astronomic bearings. Convergence (angle from grid north to true north) and combined scale factor (CSF) reconcile them.
> 4. Geoid models (Geoid18 in the contiguous US) convert ellipsoid heights (from GNSS) to orthometric heights (NAVD88).

## Datum vs projection vs grid

- **Horizontal datum.** Defines the ellipsoid and orientation. NAD83 with its realizations (NAD83(2011), NAD83(2007), NAD83(1986)) is the current US standard; WGS84 is the GPS native datum but is essentially coincident with NAD83 at the meter level for most practical work.
- **Projection.** A mathematical mapping from the ellipsoid to a plane. State Plane zones use either Lambert Conformal Conic (east-west zones, like Indiana) or Transverse Mercator (north-south zones).
- **Grid.** The plane-coordinate output of the projection: northings and eastings in survey feet (Indiana defaults to US Survey Feet for State Plane).

## Combined scale factor

For a project location, CSF = (grid scale factor at that latitude) * (elevation factor). The elevation factor accounts for the project's mean elevation above the ellipsoid. Ground distance to grid distance: multiply by CSF. Grid distance to ground distance: divide by CSF.

## Convergence

The angle between grid north and astronomic (true) north at a point. East of the projection's central meridian, grid north points east of true north; west of the central meridian, grid north points west of true north. Convergence can be a few degrees in wide State Plane zones; Indiana's relatively narrow zones keep typical convergence under about 1 degree.

## Indiana specifics

- **Indiana East zone (FIPS 1301).** Covers the eastern half of the state, including Marion, Hamilton, Hancock, Shelby, Johnson, and Boone counties. Central meridian 85 deg 40 min 00 sec W.
- **Indiana West zone (FIPS 1302).** Covers the western half, including Hendricks and Morgan counties.
- Both zones use Lambert Conformal Conic on NAD83.

## Vertical datum

- **NAVD88** is the current US orthometric datum.
- **NGVD29** is the older datum. Indiana NAVD88-minus-NGVD29 shifts vary by location; Geoid models account for this.
- GNSS yields ellipsoid heights. Convert to NAVD88 by subtracting the geoid height (from Geoid18 in the contiguous US).

## See also

- [Indiana State Plane (Calculator)](/tools/state-plane-indiana)
- [Grid-to-ground (Calculator)](/tools/grid-to-ground)
