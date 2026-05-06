---
title: "Inlet Sizing and Gutter Spread"
section: "engineering/stormwater"
order: 90
visibility: public
tags: [stormwater, inlet, gutter, spread]
updated: 2026-05-06
sources:
  - title: "FHWA HEC-22, Urban Drainage Design Manual, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 204 (Pavement Drainage)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
  - title: "FHWA HEC-12 (superseded by HEC-22, but still referenced for grate efficiency charts)"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Inlets intercept stormwater from the gutter and direct it into the storm sewer. The design objective is to limit **gutter spread** (the width of flow encroaching on the travel lane) to the value specified by the road classification — typically the **shoulder width** or **half the travel lane** for the design storm.
> 2. Compute gutter flow with the **modified Manning equation** for triangular cross sections: `Q = (Kc/n) Sx^(5/3) S^(1/2) T^(8/3)`, where Kc = 0.56 (U.S. customary), Sx is the cross slope (ft/ft), S is the longitudinal slope (ft/ft), and T is the spread (ft).
> 3. Inlet types: **grate** (good on grade), **curb opening** (better for debris), **combination** (most efficient for high flows), and **slotted drain**. Efficiency depends on grade, cross slope, flow depth, and grate/opening geometry.
> 4. **Sag inlets** (at low points) must capture **100%** of the gutter flow because there is no bypass route. Size for ponding depth — typically keep the water surface below the gutter lip.

## Spread criteria

Spread is the width of stormwater flow in the gutter measured from the curb face toward the travel lane. Allowable spread is set by road classification and agency standards. INDOT Design Manual Chapter 204 and HEC-22 Table 4-1 provide:

| Road classification | Design storm | Allowable spread |
|---|---|---|
| High-speed arterial (≥ 45 mph) | 10-yr | Shoulder width; no encroachment on travel lane |
| Low-speed arterial (< 45 mph) | 10-yr | Shoulder + half of the outside travel lane |
| Collector | 10-yr | Half of the outside travel lane |
| Local / residential | 10-yr | Half of the outside travel lane (some agencies allow full lane) |
| Interstate / freeway (INDOT) | 10-yr | Shoulder width |

Some Indiana cities use a 25-yr design storm for arterials or specify a maximum ponding depth (typically 4 in to 6 in at the curb line). Confirm the local standard.

## Gutter flow equation

For a standard triangular gutter (uniform cross slope from curb to crown), the Manning equation for shallow triangular flow is:

`Q = (0.56 / n) Sx^(5/3) S^(1/2) T^(8/3)`

where Q is flow in cfs, n is Manning's roughness (0.016 for concrete gutter, 0.013 for smooth asphalt, 0.018 for rough asphalt), Sx is the pavement cross slope (ft/ft, typically 0.02 to 0.04), S is the longitudinal gutter slope (ft/ft), and T is the spread (ft).

Rearranging for T:

`T = [Q n / (0.56 Sx^(5/3) S^(1/2))]^(3/8)`

### Composite gutters

Many streets have a depressed gutter section (6 in to 8 in wide, 2 in to 4 in deep) adjacent to the curb, with a different cross slope than the pavement. HEC-22 Chapter 4 provides composite-gutter flow equations that split the flow into two zones (gutter section and pavement section). The depressed gutter carries a disproportionate share of the flow due to the steeper cross slope.

## Inlet types and efficiency

### Grate inlets

A cast-iron or steel grate set flush with the gutter. Flow passes through the grate openings into a catch basin below. Grate inlets are effective on grade (longitudinal slopes 0.5% to 6%) because the grate intercepts flow passing over it.

- **Efficiency on grade** — depends on the grate length (parallel to flow), the bar spacing, and the gutter flow velocity. Longer grates (4 ft to 6 ft) intercept more flow. HEC-22 Chapter 4 provides efficiency equations.
- **Splash-over velocity** — at high velocities (typically > 3 to 5 ft/s depending on the grate type), flow splashes over the grate and bypasses. Reduce efficiency accordingly.
- **Clogging** — assume 50% clogging (blocked area) for design unless a maintenance program justifies a lower factor. INDOT uses a 50% clogging factor for grate inlets.

### Curb-opening inlets

A vertical opening in the curb face, typically 4 in to 6 in high and 5 ft to 15 ft long, with a depressed gutter or local depression to direct flow into the opening.

