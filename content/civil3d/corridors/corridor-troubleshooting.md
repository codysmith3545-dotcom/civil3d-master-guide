---
title: "Corridor Troubleshooting (Rebuild Errors)"
section: "civil3d/corridors"
order: 140
visibility: public
tags: [corridor, troubleshooting, rebuild, error, event-viewer, surface-failure]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CORRIDORREBUILD, CORRIDORPROPERTIES, SHOWEVENTVIEWER]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - Troubleshooting Corridors"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D4595D0B-2CBB-4ACE-9B89-39C9A2A41A02"
    verified: 2026-05-11
  - title: "Autodesk Knowledge Network - Corridor will not rebuild"
    url: "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Corridor-rebuild-error.html"
    verified: 2026-05-11
---

> **TL;DR**
> 1. Open Event Viewer (`SHOWEVENTVIEWER`) on every failed rebuild; Civil 3D names the offending region, station, and subassembly there.
> 2. Most failures fall into four buckets: assembly errors, target-not-found, frequency conflicts at geometry points, and corridor surface failures.
> 3. Fix the upstream cause - rebuilding repeatedly on the same broken state will not clear the error.

## Reading rebuild diagnostics

After a rebuild, the corridor object shows one of:

- Green check icon: clean rebuild.
- Yellow exclamation: warnings logged; the corridor built but with missing features.
- Red X: hard failure; one or more regions did not build.

UI path: select corridor > right-click > Show Events, or run `SHOWEVENTVIEWER`. Filter the Action tab to "Corridor" to see only corridor messages.

## Common rebuild errors

### Subassembly construction errors

`Subassembly Sub-XYZ failed to construct at station S+SS.SS`

Causes and fixes:

- Negative or zero parameter (often a width or depth). Open Assembly Properties > Construction and verify the value.
- Subassembly DLL missing because the drawing was opened in a Civil 3D installation without that country kit. Reinstall the country kit or replace the subassembly with one available in the active kit.
- Target value produced a degenerate geometry (zero width). Inspect Target Mapping; the target alignment may cross the baseline at this station.

### Target unmatched

`Target object not found for subassembly Sub-XYZ; using default`

Causes and fixes:

- The target object was deleted, exploded, or unloaded.
- A data shortcut reference was broken; the source drawing moved.
- The corridor inherited the target from a region you deleted.

Open Corridor Properties > Parameters > Target Mapping. Empty target rows highlight in red. Re-pick or clear them.

### Frequency or station conflicts

`Cannot apply assembly at station S - station coincides with region boundary`

Causes and fixes:

- A user-added frequency station equals the region's Start or End station exactly. Nudge it by 0.01 ft (3 mm).
- Two regions share a station and use different assemblies. Civil 3D cannot evaluate both; insert a 0.01 ft gap, or merge the regions.

`Frequency interval too small for assembly evaluation`

- Frequency below 0.1 ft. Increase to at least 0.5 ft.

### Corridor surface failures

`Corridor surface 'Top' could not be built: insufficient feature line data`

Causes and fixes:

- The selected code (e.g., `Top`) does not exist in the assembly's code set. Open Corridor Properties > Surfaces tab > confirm the code; or change the Code Set Style on the assembly to one that emits `Top`.
- A region uses an assembly that does not produce the chosen code. Add the link to that region's assembly or omit the region from the surface.
- The corridor produced no points (every region failed upstream). Resolve the assembly/target errors first.

`Boundary self-intersects` when adding a daylight boundary

- The corridor crosses itself in plan (tight loop or hairpin). Use **Add Automatically** with a different daylight link, or split the corridor at the crossing.

### Memory and performance

`The operation failed: out of memory`

- Frequency too fine, corridor too long, or too many baselines. Split into multiple corridors that reference each other's surfaces via data shortcuts, or coarsen frequency.

## Recovery workflow

1. Note the error text and station from Event Viewer.
2. Open Corridor Properties > Parameters and locate the region containing the station.
3. Apply the fix (assembly edit, target re-map, frequency edit).
4. Right-click the corridor > Rebuild Corridor (`CORRIDORREBUILD`), not "Rebuild - Automatic". Manual rebuild lets you confirm each fix isolates the issue.
5. If a fix introduces a new error, undo immediately rather than stacking fixes.

## Related

- [Corridor assemblies (advanced composition)](corridor-assemblies.md)
- [Corridor targets and overrides](corridor-targets-and-overrides.md)
- [Corridor frequencies and station control](corridor-frequencies-and-station-control.md)
- Commands: [CREATECORRIDOR](../commands/createcorridor.md)
