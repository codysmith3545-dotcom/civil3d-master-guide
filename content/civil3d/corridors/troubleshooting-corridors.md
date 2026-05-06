---
title: "Corridor Troubleshooting"
section: "civil3d/corridors"
order: 90
visibility: public
tags: [corridor, troubleshooting, rebuild, performance, error, out-of-date]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORPROPERTIES, CORRIDORREBUILD, REGEN, AUDIT]
sources:
  - title: "Autodesk Civil 3D Help — Corridor Troubleshooting"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-F5D3B7E5-3F5E-4D7F-8B3E-D5F7E5A3B7D5"
updated: 2026-05-06
---

> **TL;DR**
> 1. Most corridor problems fall into a few categories: **won't rebuild**, **missing geometry at some stations**, **daylight not reaching the surface**, **out-of-date warnings**, or **slow performance**. Start diagnosis with the **Event Viewer** (View tab > Palettes > Event Viewer) — it logs specific errors and warnings per station.
> 2. The single most common fix is to verify that **targets are correctly assigned** and that target surfaces extend beyond the corridor limits. The second most common is to check for **overlapping or gapped regions**.
> 3. For performance on large corridors, reduce frequency, limit the number of extracted surfaces, switch to manual rebuild mode, and consider splitting into multiple corridor objects.

## Corridor won't rebuild

### Symptoms

- Right-click > Rebuild produces no change, or an error dialog appears.
- The corridor shows a yellow out-of-date icon in Prospector.
- The Event Viewer shows errors.

### Diagnosis

1. **Open Event Viewer** (View tab > Palettes > Event Viewer). Filter by the corridor name. Look for error messages — they typically include a station number and a description.
2. **Check the alignment and profile.** If the corridor's alignment or profile has been deleted or renamed, the corridor cannot rebuild. Open Corridor Properties > Baselines tab and verify the alignment and profile references are valid.
3. **Check assemblies.** If the assembly referenced by a region has been deleted from the drawing, the region cannot compute. Re-create or re-assign the assembly.
4. **Check for circular references.** If the corridor surface is used as a target surface for its own subassemblies, the corridor cannot solve (it needs the surface to build the surface). Use the existing-ground surface for daylighting, not the corridor surface.

### Fixes

- Reassign missing alignment, profile, or assembly references in Corridor Properties.
- If the corridor is deeply corrupted, create a new corridor object using the same alignment, profile, and assembly. Delete the old one.
- Run `AUDIT` to check drawing integrity. Corrupt objects can prevent corridor rebuilds.

## Missing geometry at specific stations

### Symptoms

- The corridor appears to have gaps — some stations show cross-section geometry, others do not.
- The corridor surface has holes or missing triangulation.

### Diagnosis

1. Open Corridor Properties > Parameters tab. Check that region station ranges cover the entire alignment without gaps.
2. In the Event Viewer, look for warnings like "Subassembly <name> failed at station <x>." This usually means the subassembly could not resolve its geometry — often because a target was unreachable.
3. Use `EDITCORRIDORSECTION` to step through the corridor station by station. At a problem station, the cross-section preview shows which subassemblies produced output and which did not.

### Common causes

| Cause | Fix |
|---|---|
| Target surface does not cover the station area | Extend the surface boundary or add surface data |
| Subassembly slope cannot reach the target surface within its MaxWidth | Increase MaxWidth in the subassembly parameters |
| Region gap between two adjacent regions | Adjust region start/end stations to eliminate the gap |
| Alignment extends beyond the profile | Extend the profile or restrict the corridor's station range |

## Daylight not reaching the surface

### Symptoms

- The daylight subassembly (e.g., `DaylightBench`, `LinkSlopeToSurface`) draws a short line that stops in mid-air instead of connecting to the ground surface.

### Diagnosis

