---
title: "Manning's n Value Table"
section: "engineering/hydraulics"
order: 15
visibility: public
tags: [mannings-n, roughness-coefficient, pipe, channel, hydraulics]
updated: 2026-05-06
sources:
  - title: "FHWA HDS-4, Introduction to Highway Hydraulics, Table 3-1"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/08090/08090.pdf
    verified: 2026-05-06
  - title: "Chow, V.T., Open-Channel Hydraulics, 1959, Table 5-6"
    url: https://archive.org/details/openchannelhydra0000chow
    verified: 2026-05-06
  - title: "FHWA HEC-22, Urban Drainage Design Manual"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. Manning's n is the roughness coefficient in Manning's equation. Lower n means a smoother surface and higher flow capacity at the same slope and size.
> 2. For storm sewer design, common values are: RCP 0.012-0.013, PVC/HDPE smooth-wall 0.009-0.012, corrugated metal 0.024, corrugated HDPE 0.018-0.024.
> 3. For natural channels, n can range from 0.025 (clean, straight) to 0.150+ (heavy brush, floodplain). Always document the basis for your n selection.

## Closed conduits (pipes)

| Material | n (typical design) | Range |
|---|---|---|
| Concrete pipe (RCP) | 0.013 | 0.011-0.015 |
| Concrete box culvert | 0.013 | 0.012-0.015 |
| PVC (smooth wall) | 0.010 | 0.009-0.011 |
| HDPE smooth-interior (dual wall) | 0.012 | 0.010-0.013 |
| HDPE corrugated | 0.022 | 0.018-0.025 |
| Corrugated metal pipe (CMP), 2-2/3 x 1/2 in | 0.024 | 0.022-0.027 |
| CMP, helical, 2-2/3 x 1/2 in | 0.024 | 0.022-0.026 |
| Structural plate CMP (6 x 2 in) | 0.034 | 0.030-0.036 |
| CMP, paved invert (smooth bottom) | 0.018 | 0.016-0.020 |
| Vitrified clay pipe (VCP) | 0.013 | 0.011-0.015 |
| Cast/ductile iron pipe (unlined) | 0.013 | 0.011-0.015 |
| Cast/ductile iron pipe (cement-lined) | 0.012 | 0.011-0.013 |
| Brick | 0.015 | 0.013-0.017 |
| Steel pipe (bare) | 0.012 | 0.010-0.014 |

## Lined channels

| Lining type | n (typical design) | Range |
|---|---|---|
| Concrete, trowel finish | 0.013 | 0.011-0.015 |
| Concrete, float finish | 0.015 | 0.013-0.017 |
| Concrete, formed (no finish) | 0.017 | 0.014-0.020 |
| Grouted riprap | 0.028 | 0.025-0.032 |
| Stone masonry | 0.032 | 0.025-0.035 |
| Asphalt, smooth | 0.013 | 0.012-0.015 |
| Asphalt, rough | 0.016 | 0.015-0.018 |

## Unlined channels — excavated or dredged

| Channel type | n (typical design) | Range |
|---|---|---|
| Earth, clean, straight, uniform | 0.022 | 0.018-0.025 |
| Earth, clean, winding | 0.025 | 0.023-0.030 |
| Earth, with gravel bottom | 0.025 | 0.022-0.030 |
| Earth, with cobble bottom | 0.030 | 0.025-0.035 |
| Earth, with short grass | 0.027 | 0.022-0.033 |
| Dragline-excavated, no vegetation | 0.028 | 0.025-0.033 |
| Rock cut, smooth | 0.035 | 0.025-0.040 |
| Rock cut, jagged | 0.040 | 0.035-0.050 |

## Natural streams

| Description | n (typical design) | Range |
|---|---|---|
| Clean, straight, full stage | 0.030 | 0.025-0.033 |
| Clean, winding, some pools/shoals | 0.040 | 0.033-0.045 |
| Sluggish, deep pools, weedy | 0.070 | 0.050-0.080 |
| Heavy brush, timber | 0.100 | 0.075-0.150 |
| Floodplain, short grass | 0.030 | 0.025-0.035 |
| Floodplain, cultivated, no crop | 0.030 | 0.020-0.040 |
| Floodplain, cultivated, mature row crops | 0.035 | 0.030-0.040 |
| Floodplain, scattered brush | 0.050 | 0.035-0.070 |
| Floodplain, heavy timber | 0.100 | 0.080-0.120 |

## Grass channels (by retardance class)

Grass-lined channels have variable n depending on grass height, density, and flow depth. The FHWA retardance classes:

| Retardance class | Cover | n at shallow flow | n at deep flow |
|---|---|---|---|
| A (very high) | Weeping lovegrass, 30 in | 0.15+ | 0.05 |
| B (high) | Bermudagrass, 6 in | 0.10 | 0.04 |
| C (moderate) | Grass-legume mix, 6-8 in | 0.07 | 0.03 |
| D (low) | Bermudagrass, mowed 2 in | 0.05 | 0.025 |
| E (very low) | Short grass, < 2 in | 0.035 | 0.020 |

For grass channels, n decreases as flow depth increases (the grass bends over). Use the FHWA methodology or Chow's tables rather than a single fixed value.

## Selecting n for design

- Use the **typical design value** for new, clean pipe and channels.
- For aged pipe, consider a 10-20% increase in n to account for sediment, joint irregularities, and biological growth.
- For natural streams, base the selection on field inspection, cross-section photographs, and comparison with published reference photos (USGS WSP-1849).
- Document the selected n value and its basis in the hydraulic report.

## Related

- [Manning's equation reference](mannings-reference.md)
- [HGL calculation](hgl.md)
- [HEC-RAS basics](hec-ras-basics.md)
