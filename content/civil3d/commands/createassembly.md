---
title: "CreateAssembly"
section: "civil3d/commands"
order: 240
visibility: public
command: CreateAssembly
category: corridors
ribbon: "Home tab > Create Design panel > Assembly > Create Assembly"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateCorridor, EditCorridor]
symptoms:
  - "How do I create the typical section the corridor will sweep?"
  - "What's an assembly baseline and how do I attach subassemblies to it?"
  - "How do I make a divided highway assembly with two travel-way sides?"
  - "Where do subassemblies live, and which palette do I drag from?"
  - "Why does my assembly look like a single vertical line?"
tags: [assemblies, subassemblies, corridors, typical-section]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Creating an Assembly"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2DBB1FAA-2B2B-4B1B-AC8A-7CB68B3C0FBC
    verified: 2026-05-06
---

> **TL;DR**
> 1. Creates an empty assembly object — the typical section template a corridor sweeps along an alignment+profile baseline.
> 2. After creation, drag subassemblies from Tool Palettes (Lanes, Curbs, Sidewalks, Daylight) onto the assembly's centerline marker.
> 3. Assembly type determines available baseline behaviors: undivided crowned road, divided crowned road, intersection assembly, etc.

## When to use

Before the first corridor is built, and any time the typical section changes (e.g., a 2-lane vs 4-lane segment).

## Workflow

1. Run `CreateAssembly` (Home ribbon → **Assembly** → **Create Assembly**).
2. Set **Name** (e.g., `Local-Road-2-Lane-EOP-Curb`) and **Assembly Type** — Undivided Crowned Road for a normal local road.
3. Pick **Code Set Style** (controls colors and labels).
4. Click **OK**, then click an empty point in model space to place the assembly marker (a vertical bar with a triangle).
5. Open Tool Palettes (`TP`); pick the **Civil Imperial - Subassemblies** palette set.
6. Drag a lane subassembly (e.g., `LaneOutsideSuper`) onto the centerline marker. Set parameters in the Properties panel: width 12 ft, slope -2 percent.
7. Continue building outward: lane → curb (e.g., `UrbanCurbGutterGeneral`) → sidewalk → daylight (e.g., `BasicSideSlopeCutDitch`).
8. Mirror to the other side: select the right-side stack, right-click → **Mirror**.

## Common gotchas

- Subassemblies attach to other subassemblies' marker points. Forgetting to pick the right point creates floating subassemblies that won't model correctly.
- Default subassembly parameters use imperial units when you start from the imperial template. If your subassembly was authored metric, parameters will be metric.
- The centerline marker carries the baseline; any subassembly attached to it directly inherits the centerline elevation. To offset (e.g., median), use a `LinkOffset` first.
- Assemblies live in the drawing. To reuse, save to an Assembly Reference drawing or to a tool palette as a custom assembly.

## Related commands

- [CreateCorridor](createcorridor.md)
- [EditCorridor](editcorridor.md)
