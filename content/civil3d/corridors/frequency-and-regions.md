---
title: "Corridor Frequency and Regions"
section: "civil3d/corridors"
order: 25
visibility: public
tags: [corridor-frequency, region, transition, assembly-override, station-range]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, EDITCORRIDORSECTION, ADDCORRIDORREGION]
sources:
  - title: "Autodesk Civil 3D Help — Corridor Frequency"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-DA67C2F8-3F8B-4B29-9C3D-F6F7B7E7B3F3"
updated: 2026-05-06
---

> **TL;DR**
> 1. **Frequency** controls how often Civil 3D computes cross-sections along the corridor. Lower frequency intervals produce a smoother model but increase processing time. A typical road corridor uses 25 ft (or 10 m) intervals plus additional sections at geometry points.
> 2. **Regions** divide a corridor baseline into station ranges, each with its own assembly, targets, and frequency. Use regions to change cross-section type along an alignment — for example, from a rural two-lane to an urban curbed section.
> 3. Transition stations between regions must be managed carefully; overlapping or gapped regions cause missing geometry or corridor rebuild errors.

## Frequency

Corridor frequency determines the stations at which Civil 3D evaluates the assembly to produce cross-section geometry. More stations mean more triangles in the corridor surface and a smoother model, but also longer rebuild times and larger file sizes.

### Frequency types

In Corridor Properties > Frequency tab, you can set intervals for several geometry triggers independently:

| Frequency type | Description | Typical value |
|---|---|---|
| Along tangents | Interval on straight alignment segments | 25 ft |
| Along curves | Interval on horizontal curves | 10 ft |
| Along spirals | Interval on spiral transitions | 10 ft |
| Along profile curves | Additional stations at vertical curve geometry points | Enabled |
| At horizontal geometry points | Sections at PC, PT, PI, SC, CS, etc. | Enabled |
| At profile geometry points | Sections at PVC, PVI, PVT | Enabled |
| At superelevation critical stations | Sections at superelevation transition points | Enabled |

### Choosing frequency

- **Rough design / feasibility:** 50 ft along tangents, 25 ft along curves. Fast rebuild; adequate for volume estimates.
- **Final design / plan production:** 25 ft along tangents, 10 ft along curves. Smooth model suitable for grading and earthwork.
- **High-detail (interchanges, bridges):** 10 ft or 5 ft everywhere. Large models; consider splitting into corridor segments.

The "at geometry points" options should almost always be enabled. They ensure that horizontal and vertical curve beginnings and ends produce exact cross-sections, preventing faceted surfaces at transitions.

## Regions

A region is a station range along a corridor baseline that uses a specific assembly. A single baseline can have multiple regions end-to-end.

### Why use regions

- **Cross-section changes.** A road transitions from a rural open-ditch section to an urban curbed section at a specific station. Each section needs a different assembly.
- **Intersection geometry.** Through the intersection zone, a wider assembly with turn lanes replaces the standard assembly.
- **Bridge or culvert gaps.** A region with no assembly (or a bridge-deck assembly) covers the bridge limits; normal road assemblies handle the approach.
- **Parameter overrides.** Even if the same assembly is used, a region can override specific subassembly parameters (e.g., a wider shoulder in one segment).

### Creating regions

1. Corridor Properties > Parameters tab.
2. Right-click the baseline > Add Region.
3. Specify the start and end stations and the assembly to use.
4. Set targets for the new region.

Alternatively, use `ADDCORRIDORREGION` to add a region interactively by clicking stations in the plan view.

### Region properties

Each region has:

- **Station range** — start and end. Must not overlap with other regions on the same baseline.
- **Assembly** — the cross-section template.
- **Targets** — surface, alignment, and profile targets specific to this region.
- **Frequency** — can inherit from the corridor-level setting or be overridden per region.
- **Subassembly parameter overrides** — change individual subassembly parameter values without modifying the shared assembly object.

## Transitions between regions

When two regions meet, the corridor abruptly switches from one assembly to another at the boundary station. Civil 3D does not automatically blend or taper between assemblies. If the cross-sections differ in width or shape, you must handle the transition:

### Transition strategies

1. **Transition region.** Insert a short intermediate region with an assembly that linearly transitions from one section to the other. Use alignment and profile targets to taper widths and elevations.
2. **Grading objects.** Create grading feature lines or pads to fill the gap between the two corridor sections.
3. **Variable-width subassemblies.** Use alignment targets so the lane width gradually changes across the transition zone within a single region.
4. **Overlapping assemblies.** In some cases, extending one region's assembly slightly past the transition point (with a daylight subassembly that tapers) provides a smooth model.

### Common transition issues

- **Gap between regions.** If region 1 ends at sta 10+00 and region 2 starts at sta 10+25, no corridor geometry exists for that 25 ft gap. Close the gap by adjusting region limits.
- **Overlap.** If regions overlap, Civil 3D uses only the first region's geometry in the overlap zone and ignores the second. The event viewer may warn about this.
- **Mismatched codes.** If the two assemblies use different subassembly code names (e.g., one uses "Top" and the other uses "Pave"), the corridor surface triangulation across the boundary may produce irregular results. Standardize code names in your assemblies.

## Editing regions after creation

- Drag region boundary grips in the plan view to adjust station limits.
- In Corridor Properties > Parameters tab, edit the start/end station values numerically.
- Change the assembly assignment by selecting a different assembly from the drop-down.
- Override individual subassembly parameters by expanding the region and clicking the parameter value.

## Performance considerations

- Each region adds overhead to the corridor rebuild. For a simple road with one cross-section type, a single region is most efficient.
- Long corridors (> 5 miles) with multiple regions and tight frequency may take significant time to rebuild. Consider splitting into multiple corridor objects at logical break points (intersections, project phase limits).
- Use the corridor's "Rebuild — Automatic" vs "Rebuild — Manual" setting (right-click corridor > Properties) to control whether the corridor rebuilds after every edit or only when you explicitly request it. Manual rebuild is recommended during heavy editing.

## Related

- [Assemblies and subassemblies](assemblies-and-subassemblies.md)
- [Targets (surface, alignment, profile)](targets.md)
- [Corridor surfaces](corridor-surfaces.md)
- [Corridor troubleshooting](troubleshooting-corridors.md)
