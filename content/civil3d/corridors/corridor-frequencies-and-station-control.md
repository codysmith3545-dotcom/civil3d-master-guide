---
title: "Corridor Frequencies and Station Control"
section: "civil3d/corridors"
order: 130
visibility: public
tags: [corridor, frequency, station, region, sampling, curve, performance]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, CORRIDORFREQUENCY, CREATECORRIDOR]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - Corridor Frequency to Apply Assemblies Dialog Box"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-94ECF7CC-1B9C-44FF-B927-6BFAF85DDC52"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Set Frequencies for a Corridor"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3B4FC5C0-2BCC-4BB9-B9D7-31AB2BB6A4D3"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Frequency is the station interval at which Civil 3D evaluates the assembly along the baseline. Tangents, curves, spirals, and vertical curves each get their own interval.
> 2. Add explicit stations at PCs, PTs, high points, low points, and superelevation rollover stations so the corridor cross-section captures the geometry exactly.
> 3. Coarser frequency = faster rebuilds and lighter surfaces; finer frequency = smoother corridor surface in curves. Tune per region rather than globally.

## Frequency intervals

UI path: select corridor > Corridor Properties (`CORRIDORPROPERTIES`) > Parameters tab > Frequency cell (`...`) for the region. The **Frequency to Apply Assemblies** dialog shows:

| Frequency type | Default | Notes |
|---|---|---|
| Along tangents | 25 ft (or 5 m) | Straight horizontal segments |
| Along curves | 25 ft | Use the curve-increment option for tighter sampling on small-radius curves |
| Along spirals | 25 ft | Transitions in/out of curves |
| Along profile curves | 25 ft | Sag and crest curves on the profile |
| At horizontal geometry points | yes | PC, PT, PI, PCC |
| At vertical geometry points | yes | BVC, EVC, PVI, high/low point |
| At superelevation critical stations | yes | NC, RC, FS rollover stations |
| At profile high/low points | yes | Sag and crest apexes |

For curves, prefer **At an increment** with a small increment over a fixed station distance. Civil 3D 2024+ supports `Mid-Ordinate Distance` based sampling that adapts to curve radius.

## Adding explicit stations

The frequency dialog supports per-station overrides:

1. Click **Add** to insert a station and assign a frequency increment that starts there.
2. Add user-specified stations to capture features the geometry rules miss: a driveway centerline, a ditch transition, a culvert station.
3. Sort the table by station - out-of-order entries cause `Station out of region range` warnings on rebuild.

## Regions and station control

A region defines the station extents over which an assembly is applied. Add regions to:

- Swap assemblies (urban-to-rural transition, divided-to-undivided).
- Change frequency density within a corridor (tight in the interchange, loose on the open road).
- Apply different target mapping along the same alignment.

UI path: Corridor Properties > Parameters tab > **Add Region** button. Set Start Station and End Station for each region. Regions cannot overlap; gaps are valid (the corridor produces no model in the gap).

To split an existing region: right-click the region row > Split Region. Set the split station in the dialog.

## Frequency vs corridor surface accuracy

The corridor surface is built from feature lines connecting corridor points across stations. With coarse frequency:

- Curves chord between sample stations rather than following the alignment.
- Slope changes between samples appear as flat planes.
- Volume calculations underestimate cut/fill where curvature is high.

A practical starting point for highway design: 25 ft tangent, 10 ft curve, all geometry points sampled. For tight subdivision cul-de-sacs, drop curve frequency to 5 ft.

## Performance trade-offs

Each frequency station evaluates every subassembly in the assembly. Halving the frequency roughly doubles the rebuild time and memory footprint. To keep rebuilds manageable:

- Coarsen frequency in unimportant regions (deep median, tail of a long approach).
- Use **Rebuild - Automatic: Off** while editing; rebuild manually with `CORRIDORREBUILD` when you are ready.
- Freeze the corridor's `_Corridor` and `_Top` feature line layers while not viewing the model.

## Common errors

- `Frequency station X is outside the region range`: a user-added station fell outside Start/End. Edit the station or extend the region.
- `Could not apply assembly at station X - target or frequency conflict`: a frequency station coincided exactly with a region boundary where the assembly changes. Move the user station by 0.01 ft.
- `Corridor sample line generation failed`: frequency too coarse around a kink in the alignment. Add geometry-point sampling.
- `Out of memory while rebuilding corridor`: frequency too fine for available RAM. Coarsen non-critical regions, or split the corridor into multiple baselines that rebuild independently.

## Related

- [Corridor frequency and regions (foundational)](frequency-and-regions.md)
- [Corridor targets and overrides](corridor-targets-and-overrides.md)
- [Corridor troubleshooting (rebuild errors)](corridor-troubleshooting.md)
- Commands: [CREATECORRIDOR](../commands/createcorridor.md)
