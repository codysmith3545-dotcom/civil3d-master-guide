---
title: "Point Reports"
section: "civil3d/points"
order: 50
visibility: public
tags: [points, reports, export, staking, toolbox, reports-manager]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [POINTSEXPORT, REPORTSMANAGER]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D provides built-in point reports through the Toolbox tab's Reports Manager. Reports include station-offset, inverse, coordinate listing, staking, and others. Output is HTML by default, convertable to PDF or printable.
> 2. For staking files and data exchange, `POINTSEXPORT` writes point data to ASCII (PNEZD, CSV, etc.) or LandXML. The point group selected determines which points export.
> 3. Custom report templates (XSLT-based) can be created or modified to match agency or client submittal formats, though for most offices the built-in templates suffice.

## Reports Manager

Access: Toolbox tab in Toolspace > Reports Manager > Points.

The Reports Manager groups pre-built report types under each object family. Under "Points," the available reports include:

| Report | Output |
|---|---|
| **Coordinate Listing** | Point number, northing, easting, elevation, description for a selected point group. |
| **Station Offset to Alignment** | Station and offset of each point relative to a chosen alignment. Useful for as-built comparison. |
| **Inverse Report** | Bearing and distance between consecutive points in a point group (ordered by point number). |
| **Staking Report** | Cut/fill from a design surface at each point, with station/offset references. |
| **Point Survey Data** | Observation-level detail (angles, distances) for survey points that retain database lineage. |

### Running a report

1. Toolbox > Reports Manager > Points > right-click a report > Execute.
2. A dialog prompts for parameters: point group selection, alignment (for station-offset), surface (for staking/cut-fill), and output settings.
3. The report generates as an HTML file and opens in the default browser. From there, print to PDF or copy into a submittal package.

### Customizing report templates

Reports are driven by XSLT templates located in the Civil 3D support folder (typically `C:\Program Files\Autodesk\AutoCAD 202x\C3D\Reports Manager\`). Each `.xsl` file defines the layout, headers, and formatting.

To customize:

1. Copy the existing `.xsl` file to a user folder (e.g. `S:\CAD Standards\Reports\`).
2. Edit the XSLT to change column order, add a company logo, or adjust number formatting.
3. In Reports Manager, right-click the report > Properties > change the stylesheet path to the custom file.

XSLT editing requires knowledge of XML/XSLT syntax. For most offices, the built-in templates are adequate. Minor changes (company name in the header, column width adjustments) are straightforward; complex reformatting may be easier to handle by exporting raw data and formatting in Excel.

## Exporting point data

### POINTSEXPORT

`POINTSEXPORT` (or right-click a point group in Prospector > Export Points) writes point data to a file using a selected Point File Format.

1. Select the point file format (PNEZD comma, space-delimited, custom, etc.).
2. Choose the output file path.
3. Select the point group(s) to export. Only members of the selected groups write to the file.

The output file is plain text. Common formats:

| Format | Columns | Use case |
|---|---|---|
| PNEZD (comma) | Point, Northing, Easting, Elevation, Description | General exchange, import into other survey software |
| PENZD (comma) | Point, Easting, Northing, Elevation, Description | Some data collectors expect E before N |
| NEZ (space) | Northing, Easting, Elevation | Minimal format for surface import in non-Civil 3D software |

### LandXML export

For lossless round-trip between Civil 3D installations or exchange with other LandXML-compatible software (Trimble Business Center, MicroStation OpenRoads):

1. Output tab > Export > Export to LandXML.
2. Select objects to export (points, surfaces, alignments, etc.).
3. The `.xml` file contains full point attributes including description, coordinate quality, and survey metadata if present.

### Staking files for data collectors

Field layout crews need staking files in the data collector's native format. The general workflow:

1. Create a point group containing only the staking points (design manholes, proposed lot corners, offset stakes).
2. `POINTSEXPORT` with PNEZD format.
3. Transfer the file to the data collector via USB, Bluetooth, or cloud sync.
4. Some data collectors (Trimble, Leica) accept CSV directly; others require conversion through their companion software.

For Trimble data collectors, the `.csv` file with columns Point, Northing, Easting, Elevation, Code typically imports directly into Trimble Access.

## Inverse and area reports for boundary work

The Inverse Report in Reports Manager computes bearing and distance between consecutive points in a group. For boundary work, create a point group containing only the boundary corners in the order they appear in the legal description, then run the inverse. The report output includes:

- Bearing (or azimuth, per ambient settings) between each pair.
- Horizontal distance.
- Cumulative distance.
- Angular closure and linear closure (if the group forms a closed loop).

This is a quick check against the legal description's metes and bounds. For formal map-check and closure analysis, the Parcel tools offer more rigorous options (see [Parcel labels and map check](../parcels/parcel-labels.md)).

## Common gotchas

- **Empty report.** A report that produces zero rows usually means the point group filter does not match any points, or the alignment/surface was not selected in the report parameters.
- **Wrong coordinate format.** The exported file uses the ambient setting's precision and format. If the data collector expects meters and the drawing is in feet, the file is unusable without conversion. Check units before export.
- **HTML report formatting.** The HTML output uses the system's default browser CSS. Printing from Chrome vs Edge may yield different pagination. For consistent formatting, save as PDF first.
- **Description truncation.** Some point file formats truncate descriptions at a fixed column width (often 32 characters). Long descriptions like `Sanitary Sewer Manhole Rim Existing` may be clipped. Test with a sample export.
- **Custom format not listed.** User-defined point file formats created with `CREATEPOINTFILEFORMAT` appear in the format dropdown only after restarting Civil 3D or refreshing the format list.

## Related

- [Point import and export formats](import-export-formats.md)
- [Point groups](point-groups.md)
- [Description keys](description-keys.md)
- [Parcel labels and map check](../parcels/parcel-labels.md)
