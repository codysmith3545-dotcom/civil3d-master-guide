---
title: "Pipe Network Labels"
section: "civil3d/pipe-networks"
order: 40
visibility: public
tags: [pipe-network, labels, label-styles, pipe-table, structure-table, crossing-pipe]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [AddPipeNetworkLabels, AddPipeTables, AddStructureTables]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Pipe Network Labels
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3D4E5F6A-7B8C-9D0E-1F2A-3B4C5D6E7F8A
    verified: 2026-05-06
---

> **TL;DR**
> 1. Plan labels show pipe size, slope, length, and material; structure labels show rim and invert elevations, structure name, and sump depth. Apply them with `AddPipeNetworkLabels`.
> 2. Profile labels annotate pipes and structures in the profile view — invert in/out, rim, pipe slope, and length. Crossing-pipe labels identify utilities that cross the alignment.
> 3. For large networks, **pipe tables** and **structure tables** summarize all data in a schedule format rather than labeling every object individually.

## Plan-view labels

### Pipe labels

Applied via Annotate > Add Labels > Pipe Network > Add Pipe Network Labels, or the command `AddPipeNetworkLabels`.

Common content in plan pipe label styles:

| Field | Expression example | Notes |
|---|---|---|
| Pipe size | `{Pipe Inner Diameter}` | Displays nominal diameter, e.g., "12 in." |
| Slope | `{Pipe Slope (2D)}` | Percentage or ratio, depending on style |
| Length | `{Pipe 2D Length}` | Horizontal length between structures |
| Material | `{Pipe Description}` | From the parts list entry |
| Flow direction | Arrow component in the style | Arrow points downhill (gravity) or in the defined direction |

Label placement: pipe labels anchor at the pipe midpoint and rotate to follow the pipe alignment. For curved runs, the label orients to the chord.

### Structure labels

Common content in plan structure label styles:

| Field | Expression example | Notes |
|---|---|---|
| Structure name | `{Structure Name}` | Network-assigned name (e.g., "MH-1") |
| Rim elevation | `{Rim Elevation}` | Top of casting/grate |
| Invert elevation(s) | `{Sump Elevation}` or individual pipe inverts | Lowest pipe invert or sump bottom |
| Sump depth | `{Sump Depth}` | Rim minus sump |

Structure labels are typically placed with a leader from the structure center to a clear area. Complex structures with multiple pipe connections often use a multi-line label showing each connected pipe's invert.

## Profile-view labels

Profile labels are added when the network is displayed in a profile view. Configure label styles under Settings > Pipe Network > Pipe/Structure > Label Styles > Profile.

### Pipe profile labels

Typical content:

- Pipe size, slope, and length along the pipe.
- Invert elevation at each end (in/out).

These labels sit inside or above the pipe rectangle in the profile view. The style controls orientation (horizontal or parallel to pipe slope).

### Structure profile labels

Typical content:

- Rim elevation at the top of the structure.
- Invert in and invert out at each pipe connection.
- Structure name or number.

Profile structure labels usually display as a vertical column of values beside or inside the structure rectangle.

## Crossing-pipe labels

When a pipe from another network crosses the profile view alignment, it displays as an ellipse. A crossing-pipe label can annotate:

- Pipe size and material.
- Invert elevation at the crossing point.
- The name of the crossing network.
- Clearance to the primary network pipes above or below.

Apply crossing labels from Annotate > Pipe Network > Add Crossing Pipe Profile Labels. Style the label under Settings > Pipe Network > Pipe > Label Styles > Crossing Profile.

## Pipe and structure tables

For plan sheets with dense networks, labeling every pipe and structure clutters the drawing. Tables provide a cleaner alternative.

### Pipe table

Command: `AddPipeTables` (Annotate > Add Tables > Pipe Network > Add Pipe).

The table lists every pipe in the selected network with columns for:

- Pipe number (auto-generated or from the naming template).
- From structure and to structure.
- Size, material, length, slope.
- Upstream and downstream invert elevations.

### Structure table

Command: `AddStructureTables` (Annotate > Add Tables > Pipe Network > Add Structure).

The table lists every structure with columns for:

- Structure number/name.
- Rim elevation.
- Invert elevations for each connected pipe.
- Sump depth.
- Structure type (MH, CB, inlet).

Tables are dynamic — they update when the network changes. Place them in a clear area of the plan sheet or on a separate detail sheet.

## Label style customization

All pipe network label styles are found under Settings > Pipe Network > Pipe (or Structure) > Label Styles in Toolspace.

Key customization options:

- **Text components** — choose which properties to display and their format (decimal places, units, prefix/suffix).
- **Direction arrow** — for pipe labels, an arrow component can indicate flow direction.
- **Dragged state** — defines how the label looks when dragged away from its anchor (typically adds a leader line).
- **Plan readability** — flips labels to remain readable regardless of view rotation.

To create a company-standard label style, build it once and save it in the office DWT template.

## Related

- [Pipe network in profile view](pipe-network-in-profile.md)
- [Creating pipe networks](creating-pipe-networks.md)
- [Pressure networks](pressure-networks.md)
- [Pipe network analysis](pipe-network-analysis.md)
