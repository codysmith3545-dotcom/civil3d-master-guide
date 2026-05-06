---
title: "Intersection Design"
section: "engineering/roadway-design"
order: 45
visibility: public
tags: [intersection, turning-radius, channelization, sight-triangle, auxiliary-lane, aashto]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateIntersection, EditIntersection, CreateSightLineAnalysis]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, Chapter 9"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 46 (Intersections)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Intersection design starts with the **design vehicle** — the turning radius must accommodate the largest vehicle expected. WB-67 requires approximately 45 ft minimum curb radius for a right turn; SU-30 needs about 30 ft.
> 2. **Intersection sight distance** (ISD) must be checked for all approaches: clear sight triangles free of obstructions between 2.0 ft and 3.5 ft above pavement.
> 3. Auxiliary lanes (left-turn, right-turn, acceleration, deceleration) are added when traffic warrants justify them and when the through-lane capacity would otherwise degrade below the target LOS.

## Turning radii and edge design

The curb return radius at an intersection must allow the design vehicle to complete its turn without encroaching on adjacent lanes or mounting the curb. AASHTO minimum edge-of-traveled-way designs:

| Design vehicle | Approximate min. curb radius (ft) |
|---|---|
| P (passenger car) | 15 |
| SU-30 (single-unit truck) | 30 |
| SU-40 (fire apparatus) | 40 |
| WB-50 | 40 |
| WB-67 (standard semi) | 45-50 |

For tight urban intersections where a simple radius cannot accommodate the design vehicle, use a three-centered compound curve or channelizing island. AutoTurn or Civil 3D's vehicle-tracking tools verify that the swept path stays within the pavement.

## Channelization

Channelizing islands separate conflicting movements and guide drivers into predictable paths:

- **Divisional islands** — separate opposing traffic on divided-road approaches.
- **Directional islands** — control and direct specific movements (e.g., right-turn slip lanes).
- **Refuge islands** — provide a pedestrian crossing refuge.

Minimum island size: 50 sq ft for raised islands, 75 sq ft for painted islands (AASHTO). The island nose should be offset at least 2 ft from the travel lane and have a minimum nose radius of 1 ft to 3 ft.

## Sight triangles

At every intersection, verify that the approach sight triangle and departure sight triangle are clear. See [Sight distance](sight-distance.md) for ISD formulas. Key dimensions:

- **Approach sight triangle legs** — the distance along the major road that an approaching driver needs to see the intersection and react. Based on decision sight distance.
- **Departure sight triangle legs** — the distance along the major road that a stopped driver on the minor road needs to see approaching traffic. Based on the gap acceptance time (7.5 s for passenger cars, per AASHTO).

Nothing within the sight triangle should obstruct visibility between 2.0 ft and 3.5 ft above the pavement surface: signs, landscaping, parked vehicles, fences, retaining walls.

## Auxiliary lanes

### Left-turn lanes

Left-turn lanes are warranted when the left-turn volume causes unacceptable delay to through traffic or when crash history indicates a left-turn collision pattern. Components:

- **Deceleration taper** — typically 50 ft to 100 ft.
- **Deceleration length** — depends on approach speed and method of deceleration (AASHTO Table 9-21 provides values by speed).
- **Storage length** — must hold the expected queue (1.5 to 2.0 times the average number of vehicles per cycle for signalized intersections; 2 vehicles minimum for unsignalized).
- **Lane width** — typically 10 ft to 12 ft; 11 ft is common.

### Right-turn lanes

Right-turn lanes reduce conflicts and improve capacity. Warranted when right-turn volume exceeds 150 to 300 vph (varies by agency) or when pedestrian conflicts are a concern. The deceleration length and taper follow AASHTO Table 9-22.

### Acceleration and deceleration lanes

Used at unsignalized intersections on high-speed roads (typically 45 mph and above) where stopped vehicles on the cross street need space to accelerate into the through-traffic stream. AASHTO Tables 9-23 and 9-24 provide lengths.

## INDOT intersection requirements

INDOT IDM Chapter 46 requires:

- Left-turn lanes on all state routes where the DHV left-turn volume exceeds a threshold (typically 25-50 vph).
- ISD check at every intersection with a state route.
- Design vehicle of SU-40 minimum at intersections with state routes; WB-67 when truck percentages exceed 10%.
- ADA-compliant curb ramps and pedestrian signals at all signalized intersections.

## Civil 3D workflow

1. Use `CreateIntersection` to build the intersection geometry from two crossing alignments.
2. Civil 3D generates curb returns, lane widths, and corridor regions for the intersection.
3. Verify turning paths with a vehicle tracking analysis (AutoTurn or similar).
4. Run `CreateSightLineAnalysis` on the approach profiles to verify ISD.

## Related

- [Sight distance](sight-distance.md)
- [Roundabouts](roundabouts.md)
- [Driveways](driveways.md)
- [Lane and shoulder widths](lane-and-shoulder-widths.md)
- [AASHTO design controls](aashto-design-controls.md)
