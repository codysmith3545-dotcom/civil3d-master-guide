---
title: "Hydraulic Grade Line (HGL) Calculation"
section: "engineering/hydraulics"
order: 25
visibility: public
tags: [hgl, hydraulic-grade-line, storm-sewer, energy-grade-line, junction-losses, manhole]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [EditPipeNetwork, AnalyzePipeNetwork, CreatePipeNetwork]
updated: 2026-05-06
sources:
  - title: "FHWA HEC-22, Urban Drainage Design Manual, 3rd ed., Chapter 7"
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 204 (Storm Drainage)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. The HGL check verifies that the water surface in a storm sewer system stays below the rim (ground surface) of every structure. If HGL exceeds the rim, the system surcharges — water comes out of the manhole.
> 2. Start at the outfall with the tailwater elevation. Work upstream, adding **pipe friction losses** (Manning's) and **junction losses** (energy, bend, expansion, contraction) at each structure.
> 3. If HGL is within 1 ft of a rim, most agencies require the pipe to be upsized or the slope to be increased.

## Energy and hydraulic grade lines

- **Energy Grade Line (EGL)** — the total energy at any point: EGL = pipe invert elevation + pressure head (flow depth for gravity pipe) + velocity head (V²/2g).
- **Hydraulic Grade Line (HGL)** — HGL = EGL - velocity head. In a gravity pipe, the HGL represents the water surface.

For full-pipe (pressurized) flow, HGL is above the pipe crown. For open-channel flow (not full), HGL is at the water surface inside the pipe.

## HGL calculation procedure

Work from the outfall upstream:

### Step 1: Establish tailwater (TW) at the outfall

- If the outfall discharges into a channel or pond, TW = the flood elevation in the receiving body for the design storm.
- If TW is unknown, a common assumption is TW = the crown of the outfall pipe or (D_c + D)/2, whichever is higher, where D_c is the critical depth.
- INDOT requires TW to be at or above the pipe crown at the outfall for the HGL check.

### Step 2: Compute friction loss in each pipe

Using Manning's equation for full-pipe flow:

`h_f = (Q × n / (0.4632 × D^(8/3)))² × L / S` — but more directly:

`S_f = (Q n / (0.4632 D^(8/3)))²`

`h_f = S_f × L`

where S_f is the friction slope, L is the pipe length, Q is the design flow, n is Manning's n, and D is the pipe diameter. For full pipe conditions, this simplifies to h_f = S × L where S is the pipe slope, but only when the design flow equals the full-pipe capacity.

### Step 3: Compute junction (minor) losses at each structure

Junction losses at manholes and junctions are computed as:

`h_j = K × (V²/2g)`

where K is the loss coefficient and V is the velocity in the outlet pipe. The total junction loss includes components for:

- **Access hole (manhole) loss** — base K from HEC-22 methodology, typically 0.1 to 1.0 depending on the structure's benching and flow depth.
- **Angle correction** — for changes in horizontal alignment. K increases with the deflection angle.
- **Plunging flow correction** — when an incoming pipe enters above the water surface in the structure.
- **Pipe size change** — expansion (pipe gets smaller upstream) or contraction losses.

HEC-22 provides the composite loss method:

`K = K_o × C_D × C_d × C_Q × C_p × C_B`

where K_o = initial loss coefficient (based on structure size relative to outlet pipe), and C_D through C_B are correction factors for flow depth, pipe diameter change, lateral flow, plunging flow, and benching.

Simplified loss coefficients (when the full HEC-22 method is not required):

| Condition | K |
|---|---|
| Straight through, matched crowns | 0.2 |
| 15-degree bend | 0.3 |
| 30-degree bend | 0.4 |
| 45-degree bend | 0.5 |
| 60-degree bend | 0.6 |
| 90-degree bend | 0.8 |
| Manhole with lateral inflow | 0.5-1.0 |

### Step 4: Sum losses upstream

At each structure, the HGL on the upstream side is:

`HGL_upstream = HGL_downstream + h_f (pipe friction) + h_j (junction losses)`

Continue upstream through every pipe and structure until you reach the most upstream inlet.

### Step 5: Check against rim elevations

At every structure, compare HGL to the rim elevation:

- HGL below rim: acceptable.
- HGL within 1.0 ft of rim: marginal — many agencies require redesign.
- HGL above rim: surcharge condition — not acceptable for most design storms (10-year for INDOT).

## Velocity head considerations

When pipe sizes change, the velocity head changes. If the upstream pipe has a lower velocity than the downstream pipe, the velocity head difference is recovered (partially). If the upstream pipe has a higher velocity, an expansion loss applies. Keep track of the EGL as well as the HGL to account for velocity-head transitions correctly.

## INDOT requirements

INDOT IDM Chapter 204 requires:

- HGL check for the 10-year design storm on all state-route storm sewer systems.
- HGL must be at least 1.0 ft below all rim elevations for the 10-year storm.
- Use the HEC-22 energy-loss method for junction losses.

## Civil 3D workflow

The Storm and Sanitary Analysis (SSA) extension in Civil 3D performs the HGL analysis using the rational method or user-input hydrographs. After running the analysis, review the HGL profile in the pipe network profile view. Structures where HGL exceeds the rim are flagged.

## Related

- [Manning's equation reference](mannings-reference.md)
- [Manning's n value table](mannings-n-table.md)
- [Energy and momentum](energy-and-momentum.md)
- [Critical depth](critical-depth.md)
