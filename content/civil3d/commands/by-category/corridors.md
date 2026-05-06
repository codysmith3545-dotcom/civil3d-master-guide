---
title: "Corridor commands"
section: "civil3d/commands/by-category"
order: 60
visibility: public
tags: [commands, corridors, assemblies, subassemblies, baseline]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
updated: 2026-05-06
---

> **TL;DR**
> 1. A corridor is the 3D model produced by sweeping an assembly along a baseline (alignment + profile) at a frequency.
> 2. Build the assembly first (`CreateAssembly` and subassembly tool palettes), then `CreateCorridor`.
> 3. Targets — surfaces, alignments, profiles — drive how the daylight, lane widening, and subgrade tie out.

## Commands in this category

- `CreateAssembly` — see [createassembly.md](../createassembly.md)
- `CreateCorridor` — see [createcorridor.md](../createcorridor.md)
- `EditCorridor` — see [editcorridor.md](../editcorridor.md)
- `CorridorProperties` — manage baselines, regions, frequencies, targets.
- `CreateCorridorSurface` — extract a surface (top, datum, etc.) from corridor link codes.
- `CreateSampleLines` — sample lines for cross-section views and quantities.
- `CreateSectionView` / `CreateMultipleSectionViews` — display sections.
- `RebuildCorridor` — recalculate after edits to the assembly, baseline, or targets.
- `AddBaseline` / `AddRegion` — extend the corridor model.

## Typical workflow

1. Build the assembly: centerline subassembly, lanes, curbs, sidewalks, daylight.
2. `CreateCorridor`, picking the baseline alignment + profile and the assembly.
3. Set targets (existing ground for daylight, an offset alignment for ROW).
4. Set the frequency (e.g., 25 ft tangent / 10 ft curve, AASHTO-typical).
5. Build corridor surfaces (top + datum) and a boundary for accurate volumes.

## Related

- [Alignment commands](alignments.md)
- [Profile commands](profiles.md)
- [Assemblies & subassemblies](../../corridors/assemblies.md)
- [Plan production commands](plan-production.md)
