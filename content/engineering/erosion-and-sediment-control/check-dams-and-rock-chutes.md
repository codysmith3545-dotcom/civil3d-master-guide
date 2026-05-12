---
title: "Check Dams and Rock Chutes (sizing, spacing, materials)"
section: "engineering/erosion-and-sediment-control"
order: 40
visibility: public
tags: [check-dam, rock-chute, riprap, blanket, jute, indiana-cgp, indot]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCalculators: [mannings, rational-method]
updated: 2026-05-11
sources:
  - title: "Indiana Stormwater Quality Manual (IDEM), Check Dam specification"
    url: https://www.in.gov/idem/stormwater/2389.htm
    verified: 2026-05-11
  - title: "INDOT Indiana Design Manual, Chapter 205"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
  - title: "NCSU Stormwater BMP Manual, Channel Stabilization"
    url: https://www.deq.nc.gov/about/divisions/energy-mineral-land-resources/stormwater/stormwater-program/stormwater-design-manual
    verified: 2026-05-11
  - title: "USACE EM 1110-2-1601 (Hydraulic Design of Flood Control Channels)"
    url: https://www.publications.usace.army.mil/portals/76/publications/engineermanuals/em_1110-2-1601.pdf
    verified: 2026-05-11
---

> **TL;DR**
> 1. Check dams reduce velocity and trap sediment in temporary channels and ditches. Indiana practice: **rock check dams 2 ft high maximum** with the center 6 in lower than the abutments to force overflow over the center.
> 2. Spacing is set so the **toe of the upstream dam is at the same elevation as the crest of the downstream dam** — typically 50 ft for 4% slope, 100 ft for 2% slope, 200 ft for 1% slope.
> 3. Liner choice by channel velocity: **jute / coir** to ~3 ft/s, **straw/coconut blanket** to ~6 ft/s, **turf reinforcement mat (TRM)** to ~10 ft/s, **riprap** above that. Use the NCSU permissible-velocity table.

## Check dams

Check dams are temporary structures placed across drainage channels to slow flow and pond water, allowing sediment to settle. They are used in:

- Temporary diversion ditches and interceptors.
- Construction-phase swales before vegetation is established.
- Drainage paths where pavement runoff is concentrated during construction.

### Materials

