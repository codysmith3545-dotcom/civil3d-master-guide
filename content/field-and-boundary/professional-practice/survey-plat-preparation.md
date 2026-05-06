---
title: "Survey Plat Preparation"
section: "field-and-boundary/professional-practice"
order: 50
visibility: public
tags: [plat, drawing, cad, recording]
updated: 2026-05-06
sources:
  - title: "865 IAC 1-12-11 — Plat Requirements"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-06
  - title: "IC 36-7-4 — Local Planning and Zoning (Subdivision Control)"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-7-4
    verified: 2026-05-06
---

> **TL;DR**
> 1. Indiana plat content is governed by 865 IAC 1-12-11 (all surveys) and IC 36-7-4 (subdivision plats). The surveyor must include the legal description, bearing/distance for every line, monuments found and set, basis of bearings, area, adjoiner names, easements, and the surveyor's seal and certification.
> 2. County recorder offices have specific format requirements (sheet size, margins, ink color, font size) that vary by county. Check with the recording office before finalizing the plat.
> 3. Subdivision plats require additional elements: owner's dedication, notarization, planning commission approval signatures, and compliance with local design standards.
> 4. Civil 3D's plan-production workflow (sheet sets, viewports, annotation scaling) is well suited to plat production when configured with correct templates.

## Required plat content (865 IAC 1-12-11)

Every survey plat prepared under an Indiana license must include:

### Header and identification

- Title block with project name, surveyor's firm name, address, and phone number.
- Surveyor's name, license number, seal, and signature.
- Date of fieldwork and date of plat preparation.
- Client name and purpose of survey.

### Legal and spatial content

- Legal description of the property (section, township, range; lot and block if platted; metes and bounds if unplatted).
- Bearings and distances for all boundary lines, to hundredths of a foot (0.01 ft).
- Curve data for all curved boundaries: radius (R), arc length (L), chord bearing, chord distance, and delta (central) angle.
- Area in square feet and/or acres.
- Basis of bearings and how it was determined.
- Reference to the deed or instrument from which the legal description was derived.

### Monuments

- Type, size, material, and condition of every monument found.
- Type, size, and cap stamping of every monument set.
- Clear symbology distinguishing found from set monuments.

### Context

- Names of adjoiners along each boundary (as shown in recorded deeds or plats).
- All visible improvements within 5 ft of the boundary (buildings, fences, walls, driveways, utilities).
- Recorded easements shown with their recording reference and dimensions.
- Evidence of encroachments and overlaps.
- Flood zone information, if applicable, with FIRM panel number and effective date.

### Graphic elements

- North arrow (oriented to the basis of bearings).
- Graphic scale bar.
- Legend explaining all symbols.
- Vicinity map showing the parcel in context.

## County recorder format requirements

Recording offices across Indiana have varying requirements. Common specifications:

| Element | Typical requirement |
|---------|---------------------|
| Sheet size | 18 in. x 24 in. or 24 in. x 36 in. (some counties accept 11 in. x 17 in. for simple surveys) |
| Margins | Minimum 1/2 in. on three sides; 1-1/2 in. to 2 in. on the left (binding edge) |
| Ink color | Black only |
| Font size | Minimum 8 pt, some require 10 pt |
| Medium | Mylar or bond paper (some now accept digital PDF) |
| Digital submission | Some counties accept electronic recording; verify format (PDF, TIFF, specific resolution) |

Always check with the county recorder's office before printing the final plat. Marion County, for example, has specific digital submission requirements that differ from surrounding counties like Hamilton or Johnson.

## Subdivision plat requirements

Subdivision plats are governed by IC 36-7-4 and local subdivision control ordinances. In addition to the standard plat content above, a subdivision plat must include:

### Owner's dedication

A written dedication statement signed and notarized by the property owner(s) that:

- Dedicates streets, alleys, and public spaces to public use.
- Establishes easements for utilities and drainage.
- Acknowledges any covenants or restrictions.
- Provides a legal description of the entire subdivision.

### Approval signatures

- Plan commission or plat committee approval, with date.
- County surveyor review and approval (technical sufficiency).
- County auditor (for tax purposes in some jurisdictions).
- County health department (if septic systems are involved).
- County drainage board (if regulated drains are affected).

### Additional content

- Lot and block numbers.
- Street names, widths, and right-of-way dimensions.
- Utility and drainage easement locations and widths (typically 10 ft to 20 ft along lot lines).
- Setback lines per local zoning ordinance.
- Total number of lots and total acreage.
- Phase boundaries, if the subdivision is phased.

## Civil 3D plat production workflow

Civil 3D's plan-production tools streamline plat preparation:

1. **Template setup.** Create a drawing template (.dwt) with the standard border, title block, seal block, and certification text. Configure annotation styles (text, dimensions, leaders) at the scale(s) you commonly use.

2. **Survey data.** Import field data into a survey database. Create a surface (if topographic data is included) and a COGO point group for monuments.

3. **Boundary linework.** Draw the boundary using parcels or polylines. Use parcel labels or line/curve labels to annotate bearings, distances, and curve data automatically.

4. **Annotation.** Add monument symbols (blocks) at each corner with attribute fields for type, condition, and description. Add easement hatching or linework. Label adjoiners with text or multileaders.

5. **Sheet layout.** Create a layout tab at the target sheet size. Set up viewports at the appropriate scale. Use annotative scaling so labels display correctly.

6. **Sheet sets.** For multi-sheet subdivision plats, use Civil 3D's Sheet Set Manager to organize layouts, maintain consistent numbering, and generate a sheet index.

7. **Publishing.** Plot to PDF for digital submission or to a plotter for paper copies. Verify that all text is legible, all monuments are clearly depicted, and the seal is placed correctly.

## Common deficiencies

County surveyors and recording officers commonly reject plats for:

- Missing basis of bearings.
- Curve data incomplete (omitting one or more of the five curve elements).
- Monuments not described in the legend or on the face of the plat.
- Area not stated.
- Incorrect or missing recording references for the source deed.
- Seal or signature not visible or not in ink.
- Sheet size or margin violations.
- Adjoiner names missing or incorrect.

## Related

- [865 IAC 1-12 Standards of Practice](indiana-865-iac.md)
- [Minimum technical standards](minimum-technical-standards.md)
- [Subdivision regulations](subdivision-regulations.md)
- [Working with title companies](working-with-title-companies.md)
- [Record keeping](record-keeping.md)
