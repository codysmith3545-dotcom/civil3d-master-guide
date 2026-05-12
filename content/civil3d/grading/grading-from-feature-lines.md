---
title: "Grading From Feature Lines"
section: "civil3d/grading"
order: 24
visibility: public
tags: [grading, feature-line, footprint, daylight, infill, pad]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [GradingCreate, CreateFeatureLines, GradingCreateInfill, GradingVolumeTools]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Creating Grading
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3F0C2A4D-7F62-4D6E-9D1C-5A8B0E6F1A7D
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Grading Infill
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5C8D6E1F-1AAB-4F17-8B5D-9E3F2A0E6B8C
    verified: 2026-05-11
---

> **TL;DR**
> 1. A **feature-line footprint** (closed loop) becomes a graded pad by attaching grading objects on the outside (daylight) and an **infill** in the interior.
> 2. Build the footprint with `CreateFeatureLines` from a polyline or with **Create Feature Line** sketch tools, set elevations in the **Elevation Editor**, then add grading objects from **Grading Creation Tools**.
> 3. Combine multiple grading objects in one **grading group** so a single grading surface ties the pad, slopes, and infill together for volumes and corridors.

## Workflow overview

1. Draft the pad outline in 2D as a polyline (or sketch a feature line directly).
2. Convert to feature line: ribbon **Home > Create Design > Feature Line > Create Feature Lines from Objects** (command: `CreateFeatureLines`). Choose a site (often a dedicated `Grading` site to avoid parcel interactions).
3. Set elevations on the feature line (PI elevations + elevation points).
4. Open **Grading Creation Tools** (command: `GradingCreate`).
5. Pick the grading group (or create one).
6. Pick a criterion from your **Grading Criteria Set** (e.g., `3:1 Cut/Fill to Surface`).
7. Click the feature line, pick the **outside** (daylight) for cut/fill slopes.
8. Click **Create Infill** on the toolbar and click inside the loop to build the flat pad.

## Footprint to surface

The grading group can output a **grading surface** that includes:

- The original feature line baseline (top of pad).
- Each grading object's projected slope faces.
- The infill region inside the loop.
- The daylight line where slopes meet the target surface.

Enable surface output in the grading group's properties: **Toolspace > Prospector > Sites > [site] > Grading Groups > [group] > Properties > Information** tab, check **Automatic surface creation**, and set the surface name and style.

## Daylight slopes

Daylight grading uses a criterion with **Target = Surface** and a slope projection. Civil 3D extends the slope from the feature line outward until it intersects the target (existing-ground) surface. The intersection is the **daylight line** (catch line). It moves automatically when:

- The feature line elevations change.
- The target surface changes.
- The criterion's slope value changes.

Set the target surface on the grading group: **Properties > Information > Surface used as the target**.

## Infill

Infill creates a triangulated flat (or near-flat, by interpolation) surface inside a closed loop of grading objects.

Steps:

1. Confirm the feature line is closed and that grading objects on the outside completely enclose the pad.
2. On the **Grading Creation Tools** toolbar, click **Create Grading Infill**.
3. Click inside the enclosed area.

Infill belongs to the same grading group as the bounding grading objects so the surface composition stays consistent.

## Multiple feature lines, one group

For a complex site (building pad + parking + retention basin) you may have several feature lines. To get a single graded surface:

- Place all feature lines in the same site (or use sites carefully — see the related page on sites + feature lines).
- Add their grading objects to the same grading group.
- Order matters: overlapping grading objects later in the group can mask earlier ones.

## Updating dynamically

Because the feature line is the baseline, edits propagate automatically:

- Change a PI elevation in the **Elevation Editor** -> the grading object recomputes its slope face.
- Modify the feature line geometry (insert PI, move PI) -> grading objects shift, but verify the daylight before publishing.
- Replace the target surface -> daylight slopes rebuild against the new target.

## Common errors

- **Infill click does nothing** — the bounding grading objects do not all share the same grading group, or the loop is not closed at the feature-line vertex level. Fix the feature-line geometry first.
- **Holes appear in the grading surface** — adjacent grading objects overlap in plan; reduce slope or shorten the segment, or use **Omit conflict region**.
- **Volume report is empty** — the grading group has no surface; enable automatic surface creation and pick a target surface.
- **Daylight crosses itself at corners** — at acute interior corners of the footprint, daylight slopes overlap. Either soften the corner with a fillet on the feature line, or split the pad into two grading objects with different criteria.

## Related

- [Feature line elevation editing](feature-line-elevation-editing.md)
- [Grading criteria sets](grading-criteria-sets.md)
- [Grading troubleshooting](grading-troubleshooting.md)
- [Grading groups](grading-groups.md)
- [Sites and feature lines](sites-and-feature-lines.md)
