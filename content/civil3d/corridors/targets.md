---
title: "Corridor Targets"
section: "civil3d/corridors"
order: 20
visibility: public
tags: [target, surface-target, alignment-target, profile-target, daylight, variable-width]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, EDITCORRIDORSECTION]
sources:
  - title: "Autodesk Civil 3D Help — Corridor Target Mapping"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2D6C0A1F-BD5C-4F9C-8D3F-E8B8C4F5E8D4"
updated: 2026-05-06
---

> **TL;DR**
> 1. **Targets** let subassemblies reference external geometry instead of using fixed parameter values. The three target types are **surface** (for daylighting to existing ground), **width/offset alignment** (for variable-width lanes or features), and **elevation/profile** (for variable-elevation features).
> 2. Targets are mapped in **Corridor Properties > Parameters tab**. Click the Target column for a region to open the Target Mapping dialog, then assign the appropriate surface, alignment, or profile to each subassembly input that requests a target.
> 3. Without proper target mapping, subassemblies that expect targets (e.g., `DaylightBench`, `LinkSlopeToSurface`) will fail or produce no geometry at stations where they cannot resolve the target.

## Target types

### Surface targets

A surface target tells a subassembly to extend its geometry until it intersects a surface. The most common use is **daylighting**: the cut/fill slope extends from the last roadway component until it meets existing ground.

Subassemblies that use surface targets:

- `DaylightBench`, `DaylightCut`, `DaylightFill`, `DaylightStandard`
- `LinkSlopeToSurface`
- Any custom subassembly with a surface input

When a corridor region has a daylight subassembly but no surface target assigned, the subassembly produces no links at those stations and may generate a warning in the Event Viewer.

### Alignment targets (width/offset)

An alignment target replaces a subassembly's fixed width parameter with a horizontal offset derived from another alignment. This creates a **variable-width feature** that follows the target alignment's horizontal position.

Common uses:

- **Variable-width median** — the left lane subassembly targets a median-edge alignment instead of using a constant width.
- **Turn lanes / tapers** — the lane width varies as the taper alignment diverges from the centerline.
- **Irregular property boundaries** — a sidewalk subassembly targets a property-line alignment so the sidewalk follows the lot line.

The subassembly computes its width at each frequency station as the perpendicular offset from the corridor baseline to the target alignment.

### Profile targets (elevation)

A profile target overrides a subassembly's fixed elevation or slope with elevations from a profile on a target alignment. This creates features that follow a **variable elevation**.

Common uses:

- **Ditch flowline** — the ditch bottom subassembly targets a ditch profile that was designed separately.
- **Top-of-wall** — a retaining-wall subassembly follows a wall-top profile.
- **Edge-of-pavement profile** — on superelevated or non-uniform cross slopes, an independent edge profile controls the outer lane elevation.

Profile targets are paired with alignment targets. The target alignment provides horizontal position; the target profile on that alignment provides elevation.

## Setting targets in corridor properties

1. Select the corridor > right-click > Corridor Properties (`CORRIDORPROPERTIES`).
2. Go to the **Parameters** tab. Each region is listed with its assembly and station range.
3. Click the **Set All Targets** button (or click the target icon in a specific row) to open the Target Mapping dialog.
4. The dialog lists every subassembly in the assembly that has a target parameter. For each:
   - **Surface targets** — pick from surfaces in the drawing (e.g., "Existing Ground").
   - **Width or Offset targets** — pick from alignments in the drawing.
   - **Slope or Elevation targets** — pick from profiles on the selected target alignment.
5. Click OK. The corridor rebuilds using the assigned targets.

### Target mapping dialog layout

The dialog groups subassembly targets by type:

```
Subassembly: DaylightBench (right)
  Target: Surface  →  [Pick: Existing Ground]

Subassembly: LaneSuperelevationAOR (right)
  Target: Width or Offset Alignment  →  [Pick: Edge of Pavement - RT]
  Target: Slope or Elevation Profile →  [Pick: EP Profile - RT]
```

Each subassembly input is listed separately. If a subassembly has multiple target inputs (e.g., cut surface and fill surface), they can reference different objects.

## Common target patterns

### Simple daylighting

- Assembly: Lane + Curb + DaylightBench
- Targets: DaylightBench surface target = Existing Ground surface
- Result: Corridor cuts or fills from the back of curb to existing ground

### Variable-width lane with offset alignment

- Assembly: LaneSuperelevationAOR (with width target enabled)
- Targets: Lane width alignment = edge-of-pavement alignment
- Result: Lane width varies station-to-station as the EOP alignment diverges from or converges with the centerline

### Divided highway with independent profiles

- Baseline 1: CL of northbound lanes, with NB profile
- Baseline 2 (offset): CL of southbound lanes, with SB profile
- Targets: Median subassembly targets the opposing baseline's alignment and profile
- Result: Median width and elevation vary independently

### Ditch with separate flowline profile

- Assembly: Lane + Shoulder + Ditch + DaylightBench
- Targets: Ditch bottom profile target = ditch design profile on a ditch alignment
- Result: Ditch depth varies to follow a designed hydraulic grade

## Troubleshooting targets

| Symptom | Likely cause | Fix |
|---|---|---|
| Daylight subassembly produces no geometry | Surface target not assigned or surface doesn't extend to corridor limits | Assign the correct surface; extend the surface boundary |
| Lane width is constant despite alignment target | Target alignment is parallel to the baseline at a constant offset | Verify the target alignment actually varies in offset |
| Corridor rebuilds with warnings about missing targets | Target object was deleted or renamed | Reassign targets in Corridor Properties |
| Subassembly overshoots existing ground | Surface target is correct but subassembly slope is too flat to intersect within its max-width parameter | Increase the subassembly's MaxWidth parameter |

## Related

- [Assemblies and subassemblies](assemblies-and-subassemblies.md)
- [Corridor frequency and regions](frequency-and-regions.md)
- [Corridor surfaces](corridor-surfaces.md)
- [Corridor troubleshooting](troubleshooting-corridors.md)
