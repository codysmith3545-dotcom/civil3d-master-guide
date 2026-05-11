---
title: "AASHTO Cross-Section Elements"
section: standards/aashto
order: 25
visibility: public
tags: [aashto, cross-section, lane-width, shoulder, clear-zone, side-slope, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 4"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Ch. 4"
    verified: 2026-05-11
  - title: "AASHTO, Roadside Design Guide, 4th Edition (2011)"
    url: "https://store.transportation.org/"
    citation: "AASHTO RDG 2011"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. AASHTO Green Book Chapter 4 sets the building-block dimensions of the roadway cross section: travel lane, shoulder, curb-and-gutter, median, side slope, ditch, sidewalk, and bike facility.
> 2. Lane width on principal arterials is generally 11 to 12 ft; shoulder width depends on functional class and ADT, typically 4 to 12 ft on rural arterials, narrower on local roads, and broader on freeways.
> 3. Roadside slopes are categorized as recoverable (foreslope `4H:1V` or flatter), non-recoverable (between `3H:1V` and `4H:1V`), and critical (steeper than `3H:1V`); the Green Book and Roadside Design Guide together control selection.

## What AASHTO says

The cross section is everything between the two right-of-way lines: travel way, shoulders, curbs, medians, roadside, sidewalks, bike lanes, ditches, and back-slopes. Chapter 4 of the Green Book sets the dimensional ranges and the rationale; the [Roadside Design Guide](roadside-design-guide.md) refines the roadside portion (clear zone, slope category, drainage features).

**Travel lane.** Width affects capacity, comfort, and crash rate. The Green Book recommends 11 to 12 ft on arterials and high-volume collectors, with 10 ft tolerated on lower-class facilities and in restricted urban contexts. Wider lanes (greater than 12 ft) are usually unjustified and may encourage speeding.

**Shoulder.** Provides recovery space, breakdown space, and lateral support to the pavement structure. Width recommendations scale with functional class and design hourly volume. Paved-versus-graded shoulder choice depends on cost, maintenance, and snow-storage needs.

**Curb and gutter.** Used in urban contexts for drainage interception, channelization, pedestrian protection, and right-of-way definition. Vertical curbs (6-in face) are preferred at lower speeds; sloping curbs are used where mountable behavior is desired. Curbs introduce hazards at higher speeds and the Green Book discourages their use on facilities above approximately 45 mph.

**Median.** Separates opposing traffic. Categories: undivided (no median), flush, raised, or depressed. Width drives whether the median can be a clear zone, support a barrier, accommodate left-turn lanes, or host pedestrian refuges. Depressed medians on rural freeways are preferred where right-of-way allows.

**Roadside slopes.** Categorized as recoverable (`4H:1V` or flatter), non-recoverable (`3H:1V` to `4H:1V`, vehicle continues to ditch), and critical (steeper than `3H:1V`, rollover risk). The Green Book and RDG specify that critical slopes within the clear zone must be shielded or reshaped.

**Sidewalk and bike facility.** See [pedestrian](pedestrian-facility-aashto.md) and [bicycle](bicycle-facility-aashto.md) facility pages for AASHTO's separate guides.

## Key formulas / variables

Cross-section design is dimensional rather than formula-driven. The relevant variables are tabulated by design speed, functional class, and design-hour volume (DHV). Roadside slopes interact with the [Roadside Design Guide](roadside-design-guide.md) clear-zone tables.

## Common Civil 3D applications

- Build assemblies that match the project cross section. See [Assemblies and subassemblies](../../civil3d/corridors/assemblies-and-subassemblies.md).
- Use [Lane and shoulder widths](../../engineering/roadway-design/lane-and-shoulder-widths.md) and [Cross slope](../../engineering/roadway-design/cross-slope.md) for dimensional reference.
- Code surfaces and feature lines along edges of pavement, shoulder, and ditch flowlines for downstream drainage analysis.

## What this guide can't reproduce

Green Book Tables in Chapter 4 (lane and shoulder widths by class and DHV, median width recommendations, slope-category figures) are copyrighted. The Roadside Design Guide clear-zone curves are also copyrighted; see [Roadside Design Guide summary](roadside-design-guide-summary.md).

## Related Indiana standards

- INDOT IDM Part 5 prescribes Indiana cross-section dimensions, often tighter than the AASHTO range. See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md) and [INDOT standard drawings](../state-dot/indot-standard-drawings.md).
