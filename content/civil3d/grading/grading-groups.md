---
title: "Grading Groups"
section: "civil3d/grading"
order: 25
visibility: public
tags: [grading, grading-group, grading-surface, volume, earthwork]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateGradingGroup, GradingVolumeTools]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Grading Groups
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-9D0E1F2A-3B4C-5D6E-7F8A-9B0C1D2E3F4A
    verified: 2026-05-06
---

> **TL;DR**
> 1. A **grading group** is a container that organizes related grading objects (e.g., all slopes around one building pad) and automatically generates a **grading surface** from their combined geometry.
> 2. Enable **Automatic Surface Creation** when creating the group — Civil 3D builds and updates a TIN surface from all grading objects in the group without manual intervention.
> 3. Use the **Grading Volume Tools** on the group to compute cut and fill quantities against a comparison surface (typically existing ground).

## What a grading group does

Grading objects by themselves are individual slope projections. A grading group ties them together:

- All grading objects in the group contribute to a single surface.
- The group surface updates when any member grading object or its baseline feature line changes.
- Volume calculations are performed on the group, comparing the grading surface against a base surface.

Think of the grading group as the equivalent of a corridor region — it defines a zone of design and produces a surface.

## Creating a grading group

Command: `CreateGradingGroup` (accessed from the Grading Creation Tools toolbar > Set the Grading Group drop-down > Create New).

Or: Prospector > Sites > [Site Name] > Grading Groups > right-click > New.

Options during creation:

| Option | Description |
|---|---|
| Name | A descriptive name (e.g., "Building A Pad", "Detention Basin") |
| Automatic Surface Creation | If checked, Civil 3D creates a TIN surface from the grading group geometry. The surface appears under Surfaces in Prospector. |
| Volume base surface | If set, Civil 3D computes cut/fill volumes between the grading surface and this surface (typically existing ground). |
| Use Criteria-Based Style | Applies a default grading style to all objects added to the group. |

## Automatic surface creation

When enabled, the grading group produces a surface containing:

- All triangulated faces from grading object projections (cut and fill slopes).
- Infill areas (flat regions inside closed grading perimeters).
- Daylight lines (where slopes meet the target surface).

The surface is dynamic — it rebuilds when:

- A baseline feature line is edited (elevation or geometry changes).
- A grading object's criteria or target changes.
- A grading object is added to or removed from the group.

The generated surface can be:

- Used as a breakline source for a composite finished-grade surface.
- Displayed with contours, elevation analysis, or slope analysis.
- Used in section views for cross-section grading verification.

### Naming convention

The auto-generated surface is named `<Group Name> - <Site Name>`. Rename it in Prospector to something clearer (e.g., "Building A Proposed Grade") to avoid confusion in drawings with multiple grading groups.

## Volume tools

Command: `GradingVolumeTools` (ribbon: select a grading object > Modify > Grading Volume Tools; or right-click the grading group in Prospector > Grading Volume Tools).

The Grading Volume Tools toolbar provides:

| Tool | What it does |
|---|---|
| Automatically raise/lower | Adjusts the feature line elevation iteratively to balance cut and fill volumes to a target net volume (commonly 0 for a balanced site). |
| Raise the group | Raises all feature lines in the group by a specified amount and recalculates volumes. |
| Lower the group | Lowers all feature lines in the group by a specified amount. |
| Volume report | Displays the current cut, fill, and net volumes for the group. |

### Balancing cut and fill

The **Automatically raise/lower** tool is particularly useful:

1. Set the target volume (e.g., 0 CY for balanced earthwork, or a positive value if you need export material for another area).
2. Civil 3D iteratively adjusts the pad elevation up or down, recalculating grading projections and volumes at each step.
3. The tool reports the final elevation and the resulting cut/fill quantities.

This iterative calculation only raises or lowers the entire grading group uniformly. It does not adjust individual slopes or localized grades.

## Organizing grading groups

For a typical site plan, you might have:

| Grading group | Contains |
|---|---|
| Building A Pad | Pad grading objects, perimeter slopes, infill |
| Parking Lot | Parking lot grading, island grading |
| Detention Basin | Basin slopes, bottom infill, berm grading |
| General Site | Remaining site grading between the above elements |

Each group produces its own surface. Combine them into a composite finished-grade surface by adding each group surface as a paste surface (Surface Properties > Definition > Edits > Paste Surface).

## Grading groups and sites

Grading groups belong to sites. All grading objects within a group must be on the same site. If feature lines are on different sites, they cannot be in the same grading group.

For projects with many independent grading areas, consider using separate sites to isolate topology. See [Sites and feature lines](sites-and-feature-lines.md).

## Common issues

- **Surface does not appear.** Automatic Surface Creation was not checked. Right-click the grading group in Prospector > Properties, and enable it.
- **Volumes show zero.** No base surface is assigned for comparison. Set it in the grading group properties.
- **Grading objects overlap.** Overlapping projections within the same group create ambiguous triangulation. Resolve by adjusting feature lines so projections do not conflict.
- **Grading surface has gaps.** One or more grading objects have gaps between their projections. Ensure all daylight lines connect, or add additional grading objects to fill the gaps.

## Related

- [Grading objects](grading-objects.md)
- [Feature lines](feature-lines.md)
- [Sites and feature lines](sites-and-feature-lines.md)
- [Corridor vs feature-line grading](corridor-vs-feature-line-grading.md)
- [Troubleshooting grading](troubleshooting-grading.md)
