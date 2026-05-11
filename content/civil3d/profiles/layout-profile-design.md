---
title: "Layout Profile Design"
section: "civil3d/profiles"
order: 16
visibility: public
tags: [layout-profile, pvi, vertical-curve, design-criteria, k-value, profile-design]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateProfileLayout, EditProfileGeometry, EditProfileDesignChecks, ProfileLayoutTools]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Layout Profiles
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-9F8E7D6C-5B4A-3F2E-1D0C-9B8A7C6D5E4F
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Profile Entities Vista
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2E3D4C5B-6A7F-8D9E-0C1B-2A3D4F5E6C7B
    verified: 2026-05-11
  - title: AASHTO A Policy on Geometric Design of Highways and Streets, 7th ed., Tables 3-34 and 3-36
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-11
---

> **TL;DR**
> 1. A **layout profile** is your design ground; build it with the **Profile Layout Tools** toolbar inside a profile view, using PVIs (vertical points of intersection) connected by tangents and vertical curves.
> 2. The **PVI editor** (Panorama) is the spreadsheet view: edit station, elevation, grade in/out, curve length, and K-value directly; geometry recomputes live.
> 3. **Design criteria** files (XML) and **design check sets** validate K-values and grades against AASHTO defaults; violations are flagged in the geometry editor.

## Create a layout profile

Inside a profile view:

1. Ribbon **Home > Create Design > Profile > Profile Creation Tools** (command: `CreateProfileLayout`).
2. Click inside the profile view grid.
3. Fill the **Create Profile** dialog:
   - **Name** (e.g., `EX1 - Mainline Design`).
   - **Style** (Design Profile).
   - **Profile label set**.
   - Optional **Design criteria** file and **Design check set**.
4. Click **OK**. The **Profile Layout Tools** toolbar appears.

## Profile Layout Tools toolbar

The toolbar groups commands by function:

- **Draw Tangents** — tangents only (no curves). Click PVIs in sequence.
- **Draw Tangents With Curves** — tangents plus default vertical curves at each PVI.
- **Curve Settings** — defaults for inserted vertical curves: length, K-value, sag/crest type.
- **Insert PVI** — add a PVI between two existing.
- **Delete PVI** — remove a PVI; tangents reconnect.
- **Move PVI** — drag a PVI in plan/elevation.
- **Free Vertical Curve** (Parabola, K-value, length).
- **Fixed Vertical Curve** (between two known tangents).
- **Floating Vertical Curve** (one fixed end, free elevation).
- **Profile Grid View** — opens the PVI editor in Panorama.
- **Profile Geometry Editor** — same Panorama with full entity list.
- **Sub-entity Editor** — single-row vista for the selected entity.

## PVI editor (Panorama)

Click **Profile Grid View** to open Panorama with one row per PVI:

| Column | Use |
|---|---|
| Station | Edit to move the PVI horizontally. |
| Elevation | Edit to move the PVI vertically. |
| Grade In | Read-only (computed); change by editing elevations on either side. |
| Grade Out | Same. |
| A (algebraic difference) | Crest is positive, sag is negative (sign convention varies by template). |
| Profile Curve Type | Crest, Sag, or none. |
| Profile Curve Length | Edit to change the vertical curve length L. |
| K Value | Edit to change L derived from K = L / A. |
| Min Required K (if criteria) | From design criteria file. |

Edits update the profile in real time. Cells flagged red indicate a design check failure (set on the design check set).

## Vertical curve sets

A **curve set** is a saved set of default values used by **Draw Tangents With Curves**. Configure in the **Curve Settings** dialog from the toolbar:

- **Type**: Parabolic (standard), Asymmetric, Circular.
- **Default length** for crest and sag.
- **Default K** (overrides length).
- **Default lock**: lock K, length, or A.

Save sensible defaults per project (e.g., 35 mph design: K = 49 sag, K = 29 crest per AASHTO).

## Criteria-based design

Civil 3D ships an XML criteria file and lets you author your own:

- **Toolspace > Settings > Profile > Design Criteria > Imperial/Metric**.
- The XML lists design speeds and corresponding minimum K-values, grades, and stopping sight distances.

Apply the criteria to a profile via **Profile Properties > Design Criteria** tab:

1. Check **Use criteria-based design**.
2. Pick the criteria file.
3. Pick a **Design speed** (or vary by station).
4. Pick a **Design check set** to control which checks run.

When criteria are active, the toolbar's **Profile Geometry Editor** shows the **Min K** column populated from the file. Edits violating the minimum highlight red and surface a tooltip with the rule.

## Editing a layout profile

- **Grip-edit** — drag PVIs in the profile view; vertical curves recompute.
- **Geometry editor** — edit cells in Panorama.
- **Sub-entity editor** — single-row precision edits.
- **Insert/Delete PVI** — add/remove PVIs without redrawing.

## Common errors

- **Curve length collapses to 0** — the algebraic difference A is too small; tangents are nearly collinear. Verify grades.
- **K column shows infinity** — A = 0 (collinear tangents); no curve is needed.
- **Cells highlight red, but the criteria pass at higher speed** — Design speed is set too high in profile properties; revisit the design speed.
- **Edits to an offset profile don't take** — offset profiles inherit from the parent; convert to a standalone profile to edit independently.
- **Design check set "is locked"** — check sets in a referenced template are read-only here; copy to the project and reapply.

## Related

- [Profile design criteria](profile-design-criteria.md)
- [Vertical curve design](vertical-curve-design.md)
- [Editing profiles](editing-profiles.md)
- [Profile creation from surface](profile-creation-from-surface.md)
- [Profile view styles](profile-view-styles.md)
