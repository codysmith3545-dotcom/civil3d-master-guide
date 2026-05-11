---
title: "Superelevation Tables"
section: "civil3d/alignments"
order: 36
visibility: public
tags: [superelevation, criteria, transition, runoff, runout, e-max, alignment]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CalculateSuperelevation, EditSuperelevation, SuperelevationView, EditSuperelevationCriteria]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Superelevation
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-6B7C8D9E-0F1A-2B3C-4D5E-6F7A8B9C0D1E
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Superelevation View
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-7C8D9E0F-1A2B-3C4D-5E6F-7A8B9C0D1E2F
    verified: 2026-05-11
  - title: AASHTO A Policy on Geometric Design of Highways and Streets, 7th ed., Chapter 3 (Superelevation)
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-11
---

> **TL;DR**
> 1. The **superelevation criteria** in the alignment design criteria file map design speed and curve radius to a superelevation rate `e`; **e max** comes from the AASHTO table you select (4%, 6%, 8%, 10%, or 12%).
> 2. Run **Calculate Superelevation** to write `e` and transition lengths onto each curve; review and edit in the **Superelevation Tabular Editor** (Panorama) or visually in the **Superelevation View**.
> 3. Transitions consist of **runoff** (rotating from normal crown to full `e`) and **runout** (rotating from normal crown through 0% on the outside lane); methods vary (AASHTO 1, 2, 3, 4) and affect where transitions begin and end.

## Where the criteria live

Open the alignment's design criteria file (Toolspace > Settings > Alignment > Design Criteria). Superelevation sections include:

- **Superelevation Attainment Method** (AASHTO Method 1-5).
- **Superelevation Tables** indexed by design speed, returning `e%` for each radius range. Multiple tables support `e max` 4%, 6%, 8%, 10%, 12%.
- **Transition Length Tables** that return runoff and runout lengths.

## Calculate superelevation

Ribbon contextual: **Alignment > Modify > Superelevation > Calculate/Edit Superelevation** (command: `CalculateSuperelevation`).

The wizard:

1. **Roadway Type** — Undivided crowned, Undivided planar, Divided crowned with median, Divided crowned with shoulders.
2. **Lanes** — number, width, normal cross-slope (typical -2.0%).
3. **Shoulder Control** — outside/inside shoulder behavior during rotation.
4. **Attainment Method** — pick the method documented in the criteria.
5. **Curve smoothing** — option to smooth between consecutive curves.

Civil 3D writes superelevation data on the alignment, including:

- `e` value at full superelevation per curve.
- Station ranges for normal crown, runoff start/end, full super, removal start/end.
- Side (high side, low side) for each lane and shoulder.

## Superelevation Tabular Editor

Open via **Modify > Superelevation > Edit Superelevation** (Panorama).

Columns:

| Column | Editable |
|---|---|
| Curve / Station | No (driven by alignment geometry) |
| Type (Begin Normal Crown, Begin Runoff, etc.) | No |
| Station | Yes |
| Outside Lane Slope | Yes |
| Inside Lane Slope | Yes |
| Outside Shoulder | Yes |
| Inside Shoulder | Yes |

Edits write override values on the alignment's superelevation data; the icons in the leftmost column flag overrides. Reset to criteria-driven values via right-click > **Reset to Criteria**.

## Superelevation View

Ribbon contextual: **Alignment > Modify > Superelevation > Superelevation View** (command: `SuperelevationView`).

The view is a profile-view-like graph showing each lane's cross-slope vs. station. Manipulate transitions by grip-editing the slope traces.

Components:

- One trace per lane and shoulder.
- Station markers at runoff/runout boundaries.
- Right-click > **Reset to Criteria** to drop overrides.

## Transition methods

| Method | Behavior |
|---|---|
| AASHTO Method 1 | Crown rotated about centerline. Used for two-lane undivided. |
| AASHTO Method 2 | Crown rotated about inside edge of pavement. |
| AASHTO Method 3 | Crown rotated about outside edge of pavement. |
| AASHTO Method 4 | Crown rotated about an offset axis (divided highway with median). |
| AASHTO Method 5 | Crown rotated about a different axis on each side (rare). |

Method choice affects elevation of edges through the transition; pick to match your DOT standard. INDOT typically uses Method 1 for two-lane and Method 2 for divided highways (verify in the IDM).

## Transitions: runoff vs runout

- **Runoff length (Lr)**: distance over which the outside lane rotates from 0% (level) to full `e`.
- **Runout length (Lt)**: distance over which the outside lane rotates from normal crown (-2.0%) to 0%.
- **Tangent runout** is the runout placed on the tangent before the curve.
- A common rule (per AASHTO) places about **70% of the runoff on the tangent and 30% on the curve**, but the criteria file controls the actual split.

## Common errors

- **`e` calculates to 0** — design speed/radius combination falls in the no-superelevation row of the table; the curve is flat enough not to require super.
- **Transition stations overlap between consecutive curves** — curves are too close for full transition; either smooth the design (move PI), or accept a partial transition with overrides.
- **Edit reverts after rebuild** — overrides were not saved; verify the alignment was saved and the override icon persists in Panorama.
- **Superelevation View shows a flat trace** — superelevation has not been calculated yet; run the wizard first.
- **Wrong `e max` table used** — the criteria file's referenced table is the wrong rate; pick a different table or copy the criteria file and edit.
- **Wide median attainment looks wrong** — wrong attainment method picked; rerun the wizard with Method 4.

## Related

- [Alignment criteria design](alignment-criteria-design.md)
- [Alignment creation and types](alignment-creation-and-types.md)
- [Alignment labels and station equations](alignment-labels-and-station-equations.md)
- [Design criteria (existing page)](design-criteria.md)
