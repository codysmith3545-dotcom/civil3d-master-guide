---
title: "Description from a Parcel — Civil 3D Workflow"
section: "field-and-boundary/legal-descriptions"
order: 50
visibility: public
tags: [legal-description, parcel, civil3d]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-06
sources:
  - title: "Autodesk Civil 3D Help — Parcels"
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D parcels can generate **mapcheck-style legal descriptions** automatically: bearing, distance, curve data, area, and closure for each parcel segment.
> 2. The workflow is: create parcel geometry from alignments or linework, verify closure, run the mapcheck report, and export or copy the description for formatting.
> 3. Always review the generated text before delivering it. Civil 3D produces raw geometry — it does not write the caption, commencement, exceptions, or basis-of-bearings paragraph that a complete legal description requires.

## Creating parcels for description generation

Civil 3D parcels are closed figures defined by parcel segments (lines and curves). To use them for legal descriptions:

1. **Draw or import the boundary.** Use alignments, polylines, or feature lines that represent the parcel boundary. Convert to parcel segments using `CreateParcelFromObjects` or draw directly with `CreateParcel`.
2. **Set the parcel direction.** The direction of traverse (clockwise or counterclockwise) determines how bearings and distances are listed. Indiana convention and most U.S. practice describe parcels in a clockwise direction. Right-click the parcel and set the direction if needed.
3. **Set the start point.** The start point is the POB for the description. Select the parcel segment where the description should begin — typically at the commencement/POB corner.
4. **Verify closure.** Review the parcel properties to confirm the closure ratio. Indiana standards (865 IAC 1-12) specify minimum closure precision by class of survey. If the parcel does not close within tolerance, fix the geometry before generating the description.

## Running the mapcheck report

The mapcheck report is the primary tool for extracting a legal description from a parcel:

1. Select the parcel.
2. Open the **Parcel Properties** dialog or right-click and choose **Mapcheck Analysis** (the exact path depends on the Civil 3D version).
3. The report lists each segment in traverse order: bearing, distance (in the drawing's linear units), curve data (radius, arc length, chord bearing, chord distance, delta angle), and the cumulative closure.
4. Copy or export the report. Civil 3D can export to a text file or the clipboard.

The mapcheck report gives you the raw courses. You must add:

- **Caption** (section, township, range, county, state).
- **Commencement** (tie from controlling monument to POB).
- **Point of beginning** declaration.
- **Basis of bearings** (e.g., Indiana State Plane East Zone, NAD83(2011)).
- **Acreage** (Civil 3D reports area; convert to acres if needed: 1 acre = 43,560 sq ft).
- **Exceptions and easements.**
- **Surveyor signature block.**

## Exporting parcel data

Beyond the mapcheck report, Civil 3D can export parcel data in several ways:

- **Parcel report.** Generates a formatted report of parcel geometry. Configure report templates through the Toolbox > Reports Manager.
- **Data export to XML or CSV.** Useful when feeding parcel data into third-party legal-description-formatting software.
- **Copy to clipboard.** For quick paste into a word processor.

Some firms use custom report templates (XSLT-based) to produce descriptions closer to final form, reducing manual editing. Custom templates can include firm-specific language, Indiana-standard formatting, and automatic area conversion.

## Closure checks

Before delivering a description generated from Civil 3D:

- Confirm the **closure ratio** meets the project standard. For an ALTA survey, the relative positional precision reported on the plat must comply with the 2021 ALTA/NSPS standards. For Indiana boundary work, 865 IAC 1-12 sets minimum closure standards.
- **Round-trip the description.** Key the generated bearing-distance courses into a separate closure computation (spreadsheet or standalone mapcheck tool) to verify that the description as written closes. This catches transcription errors introduced during formatting.
- **Check curve data.** Verify that the radius, arc length, chord bearing, and chord distance are internally consistent. Civil 3D computes them from the arc geometry; rounding can introduce small inconsistencies in the published numbers. Adjust to maintain mathematical consistency.

## Formatting for attorneys and title companies

Attorneys and title companies expect a specific format:

- **Narrative prose**, not a table. Each course is a sentence beginning with "Thence."
- **Bearings in degrees, minutes, seconds** (not decimal degrees).
- **Distances in feet** to 0.01 foot (U.S. survey feet in Indiana).
- **Curve data** as a parenthetical or a separate clause: direction (left/right), radius, arc length, chord bearing, chord distance.
- **Area in acres** (and square feet for sub-acre parcels), following the return to POB.
- **No CAD jargon.** "A non-tangent curve" is acceptable; "a Civil 3D spiral entity" is not.

## Related

- [Writing metes-and-bounds descriptions](writing-metes-and-bounds.md)
- [Common errors in legal descriptions](common-errors.md)
- [Parcels (Civil 3D)](../../civil3d/parcels/index.md)