1. Verify the surface target is assigned. Open Corridor Properties > Parameters > click the Targets column for the region. Confirm the daylight subassembly's surface target points to the correct existing-ground surface.
2. Check the subassembly's MaxWidth (or MaxCutWidth/MaxFillWidth) parameter. If the existing ground is far from the corridor baseline, the subassembly may hit its width limit before intersecting the surface.
3. Check the surface extent. If the existing-ground TIN surface boundary ends before the daylight slope reaches it, the subassembly has no surface data to intersect.

### Fixes

- Assign the correct target surface.
- Increase MaxWidth (try doubling it).
- Extend the existing-ground surface. Add breaklines or point data beyond the corridor limits. A good practice is to ensure the surface extends at least 50 ft beyond the expected daylight line on each side.

## Overlapping regions

### Symptoms

- In the overlap zone, only one region's geometry appears. The other region's geometry is suppressed.
- The Event Viewer may show "Overlapping region" warnings.

### Fix

Regions on the same baseline must not overlap. Edit region station limits in Corridor Properties > Parameters tab so they meet end-to-end:

- Region 1: sta 0+00 to sta 10+00
- Region 2: sta 10+00 to sta 25+00

Do not overlap (e.g., Region 1 ending at 10+50 while Region 2 starts at 10+00).

## Out-of-date warnings

### Symptoms

- The corridor icon in Prospector shows a yellow triangle.
- The corridor surface contours do not match the current alignment/profile.

### Causes

The corridor is set to manual rebuild mode and has not been rebuilt since the last edit to the alignment, profile, surface, or assembly.

### Fix

Right-click the corridor > Rebuild. If you want automatic updates during design, right-click > Properties > set Rebuild to Automatic. Be aware that automatic rebuild can slow down editing on large corridors.

## Performance on long corridors

### Symptoms

- Corridor rebuild takes more than 30 seconds (sometimes minutes).
- Drawing becomes sluggish.
- Save times are excessive.

### Mitigation strategies

| Strategy | Effect |
|---|---|
| Reduce frequency | Fewer cross-sections to compute. Use 50 ft tangent/25 ft curve for preliminary design. |
| Manual rebuild mode | Corridor does not rebuild on every edit; rebuild only when you need to check results. |
| Limit extracted surfaces | Each corridor surface adds processing time. Extract only what you need. |
| Split the corridor | Break long corridors at logical points (intersections, project limits). Each segment is a separate corridor object. |
| Simplify assemblies | Remove unnecessary subassemblies (e.g., detailed curb geometry during grading design). |
| Avoid circular target references | If a corridor surface is referenced by a grading group that modifies the target surface, the corridor and grading rebuild in a loop. |
| Use data shortcuts | Keep the corridor in its own drawing. Reference its surfaces in other drawings via data shortcuts. The referencing drawings do not process the corridor rebuild. |

### File size

Large corridors can produce DWG files exceeding 100 MB. To manage:

- Purge unused styles and objects (`PURGE`).
- Detach unnecessary xrefs.
- Verify that corridor surfaces do not have excessively fine triangulation from overly tight frequency settings.

## Other issues

### "Unknown subassembly" error

The assembly references a subassembly type that is not installed. This happens when:

- A drawing is opened on a machine that does not have the same custom subassemblies (`.pkt` or `.dll`) installed.
- A Civil 3D version mismatch: the subassembly was built for a newer version.

Fix: install the missing subassembly package on the current machine, or replace the unknown subassembly with a stock equivalent.

### Corridor feature lines appear jagged

The corridor frequency is too coarse. Reduce the interval along curves and enable "At horizontal geometry points."

### Corridor surface contours look wrong

Check that the corridor surface boundary is correctly defined. Without a boundary, triangulation can span across voids and produce false contours. See [Corridor surfaces](corridor-surfaces.md).

## Related

- [Targets (surface, alignment, profile)](targets.md)
- [Corridor frequency and regions](frequency-and-regions.md)
- [Corridor surfaces](corridor-surfaces.md)
- [Assemblies and subassemblies](assemblies-and-subassemblies.md)
