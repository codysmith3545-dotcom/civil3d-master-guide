---
title: "State Plane Indiana Quick Reference"
section: "field-and-boundary/coordinate-systems"
order: 30
visibility: public
tags: [state-plane, indiana, fips-1301, fips-1302, transverse-mercator, nad83]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — State Plane Coordinate System Defining Parameters"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-06
  - title: "NOAA NGS — Indiana SPCS"
    url: https://geodesy.noaa.gov/library/pdfs/NOS_NGS_0005.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. Indiana has two State Plane zones: **East (FIPS 1301)** and **West (FIPS 1302)**, both Transverse Mercator on NAD83.
> 2. East central meridian is **85°40' W**; West central meridian is **87°05' W**. Both zones use latitude of origin **37°30' N**, scale at central meridian **1 / 30,000 less than unity (0.99996667)**, false easting **328,083.3333 ft (100,000 m)**, false northing **820,208.3333 ft (250,000 m)** in the U.S. Survey Foot system on NAD83.
> 3. Marion County is **East**. Hamilton, Hancock, Madison, and Shelby are East. Hendricks, Boone, Morgan, and Johnson are **West**. Choose by project location, not by county seat — counties near the zone boundary straddle it.

## Defining parameters (NAD83)

Both Indiana SPCS zones share most parameters; only the central meridian and the false easting differ between sources of varying age, so verify against current NGS publications before applying. The widely-used values:

| Parameter | Indiana East (FIPS 1301) | Indiana West (FIPS 1302) |
|---|---|---|
| Projection | Transverse Mercator | Transverse Mercator |
| Datum | NAD83 | NAD83 |
| Latitude of origin | 37°30' N | 37°30' N |
| Central meridian | 85°40' W | 87°05' W |
| Scale on central meridian | 0.99996667 (1:30,000 below unity) | 0.99996667 |
| False easting | 100,000 m (328,083.3333 ft) | 900,000 m (2,952,750.0000 ft) |
| False northing | 250,000 m (820,208.3333 ft) | 250,000 m (820,208.3333 ft) |

Indiana, like most states, uses the **U.S. Survey Foot** for SPCS in NAD83 published values, except where state law has converted to International Foot. Indiana state law specifies the U.S. Survey Foot for SPCS as of this writing; verify the current Indiana statutory citation before delivering. The two foot definitions differ by 2 ppm — which is small but measurable on long lines.

## Realizations

The relevant realizations are:

- **NAD83(86)** — original adjustment, late 1980s. Largely superseded for new work.
- **NAD83(HARN)** — High Accuracy Reference Network, mid-1990s.
- **NAD83(NSRS2007)** — National Spatial Reference System adjustment, 2007.
- **NAD83(2011) epoch 2010.0** — current. Most modern Indiana work is in this realization.

Successor frames under NSRS2022 (NATRF2022, NAPGD2022) are scheduled to replace NAD83(2011) and NAVD88; until they go live, NAD83(2011) is current practice.

## Marion plus seven surrounding counties

For the Indianapolis metropolitan area:

| County | Zone | FIPS | Notes |
|---|---|---|---|
| **Marion** | East | 1301 | Indianapolis sits east of the zone boundary |
| **Hamilton** | East | 1301 | Carmel, Fishers, Noblesville, Westfield |
| **Hancock** | East | 1301 | Greenfield, Fortville |
| **Madison** | East | 1301 | Anderson, Pendleton |
| **Shelby** | East | 1301 | Shelbyville |
| **Hendricks** | West | 1302 | Plainfield, Avon, Brownsburg, Danville |
| **Boone** | West | 1302 | Lebanon, Zionsville (the eastern part of Boone is near the zone line; verify on long projects) |
| **Morgan** | West | 1302 | Mooresville, Martinsville |
| **Johnson** | West | 1302 | Greenwood, Franklin, Bargersville |

Note that Boone County is split close to the zone boundary; eastern Boone (around Whitestown) is within a couple of miles of the zone line. For projects that span multiple zones the surveyor must declare which zone is the project zone and document the convergence.

## Setting Civil 3D

In Civil 3D, set the working zone via `EditDrawingSettings` → Units & Zone. The string identifiers used by the AutoCAD coordinate system database are typically:

- `IN83-EF` — Indiana East, NAD83, U.S. Foot
- `IN83-WF` — Indiana West, NAD83, U.S. Foot
- `IN83-2011-EF` and `IN83-2011-WF` — same with NAD83(2011) realization, where supported by the version installed
- `IN83-EIF` / `IN83-WIF` — International Foot variants (rarely correct in Indiana)

Verify the realization Civil 3D applies — older Civil 3D versions may default to NAD83(86) when "IN83-EF" is selected. See [setting Civil 3D coordinate system](setting-civil3d-cs.md).

## Common pitfalls

- Picking International Foot in Civil 3D when the project is in U.S. Survey Foot. Distances differ by 2 ppm — about 0.06 ft per mile — which closes a single project but breaks ties to control.
- Treating "Indiana State Plane" as one thing without naming the zone.
- Using the zone of the county seat when the project is on the other side of the zone boundary.
- Forgetting that scale at the central meridian is **less than** unity (0.99996667). Lines on or near the central meridian are shortened on grid by about 33 ppm.

## Related

- [Datums and projections](datums-and-projections.md)
- [Combined scale factor](combined-scale-factor.md)
- [Setting Civil 3D coordinate system](setting-civil3d-cs.md)
- [NAD83 vs NAD83(2011) vs WGS84](nad83-vs-2011-vs-wgs84.md)
