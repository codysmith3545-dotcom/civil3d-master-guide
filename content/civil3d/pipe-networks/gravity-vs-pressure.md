---
title: "Gravity vs Pressure Networks"
section: "civil3d/pipe-networks"
order: 10
visibility: public
tags: [pipe-network, gravity, pressure, storm, sanitary, water, force-main]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateNetwork, CreatePressureNetwork]
updated: 2026-05-06
---

> **TL;DR**
> 1. **Gravity networks** (storm/sanitary) flow by slope; design is driven by minimum cover, slope, and structure inverts. Use the `CreateNetwork` family of commands.
> 2. **Pressure networks** (water mains, force mains) flow under pressure; design is driven by pipe material rating, HGL, and fitting geometry. Use the `CreatePressureNetwork` command.
> 3. The two toolsets are separate in Civil 3D — different parts catalogs, different editors, different analysis workflows. Choose the right one before you start drawing.

## When to use each

| Characteristic | Gravity network | Pressure network |
|---|---|---|
| Typical systems | Storm sewer, sanitary sewer, culverts | Potable water, fire lines, force mains, irrigation |
| Driving design parameter | Slope (grade) and cover depth | Internal pressure and HGL |
| Parts catalog | Gravity pipe catalog (concrete, PVC, HDPE, etc.) with manholes, catch basins, inlets | Pressure pipe catalog (ductile iron, PVC C-900, HDPE) with fittings, valves, hydrants |
| Structures | Manholes, inlets, catch basins, junction boxes | Fittings (bends, tees, crosses), appurtenances (valves, hydrants, blow-offs) |
| Flow direction | Downhill, controlled by invert elevations | Either direction, controlled by pump or supply head |
| Profile display | Pipes between structures with inverts shown | Pipe centerline with fittings; no invert-to-invert logic |
| Ribbon tab | Home > Create Design > Pipe Network | Home > Create Design > Pressure Network |
| Primary commands | `CreateNetwork`, `CreateNetworkFromObject` | `CreatePressureNetwork` |

## Gravity networks — key concepts

Gravity networks consist of **pipes** and **structures**. A pipe connects exactly two structures. Structures sit at junctions, bends, size changes, and endpoints (inlets, outlets).

Design is slope-driven:

- Pipe slope must exceed a minimum to maintain self-cleansing velocity (varies by jurisdiction, commonly 0.5 % for 8 in. sanitary, 1.0 % for 8 in. storm).
- Minimum cover protects pipes from traffic loading (typically 2.5 ft to 5 ft depending on agency).
- Pipe rules enforce these constraints during layout.

Structures track rim elevation (top of casting) and sump elevation (bottom of structure). The difference between the lowest pipe invert and the sump is the **sump depth**. Many agencies require a minimum sump (6 in. to 12 in. for manholes, 12 in. to 24 in. for catch basins).

## Pressure networks — key concepts

Pressure networks consist of **pressure pipes**, **fittings**, and **appurtenances**.

- A **fitting** is a connection point: bend, tee, cross, reducer, coupling.
- An **appurtenance** is a device on the line: gate valve, butterfly valve, hydrant assembly, blow-off, air release valve.

Design is pressure-driven:

- Pipe material and class must withstand the design pressure (working + surge).
- The hydraulic grade line (HGL) must remain above the pipe crown at all points to avoid negative pressures.
- Bends generate thrust forces; thrust restraint (blocking, restrained joints) must be designed for each bend and tee.

Pressure pipes do not require structures at every junction the way gravity networks do — a simple fitting suffices.

## Objects that overlap

Some real-world systems mix both:

- **Force mains** carry sewage under pressure from a pump station. They are modeled as pressure networks (the pipe is pressurized), but the upstream and downstream connections are gravity networks.
- **Culverts** can be modeled as short gravity networks with inlet/outlet structures, or as simple pipe objects depending on complexity.

Civil 3D does not directly link a gravity network to a pressure network in the same drawing. Where a force main connects to a gravity manhole, model them as separate networks and use interference checks to coordinate.

## Choosing the right toolset

Use **gravity** when:

- The system relies on slope for flow.
- You need manholes, catch basins, or inlets at connection points.
- You will export to storm/sanitary analysis software (SSA, SWMM, HydroCAD).

Use **pressure** when:

- The system is pressurized (water supply, fire protection, force main).
- You need fittings (bends, tees, crosses) and appurtenances (valves, hydrants).
- You will export to pressure-analysis software (WaterGEMS, WaterCAD, EPANET).

## Related

- [Parts list and rules](parts-list-and-rules.md)
- [Creating pipe networks](creating-pipe-networks.md)
- [Pressure networks](pressure-networks.md)
- [Pipe network analysis](pipe-network-analysis.md)
