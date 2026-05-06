---
title: "Roundabouts"
section: "engineering/roadway-design"
order: 50
visibility: public
tags: [roundabout, intersection, nchrp-672, inscribed-circle, splitter-island]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateIntersection, CreateCorridor, CreateAlignment]
updated: 2026-05-06
sources:
  - title: "NCHRP Report 672, Roundabouts: An Informational Guide, 2nd ed., TRB, 2010"
    url: https://www.trb.org/Publications/Blurbs/164470.aspx
    verified: 2026-05-06
  - title: "FHWA Roundabouts: An Informational Guide (FHWA-RD-00-067)"
    url: https://www.fhwa.dot.gov/publications/research/safety/00067/
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 46 (Intersections)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Modern roundabouts differ from traffic circles: they have **yield-at-entry**, deflection to control speed, and one-way circulation. Key geometric parameters are the inscribed circle diameter (ICD), entry width, and circulatory roadway width.
> 2. Single-lane roundabouts handle up to about 25,000 AADT; multi-lane roundabouts up to approximately 45,000 AADT. They reduce fatal and injury crashes by 78-82% compared to signalized intersections (FHWA data).
> 3. Design is iterative: set ICD, check fastest path speed (target 15-25 mph through the roundabout), verify truck accommodation with swept-path analysis, then refine.

## Roundabout types

| Type | Inscribed circle diameter | Lanes | Typical capacity (AADT) |
|---|---|---|---|
| Mini-roundabout | 45-90 ft | 1 | < 15,000 |
| Single-lane | 100-180 ft | 1 | 15,000-25,000 |
| Multi-lane (2-lane) | 150-220 ft | 2 | 25,000-45,000 |
| Multi-lane (3-lane) | 200-250 ft | 3 | 35,000+ |

Mini-roundabouts have a fully traversable central island and are suited for low-speed, low-volume intersections or retrofit situations with limited right-of-way.

## Key geometric elements

- **Inscribed circle diameter (ICD)** — the outer edge-to-edge diameter. Drives all other dimensions.
- **Circulatory roadway width** — the paved width around the central island, typically 16-20 ft for single-lane and 24-32 ft for two-lane.
- **Entry width** — the width at the yield line, typically 14-18 ft for single-lane entries.
- **Entry radius** — the radius of the curved entry path; controls entry speed.
- **Central island** — raised, landscaped (kept low for sight distance — nothing above 2 ft within the sight triangle).
- **Truck apron** — a mountable, paved area around the central island (typically 6-15 ft wide) that allows large trucks to track through without requiring an oversized ICD.
- **Splitter islands** — raised medians on each approach that separate entering and exiting traffic, deflect approaching vehicles, and provide a pedestrian refuge. Minimum 6 ft width at the crosswalk.

## Design speed control

The critical design principle is deflection: the horizontal geometry must force all vehicles to slow to the design speed (typically 15-25 mph). The **fastest path** is the smoothest, widest path a passenger car can take through the roundabout without crossing a raised element. Steps:

1. Draw the fastest path through each movement (left turn, through, right turn).
2. Measure the radius of the fastest path at the entry, circulatory roadway, and exit.
3. Calculate the speed from the path radius: V = (15 R (e + f))^0.5, using e = -0.02 (adverse crown) and f from AASHTO.
4. If the fastest-path speed exceeds 25 mph at the entry or within the circulatory roadway, adjust geometry (tighter entry radius, larger central island, narrower entry width).

## Pedestrian and bicycle accommodation

- Crosswalks are located one car-length back from the yield line (approximately 20-25 ft).
- Splitter islands provide a two-stage crossing. Minimum refuge width at the crosswalk: 6 ft.
- Detectable warning surfaces (truncated domes) are required at each crosswalk edge per ADA.
- Bicyclists can either mix with traffic (appropriate at single-lane roundabouts with speeds under 25 mph) or use a separated shared-use path around the outside.

## Truck accommodation

WB-67 tracking through a single-lane roundabout typically requires either a truck apron or an ICD of at least 130-150 ft. Verify with swept-path software (AutoTurn, TORUS). The truck apron should be 3-4 inches above the circulatory pavement with a mountable curb, paved in textured concrete or pavers to discourage passenger-car use.

## INDOT and Indiana practice

INDOT has adopted roundabouts broadly — Indiana leads the nation in roundabout construction. INDOT IDM Chapter 46 addresses roundabouts; INDOT also publishes supplemental roundabout design guidance. Carmel, IN has over 150 roundabouts. Key INDOT requirements:

- Roundabout analysis required as an alternative for any new intersection or intersection reconstruction on a state route.
- INDOT uses NCHRP 672 methodology for capacity analysis (typically with SIDRA or HCM 6th-edition roundabout methodology).
- Landscaping in the central island must not exceed 2 ft height within sight-distance zones.

## Civil 3D workflow

Civil 3D does not have a dedicated roundabout wizard (unlike Autodesk InfraWorks, which does). The typical approach:

1. Create alignments for each approach and the circulatory roadway (a circular alignment).
2. Build the roundabout as a corridor with multiple regions or as a grading group.
3. Truck apron and splitter islands are modeled as offset alignments or feature lines with grading.
4. Use feature lines and grading objects for the central island and splitter islands.

## Related

- [Intersection design](intersection-design.md)
- [Sight distance](sight-distance.md)
- [Lane and shoulder widths](lane-and-shoulder-widths.md)
- [AASHTO design controls](aashto-design-controls.md)
