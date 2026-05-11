---
title: "Grading Volumes and Reports"
section: "civil3d/grading"
order: 80
visibility: public
tags: [grading, volume, tin-volume, composite-volume, report, earthwork]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [GradingVolumeTools, CreateSurface, VolumesDashboard, ReportSurfaceVolume]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Volume Surfaces
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-8D9E0F1A-2B3C-4D5E-6F7A-8B9C0D1E2F3A
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Volumes Dashboard
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-9E0F1A2B-3C4D-5E6F-7A8B-9C0D1E2F3A4B
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Grading Volume Tools** computes net cut/fill between the grading surface and a base surface; the **Volumes Dashboard** persists the comparison and updates dynamically.
> 2. Use a **TIN Volume Surface** (base = existing, comparison = grading) for accurate, triangulated cut/fill. **Composite Volume** is faster but less precise.
> 3. Always rebuild both surfaces and verify they overlap horizontally before trusting the volume number; a partial overlap silently truncates volumes.

## Volume options

| Method | Use |
|---|---|
| Grading Volume Tools | Quick cut/fill against a target while editing a grading group |
| TIN Volume Surface | Permanent surface object that updates with sources; best for reporting |
| Composite Volume | Bounded prismoidal calc using sample lines or an extents window |
| Earthwork (sample-line based) | Used with corridors and sample lines for stationed reports |

## Grading Volume Tools

Ribbon: **Analyze > Volumes and Materials > Grading Volume Tools** (command: `GradingVolumeTools`).

Pick the grading group. The toolbar shows:

- **Cut volume**, **Fill volume**, **Net volume** (CY or M3 per drawing units).
- **Raise/Lower entire grading group** to balance cut/fill in real time. Each click recomputes the volume.
- **Auto-balance**: enter a target net volume (often 0) and Civil 3D adjusts the grading group elevation to hit it.

Use during design to find a balanced pad elevation; commit by editing the feature lines once you settle.

## TIN volume surface

Ribbon: **Home > Create Ground Data > Surfaces > Create Surface > TIN Volume Surface**.

In the dialog:

- **Name** (e.g., `VOL - Pad to EG`).
- **Base Surface** = existing-ground surface.
- **Comparison Surface** = grading surface (or design surface).
- **Style** — pick a cut/fill banded style.

The volume surface lives in Prospector. Right-click > **Properties > Statistics > Volume** to read cut, fill, and net. Right-click > **Rebuild** after source changes.

## Volumes Dashboard

Ribbon: **Analyze > Volumes and Materials > Volumes Dashboard** (command: `VolumesDashboard`).

The dashboard tracks all volume surfaces in the drawing in one window. For each row:

- Base / Comparison surface names
- Cut, Fill, Net volumes
- Cut factor and Fill factor (shrink/swell adjustments)
- Adjusted volumes after factors
- Update status (out of date if a source surface changed)

Click **Update** to rebuild stale rows. Export to CSV via the dashboard toolbar.

## Common errors

- **Volume reads as zero** — base and comparison do not overlap horizontally; check Surface Properties > Definition > Statistics > Extended for the bounding box.
- **Volume is wildly large** — one surface contains a stray triangle to a far-off point; rebuild with a boundary, or use **Surface Edits > Delete Line**.
- **Cut/fill flipped** — base and comparison swapped in the dialog; recreate or edit the volume surface definition.
- **Dashboard rows stuck "out of date"** — sources are reference surfaces (data shortcuts); reload the references before updating.
- **Auto-balance fails to converge** — the grading group has fixed elevations; adjust criteria or lift restricted PIs first.

## Related

- [Grading from feature lines](grading-from-feature-lines.md)
- [Grading groups](grading-groups.md)
- [Grading troubleshooting](grading-troubleshooting.md)
- [Earthwork](../../engineering/earthwork/index.md)
