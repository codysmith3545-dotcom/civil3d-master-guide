---
title: "Pipe Network Interferences"
section: "civil3d/pressure-pipe-networks"
order: 30
visibility: public
tags: [interference, clash-detection, pressure-pipe, gravity-pipe, clearance, conflict]
appliesTo: [civil3d-2022, civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEINTERFERENCECHECK, RUNPIPENETWORKINTERFERENCECHECK, PIPENETWORKPROPERTIES]
updated: 2026-05-11
sources:
  - title: "Autodesk Civil 3D Help - About Interference Checks"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3DBE7B58-1F4E-44A6-8B7C-3A0F95B1A75F"
    verified: 2026-05-11
  - title: "Autodesk Civil 3D Help - To Create an Interference Check"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-EB87D4BE-2EBB-4C9C-83AE-3E91B19C3D9D"
    verified: 2026-05-11
---

> **TL;DR**
> 1. An interference check compares two pipe networks and lists every point where the parts come within a user-set distance.
> 2. Build a 3D clearance criterion (radial clearance plus a vertical buffer) so that a small horizontal clash with adequate vertical separation does not flag.
> 3. Resolve interferences by adjusting pipe elevations, rerouting in plan, or adding offsets - then rerun the check until the list is empty.

## Creating an interference check

UI path: Home tab > Create Design panel > Pipe Network drop-down > **Pipe Network Interference Check** (`CREATEINTERFERENCECHECK`).

1. Select the first pipe network in plan, then the second. Networks can be gravity-vs-gravity, pressure-vs-pressure, or gravity-vs-pressure.
2. The **Create Interference Check** dialog opens.
3. Set:
   - Name and description.
   - Style (controls the 3D marker block displayed at each clash).
   - Layer.
   - **3D proximity criteria**: apply a buffer distance. Civil 3D treats two parts as interfering if they come within this distance in 3D.
4. Click OK. The check runs and a count of interferences is reported. The check object appears under Toolspace > Prospector > Pipe Networks > Interference Checks.

## Interpreting results

Expand the interference check in Prospector. Each row lists:

- Part 1 and Part 2 (network and part name).
- Center-to-center 3D distance.
- Plan station of each part.

Right-click an interference row > Zoom To. Civil 3D highlights both parts and the 3D marker.

The marker is a block; its size reflects the criteria. Edit the style in Toolspace > Settings > Pipe Network > Interference Styles to change the marker.

## Resolving conflicts

For each interference:

1. Verify the conflict is real by checking the parts in 3D. Some interferences are conservative (the criterion buffer triggered even though parts have enough clearance).
2. Choose a resolution:
   - **Lower or raise the gravity pipe** at one structure to gain vertical separation. The pipe's slope rule may flag a violation; adjust accordingly.
   - **Reroute the pressure pipe** around the conflict. Pressure networks support fittings and bends; use them rather than crossing through.
   - **Insert a fitting** (cross, tee, sweep) to redirect flow above or below the conflicting line.
3. The interference object does not auto-update. After edits, right-click the interference check > **Rerun**.

## Criteria selection

The criterion uses a simple distance-based test. Civil 3D 2024+ added optional vertical buffer separation - useful when crossing utilities require different vertical vs horizontal clearances (e.g., 18 in vertical and 10 ft horizontal for water/sewer).

- **3D distance criterion** alone: every clash within X ft of separation flags.
- **3D + vertical buffer**: vertical separation gets its own minimum.

Set criteria to match the project standard (often a local plumbing code or utility manual; verify per jurisdiction).

## Common errors

- `No interferences found` when you can clearly see crossings: the criterion buffer is too small, or one of the networks is in a different drawing and was not loaded. Confirm both networks are visible.
- `Interference check did not include part type X`: the check excludes pipes vs structures by default if the styles do not match. Edit the criteria in Network Interference Properties.
- `Could not run interference check - network has invalid parts`: a part failed validation (missing 3D geometry). Open the pressure parts list and re-add the offending part.
- `Network locked by another user` (Vault or shared environment): check in the source drawing before rerunning.

## Related

- [Pipe network parts list (pressure)](pipe-network-parts-list.md)
- [Pipe rules and rule sets](pipe-rules-and-rules-sets.md)
- [Gravity pipe network analysis](../pipe-networks/pipe-network-analysis.md)
