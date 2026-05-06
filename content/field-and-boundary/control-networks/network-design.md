---
title: "Control Network Design"
section: "field-and-boundary/control-networks"
order: 10
visibility: public
tags: [control, network-design, geometry, redundancy]
updated: 2026-05-06
sources:
  - title: "Wolf & Ghilani — Adjustment Computations, 6th ed."
    url: https://www.wiley.com/
    verified: 2026-05-06
  - title: "NGS — Guidelines for Establishing GPS-Derived Ellipsoid Heights"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS-58.pdf
    verified: 2026-05-06
  - title: "FGDC — Geospatial Positioning Accuracy Standards"
    url: https://www.fgdc.gov/standards
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Geometry matters.** A network of well-distributed, interlocking observations detects blunders and yields better accuracy than a chain of sequential measurements. Avoid long, narrow networks with no cross-ties.
> 2. **Redundancy (degrees of freedom) is the foundation of quality control.** Without redundant observations, you cannot detect errors or compute meaningful accuracy estimates.
> 3. **Connect to published control** (NGS CORS, NGS passive marks, county monuments) so your network has an external reference and can be reproduced by future surveyors.
> 4. Plan the network geometry **before going to the field**. Sketch the layout, count observations and unknowns, and verify you have positive degrees of freedom.

## Geometry and strength of figure

The geometric configuration of a control network determines how well it can resolve the positions of the unknown points. Key principles:

### Triangles, not chains

A traverse is a chain of connected observations. It has minimal redundancy (one redundant observation per loop). A network with cross-bracing — observations between non-adjacent points — has more redundancy and better geometry.

Consider two ways to control a 10-acre site:

- **Traverse loop:** 5 points, 5 angles, 5 distances = 10 observations, 10 unknowns (5 x 2 coordinates), 0 degrees of freedom if open, or 3 degrees of freedom if closed with known endpoints. Errors can propagate the full length of the traverse before being detected at the closure.
- **Braced network:** Same 5 points but with cross-ties between non-adjacent points. If you add 4 cross-tie distances, you now have 14 observations and 10 unknowns = 4 degrees of freedom. The cross-ties localize errors and strengthen the geometry.

### Avoiding weak geometries

- **Elongated triangles** (angles near 0 or 180 degrees) are weak. The position perpendicular to the long side is poorly determined.
- **Nearly parallel baselines** in GNSS networks provide little geometric strength. Include baselines at varying azimuths.
- **Stations at the edge of the network** with only one connecting observation are weakly controlled. Add a second observation or accept the reduced accuracy at the periphery.

## Redundancy and degrees of freedom

Degrees of freedom (DOF) = number of observations - number of unknowns.

- **DOF = 0:** The network is just-determined. There is exactly one solution and no way to check for errors or compute accuracy. This is the minimum for a solution but unacceptable for quality work.
- **DOF > 0:** The network is over-determined. The extra observations allow least-squares adjustment, blunder detection, and accuracy estimation.
- **DOF < 0:** The network is under-determined. There are not enough observations to compute a unique solution.

For a 2D horizontal network with N unknown points and no fixed points:

- Unknowns = 2N (northing and easting for each point) + datum defect (3 for 2D: 2 translations + 1 rotation).
- Each angle observation provides 1 equation.
- Each distance observation provides 1 equation.
- Each GNSS baseline provides 2 equations (delta-N, delta-E) or 3 equations (delta-N, delta-E, delta-h) for 3D.

### Practical guidance

For a small project control network (5-10 points), aim for at least DOF = 5-10 after fixing the datum. This means measuring more than the bare minimum — close loops, add cross-ties, observe in both faces, and tie to multiple published marks.

## Connecting to published control

Published control serves two purposes:

1. **Datum definition.** It puts your network in a known coordinate system (NAD83(2011), NAVD88).
2. **External quality check.** If your network adjustment produces coordinates that disagree significantly with published values, something is wrong.

### Sources of published control in Indiana

- **NGS CORS:** Continuously operating reference stations. Use CORS for GNSS baseline connections. The nearest CORS to your project can serve as a fixed station in the network adjustment.
- **NGS passive marks:** Triangulation stations and benchmarks. Search the NGS database at [ngs.noaa.gov/cgi-bin/ds_mark.prl](https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl). Verify recovery status before planning to use a mark.
- **County surveyor monuments:** Many Indiana counties maintain section corner monuments and local control points with published coordinates. Contact the county surveyor's office.
- **INDOT control:** For DOT projects, INDOT provides project control with coordinates and elevations.

### Minimum connections

- For horizontal control: tie to at least **2 published horizontal control points** and ideally 3+ to provide redundancy and enable quality checks.
- For vertical control: tie to at least **2 published benchmarks**, preferably on opposite sides of the project.
- For GNSS networks: include baselines to at least **2 CORS** or published GNSS control stations.

## Minimum constraints

A network adjustment requires enough constraints (fixed values) to define the datum — to prevent the network from translating, rotating, or scaling freely. The minimum constraints for different network types:

| Network type | Minimum constraint | Notes |
|---|---|---|
| 2D horizontal | Fix 1 point (N, E) + 1 azimuth, or fix 2 points | Fixes translation and rotation |
| 1D vertical | Fix 1 elevation | Fixes vertical datum |
| 3D | Fix 1 point (N, E, h) + 1 azimuth, or fix 2 points | Fixes translation, rotation |
| GNSS-only | Fix 1 point (X, Y, Z) | GNSS baselines define azimuth internally |

Using only minimum constraints allows the network geometry to express itself fully. Over-constraining (fixing more points than necessary) can mask errors and distort the network. The standard practice is:

1. Run a **minimally constrained adjustment** first to evaluate the internal quality of the observations.
2. Then run a **fully constrained adjustment** (fixing all published control) to fit the network into the datum. Compare the two adjustments: large changes in residuals or coordinates when adding constraints indicate problems with either the observations or the published control values.

## Project control requirements by survey type

| Survey type | Typical horizontal accuracy | Typical vertical accuracy | Minimum control |
|---|---|---|---|
| ALTA/NSPS land title survey | 0.07 ft + 50 ppm (Table A default) | 0.05 ft | 2 horizontal, 1 vertical (2 if Table A Item 6 selected) |
| 1 ft contour topo | 0.10 ft | 0.03 ft | 2 horizontal, 1 vertical |
| Construction staking | 0.02-0.05 ft | 0.01-0.02 ft | 3+ horizontal, 2+ vertical |
| DOT corridor | Per INDOT specs | Per INDOT specs | INDOT-provided control |
| Boundary retracement | Relative accuracy matters more than absolute | N/A | 2+ known monuments |

## Related

- [Least-squares concepts](least-squares-concepts.md)
- [Traverse types](traverse-types.md)
- [GNSS static](gnss-static.md)
- [Accuracy standards](accuracy-standards.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
- [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md)
