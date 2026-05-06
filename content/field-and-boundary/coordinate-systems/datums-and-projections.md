---
title: "Datums, Projections, and the Geoid"
section: "field-and-boundary/coordinate-systems"
order: 20
visibility: public
tags: [datum, projection, geoid, nad83, wgs84, state-plane]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — Geodetic Datums"
    url: https://geodesy.noaa.gov/datums/
    verified: 2026-05-06
  - title: "NOAA NGS — State Plane Coordinate System"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-06
---

> **TL;DR**
> 1. A **datum** is a reference frame; a **projection** is a math function that flattens that frame to a plane; the **geoid** is the Earth-shaped surface that defines orthometric heights.
> 2. Surveyors in the United States today work mostly in **NAD83(2011)** for horizontal and **NAVD88** for vertical, projected to a **State Plane** zone for plan-view geometry.
> 3. NAD83 is North America-fixed; WGS84 is global and currently differs from NAD83 by roughly 1 to 2 meters depending on location and realization. They are not interchangeable for cadastral or engineering work.

## What each term means

**Datum.** A datum is the reference frame against which positions are measured. A horizontal datum defines the size and shape of the reference ellipsoid and how it is positioned and oriented relative to the Earth. A vertical datum defines the zero surface from which heights are measured. NAD83 is a horizontal datum; NAVD88 is a vertical datum. The geoid is the underlying physical surface on which a vertical datum is built.

**Projection.** A projection is a mathematical mapping from points on the curved ellipsoid to points on a flat plane. Projections are necessary because we work with paper plats and Cartesian coordinates. Every projection has distortion; the question is which kind. The State Plane Coordinate System (SPCS) uses **Transverse Mercator** (north-south zones, like Indiana) or **Lambert Conformal Conic** (east-west zones, like Pennsylvania) so that scale distortion is small in any one zone.

**Geoid.** The geoid is an equipotential surface of Earth's gravity field, roughly mean sea level. It is bumpy. Orthometric heights — the heights you care about for drainage — are heights above the geoid. Ellipsoid heights, what GNSS gives you directly, are heights above the reference ellipsoid. The two differ by the **geoid height**, often denoted N. See [geoid and heights](geoid-and-heights.md).

## Common datums

- **NAD83 (North American Datum of 1983).** The horizontal datum mandated for federal use in North America. NAD83 has been realized multiple times — NAD83(86), NAD83(HARN/HPGN), NAD83(NSRS2007), NAD83(2011) epoch 2010.0. Each realization adjusts coordinates by inches to centimeters. Indiana state plane is published in NAD83.
- **WGS84 (World Geodetic System 1984).** The global datum used by GPS as broadcast. It has its own series of realizations (G730, G873, G1150, G1674, G1762, G2139). At the centimeter level WGS84 and NAD83 differ across North America by 1 to 2 meters; the difference grows over time as plates move.
- **NAVD88 (North American Vertical Datum of 1988).** The current US vertical datum. Realized in cooperation with Canada and Mexico. NAVD88 is being replaced by **NAPGD2022**, which will use a gravity-based geoid (GRAV-D).
- **NSRS2022 (planned).** NGS plans to replace NAD83 and NAVD88 with a unified geometric reference frame (NATRF2022) and a geopotential reference frame (NAPGD2022). Until that goes live, current practice is NAD83(2011) and NAVD88.

## Indiana state plane

Indiana is split into two SPCS zones, both Transverse Mercator on NAD83:

- **Indiana East, FIPS 1301**, central meridian 85°40' W.
- **Indiana West, FIPS 1302**, central meridian 87°05' W.

Each zone has a defined scale at the central meridian (less than 1.0 by a small amount), false easting and northing values, and a latitude of origin. See the [state plane Indiana quick reference](state-plane-indiana-quick-reference.md) for the numbers.

The split is roughly along longitude 86°25' W. Counties straddle the line; choose by where the project sits, not by the county seat.

## When to choose what

- **Boundary, ALTA, plat work in Indiana.** State Plane, the appropriate Indiana zone, NAD83(2011). Bearings are grid; distances are typically ground (annotated with the combined scale factor).
- **Engineering site design.** Same projection as the boundary survey, so geometry agrees. Many sites work in a "ground" frame: state plane bearings with distances scaled to ground.
- **Linear projects spanning zones.** Pick the controlling zone in writing and document the convergence at project endpoints.
- **GIS and aerial collection.** WGS84 / Web Mercator is common for raw aerial data. Reproject into the project's working frame before using.

## Common pitfalls

- **Confusing datum with projection.** "NAD83" is a datum; "Indiana State Plane East" is a projection on that datum.
- **Mixing realizations.** NAD83(86) and NAD83(2011) coordinates differ by enough to show up on cadastral work. State the realization.
- **Treating WGS84 as NAD83.** They are not the same. A point taken from a phone GPS will not match a state plane published coordinate by 1 meter or more.
- **Using ellipsoid heights as elevations.** Civil 3D surfaces and pipe networks expect orthometric (NAVD88) heights. GNSS gives ellipsoid heights; convert using a current geoid model (Geoid18 today, until NAPGD2022).

## Related

- [State plane Indiana quick reference](state-plane-indiana-quick-reference.md)
- [NAD83 vs NAD83(2011) vs WGS84](nad83-vs-2011-vs-wgs84.md)
- [Geoid and heights](geoid-and-heights.md)
- [Combined scale factor](combined-scale-factor.md)
