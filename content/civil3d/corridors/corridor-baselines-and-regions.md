---
title: "Corridor Baselines and Regions (Advanced)"
section: "civil3d/corridors"
order: 105
visibility: public
tags: [corridor, baseline, region, offset-baseline, station-range, multi-baseline]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, CREATECORRIDOR, ADDCORRIDORBASELINE]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Corridor Baselines and Regions"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3BB0D1DC-2A19-4D71-9B6A-30B7A2B7B0DC"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Add a Baseline to a Corridor"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5DA89E2B-8B6C-49E2-9F0F-9C1A4F7CE0F2"
    verified: 2026-05-11
---

> **TL;DR**
> 1. A corridor can hold many baselines; each baseline is an alignment + profile pair, and each baseline holds one or more regions that pair with an assembly.
> 2. Use offset baselines for divided sections where the median, left lanes, and right lanes follow independent alignments and profiles.
> 3. Reserve a separate baseline for cul-de-sacs, intersections, and complex grading drives - each gets its own frequency, targets, and assembly.

## Baseline anatomy

UI path: select corridor > Corridor Properties (`CORRIDORPROPERTIES`) > **Parameters** tab.

The Parameters tab is a tree:

```
Corridor
  Baseline 1 - Alignment + Profile
    Region 1 - Assembly A (STA 0+00 to 5+50)
    Region 2 - Assembly B (STA 5+50 to 12+00)
  Baseline 2 (Offset) - Alignment + Profile
    Region 1 - Assembly C (STA 0+00 to 8+25)
```

Each row exposes its assembly, frequency, target mapping, and overrides.

## Adding a baseline

UI path: in Corridor Properties > Parameters tab > click **Add Baseline**.

The dialog asks for:

- Baseline name.
- Horizontal baseline - choose an alignment (any type: centerline, offset, curb return).
- Vertical baseline - choose a profile from that alignment.

The new baseline is added with no regions. Click **Add Region** to attach an assembly and station range.

## Offset baselines

An **offset baseline** is a baseline whose alignment was built with `CREATEOFFSETALIGNMENT`. Offset alignments are children of a parent alignment; they update automatically when the parent moves.

When to use:

- Divided highway with a depressed median - one baseline for the median, one for each direction.
- Asymmetric widening - independent offset profiles let each side's edge-of-pavement vary independently.
- Curb returns at intersections - each curb return alignment + profile drives its own baseline.

## Regions

A region is a station range on a baseline that applies a single assembly. Use multiple regions to:

| Reason | Example |
|---|---|
| Change assembly | Urban section vs rural section on the same road |
| Change frequency | Tight curve sampling in the middle, coarse elsewhere |
| Change targets | Width-target switches from one alignment to another |
| Stop the corridor | Insert a gap between regions to skip an intersection footprint |

Regions cannot overlap. Gaps are allowed.

UI path to split a region: right-click the region row > **Split Region**. Set the split station.

UI path to merge: select adjacent regions with the same assembly > right-click > **Merge Regions** (Civil 3D 2024+).

## Baseline order and dependency

Civil 3D evaluates baselines top-down. If a corridor surface from baseline 1 is used as a target for baseline 2, baseline 1 must rebuild first. The Parameters tab supports drag-to-reorder.

For intersections, the typical order is:

1. Mainline baseline.
2. Side-street baseline.
3. Each curb-return offset baseline.
4. The intersection grading baseline (uses surface targets from baselines 1-3).

## Intersection wizard interaction

The Create Intersection wizard (`CREATEINTERSECTION`) builds the baseline and region structure for the user. After running it, inspect the resulting corridor in Parameters to understand which baseline drives which curb return. Edits made manually after the wizard runs persist; re-running the wizard rebuilds the structure.

## Common errors

- `Region station range exceeds alignment length`: end station is past the alignment's end. Trim the region.
- `Baseline alignment was deleted`: a parent alignment was removed and the offset baseline lost its parent. Re-create the offset alignment or remove the baseline.
- `Corridor surface target depends on baseline that has not rebuilt`: reorder baselines so dependencies come first.
- `Baseline conflict - two baselines share station 0+00 at intersection`: expected at intersections, but two regions cannot evaluate at the exact same point. Insert a small gap (0.01 ft) or use the Intersection wizard.

## Related

- [Corridor assemblies (advanced composition)](corridor-assemblies.md)
- [Corridor targets and overrides](corridor-targets-and-overrides.md)
- [Corridor frequencies and station control](corridor-frequencies-and-station-control.md)
- [Corridor frequency and regions (foundational)](frequency-and-regions.md)
