---
title: "AASHTO Green Book 7th Edition (2018) Overview"
section: standards/aashto
order: 21
visibility: public
tags: [aashto, green-book, geometric-design, 7th-edition]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018)"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018"
    verified: 2026-05-11
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 8th Edition (2024)"
    url: "https://store.transportation.org/"
    citation: "AASHTO 2024"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. The AASHTO Green Book 7th edition (2018) was the controlling geometric-design policy reference in the United States from 2018 until the 8th edition (2024) was released, and remains in active use on legacy projects whose design criteria memos lock in the 7th edition.
> 2. The 7th edition reorganized chapters around a performance-based framework: design controls and design speed first, then elements of design, then cross section, then a chapter per functional class, then intersections and interchanges.
> 3. Many state DOT manuals — including INDOT's IDM — were keyed to the 7th edition through 2024 and are still being updated to reference the 8th edition; verify which edition your project is using before pulling values.

## What AASHTO says

The 7th edition of *A Policy on Geometric Design of Highways and Streets* was published in 2018 and superseded the 6th edition (2011). It is a single-volume policy that frames geometric design around three controls: the design vehicle, the design driver, and the design speed. It does not mandate values; instead, it tabulates ranges and minimums that state DOTs adopt by reference, then modify in their own design manuals.

The 7th edition introduced a more explicit performance-based design philosophy than earlier editions. Designers are encouraged to consider context (rural vs. urban, suburban, and "town" overlay zones), all road users (drivers, pedestrians, cyclists, transit riders), and the full set of likely outcomes for a chosen geometry, rather than chasing the highest-speed minimum. Controlling criteria for design exception requests were also revisited — see Chapter 1 for the criteria list and the design-exception decision framework.

Chapter structure in the 7th edition (paraphrased table of contents):

- Chapter 1 — A Policy on Geometric Design (purpose, design controls, design exceptions).
- Chapter 2 — Design Controls and Criteria (vehicles, drivers, traffic).
- Chapter 3 — Elements of Design (sight distance, horizontal alignment, vertical alignment, combined alignment).
- Chapter 4 — Cross-Section Elements.
- Chapter 5 — Local Roads and Streets.
- Chapter 6 — Collector Roads and Streets.
- Chapter 7 — Rural and Urban Arterials.
- Chapter 8 — Freeways.
- Chapter 9 — Intersections.
- Chapter 10 — Grade Separations and Interchanges.

## Key formulas / variables

Formulas referenced throughout the 7th edition (formulas themselves are not copyrightable):

- **Stopping sight distance:** `SSD = 1.47 V t + V^2 / (30 (a/g +/- G))`, where `V` is design speed in mph, `t` is brake-reaction time in seconds, `a` is deceleration in ft/s^2, `g` is gravitational acceleration, and `G` is the grade as a decimal (positive uphill).
- **K-value (vertical curve):** `K = L / A`, where `L` is curve length in ft and `A` is the algebraic difference in grade in percent.
- **Minimum radius:** `R_min = V^2 / (15 (e + f))`, where `e` is superelevation rate (decimal) and `f` is side-friction factor.

Tabulated values for `t`, `a`, `f`, and design `e` are in the Green Book and are copyrighted; pull them from a licensed copy.

## Common Civil 3D applications

- Encode the chapter 3 design controls as design-check sets on alignments and profiles. See [Alignment design criteria](../../civil3d/alignments/design-criteria.md) and [Profile design criteria](../../civil3d/profiles/profile-design-criteria.md).
- Use the chapter 4 cross-section ranges to size assemblies. See [Assemblies and subassemblies](../../civil3d/corridors/assemblies-and-subassemblies.md).
- Use the chapter 9 intersection guidance during corridor and grading layout for at-grade intersections.

## What this guide can't reproduce

The 7th edition tables (SSD by design speed, K-values, superelevation distribution, lane and shoulder widths, sight-triangle dimensions, ramp design speeds) are copyrighted by AASHTO. Purchase the publication from the [AASHTO Store](https://store.transportation.org/Item/CollectionDetail?ID=180) or use the equivalent table in the controlling state design manual.

## Related Indiana standards

- [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md) — Indiana's overlay on AASHTO geometric design.
- [Green Book overview (current edition)](green-book-overview.md) — pointer to the 8th edition (2024).
