---
title: "Pipe network commands"
section: "civil3d/commands/by-category"
order: 70
visibility: public
tags: [commands, pipe-networks, gravity-networks, structures, parts-list]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Pipe networks model gravity-flow systems (sanitary, storm). They contain `Pipe` and `Structure` parts driven by a parts list.
> 2. Build with `CreateNetwork` (interactive) or `CreateNetworkFromObject` (convert polylines/feature lines).
> 3. Show the network in a profile view with `DrawNetworkInProfileView`.

## Commands in this category

- `CreateNetwork` — see [createnetwork.md](../createnetwork.md)
- `CreateNetworkFromObject` — see [createnetworkfromobject.md](../createnetworkfromobject.md)
- `DrawNetworkInProfileView` — see [drawnetworkinprofileview.md](../drawnetworkinprofileview.md)
- `EditNetwork` — open the network in the layout interface.
- `EditNetworkInProfileView` — vertical edits inside profile view.
- `RenamePartsInNetwork` — bulk rename pipes and structures.
- `NetworkProperties` — change parts list, reference surface, label styles.
- `CreatePartsList` — manage part families and sizes available to a drawing.
- `RunInterferenceCheck` — clash check between networks.

## Typical workflow

1. Pick or build a parts list with the families and sizes you need.
2. `CreateNetwork` and lay out structures and pipes; or `CreateNetworkFromObject` to convert existing geometry.
3. Set rim and invert rules in the structure properties (e.g., "Match invert in to invert out").
4. `DrawNetworkInProfileView` to plot the system on the road profile.
5. Run an interference check before crossing other utility networks.

## Related

- [Pressure network commands](pressure-networks.md)
- [Profile commands](profiles.md)
- [Pipe network workflows](../../pipe-networks/index.md)
