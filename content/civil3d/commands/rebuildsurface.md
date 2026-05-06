---
title: "RebuildSurface"
section: "civil3d/commands"
order: 213
visibility: public
command: RebuildSurface
category: surfaces
ribbon: "Surface contextual ribbon > Modify panel > Rebuild (or Prospector > Surface > right-click > Rebuild)"
shortcut: "RS (default in aeccland.pgp — verify in current release)"
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateSurface, AddBreaklines, AddSurfaceBoundary, ComputeVolumes]
symptoms:
  - "Why does my surface look stale after I edited a breakline?"
  - "What does the (out of date) badge in Prospector mean?"
  - "How do I force a clean recompute of the TIN?"
  - "Why did Civil 3D stop auto-rebuilding my surface?"
  - "How do I rebuild every surface in the drawing?"
tags: [surfaces, rebuild, recompute, definition]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Rebuilding a Surface"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2D49AD27-1A55-4A25-A3B0-5EE3A8A1FF82
    verified: 2026-05-06
---

> **TL;DR**
> 1. Re-triangulates the surface from its definition tree, applying current build settings and snapshot data.
> 2. Pick **Rebuild** (in-place) or **Rebuild — Snapshot** to refresh cached snapshots from referenced objects.
> 3. Auto-rebuild can be toggled per-surface — turn it off for very large surfaces where every edit otherwise triggers a long rebuild.

## When to use

Any time the surface is showing the (out of date) badge in Prospector — usually after editing breakline geometry, changing build settings, or modifying the underlying data sources.

## Workflow

1. In Prospector, look for the (out of date) badge next to the surface.
2. Right-click the surface → **Rebuild** (or **Rebuild — Snapshot** to refresh referenced data first).
3. If you have many surfaces and want to rebuild all of them, run `RebuildSurface` from the command line; it processes them one by one (or use Surface Properties → Definition → **Build** → tick each, then OK).
4. Watch the command line for warnings — crossing breaklines, point data with anomalies, boundary overlaps.
5. After rebuild, reapply any volume surfaces that depend on this one (they auto-rebuild but verify).
6. Check Surface Properties → Statistics for triangle count and Z-min/Z-max sanity.

## Common gotchas

- A surface set to **not rebuild automatically** stays out of date until a manual rebuild — easy to miss before publishing data shortcuts.
- Snapshots cache referenced data inside the surface. If the source changed (e.g., points were edited in another drawing), normal Rebuild uses the stale snapshot. Use **Rebuild — Snapshot** to refresh.
- Very large surfaces (100k+ triangles) can take minutes; budget accordingly before running on a deadline.
- Edits made in the Definition tree but not committed (e.g., pending breakline addition) won't take until rebuild.

## Related commands

- [CreateSurface](createsurface.md)
- [AddBreaklines](addbreaklines.md)
- [AddSurfaceBoundary](addsurfaceboundary.md)
- [ComputeVolumes](computevolumes.md)
