---
title: "Design Criteria and Check Sets"
section: "civil3d/alignments"
order: 20
visibility: public
tags: [alignment, design-criteria, aashto, minimum-radius, design-speed, k-value]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEALIGNMENTLAYOUT, EDITGEOMETRY, EDITDESIGNCRITERIA]
sources:
  - label: "Autodesk Help — Design Criteria Files"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1F2E1C52-3A96-4F9D-B6A5-E9E0E6F7F8A0"
updated: 2026-05-06
---

> **TL;DR**
> 1. Design criteria files are XML documents that encode minimum radius, maximum grade, superelevation rates, K-values, and sight distances by design speed. Civil 3D ships with AASHTO 2001, 2004, and 2011 criteria; you can create custom files for local standards.
> 2. Assign a criteria file to an alignment in Alignment Properties > Design Criteria tab. Civil 3D flags violations in the Geometry Editor with a warning icon and violation color.
> 3. Design check sets are separate from criteria files: they are user-defined expressions (e.g., "radius > 500 ft") applied as pass/fail checks on alignment entities.

## What design criteria files contain

A design criteria file (`.xml`) defines tables of minimum values indexed by design speed:

- **Minimum radius** for horizontal curves (with and without superelevation).
- **Maximum superelevation rate** (e.g., 4 %, 6 %, 8 %) and associated eMax tables.
- **Minimum spiral length** as a function of design speed and radius.
- **Minimum K-value** for vertical curves (crest and sag), used by the profile.
- **Stopping sight distance** and passing sight distance.

Civil 3D ships several files in `C:\ProgramData\Autodesk\C3D <version>\enu\Data\Corridor Design Standards\`:

| File | Basis |
|---|---|
| `Autodesk Civil 3D Imperial (2011) Roadway Design Standards.xml` | AASHTO Green Book 6th Edition (2011) |
| `Autodesk Civil 3D Imperial (2004) Roadway Design Standards.xml` | AASHTO Green Book 5th Edition (2004) |
| `Autodesk Civil 3D Imperial (2001) Roadway Design Standards.xml` | AASHTO Green Book 4th Edition (2001) |
| Metric equivalents | Same tables in metric units |

State DOTs may publish their own criteria files. Indiana (INDOT) design standards reference AASHTO but include state-specific modifications to superelevation rates and spiral requirements; a custom XML can encode those.

## Assigning criteria to an alignment

1. Right-click the alignment > Alignment Properties > Design Criteria tab.
2. Check "Use criteria-based design."
3. Browse to the design criteria file.
4. Set the design speed. This is the speed used to look up minimum radius and other values from the criteria tables.
5. Set the maximum superelevation rate (commonly 4 % for urban, 6 % for suburban, 8 % for rural highway).
6. OK. Civil 3D now evaluates every curve and spiral against the criteria.

## How violations display

When a sub-entity violates the criteria:

- The Geometry Editor table shows a warning icon next to the entity.
- The entity is drawn in a violation color (default: red) on the alignment in plan view.
- Hovering over the warning in the Geometry Editor shows the specific violation (e.g., "Radius 300.00 ft is less than minimum 400.00 ft for design speed 45 mph").

Violations do not prevent the alignment from being used. They are advisory. The designer decides whether to revise the geometry or accept a design exception.

## Creating a custom criteria file

1. Copy one of the shipped XML files to a project or company folder.
2. Open in a text editor or XML editor.
3. The structure uses `<DesignSpeed>` elements containing `<MinRadius>`, `<MinSpiralLength>`, `<MaxSuperelevation>`, and related entries. Modify the values to match local standards.
4. Save with a descriptive name (e.g., `INDOT_2024_Criteria.xml`).
5. Reference the custom file in Alignment Properties > Design Criteria.

Back up the original. Civil 3D validates the XML schema; a malformed file will fail to load.

## Design check sets

Design check sets are a separate mechanism from criteria files. They apply user-defined Boolean expressions to alignment entities.

### Setting up a check set

1. Settings tab > Alignment > Design Check Sets > right-click > New.
2. Name the check set.
3. Add checks. Each check has:
   - **Type**: Line, Curve, or Spiral.
   - **Expression**: a formula using entity properties. Examples:
     - `{Curve Radius} >= 500` (curve radius at least 500 ft)
     - `{Tangent Length} >= 200` (minimum tangent length between curves)
     - `{Curve Length} >= 100` (minimum arc length)
4. Assign the check set to the alignment in Alignment Properties.

### Expression properties available

For curves: `{Curve Radius}`, `{Curve Length}`, `{Curve Delta Angle}`, `{Curve Tangent Length}`, `{Curve Direction}`.

For lines: `{Tangent Length}`, `{Tangent Direction}`.

For spirals: `{Spiral Length}`, `{Spiral A Value}`, `{Spiral Radius}`.

### Violations

Violations from design check sets appear the same way as criteria violations: warning icons in the Geometry Editor and violation color in plan view. A tooltip distinguishes criteria violations from check-set violations.

## Sight distance

Civil 3D does not calculate sight distance natively from a single alignment. Stopping sight distance depends on both horizontal geometry (clear zones, cut slopes) and vertical geometry (crest curve K-values). The criteria file stores minimum K-values by speed, and the profile design criteria check flags vertical violations.

For horizontal sight distance (sight obstructions inside curves), use the AASHTO formula:

    S = R * arccos((R - M) / R)

where S = sight distance along the curve, R = curve radius, M = horizontal sightline offset (distance from centerline to obstruction). This calculation is manual or done via third-party tools.

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Alignment creation tools](alignment-creation-tools.md)
- [Editing alignments](editing-alignments.md)
- [Offset alignments](offset-alignments.md)
