---
title: "Horizontal Curve Design"
section: "engineering/roadway-design"
order: 20
visibility: public
tags: [horizontal-curve, superelevation, side-friction, compound-curve, reverse-curve, aashto]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateAlignment, EditAlignmentGeometry, AlignmentDesignChecks]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §3.3"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 43 (Horizontal Alignment)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Minimum radius is governed by `R = V^2 / (15(e + f))` where V is design speed (mph), e is superelevation rate (ft/ft), and f is side friction factor from AASHTO Table 3-7.
> 2. Every circular curve is defined by five elements: **T** (tangent length), **L** (curve length), **M** (middle ordinate), **E** (external distance), and **LC** (long chord). Given any two of R, D, delta, the rest follow.
> 3. Use **spirals** on high-speed roads (typically above 45 mph) to transition curvature gradually. INDOT requires spirals on all state routes with design speed 50 mph and above.

## Point-of-curvature equation

The fundamental relationship between speed, radius, superelevation, and friction:

```
R_min = V^2 / (15 (e_max + f_max))
```

Where:
- `R_min` = minimum radius (ft)
- `V` = design speed (mph)
- `e_max` = maximum superelevation rate (ft/ft)
- `f_max` = maximum side friction factor (dimensionless)

AASHTO Table 3-7 provides f_max values by design speed. Representative values (these are from the AASHTO Green Book; the full table is licensed):

| Design speed (mph) | f_max | R_min at e=0.06 | R_min at e=0.08 |
|---|---|---|---|
| 25 | 0.32 | 109 ft | 98 ft |
| 30 | 0.28 | 154 ft | 138 ft |
| 35 | 0.25 | 214 ft | 193 ft |
| 40 | 0.22 | 292 ft | 264 ft |
| 45 | 0.19 | 394 ft | 358 ft |
| 50 | 0.16 | 526 ft | 480 ft |
| 55 | 0.15 | 643 ft | 587 ft |
| 60 | 0.14 | 783 ft | 716 ft |
| 65 | 0.13 | 951 ft | 872 ft |
| 70 | 0.12 | 1,148 ft | 1,056 ft |

These are approximate — always refer to the edition of the Green Book your jurisdiction adopts.

## Circular curve elements

Given a curve with radius R and central (delta) angle Δ:

| Element | Symbol | Formula |
|---|---|---|
| Tangent length | T | `R tan(Δ/2)` |
| Curve length | L | `R Δ (π/180)` (Δ in degrees) |
| Long chord | LC | `2R sin(Δ/2)` |
| Middle ordinate | M | `R (1 - cos(Δ/2))` |
| External distance | E | `R (sec(Δ/2) - 1)` |
| Degree of curve (arc def) | D | `5729.578 / R` |

In Civil 3D, these are computed automatically when you define an alignment curve by any two constraints (e.g., radius + through point, or radius + tangent length). The `AlignmentDesignChecks` feature will flag curves that violate the design criteria file for the assigned design speed.

## Compound curves

A compound curve has two or more consecutive circular arcs curving in the same direction with different radii. AASHTO permits compound curves when the ratio of the larger radius to the smaller radius does not exceed approximately 1.5:1 (2:1 absolute maximum per Green Book). Compound curves are common at ramp terminals and intersections.

In Civil 3D, create a compound curve by placing two arcs end-to-end in the alignment layout. No spiral is needed at the common tangent point if the radius ratio is modest.

## Reverse curves

A reverse curve has two arcs curving in opposite directions. A tangent section between the arcs is required to accommodate superelevation transition. The minimum tangent length between curves depends on the superelevation runoff length for each curve. AASHTO recommends a tangent at least equal to the sum of the two runoff lengths.

On low-speed local streets (design speed 30 mph or below), short reverse curves without a tangent section are sometimes permitted, but only where superelevation is not applied (normal crown throughout).

## Spirals

A spiral (Euler spiral / clothoid) provides a linear increase in curvature from zero (tangent) to 1/R (circular arc). Spirals improve driver comfort, aesthetics, and superelevation transition. The minimum spiral length:

```
L_s = 3.15 V^3 / (R C)
```

Where C is the rate of increase of centripetal acceleration, typically 1 to 3 ft/s^3 (AASHTO recommends C = 1.2 ft/s^3 for comfort).

INDOT requires spirals on all curves where design speed is 50 mph or above. Below 50 mph, spirals are optional but recommended for curves with superelevation above 4%.

In Civil 3D, add spirals in the alignment layout by selecting a spiral-curve-spiral (SCS) or compound spiral entity. The design criteria file will report errors if the spiral length is below the minimum for the assigned design speed.

## Design criteria files in Civil 3D

Civil 3D ships with AASHTO design criteria files (`.xml`) that encode minimum radius, maximum degree of curve, and minimum spiral length by design speed. To use them:

1. Assign a design speed to the alignment via `Alignment Properties > Design Criteria`.
2. Select the appropriate criteria file (e.g., `AASHTO 2011 US Customary.xml`).
3. Run `AlignmentDesignChecks` or view violations in the alignment vista.

Violations appear as warning icons on the alignment and in the Panorama vista. They do not prevent the geometry from being created — they are advisory.

## Related

- [Sight distance](sight-distance.md)
- [Superelevation](superelevation.md)
- [Vertical curve design](vertical-curve-design.md)
- [AASHTO design controls](aashto-design-controls.md)
- [Cross slope](cross-slope.md)
