---
title: "ComputeVolumes"
section: "civil3d/commands"
order: 214
visibility: public
command: ComputeVolumes
category: surfaces
ribbon: "Analyze tab > Volumes and Materials panel > Volumes Dashboard (use Volumes Dashboard for the modern workflow)"
shortcut: ""
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
related: [CreateVolumeSurface, CreateSurface, RebuildSurface]
symptoms:
  - "How do I quickly get a cut/fill number between two surfaces?"
  - "What's the difference between ComputeVolumes and a TIN volume surface?"
  - "Why are my computed volumes different from the volume surface?"
  - "How do I bound the volume to a project boundary?"
  - "How do I get a one-shot cut/fill report without making a new surface?"
tags: [volumes, surfaces, cut-fill, earthwork]
updated: 2026-05-06
sources:
  - title: "Autodesk Help — Volume Calculations"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-D75CBCCD-8B6C-441F-91A2-DB0F4F6A1A45
    verified: 2026-05-06
---

> **TL;DR**
> 1. Computes one-shot grid-based cut, fill, and net volumes between a base surface and a comparison surface.
> 2. The result is a number in the Panorama; it does not create a persistent volume surface.
> 3. For tracked, on-going volumes use `CreateVolumeSurface` instead — it updates with the parents.

## When to use

When you need a quick cut/fill total during design iterations and don't yet want a permanent volume surface in Prospector.

## Workflow

1. Run `ComputeVolumes` (Analyze ribbon → **Volumes Dashboard** in modern releases — `ComputeVolumes` opens it).
2. In the dashboard, pick **Base Surface** (existing ground) and **Comparison Surface** (proposed).
3. Optional: pick a **bounded area** so the volume is computed only inside a polyline.
4. Click **Compute**. The result lists cut, fill, and net in cubic feet/yards (units come from drawing settings).
5. Adjust the **grid spacing** if the surfaces are large or coarse — finer is more accurate but slower.
6. Export to CSV from the dashboard for the cost estimate.

## Common gotchas

- Grid-based volumes will not exactly match TIN-based volume-surface numbers; the grid samples each cell at one elevation pair while the volume surface integrates the TIN difference. For accepted earthwork, document which method was used.
- Surfaces without overlapping extents return 0 — the dashboard does not warn loudly.
- Bounded-area volume is sensitive to which surface's extents control the calc; verify by toggling the bound on/off.
- For ground-truth deliverables (pay quantities), use `CreateVolumeSurface` so reviewers can see the underlying TIN.

## Related commands

- [CreateVolumeSurface](createvolumesurface.md)
- [CreateSurface](createsurface.md)
- [RebuildSurface](rebuildsurface.md)
