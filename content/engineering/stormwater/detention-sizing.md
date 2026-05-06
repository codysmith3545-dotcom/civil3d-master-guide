---
title: "Detention Sizing"
section: "engineering/stormwater"
order: 50
visibility: public
tags: [detention, basin, release-rate, modified-rational, routing, freeboard]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePondFromObject, CreateCatchment]
relatedCalculators: [detention-sizing, modified-rational]
updated: 2026-05-06
sources:
  - title: "USDA NRCS TR-55, Chapter 6 (Storage Volume for Detention Basins)"
    url: https://www.nrcs.usda.gov/sites/default/files/2022-10/TR-55.pdf
    verified: 2026-05-06
  - title: "Indianapolis Stormwater Design and Specifications Manual"
    url: https://www.indy.gov/activity/storm-water-design-and-construction-specifications
    verified: 2026-05-06
  - title: "INDOT Indiana Design Manual, Chapter 203"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Detention basins are sized to limit the post-development peak discharge to a target release rate (often the predevelopment peak) for one or more design storms.
> 2. Standard Indiana practice: match the post-development 10-yr peak to predevelopment 10-yr; provide containment up to the 100-yr event with at least 1.0 ft of freeboard above the 100-yr water surface.
> 3. For small, simple sites use the **Modified Rational Method** to size storage. For larger or more complex sites route an SCS hydrograph through a stage-storage-discharge curve (HydroCAD, Storm and Sanitary Analysis, HEC-HMS).
> 4. Always check both **water quantity** (peak rate, volume) and **water quality** (first-flush capture and drawdown) — they are independent design criteria.

## What a detention basin does

A detention basin temporarily stores runoff and releases it through a controlled outlet at a slower rate than the inflow peak. It does not reduce the total volume (a retention or infiltration basin does that); it reshapes the hydrograph. The required storage equals the area between the inflow hydrograph and the outflow hydrograph above the target release rate.

## Common Indiana criteria

Confirm in the local technical standards. The pattern is consistent across most Indiana MS4 communities:

- **Water-quality volume (WQv)** — capture and treat the first 1.0 in or 1.25 in of runoff from impervious area; drawdown 24 to 72 hours.
- **Channel protection** — 1-yr 24-hr storm released over 24 hours (Carmel, Westfield, and several Hamilton County cities require this).
- **10-yr release** — post-development 10-yr 24-hr peak ≤ predevelopment 10-yr 24-hr peak.
- **100-yr containment** — basin contains the 100-yr 24-hr event with at least 1.0 ft of freeboard above the maximum water surface to the top of berm or emergency spillway crest.
- **Emergency overflow** — passes the 100-yr (or 500-yr for high-hazard structures) event without overtopping the berm.

INDOT projects on state routes apply Chapter 203 criteria, which are similar but use 25-yr / 50-yr design events for many highway facilities.

## Modified Rational Method (small, simple sites)

The Modified Rational Method (MRM) extends the rational hydrograph by varying storm duration to find the duration that maximizes required storage. For a target release rate Qo and a contributing area with peak Qp at time of concentration Tc:

- Build a trapezoidal inflow hydrograph for trial storm durations Td (Td ≥ Tc).
- Compute the inflow volume `Vin = Qd · Td` minus the release volume `Vout = Qo · (Td + Tc)` (a common simplification — many agencies have a specific formula).
- Iterate Td. The duration that maximizes (Vin - Vout) gives the critical storage volume.

MRM is appropriate when:

- Drainage area < ~20 ac (the rational method's domain).
- Single homogeneous land cover.
- Single-stage outlet.
- The agency accepts MRM (most do for small commercial sites; many do not for residential subdivisions).

It tends to over-size storage compared to a routed SCS hydrograph — usually by 10% to 30% — which is conservative but sometimes uneconomic.

## SCS hydrograph routing (everything else)

For larger or staged sites, build an SCS hydrograph from the 24-hr design rainfall and route it through a stage-storage-discharge relation:

1. Develop a CN-based hydrograph for each design storm (1-yr, 10-yr, 100-yr at minimum).
2. Build a stage-storage curve from the basin geometry. For trapezoidal earthen basins use the prismoidal formula; for irregular shapes use a TIN volume.
3. Build a stage-discharge curve from the outlet structure. Most basins use a multi-stage riser: low orifice for water-quality release, weir for the 10-yr, and a top weir or emergency spillway for the 100-yr.
4. Route the inflow hydrograph (modified Puls / level-pool routing) and check the peak outflow against the target release rate and the maximum water surface against the freeboard requirement.
5. Iterate until all design events meet criteria simultaneously.

Civil 3D Storm and Sanitary Analysis, HydroCAD, and HEC-HMS all do this. Civil 3D's pond modeler can build the stage-storage curve directly from a feature line.

## Outlet structure design

A well-formed multi-stage outlet:

- Sized water-quality orifice (typically 1 in to 4 in diameter; protected with a trash rack with openings smaller than the orifice).
- Channel-protection orifice or weir higher up the riser.
- 10-yr weir or riser opening sized so that the 10-yr WSE is at least 1 ft below the 100-yr WSE.
- 100-yr release through the riser top or a separate weir.
- Emergency spillway sized for the 100-yr event with the riser plugged (per Carmel and many Indiana cities), or for the 500-yr event for high-hazard sites.

## Freeboard, side slopes, and safety

- **Freeboard** — 1.0 ft minimum above 100-yr WSE to top of berm. Some jurisdictions require 1.5 ft for impoundments over 6 ft deep.
- **Interior side slopes** — 4H:1V or flatter is the common standard. Steeper slopes require a safety bench, fencing, or both.
- **Safety bench** — a 10-ft minimum wide flat bench at or just above the normal pool / water-quality WSE is required by many Indiana cities for wet ponds.
- **Anti-seep collars** — required on principal spillway barrels through earthen berms.
- **Maintenance access** — minimum 12-ft maintenance road around the basin, capable of supporting an H-20 vehicle.

## Common review comments

- 100-yr WSE is too close to the top of berm — increase freeboard or lower outlet weir.
- Basin volume below WQv outlet is less than required — drop the orifice elevation or expand the bottom.
- Drawdown of WQv exceeds 72 hours — orifice is too small (or basin is too large for the orifice).
- Stage-storage volume is computed by average end area but the basin has a curved bottom — re-compute with the prismoidal formula or a TIN.
- Outlet trash rack opening is larger than the orifice — fail. Trash rack openings must be smaller than the smallest orifice.

## Related

- [Rational method and Tc](rational-method-and-tc.md)
- [SCS curve number method](scs-curve-number.md)
- [Indiana IDF curves](indiana-idf-curves.md)
- [Detention sizing calculator](/tools/detention-sizing)
- [Modified rational calculator](/tools/modified-rational)
