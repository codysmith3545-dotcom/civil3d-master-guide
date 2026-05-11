---
title: "Surface Analysis: Slope and Aspect"
section: "civil3d/surfaces-analytics"
order: 20
visibility: public
tags: [surface, analysis, slope, aspect, watershed, drainage, arrow]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [SURFACEPROPERTIES, ADDSURFACEANALYSIS, EXTRACTSURFACEWATERSHED]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - To Create a Slope Surface Analysis"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3E54A7CB-2DB1-4F8C-823A-3A7B0EAAEE8E"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Create a Watershed Analysis"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5AAEC1F2-FCAC-470A-8E3B-EE3E78AE6F0A"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Slope analysis paints each TIN triangle by its slope percentage or ratio; slope arrows show the steepest-descent direction per triangle.
> 2. Aspect analysis colours each triangle by the compass direction its downhill points face - useful for solar studies and overland flow.
> 3. Watershed analysis traces overland flow on the TIN and groups triangles into catchments, depressions, and flat areas.

## Slope analysis

UI path: Surface Properties > Analysis tab > Analysis type **Slopes**.

Configuration:

- **Number of ranges**: typical settings 4 to 8.
- **Range method**: Equal interval, Quantile, or Standard deviation.
- Output units: percentage (`%`) or ratio (`H:V`). Set in **Drawing Settings > Ambient Settings > Slopes**.

To show **slope arrows** instead of (or in addition to) coloured triangles:

1. Surface Properties > Analysis tab > set Analysis type to **Slope Arrows**.
2. Set the number of ranges and arrow colour.
3. Open the surface style > Display tab > enable `Slope Arrows` for Plan View Direction.

Arrows draw at the centroid of each triangle, pointing downhill.

### Common slope thresholds (project-dependent)

Verify with project standards. Examples (not authoritative; confirm with site spec):

- ADA-compliant accessible route: 5 percent maximum running slope.
- Driveway approach apron: many jurisdictions cap at 8 percent (verify per jurisdiction).
- Erosion-control vegetated slope: 3H:1V typical maximum without armoring.

Set range break points to highlight the thresholds the design must satisfy.

## Aspect analysis

UI path: Surface Properties > Analysis tab > Analysis type **Aspects**.

Civil 3D groups triangles into compass octants (N, NE, E, SE, S, SW, W, NW) by default. The number of ranges defines how many directional bins. The surface style's `Aspects` display component must be enabled.

Aspect analysis is most useful for:

- Solar exposure studies (south-facing slopes in the Northern Hemisphere).
- Initial overland flow assessment before building a watershed analysis.
- Checking site grading for unintended drainage directions.

## Watershed analysis

UI path: Surface Properties > Analysis tab > Analysis type **Watersheds**.

The watershed analysis classifies each triangle by:

| Class | Meaning |
|---|---|
| Boundary point | Outflows from the surface boundary |
| Boundary segment | Outflow along the surface boundary |
| Depression | Local low point with no outflow |
| Flat area | No definable slope direction |
| Multi-drain | Triangle drains to multiple points |
| Multi-drain depression | Depression with multiple inflow paths |

Each watershed gets its own ID. Set a minimum depression and minimum flat-area threshold to merge small artifacts.

To run: Analysis tab > click the **Run analysis** arrow. A legend table can be added the same way as for elevations.

### Use in design review

- Depressions indicate possible ponding. Confirm each is intentional (detention basin) or a grading defect.
- Boundary point outflows indicate where water leaves the site - they should match the drainage plan.
- Multi-drain triangles often appear at saddle points; verify the intended flow direction.

## Common errors

- Slope arrows do not display: surface style's Plan View Direction does not enable `Slope Arrows`.
- Watershed analysis returns one giant watershed: depression depth threshold is set to 0, treating every dip as a watershed. Raise the threshold (e.g., 0.5 ft) to merge small dips.
- Aspect colours bleed across the surface: too few ranges (under 4) collapse the bins. Increase to 8 octants.
- `Cannot compute watershed - surface has invalid triangulation`: check for vertical or near-vertical triangles in the TIN; smooth or remove them.

## Related

- [Surface analysis: elevation bands](surface-analysis-elevation-bands.md)
- [Volume surfaces and comparison](volume-surfaces-and-comparison.md)
- [Foundational surface analysis](../surfaces/surface-analysis.md)
