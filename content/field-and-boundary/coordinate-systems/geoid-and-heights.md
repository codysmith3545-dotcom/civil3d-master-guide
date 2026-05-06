---
title: "Geoid and Heights"
section: "field-and-boundary/coordinate-systems"
order: 50
visibility: public
tags: [geoid, geoid18, navd88, ellipsoid-height, orthometric, gnss]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — Geoid Models"
    url: https://geodesy.noaa.gov/GEOID/
    verified: 2026-05-06
  - title: "NOAA NGS — GRAV-D Project"
    url: https://geodesy.noaa.gov/GRAV-D/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Ellipsoid height (h)** is the height above the reference ellipsoid (what GNSS gives you). **Orthometric height (H)** is height above the geoid (what your engineering work needs). They differ by the geoid height **N**: H ≈ h − N.
> 2. The current US geoid model is **Geoid18**, which goes with NAVD88 and NAD83(2011). Use it to convert ellipsoid heights to NAVD88 elevations.
> 3. **GRAV-D** is the gravity-survey program backing the upcoming **NAPGD2022** vertical datum, which will replace NAVD88 with a gravity-defined geoid (no more passive tidal benchmarks).

## Why two kinds of height

A GNSS receiver computes a position relative to a mathematical ellipsoid. The ellipsoid is a smooth, regular surface — it is not the shape water settles on. Drainage, sewer, and surface design care about which way water runs, and water runs along an equipotential of gravity. That equipotential is the **geoid**.

The geoid is bumpy. In the contiguous U.S., the geoid sits roughly 22 to 35 meters **below** the GRS80 ellipsoid, with regional variation. Subtracting the geoid height from the ellipsoid height gives the orthometric height — the height that drains correctly.

The relation:

H = h − N

where:

- **H** is the orthometric height (NAVD88 in current US practice).
- **h** is the ellipsoid height (from GNSS, on the same datum's ellipsoid).
- **N** is the geoid height at that point, from the geoid model.

For Indiana, N is roughly −33 to −35 meters: the geoid is below the ellipsoid, so a 220-meter ellipsoid height yields an orthometric elevation of roughly 253 to 255 meters — which is sensible for central Indiana (around 800 to 850 feet above NAVD88 zero).

## Geoid18

Geoid18 is the NGS-published hybrid geoid model that ties NAD83(2011) ellipsoid heights to NAVD88 orthometric heights for the conterminous United States, Puerto Rico, and the Virgin Islands. It superseded Geoid12B in 2019. "Hybrid" means the model is fit to passive bench marks so that values agree with leveled NAVD88 elevations, not to a pure gravity geoid.

Geoid18 is the right model when:

- Your GNSS observations are in NAD83(2011).
- Your project elevation datum is NAVD88.
- You want orthometric heights from GNSS.

Older geoid models (Geoid03, Geoid09, Geoid12, Geoid12A, Geoid12B) are not interchangeable with Geoid18 at the centimeter level. State the geoid model in your project metadata.

## NAVD88 and the GRAV-D program

NAVD88 was the result of a continent-scale leveling adjustment finalized in 1991. It is referenced to a single tidal benchmark at Father Point/Rimouski, Quebec. Over time NAVD88 has been found to be biased by tens of centimeters across the US, with that bias varying geographically.

NGS has been running the **Gravity for the Redefinition of the American Vertical Datum (GRAV-D)** project: airborne and surface gravity surveys that, together with geodetic GNSS, will define a new gravity-based geoid. The result is **NAPGD2022**, the new geopotential reference frame, replacing NAVD88. Surveyors will need to:

- Re-derive published elevations on private benchmarks.
- Update CAD templates and field-collector profiles.
- Re-train staff on geoid model changes.

A grace period and conversion tools (much like NCAT today) are planned. Until NAPGD2022 goes live, NAVD88 + Geoid18 is current practice.

## Practical guidance

- **Always run a GNSS solution with a published geoid model.** Do not "back into" an orthometric height by assuming a constant N for the project area.
- **Tie to a leveled benchmark when accuracy demands it.** A GNSS-only orthometric is good to a few centimeters; classical leveling to a recovered NAVD88 benchmark is better when subgrade tolerances are tight.
- **Note the geoid model on the survey.** "Elevations are NAVD88, derived from GNSS observations using NGS Geoid18." Future surveyors will thank you.
- **Watch units.** Ellipsoid heights from GNSS are typically in meters; project elevations may be in feet. Convert with the foot definition appropriate to the project (U.S. Survey vs International).

## Common pitfalls

- Using a global geoid model (EGM2008, EGM96) when a NGS hybrid geoid is what your project requires.
- Mixing Geoid12B and Geoid18 results across phases of the same project.
- Reporting ellipsoid heights as "elevations." They are not elevations in any engineering sense.
- Assuming N is constant across a long linear project. It varies; sample several points.

## Related

- [Datums and projections](datums-and-projections.md)
- [NAD83 vs NAD83(2011) vs WGS84](nad83-vs-2011-vs-wgs84.md)
- [Combined scale factor](combined-scale-factor.md)
