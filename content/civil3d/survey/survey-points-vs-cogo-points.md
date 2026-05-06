---
title: "Survey Points vs COGO Points"
section: "civil3d/survey"
order: 70
visibility: public
tags: [survey, cogo-points, survey-points, point-management]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [IMPORTSURVEYDATA, POINTSIMPORT, CreatePoints]
updated: 2026-05-06
---

> **TL;DR**
> 1. **Survey points** live in the survey database and carry observation lineage (which instrument station, what angle and distance, from which setup). Editing the observations recomputes the point's coordinates. They are inserted into a drawing by reference.
> 2. **COGO points** live in the drawing only. They have a number, coordinates, and descriptions but no measurement history. They are created by `POINTSIMPORT`, `CreatePoints`, or any non-survey workflow.
> 3. Use survey points when you need traceability to raw measurements (boundary, control, any work that may be audited). Use COGO points for design-generated coordinates, imported third-party data, or staking files where observation history is irrelevant.

## Where each type lives

| Attribute | Survey Point | COGO Point |
|---|---|---|
| Storage | Survey database (outside the DWG) | Drawing file (DWG) |
| Created by | `IMPORTSURVEYDATA`, survey database import | `POINTSIMPORT`, `CreatePoints`, LandXML import |
| Observation data | Yes — angles, distances, setups, equipment | No |
| Adjustable | Yes — least squares or compass rule | No |
| Linked to database | Yes — updates propagate on reprocess | No — standalone |
| Point number | Assigned in the survey database; mirrored in drawing | Assigned in the drawing's point counter |
| Deletable from drawing | Removing from drawing does not delete from database | Erasing removes permanently |

## Observation lineage

The distinguishing feature of survey points is their observation chain. A survey point created from a sideshot in the field book retains a link to:

- The instrument station (setup) from which it was observed.
- The backsight used to orient the instrument.
- The horizontal angle, zenith angle, and slope distance recorded.
- The equipment database applied (EDM constant, prism offset).
- The target height.

If any of these values are edited — correcting a transposed angle, changing the prism constant — the point's coordinates recompute. Downstream objects (figures passing through the point, surfaces using the point) update accordingly.

COGO points have none of this. Their coordinates are static numbers with no memory of how they were derived.

## When survey points are the right choice

- **Boundary surveys.** The licensed surveyor must be able to trace every corner back to raw field observations. If a boundary dispute arises, the observation chain in the survey database is the evidence.
- **Control networks.** Control points with redundant observations need least-squares adjustment. Only survey points participate in network analysis.
- **Construction staking verification.** When as-built observations are collected to verify placement, importing them as survey data preserves the measurement record.
- **ALTA/NSPS surveys.** Table A items (positional tolerance, network accuracy) require documented measurement traceability. Survey points in the database satisfy this.

## When COGO points are sufficient

- **Design points.** A point placed at a proposed manhole invert, a building corner, or a lot pin from plat coordinates is a design artifact with no field observation behind it.
- **Imported third-party data.** A client sends a CSV of boring locations or utility markout coordinates. There is no observation lineage to preserve; importing as COGO points is appropriate.
- **Staking output.** Staking files exported from a corridor or alignment model are computed coordinates for field layout. They are COGO by nature.
- **Legacy data.** Older projects may have point files but no field books. Importing as COGO is the only option.

## Converting between types

- **COGO to survey**: right-click the open survey database > Import > Import from drawing. This copies the drawing's COGO points into the survey database as non-control points. No observations are created — the points are coordinate-only entries in the database.
- **Survey to COGO**: inserting survey points into a drawing creates drawing-resident survey points. To sever the database link, right-click the inserted point > Remove from project. The point becomes a standalone COGO point.

Both conversions lose something. Going COGO-to-survey loses nothing (there was no lineage to begin with). Going survey-to-COGO severs the observation chain — the point survives but the measurement traceability does not.

## Point numbering conflicts

Survey points and COGO points share the same point-number namespace within a drawing. If the survey database has point 100 and you create a COGO point also numbered 100, Civil 3D warns of a conflict. Resolution options:

- **Renumber on import**: offset survey points by a fixed amount (e.g. survey points start at 1, COGO points start at 5001).
- **Sequence setting**: adjust the next point number in Drawing Settings > Point > Point Identity.
- **Merge**: if the coordinates match within tolerance, Civil 3D can merge them into one point. If not, one overwrites the other based on the drawing's `Duplicate Point Number` setting.

Establish a numbering convention before mixing both types in one drawing.

## Visibility and styling

Both types support the same Point Styles and Point Label Styles. Both can be members of Point Groups. There is no visual difference unless you deliberately assign a different style to distinguish them (e.g. a triangle for survey points, a circle for COGO points).

Description Keys apply when either type of point is inserted into the drawing. The matching occurs on the raw description regardless of the point's origin.

## Common gotchas

- **Editing a survey point's coordinates in the drawing.** Moving a survey point in the drawing breaks the database link. The database still holds the original computed coordinates; the drawing copy has the new position. On next reprocess, the database version wins and the manual edit is lost.
- **Deleting survey points.** Erasing a survey point from the drawing does not delete it from the database. It can be re-inserted at any time. Conversely, deleting an observation in the database may remove the point on next reprocess.
- **Multiple drawings, one database.** Two drawings can reference the same survey database. Each drawing has its own set of inserted survey points. Editing the database updates both drawings on next refresh.
- **Point group queries.** Point groups can filter by "Survey" or "non-Survey" in the Include tab's advanced criteria. Use this to build groups that operate on only one type.

## Related

- [Survey database](survey-database.md)
- [Importing raw observations](importing-raw-observations.md)
- [Point groups](../points/point-groups.md)
- [Point import and export formats](../points/import-export-formats.md)
- [Creating points](../points/creating-points.md)
