---
title: "Parcel Labels and Tables"
section: "civil3d/parcels"
order: 30
visibility: public
tags: [parcel, labels, area, bearing-distance, curve-data, tables, map-check]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [ADDPARCELLABELS, ADDPARCELTABLE, PARCELMAPCHECK]
updated: 2026-05-06
---

> **TL;DR**
> 1. Parcel labels fall into two categories: **area labels** (placed inside the parcel showing area, name, and other properties) and **segment labels** (placed on each boundary line/curve showing bearing-distance or curve data).
> 2. The map-check analysis (`PARCELMAPCHECK`) traverses the parcel boundary and reports angular/linear misclosure and precision ratio — essential for verifying legal description accuracy.
> 3. Parcel tables aggregate lot data (area, perimeter, number) into a single table object for plat sheets and reports.

## Area labels

An area label is placed at the centroid (or a user-specified location) inside the parcel. It typically displays:

- **Parcel name** (e.g. "Lot 1, Block A")
- **Area** in square feet, acres, or both (controlled by the label style's expression and ambient settings)
- **Parcel number**
- **Perimeter** (optional)
- **Tax ID or address** (optional, from user-defined properties)

Area labels are added automatically when parcels are created (if "auto-add area label" was enabled) or manually via `ADDPARCELLABELS` > Area.

### Label style for area labels

Key settings in the label style:

- **Content**: expression using `{Parcel Area}`, `{Parcel Name}`, `{Parcel Perimeter}`, and literal text. Example: `LOT {Parcel Number}\PAREA = {Parcel Area}`.
- **Unit and precision**: area can display in sq ft (precision 1), acres (precision 3), or a dual display. Override the ambient area settings in the label style's Layout tab if needed.
- **Text height**: typically 0.08"--0.10" plotted for subdivision plats.
- **Visibility by scale**: area labels may be set to visible only above a certain scale to avoid cluttering small-scale sheets.

## Segment labels

Segment labels annotate each line or curve segment of the parcel boundary:

### Line segment labels

Display bearing (or azimuth) and horizontal distance. Standard format for U.S. boundary work:

```
N 45°30'15" E  125.00'
```

The label style references `{Segment Bearing}` and `{Segment Length}`. Precision is controlled by the ambient direction setting (typically to 1 second for boundary, 0.1 second for high-accuracy work) and the ambient distance setting (typically 2 decimal places for feet).

### Curve segment labels

Display curve data per the standard convention:

- **Arc length** (L)
- **Radius** (R)
- **Delta angle** (central angle)
- **Chord bearing** (direction of the straight line between endpoints)
- **Chord distance** (straight-line distance between endpoints)
- **Tangent length** (T), optional

Label styles for curves typically stack these values in a column or arrange them with abbreviations:

```
L = 78.54'  R = 250.00'
D = 18°00'00"
CB = N 54°30'15" E
CD = 78.12'
```

### Adding segment labels

- Automatic: when creating parcels from objects, the "auto-add segment labels" option places labels on every segment.
- Manual: `ADDPARCELLABELS` > Single Segment or Multiple Segment. Click on a parcel boundary to place.
- Spanning: for shared boundaries (between two lots), the label is placed once on the shared edge and references both parcels.

## Parcel tables

A parcel table collects area and attribute data from all parcels in a site (or a selected subset) into a single tabular object in the drawing.

1. Annotate tab > Labels & Tables panel > Add Tables > Parcel > Add Area.
2. Select the site and the parcels to include.
3. Choose the table style (controls column widths, header text, border formatting).
4. Place the table in the drawing.

The table updates dynamically. Adding a lot or resizing a parcel changes the table. Columns typically include:

| Column | Expression |
|---|---|
| Lot Number | `{Parcel Number}` |
| Area (sq ft) | `{Parcel Area}` |
| Area (acres) | `{Parcel Area}` (formatted in acres) |
| Perimeter | `{Parcel Perimeter}` |

Custom columns (block number, phase, zoning) can be added by editing the table style.

## Map check

`PARCELMAPCHECK` (or right-click a parcel > Map Check) traverses the parcel boundary segment by segment and reports:

- **Starting point** coordinates.
- **Each segment**: direction, distance, and running coordinates.
- **Closure**: angular misclosure, linear misclosure (delta N, delta E), and precision ratio (e.g. 1:25,000).
- **Area**: computed area from the traverse.

### Interpreting results

- **Precision ratio** (1:N): the ratio of the linear misclosure to the total perimeter. For boundary surveys, 1:15,000 or better is typical for urban lots (per ALTA/NSPS 2021 standards, the relative positional precision must be 0.07 ft or better, which is a different metric but conceptually related).
- **Angular misclosure**: the difference between the theoretical sum of interior angles and the computed sum. For a closed polygon with N sides, the theoretical sum is (N-2) x 180 degrees.

Map check is a verification tool, not an adjustment tool. If closure is unacceptable, review the source bearing/distance data for errors.

### Running map check on a legal description

To verify a legal description received from a title company or deed:

1. Enter the metes-and-bounds calls as parcel segments (create the parcel from objects or interactive layout).
2. Run `PARCELMAPCHECK`.
3. Compare the computed area and closure with the deed's stated area.
4. A poor closure suggests a transcription error in the deed, a missing call, or a historical discrepancy.

## Common gotchas

- **Label on wrong side.** Segment labels may appear on the wrong side of a shared boundary. Flip the label by selecting it and using grips or the right-click > Reverse Label Side option.
- **Duplicate labels on shared edges.** When two parcels share a boundary, adding segment labels to both parcels creates overlapping labels. Use spanning labels or label only one side.
- **Area precision.** A parcel of 0.9998 acres displayed at 2 decimal places shows "1.00 ac" — which may be legally different from "1.00 acres or more." Use 3-4 decimal places for boundary/legal documents.
- **Curve direction.** A curve segment's chord bearing depends on which direction the parcel boundary traverses. If the parcel was created clockwise vs counter-clockwise, the chord bearing may read as the reciprocal. Verify against the legal description.
- **Table does not update.** If a parcel is added to the site after the table was placed, the table should update automatically. If it does not, right-click the table > Update or regenerate. Tables reference the site, not a static list.

## Related

- [Creating parcels](creating-parcels.md)
- [Parcel sizing (slide line, swing line)](parcel-sizing.md)
- [Sites and topology](sites-and-topology.md)
- [Legal descriptions from parcels](legal-descriptions-from-parcels.md)
