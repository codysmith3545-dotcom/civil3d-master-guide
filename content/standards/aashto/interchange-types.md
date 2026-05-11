---
title: "AASHTO Interchange Types"
section: standards/aashto
order: 28
visibility: public
tags: [aashto, interchange, diamond, cloverleaf, spui, ddi, ramp-metering, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 10"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Ch. 10"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. AASHTO Green Book Chapter 10 catalogs grade-separated interchange forms by traffic pattern and right-of-way footprint: diamond, partial cloverleaf (parclo), full cloverleaf, single-point urban interchange (SPUI), diverging diamond interchange (DDI), and freeway-to-freeway directional/trumpet.
> 2. Form selection trades off right-of-way (cloverleaf is large, DDI is compact), construction cost, weaving (full cloverleaf has loop-to-loop weaves), and signal control of the at-grade crossroad (DDI and SPUI run two-phase, parclo runs three- or four-phase).
> 3. Ramp metering is a freeway operations tool that pulses ramp release with a signal at the ramp terminal to smooth merges; AASHTO references the FHWA *Ramp Management and Control Handbook* for design.

## What AASHTO says

Chapter 10 distinguishes service interchanges (freeway-to-arterial) from systems interchanges (freeway-to-freeway). Service interchanges are the bulk of the catalog because most interchange decisions are arterial-crossing-freeway questions.

**Diamond.** The simplest service form. Two ramps per quadrant (one entrance, one exit), at-grade signalized intersections at the ramp terminals. Compact footprint, three-phase signal each side, susceptible to spillback into the freeway off-ramp at saturated locations.

**Partial cloverleaf (parclo).** Replaces one or two ramps in a diamond with a loop ramp to remove a left-turn movement from the at-grade signal. Variants: parclo A (loops in advance of the structure), parclo B (loops past the structure), and asymmetric configurations (A2, B2, AB). Reduces signal phasing demand at the cost of right-of-way for the loops.

**Full cloverleaf.** Four loops, no signals at the at-grade. Lowest signal delay but loop-to-loop weaving sections on the freeway require collector-distributor roads at any meaningful traffic volume; rarely built new today.

**Single-point urban interchange (SPUI).** Both crossroad left-turn movements meet at a single signalized point under (or over) the freeway. Two-phase signal, very high capacity for the footprint, but the structure span is wide and expensive.

**Diverging diamond interchange (DDI).** Crossroad traffic crosses to the left side of the median between the ramp terminals, eliminating the left-turn-across-opposing conflict at the ramp terminals. Two-phase signal at each crossover, very high left-turn capacity. AASHTO recognized the DDI in the 7th edition; FHWA published a separate DDI informational guide.

**Freeway-to-freeway (systems).** Directional ramps with high design speeds, no loops on high-volume movements. Trumpet for terminating freeways at junctions with a single freeway.

**Ramp metering.** A signal at the freeway entrance ramp releases vehicles one at a time (single-lane meter) or two at a time (dual-lane meter) to manage merge headways into the freeway. Effective at smoothing recurring congestion. The Green Book references the FHWA *Ramp Management and Control Handbook* and the *Ramp Metering Design Manual*.

## Key formulas / variables

Interchange design is geometric layout rather than formula-driven. Key variables: ramp design speed (Green Book Table 10-x ranges from 25 to 85 percent of mainline design speed depending on form), ramp gradient (limited by truck climbing), and ramp terminal sight distance (decision sight distance applies — see [Sight distance types](sight-distance-types.md)).

## Common Civil 3D applications

- Model each ramp as its own corridor with its own assembly; build the gore area as a feature line / grading group.
- Use 3D intersections or manually built corridors at the ramp terminals; verify swept paths.
- For DDIs and SPUIs, the at-grade signal phasing affects the storage geometry — coordinate with traffic engineering.

## What this guide can't reproduce

The Green Book figures of the standard interchange types, ramp design speed tables, and gore-area layout details are copyrighted. FHWA DDI and SPUI informational guides and the Ramp Management and Control Handbook are open-access on the FHWA website.

## Related Indiana standards

- INDOT IDM Part 5 Chapter 48 covers interchanges. Indiana has prominent DDI installations (e.g., I-65 / SR 32 in Lebanon, US 31 corridor work in Hamilton County). See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
