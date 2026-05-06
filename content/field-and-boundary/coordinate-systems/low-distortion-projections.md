---
title: "Low-Distortion Projections"
section: "field-and-boundary/coordinate-systems"
order: 50
visibility: public
tags: [low-distortion-projection, ldp, grid-to-ground, custom-projection, state-plane]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — Low Distortion Projections"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-06
---

> **TL;DR**
> 1. A low-distortion projection (LDP) is a custom map projection designed so that grid distances equal ground distances within a defined project area — eliminating the need for a combined scale factor correction.
> 2. Use an LDP when the project area is large enough that state plane distortion exceeds the survey's distance tolerance (typically > 1:50,000 or roughly 0.02 ft/1,000 ft) and when multiple disciplines need to share a single coordinate system without grid/ground confusion.
> 3. Civil 3D supports custom coordinate systems. The LDP is defined by projection parameters (central meridian, latitude of origin, scale factor, false easting/northing) and saved as a custom coordinate system definition.

## Why use an LDP

State plane coordinate systems are designed to keep grid-to-ground distortion below approximately 1:10,000 across the entire zone. In practice, distortion varies within the zone:

- Near the central meridian and at typical Indiana elevations, the combined scale factor may be 0.99993 to 0.99997.
- At the zone edges and at higher elevations, distortion increases.

For many boundary surveys and site projects, the distortion is manageable — apply a single CSF and note it on the plat. But for large projects (corridors, airports, military installations, large campuses), the distortion varies enough across the site that a single CSF does not work, and applying point-by-point corrections is error-prone.

An LDP solves this by centering a custom projection on the project area and setting its parameters so that the scale factor equals 1.0 at the project's representative elevation. Grid distances on the LDP equal ground distances within the project area, typically to better than 1:100,000.

## When to consider an LDP

- The project area exceeds 5 to 10 miles in extent.
- Multiple disciplines (survey, civil design, geotechnical, construction) must share coordinates and distances.
- The combined scale factor on state plane differs from 1.0 by more than the project's distance tolerance.
- The project will last years, and coordinate consistency is critical (e.g., airport, military base, utility district).

For small projects (a few hundred acres or less), the overhead of defining and maintaining a custom projection is usually not justified. Use state plane with a disclosed CSF.

## Designing an LDP

An LDP is typically a Transverse Mercator or Lambert Conformal Conic projection with parameters chosen to minimize distortion over the project area:

### Key parameters

- **Central meridian (or standard parallel):** Set to pass through or near the center of the project area.
- **Latitude of origin:** The latitude at the center of the project area.
- **Scale factor at the central meridian (k0):** Adjusted so that when combined with the elevation factor at the project's representative elevation, the combined scale factor equals 1.0.
- **False easting and false northing:** Chosen to avoid negative coordinates and to distinguish LDP coordinates from state plane coordinates. A common practice is to add an offset that makes LDP coordinates obviously different from state plane values (e.g., false easting of 100,000 m when state plane uses millions of feet).

### Calculating k0

```
k0 = 1 / EF = (R + h) / R
```

Where h is the representative ellipsoid height of the project area and R is the mean radius of the earth at the project latitude. For a site at 700 ft (~213 m) ellipsoid height:

```
k0 = (6,372,000 + 213) / 6,372,000 = 1.0000334
```

This ensures that at the project elevation, grid distance = ground distance.

## Implementing in Civil 3D

Civil 3D uses the Autodesk Coordinate System Library, which supports custom coordinate system definitions:

1. **Define the projection.** Create a coordinate system definition file (.csf or modify the library) with the LDP parameters. This requires editing the coordinate system library using the Autodesk Coordinate System Library tools or by manually creating a definition.
2. **Assign to the drawing.** In Drawing Settings > Units and Zone, select the custom coordinate system.
3. **Distribute the definition.** Every user and every software package that touches the project data must have the same custom coordinate system definition installed.

The distribution requirement is the biggest practical hurdle with LDPs. Every subconsultant, contractor, and agency that receives project files must install the custom definition or their software will not recognize the coordinate system.

## Alternatives

- **State plane with a single CSF.** Simpler, universally recognized, and adequate for most projects. The CSF is disclosed on all deliverables.
- **Ground coordinate system.** Some offices create a "ground" coordinate system by applying a single scale factor to state plane coordinates. This is simpler than an LDP but does not account for CSF variation across the project area.
- **NSRS Modernization.** The upcoming modernized NSRS may include provisions for ground-level coordinate systems that reduce the need for custom LDPs.

## Related

- [Combined scale factor](combined-scale-factor.md)
- [State Plane Indiana quick reference](state-plane-indiana-quick-reference.md)
- [Setting Civil 3D coordinate system](setting-civil3d-cs.md)
- [NSRS Modernization](nsrs-modernization.md)
