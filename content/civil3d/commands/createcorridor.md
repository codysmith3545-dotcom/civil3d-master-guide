---
title: "CreateCorridor"
section: "civil3d/commands"
order: 241
visibility: public
command: CreateCorridor
category: corridors
ribbon: "Home tab > Create Design panel > Corridor"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateAssembly, EditCorridor]
symptoms:
  - "How do I generate the 3D model from my alignment, profile, and assembly?"
  - "How do I set targets like daylight surface and offset alignment?"
  - "What frequency should I use — every 25 ft?"
  - "Why is my corridor flat or empty?"
  - "How do I make the corridor cover only part of the alignment?"
tags: [corridor, baseline, region, frequency, target]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Creating a Corridor"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-86FB4E2A-7B69-4FBE-A5C1-12FB66B8A2D7
    verified: 2026-05-06
---

> **TL;DR**
> 1. Creates a corridor model by sweeping an assembly along a baseline (alignment + profile) at a chosen frequency.
> 2. Targets — surfaces for daylighting, offset alignments for lane widening, profiles for vertical control — are set per region.
> 3. Frequencies of 25 ft along tangents and 5–10 ft along curves are typical for U.S. roadway work; tighten for tight intersections.

## When to use

Once you have an alignment, design profile, and assembly. Also for railroad, channel, and any other 1D-driven 3D model.

## Workflow

1. Run `CreateCorridor` (Home ribbon → **Corridor**).
2. Pick the **alignment**, then the **profile**, then the **assembly**.
3. Set the corridor **name** (e.g., `Main-St-Corridor`) and pick the **target surface** for daylighting (existing ground).
4. The dialog opens. The single default region covers the full alignment. To split, use **Add Region** later.
5. Click **Set all targets** to map subassembly target parameters to actual objects (existing surface, offset alignment for widening, profile for shoulder).
6. Set **Frequency** per region: e.g., **25 ft tangent / 10 ft curve / 25 ft profile / 25 ft superelevation crit pts**.
7. Click **OK**. The corridor builds; check Panorama for warnings (missing targets, link failures).
8. Build corridor surfaces (top, datum) from the corridor properties → Surfaces tab so you can compare to existing.

## Common gotchas

- Empty corridor regions or all-flat output usually mean the profile wasn't picked or has only one PVI. Double-check the baseline profile.
- Daylight subassemblies need a target surface; without it they collapse to a vertical link.
- Frequency interacts with assembly width — too coarse and curves look polygonal; too fine and rebuild times balloon.
- Multiple baselines are common for divided highways or branch alignments; add them via **Add Baseline** in corridor properties.

## Related commands

- [CreateAssembly](createassembly.md)
- [EditCorridor](editcorridor.md)
