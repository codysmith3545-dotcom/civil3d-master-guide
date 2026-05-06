---
title: "NSRS Modernization"
section: "field-and-boundary/coordinate-systems"
order: 60
visibility: public
tags: [nsrs, natrf2022, napgd2022, ngs, datum, modernization, indiana]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — New Datums"
    url: https://geodesy.noaa.gov/datums/newdatums/
    verified: 2026-05-06
  - title: "NOAA NGS — NSRS Modernization FAQ"
    url: https://geodesy.noaa.gov/datums/newdatums/FAQ.shtml
    verified: 2026-05-06
---

> **TL;DR**
> 1. NGS is replacing NAD83 and NAVD88 with new reference frames: NATRF2022 (horizontal) and NAPGD2022 (vertical). The rollout has been delayed multiple times (originally 2022, now projected for 2025 or later).
> 2. Key changes: coordinates will shift by 1 to 2 meters from NAD83(2011), a time-dependent component (intra-frame velocities) will account for plate motion, and NAPGD2022 will replace NAVD88 leveling-based heights with a purely geoid-model-based vertical datum.
> 3. Indiana practitioners should prepare by archiving current NAD83(2011) control coordinates, understanding that all existing state plane coordinate values will change, and planning for updated software and workflows.

## Background

The National Spatial Reference System (NSRS) is the foundational coordinate framework for the United States, maintained by the National Geodetic Survey (NGS). The current horizontal datum, NAD83, was established in 1986 and has been refined through adjustments (HARN, NSRS2007, 2011). The current vertical datum, NAVD88, is based on geodetic leveling from the 1988 adjustment.

Both datums have accumulated limitations:

- **NAD83** is misaligned with the International Terrestrial Reference Frame (ITRF) by approximately 2 meters and does not account for tectonic plate motion within the frame.
- **NAVD88** is based on a single tidal benchmark in Quebec and has accumulated systematic errors, particularly in areas far from the primary leveling network.

## What is changing

### NATRF2022 (North American Terrestrial Reference Frame of 2022)

- Replaces NAD83 as the horizontal datum.
- Aligned with ITRF at a specific reference epoch (2020.0).
- Includes **intra-frame velocity models** to account for ongoing plate motion, subsidence, and other crustal deformation. This means coordinates have a time dimension — a point's coordinates at epoch 2020.0 differ from its coordinates at epoch 2030.0 by the accumulated velocity.
- All existing NAD83 state plane coordinates will change by approximately 1 to 2 meters when converted to NATRF2022.
- New state plane coordinate system zones (SPCS2022) will be defined with updated parameters. Some states may get new zone boundaries; Indiana's zone configuration may change.

### NAPGD2022 (North American-Pacific Geopotential Datum of 2022)

- Replaces NAVD88 as the vertical datum.
- Based entirely on a geoid model rather than physical leveling. Elevations are derived from ellipsoid heights (from GNSS) minus the geoid separation (from the geoid model).
- Eliminates the systematic errors in NAVD88 that accumulate with distance from the primary leveling network.
- NAVD88 elevations in Indiana will change by an amount that varies geographically, potentially several centimeters.

## Timeline

NGS originally planned to release the new datums in 2022. The release has been postponed multiple times due to the complexity of developing the underlying models and tools. As of early 2026, NGS has not announced a firm release date. Practitioners should monitor the NGS website for updates.

The transition will not be instantaneous. NGS will provide transformation tools to convert between NAD83(2011)/NAVD88 and the new datums. A multi-year transition period is expected during which both systems will be in use.

## Impact on existing coordinates

### State plane coordinates

All state plane coordinates will change. A point with NAD83(2011) Indiana East Zone coordinates of N 1,800,000.00, E 300,000.00 will have different NATRF2022 state plane values. The magnitude of the shift is approximately 1 to 2 meters (3 to 7 ft) in both northing and easting.

This means:

- Recorded plat coordinates will refer to the NAD83 system.
- New surveys will use the NATRF2022 system.
- Software must support both systems.
- Control monuments will have two sets of published coordinates.

### Elevations

NAVD88 elevations will differ from NAPGD2022 elevations. The difference varies geographically. Existing benchmark elevations (NAVD88) will need a conversion to the new datum. Published values on datasheets will be updated.

### Intra-frame velocities

Because NATRF2022 includes a velocity component, coordinates at different epochs differ. For most of Indiana, the horizontal velocity is small (the stable interior of the North American plate moves at approximately 0 to 2 mm/year relative to the plate-fixed frame). Subsidence areas (if any) will have vertical velocities.

For boundary surveys and typical engineering work, the velocity component will be negligible over the life of a project. For geodetic control networks and long-duration monitoring, it will need to be considered.

## How to prepare

1. **Archive current NAD83(2011) coordinates** for all control monuments and project benchmarks. These will be needed for comparison and back-conversion.
2. **Document the datum** on all current deliverables. State "NAD83(2011)" explicitly, not just "NAD83."
3. **Monitor NGS announcements** for release dates, transformation tools, and updated software libraries.
4. **Budget for software updates.** Civil 3D, GNSS processing software, and GIS tools will all need coordinate system library updates.
5. **Plan for a transition period.** Both systems will be in use simultaneously. Projects started under NAD83 may need to continue in NAD83 or be converted midstream.
6. **Understand that old deeds will not change.** Recorded plat dimensions and legal descriptions reference NAD83 coordinates. These will remain valid records; the new datum does not invalidate old surveys.

## Indiana-specific considerations

- The Indiana Geographic Information Office (GIO) and INDOT will issue guidance on when and how to transition state systems to the new datums.
- County surveyor corner records that include NAD83 coordinates will need supplementary records or conversion notes.
- The CORS network in Indiana will publish new coordinates in NATRF2022 once the datums are released.

## Related

- [NAD83 vs. 2011 vs. WGS84](nad83-vs-2011-vs-wgs84.md)
- [Datums and projections](datums-and-projections.md)
- [Combined scale factor](combined-scale-factor.md)
- [Transforming coordinates](transforming-coordinates.md)
