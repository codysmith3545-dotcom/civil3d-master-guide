---
title: "Superelevation"
section: "engineering/roadway-design"
order: 35
visibility: public
tags: [superelevation, horizontal-curve, transition, runoff, aashto, indot]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateSuperelevationView, CalculateSuperelevation, EditSuperelev]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §3.3.4"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 43 (Horizontal Alignment and Superelevation)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Superelevation (e) tilts the pavement cross section to counteract centripetal force on curves. Maximum e depends on road type: AASHTO allows 4% (low-speed urban) to 12% (high-speed rural). INDOT uses e_max = 6% (urban) and 8% (rural).
> 2. The transition from normal crown to full superelevation happens over the **tangent runout** (crown to flat) and **superelevation runoff** (flat to full e). Two-thirds of the runoff typically occurs before the PC.
> 3. In Civil 3D, use `CalculateSuperelevation` on an alignment to auto-generate the transition based on AASHTO or INDOT criteria files.

## The physics

On a horizontal curve of radius R at speed V, the centripetal acceleration must be balanced by side friction and superelevation:

`e + f = V² / (15 R)` (V in mph, R in ft)

where e is superelevation rate (ft/ft), and f is the side friction factor. AASHTO limits f by design speed (from 0.17 at 20 mph to 0.08 at 80 mph) based on driver comfort and tire-pavement friction.

## Maximum superelevation (e_max)

| Context | AASHTO e_max | INDOT e_max |
|---|---|---|
| Low-speed urban (< 45 mph) | 4% | 4% (some local agencies) |
| Urban arterial | 4-6% | 6% |
| Rural two-lane / multilane | 6-8% | 8% |
| High-speed freeway / expressway | 8-10% | 8% |
| Open highway / mountainous | 10-12% | Not used in Indiana |

Higher e_max allows tighter radii at a given speed. Lower e_max is chosen where slow-moving traffic, frequent stops, or ice make steep cross slopes problematic.

## Superelevation distribution methods

AASHTO describes five methods for distributing e and f as radius decreases (Green Book Table 3-8 through 3-17). The most common:

- **Method 5 (AASHTO recommended)** — superelevation and side friction increase in a curvilinear relationship, keeping the margin of safety roughly uniform. INDOT uses Method 5.
- **Method 2** — f is held at zero (all centripetal force carried by superelevation) until e reaches e_max, then f increases. Rarely used.

## Transition geometry

The transition from normal crown to full superelevation has two parts:

1. **Tangent runout (TR)** — the distance to rotate the outside lane from normal crown (typically -2%) to a flat (0%) cross slope.
2. **Superelevation runoff (Lr)** — the distance to rotate from flat (0%) to full superelevation (e_max for the curve). Lr depends on the number of lanes rotated and the maximum relative gradient (AASHTO Table 3-19):

| Design speed (mph) | Max relative gradient (%) |
|---|---|
| 20 | 0.80 |
| 30 | 0.70 |
| 40 | 0.60 |
| 50 | 0.55 |
| 60 | 0.50 |
| 70 | 0.45 |
| 80 | 0.40 |

`Lr = (w × n × e_d) / Δ`

where w = lane width (ft), n = number of lanes rotated, e_d = design superelevation (%), and Δ = maximum relative gradient (%).

Typically, two-thirds of the runoff (Lr) occurs before the PC and one-third after the PC. On spiraled curves, the superelevation transition coincides with the spiral length.

## Axis of rotation

The axis about which the pavement rotates:

- **Crowned roads** — typically rotate about the centerline. The inside lane rotates down, the outside lane rotates up.
- **Divided highways** — each direction rotates about its own median edge or centerline. INDOT requires rotation about the median edge for divided facilities.
- **One-way roads** — rotate about the inside edge.

Drainage must be checked at the point where the outside lane passes through zero cross slope (drainage reversal point).

## Civil 3D workflow

1. Define the alignment with spirals (if used) or simple curves.
2. Run `CalculateSuperelevation`. Select the INDOT or AASHTO criteria file matching e_max. Civil 3D computes transition lengths and full-superelevation limits for each curve.
3. Review the superelevation view (`CreateSuperelevationView`) to verify transitions.
4. The superelevation data drives the assembly: the lane subassemblies read superelevation values from the alignment to tilt the corridor surface.

## Related

- [Horizontal curve design](horizontal-curve-design.md)
- [Cross slope](cross-slope.md)
- [Sight distance](sight-distance.md)
- [AASHTO design controls](aashto-design-controls.md)
