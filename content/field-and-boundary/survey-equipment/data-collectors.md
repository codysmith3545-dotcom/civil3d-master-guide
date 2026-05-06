---
title: "Data Collectors & Field Controllers"
section: "field-and-boundary/survey-equipment"
order: 40
visibility: public
tags: [data-collector, field-controller, trimble, leica, topcon]
updated: 2026-05-06
sources:
  - title: "Trimble — TSC7 Controller"
    url: https://geospatial.trimble.com/
    verified: 2026-05-06
  - title: "Leica Geosystems — CS20 Controller"
    url: https://leica-geosystems.com/
    verified: 2026-05-06
  - title: "Topcon — FC-6000 Controller"
    url: https://www.topconpositioning.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. The data collector is the **critical link** between field observations and office deliverables. Choose one that integrates with your instruments and supports your field-to-finish codes.
> 2. Understand your collector's **raw data format** (JOB/JXL for Trimble, GSI/HeXML for Leica, GTS/FC for Topcon) so you can troubleshoot imports and preserve the original observations.
> 3. Export to Civil 3D via **FBK** (field book) or **PNEZD** (point file) format. FBK preserves the full observation chain; PNEZD gives only coordinates.

## Common platforms

### Trimble

- **TSC7 / TSC5:** Runs Trimble Access field software. The TSC7 has a 7-inch screen and runs Windows 10. It is the standard controller for Trimble S-series total stations and R-series GNSS receivers.
- **Trimble Access:** Feature-rich software supporting conventional, GNSS, and scanning workflows. Stores data in JOB format (proprietary binary) with JXL (XML) export. Supports custom feature code libraries and linework processing.

### Leica

- **CS20 / CS35:** Runs Leica Captivate field software. CS20 is a handheld tablet; CS35 is a larger 10-inch tablet. Controls Leica TS and GS instruments.
- **Captivate:** Touchscreen-oriented field software. Stores data in proprietary DBX format with GSI (ascii) and HeXML export options. Supports 3D visualization of collected data in the field.

### Topcon

- **FC-6000 / FC-5000:** Runs Topcon MAGNET Field software. Controls Topcon/Sokkia total stations and GNSS receivers.
- **MAGNET Field:** Stores data in proprietary format with export to GTS, FC (raw), CSV, and DXF. Supports field-to-finish code libraries.

## Field-to-finish workflow

Field-to-finish automates the creation of points, linework, and surface data in Civil 3D from coded field observations. The workflow:

1. **Define a code library** in both the data collector and Civil 3D. Each code maps to a point description, symbol, and optionally a linework command (begin line, end line, curve, close).
2. **Collect data in the field** using the agreed codes. Example codes: EP (edge of pavement), TC (top of curb), FL (flowline), MH (manhole), BLD (building corner).
3. **Transfer the data** from the collector to the office computer. Use USB, Bluetooth, Wi-Fi, or cloud sync depending on the platform.
4. **Import into Civil 3D** using the appropriate method (see below).
5. **Process linework** using Civil 3D's description key sets and figure processing, or a third-party field-to-finish processor.

## Raw data formats

Understanding the raw format matters for QA, troubleshooting, and archiving.

### Trimble JOB / JXL

- **JOB:** Binary format, readable only in Trimble software (Trimble Access, Trimble Business Center).
- **JXL (JobXML):** XML export of the JOB file. Human-readable. Contains all observations (angles, distances, GNSS vectors), instrument setups, and metadata. Civil 3D can import JXL directly via the survey database.

### Leica GSI / HeXML

- **GSI:** ASCII format with fixed-width fields. Two variants: GSI-8 (8-digit values) and GSI-16 (16-digit values). Well documented and widely supported.
- **HeXML:** XML format containing the full dataset. Richer than GSI but less universally supported.
- **DBX:** The native database format. Export to GSI or HeXML for interoperability.

### Topcon GTS / FC

- **GTS:** Raw observation format for Topcon instruments.
- **FC:** Raw measurement file.
- Both are typically converted to CSV or other formats for import.

## Exporting to Civil 3D

### FBK (Field Book) import

FBK is Civil 3D's native text format for survey observations. It preserves the full measurement chain: instrument setups, backsights, angle/distance observations, and description codes.

To import FBK into Civil 3D:

1. Convert the collector's raw data to FBK format using the manufacturer's office software (Trimble Business Center, Leica Infinity, Topcon MAGNET Office) or a third-party converter.
2. In Civil 3D, open the Survey tab in Toolspace.
3. Right-click the survey database > Import > Field Book.
4. Select the FBK file and the appropriate equipment database (which defines instrument and target precision for least-squares processing).
5. Civil 3D creates observation records, computes preliminary coordinates, and builds figures from linework codes.

### PNEZD (Point file) import

PNEZD is a comma- or space-delimited text file with columns: Point Number, Northing, Easting, Elevation, Description. It contains only computed coordinates, not raw observations.

Use PNEZD when:

- You do not need raw observations in Civil 3D (e.g., GNSS topo points that have already been processed).
- The raw format is not supported by Civil 3D's FBK importer.
- You need a quick import without configuring the survey database.

To import: Civil 3D ribbon > Insert tab > Points from File > select the PNEZD format and the text file.

### Direct JXL import

Civil 3D can import Trimble JXL files directly into the survey database, preserving full observations. This is the preferred path for Trimble users because it avoids the FBK conversion step and retains GNSS vector data for network adjustment.

## Data management best practices

- **Archive the raw data** in its native format (JOB, DBX, etc.) before any conversion. This is your legal record of what was measured.
- **Name files consistently.** Include the project number, date, and crew initials. Example: `2026-0123_20260506_JD.JXL`.
- **Back up daily.** Copy field data to the office server or cloud storage at the end of every field day.
- **Version control.** When re-processing or editing, keep the original import and create a new version rather than overwriting.

## Related

- [Total station setup](total-station-setup.md)
- [GNSS RTK](gnss-rtk.md)
- [Civil 3D survey database](../../civil3d/survey/survey-database.md)
- [Civil 3D description key sets](../../civil3d/points/description-keys.md)
- [Civil 3D linework code sets](../../civil3d/survey/linework-code-sets.md)
