---
title: "Level Networks"
section: "field-and-boundary/control-networks"
order: 40
visibility: public
tags: [leveling, benchmark, level-network, adjustment]
updated: 2026-05-06
sources:
  - title: "FGDC — Standards and Specifications for Geodetic Control Networks"
    url: https://www.fgdc.gov/standards
    verified: 2026-05-06
  - title: "NGS — NAVD88 Benchmark Data Sheets"
    url: https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl
    verified: 2026-05-06
  - title: "Wolf & Ghilani — Elementary Surveying, 16th ed."
    url: https://www.pearson.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Differential leveling** is the most accurate method for determining elevations. A properly run level network with least-squares adjustment delivers vertical accuracy of a few millimeters over distances of several kilometers.
> 2. **Close every level circuit** as a loop or between two known benchmarks. Allowable misclosure: 12 mm * sqrt(K) for third-order, 6 mm * sqrt(K) for second-order, where K is distance in kilometers.
> 3. **NAVD88 benchmarks** are the vertical datum reference in the U.S. Find them through NGS data sheets, but verify recovery status in the field before relying on published elevations.
> 4. GPS-derived elevations depend on the **geoid model** and are typically 0.02-0.05 ft less accurate than differential leveling for vertical control.

## Double-run leveling

Double-run leveling is the standard procedure for precise level networks. Each section (the level line between two benchmarks or turning points) is run twice: once forward and once backward.

### Procedure

1. Run the level circuit from BM-A to BM-B (forward run). Record all BS and FS readings.
2. Run the circuit from BM-B back to BM-A (backward run), ideally on a different day or at a different time (to change refraction conditions).
3. Compute the elevation difference for each run. The two runs should agree within the allowable section misclosure.
4. Mean the forward and backward elevation differences for the adjusted section value.

### Section misclosure

For a section of length d (km):

| Order | Allowable section misclosure (forward - backward) |
|---|---|
| Second-order Class I | 6 mm * sqrt(d) |
| Second-order Class II | 8 mm * sqrt(d) |
| Third-order | 12 mm * sqrt(d) |

If the section misclosure exceeds the tolerance, re-run the section.

## Loop closures

A level loop starts and ends at the same benchmark (or connects two benchmarks of known elevation). The loop closure is:

```
Misclosure = Sum of observed elevation differences around the loop
           = Observed elevation of closing BM - Known elevation of closing BM
```

For a loop of perimeter K (km):

| Order | Allowable loop misclosure |
|---|---|
| Second-order Class I | 6 mm * sqrt(K) |
| Second-order Class II | 8 mm * sqrt(K) |
| Third-order | 12 mm * sqrt(K) |

### Example

A third-order level loop has a total perimeter of 4 km (K = 4). Allowable misclosure = 12 * sqrt(4) = 24 mm (0.079 ft). If the observed misclosure is 0.065 ft, the loop is within tolerance.

## Adjustment methods

### Proportional distribution

For a single loop with no redundancy beyond the closure, distribute the misclosure proportionally to distance:

```
Correction at point i = -misclosure * (cumulative_distance_to_i / total_loop_distance)
```

This is the leveling equivalent of the compass rule. It is adequate for single loops but does not produce accuracy estimates.

### Least-squares adjustment

For networks with multiple loops, multiple benchmarks, and redundant sections, least-squares adjustment is the correct method. Each section's observed elevation difference is an observation; each unknown point's elevation is an unknown. The weights are based on the section length (longer sections get lower weights because they accumulate more error):

```
Weight = 1 / section_length_km
```

Or more precisely, weight = 1 / sigma^2, where sigma = allowable_misclosure_per_km * sqrt(section_length).

The least-squares adjustment produces:

- Adjusted elevations for all unknown points.
- Standard deviations of the adjusted elevations.
- Residuals for each section, enabling blunder detection.
- Variance factor for overall network quality assessment.

## NAVD88 benchmarks

The North American Vertical Datum of 1988 (NAVD88) is the current vertical datum for the contiguous United States. It is based on a minimum-constraint least-squares adjustment of leveling observations, held fixed to the tide gauge at Father Point/Rimouski, Quebec.

### Finding benchmarks in Indiana

1. Go to the NGS Datasheet retrieval tool at [ngs.noaa.gov/cgi-bin/ds_mark.prl](https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl).
2. Search by county, radial distance from a coordinate, or PID (permanent identifier).
3. Filter for marks with NAVD88 orthometric height. Look for marks with first- or second-order vertical accuracy.
4. Check the **recovery date** and **condition**. A mark last recovered in 1995 may have been destroyed. Prefer marks recovered within the last 10 years.
5. **Physically recover the mark** before relying on it. Verify the stamping matches the datasheet description.

### Common benchmark types in Indiana

- **Brass disk** set in concrete post, bridge abutment, or building foundation. Most stable.
- **Chiseled square** on concrete or stone. Durable but sometimes hard to identify.
- **Rod mark** (stainless steel rod driven to refusal). Common for INDOT project control.

## Level network vs GPS-derived heights

GNSS receivers measure **ellipsoid heights** (height above the GRS80/WGS84 ellipsoid). To get an orthometric elevation (NAVD88), you must apply a **geoid separation** (N):

```
Orthometric elevation (H) = Ellipsoid height (h) - Geoid separation (N)
```

The geoid model (currently GEOID18 for CONUS) introduces uncertainty. Typical accuracy of the geoid model:

- **In well-surveyed areas:** 1-2 cm (0.03-0.07 ft).
- **In areas with sparse leveling data:** 2-5 cm (0.07-0.16 ft).

This means a GNSS-derived orthometric elevation has an inherent uncertainty of 0.03-0.16 ft from the geoid model alone, on top of the GNSS observation error. For projects requiring vertical accuracy better than 0.05 ft (e.g., 0.5 ft contour topo, precise grading, utility inverts), differential leveling from published NAVD88 benchmarks is more reliable than GNSS-derived elevations.

### When GPS-derived elevations are acceptable

- Topographic surveys with 1 ft or 2 ft contour intervals (vertical accuracy requirement 0.15-0.3 ft).
- Preliminary site grading where elevations will be refined during construction.
- Remote areas where benchmarks are far away and running a level circuit is impractical.

### When differential leveling is preferred

- Surveys with contour intervals of 0.5 ft or less.
- Utility invert elevations (accuracy requirement typically 0.01-0.02 ft).
- Foundation and footing elevations.
- Floodplain studies where BFE accuracy matters.
- High-order control networks.

## Related

- [Auto levels and digital levels](../survey-equipment/auto-levels-and-digital-levels.md)
- [Least-squares concepts](least-squares-concepts.md)
- [Accuracy standards](accuracy-standards.md)
- [GNSS static](gnss-static.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
