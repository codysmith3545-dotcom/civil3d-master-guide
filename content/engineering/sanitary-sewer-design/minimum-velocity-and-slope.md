---
title: "Minimum Velocity and Slope (sanitary sewer)"
section: "engineering/sanitary-sewer-design"
order: 20
visibility: public
tags: [sanitary-sewer, minimum-velocity, minimum-slope, self-cleansing, ten-states, manning, partial-flow]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateNetwork, EditPipeNetwork, ApplyRules]
relatedCalculators: [mannings, sanitary-sewer-sizing]
updated: 2026-05-11
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §33"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "ASCE/EWRI Manual of Practice No. 60 (Gravity Sanitary Sewer Design and Construction), 2nd ed."
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-11
  - title: "Indiana 327 IAC 3 (Wastewater Construction Permits)"
    url: https://www.in.gov/legislative/iac/title327.html
    verified: 2026-05-11
  - title: "Chow, Open-Channel Hydraulics (1959), partial-flow tables"
    url: https://archive.org/details/openchannelhydra0000chow
    verified: 2026-05-11
---

> **TL;DR**
> 1. The self-cleansing criterion in Ten States Standards §33.4 is **2.0 ft/s at design (peak) flow** computed by Manning's equation at the design depth — full pipe for most sizing tables.
> 2. Minimum slopes follow from 2.0 ft/s full-pipe with `n = 0.013`: **0.40% for 8 in**, 0.28% for 10 in, 0.22% for 12 in, 0.15% for 15 in.
> 3. The often-quoted **0.4 ft/s minimum** comes from older texts and applies to design checks at average daily flow (not peak); it is not a Ten States criterion but is enforced by some agencies for upper-reach pipes serving fewer than ~50 EDU.

## The self-cleansing principle

Solids (grit, fecal matter, paper) settle when the shear stress on the pipe invert drops below about 0.10 lb/sf for typical wastewater (Yao 1974; ASCE MOP 60 §6). For a circular pipe flowing full, that shear stress corresponds roughly to a velocity of 2.0 ft/s for typical diameters and slopes — hence the convention.

The criterion is **velocity at design (peak hourly) flow**, not average daily flow. In a new subdivision sewer that may serve only a few homes initially, the peak flow can be tiny and velocities low; this is the trade-off in greenfield design. Use a flush program until the system fills out.

## Manning's equation (full pipe)

For circular pipe flowing full:

`Q = (1.486 / n) A R^(2/3) S^(1/2)`
`V = (1.486 / n) R^(2/3) S^(1/2)`

with `A = π D^2 / 4`, `R = D / 4` (in feet, D in feet).

Ten States Standards specifies **n = 0.013** for PVC, vitrified clay, and concrete for design. The actual hydraulic n for new SDR-35 PVC is closer to 0.009 to 0.010, but 0.013 is the regulatory floor (provides margin for sags, biofilm, joints, aging).

## Minimum slope table (PVC, n = 0.013, full-pipe velocity = 2.0 ft/s)

Derived directly from `V = (1.486 / 0.013) × (D/4)^(2/3) × S^0.5 = 2.0`:

| Diameter | Min slope (ft/ft) | Min slope (%) | Q at min slope (cfs) | Q at min slope (mgd) |
|---|---|---|---|---|
| 8 in (0.667 ft) | 0.00400 | 0.40 | 0.70 | 0.45 |
| 10 in (0.833 ft) | 0.00280 | 0.28 | 1.10 | 0.71 |
| 12 in (1.000 ft) | 0.00220 | 0.22 | 1.55 | 1.00 |
| 15 in (1.250 ft) | 0.00150 | 0.15 | 2.45 | 1.58 |
| 18 in (1.500 ft) | 0.00120 | 0.12 | 3.50 | 2.26 |
| 21 in (1.750 ft) | 0.00100 | 0.10 | 4.85 | 3.13 |
| 24 in (2.000 ft) | 0.00080 | 0.08 | 6.30 | 4.07 |
| 27 in (2.250 ft) | 0.00067 | 0.067 | 8.0 | 5.18 |
| 30 in (2.500 ft) | 0.00058 | 0.058 | 10.0 | 6.46 |

