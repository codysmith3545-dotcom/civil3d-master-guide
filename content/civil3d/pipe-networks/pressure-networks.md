---
title: "Pressure Networks"
section: "civil3d/pipe-networks"
order: 35
visibility: public
tags: [pressure-network, water-main, force-main, fittings, appurtenances, hgl, hydrant, valve]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreatePressureNetwork, EditPressureNetwork, PressurePipeDesignCheck]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Pressure Pipe Networks
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2C3D4E5F-6A7B-8C9D-0E1F-2A3B4C5D6E7F
    verified: 2026-05-06
---

> **TL;DR**
> 1. Pressure networks model water mains, fire lines, and force mains using **pressure pipes**, **fittings** (bends, tees, crosses, reducers), and **appurtenances** (valves, hydrants, blow-offs).
> 2. Layout is done with `CreatePressureNetwork`. Civil 3D auto-inserts fittings at bends and intersections based on the deflection angle and the pressure parts list.
> 3. Design checks validate minimum cover, pressure class vs operating pressure, bend angle limits, and fitting compatibility. Export to WaterGEMS or EPANET for full hydraulic analysis.

## Pressure network components

### Pressure pipes

Pressure pipes are defined by material, nominal diameter, and pressure class. Common materials in the pressure parts catalog:

- Ductile Iron Pipe (DIP) — Class 150, 200, 250, 300, 350 per AWWA C151
- PVC C-900 — DR 14, DR 18, DR 25 per AWWA C900
- HDPE — DR 7, DR 9, DR 11 per AWWA C906

Each pipe entry in the catalog includes inner diameter, outer diameter, and pressure rating. The parts list filters the catalog to project-appropriate materials and sizes.

### Fittings

Fittings are inserted at connection and direction-change points. Civil 3D recognizes:

| Fitting type | Purpose |
|---|---|
| Bend | Direction change; auto-inserted when the deflection angle exceeds the pipe joint deflection limit |
| Tee | Branch connection; one run-through and one branch outlet |
| Cross | Four-way intersection |
| Reducer | Diameter transition between two pipe sizes |
| Coupling | Joins two pipes of the same size end-to-end |
| Cap/plug | Terminates a dead end |

Fittings are selected from the pressure parts catalog. The parts list defines which fittings are available and their deflection angle ranges. When you draw a bend tighter than the fitting's maximum deflection, Civil 3D inserts multiple fittings or flags a violation.

### Appurtenances

Appurtenances are devices installed on the line:

| Appurtenance | Typical use |
|---|---|
| Gate valve | Isolation; placed at tees, before/after hydrants, and at intervals along mains |
| Butterfly valve | Large-diameter isolation (typically 16 in. and above) |
| Fire hydrant assembly | Hydrant, hydrant valve, tee, and connecting piping |
| Air release valve | High points in the line to release trapped air |
| Blow-off valve | Low points or dead ends for flushing |

## Creating a pressure network

Command: `CreatePressureNetwork` (ribbon: Home > Create Design > Pressure Network > Pressure Network Creation Tools).

1. Name the network.
2. Select a **pressure parts list** (configured under Settings > Pressure Network > Parts Lists).
3. Assign a reference surface and alignment (optional but recommended for cover checks and profile display).
4. The Pressure Network Plan Layout toolbar appears.
5. Select pipe material/size and begin clicking in plan view.
6. Civil 3D auto-inserts fittings:
   - **Bends** at direction changes that exceed the joint deflection tolerance.
   - **Tees** when you branch from an existing pipe.
   - **Reducers** when you change pipe size mid-run.

### Adding appurtenances

With the network selected, use the Add Appurtenance tool on the layout toolbar. Click a location on an existing pipe to insert a valve, hydrant, or other device. Civil 3D breaks the pipe at that point and inserts the appurtenance with appropriate fittings.

For hydrant assemblies, Civil 3D can place the full assembly (tee on the main, hydrant valve, hydrant lateral, and hydrant) in a single operation if the parts list defines a hydrant assembly.

## Pressure pipe design checks

Command: `PressurePipeDesignCheck` (ribbon: select the network > Analyze > Design Check).

Design checks validate:

| Check | What it verifies |
|---|---|
| Minimum cover | Pipe crown is at least the specified depth below the reference surface. Typical: 3.5 ft to 5 ft for water mains (jurisdiction-dependent). |
| Maximum cover | Pipe is not buried deeper than practical for maintenance access. |
| Pipe pressure rating | The pipe's rated pressure exceeds the design pressure (static + surge). |
| Deflection angle | Each bend fitting is within its rated deflection range. |
| Fitting compatibility | Connected fittings match in size, material, and end type (flanged, MJ, push-on). |

Violations display as icons on the network in plan view and can be listed in a design-check report.

## HGL and pressure considerations

Civil 3D does not perform full hydraulic analysis (steady-state flow, fire-flow scenarios, extended-period simulation). For those, export to dedicated software:

- **WaterGEMS / WaterCAD** (Bentley) — import via LandXML or shapefile.
- **EPANET** (EPA) — free; import pipe and node data from Civil 3D exports.
- **InfoWater** (Innovyze) — GIS-based; import from Civil 3D shapefiles.

Civil 3D's role is geometric design: pipe routing, fitting selection, cover verification, and plan production. Hydraulic design (sizing pipes for demand, verifying residual pressures) happens in the analysis software.

## Pressure network in profile

Pressure networks display in profile view similarly to gravity networks but with key differences:

- Pipes show as rectangles (crown to invert).
- Fittings display at their actual elevation and station.
- There is no invert-to-invert logic between structures — fittings are not structures.
- Vertical bends show as deflection points in the profile pipe run.

Add a pressure network to a profile view the same way as a gravity network: select the network, then `DrawPartsInProfileView`.

## Thrust restraint

At bends, tees, and dead ends, internal pressure creates unbalanced thrust forces. Civil 3D does not calculate thrust restraint, but the plan set typically requires:

- Thrust block sizing (concrete bearing area based on soil bearing capacity and thrust force).
- Restrained-joint length calculations per AWWA or pipe manufacturer guidelines.

These calculations are performed outside Civil 3D and annotated on the plans.

## Related

- [Gravity vs pressure networks](gravity-vs-pressure.md)
- [Parts list and rules](parts-list-and-rules.md)
- [Pipe network labels](pipe-network-labels.md)
- [Pipe network analysis](pipe-network-analysis.md)
- [Pipe network interop](pipe-network-interop.md)
