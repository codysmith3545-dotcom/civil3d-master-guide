---
title: "AASHTO Horizontal Alignment Design"
section: standards/aashto
order: 23
visibility: public
tags: [aashto, horizontal-alignment, superelevation, side-friction, transition-curve, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 3"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Sec. 3.3 (Horizontal Alignment)"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. AASHTO Green Book Section 3.3 governs horizontal alignment: minimum radius, superelevation rate, side friction factor, transition (spiral) curves, and the relationship among them.
> 2. Minimum radius is derived from the point-mass equation `R_min = V^2 / (15 (e_max + f_max))`; the agency selects `e_max` (commonly 6 percent or 8 percent in the U.S., higher only in mountainous rural conditions) and uses Green Book `f` values.
> 3. Superelevation is distributed against radius using one of five AASHTO methods (Methods 1 through 5), with Method 5 the modern default for new design.

## What AASHTO says

Horizontal alignment is the sequence of straight tangents and circular curves (with optional spiral transitions) in plan view. The Green Book provides the policy for selecting curve radius, distributing superelevation, and connecting tangent to curve.

The point-mass model balances centripetal acceleration against the sum of pavement cross-slope (superelevation) and tire-pavement side friction. Side-friction factors used in the Green Book are well below the available friction at the friction threshold; they represent values at which a driver feels comfortable, not at which the vehicle skids. Tabulated `f` values therefore decrease with design speed.

For superelevation distribution, the 7th edition reaffirms five distribution methods. **Method 5** — the AASHTO recommended method for new design on rural highways and high-speed urban streets — distributes a higher proportion of the centripetal force to superelevation in the middle range of curvatures and uses lower side friction at any radius greater than the minimum. The Green Book tabulates the resulting `e` value for each `R` and design speed at each `e_max` (commonly the 4, 6, 8, 10, and 12 percent tables).

Transition curves (spirals) are not required by AASHTO for all curves but are recommended at higher speeds and tighter radii to provide a continuous change in lateral acceleration as the driver enters and exits the curve. The spiral length is selected to satisfy a minimum rate of change of centripetal acceleration and to fit the superelevation runoff length.

## Key formulas / variables

Variables: `V` design speed (mph); `R` radius (ft); `e` superelevation (decimal); `f` side friction factor (decimal); `L_s` spiral length (ft); `C` rate of change of centripetal acceleration (ft/s^3, AASHTO suggests 1 to 3).

- **Point mass:** `0.01 e + f = V^2 / (15 R)`.
- **Minimum radius:** `R_min = V^2 / (15 (e_max + f_max))`.
- **Superelevation runoff length (2-lane):** `L_r = (w n_1 e_d b_w) / Delta`, where `w` is lane width, `n_1` rotated lanes, `e_d` design superelevation, `b_w` adjustment factor, and `Delta` the maximum relative gradient (Green Book Table 3-15 in 7e).
- **Spiral length (comfort criterion):** `L_s = 3.15 V^3 / (R C)`.

## Common Civil 3D applications

- Apply AASHTO design checks to alignments. See [Alignment design criteria](../../civil3d/alignments/design-criteria.md) and [Horizontal alignment basics](../../civil3d/alignments/horizontal-alignment-basics.md).
- Drive superelevation with the AASHTO 2011 (or later) design criteria file shipped with Civil 3D; see [Superelevation](../../engineering/roadway-design/superelevation.md).
- Use [Horizontal curve design](../../engineering/roadway-design/horizontal-curve-design.md) for worked-example geometry.

## What this guide can't reproduce

The Green Book tables of `f` versus design speed, the superelevation distribution tables for `e_max = 4, 6, 8, 10, 12` percent (Tables 3-8 through 3-12 in 7e), the maximum relative gradient table, and the runoff-length adjustment factors are copyrighted. Pull from a licensed copy or from the controlling state design manual.

## Related Indiana standards

- INDOT Indiana Design Manual, Part 5 Chapter 43 sets `e_max = 8 percent` on rural and `e_max = 6 percent` on urban facilities (verify in current IDM). See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
