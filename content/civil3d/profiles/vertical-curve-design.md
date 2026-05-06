---
title: "Vertical Curve Design"
section: "civil3d/profiles"
order: 20
visibility: public
tags: [vertical-curve, k-value, crest-curve, sag-curve, pvi, pvc, pvt, sight-distance]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPROFILELAYOUT, EDITPROFILE, PROFILELAYOUTPARAMS]
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th Edition"
    note: "Tables 3-34 (crest SSD K-values) and 3-36 (sag headlight K-values). Copyrighted — values summarized here; consult the full table in the Green Book."
  - title: "Autodesk Civil 3D Help — Vertical Curve Overview"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-6A583B45-B6F0-4022-88D5-51BCC2990E70"
updated: 2026-05-06
---

> **TL;DR**
> 1. Vertical curves connect tangent grades at a PVI; **crest** curves go from ascending to descending (or less ascending), **sag** curves from descending to ascending (or less descending). The curve type determines the controlling sight-distance criterion.
> 2. The **K-value** (K = L / A, where L is curve length in feet and A is the algebraic difference in grades in percent) is the primary design parameter. AASHTO Table 3-34 gives minimum K for crest curves based on stopping sight distance; Table 3-36 gives minimum K for sag curves based on headlight sight distance.
> 3. Civil 3D can insert vertical curves by **K-value**, **curve length**, or **passing-through elevation**. Design-check sets flag violations against AASHTO or custom criteria in real time.

## Vertical curve geometry

A vertical curve in highway design is almost always a **symmetrical parabola** — the curve length is split equally on each side of the PVI. Civil 3D also supports asymmetrical parabolas (different lengths on each side), but these are uncommon in standard road design.

### Key points on a vertical curve

| Point | Meaning |
|---|---|
| **PVI** | Point of Vertical Intersection — where the two tangent grades would meet if extended |
| **PVC** | Point of Vertical Curvature — the beginning of the curve, at station = PVI station - L/2 |
| **PVT** | Point of Vertical Tangency — the end of the curve, at station = PVI station + L/2 |
| **High/Low point** | The station where the curve's grade is zero (exists only when the entering and exiting grades have opposite signs or the curve reverses direction) |

### Parabolic equation

For a symmetrical parabola with entering grade g1 (%) and exiting grade g2 (%):

```
Elevation at distance x from PVC = Elev_PVC + g1*x/100 + ((g2 - g1) / (2 * L)) * x^2 / 100
```

where x and L are in the same linear unit (typically feet).

## K-value

The K-value normalizes curve length by the grade change so designers can compare curves of different magnitudes:

```
K = L / A
```

- **L** = curve length (ft)
- **A** = |g2 - g1| (algebraic difference of grades, in percent)

A higher K means a flatter, longer curve. Minimum K-values are set by sight-distance requirements.

## AASHTO minimum K-values (summary)

The following values are representative minimums for stopping sight distance (SSD) on level terrain. The full tables in the Green Book include adjustments for downgrades and other criteria. These are copyrighted AASHTO values; consult the current edition for binding design.

### Crest curves — minimum K for SSD (AASHTO Table 3-34, selected rows)

| Design speed (mph) | SSD (ft) | Min K (crest) |
|---|---|---|
| 25 | 155 | 12 |
| 30 | 200 | 19 |
| 35 | 250 | 29 |
| 40 | 305 | 44 |
| 45 | 360 | 61 |
| 50 | 425 | 84 |
| 55 | 495 | 114 |
| 60 | 570 | 151 |
| 65 | 645 | 193 |
| 70 | 730 | 247 |

### Sag curves — minimum K for headlight sight distance (AASHTO Table 3-36, selected rows)

| Design speed (mph) | SSD (ft) | Min K (sag) |
|---|---|---|
| 25 | 155 | 26 |
| 30 | 200 | 37 |
| 35 | 250 | 49 |
| 40 | 305 | 64 |
| 45 | 360 | 79 |
| 50 | 425 | 96 |
| 55 | 495 | 115 |
| 60 | 570 | 136 |
| 65 | 645 | 157 |
| 70 | 730 | 181 |

Sag K-values are controlled by headlight beam geometry (3.5 ft headlight height, 1-degree upward divergence). Crest K-values are controlled by driver eye height (3.5 ft) and object height (2.0 ft for SSD).

## High and low point calculation

The high point of a crest curve (or low point of a sag curve) occurs at the station where the instantaneous grade is zero:

```
x_highlow = -g1 * L / (g2 - g1)
```

measured from the PVC. If the computed x is outside the range 0 to L, the curve has no internal high or low point (both grades are in the same direction, and the extreme elevation is at one end).

The high/low point matters for drainage design — sag low points are where water collects and inlets must be placed.

## Creating vertical curves in Civil 3D

When drawing a layout profile with `CREATEPROFILELAYOUT`, the Profile Layout Tools toolbar offers several curve-fitting options:

1. **Free Vertical Curve (Parabola)** — pick two tangent segments, then specify curve length or K-value.
2. **Free Vertical Curve (Circular)** — circular arcs are rare in highway design but used in some rail or special applications.
3. **Floating Curve** — constrained to pass through a specific point (useful when matching an existing pavement elevation).
4. **Fixed Curve** — fully constrained by start, end, and a third parameter.

You can also insert curves after the fact: select the profile, right-click a PVI grip, and choose **Insert Vertical Curve**. Enter the K-value or length. Civil 3D calculates the other parameter and adjusts the PVC/PVT stations.

### Curve settings dialog

Before drawing, open Curve Settings in the Profile Layout Tools toolbar to set:

- Curve type: parabola (default) or circular.
- Default K-value or default curve length.
- Whether to apply curves automatically at every PVI as you draw tangents.

## Asymmetrical vertical curves

An asymmetrical parabola has L1 (PVC to PVI) different from L2 (PVI to PVT). The total length is L1 + L2. Civil 3D supports these; they are used occasionally when:

- A short curve is needed on one side to meet a constraint (bridge deck, existing pavement).
- The profile must pass through a fixed elevation at a specific station on one side of the PVI.

Specify asymmetrical curves in the Profile Layout Parameters editor by entering different values for the two half-lengths.

## Related

- [Surface profiles vs layout profiles](surface-vs-layout-profiles.md)
- [Profile design criteria](profile-design-criteria.md)
- [Editing profiles](editing-profiles.md)
- [Profile labels](profile-labels.md)
