---
title: "AASHTO Intersection Design Principles"
section: standards/aashto
order: 26
visibility: public
tags: [aashto, intersection, sight-triangle, channelization, turning-movement, geometric-design]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "AASHTO, A Policy on Geometric Design of Highways and Streets, 7th Edition (2018), Chapter 9"
    url: "https://store.transportation.org/Item/CollectionDetail?ID=180"
    citation: "AASHTO 2018, Ch. 9"
    verified: 2026-05-11
license: "summary only — original AASHTO publication is copyrighted"
---

> **TL;DR**
> 1. AASHTO Green Book Chapter 9 sets the design framework for at-grade intersections: layout (T, four-leg, multi-leg, roundabout), control (uncontrolled, yield, stop, signal, all-way stop), channelization, and sight triangles.
> 2. Intersection sight distance (ISD) is computed for the controlling movement (Case A through F) and the design vehicle, then verified by drawing the approach and departure sight triangles in plan.
> 3. Design vehicles for swept-path checks must reflect the heaviest expected user (typically WB-67 on arterials, SU-30 on collectors, P on local streets).

## What AASHTO says

Intersections are the highest-risk and lowest-capacity components of the surface street network. Chapter 9 of the Green Book frames their design around four principles: minimize conflict points, separate conflict points in time or space, control approach speeds, and provide adequate sight distance.

**Layout.** Three-leg (T) intersections produce 9 vehicle conflict points; four-leg produce 32; multi-leg substantially more. The Green Book strongly discourages multi-leg at-grade intersections except where realignment is impractical.

**Control.** Selection follows MUTCD warrants (signal warrants, stop and yield warrants). The Green Book provides geometric implications for each control: signalized intersections require longer storage and more sight distance to the back of queue; stop-controlled minor approaches require the full ISD triangle; roundabouts have their own geometric basis (see [Roundabout design](roundabout-design-aashto.md)).

**Channelization.** Islands and pavement markings physically and visually direct vehicles into the correct path, separate conflicting movements, store turning vehicles, and provide pedestrian refuge. Channelizing islands should be at least 100 ft^2 (50 ft^2 absolute minimum) to be visible.

**Sight triangles.** Two triangles per approach: the approach sight triangle (driver decelerating to stop bar) and the departure sight triangle (driver waiting at stop bar with view of crossing or merging traffic). Vertices: the driver eye on the minor approach (set back per the controlling case) and the conflicting vehicle on the major road at distance equal to ISD. The triangle must be free of obstructions taller than 3 ft and shorter than 8 ft.

**Turn lanes and tapers.** Storage length must accommodate the design queue without spilling out of the bay; deceleration length depends on design speed of the through movement.

## Key formulas / variables

- **ISD (Case B1, stop-controlled minor approach, passenger car turning left):** `ISD = 1.47 V_major t_g`, with `t_g` the gap acceptance time (Green Book Table 9-5 in 7e tabulates `t_g` by design vehicle and minor-road grade).
- **Storage length, signalized:** `L_s = 2 N L_v`, where `N` is the design queue (95th percentile vehicles per cycle) and `L_v` is the average vehicle length (typically 25 ft for passenger cars). Round up.
- **Deceleration taper:** taper rate from MUTCD or Green Book Figure 9-x; commonly `15:1` to `25:1` depending on speed.

## Common Civil 3D applications

- Lay out intersection geometry on alignments and profiles; use grading objects for curb returns.
- Verify swept paths with AutoTURN or the Vehicle Tracking add-in (separate license).
- Plot sight triangles as polylines on a working layer and verify against existing surface and proposed buildings/landscape.
- See [Intersection design](../../engineering/roadway-design/intersection-design.md).

## What this guide can't reproduce

Chapter 9 tables of `t_g` by design vehicle, the ISD distance tables, the sight-triangle figures, the channelizing-island detail, and the turn-lane storage and deceleration tables are copyrighted. Pull from a licensed copy or from the controlling state design manual.

## Related Indiana standards

- INDOT IDM Part 5 Chapter 46 covers intersections at-grade. See [INDOT IDM chapter map](../state-dot/indot-idm-chapter-map.md).
