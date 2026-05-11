---
title: "AASHTO Roadside Design Guide 4e — Curated Summary"
section: standards/aashto
order: 29
visibility: public
tags: [aashto, roadside-design, clear-zone, barrier, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, Roadside Design Guide, 4th Edition (2011) with errata"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO RDG 2011"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. The AASHTO Roadside Design Guide (RDG), 4th Edition (2011) with subsequent errata, sets the policy for the forgiving roadside: clear zone width, slope categorization, barrier warrants, terminals, and crash cushion selection.
> 2. Clear zone width is read from RDG Table 3-1 as a function of design speed and ADT, then adjusted by Tables 3-2 (foreslope/backslope) and the horizontal-curve adjustment of Table 3-3 — these tables are copyrighted and are not reproduced here.
> 3. The barrier-need decision follows a hierarchy: remove the hazard, relocate it, make it breakaway, shield with a barrier, or accept and document — barriers are themselves rigid hazards and are installed only when the alternatives are not feasible.

## What AASHTO says

The Roadside Design Guide is AASHTO's policy reference for what happens when a vehicle leaves the traveled way. It complements the Green Book: the Green Book defines the road, the RDG defines the recovery area beside it.

The RDG organizes design decisions around three categories of roadside slope — recoverable (`4H:1V` and flatter), non-recoverable (between `3H:1V` and `4H:1V`), and critical (steeper than `3H:1V`) — and around the clear zone, defined as the unobstructed roadside area available for use by an errant vehicle.

**Clear zone tables** (see [original publication]):

- Table 3-1 gives the base clear zone width as a function of design speed and design-year ADT, for tangent roadway sections.
- Table 3-2 provides foreslope and backslope adjustment factors. On steeper recoverable foreslopes the clear zone is widened (a vehicle travels farther down-slope). On non-recoverable foreslopes the clear zone is measured from the toe of slope.
- Table 3-3 (or equivalent figure) gives the horizontal curve adjustment factor `K_cz`, applied where curve radius is less than approximately 3000 ft. The adjustment increases the outside-of-curve clear zone.

We do not reproduce the numeric values from these tables here. Pull them from a licensed copy of the RDG or from the equivalent table in the controlling state design manual.

**Barrier warrant.** A longitudinal barrier is installed only when the consequence of striking the hazard exceeds the consequence of striking the barrier. The RDG codifies this through a hazard-mitigation hierarchy: (1) remove or redesign the hazard so it is no longer a hazard; (2) relocate it outside the clear zone; (3) reduce its severity (breakaway hardware); (4) shield it with a barrier or crash cushion; (5) delineate and accept it.

**Hardware.** All longitudinal barriers, terminals, and crash cushions on federal-aid projects must be tested and accepted under the FHWA *Manual for Assessing Safety Hardware* (MASH); see [MASH 2016 overview](mash-2016-overview.md). Older NCHRP Report 350 hardware has been phased out.

## Key formulas / variables

The clear-zone calculation is table-driven, not formulaic. The horizontal-curve adjustment combines as `CZ_curve = CZ_tangent x K_cz`, with `K_cz` from RDG Table 3-3.

For barrier length-of-need, the standard equation is `X = (L_a - L_2 (Y/L_a)) / ((Y / L_a) + (L_a / L_R))`, where `L_a` is lateral extent of area of concern, `L_2` is offset to barrier, `Y` is offset to hazard, and `L_R` is runout length from RDG Table 5-x by design speed and ADT.

## Common Civil 3D applications

- Plot the clear zone as an offset polyline from edge of traveled way and verify proposed structures, sign posts, light poles, drainage inlets, and trees against it.
- Use the [Roadside Design Guide overview page](roadside-design-guide.md) for the broader context.
- For barrier layout, draw the barrier as a feature line and use a corridor with a barrier subassembly to build the back-of-barrier and grading.

## What this guide can't reproduce

The RDG Tables 3-1 through 3-3 (clear zone), Tables 5-x (runout length), the barrier deflection tables, and the figures showing terminal types and crash cushion families are copyrighted by AASHTO. Purchase from the AASHTO Store. The FHWA eligibility letter list for crash-tested hardware is open-access.

## Related Indiana standards

- INDOT IDM Part 5 Chapter 49 covers Indiana clear zone application and barrier policy. See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
