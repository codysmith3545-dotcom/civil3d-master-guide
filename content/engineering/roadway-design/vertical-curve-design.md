---
title: "Vertical Curve Design"
section: "engineering/roadway-design"
order: 25
visibility: public
tags: [vertical-curve, k-value, crest-curve, sag-curve, profile-design, aashto]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateProfileLayout, EditProfileLayout, ProfileDesignCheck]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §3.4"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 44 (Vertical Alignment)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Vertical curves are parabolic; the controlling parameter is **K = L / A**, where L is curve length (ft) and A is the algebraic difference in grades (%). Larger K means a flatter, longer curve.
> 2. **Crest curves** are governed by stopping sight distance — minimum K ranges from 7 (20 mph) to 247 (70 mph) per AASHTO Table 3-34.
> 3. **Sag curves** are governed by headlight sight distance — minimum K ranges from 17 (20 mph) to 181 (70 mph) per AASHTO Table 3-36. Always check drainage at the low point.

## Vertical curve geometry

A vertical curve connects two grades (G1 and G2, in %) with a parabolic arc. Key elements:

- **A** — algebraic difference in grades: A = |G2 - G1|
- **L** — length of the vertical curve (ft), measured horizontally
- **K** — rate of curvature: K = L / A (ft per percent grade change)
- **PVC** — point of vertical curvature (beginning of curve)
- **PVI** — point of vertical intersection (where the tangent grades meet)
- **PVT** — point of vertical tangency (end of curve)
- **e** — external distance (vertical offset from PVI to the curve midpoint): e = (A × L) / 800

The elevation at any point on the curve is:

`y = PVC_elev + G1 × x + ((G2 - G1) / (2L)) × x²`

where x is the horizontal distance from the PVC and grades are in decimal form (percent / 100).

## Crest curve design

Crest curves must provide stopping sight distance (SSD). The driver's eye height is 3.5 ft; the object height is 2.0 ft. Minimum K values from AASHTO Table 3-34:

| Design speed (mph) | SSD (ft) | Min K (crest) |
|---|---|---|
| 20 | 115 | 7 |
| 25 | 155 | 12 |
| 30 | 200 | 19 |
| 35 | 250 | 29 |
| 40 | 305 | 44 |
| 45 | 360 | 61 |
| 50 | 425 | 84 |
| 55 | 495 | 114 |
| 60 | 570 | 151 |
| 65 | 645 | 193 |
| 70 | 730 | 247 |

Minimum curve length: L = K × A. Many agencies also enforce a minimum absolute length (e.g., 3V in feet where V is design speed in mph, or 200 ft minimum on arterials).

## Sag curve design

Sag curves are controlled by headlight illumination distance (nighttime SSD). The headlight height is 2.0 ft with a 1-degree upward divergence. Minimum K values from AASHTO Table 3-36:

| Design speed (mph) | SSD (ft) | Min K (sag) |
|---|---|---|
| 20 | 115 | 17 |
| 25 | 155 | 26 |
| 30 | 200 | 37 |
| 35 | 250 | 49 |
| 40 | 305 | 64 |
| 45 | 360 | 79 |
| 50 | 425 | 96 |
| 55 | 495 | 115 |
| 60 | 570 | 136 |
| 65 | 645 | 157 |
| 70 | 730 | 181 |

Sag curves also have comfort criteria (AASHTO recommends centripetal acceleration not exceeding 1 ft/s²) and overhead-structure clearance criteria.

## High and low point calculation

The high point on a crest curve (or low point on a sag) occurs where the tangent slope is zero:

`x_hp = -G1 × L / (G2 - G1)`

where G1 and G2 are in percent and x is measured from PVC in the same units as L. This point controls drainage inlet placement on sag curves and sight obstructions on crest curves.

## Drainage at sag curves

At the low point of a sag curve the longitudinal slope is zero, creating a natural collection point for surface water. Design requirements:

- Place an inlet at or near the computed low point.
- Avoid sag curves in cut sections where groundwater may compound surface drainage.
- Minimum grade on either side of the sag should be at least 0.3% within 50 ft of the low point (INDOT standard) to ensure water moves toward the inlet.
- Check spread calculations at the sag to confirm the ponded width stays within the allowable encroachment (typically half the travel lane for a 10-year storm).

## INDOT modifications

INDOT IDM Chapter 44 generally follows AASHTO minimums but adds:

- Minimum vertical curve length of 200 ft on state routes.
- Maximum grade of 5% on rural interstate, 6% on rural arterial, and up to 8% on rural collector/local roads (terrain-dependent).
- At signalized intersections, the approach grade within 200 ft of the stop bar should not exceed 3%.

## Civil 3D workflow

1. Create the profile layout with `CreateProfileLayout`.
2. Set design checks to flag K-values below the minimum for the design speed (Alignment Design Check → Vertical).
3. Civil 3D reports K-value, A, L, high/low point station, and PVI elevation in the profile properties.
4. Run `ProfileDesignCheck` to list violations before plan review.

## Related

- [Sight distance](sight-distance.md)
- [AASHTO design controls](aashto-design-controls.md)
- [Horizontal curve design](horizontal-curve-design.md)
- [Cross slope](cross-slope.md)
