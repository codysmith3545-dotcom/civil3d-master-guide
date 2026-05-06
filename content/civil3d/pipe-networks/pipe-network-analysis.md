---
title: "Pipe Network Analysis"
section: "civil3d/pipe-networks"
order: 45
visibility: public
tags: [pipe-network, analysis, interference-check, depth-check, flow-direction, ssa, swmm, watergems]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [InterferenceCheck, PipeNetworkAnalysis]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Interference Checks
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4E5F6A7B-8C9D-0E1F-2A3B-4C5D6E7F8A9B
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Interference check** compares two pipe networks (or a network and a surface/corridor) and flags 3D conflicts with a specified clearance. Essential for coordinating storm, sanitary, and water.
> 2. **Depth check** verifies minimum/maximum cover against a reference surface across the entire network in one pass.
> 3. Civil 3D does not perform hydraulic modeling. Export to **SSA** (Storm and Sanitary Analysis), **SWMM**, **WaterGEMS**, or similar software for flow, capacity, and HGL analysis.

## Interference check

Command: `InterferenceCheck` (ribbon: Analyze > Design > Interference Check).

An interference check finds locations where two 3D solid sets overlap or come within a specified clearance distance.

### Setup

1. Select **Part A** — typically the first pipe network.
2. Select **Part B** — the second network, or a 3D solid (corridor model, building foundation, etc.).
3. Specify the **3D proximity distance** (clearance). Common values:
   - 18 in. (450 mm) between storm and sanitary sewers (many agencies require this minimum separation).
   - 12 in. (300 mm) between water and sewer (or 18 in. vertical with crossing requirements per state plumbing code).
   - Check local standards; Indiana, for example, follows 327 IAC 8-6.1 for separation requirements.
4. Run the check.

### Results

Civil 3D creates **interference objects** — 3D markers at each conflict location. These appear in Prospector under Pipe Networks > Interference Checks.

Each interference records:

- The two conflicting parts (pipe ID and/or structure ID).
- The station and offset of the conflict.
- The actual 3D distance between the parts.
- Whether the parts physically overlap (distance = 0 or negative) or violate the clearance envelope.

Review interferences in the Interference Check vista (right-click the check > Show Interference Check). The vista lists every conflict with sortable columns.

## Depth check

Depth check is not a single command but a combination of techniques:

### Method 1: Pipe rules

Set minimum and maximum cover rules in the parts list (see [Parts list and rules](parts-list-and-rules.md)). Violations are flagged in the Pipe Network Vistas.

### Method 2: Surface profile comparison

Add the finished-grade surface profile and the pipe network to the same profile view. Visual inspection reveals shallow or deep pipes relative to the surface. Civil 3D annotates cover depth if the label style includes a `{Cover}` expression.

### Method 3: Pressure pipe design check

For pressure networks, use `PressurePipeDesignCheck`. This evaluates cover, pressure rating, and fitting compatibility in a single pass and produces a report.

## Flow direction verification

For gravity networks, flow direction is from the higher invert to the lower invert. Civil 3D sets flow direction automatically based on pipe slope.

Verify flow direction:

1. Select a pipe in the network.
2. Check the Properties palette — **Flow Direction** shows which structure is upstream and which is downstream.
3. In plan view, pipe label styles with a flow arrow component display direction visually.

If a pipe has an adverse slope (flow direction opposite to the intended design), the pipe inverts must be corrected. An adverse slope in a gravity sewer means the pipe cannot flow by gravity and will require a pump or redesign.

To reverse flow direction without changing inverts: select the pipe > right-click > Reverse Pipe Direction. This swaps the start and end structures. Use this only when the slope is correct but Civil 3D assigned direction incorrectly (rare in practice).

## Exporting to analysis software

Civil 3D is a design and drafting tool, not a hydraulic modeling engine. Analysis software handles:

- Steady-state and dynamic flow calculations.
- Design-storm runoff loading.
- Pipe capacity verification (Manning's equation, Hazen-Williams, Darcy-Weisbach).
- HGL/EGL computation.
- Surcharge and flooding analysis.

### Storm and Sanitary Analysis (SSA)

SSA is Autodesk's companion analysis tool (bundled with Civil 3D or available separately as part of the Infrastructure Design Suite). It uses an EPA SWMM computation engine.

Export workflow:

1. In Civil 3D, assign hydrology data to structures (catchment area, runoff coefficient, time of concentration) via the Hydrology tools or import from external hydrologic models.
2. Select the network > Analyze > Storm and Sanitary Analysis.
3. SSA opens with the pipe and structure geometry pre-loaded.
4. Define rainfall data, design storms, and boundary conditions.
5. Run the analysis. Results (pipe flow, velocity, depth, surcharge) write back to Civil 3D annotations.

### SWMM (EPA)

For offices not using SSA, export the network geometry to EPA SWMM:

- Export to LandXML, then use a SWMM import utility.
- Or export pipe/structure tables to CSV, then build the SWMM input file.

### WaterGEMS / WaterCAD

For pressure networks:

- Export to LandXML or shapefile.
- Import into WaterGEMS/WaterCAD for hydraulic analysis (demand allocation, fire flow, extended-period simulation).

See [Pipe network interop](pipe-network-interop.md) for detailed export/import procedures.

## Related

- [Parts list and rules](parts-list-and-rules.md)
- [Pipe network in profile view](pipe-network-in-profile.md)
- [Pressure networks](pressure-networks.md)
- [Pipe network interop](pipe-network-interop.md)
