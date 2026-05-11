---
title: "Corridor Targets and Overrides"
section: "civil3d/corridors"
order: 120
visibility: public
tags: [corridor, target, override, surface-target, width-target, elevation-target, daylight]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, EDITCORRIDORTARGETS, CREATECORRIDOR]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Targets in a Corridor"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-31D0CC4D-A330-4E5D-9C7F-1F25D9C03C9F"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - Target Mapping Dialog Box"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1AC44B9C-1F1F-4FB7-9B95-2D7F3E11CB2F"
    verified: 2026-05-11
---

> **TL;DR**
> 1. A target tells a subassembly to follow real-world geometry: a surface (daylight), an alignment or polyline (width or offset), or a profile or 3D polyline (elevation).
> 2. Map targets in the **Target Mapping** dialog per region. Civil 3D matches subassembly inputs to objects you select; unmatched targets become warnings on rebuild.
> 3. Use parameter overrides per station for short transitions; use target objects for the rest. Mixing the two on the same parameter causes ambiguous behavior and rebuild warnings.

## What a target is

Subassemblies that vary their geometry expose **target parameters**:

| Target type | Typical subassemblies | Object types accepted |
|---|---|---|
| Surface | `DaylightStandard`, `LinkSlopeToSurface`, `LinkOffsetAndSlope` | Civil 3D surface |
| Width or offset | `LaneOutsideSuperWithWidening`, `BasicLaneTransition`, `UrbanCurbGutterGeneral` | Alignment, 2D polyline, feature line, survey figure |
| Slope or elevation | `LinkSlopeToElevation`, `LinkOffsetAndElevation` | Profile, 3D polyline, feature line, survey figure |

When a target is set, the subassembly recalculates its geometry at every frequency station to meet the target.

## Mapping targets

UI path: select corridor > right-click > Corridor Properties (`CORRIDORPROPERTIES`) > Parameters tab > click the **Target Mapping** cell (`...`) for the region.

In the Target Mapping dialog:

1. Each subassembly's target requests appear grouped (Surfaces, Width or Offset Targets, Slope or Elevation Targets).
2. Click in the Object Name cell, then pick the alignment/profile/surface/polyline. Multiple objects can be combined (e.g., one alignment from STA 0+00 to 5+00 and a different one from 5+00 to 10+00).
3. Optional: open the **Set Width Or Offset Target** sub-dialog to specify how to use the target (Outside or Inside of baseline, ignore vs subtract baseline offset).

Map targets at the **baseline default** level so every region inherits them, then override at the region level only for transitions.

## Overrides per region and per station

There are three places to change a subassembly's behavior:

1. **Assembly Properties > Construction tab** - change a parameter on the assembly. Affects every region using that assembly.
2. **Corridor Properties > Parameters > Override** - set a parameter for one region only. Persists across rebuilds.
3. **Corridor Properties > Parameters > Frequency / Apply Assembly Override** - apply different override values at specific stations within a region.

When both a target and an override are set on the same parameter, the override wins. Civil 3D logs `Override applied; target ignored at station X` to Event Viewer.

## Subassembly target persistence

- A target is stored by the corridor, not by the assembly. Copying an assembly does not copy its target mapping.
- If the referenced object (alignment, surface, polyline) is deleted, the corridor logs `Target object missing` and rebuilds without the target, often producing a wedge or a 0-width section.

## Common errors

- `Target not found for subassembly Sub-XYZ at station S`: a target was mapped but the object was deleted, erased from a different drawing, or the data shortcut is broken. Open Target Mapping, re-pick the object.
- `No target found, using default width/slope`: the subassembly expected a target but none was mapped. Either map one, or set the subassembly's default parameter to a static value.
- `Daylight could not reach target surface within max search distance`: the corridor extended past the surface boundary. Extend the surface, raise the subassembly's `MaxWidth` parameter, or insert a different daylight subassembly at that region.
- `Inside offset target precedes outside offset target`: the two targets reversed order along the alignment. Flip them in Target Mapping > Set Width Or Offset Target.

## Related

- [Targets (foundational)](targets.md)
- [Corridor frequency and regions](frequency-and-regions.md)
- [Corridor troubleshooting (rebuild errors)](corridor-troubleshooting.md)
- Commands: [CREATECORRIDOR](../commands/createcorridor.md)
