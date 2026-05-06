---
title: "Drafting and annotation commands"
section: "civil3d/commands/by-category"
order: 130
visibility: public
tags: [commands, drafting, annotation, dimensions, text, layers]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D inherits AutoCAD's drafting commands. Most plan-set annotation that isn't a Civil 3D label (alignment, profile, parcel) is plain `MTEXT`, dimensions, multileaders, and hatch.
> 2. Use annotative styles or named viewport scales so text reads at the intended plot scale.
> 3. Layer state and CAD standards files (`.dws`) are the usual way to enforce a National CAD Standard (NCS) layer scheme.

## Commands in this category

- `LAYER` (`LA`) — open Layer Properties Manager.
- `LAYERSTATE` — save and restore layer states for plan/utility/grading views.
- `MTEXT` (`T`/`MT`) — multiline text.
- `TEXT` (`DT`) — single-line text.
- `MLEADER` (`MLD`) — multileader.
- `MLEADERSTYLE` — manage multileader styles.
- `DIM` / `DIMLINEAR` / `DIMALIGNED` — dimensions.
- `DIMSTYLE` — dimension style manager.
- `HATCH` (`H`) — hatch fills (parking, asphalt, ROW patterns).
- `MATCHPROP` (`MA`) — copy properties between objects.
- `CADSTANDARDS` — link `.dws` files for compliance checking.
- `ANNOSCALE` — set annotative scale on the current viewport.
- `TABLE` — table object; commonly used for parcel tables and pipe schedules outside Civil 3D's own tables.

## Typical workflow

1. Pick the right plot scale on each layout viewport before annotating.
2. Use annotative `MTEXT`/`MLEADER` styles so a single object scales across viewports.
3. Lock layer fades and freezes per viewport — drives plan vs utility vs grading sheets from one model space.
4. Run `CADSTANDARDS` against the company `.dws` before issuing.

## Related

- [Plot / sheet commands](plot.md)
- [Plan production commands](plan-production.md)
- [Templates and country kits](../../../customization/templates-and-kits/index.md)
