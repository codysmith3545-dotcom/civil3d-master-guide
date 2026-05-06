---
title: "Culvert Hydraulic Control"
section: "engineering/hydraulics"
order: 30
visibility: public
tags: [culvert, inlet-control, outlet-control, headwater, hds-5, fhwa]
updated: 2026-05-06
sources:
  - title: "FHWA HDS-5, Hydraulic Design of Highway Culverts, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/12026/hif12026.pdf
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 205 (Culverts)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. A culvert operates under **inlet control** when the inlet geometry limits flow (steep barrel, small inlet) or **outlet control** when downstream conditions or barrel friction govern (mild slope, long culvert, high tailwater).
> 2. Design procedure: compute headwater (HW) for both control types at the design flow; the **higher HW governs**. Size the culvert so HW does not exceed the allowable headwater depth.
> 3. Entrance loss coefficients (K_e) range from 0.2 (beveled headwall) to 0.9 (projecting end with no headwall). Better entrances significantly reduce required culvert size.

## Inlet vs outlet control

### Inlet control

The culvert barrel can carry more flow than the inlet can accept. The barrel flows partly full, and the hydraulics are controlled entirely by the inlet geometry. Inlet control occurs when:

- The barrel slope is steep relative to the flow depth.
- The barrel is short and friction losses are small.
- The tailwater is well below the outlet.

Headwater for inlet control is calculated from empirical charts or equations in FHWA HDS-5, based on the inlet type (headwall, wingwall, projecting, mitered to slope) and the ratio of flow to barrel area.

### Outlet control

The culvert barrel is the bottleneck — friction losses, exit losses, and/or tailwater control the headwater. The barrel typically flows full or nearly full. Outlet control occurs when:

- The barrel slope is mild.
- The culvert is long (high friction losses).
- The tailwater is above the outlet crown.

Headwater for outlet control is calculated from the energy equation:

`HW = TW + h_f + h_e + h_x - L × S_o`

where TW = tailwater depth, h_f = barrel friction loss, h_e = entrance loss, h_x = exit loss, L = barrel length, and S_o = barrel slope.

## Entrance loss coefficients (K_e)

The entrance loss: `h_e = K_e × V² / (2g)`

| Entrance type | K_e |
|---|---|
| Square edge with headwall | 0.5 |
| Groove end (socket) with headwall | 0.2 |
| Groove end projecting | 0.2 |
| Beveled ring (33.7 or 45 degree) | 0.2 |
| Headwall with 45-degree wingwalls | 0.4 |
| Headwall with 30-degree wingwalls | 0.4 |
| Mitered to slope (CMP) | 0.7 |
| Projecting end (thin wall, CMP) | 0.9 |
| End section (CMP, manufactured) | 0.5 |

Using a better entrance (e.g., beveled edge vs square edge) reduces headwater and may allow a smaller culvert.

## Design procedure (FHWA HDS-5 method)

1. **Determine design flow** — use the rational method, SCS method, or regional regression equations for the design return period (typically 25-year or 50-year for cross-drainage culverts; 100-year check for overtopping).
2. **Set allowable headwater (HW_allow)** — the maximum water depth upstream of the culvert. Commonly limited to: the depth that does not overtop the road, the depth that does not flood upstream property, or 1.0 to 1.5 times the culvert rise.
3. **Select trial size and material.**
4. **Compute HW for inlet control** from HDS-5 charts or equations.
5. **Compute HW for outlet control** from the energy equation.
6. **The higher HW governs** the design. If HW > HW_allow, increase the culvert size or improve the entrance.
7. **Check outlet velocity** — high exit velocities require energy dissipation (riprap apron, stilling basin).

## Tailwater determination

- If the culvert discharges into a channel, compute the normal depth in the downstream channel at the design flow (using Manning's equation).
- If the culvert discharges into a pond or reservoir, use the pond stage at the design flow.
- If tailwater is unknown, use the larger of critical depth and (D_c + D)/2 at the outlet.

## Outlet velocity and energy dissipation

Outlet velocities from culverts often exceed the erosion threshold of the downstream channel. Common countermeasures:

- **Riprap apron** — sized for the exit velocity and pipe diameter. INDOT standard details specify riprap size and apron dimensions.
- **Stilling basin** — for high velocities (> 15 ft/s) or large culverts.
- **Plunge pool** — natural or constructed, for cascading outlets.

## INDOT requirements

- Cross-drainage culverts on state routes: 25-year design storm, 100-year check storm.
- Minimum culvert size: 18 inches (INDOT standard), though 15 inches is allowed on low-volume local roads.
- Allowable headwater: typically 1.0 to 1.5 times the culvert rise, not exceeding the roadway shoulder elevation.
- All culverts on state routes require an HY-8 or equivalent hydraulic analysis.

## Related

- [Manning's equation reference](mannings-reference.md)
- [Critical depth](critical-depth.md)
- [HGL calculation](hgl.md)
- [Energy and momentum](energy-and-momentum.md)
