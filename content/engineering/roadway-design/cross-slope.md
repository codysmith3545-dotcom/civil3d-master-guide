---
title: "Cross Slope"
section: "engineering/roadway-design"
order: 40
visibility: public
tags: [cross-slope, crown, drainage, pavement, shoulder, aashto]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateAssembly, EditAssembly, CreateCorridor]
updated: 2026-05-06
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th ed., 2018, §4.3"
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 45 (Cross Sections)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Normal crown on tangent sections is **2%** for asphalt and concrete travel lanes. This provides adequate drainage without making the road feel tilted.
> 2. Paved shoulders slope **2% to 4%** away from the travel lanes; unpaved (gravel) shoulders slope **4% to 6%**.
> 3. Cross-slope transitions at the beginning and end of superelevated curves require careful attention to drainage — the point where the outer lane passes through 0% slope is a drainage dead zone.

## Normal crown

On tangent (straight) road sections, the pavement surface is crowned to shed water to both edges:

| Surface type | Typical cross slope |
|---|---|
| High-type asphalt or concrete | 1.5% to 2.0% |
| Intermediate-type asphalt | 2.0% |
| Low-type surface (chip seal, gravel) | 2.0% to 3.0% |

AASHTO recommends 1.5% to 2.0% for well-constructed high-type pavements and up to 2.5% for lower-quality surfaces. INDOT standard is 2.0% for all state routes with high-type pavement.

A crown of less than 1.5% risks ponding; more than 2.5% on high-speed roads makes lane changes uncomfortable for drivers.

## Shoulder slopes

| Shoulder type | Slope away from travel lane |
|---|---|
| Paved (same material as travel lane) | 2% to 4% |
| Paved (different material) | 3% to 5% |
| Gravel | 4% to 6% |
| Turf | 6% to 8% |

The shoulder break (hinge point between the travel lane and shoulder) should be smooth enough that an errant vehicle does not lose control. Avoid abrupt elevation changes at the lane-shoulder joint.

## Cross slope on curves

When superelevation is applied, the cross slope transitions from normal crown to the design superelevation rate through the tangent runout and superelevation runoff zones (see [Superelevation](superelevation.md)).

Key drainage concerns during the transition:

- **Zero cross-slope zone** — when the outside lane rotates through 0% slope, surface water has no driving force to drain laterally. Limit the length of roadway at or near 0% to 50 ft or less where practical.
- **Flat inside shoulder** — on some transition geometries the inside shoulder may go flat or even adverse-slope. Check that water does not pond against the travel lane.
- **Median drainage** — on divided highways rotating about the median edge, water can be trapped in the median during the transition. Provide median inlets or slope the median to drain longitudinally.

## Cross slope at intersections

At intersections and cross streets, the cross slopes of the intersecting roads must be reconciled. Typical approach:

- The crown of the minor road is warped to match the cross slope of the major road across the intersection.
- Maximum algebraic difference between adjacent travel lanes at the intersection crown should not exceed 5% to 6% for driver comfort.
- Curb returns should maintain a minimum 1% cross slope for drainage; 2% is preferred.

## Cross slope and ADA

At pedestrian crossings and curb ramps, the cross slope of the walking surface must not exceed 2.0% per ADA/PROWAG standards. This often conflicts with the roadway cross slope at mid-block crossings. Solutions include warping the pavement within the crosswalk or locating crossings where the road cross slope is already at or near 2%.

## Civil 3D implementation

Cross slope is defined in the assembly subassemblies:

- `LaneSuperelevationAOR` — reads superelevation data from the alignment and applies it to the lane.
- `ShoulderExtendAll` — extends the shoulder at the specified slope, which can be set to follow the lane slope or hold a fixed slope.
- Use corridor frequency settings to ensure the model samples densely enough through transition zones. A 5 ft or 10 ft frequency in superelevation transitions prevents faceting.

## Related

- [Superelevation](superelevation.md)
- [Lane and shoulder widths](lane-and-shoulder-widths.md)
- [Vertical curve design](vertical-curve-design.md)
- [AASHTO design controls](aashto-design-controls.md)
