---
title: "Manhole Spacing and Drop Structures"
section: "engineering/sanitary-sewer-design"
order: 40
visibility: public
tags: [manhole, drop-manhole, spacing, ten-states, structure-design]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateNetwork, EditPipeNetwork, EditStructureProperties]
relatedCalculators: [sanitary-sewer-sizing]
updated: 2026-05-11
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §34, §44"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "ASCE/EWRI Manual of Practice No. 60 (Gravity Sanitary Sewer Design and Construction), 2nd ed., Chapter 8"
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-11
  - title: "Indianapolis Department of Public Works Sewer Standards"
    url: https://www.indy.gov/agency/department-of-public-works
    verified: 2026-05-11
---

> **TL;DR**
> 1. Ten States Standards §34.2 caps manhole spacing at **400 ft for pipes 15 in or smaller**, **500 ft for 18-30 in**, and **600 ft for pipes larger than 30 in** (some agencies extend to 800 ft for very large interceptors).
> 2. Manholes are required at all **changes of slope, direction, size, material, or junction**; on straight reaches the spacing maxima above apply.
> 3. A **drop manhole** is required where the incoming invert is **24 in or more above the outgoing invert** (Ten States §44.3). Internal drops are common; **external drops** are preferred for maintenance access.

## Manhole spacing — by pipe size

Ten States §34.2 maximums:

| Pipe diameter | Max spacing (ft) |
|---|---|
| 15 in and smaller | 400 |
| 18 in to 30 in | 500 |
| 36 in and larger | 600 |

Indiana practice typically uses 400 ft as the default for residential 8-in mains, often reduced to 300-350 ft where rodding access from a single end is required (older standards). Cleaning equipment (jet trucks) can reach 600+ ft on smooth PVC, which is why Ten States permits longer reaches for larger pipes.

## Where manholes are required (regardless of distance)

Per Ten States §34.1:

- Every change of pipe **diameter**.
- Every change in **slope**.
- Every change in **horizontal direction** (no curved mains in standard practice; some agencies permit gentle curves with manholes at the BC and EC).
- Every **junction** of two or more sewers.
- Change in **pipe material** (PVC to RCP, etc.).
- End of every sewer (terminal cleanout or terminal manhole).

## Minimum drop through a manhole

To compensate for the head loss through the structure and to maintain hydraulic continuity, Ten States §34.4 requires a minimum invert drop across a manhole:

- **Straight-through manhole, same size:** 0.10 ft minimum.
- **Straight-through, change in pipe size:** match the **0.8 depth** (crown drop ≥ difference in pipe diameter ÷ ~1.25).
- **Junction manhole:** the outgoing invert drop is at least 0.10 ft below the lowest incoming invert; for sharp angles (> 45° between centerlines) increase to ~0.20 ft.

## Drop manholes — when required

Ten States §44.3: where an incoming sewer invert is **24 in or more above the outgoing invert**, provide a drop connection. Reasons:

1. Worker safety — the falling stream sprays sewage and gas through the chamber.
2. Hydraulic — high-velocity drops scour the manhole base.
3. Operations — cleaning crews need a controlled drop path.

### External vs internal drops

- **External drop:** the incoming pipe extends past the manhole and turns vertical outside the structure, then re-enters at the floor. Preferred for maintenance — the drop pipe is accessible for rodding from the upstream manhole.
- **Internal drop:** the incoming pipe enters the upper chamber, a vertical drop pipe inside the structure conveys flow to the outgoing invert. Cheaper but harder to maintain; many Indiana cities (Indianapolis, Westfield) require external drops.

### Drop sizing

The drop pipe is sized to match the incoming pipe diameter. A short horizontal "Y" or "T" fitting taps the incoming line; the drop pipe is supported by a manhole bench or a steel bracket. Standard Indianapolis detail: 8-in external drop on 8-in incoming PVC.

## Manhole size

Ten States §34.3:

| Incoming pipe(s) | Minimum manhole diameter |
|---|---|
| 8-12 in, straight run | 48 in (4 ft) |
| 15 in or with bend ≥ 45° | 60 in (5 ft) |
| 18-24 in | 60-72 in |
| 27-30 in | 72-84 in |
| 36 in and larger | Custom (typically box manhole or vault) |

Indianapolis DPW typically requires 48-in for 8-12 in mains and 60-in where two laterals or a bend exists.

## Inverts and benching

The bench inside the manhole (the smooth concrete shoulder around the channel) is sloped at 1V:12H toward the channel. Channels are formed in the floor at the **full pipe diameter** of the outgoing main; the benching wraps the curve of the channel. For junction manholes the channel curves smoothly to merge incoming flows; sharp 90° benching is not acceptable for active sewers (causes solids deposition).

## Worked example

8-in PVC subdivision main, 7,200-ft total length, 14 reach segments. Two reaches require drop manholes (incoming inverts 28 in and 36 in above outgoing).

- Required intermediate manholes for spacing: 7,200 / 400 = 18 manholes minimum from spacing alone.
- Required for direction / junction: 22 (counted from layout).
- Total manholes: 22 (junctions govern; spacing rule is the floor, not the design driver).
- Two of the 22 are drop manholes per §44.3.

Cost note for budgeting: 48-in MH at typical depth $4,000-6,000 in Indiana 2025-2026 dollars; external drop adds $1,500-2,500.

## Common review comments

- Manhole spacing 425 ft on 8-in — fails Ten States 400-ft cap.
- Incoming invert 22 in above outgoing — under the 24-in threshold but very close. Many reviewers want a drop at 18 in to give safety margin and avoid a marginal call later.
- Internal drop on 24-in line — most Indiana cities require external for pipes 18 in and up.
- Channel benching at 90° on a junction MH — re-detail with smooth curve.
- Minimum 0.10 ft drop through MH omitted on plan-and-profile — required.

## Related

- [Manhole design (breadth)](../sanitary-sewer/manhole-design.md)
- [Drop manholes (breadth)](../sanitary-sewer/drop-manholes.md)
- [Minimum velocity and slope](minimum-velocity-and-slope.md)
- [Sanitary sewer sizing calculator](/tools/sanitary-sewer-sizing)
