---
title: "Pressure network commands"
section: "civil3d/commands/by-category"
order: 80
visibility: public
tags: [commands, pressure-networks, water-main, fittings, appurtenances]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Pressure networks are for pressurized systems (water main, force main). They use Pipe, Fitting, and Appurtenance parts and obey pipe-end compatibility rules.
> 2. Build with `CreatePressureNetworkFromIndustryModel`, `CreatePressurePipeNetwork`, or `CreatePressureNetworkFromObject`.
> 3. Layout is "follow the route" — fittings auto-insert at deflections that exceed the pipe's allowable bend.

## Commands in this category

- `CreatePressurePipeNetwork` — start an empty pressure network and add parts via the layout tools.
- `CreatePressureNetworkFromObject` — convert polylines or feature lines.
- `CreatePressureNetworkFromIndustryModel` — import from an InfraWorks or other industry-model source.
- `PressureNetworkProperties` — parts list, label styles, reference surface.
- `AddPressurePipe` / `AddPressureFitting` / `AddPressureAppurtenance` — interactive part placement.
- `DrawPressureNetworkInProfileView` — display the network on a profile view.
- `EditPressureNetwork` — modify routing.
- `ValidatePressureNetwork` — check for end-compatibility errors.

## Typical workflow

1. Pick a pressure parts list that covers the pipe class, fitting bends, and appurtenances you need.
2. Define the route — usually following an offset alignment from the road centerline.
3. Let Civil 3D auto-insert fittings; manually replace where you want a specific bend angle.
4. Validate the network and review unconnected ends or end-compatibility flags.
5. Draw the network in the road profile view for plan-and-profile sheets.

## Related

- [Pipe network commands](pipe-networks.md)
- [Pressure network workflows](../../pipe-networks/pressure.md)
- [Plot / sheet commands](plot.md)
