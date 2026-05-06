---
title: "Storm and Sanitary Analysis (SSA) Workflow"
section: "engineering/stormwater"
order: 110
visibility: public
tags: [stormwater, ssa, storm-sanitary-analysis, civil3d]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Storm and Sanitary Analysis"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2A18AED9-CF8B-456D-A578-6C64FA1F8B78
    verified: 2026-05-06
  - title: "FHWA HEC-22, Urban Drainage Design Manual, 3rd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/10009/10009.pdf
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Storm and Sanitary Analysis (SSA)** is the hydraulic/hydrologic analysis engine built into Civil 3D. It reads pipe network data directly from the drawing, adds catchments and rainfall, and computes flows, HGL, and water surface profiles.
> 2. Typical workflow: create the pipe network in Civil 3D, open SSA, define catchments (or import them), assign rainfall and runoff parameters, run the analysis, and review results in profiles, tables, and reports.
> 3. SSA supports the **rational method** (steady-state), **modified rational**, and **hydrograph methods** (SCS, EPA SWMM engine) for hydrology. The hydraulic engine solves the full Saint-Venant equations (dynamic wave) or kinematic wave.
> 4. Use SSA for site-scale storm sewer and sanitary sewer analysis. For watershed-scale modeling (detention routing, floodplain analysis, complex channel networks), consider **HEC-HMS**, **HEC-RAS**, or **PCSWMM** — SSA's strength is its tight integration with Civil 3D pipe networks, not large-scale watershed modeling.

## What SSA is

SSA is a built-in module in Civil 3D (accessed from the Analyze tab > Storm and Sanitary Analysis panel). Under the hood it uses a modified version of the EPA SWMM (Storm Water Management Model) engine. It can analyze:

- **Storm sewers** — gravity pipe flow, HGL/EGL, inlet interception, gutter spread.
- **Sanitary sewers** — gravity pipe flow with dry-weather base flow and I/I.
- **Combined sewers** — storm + sanitary loads combined.
- **Detention ponds** — stage-storage-discharge routing (basic).

SSA reads pipe diameters, lengths, materials, invert elevations, rim elevations, and structure types directly from the Civil 3D pipe network objects in the drawing. This eliminates the need to re-enter network geometry in a separate program.

## Setting up the model

### Step 1 — Build (or verify) the pipe network

Before opening SSA, confirm that the Civil 3D pipe network is complete and correct:

- All structures have correct rim elevations and sump depths.
- All pipes have correct upstream and downstream invert elevations, diameters, and materials.
- Pipe lengths match the plan geometry (pipe length in the network properties, not the 2D distance).
- The outfall structure is identified (either a free outfall or a structure with a known tailwater).

### Step 2 — Open SSA and create an analysis

From the Analyze tab, select Storm and Sanitary Analysis. SSA opens a separate interface (the "analysis" environment). Create a new analysis or open an existing one.

SSA will import the pipe network from the drawing. Verify that all structures and pipes appear in the SSA model tree. Structures that are not connected to the main network (orphaned nodes) will not import.

### Step 3 — Define catchments

A catchment is the drainage area tributary to each inlet or structure. SSA can use:

- **Civil 3D catchment objects** — if you created catchments using the Catchment tools (Analyze tab > Catchment), SSA can import them with their areas, runoff coefficients, and Tc values.
- **Manual entry** — assign drainage area, runoff coefficient (for rational method) or CN and Tc (for SCS), impervious percentage, and other parameters directly in the SSA catchment properties.

Each catchment is assigned to a structure (inlet or manhole) where its runoff enters the system. Catchment delineation should match the grading plan — use the finished contours and flow arrows to trace drainage boundaries.

### Step 4 — Assign rainfall

SSA needs a design storm. Options:

- **IDF curve** — for rational and modified rational methods. Enter the IDF data from NOAA Atlas 14 (see [Indiana IDF curves](indiana-idf-curves.md)) as a table or coefficients.
- **Design storm hyetograph** — for hydrograph methods (SCS). Enter the 24-hr depth and select a temporal distribution (NRCS Type II for Indiana).
- **Custom hyetograph** — a user-defined rainfall time series.

### Step 5 — Set analysis options

