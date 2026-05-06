---
title: "Storm Pipe Design"
section: "engineering/stormwater"
order: 100
visibility: public
tags: [stormwater, storm-pipe, hydraulics, hgl]
updated: 2026-05-06
sources:
  - title: "FHWA HEC-22, Urban Drainage Design Manual, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 205 (Storm Drains)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
  - title: "FHWA HDS-5, Hydraulic Design of Highway Culverts, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/12026/hif12026.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. Size gravity storm pipes using **Manning's equation** for full-pipe or partial-pipe flow: `Q = (1.486/n) A R^(2/3) S^(1/2)`. Design for the **10-yr storm** on local streets (25-yr or 50-yr on arterials and collectors); check the **100-yr** for surcharge/flooding.
> 2. Maintain a minimum **self-cleaning velocity of 2.5 ft/s** (some agencies require 3.0 ft/s) at the design flow. Maximum velocity typically **15 ft/s** (higher velocities erode pipe joints and structures).
> 3. Perform an **HGL/EGL analysis** for the entire storm sewer system from the outfall upstream. The HGL must stay below the inlet rim (grate or throat) at every structure under the design storm to prevent surface flooding.
> 4. Minimum cover is typically **1.0 ft to 1.5 ft** for reinforced concrete pipe (RCP) and **2.0 ft to 3.0 ft** for thermoplastic pipe (PVC, HDPE), depending on traffic loading.

## Manning's equation for storm pipes

`Q = (1.486/n) A R^(2/3) S^(1/2)`

For a circular pipe flowing full: A = pi D^2 / 4, R = D / 4.

| Pipe material | Manning n |
|---|---|
| Reinforced concrete (RCP) | 0.012–0.013 |
| PVC (smooth wall, SDR-35 or ASTM F679) | 0.009–0.011 |
| HDPE (smooth interior, ASTM F714) | 0.009–0.012 |
| Corrugated metal (CMP, annular) | 0.022–0.027 |
| Corrugated HDPE (smooth interior) | 0.012 |
| Corrugated HDPE (corrugated interior) | 0.018–0.025 |

Use the value required by the reviewing agency. INDOT specifies n = 0.012 for concrete and n = 0.012 for smooth-interior HDPE; many Indiana cities use 0.013 for concrete and 0.011 for PVC as conservative design values.

## Minimum pipe size

- **15 in** is the minimum storm sewer diameter in most Indiana cities and INDOT standards.
- **12 in** is accepted by some municipalities for short laterals from a single inlet to the trunk.
- Smaller diameters (10 in, 8 in) are not acceptable for public storm sewers — clogging risk is too high.

## Minimum slope and velocity

The pipe slope must produce a self-cleaning velocity at the design flow (or at full-pipe capacity, depending on the local convention):

- **Minimum velocity**: 2.5 ft/s (INDOT and most Indiana cities). Some agencies require 3.0 ft/s.
- **Minimum slope** for common diameters at n = 0.013, V = 2.5 ft/s full-pipe:

| Diameter | Min slope (%) |
|---|---|
| 15 in | 0.35 |
| 18 in | 0.27 |
| 24 in | 0.17 |
| 30 in | 0.12 |
| 36 in | 0.09 |
| 42 in | 0.07 |
| 48 in | 0.06 |

Maximum velocity is generally **15 ft/s**. Above this, erosion of pipe joints, energy dissipation at structures, and downstream scour become concerns. Use riprap or energy dissipators at the outfall when the pipe discharges at high velocity.

## Pipe material selection

Common storm sewer materials in Indiana:

- **Reinforced concrete pipe (RCP)** — ASTM C76, Class III, IV, or V depending on fill height and traffic loading. The standard for public storm sewers in most Indiana cities. Available 12 in to 144 in.
- **PVC** — ASTM D3034 (SDR-35) for 4 in to 15 in; ASTM F679 for 18 in to 36 in. Lighter weight, lower friction, resistant to H2S corrosion. Many Indiana cities accept PVC for storm sewers up to 24 in or 36 in.
- **HDPE (smooth interior)** — ASTM F714 or AASHTO M294 Type S. Used for directional-drilled crossings and in fill situations where differential settlement is a concern. Flexible; requires careful bedding.
- **Corrugated metal pipe (CMP)** — galvanized or aluminized steel. Rarely specified for new public storm sewers in Indiana due to corrosion; still used for temporary drainage and agricultural crossings.

