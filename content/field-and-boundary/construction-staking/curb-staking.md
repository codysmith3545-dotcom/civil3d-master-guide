---
title: "Curb Staking"
section: "field-and-boundary/construction-staking"
order: 20
visibility: public
tags: [construction-staking, curb, gutter, flow-line, curb-return, ada-ramp, offsets]
updated: 2026-05-06
---

> **TL;DR**
> 1. Stake curb at **25 to 50 ft intervals** along tangent sections, tightening to **10 to 15 ft on curves** and at every PC, PT, and PCC — the contractor needs enough stakes to hold a string line.
> 2. Set offset stakes at a consistent distance (commonly **5 ft or 10 ft back of curb**) with the cut or fill to the **flow line elevation**, since flow line controls drainage.
> 3. Always stake **curb returns** (intersection radii) and **ADA ramp landings** as separate features with their own offsets and grade references — these are the most scrutinized elements at final inspection.

## Reference line: back of curb vs. flow line

Design plans may dimension to back of curb, face of curb, or flow line (gutter). Clarify with the engineer which line is the design reference. In most Indiana municipal work, the **flow line** (bottom of gutter pan) is the controlling elevation because it determines drainage. The back-of-curb position is derived from the flow line plus the curb cross section (rise, width, face batter).

When the plan shows only back-of-curb elevations, compute flow line elevations from the curb section detail before going to the field.

## Tangent curb staking

On straight runs:

1. Generate stakeout points along the curb alignment at the specified interval (25 ft is standard; 50 ft if the contractor agrees and the grade is uniform).
2. At each station, compute the offset stake position (e.g., 5 ft behind back of curb, perpendicular to the alignment).
3. Drive a hub and tack at the offset position. Set a guard stake with the following:
   - Station
   - Offset distance and direction (e.g., "5' RT to FL")
   - Cut or fill to the flow line elevation
   - Flow line design elevation
4. Confirm the horizontal position is within 0.03 ft and the elevation within 0.02 ft of the design.

## Curved curb staking

On horizontal curves, tighten the spacing so the contractor can follow the curve:

- Stake the **PC (point of curvature)** and **PT (point of tangency)** precisely.
- Add intermediate stakes at 10 to 15 ft intervals, or closer on tight-radius curves (less than 50 ft radius).
- On compound or reverse curves, stake every **PCC (point of compound curvature)** or **PRC (point of reverse curvature)**.
- The contractor will stretch a string line between adjacent stakes. If the string deviates more than 0.1 ft from the design curve at the midpoint, the spacing is too wide.

## Curb return radii (intersection returns)

Curb returns at intersections are typically 25 to 50 ft radius arcs (varies by jurisdiction and street classification). They require closer attention because:

- The radius must match the design to meet turning-movement and ADA requirements.
- The grade along the return must transition smoothly from one street's cross slope to the other's.
- The ADA ramp is usually located within or adjacent to the return.

Staking procedure:

1. Stake the radius point (center of the arc) if the contractor requests it for form setting.
2. Stake the **BC (beginning of curve)** and **EC (end of curve)** of the return.
3. Stake intermediate points at 5 to 10 ft intervals around the return.
4. Provide flow line elevations at each point. The grade along the return is often a linear interpolation between the two tangent grades, but verify against the profile.

## ADA ramp tie-ins

ADA-compliant curb ramps have specific geometry requirements per the Public Right-of-Way Accessibility Guidelines (PROWAG) and local standards:

- **Running slope:** Maximum 8.33% (1:12). Many jurisdictions target 7.5% or less.
- **Cross slope:** Maximum 2.0% on the ramp surface and in the landing.
- **Landing:** 4 ft by 4 ft minimum level area (2.0% max slope in any direction) at the top of the ramp.
- **Detectable warning surface:** Typically 2 ft deep across the full width of the ramp at the gutter line.

Stake the following for each ramp:

- Top of ramp (back edge of landing) — elevation and position.
- Bottom of ramp (gutter line) — elevation and position.
- Flared side slopes if applicable.
- Landing dimensions.

Mark the ramp grade on the lath. If the as-designed ramp slope exceeds 8.33%, flag the issue to the engineer immediately — it will fail inspection.

## Vertical grade along curb

The flow line elevation at each stake comes from the plan profile. Between profiled stations, interpolate linearly unless the profile shows a vertical curve. On vertical curves (sag or crest), use the parabolic equation to compute the elevation at each station — linear interpolation will be wrong.

Many data collectors handle vertical curve interpolation automatically when the alignment and profile are loaded. Verify a few stations by hand calculation to confirm the collector is computing correctly.

## Related

- [Pavement staking](pavement-staking.md)
- [Lath conventions](lath-conventions.md)
- [Staking checklist](staking-checklist.md)
- [Grade checks](grade-checks.md)