- **Efficiency on grade** — depends on the opening length, the depression depth and width, the longitudinal slope, and the cross slope. Curb openings are less efficient than grates on steep grades but handle debris better.
- **On grade, length for 100% interception**: `LT = 0.6 Q^0.42 S^0.3 [1/(n Sx)]^0.6` (HEC-22 Eq. 4-22, U.S. customary). The actual opening length L divided by LT gives the efficiency E.
- **Advantages**: less prone to clogging by leaves and debris than grate inlets; bicycle-safe.

### Combination inlets

A grate inlet with a curb opening on the upstream side. The curb opening intercepts debris and flow along the curb; the grate handles the wider spread. Combination inlets are the most efficient type for high-flow conditions and are the standard for sag locations.

### Slotted drains

A continuous narrow slot in the pavement (typically 1 in to 2 in wide) connected to a below-grade pipe. Used along medians, across wide pavements, and at garage entries. Effective for intercepting sheet flow but susceptible to clogging.

## Sag inlets (low points)

At a sag (low point in the road profile), all gutter flow from both sides converges on the inlet. There is no downstream outlet for bypass flow, so the inlet must capture **100%** of the design flow. Design for the sag condition:

- **Weir flow** (shallow ponding, depth < height of curb opening or grate opening):
  `Q = Cw L d^(3/2)` for a curb opening, where Cw is the weir coefficient (about 2.3 for depressed curb openings, 3.0 for grate openings), L is the effective perimeter or opening length, and d is the depth of flow at the inlet.
- **Orifice flow** (deeper ponding, depth > height of opening):
  `Q = Co A (2 g d)^(1/2)` where Co is the orifice coefficient (about 0.67), A is the clear opening area, and d is the depth of water above the centroid of the opening.
- **Clogging** — apply a 50% clogging factor to grate inlets at sag locations. This is critical because a clogged sag inlet can pond water across the entire road.

Many agencies require **flanking inlets** on each side of a sag inlet (typically 50 ft to 100 ft upstream on each approach) to provide backup interception if the sag inlet clogs.

## INDOT spread and inlet standards

INDOT Design Manual Chapter 204 specifies:

- **Design storm**: 10-yr for most roads; 50-yr check for depressed roads where ponding could create a hydroplaning hazard.
- **Spread on freeways**: within the shoulder width.
- **Spread on arterials and collectors**: shoulder + no more than 3 ft into the travel lane (or half the travel lane, whichever is less).
- **Minimum longitudinal gutter slope**: 0.3% (0.5% preferred). Flat grades (< 0.3%) require continuous drainage or closely spaced inlets.
- **Inlet type**: combination inlets at sag locations; grate or combination on grade. INDOT specifies particular grate types (e.g., Type C or Type D) in its Standard Drawings.

## Practical workflow

1. **Delineate the contributing area** to each inlet from the grading plan.
2. **Compute the gutter flow** at each inlet location using the rational method (`Q = CiA`) with the 10-yr intensity at Tc for the pavement drainage area (Tc for gutter flow is short — often 5 to 10 minutes).
3. **Compute the spread** from the gutter flow equation. If the spread exceeds the allowable value, add an inlet upstream to reduce the contributing area.
4. **Select the inlet type and size** — compute the interception efficiency using HEC-22 methods. If the efficiency is less than 100% on grade, the bypass flow carries forward to the next inlet downstream.
5. **At sag locations**, size the inlet for 100% capture at the weir or orifice condition, with a 50% clogging factor applied, and check the ponding depth against the allowable.
6. **Document** the spread, efficiency, and bypass for each inlet in a drainage table on the construction plans.

## Common review issues

- Spread exceeds the allowable for the road classification — add an inlet upstream.
- Sag inlet sized without a clogging factor — apply 50% minimum.
- No flanking inlets at a sag — required by many agencies as a backup.
- Grate inlet on a bicycle route — curb opening or combination inlet is safer for cyclists.
- Flat gutter grade (< 0.3%) with inlets spaced at 300+ ft — spread is excessive; reduce spacing.
- Drainage table omitted from the plans — most agencies require a tabulation of inlet-by-inlet interception, spread, and bypass.

## Related

- [Rational method and Tc](rational-method-and-tc.md)
- [Storm pipe design](storm-pipe-design.md)
- [SSA workflow](ssa-workflow.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
