---
title: "Record Keeping"
section: "field-and-boundary/professional-practice"
order: 80
visibility: public
tags: [records, field-notes, project-files, retention]
updated: 2026-05-06
sources:
  - title: "865 IAC 1-12-13 — Record Retention"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-06
  - title: "IC 25-21.5-9 — Disposition of Records"
    url: https://iga.in.gov/laws/2024/ic/titles/25#25-21.5
    verified: 2026-05-06
---

> **TL;DR**
> 1. Indiana requires surveyors to retain complete project records for the life of the license plus five years (865 IAC 1-12-13). Upon retirement or death, records must be transferred to another licensee or the county surveyor.
> 2. "Complete records" means raw field observations, adjustment reports, coordinate files, research documents, correspondence, and the final deliverables — everything needed for another competent surveyor to understand and retrace the work.
> 3. Digital records are acceptable but must be stored in formats that remain accessible over decades. Open formats (CSV, ASCII, PDF/A, DXF) are more durable than proprietary binary formats alone.
> 4. A consistent project file structure saves time on every project and is invaluable in litigation or when responding to licensing complaints.

## Indiana retention requirements

865 IAC 1-12-13 requires:

- **Duration:** Records must be retained for the duration of the surveyor's active license and for five years after the license expires, is surrendered, or the surveyor dies.
- **Transfer on retirement or death:** IC 25-21.5-9 requires that survey records be transferred to another licensed surveyor, to the surveyor's successor firm, or to the county surveyor's office. Records must not be destroyed.
- **Accessibility:** Records must be available for inspection upon request by the Board, by a client, or by another surveyor with a legitimate need (e.g., an adjoiner's surveyor retracing a shared line).

In practice, this means a surveyor who is licensed for 35 years must maintain records from the first survey through five years after retirement — potentially 40+ years. Planning for long-term storage is not optional.

## What to preserve

The standard is that the records must be sufficient for another competent surveyor to understand and reproduce the work. At minimum:

### Raw field observations

- Total station raw data files (angle, distance, rod height, instrument height).
- GNSS raw observation files (RINEX or receiver-native format) and processing reports.
- Level run notes (benchmark, backsight, height of instrument, foresight readings).
- Photographs of found monuments, evidence, and site conditions.

### Computations and adjustments

- Traverse adjustment report (input observations, adjusted coordinates, closure, residuals).
- GNSS network adjustment report (baselines, residuals, error ellipses, confidence levels).
- COGO computation sheets or CAD computation files.
- Area calculations.
- Coordinate listing for all points.

### Research documents

- Copies of all deeds researched (subject and adjoiners), with recording references.
- Prior survey plats.
- Title commitment and Schedule B-II exceptions.
- County surveyor corner records.
- GLO field notes and plats.
- Zoning and planning documents.
- Correspondence with the client, title company, adjoiners, or government agencies.

### Deliverables

- Final survey plat (signed and sealed version).
- Surveyor's report or narrative.
- Legal descriptions prepared.
- Staking reports (if construction staking was performed).

## Field note formats

### Traditional (paper) field notes

Paper field notes remain legally robust. A bound field book with consecutive, non-removable pages is difficult to alter and easy to authenticate. Key practices:

- Use a bound book, not loose sheets.
- Write in permanent ink.
- Do not erase — draw a single line through errors and initial.
- Record the date, weather, crew members, and equipment on each page.
- Sketch the site with measured ties and monument descriptions.
- Number pages consecutively and cross-reference to the project.

### Electronic field notes

Modern data collectors produce electronic field records. These are acceptable under Indiana standards if:

- The raw data files are preserved unmodified (not overwritten during processing).
- A backup copy is maintained in a separate location.
- The file format is documented so that the data can be read by future software.
- Supporting information (instrument heights, descriptions, sketch notes) is included in the electronic record or supplemented by written notes.

Best practice is to maintain both: raw electronic files for completeness and a summary field log (paper or digital) for context and narrative.

## Digital record standards

Digital records face a unique challenge: technology changes faster than the retention period. A proprietary file format from 2005 may be unreadable in 2035. Strategies:

- **Export to open formats.** In addition to native CAD files (.dwg), export to DXF, PDF/A, and ASCII coordinate lists. These formats have wide support and are unlikely to become unreadable.
- **Document the software.** Record the software name, version, and operating system used to create each file. Include this in the project folder.
- **Migrate periodically.** Every 5 to 10 years, verify that archived files can still be opened. Re-export if necessary.
- **Use redundant storage.** Maintain at least two copies in different physical locations: on-site server plus off-site backup (cloud or separate facility).
- **GNSS data.** Export GNSS observations to RINEX format in addition to the receiver-native format. RINEX is an open standard that will remain readable.

## Suggested project file structure

A consistent folder structure makes records retrievable and demonstrates organized practice:

```
[Project Number] - [Client] - [Location]/
  01-Research/
    Deeds/
    Prior-Surveys/
    Title-Commitment/
    Corner-Records/
    GLO-Notes/
  02-Field-Data/
    Raw-Data/
    Photos/
    Field-Log/
  03-Computations/
    Traverse-Adjustment/
    GNSS-Processing/
    COGO/
    Area-Calcs/
  04-CAD/
    Working/
    Final/
  05-Deliverables/
    Plat/
    Report/
    Legal-Descriptions/
  06-Correspondence/
    Client/
    Title-Company/
    Adjoiners/
    Government/
  07-Admin/
    Scope-Letter/
    Invoice/
    Insurance-Certificate/
```

This structure is a starting point. Adapt it to your practice, but keep it consistent across projects.

## Responding to records requests

When another surveyor, a client, or an agency requests project records:

- A current or former client has a right to a copy of the deliverables (plat, report, legal description). Whether the client has a right to the full working file (field notes, research) is debated, but best practice is to provide reasonable access.
- Another licensed surveyor retracing an adjoining boundary has a professional courtesy claim to review the relevant portions of the record. Many surveyors cooperate willingly; the profession benefits when records are shared.
- The Board of Registration (through IPLA) may demand records during an investigation. Failure to produce them is itself a violation.

Never alter records after the fact. If an error is discovered in past work, prepare a corrective document (amended plat, supplemental report) rather than modifying the original.

## Related

- [865 IAC 1-12 Standards of Practice](indiana-865-iac.md)
- [Survey plat preparation](survey-plat-preparation.md)
- [Surveyor's report (Indiana)](../monuments-and-evidence/surveyors-report-indiana.md)
- [Professional liability](professional-liability.md)
