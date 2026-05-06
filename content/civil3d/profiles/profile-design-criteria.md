---
title: "Profile Design Criteria"
section: "civil3d/profiles"
order: 45
visibility: public
tags: [design-criteria, design-check, k-value, max-grade, min-grade, sight-distance, aashto]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CREATEPROFILELAYOUT, EDITPROFILE, DESIGNCRITERIA]
sources:
  - title: "AASHTO A Policy on Geometric Design of Highways and Streets, 7th Edition"
    note: "Chapter 3 — vertical alignment criteria. Copyrighted; summarized here."
  - title: "Autodesk Civil 3D Help — Design Criteria Files"
    url: "https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-2C1D7B3A-EC2C-4D2C-B3C1-0F0F3D3B5A5D"
updated: 2026-05-06
---

> **TL;DR**
> 1. **Design check sets** for profiles compare your layout profile geometry against policy limits — minimum K-value, maximum grade, minimum grade for drainage, and headlight sight distance — and flag violations with markers in the profile view.
> 2. Civil 3D ships an AASHTO design criteria file (`Autodesk Civil 3D Metric Design Standards.xml` / `Imperial`) that encodes minimum K by design speed. You can also build custom criteria files for state DOT or local standards.
> 3. Assign a design check set to a profile through Profile Properties > Design Criteria tab. Pick a design speed, and Civil 3D checks every vertical curve and tangent grade in real time.

## How design checks work

A design check set contains one or more individual checks. Each check tests a specific geometric property against a threshold that varies by design speed. When a check fails, Civil 3D places a **violation marker** (a red diamond or custom symbol) at the offending location in the profile view.

Checks do not prevent the design from being used — they are advisory. The designer reviews violations and decides whether to revise or document an exception.

## Standard checks for profiles

### Minimum K-value

Tests each vertical curve's K-value against the AASHTO minimum for stopping sight distance (crest) or headlight sight distance (sag) at the assigned design speed. See [Vertical curve design](vertical-curve-design.md) for the K-value tables.

### Maximum grade

Tests each tangent grade against the AASHTO maximum grade for the design speed and terrain type. Representative AASHTO maximums:

| Design speed (mph) | Level terrain | Rolling terrain | Mountainous terrain |
|---|---|---|---|
| 30 | 7 % | 8 % | 12 % |
| 40 | 7 % | 8 % | 11 % |
| 50 | 6 % | 7 % | 10 % |
| 60 | 5 % | 6 % | 8 % |
| 70 | 4 % | 5 % | 7 % |

These values are from AASHTO Table 3-4. Consult the current edition for binding design values. Many state DOTs (including INDOT) publish their own maximums that may be more restrictive.

### Minimum grade for drainage

A minimum longitudinal grade prevents water from ponding on the pavement. AASHTO recommends a minimum grade of 0.3 % on curbed roadways. Some agencies require 0.5 %. Flat grades (< 0.3 %) on crowned pavements may be acceptable if adequate cross slope exists, but sag curves at near-zero grade need special attention for inlet placement.

### Headlight sight distance (sag curves)

In addition to the K-value check, some criteria files include an explicit headlight sight-distance check that accounts for the vertical curve geometry, headlight height (2.0 ft or 0.6 m), and upward beam angle (1 degree). This check is relevant at sag curves on undivided two-lane roads.

## Criteria files

Civil 3D stores design criteria in XML files located in:

```
C:\ProgramData\Autodesk\C3D <version>\enu\Data\Corridors\Autodesk Civil 3D Imperial (2011) Metric.xml
```

(The exact path varies by version and language.) Each file defines:

- A list of design speeds.
- For each speed: minimum K (crest and sag), maximum grade by terrain, minimum curve length, and sight-distance parameters.

### Editing criteria files

You can copy and edit the shipped XML file to match your agency's standards. For example, INDOT's Design Manual specifies slightly different maximum grades for different functional classifications. Create a copy of the AASHTO file, modify the thresholds, and save it with a descriptive name (e.g., `INDOT_Design_Standards.xml`).

In Settings tab > General > Design Criteria, point the drawing to your custom file.

### Design speed assignment

Each profile can be assigned a single design speed (or speed table that varies by station). The design speed determines which row of the criteria table applies to each check. Set the design speed in:

1. Profile Properties > Design Criteria tab.
2. Check "Use criteria-based design."
3. Select the criteria file.
4. Choose the design speed.

For a profile with variable design speed (urban to rural transition), use a design-speed table that assigns different speeds to station ranges.

## Applying design checks

1. Select the layout profile > Properties > Design Criteria tab.
2. Enable "Use design criteria file."
3. Browse to the criteria file (AASHTO shipped or custom).
4. Set the design speed.
5. Under Design Check Set, pick "Standard" (checks all categories) or a custom check set.
6. Click Apply. Civil 3D evaluates every PVI, curve, and tangent.

Violation markers appear in the profile view. Hover over a marker to see which check failed and by how much.

## Creating a custom design check set

If the standard checks don't match your workflow — for example, you only care about K-value and max grade, not drainage grade — create a custom check set:

1. Settings tab > Profile > Design Check Sets > right-click > New.
2. Name the check set.
3. Add checks: select from the available check types (K value, Max Grade, Min Grade, Sight Distance).
4. For each check, reference the criteria file expression that provides the threshold.
5. Save.

The custom check set can then be assigned to any profile.

## Violation review workflow

1. Run the checks by assigning the design criteria to the profile.
2. In the profile view, visually scan for violation markers.
3. Open the Profile Layout Parameters editor. Rows with violations are highlighted.
4. Adjust the PVI elevation, curve length, or K-value to resolve each violation.
5. If a violation cannot be resolved (terrain constraints, right-of-way limits), document the design exception per agency policy.

## Related

- [Vertical curve design](vertical-curve-design.md)
- [Editing profiles](editing-profiles.md)
- [Surface profiles vs layout profiles](surface-vs-layout-profiles.md)
- [Corridor frequency and regions](../corridors/frequency-and-regions.md)
