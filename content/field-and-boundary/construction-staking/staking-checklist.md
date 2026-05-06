---
title: "Pre-Stakeout Checklist"
section: "field-and-boundary/construction-staking"
order: 10
visibility: public
tags: [construction-staking, checklist, stakeout, data-collector, control, tolerances]
updated: 2026-05-06
---

> **TL;DR**
> 1. Confirm you have the **current design version** — staking from a superseded plan is the single most expensive staking mistake.
> 2. Check into **project control** before driving the first stake, and verify your data collector's stakeout file matches the design coordinates and datum.
> 3. Agree with the contractor on **tolerances, offset conventions, and marking style** before the crew starts — not after the first row of lath is in the ground.

## Verify the design version

Before generating a stakeout file, confirm:

- The plan set revision date and number match the most recent issue.
- Any addenda, RFIs, or change orders that modify the geometry have been incorporated.
- The engineer or project manager has confirmed in writing (email is sufficient) that this version is current.

Date-stamp your stakeout file with the design revision it was generated from. If a discrepancy surfaces later, you need a clear record of what you staked and when.

## Pull the stakeout file from Civil 3D

Export the stakeout data from the design drawing:

- **Points (CSV or LandXML).** For structure locations, building corners, utility structure centers.
- **Alignments (LandXML).** For centerline staking, edge of pavement, curb lines.
- **Profiles.** For vertical grade references along alignments.
- **Corridors / feature lines.** For complex grading with multiple offsets.

Verify the exported coordinates match a spot-check of the design drawing. Open the file in the data collector software and confirm at least three known points (e.g., a manhole location, a PC station, a building corner) agree with the plan.

## Check control

Before leaving the office:

- Confirm the project control coordinates are loaded in the data collector.
- Verify the datum, projection, and geoid model match the design. A common error: the design is on Indiana State Plane East, NAD83(2011), and the collector is set to WGS84 or a different realization.
- If the project has been dormant, check that the control monuments have not been disturbed. This may require a site visit before the staking day.

On arrival at the site:

1. Set up on or near a control point.
2. Observe a known point (second control monument or benchmark) and compare to the stored value.
3. Accept the setup only if the horizontal delta is within 0.03 ft and the vertical delta is within 0.02 ft (tighten for fine-grade staking).
4. At the end of the staking session, check back into control and record the closing delta.

## Confirm tolerances with the contractor

Different staking tasks have different tolerances. Discuss these before the work begins:

| Task | Typical horizontal tolerance | Typical vertical tolerance |
|---|---|---|
| Rough grading (slope stakes) | 0.10 ft | 0.10 ft |
| Curb and gutter | 0.03 ft | 0.02 ft |
| Storm/sanitary structures | 0.05 ft | 0.02 ft |
| Building corners | 0.02 ft | 0.02 ft |
| Finished pavement grade (blue tops) | 0.03 ft | 0.01 ft |

If the contractor's expectations are tighter than your equipment can deliver (e.g., 0.01 ft vertical with RTK), flag the issue and switch to a total station and level.

## Load points to data collector

Transfer the stakeout file to the data collector and verify:

- All points loaded without error.
- Point numbers and descriptions are legible and match the plan.
- The coordinate system in the collector matches the file's coordinate system.
- Alignment stationing matches the plan's beginning and ending stations.

## Stake-out report template

After staking, generate a stake-out report that records:

- Date, crew, equipment, and weather conditions.
- Design revision used.
- Control points occupied and closing deltas.
- For each staked point: point number, design coordinates, staked coordinates, horizontal delta, vertical delta, offset distance and direction, cut or fill.
- Any field conditions that affected staking (obstructions, denied access, conflicts with existing utilities).

Save the report as a PDF and archive it with the project. The contractor, engineer, and your liability file all benefit from a clear record.

## Related

- [Lath conventions](lath-conventions.md)
- [Working with contractors](working-with-contractors.md)
- [Curb staking](curb-staking.md)
- [Control for topos](../topographic-surveys/control-for-topos.md)
