---
title: "Peaking Factor Derivation (Babbitt, Harmon, Mason, Ten States)"
section: "engineering/sanitary-sewer-design"
order: 30
visibility: public
tags: [peaking-factor, babbitt, harmon, mason, ten-states, flow-estimation, sanitary-design]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateNetwork, EditPipeNetwork]
relatedCalculators: [sanitary-sewer-sizing, peaking-factor]
updated: 2026-05-11
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §11.232"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "ASCE/EWRI Manual of Practice No. 60 (Gravity Sanitary Sewer Design and Construction), 2nd ed., Chapter 4"
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-11
  - title: "Babbitt and Baumann, Sewerage and Sewage Treatment (8th ed., 1958)"
    url: https://archive.org/details/sewerageandsewag002728mbp
    verified: 2026-05-11
  - title: "Harmon (1918), 'Forecasting Sewage at Toledo Under Dry-Weather Conditions', Engineering News-Record"
    url: https://archive.org/details/engineeringnews80newyuoft
    verified: 2026-05-11
---

> **TL;DR**
> 1. Peaking factor (PF) converts **average daily flow** to **peak hourly flow** for sanitary design. The three classic regressions are **Babbitt** (`PF = 5 / P^0.2`), **Harmon** (`PF = 1 + 14 / (4 + P^0.5)`), and **Mason** (variations of these).
> 2. P in all forms is **population in thousands**. For small subdivisions (P < 1,000 → use P = 1 thousand) PF approaches 4 to 5; for large basins PF settles near 1.8 to 2.0.
> 3. Ten States §11.232 publishes a peaking curve that is essentially **Babbitt** for small populations and trends toward Harmon for large ones; **most Indiana permits accept either Babbitt or Harmon if applied consistently**.

## Why peaking factors exist

Domestic wastewater flow varies through the day: peaks around 7-9 am and 6-8 pm, troughs at 2-5 am. The peak hour is what the sewer must convey at design slope and velocity. Direct measurement is rare; instead, an empirical multiplier (PF) is applied to the metered or projected average daily flow (ADF). PF decreases with basin size because peaks from many sub-basins partially cancel.

## The three classic formulas

All use P = population in thousands.

### Babbitt (Babbitt & Baumann 1958)

`PF = 5 / P^0.2`

Best fit for small populations (P < ~10 thousand). Tends to over-predict for large basins.

### Harmon (1918)

`PF = 1 + 14 / (4 + P^0.5)`

Originated from Toledo, OH flow data. Better fit for medium-to-large basins. Asymptote at P -> infinity is PF = 1.0, which is unrealistically low; in practice it bottoms out around 1.8.

### Mason (variations)

Several "Mason" curves exist in older texts (Fair, Geyer & Okun 1966; ASCE MOP 9). The most common form (sometimes called "Mason 1957"):

`PF = 1 + 18 / (4 + P^0.5)`

Roughly midway between Babbitt and Harmon for medium populations.

## Ten States Standards §11.232

Ten States publishes a peaking-curve figure (not a closed-form equation). Sampled values:

| Population (thousands) | Ten States PF |
|---|---|
| 0.1 | ~4.3 |
| 0.5 | ~3.5 |
| 1.0 | ~3.0 |
| 5.0 | ~2.4 |
| 10 | ~2.2 |
| 50 | ~1.9 |
| 100 | ~1.8 |

These are read from the Ten States §11.232 figure; values shown are commonly cited but the official source is the published figure itself.

## Comparison

| P (thousands) | Babbitt | Harmon | Mason | Ten States |
|---|---|---|---|---|
| 0.1 | 5/0.1^0.2 = 7.92 | 1+14/(4+0.316)=4.24 | 1+18/(4+0.316)=5.17 | ~4.3 |
| 1.0 | 5.00 | 1+14/5=3.80 | 1+18/5=4.60 | ~3.0 |
| 10 | 3.15 | 1+14/(4+3.16)=2.95 | 1+18/(4+3.16)=3.51 | ~2.2 |
| 100 | 1.99 | 1+14/(4+10)=2.00 | 1+18/(4+10)=2.29 | ~1.8 |

Babbitt is highest for very small basins and drops below Harmon around P = 10 thousand.

## When to use which

- **Indiana subdivisions (P typically 0.1 to 5 thousand):** Babbitt or Ten States curve. Babbitt gives the most conservative PF and is widely accepted by the IDEM Construction Permit program.
- **Trunk sewers serving entire cities (P > 50 thousand):** Harmon or Ten States. Babbitt over-predicts.
- **Interceptor / regional plants:** Harmon, or a custom factor from flow monitoring data.
- **INDOT facilities / state projects:** Defer to Ten States curve as the IDEM regulatory floor.

## Adding inflow / infiltration (I/I)

I/I is **additive after** the peaking factor:

`Qpeak = PF × Qavg + Q_I/I`

Ten States §11.24 allows **200 gpd per inch-diameter per mile** for new construction; existing systems are determined by flow monitoring (commonly 500-1,500 gpd per inch-diameter per mile depending on age).

## Worked example

300-lot subdivision in Hamilton County. Population estimate at 2.7 persons/EDU = 810 people = 0.81 thousand.

Average daily flow at Ten States §11 default 100 gpcd:
`Qavg = 810 × 100 = 81,000 gpd = 81,000 / (1.547 × 10^6 / 1 cfs/mgd × 1000) = 0.125 cfs (or 0.0814 mgd)`

(Convert: 1 mgd = 1.547 cfs, so 0.081 mgd × 1.547 = 0.125 cfs.)

Babbitt PF = 5 / 0.81^0.2 = 5 / 0.958 = 5.22.
Harmon PF = 1 + 14 / (4 + 0.81^0.5) = 1 + 14 / 4.90 = 3.86.
Ten States ≈ 3.2 (interpolated from the curve at P = 0.81).

Peak (Babbitt): 0.125 × 5.22 = 0.653 cfs.
I/I at 200 gpd / inch-mile × 8 in × 1.2 mi = 1,920 gpd = 0.003 cfs (negligible for short new sewers).

Qpeak ≈ 0.66 cfs. Compare to 8-in @ 0.40% full-pipe capacity = 0.70 cfs. **Marginal** — bump to 0.45% slope or upsize the downstream-most segment.

Same site with Harmon: Qpeak ≈ 0.48 cfs, comfortably under capacity. This is why the choice of formula matters — Babbitt forces an upsize; Harmon does not. Most Indiana reviewers want Babbitt for the small-subdivision case.

## Common review comments

- Used Harmon for a 200-lot subdivision — most reviewers want Babbitt for small populations.
- Applied PF to peak-hour flow rather than average — PF converts ADF to peak-hour; do not stack.
- Forgot the I/I term — required by Ten States §11.24.
- Used residential density assumption (2.7 ppl/EDU) on a commercial project — commercial uses metered demand or AWWA/UWMP equivalents, not residential per-capita.

## Related

- [Flow estimation (breadth)](../sanitary-sewer/flow-estimation.md)
- [Pipe sizing and slopes](../sanitary-sewer/pipe-sizing-and-slopes.md)
- [Minimum velocity and slope](minimum-velocity-and-slope.md)
- [Sanitary sewer sizing calculator](/tools/sanitary-sewer-sizing)
- [Peaking factor calculator](/tools/peaking-factor)
