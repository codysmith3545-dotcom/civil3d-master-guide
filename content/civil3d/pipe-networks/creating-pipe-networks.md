---
title: "Creating Pipe Networks"
section: "civil3d/pipe-networks"
order: 20
visibility: public
tags: [pipe-network, create-network, layout, polyline, feature-line]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateNetwork, CreateNetworkFromObject, CreateNetworkByLayout]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Create a Pipe Network by Layout
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-8F3A3E3A-5D9C-4F7D-9E0B-5E6D8F1B2C3D
    verified: 2026-05-06
---

> **TL;DR**
> 1. `CreateNetwork` (by layout) lets you click plan-view points to place structures and connect them with pipes interactively. Set a reference surface and alignment before drawing so rims auto-adjust and stations resolve.
> 2. `CreateNetworkFromObject` converts existing polylines or feature lines into a pipe network in one step — useful when the horizontal alignment is already drawn.
> 3. You can also draw pipes directly in profile view for precise invert control; the plan-view representation updates automatically.

## Three creation methods

### 1. Create by layout (plan view)

Command: `CreateNetwork` (ribbon: Home > Create Design > Pipe Network > Pipe Network Creation Tools).

1. Name the network and choose a parts list.
2. Assign a reference alignment (optional but recommended — enables stationing in labels and profiles).
3. Assign a reference surface (optional but recommended — enables automatic rim adjustment and cover-depth rules).
4. The Network Layout Tools toolbar appears. Select a pipe size and structure type from the drop-downs.
5. Click in plan view to place structures. Civil 3D connects consecutive clicks with pipes.
6. Press Enter or Esc to end the run. Start a new run from any existing structure to branch.

Tips for layout mode:

- Toggle **Pipe to Structure Connection** on the toolbar to control whether new pipes connect at the invert, crown, or center of the structure.
- Switch pipe sizes mid-run using the toolbar drop-downs without ending the command.
- Osnap to existing structures to create branches or connect runs.

### 2. Create from object

Command: `CreateNetworkFromObject` (ribbon: Home > Create Design > Pipe Network > Create Network from Object).

This command accepts:

- **Polylines** (2D or 3D) — Civil 3D places a structure at each vertex and pipes between them.
- **Feature lines** — same behavior; elevations from the feature line set initial pipe inverts.
- **Alignments** — places structures at PI points (or at a specified interval) along the alignment.

After selecting the object, the command prompts for parts list, structure type, pipe type, and whether to erase the source object. Structure rims default to surface elevation if a reference surface is assigned.

This method is efficient when horizontal layout is already finalized — draw the alignment as a polyline first, refine it, then convert in one step.

### 3. Draw in profile view

Once a network has at least one structure, you can add pipes and structures directly in profile view:

1. Add the network to a profile view (see [Pipe network in profile view](pipe-network-in-profile.md)).
2. Select the network, right-click > Edit Network.
3. Use the Network Layout Tools toolbar while the profile view is active. Click in the profile view to set invert elevations visually.

Drawing in profile view is especially useful for:

- Setting precise invert elevations relative to crossing utilities.
- Working in areas with tight vertical constraints (shallow cover, deep existing utilities).
- Matching inverts to an existing downstream system.

## Before you draw — setup checklist

| Item | Why it matters |
|---|---|
| Parts list configured | Controls available pipe sizes and structure types. See [Parts list and rules](parts-list-and-rules.md). |
| Reference surface assigned | Enables rim-to-surface adjustment, cover-depth rule checking, and cut/fill display in profile. |
| Reference alignment assigned | Provides stationing for labels and determines which profile view can display the network. |
| Pipe rules set | Slope, cover, and length constraints enforce design standards during layout. |
| Structure rules set | Sump depth, rim adjustment, and drop rules fire during layout. |

## Network naming conventions

Each network must have a unique name within the drawing. Recommended patterns:

- System type + identifier: `Storm-Main`, `San-Trunk`, `Storm-Phase2`
- Or system type + street: `Storm-Meridian-St`, `San-Washington-St`

Avoid generic names like `Network (1)` — they cause confusion in data shortcuts and profiles.

## Modifying after creation

After initial layout, edit the network by:

- Grip-editing structures and pipes in plan or profile view.
- Using the Pipe Network Properties dialog (right-click > Properties) to change pipe sizes, slopes, and structure parameters numerically.
- Using the Network Layout Tools toolbar to add new pipes and structures to an existing network.
- Selecting individual pipes or structures and editing in the Properties palette (Ctrl+1).

## Related

- [Gravity vs pressure networks](gravity-vs-pressure.md)
- [Parts list and rules](parts-list-and-rules.md)
- [Pipe network in profile view](pipe-network-in-profile.md)
- [Structure rules](structure-rules.md)
