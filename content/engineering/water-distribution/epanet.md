---
title: "EPANET for Hydraulic Modeling"
section: "engineering/water-distribution"
order: 70
visibility: public
tags: [water, distribution, epanet, hydraulic-model]
updated: 2026-05-06
sources:
  - title: "EPANET 2.2 — U.S. EPA Office of Research and Development"
    url: https://www.epa.gov/water-research/epanet
    verified: 2026-05-06
  - title: "EPANET 2.2 Users Manual (EPA/600/R-20/133)"
    url: https://www.epa.gov/water-research/epanet
    verified: 2026-05-06
---

> **TL;DR**
> 1. **EPANET** is free, open-source hydraulic modeling software from the U.S. EPA. It performs **steady-state** and **extended-period simulation (EPS)** of water distribution networks, computing pressure, flow, velocity, and water quality (chlorine residual, water age, source tracing).
> 2. Many Indiana review agencies accept EPANET models for fire-flow analysis, pressure-zone evaluation, and water-quality studies. Larger utilities and consultants often use commercial alternatives (**WaterGEMS, InfoWater, WaterCAD**) that add GIS integration, demand allocation, and automated calibration.
> 3. Civil 3D **pipe network data** (nodes, pipes, diameters, lengths, elevations) can be exported and reformatted for EPANET's `.inp` text format, but the workflow is manual — there is no direct export button.
> 4. A model must be **calibrated** (compared to field measurements of pressure and flow) before it is defensible for regulatory review.

## What EPANET does

EPANET models the hydraulic and water-quality behavior of a pressurized pipe network. It tracks:

- **Hydraulics** — pressure at each node, flow and velocity in each pipe, pump operating point, tank water levels, PRV/PSV behavior.
- **Water quality** — chlorine residual decay (first-order bulk and wall decay), water age (time since water entered the system from a source), and source tracing (percentage of flow at any node from a given source).

### Steady-state analysis

Computes the hydraulic conditions at a single instant, assuming demands are constant. Useful for:

- Fire-flow checks — apply fire demand at a hydrant node and verify that residual pressure stays above 20 psi.
- Pressure-zone confirmation — verify HGL and static pressures across the system under normal demand.

### Extended-period simulation (EPS)

Steps the model through time (typically 1-hour intervals over 24 to 72 hours), varying demands by a diurnal pattern and tracking tank levels, pump cycles, and water-quality changes. Useful for:

- Tank operation and storage adequacy.
- Pump energy and operating cost analysis.
- Water age and residual decay studies.
- Emergency scenario modeling (main break, source loss, contamination event).

## When a model is required

Many Indiana utilities and review agencies require a hydraulic model for:

- Subdivisions with more than 20 to 50 lots (varies by utility).
- Commercial or industrial sites with fire-flow demands above 1,500 gpm.
- Extensions to existing distribution systems.
- PRV station or booster pump station additions.
- Any project where the adequacy of the existing system to deliver fire flow is in question.

Smaller projects (a few services on an existing main with known capacity) may not require a formal model — a hand calculation with the Hazen-Williams equation may suffice.

## EPANET vs. commercial alternatives

| Feature | EPANET 2.2 | WaterGEMS / WaterCAD | InfoWater |
|---|---|---|---|
| Cost | Free | Licensed (Bentley) | Licensed (Innovyze / Autodesk) |
| Hydraulic engine | EPANET solver | EPANET solver (enhanced) | EPANET solver (enhanced) |
| GIS integration | Manual import/export | Direct GIS/CAD integration | ArcGIS integrated |
| Demand allocation | Manual | Automated (billing data) | Automated |
| Calibration tools | Manual trial-and-error | Genetic algorithm optimizer | Optimizer |
| Water quality | Yes | Yes | Yes |
| Transient (water hammer) | No (use HAMMER separately) | Add-on (HAMMER) | Add-on (SurgeAnalyzer) |
| Skeletonization | Manual | Automated tools | Automated tools |

All three use the same underlying EPANET hydraulic solver (or an enhanced version of it), so steady-state results are comparable. The commercial tools add productivity features that justify the cost for large systems.

## Getting Civil 3D data into EPANET

Civil 3D stores pipe network data (pipe diameters, lengths, materials, node elevations) in the drawing, but there is no built-in "Export to EPANET" function. The workflow:

1. **Export the pipe network to a table** — use the Civil 3D pipe network data export (Data Shortcuts, or export to CSV/XML via the API or a LISP routine).
2. **Map Civil 3D fields to EPANET fields**:
   - Civil 3D pipe → EPANET pipe (ID, start node, end node, length, diameter, roughness).
   - Civil 3D structure → EPANET junction (ID, elevation, demand).
3. **Create the EPANET `.inp` file** — the `.inp` format is a structured text file. Build it from the exported data using a script (Python, Excel macro, or manual editing).
4. **Add demands, patterns, and controls** — EPANET needs base demands at each junction, demand patterns (diurnal curves), reservoir/tank definitions, pump curves, and valve settings. These do not come from Civil 3D and must be added from the design assumptions.
5. **Run and validate** — open the `.inp` file in EPANET, run the simulation, and check for convergence warnings, negative pressures, and unreasonable velocities.

Some third-party tools and scripts automate portions of this workflow. If the project uses WaterGEMS or InfoWater, those products can import Civil 3D DWG data directly.

## Model calibration

An uncalibrated model is a design tool; a calibrated model is an analysis tool that can be submitted to a reviewing agency. Calibration requires:

- **Field data** — pressure readings at multiple nodes under known demand conditions (typically during a fire-flow test or a hydrant-flow test). Record static and residual pressures, flow rate, and the time of test.
- **Demand verification** — compare modeled demand to billing records or meter readings.
- **C-factor adjustment** — adjust the Hazen-Williams C-factor for each pipe age/material class until modeled pressures match field readings within about 2 to 5 psi (AWWA M32 calibration criteria).
- **Sensitivity analysis** — vary uncertain parameters (demand, C-factor, boundary conditions) to understand the model's uncertainty range.

Document the calibration process and results in the engineering report submitted with the project plans.

## Common review issues

- Model submitted with all C-factors at 150 — not calibrated; default C overestimates capacity.
- No fire-flow scenario modeled — the reviewer needs to see 20-psi residual at every hydrant node.
- Tank initial level not set to the operating range — the model starts full and never draws down, masking a storage deficit.
- Demands assigned to the wrong nodes — verify that the total modeled demand matches the population/fixture count in the engineering report.
- No calibration documentation — the model is a "paper exercise" without field validation.

## Related

- [Demand estimation](demand-estimation.md)
- [Pipe sizing and velocity](pipe-sizing-velocity.md)
- [Pressure zones](pressure-zones.md)
- [Looping and dead-ends](looping-and-dead-ends.md)
- [Ten States Standards (water)](ten-states-standards-water.md)
