---
title: "Mass Haul Diagrams"
section: "engineering/earthwork"
order: 25
visibility: public
tags: [earthwork, mass-haul, free-haul, overhaul, balance, borrow, waste, civil3d]
appliesTo: [civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. A mass haul diagram plots **cumulative earthwork volume** (cut positive, fill negative) along an alignment. Rising segments are cut zones; falling segments are fill zones. Where the curve crosses zero (or returns to a previous value), the earthwork is balanced to that point.
> 2. Key concepts: **free-haul distance** (the distance within which hauling is included in the unit price, typically 500 ft to 1,000 ft), **overhaul** (volume x distance beyond the free-haul limit), and **balance points** (where cumulative cut equals cumulative fill).
> 3. Civil 3D generates mass haul diagrams from corridor section volumes. Optimizing the profile grade to minimize haul cost is one of the most impactful design decisions on a corridor project.

## How to read a mass haul diagram

The horizontal axis is station (along the alignment). The vertical axis is cumulative volume (in cubic yards, adjusted for shrink/swell if configured).

- **Rising curve** = cut zone (material is being excavated). The slope of the rise indicates the rate of cut.
- **Falling curve** = fill zone (material is being placed). The slope of the fall indicates the rate of fill.
- **Peak** = transition from cut to fill. Maximum cumulative surplus of material.
- **Valley** = transition from fill to cut. Maximum cumulative deficit of material.
- **Crossing the zero line** = at this station, cumulative cut equals cumulative fill from the start of the project.

### Balance points

A balance point is a station where the cumulative volume returns to a value it had previously. The earthwork between two balance points at the same ordinate value is internally balanced — all cut material within that segment can be used for fill within the same segment.

### Borrow and waste

- If the mass haul diagram ends above zero, the project has **excess cut** — material must be wasted (hauled off-site or placed in a designated waste area).
- If the mass haul diagram ends below zero, the project has a **fill deficit** — material must be borrowed (imported from a borrow source).

## Free haul and overhaul

### Free-haul distance

The contract specifies a free-haul distance (FHD): the maximum horizontal distance within which earthwork hauling is included in the unit price for excavation. Typical values: 500 ft to 1,000 ft (varies by agency; check INDOT Standard Specifications for Indiana projects).

### Overhaul

When material must be hauled beyond the free-haul distance, the contractor is paid an additional "overhaul" payment, calculated as:

```
Overhaul = volume (CY) x distance beyond FHD (stations)
```

Reported in station-yards (STA-YD). The overhaul distance is measured from the limit of the free-haul zone to the centroid of the remaining volume.

### Minimizing overhaul

The designer minimizes total earthwork cost by:

1. Adjusting the profile grade to balance cut and fill.
2. Positioning balance points so that material does not cross long haul distances.
3. Designating borrow and waste locations close to where they are needed.

## Generating in Civil 3D

### Prerequisites

1. A corridor with a finished-grade surface and an existing-ground surface.
2. Sample lines at regular intervals along the alignment.
3. Materials computed (Analyze > Compute Materials) with appropriate surfaces and criteria.

### Steps

1. Analyze tab > Mass Haul panel > Create Mass Haul Diagram.
2. Select the sample line group and the material list.
3. Specify shrinkage/bulking factors (these adjust the mass haul to compacted or loose volumes).
4. Specify the free-haul distance.
5. Civil 3D generates the mass haul view showing the cumulative volume curve, balance lines, free-haul zones, and overhaul zones.

### Interpreting the output

- The diagram shows shaded regions for free-haul and overhaul.
- A data table lists volumes, haul distances, and overhaul quantities per balance region.
- Multiple balance lines can be drawn to explore different haul strategies.

## Optimizing the profile to minimize haul

Adjusting the profile vertical alignment is the primary tool for earthwork optimization:

- **Raise the profile** in fill areas to reduce fill volume (less borrow needed).
- **Lower the profile** in cut areas to reduce cut volume (less waste needed).
- **Shift the balance point** to keep material haul distances within the free-haul limit.

Each profile change affects drainage, sight distance, clearances, and other design criteria. Earthwork optimization cannot be done in isolation.

## Indiana-specific notes

- INDOT Standard Specifications define free-haul distance and overhaul payment methods for state highway projects. Check the current edition for specific values.
- County and municipal projects may not include overhaul provisions — all haul is included in the excavation unit price. In this case, the mass haul diagram still helps identify borrow/waste needs but the overhaul cost is captured in the bid item differently.

## Related

- [Cut/fill quick checks](cut-fill-quick-checks.md)
- [Volume methods](volume-methods.md)
- [Shrink and swell](shrink-swell.md)
- [Stockpile estimation](stockpile-estimation.md)
