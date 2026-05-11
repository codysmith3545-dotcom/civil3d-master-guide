---
title: "Alignment Criteria-Based Design"
section: "civil3d/alignments"
order: 16
visibility: public
tags: [alignment, design-criteria, design-speed, k-value, superelevation, criteria-set]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [EditAlignmentDesignCriteria, AlignmentProperties, EditDesignCheckSet, CalculateSuperelevation]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Alignment Design Criteria
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2C3D4E5F-6A7B-8C9D-0E1F-2A3B4C5D6E7F
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Design Check Sets
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-3E4F5A6B-7C8D-9E0F-1A2B-3C4D5E6F7A8B
    verified: 2026-05-11
  - title: AASHTO A Policy on Geometric Design of Highways and Streets, 7th ed., Tables 3-7, 3-8 (superelevation)
    url: https://store.transportation.org/Item/CollectionDetail?ID=180
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Design criteria files** (XML) hold AASHTO defaults: minimum radius by design speed, superelevation rates, transition lengths; pick a file once per project.
> 2. **Design check sets** are reusable expressions (in the **Design Check Editor**) that test entity properties and flag failures; they layer on top of the criteria file.
> 3. Apply both via **Alignment Properties > Design Criteria** tab; failures highlight red in the geometry editor with a tooltip explaining the rule.

## Design criteria files

Civil 3D ships an imperial and metric criteria XML, plus templates for several DOTs. Custom criteria files extend the AASHTO defaults with state DOT modifications.

Locate at **Toolspace > Settings > Alignment > Design Criteria > Imperial/Metric**.

Open the XML at `C:\ProgramData\Autodesk\C3D <version>\enu\Data\Corridor Design Standards\<units>\AASHTO 2018.xml` (or your DOT file) to inspect or edit. Sections include:

- **Minimum Radius Tables** — by design speed, by superelevation rate.
- **Superelevation Tables** — by design speed and curve radius (e.g., AASHTO `e` max 6%, 8%, 10%).
- **Transition Length Tables** — runoff and runout lengths for spirals/no-spiral curves.
- **Stopping Sight Distance** (used by profile checks).

## Design check sets

A **design check** is a single test (e.g., curve radius >= minimum). A **design check set** groups multiple checks for one alignment.

Edit at **Toolspace > Settings > Alignment > Design Checks > [type]**:

- **Line** — length, slope.
- **Curve** — radius, length, deflection.
- **Spiral** — A value, length.

Create checks with the **Design Check Editor**. Expression syntax uses entity properties:

```
{Radius} >= 333.0
{Length} >= {Min Length}
```

Group checks into a **Design Check Set** (right-click **Design Check Sets > New**). Drag checks from the tree into the set.

## Applying criteria to an alignment

From the alignment:

1. Select the alignment.
2. Ribbon contextual: **Alignment > Modify > Alignment Properties**.
3. Open the **Design Criteria** tab.
4. Check **Use criteria-based design**.
5. Pick the **Design criteria file**.
6. Pick a **Default design speed** (e.g., 35 mph). Add additional design speeds at specific stations if speed varies.
7. Pick a **Design check set**.
8. **Apply** > **OK**.

The geometry editor (Panorama via **Geometry Editor** on the contextual ribbon) shows criteria-derived columns (Min Radius, etc.) and highlights violations in red.

## Design speed by station

If the project transitions from one speed zone to another (e.g., 45 mph rural -> 30 mph urban), add multiple rows in the **Design speed** grid in the dialog with the start station of each zone. Civil 3D uses the speed in effect at the entity's midpoint to evaluate criteria.

## Superelevation criteria sets

Superelevation tables in the criteria file drive **automatic superelevation** calculation:

- **Modify > Superelevation > Calculate Superelevation Now** (command: `CalculateSuperelevation`).
- The wizard uses the criteria file's superelevation tables to compute `e` for each curve, then applies runoff/runout lengths from the transition tables.
- Results land on the alignment as superelevation data, viewable in the **Superelevation View**.

See [Superelevation tables](superelevation-tables.md) for the editor and views.

## Editing a custom criteria file

For a state-DOT extension:

1. Copy the shipped XML to a project folder.
2. Edit minimum-radius rows for your DOT's design speeds.
3. Add or override superelevation tables (e.g., INDOT IDM Chapter 43).
4. Reference the new XML on each alignment via Properties.
5. Document the file path in your CAD standards.

## Common errors

- **Criteria file not loading** — path moved or permission denied; place the file in a shared project folder and re-pick.
- **All entities flag red** — design speed is too high for the geometry; lower the design speed or relax the check set.
- **Min Radius column reads 0** — superelevation `e` table is missing for the selected design speed; populate the criteria XML.
- **Auto-superelevation runs but applies nothing** — runoff lengths in the criteria file are 0; verify the transition table entries.
- **Design check expression error** — typo in the expression; the check evaluates as false and the entity always flags. Edit and verify.

## Related

- [Design criteria (existing page)](design-criteria.md)
- [Alignment creation and types](alignment-creation-and-types.md)
- [Superelevation tables](superelevation-tables.md)
- [Alignment labels and station equations](alignment-labels-and-station-equations.md)
- [Editing alignments](editing-alignments.md)
