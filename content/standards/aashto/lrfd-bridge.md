---
title: "AASHTO LRFD Bridge Design Specifications"
section: "standards/aashto"
order: 50
visibility: public
tags: [aashto, lrfd, bridge, structural, load-resistance-factor]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AASHTO LRFD Bridge Design Specifications, 9th ed. (2020) with interims"
    url: https://store.transportation.org/
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Part 4 — Bridges"
    url: https://www.in.gov/indot/engineering/design-manual/
    verified: 2026-05-06
  - title: "INDOT Bridge Design Manual"
    url: https://www.in.gov/indot/engineering/standards/
    verified: 2026-05-06
---

> **TL;DR**
> 1. AASHTO LRFD Bridge Design Specifications is the controlling national standard for highway bridges in the United States, using load-and-resistance-factor design (LRFD).
> 2. The 9th Edition (2020) is current, with periodic interim revisions; verify the edition adopted on your project before using a value.
> 3. Each state DOT publishes a bridge design manual that supplements LRFD with state-specific design vehicles, geometry, and detailing — for Indiana, INDOT's Bridge Design Manual.

## What the LRFD specifications are

The *AASHTO LRFD Bridge Design Specifications* is the design code for highway bridges on the National Highway System and on most state and local roads. FHWA mandated transition from the older *Standard Specifications for Highway Bridges* (allowable-stress and load-factor design) to LRFD for new bridges; the standard specifications are no longer maintained.

LRFD applies factored loads against factored resistances:

- **Factored load** = sum of (load factor × load effect) across applicable load combinations.
- **Factored resistance** = resistance factor × nominal resistance.
- A limit state is satisfied when factored resistance ≥ factored load.

The code organizes limit states into strength, service, fatigue and fracture, and extreme event categories, each with its own load combinations and load factors. The reliability target embedded in LRFD is calibrated for a uniform safety index across structure types and span ranges, which the older codes did not deliver.

## Structure of the document

The specifications are arranged in sections that follow the design workflow:

- **Section 1.** Introduction.
- **Section 2.** General design and location features.
- **Section 3.** Loads and load factors. The HL-93 design vehicular live load lives here, along with wind, ice, vehicular collision, earthquake, and load combinations.
- **Section 4.** Structural analysis and evaluation.
- **Section 5.** Concrete structures.
- **Section 6.** Steel structures.
- **Section 7.** Aluminum structures.
- **Section 8.** Wood structures.
- **Section 9.** Decks and deck systems.
- **Section 10.** Foundations.
- **Section 11.** Abutments, piers, and walls.
- **Section 12.** Buried structures and tunnel liners.
- **Section 13.** Railings.
- **Section 14.** Joints and bearings.

Companion documents include the *AASHTO LRFD Bridge Construction Specifications*, the *Manual for Bridge Evaluation* (load rating of existing bridges), and the *Guide Specifications for LRFD Seismic Bridge Design*.

## Interaction with state DOT bridge manuals

State DOTs adopt the LRFD specifications by reference but tighten and supplement them. For a bridge project in Indiana the controlling documents are, in order:

1. **AASHTO LRFD Bridge Design Specifications** (with the interims adopted by INDOT).
2. **INDOT Indiana Design Manual, Part 4 — Bridges**, for INDOT geometric and procedural requirements.
3. **INDOT Bridge Design Manual / Bridge Standards**, for detailing, standard drawings, and Indiana-specific loads (legal load posting, permit vehicles).
4. **Project-specific design criteria** approved by the bridge engineer.

Where the state document is silent, LRFD governs; where it speaks, it governs. Common state modifications include: load combinations for state-specific permit vehicles, deck overhang design, prestressed concrete beam shapes (Indiana uses INDOT-standard bulb-tee shapes), and bearing-type selection.

For load rating of existing bridges — required for posting and for permit-load review — INDOT applies the *Manual for Bridge Evaluation* with state factors.

## Practical notes for civil designers

Civil designers normally interact with bridges at the geometric and roadway-approach interface rather than the structural design itself, but it pays to know:

- **Vertical clearances.** Bridge low-chord clearance over the roadway below comes from the Green Book and the state IDM, not LRFD; LRFD assumes the geometry is given.
- **Approach slabs and roadway transitions.** Approach slab length, joint location, and pavement-to-bridge transitions are state-standard items.
- **Hydraulics.** LRFD §2.6 covers hydraulic considerations; pair it with the state drainage manual and FHWA HEC-18/HEC-20/HEC-23 for scour and stream-stability analysis.

## Related pages

- [Green Book overview](green-book-overview.md)
- [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md)
- [Obtaining AASHTO publications](obtaining-aashto.md)
