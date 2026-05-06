---
title: "Legal Descriptions from Parcels"
section: "civil3d/parcels"
order: 50
visibility: public
tags: [parcel, legal-description, metes-and-bounds, reports-manager, plat]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [REPORTSMANAGER, PARCELMAPCHECK]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D can generate metes-and-bounds legal description text from parcel objects using the Reports Manager. The report traverses the parcel boundary in order, outputting bearing, distance, and curve data for each segment.
> 2. The output is a starting point, not a finished legal document. A licensed surveyor must review and edit the text to include the correct point of beginning reference, monument calls, adjoiner references, area statement, and jurisdiction-specific language.
> 3. For multi-parcel plats, generate a description for each lot and compile into the plat document. The map-check report verifies closure before the description is finalized.

## Generating a legal description from a parcel

### Using Reports Manager

1. Toolbox tab > Reports Manager > Parcels.
2. Select the `Metes and Bounds` report (or `Legal Description` if available — report names vary by Civil 3D version and installed content).
3. Right-click > Execute.
4. Select the parcel(s) to describe.
5. Specify the starting segment (the side where the point of beginning is located).
6. The report generates HTML output with sequential bearing-distance and curve-data calls.

### Output format

A typical report segment reads:

```
Thence N 45°30'15" E a distance of 125.00 feet to a point;
Thence along a curve to the right having a radius of 250.00 feet,
an arc length of 78.54 feet, a chord bearing of N 54°30'15" E,
and a chord distance of 78.12 feet to a point;
```

The report follows the parcel boundary from the starting segment, proceeding clockwise (or counter-clockwise, depending on the parcel's winding direction and the starting point selection).

### Customizing the template

The report template is an XSLT stylesheet. Customization options:

- **Language**: change "Thence" to "thence", "a distance of" to a different phrase.
- **Abbreviations**: use `N.` instead of `North`, `ft.` instead of `feet`.
- **Curve format**: include or exclude tangent length, delta angle, or other curve parameters.
- **Precision**: override the number of decimal places for bearings and distances.

Copy the shipped XSLT to a company folder, edit, and point the report to the custom file (report Properties > Stylesheet).

## Elements of a complete legal description

The Civil 3D report produces the bearing-distance calls, but a complete legal description requires additional elements that must be added by the surveyor:

1. **Caption**: identifies the parcel within the larger tract (e.g. "A part of the Southeast Quarter of Section 12, Township 17 North, Range 3 East, Marion County, Indiana").
2. **Point of beginning (POB) reference**: ties the starting point to a monument, section corner, or other reference (e.g. "Commencing at the Southeast Corner of said Section 12, said corner being marked by a found stone monument; thence N 00°02'15" W along the East line of said Section a distance of 500.00 feet to the TRUE POINT OF BEGINNING").
3. **Metes and bounds calls**: the bearing-distance and curve data for each segment — this is what Civil 3D generates.
4. **Closure statement**: "thence to the Point of Beginning" or explicit closure call.
5. **Area statement**: "Containing 2.500 acres, more or less."
6. **Excepting/subject to**: easements, ROW dedications, or other encumbrances.
7. **Basis of bearings**: the reference for all bearings (e.g. "Bearings are based on the Indiana State Plane Coordinate System, East Zone, NAD 83 (2011)").

## Workflow for a subdivision plat

1. **Lay out all lots** in a single site using the parcel creation and sizing tools.
2. **Run map check** on each lot to verify closure. See [Parcel labels and map check](parcel-labels.md).
3. **Generate legal descriptions** for each lot via Reports Manager.
4. **Edit descriptions** in a word processor: add the caption, POB reference, adjoiner calls, area statement, and signature block.
5. **Cross-check**: confirm that each shared boundary reads identically in both adjacent lots' descriptions (same bearing, reciprocal at the shared line; same distance).

## Integrating with the legal-descriptions content

This knowledge base includes a dedicated section on legal description practice at `content/field-and-boundary/legal-descriptions/`. That section covers:

- Indiana-specific requirements for legal descriptions (monument references, section-township-range).
- ALTA/NSPS requirements for surveys that include legal descriptions.
- Common errors in legal descriptions and how to identify them during title review.

The Civil 3D parcel workflow described here is the production side; the field-and-boundary content covers the legal and procedural side.

## Alternative: manual metes-and-bounds composition

For a single boundary parcel (not a subdivision), it may be faster to:

1. Create the parcel from objects or by interactive layout.
2. Run `PARCELMAPCHECK` to get the ordered list of bearings, distances, and curve data.
3. Copy the map-check output and format it into legal description language manually.

This avoids the Reports Manager entirely and gives the surveyor full control over wording from the start.

## Common gotchas

- **Wrong winding direction.** The report may traverse the boundary counter-clockwise when the convention is clockwise (or vice versa). Select the correct starting segment and direction when prompted. Some jurisdictions require clockwise traversal; others do not specify.
- **Precision mismatch.** The report uses the ambient settings for bearing and distance precision. If the drawing is set to whole-second bearings (precision 0) but the legal requires 1-second precision, the report rounds incorrectly. Adjust ambient settings before generating.
- **Curve approximation.** If the parcel boundary includes a segment that was originally a spline approximated by short line segments, the legal description will list many short bearings and distances instead of one curve call. Use true arc segments for curves in the parcel boundary.
- **Shared boundary reciprocals.** When two lots share a boundary, Lot 1's description calls "N 45°30'15" E" and Lot 2's should call "S 45°30'15" W" for the same line. Verify that Civil 3D's report output produces the correct reciprocal.
- **Report template not installed.** Some Civil 3D installations do not include the legal description XSLT by default. If the report is missing, download the template from the Autodesk App Store or the Civil 3D Country Kit for the U.S.

## Related

- [Creating parcels](creating-parcels.md)
- [Parcel labels and map check](parcel-labels.md)
- [Sites and topology](sites-and-topology.md)
- [Parcel sizing (slide line, swing line)](parcel-sizing.md)
