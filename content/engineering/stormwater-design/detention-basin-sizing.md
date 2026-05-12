---
title: "Detention Basin Sizing (modified rational, SCS routing, freeboard)"
section: "engineering/stormwater-design"
order: 30
visibility: public
tags: [detention, basin, modified-rational, scs, routing, level-pool, freeboard, multi-stage-outlet]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePondFromObject, CreateCatchment, EditPondProperties]
relatedCalculators: [detention-sizing, modified-rational, mannings]
updated: 2026-05-11
sources:
  - title: "USDA NRCS TR-55, Chapter 6 (Storage Volume for Detention Basins)"
    url: https://www.nrcs.usda.gov/sites/default/files/2022-10/TR-55.pdf
    verified: 2026-05-11
  - title: "USDA NRCS National Engineering Handbook, Part 630, Chapter 16 (Hydrographs)"
    url: https://directives.sc.egov.usda.gov/OpenNonWebContent.aspx?content=17755.wba
    verified: 2026-05-11
  - title: "Indiana Stormwater Quality Manual"
    url: https://www.in.gov/idem/stormwater/2389.htm
    verified: 2026-05-11
  - title: "INDOT Indiana Design Manual, Chapter 203 (Hydrology)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
  - title: "Indianapolis Stormwater Design and Specifications Manual"
    url: https://www.indy.gov/activity/storm-water-design-and-construction-specifications
    verified: 2026-05-11
---

> **TL;DR**
> 1. Detention storage is the area between the inflow and outflow hydrographs above the target release rate. For small simple sites estimate it with the **Modified Rational Method (MRM)**; for everything else **route an SCS hydrograph** through a stage-storage-discharge curve.
> 2. Indiana practice typically requires post-development peak flows for the 1-yr, 10-yr, and 100-yr storms to be at or below pre-development peaks, with **≥ 1.0 ft of freeboard** above the 100-yr WSE per the Indianapolis Stormwater Manual and most MS4 standards.
> 3. Always design a **multi-stage outlet**: water-quality orifice, channel-protection / 10-yr weir, 100-yr release, plus an **emergency spillway** sized for the 100-yr (or 500-yr for high-hazard) event assuming the primary outlet is plugged.

## Storage from a hydrograph

Storage required to attenuate an inflow peak `Qi` to an outflow peak `Qo` is the volume of the inflow hydrograph above `Qo`. TR-55 Chapter 6 (Equation 6-1) gives a quick approximation for the volume:

`Vs / Vr ≈ 0.682 - 1.43 (Qo/Qi) + 1.64 (Qo/Qi)^2 - 0.804 (Qo/Qi)^3`

where `Vs` is storage and `Vr` is the runoff volume of the inflow hydrograph. This is a reasonable first-pass for SCS Type II rainfall; final sizing should always be confirmed by routing.

## Modified Rational Method (MRM)

The MRM extends the rational hydrograph by varying storm duration `Td ≥ Tc` to find the duration that maximizes the required storage. For a constant outflow `Qo`:

`Vs(Td) = Vinflow(Td) - Voutflow(Td)`
`Vinflow(Td) = C · i(Td) · A · Td` (with consistent units; in U.S. customary, multiply by 60 to convert minutes to seconds when Q is in cfs)
`Voutflow(Td) = Qo · (Td + Tc)`  (TR-55 simplification — a trapezoidal release)

Iterate `Td` (5, 10, 15, ... min) and pick the `Td` that maximizes `Vs`. This is the critical duration.

MRM is appropriate when:

- Drainage area is under ~20 ac (the rational domain).
- A single homogeneous land cover and a single release rate.
- The agency accepts MRM. Most Indiana cities accept it for small commercial sites; many do not for subdivisions.

MRM typically over-sizes storage by 10% to 30% compared to a routed SCS hydrograph.

## SCS unit hydrograph + level-pool routing

For larger or staged sites:

1. **Build CN-based hydrographs** for each design storm (1-yr, 10-yr, 100-yr at minimum). Use 24-hr SCS Type II rainfall for Indiana (NRCS TR-20 / TR-55 convention). NOAA Atlas 14 supplies the depths.
2. **Stage-storage curve** from basin geometry. Use the average end area or prismoidal formula. Civil 3D's pond modeler builds this from a feature line. Output is `S = f(stage)`.
3. **Stage-discharge curve** from the outlet structure. Multi-stage riser typical:
    - Water-quality orifice low.
    - Channel-protection orifice or notch higher.
    - 10-yr weir / riser opening.
    - 100-yr release through the riser top.
    - Emergency spillway above the 100-yr WSE.
