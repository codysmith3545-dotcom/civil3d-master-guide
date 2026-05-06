---
title: "AASHTO Roadside Design Guide"
section: "standards/aashto"
order: 30
visibility: public
tags: [aashto, roadside-design, clear-zone, barrier, attenuator, mash]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "AASHTO, Roadside Design Guide, 4th ed. (2011) with errata"
    url: https://store.transportation.org/
    verified: 2026-05-06
  - title: "FHWA, Manual for Assessing Safety Hardware (MASH)"
    url: https://highways.dot.gov/safety/roadway-departure/mash
    verified: 2026-05-06
---

> **TL;DR**
> 1. The Roadside Design Guide (RDG) is AASHTO's reference for the *forgiving roadside*: clear zones, slope flattening, barrier warrants, terminal design, and crash-cushion selection.
> 2. The current edition is the 4th (2011), with subsequent errata; an updated edition is in development — verify before citing.
> 3. Clear-zone width is a function of design speed, average daily traffic (ADT), and roadside slope; the RDG presents it as a curve table that designers interpolate.

## Purpose

The Roadside Design Guide complements the [Green Book](green-book-overview.md). Where the Green Book defines what the roadway looks like, the RDG defines what happens when a vehicle leaves the roadway. Its core premise is the *forgiving roadside* — that a properly designed roadside lets a driver who departs the travel way recover without hitting a fixed object or rolling.

The RDG is published by AASHTO, copyrighted, and sold through the [AASHTO Bookstore](obtaining-aashto.md). Do not reproduce its tables verbatim. Cite by edition and section.

## What the RDG covers

- **Clear zone.** The traversable, unobstructed area beyond the edge of the traveled way that a errant vehicle can use to recover. Width depends on design speed, ADT, and the cross-slope of the roadside (foreslope, backslope, or ditch).
- **Roadside slope and ditch design.** Recoverable, non-recoverable, and critical slopes; preferred ditch shapes; the interaction between foreslope, ditch bottom, and backslope.
- **Barrier warrants.** When to install a longitudinal barrier rather than flatten the roadside or remove the hazard. The decision is based on the consequence of striking the hazard versus the consequence of striking the barrier; barriers are themselves rigid hazards and should only be installed when justified.
- **Barrier types and selection.** W-beam guardrail, thrie-beam, cable barrier, concrete barrier (F-shape, single-slope, New Jersey profile), and bridge rails. Selection considers deflection, height, drainage, snow plowing, and aesthetic context.
- **Terminals and transitions.** End treatments for guardrail (energy-absorbing terminals), transitions from flexible to rigid barrier, and length-of-need calculations.
- **Crash cushions and energy attenuators.** For point hazards in gores, bridge piers, and toll booths. Selection accounts for design speed, redirect-versus-capture, and the available footprint.
- **Work-zone considerations.** Temporary barrier, drums, and channelizers; refer to [MUTCD](mutcd-overview.md) Part 6 for traffic-control plan requirements.

## Hardware acceptance: NCHRP 350 vs. MASH

Roadside hardware must meet a national crash-test standard before it can be used on federal-aid projects. The older NCHRP Report 350 standard has been superseded by the FHWA *Manual for Assessing Safety Hardware* (MASH). Hardware crash-tested only to NCHRP 350 has phase-out dates in place. When specifying a guardrail terminal or attenuator, confirm the product is on the FHWA eligibility letter list under MASH.

## Applying clear zone width

The RDG presents the suggested clear zone as a function of three inputs:

1. **Design speed** of the roadway.
2. **Design-year ADT.**
3. **Roadside slope and direction** (fill foreslope, cut backslope, or level).

The base table gives a width range; a slope adjustment factor then expands or contracts that range. On steeper foreslopes the clear zone is wider, because a departing vehicle travels farther down-slope before it can recover. On level or gently sloped sections the clear zone is shorter.

Use the clear zone result as a *target*. Where the right-of-way, environmental constraints, or existing development make the target unattainable, document the deviation. If the clear-zone target cannot be met and a hazard is present within it, the design progresses through a hierarchy: first remove the hazard, second relocate it, third make it breakaway, fourth shield with a barrier, and last accept and document. The RDG's hazard-mitigation hierarchy is the controlling logic for that decision.

For Indiana projects, INDOT's design manual prescribes a specific clear-zone procedure that aligns with the RDG but tightens some inputs (for example, design-year ADT versus existing ADT). See the [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).

## Related pages

- [Green Book overview](green-book-overview.md)
- [MUTCD overview](mutcd-overview.md) — Part 6 (work zones) couples to RDG temporary barrier guidance.
- [Obtaining AASHTO publications](obtaining-aashto.md)
