---
title: "AASHTO Vertical Alignment Design"
section: standards/aashto
order: 22
visibility: public
tags: [aashto, vertical-alignment, k-value, sight-distance, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 3"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Sec. 3.4 (Vertical Alignment)"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. AASHTO Green Book Section 3.4 governs vertical alignment: maximum and minimum grades, vertical curve length, and the K-value method that ties curve length to required sight distance.
> 2. Crest curves are sized for stopping sight distance (and optionally passing sight distance); sag curves are typically controlled by headlight sight distance, with comfort, drainage, and appearance as secondary controls.
> 3. The K-value `K = L / A` (curve length divided by algebraic grade difference) is the design parameter the Green Book tabulates against design speed for each control.

## What AASHTO says

Vertical alignment in the Green Book is the sequence of straight grades (tangents) connected by parabolic vertical curves. Section 3.4 establishes maximum grades by functional class, terrain, and design speed (steeper grades are tolerated on lower-class roads, in mountainous terrain, and at lower design speeds), and a minimum grade of approximately 0.3 to 0.5 percent for drainage on curbed sections.

For vertical curves, the Green Book uses an equivalent-parabola model and expresses curve length in terms of `K`, the rate of vertical curvature. The minimum `K` for a crest curve is the value that places the driver's eye and an object on the road within stopping sight distance over the parabola; for a sag curve, the controlling case is normally headlight sight distance, with passenger comfort, drainage on curbed sections, and appearance as additional checks.

Where passing is permitted on a two-lane rural road, the crest curve must instead satisfy passing sight distance, which yields a substantially longer curve. Decision sight distance applies at locations where the driver must process unusual information (interchange exits, lane drops); see also Section 3.2.

## Key formulas / variables

Variables: `L` curve length (ft); `A` algebraic difference in grade (percent); `S` sight distance (ft); `h_1` driver eye height (ft); `h_2` object height (ft).

- **K definition:** `K = L / A`. Length per percent change in grade.
- **Crest curve, S < L:** `L = A S^2 / (100 (sqrt(2 h_1) + sqrt(2 h_2))^2)`.
- **Crest curve, S > L:** `L = 2 S - 200 (sqrt(h_1) + sqrt(h_2))^2 / A`.
- **Sag curve, headlight, S < L:** `L = A S^2 / (400 + 3.5 S)` (using AASHTO's 2-ft headlight height and 1-degree upward beam divergence).
- **Sag curve, headlight, S > L:** `L = 2 S - (400 + 3.5 S) / A`.
- **Sag curve, comfort:** `L = A V^2 / 46.5`, where `V` is design speed in mph.

The Green Book tabulates the resulting minimum `K` values against design speed for each control. Use the tabulated value rather than recomputing from formulas in design production.

## Common Civil 3D applications

- Build a design-check set that enforces minimum `K` for crest and sag against the project design speed. See [Profile design criteria](../../civil3d/profiles/profile-design-criteria.md) and [Vertical curve design](../../civil3d/profiles/index.md).
- Use the [Vertical curve design](../../engineering/roadway-design/vertical-curve-design.md) engineering page for worked examples.
- For sight-distance verification on the surface, use the corridor surface plus 3D Sight Distance check tools; see [Sight distance](../../engineering/roadway-design/sight-distance.md).

## What this guide can't reproduce

The Green Book tables of minimum `K` by design speed (Tables 3-34 through 3-37 in the 7th edition, similar numbering in the 8th) are copyrighted. The driver-eye height (3.5 ft) and object height (2.0 ft for SSD, 3.5 ft for PSD) used in the AASHTO derivations are stated in the policy and are reproduced widely in textbooks and state manuals.

## Related Indiana standards

- INDOT Indiana Design Manual, Part 5 (Roadway Design) Chapter 43 covers vertical alignment with INDOT-specific minimum K values. See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