Match the material to the local utility's approved-materials list. INDOT maintains a list of approved pipe products in its Recurring Special Provision for Pipe Culverts.

## HGL/EGL analysis

The hydraulic grade line (HGL) and energy grade line (EGL) analysis confirms that the storm sewer system has adequate capacity under the design storm without surcharging above the inlet rims.

### What HGL and EGL are

- **EGL** = the total energy head at any point = elevation head + pressure head + velocity head (z + P/gamma + V^2/2g).
- **HGL** = EGL minus the velocity head = z + P/gamma. For a pipe flowing full, HGL represents the water surface elevation in the pipe (or in the structure above the pipe if the HGL is above the crown).

### Analysis procedure (starting at the outfall)

1. **Set the starting HGL at the outfall.** If the outfall discharges to a channel or pond, the starting HGL is the water surface elevation in the receiving water at the design storm. If the outfall is free (unsubmerged), the starting HGL is at the pipe crown or the critical depth, whichever is higher.
2. **Work upstream pipe by pipe.** For each pipe reach:
   - Compute friction loss: `hf = (n Q / (1.486 A R^(2/3)))^2 x L / (R^(4/3))` or equivalently from Manning's equation rearranged for slope times length.
   - Add junction losses at each structure: `hj = K V^2/(2g)`, where K is a loss coefficient that depends on the structure type, pipe angles, and size changes. Typical K values: 0.5 for a straight-through manhole, 1.0 for a 90-degree bend, 0.2 for a 45-degree bend, 1.5 for an inlet with flow entering from the surface.
3. **Compare the computed HGL at each structure to the inlet rim (grate lip or throat).** If the HGL is above the rim, the inlet will surcharge and water will pond on the surface.
4. **If the HGL exceeds the rim at any structure**, upsize the pipe, increase the slope, or reduce the contributing flow by adding additional inlets upstream.

### INDOT and local standards

- INDOT Design Manual Chapter 205 requires the HGL to remain at least **1.0 ft below the inlet grate** for the design storm (10-yr or 50-yr depending on the road classification).
- Many Indiana cities require the HGL to stay below the grate lip for the 10-yr storm and check that the 100-yr HGL does not flood travel lanes or building entrances.

## Minimum cover

| Pipe material | Min cover (trafficked) | Min cover (non-trafficked) |
|---|---|---|
| RCP, Class III+ | 1.0 ft | 1.0 ft |
| PVC (SDR-35, ASTM F679) | 2.0–3.0 ft | 1.5 ft |
| HDPE (smooth interior) | 2.0–3.0 ft | 1.5 ft |
| CMP | 1.0–1.5 ft | 1.0 ft |

Cover is measured from the top of pipe to the finished grade (or bottom of pavement section). INDOT requires minimum 1.0 ft for RCP and 2.0 ft for flexible pipe under highways. Where minimum cover cannot be met, concrete encasement or a stronger pipe class is required.

## Junction and structure losses

At each manhole, junction box, or inlet structure, energy is lost due to flow direction changes, expansion, contraction, and turbulence. The loss coefficient K depends on the geometry:

| Condition | K (typical) |
|---|---|
| Straight through, no size change | 0.2–0.5 |
| 45-degree bend | 0.3–0.5 |
| 90-degree bend | 0.8–1.2 |
| Inlet (flow from surface into structure) | 1.0–1.5 |
| Manhole with opposing inflows | 1.5–2.0 |
| Size increase (expansion) | 0.3–0.5 |

FHWA HEC-22 Chapter 7 provides detailed methods for computing composite K values at complex junctions. For routine design, the simplified K-value approach is accepted by most Indiana agencies.

## Common review issues

- No HGL analysis submitted — required for any storm sewer system with more than 2 or 3 structures.
- HGL above the grate rim at a sag inlet — the sewer is undersized or the outfall tailwater is too high.
- Minimum velocity not met on a flat reach — increase slope or reduce diameter (but not below the minimum).
- Junction loss coefficients omitted — HGL is underestimated; the system may not have the capacity shown.
- Outfall tailwater assumed at pipe invert but the receiving channel is at a higher stage during the design storm — re-run the HGL with the correct tailwater.
- CMP specified for a public storm sewer — not accepted by most Indiana cities for permanent installations.

## Related

- [Inlet sizing](inlet-sizing.md)
- [Rational method and Tc](rational-method-and-tc.md)
- [SSA workflow](ssa-workflow.md)
- [Detention sizing](detention-sizing.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