- **Rock check dam** — clean stone (Class A or INDOT #2 / #4) piled across the channel. Indiana standard.
- **Sandbag check dam** — short-lived, used where rock is impractical; less effective than rock.
- **Compost-filled fiber log (silt log / wattle)** — flexible, biodegradable, suited to low-flow swales.
- **Triangular silt dike** — pre-fabricated geotextile-wrapped foam wedge, for short, narrow ditches with light loads.

Indiana CGP and most MS4s default to rock for any channel expected to carry concentrated flow during construction.

### Geometry

Indiana Stormwater Quality Manual standard rock check dam:

- **Height:** 2 ft maximum (3 ft maximum in some county standards for INDOT facilities).
- **Center crest:** 6 in below the abutment crest, to direct flow over the center and away from the channel banks.
- **Side slopes:** 2H:1V on the upstream face, 3H:1V on the downstream face.
- **Key:** the dam keys into the channel banks at least 6 in to prevent flanking.
- **Apron:** stone apron on the downstream side, 4 ft long minimum, to dissipate energy.

### Spacing rule

Spacing is set by the rule **toe of upstream dam = crest of downstream dam**:

`L = (h_crest - h_toe) / S = h_overall / S`

For 2-ft tall dams (crest at +2.0, downstream toe at 0.0 in local datum):

| Channel slope (%) | Spacing (ft) |
|---|---|
| 0.5 | 400 |
| 1.0 | 200 |
| 2.0 | 100 |
| 3.0 | 67 |
| 4.0 | 50 |
| 5.0 | 40 |
| 6.0 | 33 |
| 8.0 | 25 |

Above 8% slope check dams alone are usually inadequate — pair with a temporary chute or convert to riprap-lined channel.

## Channel lining selection — permissible velocity

Permissible velocity is the maximum flow velocity a lining can tolerate without unraveling or eroding. Common values (NCSU BMP Manual / NRCS):

| Lining | Permissible velocity (ft/s) | Duration |
|---|---|---|
| Bare soil (loam) | 1.5-2.5 | Erosion immediate above |
| Vegetated grass, established | 4-5 | Long-term |
| Jute mesh | 1.5-3.0 | Short-term, low flow |
| Coir / coconut fiber blanket | 3-5 | Medium-term |
| Straw blanket (S75) | 1.5-3.0 | Short-term, < 6 mo |
| Excelsior wood-fiber blanket | 3-5 | Medium-term |
| Turf reinforcement mat (TRM) | 8-10 (vegetated), 6-7 (unvegetated) | Permanent |
| Class 1 riprap (D50 ~6 in) | 6-9 | Permanent |
| Class 2 riprap (D50 ~9 in) | 9-13 | Permanent |
| Concrete | > 20 | Permanent |

Sizes are typical Indiana product designations; the specific manufacturer's certified velocity is what gets approved.

## Rock chutes

Where a channel transitions across a steep grade (typically > 8%) a rock chute provides a permanent or semi-permanent path. Design (NCSU + USACE EM 1110-2-1601):

1. **D50** of the rock sized by:
    `D50 ≥ 0.5 × V^2 / (2 g (SG - 1))`
    where V = chute velocity, SG ≈ 2.65 for granite.
2. **Layer thickness** ≥ 1.5 × D50 or 12 in, whichever is greater.
3. **Filter** beneath the riprap: woven geotextile (AOS appropriate for native soil) plus a 3-6 in granular filter blanket.
4. **Side slopes** of the chute 2H:1V maximum to keep stone stable on the banks.
5. **Bottom width** sized by Manning with `n = 0.040-0.050` for riprap, S = chute slope. Often 6-8 ft for typical subdivision discharges.
6. **Length** = horizontal projection of the slope being traversed; add 4-ft apron at the toe to dissipate hydraulic jump.

### Worked example: rock chute sizing

50-ac subdivision discharging via a temporary chute on a 12% existing slope, 60-ft long. Q (10-yr) = 18 cfs at the chute entry.

- Try W = 6 ft bottom, side slopes 2H:1V, n = 0.045, S = 0.12. Manning: depth ≈ 0.6 ft, V ≈ 5.0 ft/s. Acceptable.
- Required D50 = 0.5 × 5.0^2 / (2 × 32.2 × (2.65 - 1)) = 12.5 / 106.3 = 0.118 ft ≈ 1.4 in. **Use D50 = 6 in (Class 1 riprap, INDOT B)** for construction tolerance and Indiana-typical permissible velocity margin.
- Riprap thickness = 1.5 × 6 = 9 in → use 12 in nominal.
- Geotextile separator (Mirafi 140N or equivalent) under riprap.
- 4-ft riprap apron at toe.

(Verify against the actual NOAA Atlas 14 flow on the channel and against the specific INDOT riprap class table.)

## When to step up from blanket to riprap

A common decision point on subdivision interceptor ditches:

- Q × n / (W × S^0.5) gives flow regime; if V at design flow > 5 ft/s, blankets are not adequate.
- If V > 5 ft/s but ≤ 10 ft/s, use TRM (with vegetation establishment) or riprap.
- If V > 10 ft/s, use riprap or concrete.

For temporary construction channels under construction conditions, riprap is often selected because vegetation is not yet established and TRM permissible velocities drop without it.

## Common review comments

- Check dam spacing on a 4% slope set at 100 ft — should be 50 ft for 2-ft dams.
- Center of check dam crest at the same elevation as the abutments — flow attacks the bank instead of crossing the center.
- Jute mesh on a 7% temporary channel — exceeds permissible velocity; bump to TRM or riprap.
- Riprap chute with no filter — undermines as fines wash out.
- No apron at the downstream toe of a rock chute — bank erosion immediately downstream.

## Related

- [Erosion & sediment (breadth)](../erosion-and-sediment/index.md)
- [Stabilization (breadth)](../erosion-and-sediment/stabilization.md)
- [BMPs (breadth)](../erosion-and-sediment/bmps.md)
- [SWPPP requirements](swppp-requirements.md)
- [Silt fence installation](silt-fence-installation.md)
- [Manning's calculator](/tools/mannings)
