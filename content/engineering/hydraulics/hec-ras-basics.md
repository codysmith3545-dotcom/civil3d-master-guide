---
title: "HEC-RAS Basics"
section: "engineering/hydraulics"
order: 40
visibility: public
tags: [hec-ras, floodplain, hydraulic-modeling, 1d, cross-section, bridge-culvert]
updated: 2026-05-06
sources:
  - title: "USACE HEC-RAS Hydraulic Reference Manual, Version 6.x"
    url: https://www.hec.usace.army.mil/software/hec-ras/documentation.aspx
    verified: 2026-05-06
  - title: "FEMA Guidelines and Standards for Flood Risk Analysis and Mapping"
    url: https://www.fema.gov/flood-maps/guidance-partners/guidelines-standards
    verified: 2026-05-06
---

> **TL;DR**
> 1. HEC-RAS is the standard tool for open-channel water-surface profile computation and floodplain mapping. Use it when hand calculations are insufficient — multi-reach systems, bridges, culverts, floodplain encroachments, and FEMA map revisions.
> 2. A 1D steady-state model needs: cross-section geometry, Manning's n values, reach lengths, flow data, and downstream boundary condition. HEC-RAS solves the energy equation (standard step method) between cross sections.
> 3. Civil 3D surface data exports to HEC-RAS via GeoRAS (ArcGIS) or RAS Mapper (HEC-RAS 6.x can import terrain directly as GeoTIFF or HDF).

## When to use HEC-RAS

| Scenario | Hand calculation | HEC-RAS |
|---|---|---|
| Single pipe or channel reach, uniform flow | Sufficient | Overkill |
| Multi-reach channel with tributaries | Difficult | Recommended |
| Bridge or culvert backwater analysis | HDS-5 for single culverts | Required for complex crossings |
| FEMA floodplain delineation (CLOMR/LOMR) | Not accepted | Required |
| Dam breach or unsteady flow | Not possible by hand | Required |
| Floodway encroachment analysis | Not practical | Required |

## Model types

### 1D steady-state

The most common mode for routine design. Computes water-surface profiles for constant flows. Solves the energy equation between cross sections using the standard step method. Can handle subcritical, supercritical, and mixed-flow regimes.

### 1D unsteady

Required when flow changes over time — flood routing, dam breach, tide-influenced systems. Solves the full Saint-Venant equations (continuity + momentum).

### 2D

HEC-RAS 5.0+ includes 2D modeling using a finite-volume solution on a computational mesh. Used for wide floodplains, urban flooding, and areas where flow paths are not well-defined by 1D cross sections.

## Building a 1D steady-state model

### Cross-section data

Each cross section is defined by station-elevation pairs (ground profile perpendicular to flow). Required data:

- **Geometry** — surveyed or extracted from terrain (LiDAR, Civil 3D surface).
- **Manning's n** — assigned to left overbank, main channel, and right overbank.
- **Bank stations** — define the boundary between the main channel and overbanks.
- **Reach lengths** — left overbank, main channel, and right overbank distances between cross sections.
- **Contraction/expansion coefficients** — typically 0.1/0.3 (gradual) or 0.3/0.5 (bridges).

Cross sections should be placed at regular intervals and at every significant change: slope breaks, channel bends, constrictions, bridges, culverts.

### Flow data

For steady-state analysis, enter the design flow(s) at the upstream end and at each tributary junction. Multiple profiles can be run simultaneously (e.g., 10-year, 25-year, 50-year, 100-year, 500-year).

### Boundary conditions

- **Downstream** — known water surface, normal depth (slope), or critical depth.
- **Upstream** — known water surface or critical depth (for supercritical flow).

For most subcritical analyses, only the downstream boundary is needed.

### Bridges and culverts

HEC-RAS models bridges and culverts with four cross sections: upstream of the bridge, just upstream of the opening, just downstream of the opening, and downstream of the bridge. The software computes losses from energy (standard step), momentum, Yarnell, WSPRO, or pressure/weir methods.

## Output and floodplain mapping

Key outputs:

- **Water-surface profile** — elevation at each cross section for each flow.
- **Velocity distribution** — across the cross section and by overbank/channel.
- **Floodway encroachment** — the channel and floodway fringe that can be encroached while limiting the surcharge to the allowable rise (typically 1.0 ft for FEMA, 0.14 ft for INDOT on state routes).
- **Inundation mapping** — HEC-RAS exports water-surface results that are intersected with the terrain to produce flood inundation boundaries.

## Connecting Civil 3D to HEC-RAS

1. Export the Civil 3D surface as a GeoTIFF or LandXML.
2. In HEC-RAS 6.x, import the terrain into RAS Mapper.
3. Draw cross-section cut lines in RAS Mapper; the software extracts ground geometry from the terrain.
4. Alternatively, export cross sections from Civil 3D as station-elevation data and import into HEC-RAS geometry.

## Common mistakes

- Cross sections not perpendicular to flow direction.
- Manning's n values not justified or documented.
- Insufficient cross sections near bridges (need four minimum).
- Boundary condition sensitivity not checked.
- Contraction/expansion coefficients left at defaults near bridges.

## Related

- [Manning's equation reference](mannings-reference.md)
- [Manning's n value table](mannings-n-table.md)
- [Critical depth](critical-depth.md)
- [Culvert control](culvert-control.md)
