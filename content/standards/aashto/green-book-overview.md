---
title: "AASHTO Green Book Overview"
section: "standards/aashto"
order: 20
visibility: public
tags: [aashto, green-book, geometric-design, alignment, profile, sight-distance, k-value]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateAlignmentEntities, CreateProfile, EditProfileDesignChecks]
updated: 2026-05-06
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 8th ed. (2024)"
    url: https://store.transportation.org/
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Part 5 — Roadway Design"
    url: https://www.in.gov/indot/engineering/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. The Green Book is AASHTO's *A Policy on Geometric Design of Highways and Streets*; the current edition is the 8th (2024).
> 2. It is the national consensus reference for design speed, stopping and passing sight distance, horizontal and vertical curvature, cross sections, intersections, and interchanges.
> 3. State DOTs adopt it by reference and then modify it through their own design manuals; always check the controlling state manual (in Indiana, the INDOT IDM) before locking in a value.

## What the Green Book is

*A Policy on Geometric Design of Highways and Streets* — universally called the Green Book for the color of its cover — is the American Association of State Highway and Transportation Officials' single-volume reference for geometric design. It establishes the framework for selecting design speed, classifying highways by functional class, and dimensioning the roadway in plan, profile, and cross section. Most U.S. design decisions trace back to its tables and figures.

The Green Book is a *policy*, not a code. It is enforceable only because state DOTs and the FHWA adopt it by reference for projects on the National Highway System and for state-funded work. It is copyrighted by AASHTO and sold through the AASHTO Bookstore — see [obtaining AASHTO publications](obtaining-aashto.md). This page summarizes structure and use; it does not republish tables or text.

## High-level chapter map

The 8th edition continues the structure that has been stable across recent editions:

- **Highway functions and design controls.** Functional classification (arterial, collector, local), design vehicles, traffic characteristics, design speed, and the relationship among them. This is where the design speed for a project is justified.
- **Elements of design.** Sight distance (stopping, passing, decision, intersection); horizontal alignment (superelevation, side friction, minimum radius); vertical alignment (grades, K-values for crest and sag curves); the combination of horizontal and vertical alignment.
- **Cross-section elements.** Lane widths, shoulders, curbs, medians, roadside slopes, drainage features, sidewalks, bicycle facilities.
- **Local roads and streets**, **collector roads and streets**, **rural and urban arterials**, **freeways.** Each functional class has its own chapter that tightens the general guidance into class-specific minimums and desirable values.
- **Intersections.** Layout, channelization, turn lane storage and taper, sight triangles, roundabouts.
- **Grade separations and interchanges.** Diamond, partial cloverleaf, single-point, diverging diamond, and other configurations; ramp design; weaving sections.

Cite by edition and section (for example, "Green Book, 8th ed., §3.4") rather than by page number; pagination changes between printings.

## How state DOTs adopt and modify

State DOTs do not blindly enforce the Green Book. Each state publishes a design manual that picks up the Green Book by reference, then modifies it for state conditions. The INDOT [Indiana Design Manual](../state-dot/indot-idm-chapter-map.md) is Indiana's controlling document. When state guidance and the Green Book conflict, the state manual governs work in that state. When the state manual is silent, the Green Book fills the gap.

Designers should read the project's design criteria memo first; it lists which controlling values come from which document and which design exceptions, if any, have been approved.

## Practical use of the tables

A few of the tables that show up most often in plan production:

- **Stopping sight distance vs. design speed.** Used to verify both crest vertical curve length and horizontal sight distance through curves with lateral obstructions.
- **K-values for crest and sag vertical curves.** K = L / A, where L is curve length in feet and A is the algebraic difference in grade in percent. The Green Book tabulates minimum K by design speed for each control (sight distance for crest, headlight for sag, drainage for sag). In Civil 3D, encode these as a design-check set on the profile and reference them during `EditProfileDesignChecks`.
- **Minimum radius vs. superelevation rate.** Tied to the design speed and the maximum superelevation rate adopted by the agency (commonly 6 percent or 8 percent for rural conditions).
- **Lane and shoulder widths by functional class and design volume.** Drives template assemblies.

Because the actual numbers are copyrighted, this page does not reprint them. Pull them from a licensed copy of the Green Book or from the equivalent table in the state design manual.

## Related pages

- [Roadside Design Guide](roadside-design-guide.md) — clear zones and barriers that wrap the geometric design.
- [LRFD Bridge Design Specifications](lrfd-bridge.md) — structures over and under the roadway.
- [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md) — Indiana's overlay.
- [Obtaining AASHTO publications](obtaining-aashto.md) — how to license your own copy.
