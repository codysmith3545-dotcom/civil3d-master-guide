---
title: "Driveways"
section: "engineering/roadway-design"
order: 55
visibility: public
tags: [driveway, access-management, sight-distance, indot, throat-width]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateIntersection, CreateSightLineAnalysis]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §9.11"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Access Management Guide"
    url: https://www.in.gov/indot/resources/permits/
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 46 (Intersections)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Driveway design is governed by access management policy: throat width, approach angle, sight distance, and spacing from adjacent driveways and intersections.
> 2. Residential driveways are typically 10-24 ft wide with a 90-degree approach; commercial driveways are 24-36 ft wide. INDOT requires an access permit for any new driveway on a state route.
> 3. Sight distance at driveways must meet AASHTO intersection sight distance (ISD) Case B requirements — a stopped driver at the driveway must be able to see approaching traffic.

## Access management basics

Access management controls the number, location, and design of driveways and median openings to preserve roadway safety and capacity. Principles:

- Limit the number of access points per mile — fewer driveways reduce conflict points and crash rates.
- Maintain adequate spacing between driveways and from intersections.
- Channelize turning movements at high-volume driveways (raised medians, turn lanes).
- Consolidate access through shared driveways and cross-access easements when possible.

## Driveway design standards

### Residential driveways

| Parameter | Typical value |
|---|---|
| Throat width | 10-16 ft (single), 16-24 ft (double) |
| Approach angle | 90 degrees (perpendicular to the roadway) |
| Curb return radius | 3-5 ft |
| Maximum grade in first 20 ft | 5% (to prevent vehicle bottoming) |
| Minimum sight distance | ISD Case B per design speed |

### Commercial / industrial driveways

| Parameter | Typical value |
|---|---|
| Throat width | 24-36 ft (two-way), 16-20 ft (one-way) |
| Approach angle | 60-90 degrees |
| Curb return radius | 25-50 ft (based on design vehicle) |
| Throat depth | 40-60 ft minimum (to queue turning vehicles off the road) |
| Minimum sight distance | ISD Case B per design speed |

For commercial driveways that serve trucks, the curb return radius must accommodate the design vehicle (SU-30 minimum, WB-67 for truck-intensive uses). Verify with swept-path analysis.

## Sight distance at driveways

A driver stopped at a driveway must see approaching vehicles on the roadway with enough time to enter or cross safely. Use AASHTO ISD Case B (departure from a stop):

`ISD = 1.47 × V × t_gap`

where V is the roadway design speed (mph) and t_gap is the gap time (7.5 s for a passenger car turning left, 6.5 s for turning right). On multilane roads, increase t_gap by 0.5 s per additional lane to cross.

Sight obstructions to check: parked cars, landscaping, fences, signs, mailboxes, utility cabinets, and vertical curves on the roadway.

## INDOT driveway access permits

Any new or modified driveway on an INDOT route requires an access permit. The process:

1. Submit application to the INDOT district office (or online via INDOT Permits portal).
2. Include a site plan showing the driveway location, dimensions, sight distance analysis, and traffic data.
3. INDOT reviews for conformance with the Access Management Guide: spacing, sight distance, left-turn treatment, and impact on the state route.
4. INDOT may require a traffic impact study for high-volume generators (typically when the development generates 100+ peak-hour trips).

INDOT spacing standards for driveways on state routes vary by functional class and speed; a typical minimum is 300 ft on a 45-mph arterial.

## Local jurisdiction requirements

Marion County (Indianapolis) and surrounding counties often have their own access management ordinances that are stricter than AASHTO minimums:

- Carmel requires cross-access easements between adjacent commercial parcels.
- Fishers limits driveways per parcel on major corridors.
- Indianapolis requires a curb cut permit from the Department of Public Works.

Always check the local jurisdiction's standards in addition to INDOT.

## Driveway grades and drainage

- The driveway must not redirect roadway drainage or create ponding on the sidewalk or travel lane.
- Where a sidewalk crosses the driveway, the cross slope of the driveway at the sidewalk must not exceed 2% (ADA requirement).
- The first 20 ft of the driveway from the edge of pavement should not exceed a 5% grade.
- Install a culvert under the driveway if there is a roadside ditch.

## Related

- [Intersection design](intersection-design.md)
- [Sight distance](sight-distance.md)
- [Cross slope](cross-slope.md)
- [Lane and shoulder widths](lane-and-shoulder-widths.md)
