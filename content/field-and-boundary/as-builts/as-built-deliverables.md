---
title: "As-Built Deliverable Formats"
section: "field-and-boundary/as-builts"
order: 30
visibility: public
tags: [as-built, deliverable, cad, pdf, gis, shapefile, geodatabase, layer-conventions]
updated: 2026-05-06
---

> **TL;DR**
> 1. Most reviewing authorities require a **marked-up plan set** (PDF with red-line corrections) as the primary deliverable, often supplemented by a **CAD drawing** with as-built data on designated layers.
> 2. GIS deliverables (**shapefile or geodatabase**) are increasingly required for utility as-builts, especially by municipalities managing stormwater (MS4) and water/sewer asset inventories.
> 3. Include a **tabular summary** of structure data (rim, inverts, pipe size, material, length, slope) — even if the drawing shows it graphically, the table is what reviewers use to check the numbers.

## Marked-up plan set (PDF redlines)

The most universally accepted as-built deliverable is a copy of the approved construction plans with as-built conditions marked in red (or another contrasting color).

**Procedure:**

1. Obtain a clean copy of the **most recent approved plan set** (the version the contractor built from).
2. Mark as-built conditions in red:
   - Structures: write as-built rim, inverts, pipe size, material next to each structure. Strike through the plan values and write the as-built values.
   - Alignment changes: sketch the actual alignment if it differs from the plan.
   - Additions or deletions: mark features that were added or removed during construction.
   - Elevations: write as-built spot elevations at key locations.
3. Note the survey date, the surveyor's name and license number, and the datum/projection on the cover sheet or title block.
4. Apply the certification and seal (see [certification language](certification-language.md)).
5. Export as PDF. Use a high-resolution scan if marking up a paper set.

For digital workflows, many firms mark up the plan PDF directly using PDF annotation tools (Bluebeam Revu, Adobe Acrobat) rather than printing and hand-marking.

## CAD as-built drawing (DWG)

Some reviewing authorities require a separate CAD file showing as-built conditions. This is distinct from the construction plan file — it is a new drawing (or a copy of the design file) updated with measured data.

**Layer conventions:**

Use a layer naming convention that distinguishes as-built data from design data. Common approaches:

| Layer name pattern | Content |
|---|---|
| C-SSWR-AB | Sanitary sewer — as-built |
| C-STRM-AB | Storm sewer — as-built |
| C-WATR-AB | Water main — as-built |
| C-BLDG-AB | Building — as-built |
| C-TOPO-AB | Site grading — as-built |

If the municipality publishes CAD standards (many Indiana communities follow NCS or a local variant), follow their layer naming exactly.

**Drawing content:**

- As-built pipe network with rims, inverts, and pipe data labeled.
- As-built structure locations and sizes.
- Building footprint with corner coordinates and FFE.
- Spot elevations across the site.
- Limits of disturbance, detention basin contours, and other site features.
- Coordinate system, datum, and vertical datum noted in the title block.

Provide the DWG in the version specified by the reviewing authority (commonly AutoCAD 2018 or later format). Include any associated reference files (xrefs, images).

## GIS deliverable (shapefile / geodatabase)

Municipalities increasingly require GIS-format deliverables for as-built utilities, especially for:

- **Stormwater (MS4 compliance).** The MS4 permit requires the municipality to map its storm sewer system. As-built data feeds directly into the GIS.
- **Water and sewer asset management.** Utilities use GIS to track pipe age, material, size, and condition.
- **FEMA floodplain compliance.** Detention basin as-builts may need to be integrated into the community's stormwater model.

**Common formats:**

- **Shapefile (.shp):** Widely compatible but limited to simple feature types and short field names (10 characters).
- **File geodatabase (.gdb):** Richer schema, longer field names, supports relationships. Preferred by many GIS departments.
- **GeoJSON:** Sometimes requested for web-based systems.

**Attribute fields (storm sewer example):**

| Field | Type | Description |
|---|---|---|
| STRUCT_ID | Text | Structure identifier (plan reference) |
| STRUCT_TYPE | Text | MH, CB, JB, INLET, OUTFALL |
| RIM_ELEV | Double | Rim elevation (ft) |
| INV_IN_1 | Double | Invert in, pipe 1 (ft) |
| INV_OUT | Double | Invert out (ft) |
| PIPE_DIA | Integer | Pipe diameter (in.) |
| PIPE_MAT | Text | RCP, PVC, HDPE, CMP, DIP |
| PIPE_LEN | Double | Pipe length (ft) |
| PIPE_SLOPE | Double | Pipe slope (%) |
| SURVEY_DATE | Date | Date of as-built measurement |
| SURVEYOR | Text | Name and license number |

Coordinate the attribute schema with the reviewing authority's GIS department before creating the deliverable. Mismatched schemas create rework.

## As-built report with tabular data

A standalone report (PDF or spreadsheet) that summarizes the as-built data in tabular form. This is often the quickest way for a reviewer to check the data.

**Table format (storm/sanitary):**

| Structure | Rim | INV In (dir) | INV Out (dir) | Pipe Size | Material | Length | Slope |
|---|---|---|---|---|---|---|---|
| MH-1 | 786.32 | 779.41 (N) | 779.22 (S) | 15 in. | RCP | 312.4 ft | 0.61% |
| MH-2 | 785.10 | 778.03 (N) | 777.85 (S) | 15 in. | RCP | 287.1 ft | 0.63% |

Include design values alongside as-built values so the reviewer can see deviations at a glance. Highlight any deviation that exceeds the tolerance specified in the contract or permit.

## Delivery checklist

Before submitting as-built deliverables:

- [ ] Marked-up plan set complete, with all structures and features annotated.
- [ ] Certification language and seal applied.
- [ ] CAD file layers follow the reviewing authority's convention.
- [ ] GIS data projected to the correct coordinate system and schema matches requirements.
- [ ] Tabular report complete with all structures and pipes.
- [ ] Design values and as-built values shown side by side (for deviation review).
- [ ] Metadata documented: datum, projection, geoid, survey date, equipment.
- [ ] Files named per the reviewing authority's convention (if any).
- [ ] Electronic files tested: DWG opens without errors, shapefile loads, PDF is not corrupted.

## Related

- [What as-builts capture](what-as-builts-capture.md)
- [Certification language](certification-language.md)
- [Storm/sanitary as-builts](storm-sanitary-as-builts.md)
- [Site as-builts](site-as-builts.md)