4. **Route** with the modified Puls (storage-indication) method:
    - `(2 S_{t+Δt} / Δt + O_{t+Δt}) = (I_t + I_{t+Δt}) + (2 S_t / Δt - O_t)`
    - The right side is known each step; the left side is a one-to-one function of stage via the storage-discharge curve.
5. **Check peaks vs target release rates** and check max WSE vs freeboard.
6. **Iterate outlet geometry** until all design events satisfy all criteria simultaneously.

HydroCAD, HEC-HMS, Civil 3D Storm and Sanitary Analysis (SSA), and Bentley PondPack all implement this. Civil 3D SSA expects you to define basin nodes, outlet structures, and the routing time step (typically 1 min for small ponds, 5 min for larger systems).

## Indiana criteria summary

Confirm with the local technical standards. Pattern across most Indiana MS4 communities:

| Criterion | Typical requirement |
|---|---|
| Water-quality volume (WQv) | First 1.0 in or 1.25 in of runoff from impervious area, drawdown 24-72 hr |
| Channel protection | 1-yr 24-hr storm released over 24 hr (extended detention) |
| 10-yr release | Post-dev 10-yr peak ≤ pre-dev 10-yr peak |
| 100-yr containment | Basin contains 100-yr WSE with ≥ 1.0 ft freeboard to top of berm |
| Emergency spillway | Passes 100-yr (or 500-yr high-hazard) event with primary outlet plugged |
| Side slopes | 4H:1V or flatter (interior dry pond); safety bench for wet ponds |

Source: Indianapolis Stormwater Design and Specifications Manual, Carmel Engineering Standards, Indiana Stormwater Quality Manual.

## Multi-stage outlet sizing

- **WQv orifice** — typically 1 in to 4 in diameter. Use `Q = Cd A (2 g h)^0.5` with `Cd = 0.6` for sharp-edged. Size for the drawdown target (24-72 hr from the WQv elevation).
- **Channel-protection orifice** — sized to release the 1-yr 24-hr volume over 24 hr.
- **10-yr weir** — rectangular sharp-crested: `Q = Cw L H^(3/2)` with `Cw ≈ 3.0` (English units). Solve for L given the design head.
- **100-yr** — sized so 10-yr WSE is at least 1.0 ft below 100-yr WSE.
- **Emergency spillway** — broad-crested: `Q = Cw L H^(3/2)` with `Cw ≈ 2.6-3.0`. Use the lower value for grass-lined.

Place a trash rack with opening size smaller than the smallest orifice to prevent clogging.

## Worked example (modified rational)

Site: 8.0-ac commercial, Hamilton County. C = 0.65, Tc = 12 min. Allowable release Qo = pre-dev 10-yr = 6.5 cfs. 10-yr IDF (NOAA Atlas 14, Indianapolis): roughly fit `i = 96 / (Td + 14)` (in/hr, Td in min) for 10-min to 60-min durations — confirm against the actual NOAA Atlas 14 PDS table for the site.

Iterate Td:

| Td (min) | i (in/hr) | Qp = CiA (cfs) | Vin = Qp·Td·60 (cf) | Vout = Qo·(Td+Tc)·60 (cf) | Vs (cf) |
|---|---|---|---|---|---|
| 15 | 96/29 = 3.31 | 17.2 | 15,480 | 10,530 | 4,950 |
| 20 | 96/34 = 2.82 | 14.7 | 17,640 | 12,480 | 5,160 |
| 25 | 96/39 = 2.46 | 12.8 | 19,200 | 14,430 | 4,770 |
| 30 | 96/44 = 2.18 | 11.3 | 20,340 | 16,380 | 3,960 |

Critical duration ≈ 20 min, **Vs ≈ 5,160 cf** for the 10-yr. Repeat for 100-yr to confirm 100-yr controls the WSE.

(Always replace the fitted IDF curve with the actual NOAA Atlas 14 PDS table for the specific site.)

## Common review comments

- 100-yr WSE within 0.5 ft of berm — increase freeboard.
- Drawdown of WQv exceeds 72 hr — orifice too small.
- Stage-storage curve uses average end area on a curved basin — use prismoidal or a TIN volume.
- Emergency spillway crest set at the 100-yr WSE — fail. Must be above the 100-yr WSE.
- Trash rack openings larger than the smallest orifice — fail.

## Related

- [Detention sizing (breadth)](../stormwater/detention-sizing.md)
- [Time of concentration](tc-time-of-concentration.md)
- [Water-quality volume](water-quality-volume.md)
- [Bypass and overflow design](bypass-and-overflow-design.md)
- [Detention sizing calculator](/tools/detention-sizing)
- [Modified rational calculator](/tools/modified-rational)
