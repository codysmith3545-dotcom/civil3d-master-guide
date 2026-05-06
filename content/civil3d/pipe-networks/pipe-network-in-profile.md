---
title: "Pipe Network in Profile View"
section: "civil3d/pipe-networks"
order: 25
visibility: public
tags: [pipe-network, profile, profile-view, crossing-pipes, invert]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [DrawPartsInProfileView, EditNetworkInProfileView]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Display a Pipe Network in Profile View
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5A2C1D2E-7F4A-4B3D-A1E8-9C6D7E8F0A1B
    verified: 2026-05-06
---

> **TL;DR**
> 1. Use `DrawPartsInProfileView` to add a gravity network to a profile view. The network must share the same reference alignment as the profile, or Civil 3D cannot project the pipes.
> 2. In profile view, pipes display as rectangles (wall-to-wall) and structures as their cross-section. Grip-edit inverts directly in profile for precise elevation control.
> 3. Crossing pipes from other networks appear as single ellipses at their intersection station — enable crossing-pipe display in the profile view properties.

## Adding a network to a profile view

Command: `DrawPartsInProfileView` (ribbon: select the pipe network > Modify > Draw Parts in Profile View; or right-click the network in Prospector > Draw Parts in Profile View).

Requirements:

- The network must have a **reference alignment** assigned. The profile view must be built on that same alignment.
- If the alignment was assigned after network creation, update it via Network Properties > Set Reference.

Steps:

1. Select the network (click any pipe or structure, or pick from Prospector).
2. Run `DrawPartsInProfileView`.
3. Select the target profile view. Civil 3D projects every pipe and structure in the network onto the profile.

The projection is by station along the reference alignment. Pipes that run perpendicular to the alignment appear foreshortened or may not display if they fall entirely off-alignment.

## What the profile display shows

| Element | Profile representation |
|---|---|
| Pipe | Rectangle from crown to invert, spanning the length between structures along the alignment |
| Structure (manhole) | Vertical rectangle from rim to sump, with connected pipe openings at the correct invert elevations |
| Structure (catch basin) | Similar to manhole; structure style controls the profile block |
| Crossing pipe | Ellipse or circle at the crossing station, sized to the pipe diameter |

## Editing pipes in profile view

Grip-editing in profile is the most intuitive way to set inverts:

- **Pipe end grips** — drag vertically to change the pipe invert at that end. The connected structure adjusts its sump if structure rules allow.
- **Pipe mid-grip** — drag vertically to shift the entire pipe up or down while maintaining slope.
- **Structure rim grip** — drag the top of the structure to change the rim elevation (useful when the surface model is not yet finalized).
- **Structure sump grip** — drag the bottom to adjust sump depth.

For numeric precision, select the pipe and use the Properties palette (Ctrl+1). Key properties:

- **Start Invert Elevation** and **End Invert Elevation** — set exact values.
- **Slope (Hold Start/Hold End)** — lock one end and define a slope; the other end adjusts.
- **Length (2D/3D)** — read-only in profile; plan geometry controls length.

## Profile display rules

Profile display rules control which parts are visible and how they render. Configure in:

- **Pipe style** — Settings tab > Pipe Network > Pipe > Pipe Styles. The profile component of the style controls line weight, color, and whether the pipe displays as a single line or a double line (wall-to-wall).
- **Structure style** — Settings tab > Pipe Network > Structure > Structure Styles. The profile component controls the structure cross-section shape.

To change which styles a network uses: select the network > Properties > Styles tab.

## Crossing pipe display

Pipes from a different network that cross the profile view alignment can display as crossing pipes. To enable:

1. Open the profile view properties (right-click the profile view > Profile View Properties).
2. Go to the **Pipe Networks** tab.
3. Check **Draw parts in profile view** for the crossing network(s).
4. Select a **crossing pipe style** — typically a circle or ellipse showing the pipe diameter and material.

Crossing pipes appear at the station where they intersect the alignment, at their actual elevation. This is critical for checking clearances between storm, sanitary, and water systems.

## Pipe networks in stacked profile views

When multiple alignments converge (e.g., a main road and a side street), each profile view shows only the networks referenced to its alignment. To see a network on a different alignment's profile:

- Re-reference the network to the desired alignment (changes all stationing).
- Or use crossing-pipe display on the second profile view.

## Common issues

- **Network does not appear in profile.** The network's reference alignment does not match the profile view's alignment. Re-assign via Network Properties.
- **Pipes display at wrong stations.** The reference alignment was moved or rebuilt after the network was created. Reassign the alignment reference.
- **Structures clip at the profile view edges.** The profile view start/end stations do not encompass the full network. Extend the profile view or split the network.
- **Profile edits not reflected in plan.** Changes to invert elevations in profile propagate to plan automatically. If they appear not to, rebuild the drawing (`REGEN`).

## Related

- [Creating pipe networks](creating-pipe-networks.md)
- [Pipe network labels](pipe-network-labels.md)
- [Pipe network analysis](pipe-network-analysis.md)
- [Structure rules](structure-rules.md)
