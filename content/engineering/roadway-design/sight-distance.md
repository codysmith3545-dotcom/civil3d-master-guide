---
title: "Sight Distance"
section: "engineering/roadway-design"
order: 30
visibility: public
tags: [sight-distance, stopping-sight-distance, passing-sight-distance, decision-sight-distance, intersection-sight-distance, aashto]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateSightLineAnalysis, EditAlignmentDesignChecks]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §3.2"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 42 (Sight Distance)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Stopping sight distance (SSD)** is the minimum for all roads: SSD = 1.47Vt + V²/(30(f±G)), where V is design speed (mph), t is perception-reaction time (2.5 s), f is friction, and G is grade. Eye height = 3.5 ft, object height = 2.0 ft.
> 2. **Passing sight distance (PSD)** applies to two-lane highways where passing in the opposing lane is permitted. Eye height = 3.5 ft, object height = 3.5 ft.
> 3. Always check sight distance at crest vertical curves, horizontal curves with obstructions, intersections, and driveways.

## Stopping sight distance (SSD)

SSD is the distance a driver needs to perceive a hazard, react, and brake to a stop. It is required on every road at every point.

`SSD = 1.47 V t + V² / (30 (a/32.2))`

where V = design speed (mph), t = 2.5 s (perception-reaction time, AASHTO), and a = deceleration rate (11.2 ft/s², AASHTO standard comfortable deceleration). On grades, the braking distance adjusts:

`d_braking = V² / (30 ((a/32.2) ± G))`

where G is grade in decimal (positive for upgrade, which reduces SSD; negative for downgrade, which increases it).

AASHTO SSD on level grade:

| Design speed (mph) | SSD (ft) |
|---|---|
| 20 | 115 |
| 25 | 155 |
| 30 | 200 |
| 35 | 250 |
| 40 | 305 |
| 45 | 360 |
| 50 | 425 |
| 55 | 495 |
| 60 | 570 |
| 65 | 645 |
| 70 | 730 |

Design eye height: 3.5 ft. Object height: 2.0 ft (taillight of a vehicle).

## Decision sight distance (DSD)

DSD is the distance needed when drivers must make complex decisions (interchanges, lane drops, unusual geometry). AASHTO provides DSD values for five avoidance maneuvers. DSD exceeds SSD significantly — for example, at 50 mph, DSD ranges from 610 ft (rural stop on road, avoidance maneuver A) to 1,030 ft (urban lane change, avoidance maneuver E). Use DSD at interchanges, toll plazas, and locations where multiple decisions coincide.

## Passing sight distance (PSD)

PSD applies to two-lane two-way highways where passing zones are marked. AASHTO PSD values range from 400 ft at 20 mph to 1,835 ft at 70 mph. The object height for PSD is 3.5 ft (top of an oncoming vehicle). PSD on a crest curve requires much longer vertical curves than SSD — this is why passing is typically restricted on crest curves.

AASHTO PSD values:

| Design speed (mph) | PSD (ft) |
|---|---|
| 20 | 400 |
| 30 | 600 |
| 40 | 800 |
| 50 | 1,050 |
| 60 | 1,300 |
| 70 | 1,835 |

## Intersection sight distance (ISD)

ISD is the sight triangle at an at-grade intersection that allows a stopped or approaching vehicle to safely enter or cross the major road. AASHTO Chapter 9 defines cases:

- **Case A** — approaching on the major road (both directions). Not commonly used for design.
- **Case B** — stopped on the minor road, turning left or right onto the major road. The departure sight triangle is the controlling case for most intersections.
- **Case B1 (left turn from stop)** — ISD = time gap × 1.47 × major-road design speed. Time gaps: 7.5 s (passenger car), 9.5 s (single-unit truck), 11.5 s (combination truck).
- **Case C** — crossing the major road from a stop. Crossing time depends on intersection width and vehicle type.

At intersections, nothing within the sight triangle can obstruct the driver's view between 2.0 ft and 3.5 ft above the road surface (signs, parked vehicles, landscaping, grading).

## Sight distance on horizontal curves

On horizontal curves, objects on the inside of the curve (cut slopes, barriers, buildings, vegetation) can obstruct the line of sight. The required horizontal sight-line offset (HSO) from the centerline of the inside lane to the obstruction is:

`HSO = R (1 - cos(28.65 S / R))`

where R = radius (ft) and S = required sight distance (ft). If the available HSO is less than the required HSO, either increase the radius, clear the obstruction, or reduce the design speed.

## Civil 3D sight-distance tools

- `CreateSightLineAnalysis` on a profile view checks whether the vertical alignment provides adequate sight distance.
- Alignment design checks can flag horizontal segments where the inside offset to an obstruction is insufficient.
- For intersection sight triangles, use a 3D sight-line analysis or the `CreateSightLineAnalysis` command along the approach profiles.

## INDOT notes

INDOT IDM Chapter 42 follows AASHTO values. INDOT requires sight-distance analysis at all intersections with state roads and at all horizontal curves with cut slopes or barriers within the clear zone.

## Related

- [Vertical curve design](vertical-curve-design.md)
- [Horizontal curve design](horizontal-curve-design.md)
- [Intersection design](intersection-design.md)
- [Superelevation](superelevation.md)
- [AASHTO design controls](aashto-design-controls.md)