- **Hydrology method**: rational (steady-state), modified rational, SCS unit hydrograph, EPA SWMM (kinematic wave or dynamic wave).
- **Hydraulics**: gravity (Manning's equation for each pipe), kinematic wave (simplified unsteady), or dynamic wave (full Saint-Venant equations — the most accurate for surcharge and backwater conditions).
- **Tailwater condition**: free outfall (critical depth or normal depth at the last pipe), known tailwater elevation, or time-varying tailwater (from a downstream model).

For most site-scale storm sewer designs, the rational method with a gravity hydraulic analysis is sufficient. Use SCS/dynamic wave when the system has significant storage (detention), surcharge potential, or complex timing effects.

### Step 6 — Run the analysis

Click Run (or Analyze). SSA computes flows at each catchment, routes them through the pipe network, and generates:

- **Pipe results**: flow, velocity, depth, capacity ratio (d/D), HGL, EGL, Froude number.
- **Structure results**: HGL elevation, ponding depth (if HGL exceeds the rim), headloss.
- **Catchment results**: peak flow, time to peak, total runoff volume.

### Step 7 — Review results

- **Profile view** — SSA can overlay the HGL on the Civil 3D profile view. This is the most effective way to identify surcharge, where the HGL rises above the pipe crown or the structure rim.
- **Tables** — SSA generates summary tables (pipe capacity, velocity, HGL) that can be exported to Excel or placed on the plan sheets.
- **Reports** — SSA produces a detailed report (text or HTML) with input parameters, intermediate calculations, and results for documentation.
- **Plan view** — SSA can color-code pipes and structures by capacity ratio, velocity, or HGL status (green = adequate, red = surcharge).

## Interpreting results

Key things to check:

- **HGL at every structure**: is it below the rim? If not, the system surcharges and water will pond on the surface. Upsize the pipe, increase the slope, or add inlets to reduce the load.
- **Velocity**: is it above the minimum (2.5 ft/s typical) at design flow? Is it below the maximum (15 ft/s)? Flag and adjust pipe sizes or slopes as needed.
- **Capacity ratio (d/D)**: for gravity storm sewers, the design flow should not exceed about 80% to 100% of full-pipe capacity (depending on the agency standard). Sanitary sewers are designed for half-full flow or less.
- **Catchment flows**: do they match the hand calculations (Q = CiA for rational method)? Discrepancies usually indicate a data entry error (wrong area, wrong C, wrong Tc).

## When to use SSA vs. other tools

| Scenario | Recommended tool |
|---|---|
| Site-scale storm sewer HGL analysis | SSA (good fit) |
| Site-scale sanitary sewer capacity check | SSA (good fit) |
| Small detention pond routing (single basin) | SSA (adequate) or HydroCAD |
| Watershed-scale hydrology (multiple sub-basins) | HEC-HMS |
| Floodplain analysis, open-channel hydraulics | HEC-RAS |
| Large or complex sewer system (CSS, real-time control) | PCSWMM or InfoSWMM |
| Water distribution hydraulic model | EPANET / WaterGEMS (SSA does not model pressure systems) |

SSA's advantage is its direct connection to Civil 3D pipe network data — no import/export step. Its limitation is that it is designed for relatively small systems (a few hundred pipes) and does not scale well for large municipal models.

## Tips and common pitfalls

- **Unit consistency** — SSA inherits the drawing units. Verify that all lengths are in feet, diameters in inches (or the expected unit), and rainfall in inches per hour.
- **Catchment double-counting** — if you assign a catchment to a structure that already has a catchment, the flows are additive. Make sure no drainage area is counted twice.
- **Outfall tailwater** — if the outfall is submerged during the design storm (e.g., discharging to a detention pond that is at a known WSE), set the tailwater elevation. Omitting this overstates the system's capacity.
- **Pipe network edits after analysis** — if you change the pipe network in Civil 3D (edit an invert, add a pipe), re-import or re-sync the SSA model before re-running. SSA does not automatically track changes.
- **Manning n** — SSA populates n from the pipe material in the parts list. Verify that the n values match the local design standard, not the manufacturer's theoretical value.

## Common review issues

- SSA report submitted but the HGL profile is not shown on the plan sheets — most agencies want the HGL plotted on the profile.
- Rational-method Tc entered as 5 minutes for every catchment regardless of actual flow path — Tc should be computed from sheet flow + shallow concentrated flow + pipe flow for each catchment.
- Tailwater set at the pipe invert but the receiving channel is at a higher stage — HGL is underestimated.
- Dynamic wave analysis used but the time step is too large (> 30 seconds) — results may be unstable; reduce the time step.
- SSA model uses a default IDF curve instead of the NOAA Atlas 14 data for the project location — update with site-specific data.

## Related

- [Rational method and Tc](rational-method-and-tc.md)
- [SCS curve number method](scs-curve-number.md)
- [Inlet sizing](inlet-sizing.md)
- [Storm pipe design](storm-pipe-design.md)
- [Detention sizing](detention-sizing.md)
- [Indiana IDF curves](indiana-idf-curves.md)