These match Ten States Standards §33.4 minimum-slope table. Indiana 327 IAC 3 references Ten States by adoption.

## Partial-flow effects

Pipes do not run full at every flow. For circular pipes the velocity reaches **about 1.14 × Vfull** at d/D ≈ 0.80, then drops slightly to Vfull at d/D = 1.0. The flow Q reaches **about 1.07 × Qfull** near d/D = 0.94. This is why "full-pipe" tables are conservative for velocity in the d/D = 0.5 to 0.9 range.

Selected ratios (from Chow 1959 / ASCE MOP 60 Table 6-4):

| d/D | V/Vfull | Q/Qfull |
|---|---|---|
| 0.10 | 0.40 | 0.021 |
| 0.20 | 0.62 | 0.088 |
| 0.30 | 0.78 | 0.196 |
| 0.40 | 0.90 | 0.337 |
| 0.50 | 1.00 | 0.500 |
| 0.60 | 1.07 | 0.671 |
| 0.70 | 1.12 | 0.838 |
| 0.80 | 1.14 | 0.968 |
| 0.90 | 1.12 | 1.066 |
| 1.00 | 1.00 | 1.000 |

Use this to verify the design depth is in a reasonable range. Many agencies require d/D ≤ 0.5 at peak flow for 8-in to 15-in to keep ventilation cross-section; larger pipes can be designed for d/D up to 0.75.

## The 0.4 ft/s "minimum" — what it really is

Older state plumbing codes and some Indiana cities reference a **0.4 ft/s** minimum velocity. This is from work by Camp (1946) and is a **minimum at average daily flow** for grit-free domestic wastewater. It is not in Ten States Standards. Where enforced (a handful of Indiana communities, primarily for upper-reach pipes), it requires steeper slopes than Ten States minimums on lightly loaded reaches.

## Maximum velocity

There is no Ten States hard maximum, but practical limits:

- **Above ~15 ft/s** invert scour becomes significant; use ductile iron, lined RCP, or HDPE.
- **Above ~10 ft/s** in a typical PVC main, specify anchor blocks per Ten States §33.81.
- **Slopes above ~10%** require anchor blocks (every 36 ft for slopes > 20%, every 24 ft for slopes > 35%).

## Worked example

8-in main, target peak flow Qp = 0.50 cfs. At minimum slope (0.40%, full-pipe Q = 0.70 cfs):

`Q/Qfull = 0.50 / 0.70 = 0.714`

Read d/D ≈ 0.62 from the partial-flow table. V/Vfull ≈ 1.08. Vfull = Q/A_full = 0.70 / (π × 0.667^2 / 4) = 0.70 / 0.349 = 2.00 ft/s; partial-flow V ≈ 2.16 ft/s. Meets 2.0 ft/s self-cleansing criterion.

At average daily flow Qavg = 0.10 cfs (peak factor 5): Q/Qfull = 0.143, d/D ≈ 0.27, V/Vfull ≈ 0.75 -> V ≈ 1.5 ft/s. Below 2.0 ft/s but above the older 0.4 ft/s threshold. This is the design compromise — meet self-cleansing at peak; expect occasional flushing on lightly loaded reaches.

## Common review comments

- 8-in main at exactly 0.40% over a long flat reach — paper-compliant but construction tolerance puts it below grade. Carmel and Westfield require 0.45% minimum on 8-in.
- Used `n = 0.010` (true PVC hydraulic n) instead of `n = 0.013` (Ten States design n) — fail.
- Did not check minimum velocity at peak flow on the upper-reach pipes — required.
- Velocity check used full-pipe rather than design-depth — usually conservative, but flag for partial-flow correction on flat or low-flow reaches.

## Related

- [Pipe sizing and slopes (breadth)](../sanitary-sewer/pipe-sizing-and-slopes.md)
- [Ten States Standards summary](../sanitary-sewer/ten-states-standards.md)
- [Manhole spacing and drop structures](manhole-spacing-and-drop-structures.md)
- [Peaking factor derivation](peaking-factor-derivation.md)
- [Manning's calculator](/tools/mannings)
- [Sanitary sewer sizing calculator](/tools/sanitary-sewer-sizing)
