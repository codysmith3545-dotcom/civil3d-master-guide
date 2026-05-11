---
title: "Alignment Labels and Station Equations"
section: "civil3d/alignments"
order: 26
visibility: public
tags: [alignment, label-set, station-equation, station-reference, multi-segment]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [AddAlignmentLabels, AlignmentLabelSet, EditAlignmentStationEquations, AlignmentProperties]
updated: 2026-05-11
sources:
  - title: Autodesk Civil 3D 2025 Help — Alignment Labels
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-4F5A6B7C-8D9E-0F1A-2B3C-4D5E6F7A8B9C
    verified: 2026-05-11
  - title: Autodesk Civil 3D 2025 Help — Station Equations
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-5A6B7C8D-9E0F-1A2B-3C4D-5E6F7A8B9C0D
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Alignment label sets** bundle station, geometry-point, and design-speed label styles; one set applied per alignment keeps every plan sheet consistent.
> 2. **Multi-segment styles** are alignment label styles that span multiple sub-entities (e.g., one curve label across spiral-curve-spiral); use them for spiral table entries and complex curve callouts.
> 3. **Station equations** let one alignment carry two station regimes (e.g., legacy stationing matched to a new design); each equation is a `Back = X+XX, Ahead = Y+YY` pair with an increase or decrease flag.

## Alignment label sets

Manage at **Toolspace > Settings > Alignment > Label Styles > Label Sets**.

A label set holds, per label type:

- **Style** to use.
- **Increment** (for major/minor station, profile geometry).
- **Start station** / **end station** if not full alignment.
- **Geometry points** subset (which point types to label).

Label types:

| Type | Annotates |
|---|---|
| Major Station | Major station ticks (default 100 ft) |
| Minor Station | Minor ticks (default 10 ft) |
| Geometry Points | PI, BC, EC, TS, SC, ST, CS |
| Design Speeds | Speed change locations |
| Profile Geometry Points | (alignment view of profile events) |
| Station Equations | At each equation station |
| Station Reference | Externally referenced stations |
| Station Offset Labels | Free station/offset labels (added via `AddAlignmentLabels`) |

To apply: select the alignment > **Edit Alignment Label Set** (or **Alignment Properties > Labels** tab) > **Import label set** > pick.

## Multi-segment style

Alignment label styles can be set to **single-segment** or **multi-segment**:

- **Single-segment** label refers to one sub-entity (one tangent, one curve, one spiral).
- **Multi-segment** label spans across consecutive sub-entities (e.g., spiral-curve-spiral as one labeled compound entity).

Configure on the **Label Style Composer > Information** tab via **Anchor Component / Style Type**.

Use multi-segment for:

- Curve tables that aggregate spiral-curve-spiral as one row.
- Single radius labels that describe the full curve, not just the central arc.
- Station offsets that should walk across multiple geometry breaks.

## Station offset labels

`AddAlignmentLabels` (Annotate > Labels & Tables > Add Labels > Alignment > Station/Offset).

Pick the alignment, then click anywhere; Civil 3D writes a label with station and perpendicular offset. Edit the style to include a callout to a feature, the alignment name, and the station value.

## Station equations

A station equation lets a single alignment have a station discontinuity at a specific point (e.g., to align with legacy stationing on a previously built road).

Create:

1. Ribbon contextual **Alignment > Modify > Station Equations** (command: `EditAlignmentStationEquations`).
2. **Add Station Equation** > pick the location on the alignment.
3. Fill the row in Panorama:
   - **Raw Station** (where you clicked, in raw alignment length).
   - **Back Station** (the station displayed before the equation).
   - **Ahead Station** (the station displayed after the equation).
   - **Equation Type**: Increasing or Decreasing.

The math:

- For an **Increasing** equation: stations after the equation continue from `Ahead Station`; the running station increases through the equation.
- For a **Decreasing** equation: stations after the equation count down from `Back Station` to `Ahead Station`, then continue increasing. This is rare in roadway work; mostly seen when matching legacy survey records.

Civil 3D resolves station strings (e.g., `12+34.50`) using all equations in order. Labels and bands honor the equations automatically.

### Worked example

- Project starts at `0+00`. At raw station `1245.32`, a station equation puts:
  - Back = `12+45.32`
  - Ahead = `100+00.00` (Increasing)
- After the equation, station `1+00` past the equation reads `101+00.00`.
- The alignment ends at raw `2500.00`, displayed as `225+54.68`.

### Multiple equations

You can add several equations along the same alignment. Each acts on the running station from the previous. Display order in Panorama matches the alignment direction.

## Station references

A **station reference** label points at one alignment's station from inside another alignment's labels (e.g., a side-street alignment label that includes the mainline station of the centerline crossing). Configure via **Reference Text** components in the label style.

## Common errors

- **Major station labels missing where a station equation lives** — the increment skips past a non-round station; add a manual major label at the equation station.
- **Geometry point labels duplicated** — multi-segment style anchored on a sub-entity that overlaps another labeled segment; reduce the anchor scope.
- **Station equation flips direction unexpectedly** — Decreasing equation set when Increasing was intended; toggle in Panorama.
- **Reference text shows `???`** — the reference object was deleted or unloaded; restore or repick the reference.
- **Label set won't import** — saved in a newer Civil 3D version; copy the styles individually rather than the set.

## Related

- [Alignment labels (existing page)](alignment-labels.md)
- [Stationing equations (existing page)](stationing-equations.md)
- [Alignment criteria design](alignment-criteria-design.md)
- [Alignment creation and types](alignment-creation-and-types.md)
- [Superelevation tables](superelevation-tables.md)
