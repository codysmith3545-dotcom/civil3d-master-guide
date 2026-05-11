---
title: "Corridor Assemblies (Advanced Composition)"
section: "civil3d/corridors"
order: 110
visibility: public
tags: [assembly, subassembly, parametric, baseline, composition, corridor]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEASSEMBLY, ADDSUBASSEMBLY, ASSEMBLYPROPERTIES, CREATECORRIDOR]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - Assemblies Overview"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1E34F9C5-6D6C-4C3B-8975-FE5AE1D9FC2E"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Add Subassemblies to an Assembly"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7BBA8BE7-8C9D-49B1-AAD8-2BB58D7C5F19"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Build assemblies from the centerline outward: lane, then shoulder/curb, then sidewalk or buffer, then a daylight subassembly at the outermost point.
> 2. Drive geometry parametrically - set widths, slopes, and depths as named parameters in the assembly, and override per region only when the typical section actually changes.
> 3. Keep one assembly per typical section. Variant sections (urban vs rural, divided vs undivided) belong in separate assemblies referenced by separate corridor regions.

## Assembly composition order

An assembly is a chain of subassemblies attached to a baseline marker. The standard composition order, from baseline outward on each side, is:

1. Travel lane (`LaneSuperelevationAOR` or `LaneOutsideSuperWithWidening`).
2. Shoulder or curb-and-gutter (`UrbanCurbGutterGeneral`, `ShoulderExtendSubbase`).
3. Sidewalk, buffer, or planting strip (`UrbanSidewalk`, `GenericPavementStructure`).
4. Daylight or tie subassembly (`DaylightStandard`, `LinkSlopeToSurface`, `DaylightBench`).

Place the components by clicking the assembly marker line. The subassembly attaches at its anchor point and exposes the next anchor for the following piece.

UI path: Home tab > Create Design panel > Assembly > Create Assembly (`CREATEASSEMBLY`).

## Parametric driving

Every subassembly exposes parameters in the Properties palette. To drive an assembly parametrically:

1. Select the assembly, right-click > Assembly Properties (`ASSEMBLYPROPERTIES`).
2. On the **Construction** tab, expand each subassembly and review parameters such as `Width`, `Default Slope`, `Pave1 Depth`, `Subbase Depth`.
3. Change a parameter value here rather than editing the inserted subassembly. Edits propagate to every corridor that references the assembly on the next rebuild.
4. For values that must change along the alignment (variable lane width, transitioning shoulder), set the parameter to `Use target` or leave the parameter alone and use a corridor target instead.

## Naming, codes, and code sets

Each subassembly emits point, link, and shape codes. Civil 3D uses these codes to generate feature lines, corridor surfaces, and quantity takeoffs.

- Open the **Codes** tab of Assembly Properties to see every point, link, and shape code that the assembly produces.
- Assign a **Code Set Style** that maps each code to a layer, color, and label style. Set this on the assembly via Properties palette > Code Set Style.
- Civil 3D ships `All Codes` and `All Codes With Structures`. Custom code sets live in the drawing template.

## Reusing assemblies across drawings

Assemblies cannot be referenced through data shortcuts. To reuse:

- Save the assembly to a drawing in your template library, then insert with INSERT or copy/paste between drawings.
- Add the assembly to a tool palette: select the assembly, drag it onto an open tool palette tab. The palette entry stores a reference to the source drawing.
- Or convert frequently used groups of subassemblies into a custom subassembly with **Subassembly Composer** for Autodesk Civil 3D.

## Common errors

- `Subassembly failed to create a link from point P1 to point P2`: a parameter (often `Width` or `Slope`) evaluated to zero or a negative value. Open the Event Viewer (`SHOWEVENTVIEWER`) and check the subassembly's parameters at the failing station.
- `An invalid subassembly was found and cannot be added`: the assembly references a subassembly DLL that is not loaded. Verify Civil 3D installed the country-kit pack the subassembly came from, or reload the .NET assembly with `NETLOAD`.
- `Assembly is referenced by a corridor and cannot be deleted`: detach the assembly from every corridor region in Corridor Properties > Parameters before erasing.

## Related

- [Assemblies and subassemblies (foundational)](assemblies-and-subassemblies.md)
- [Corridor targets and overrides](corridor-targets-and-overrides.md)
- [Subassembly Composer](subassembly-composer.md)
- Commands: [CREATEASSEMBLY](../commands/createassembly.md), [CREATECORRIDOR](../commands/createcorridor.md)
