---
title: "Record Research Pre-Field"
section: "playbooks"
order: 20
visibility: public
tags: [playbook, record-research, deed-decoder, adjoiners, title]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "865 IAC 1-12-7 — Research Requirements for Boundary Surveys"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "IC 36-2-11 — Indiana County Recorder"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-2-11
    verified: 2026-05-11
  - title: "IC 36-2-12 — Indiana County Surveyor"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-2-12
    verified: 2026-05-11
  - title: "2021 ALTA/NSPS Minimum Standard Detail Requirements, Section 5"
    url: https://www.nsps.us.com/page/ALTAACSM
    verified: 2026-05-11
---

> **TL;DR**
> 1. Pull the subject deed plus every adjoiner deed and recorded plat through three chains: county recorder, county surveyor, and county assessor.
> 2. Decode each instrument with the Deed Decoder, then cross-reference common boundaries to identify gaps, overlaps, and senior/junior call conflicts before you mobilize a crew.
> 3. Produce a research memo that lists the documents pulled, the conflicts found, and the working theory of the boundary that the field crew will test.

## Phase 1 — Establish the parcel envelope

Start with the current deed of record. Identify the section, township, and range, and use Jurisdiction Intelligence GPS lookup on a single seed point to confirm which county, township, and municipality you are in. Pull the county GIS parcel map and the most recent recorded plat covering the subject. This is the envelope you will research outward from.

- [content/field-and-boundary/legal-descriptions/index.md](../field-and-boundary/legal-descriptions/index.md)
- [content/field-and-boundary/legal-descriptions/plss-descriptions.md](../field-and-boundary/legal-descriptions/plss-descriptions.md)
- Jurisdiction Intelligence GPS lookup
- MCP `get_jurisdiction_rules` (returns county recorder + county surveyor links)

## Phase 2 — Pull the subject and adjoiner chains

Pull every deed in the chain of the subject parcel back to the patent or to a stable senior call (usually a recorded plat, sectional aliquot description, or a long-held metes-and-bounds reference). Then do the same for each adjoiner. The county recorder is your primary source, the county surveyor's section-corner tie sheets are mandatory for PLSS boundaries, and the assessor's records are useful for ownership verification but never as evidence of boundary location.

- [content/field-and-boundary/boundary-and-alta/title-commitment-review.md](../field-and-boundary/boundary-and-alta/title-commitment-review.md)
- [content/field-and-boundary/professional-practice/working-with-title-companies.md](../field-and-boundary/professional-practice/working-with-title-companies.md)
- [content/field-and-boundary/monuments-and-evidence/section-corner-evidence.md](../field-and-boundary/monuments-and-evidence/section-corner-evidence.md)
- Jurisdiction Intelligence checklist (returns the specific recorder, surveyor, and assessor links per county)

## Phase 3 — Decode every instrument

Feed every deed, plat, and easement into the Deed Decoder. The tool outputs bearings, distances, curve data, computed coordinates, and a closure report. For recorded subdivision plats, decode the lot and the controlling block boundary so you can detect plat-vs-deed call drift across generations of conveyances.

- Deed Decoder web tool + MCP `decode_deed`
- Calculator: [traverse-closure](../../web/app/tools/traverse-closure/page.tsx) for any decoded description that fails to close
- [content/field-and-boundary/legal-descriptions/common-errors.md](../field-and-boundary/legal-descriptions/common-errors.md)
- [content/field-and-boundary/legal-descriptions/call-priority.md](../field-and-boundary/legal-descriptions/call-priority.md)

## Phase 4 — Cross-reference adjoiners and identify conflicts

Overlay decoded geometries in Civil 3D or in the deed-decoder sketch view. Mark every gap, overlap, hiatus, and ambiguous call. Tag each conflict with which deed is senior and what evidence would resolve it. This is the field crew's hit list.

- [content/field-and-boundary/boundary-and-alta/senior-and-junior-rights.md](../field-and-boundary/boundary-and-alta/senior-and-junior-rights.md)
- [content/field-and-boundary/boundary-and-alta/pincushion-and-adjoiners.md](../field-and-boundary/boundary-and-alta/pincushion-and-adjoiners.md)
- [content/field-and-boundary/advanced-boundary/common-boundary-disputes.md](../field-and-boundary/advanced-boundary/common-boundary-disputes.md)
- Civil 3D Power Pack LISP via MCP `get_lisp` (e.g. routines that import deed-decoder JSON into a sketch site)

## Phase 5 — Produce the research memo

Write a short research memo: documents reviewed, closures computed, conflicts identified, working theory of the boundary, and a list of monuments you expect to find. Save the memo into the project package that will go to the AI Project Companion before fieldwork so plat-check has a baseline.

- [content/field-and-boundary/professional-practice/record-keeping.md](../field-and-boundary/professional-practice/record-keeping.md)
- [content/field-and-boundary/boundary-and-alta/boundary-report-writing.md](../field-and-boundary/boundary-and-alta/boundary-report-writing.md)
- AI Project Companion: project upload (research memo as initial document)

## Common mistakes

- **Stopping the chain at one deed back.** 865 IAC 1-12 expects a research depth sufficient to identify senior rights; a single deed is rarely enough.
- **Trusting assessor parcel lines as record geometry.** Assessor maps are graphic, not survey-grade. Use them only for orientation.
- **Decoding the subject deed but not the adjoiners.** Conflicts hide on the other side of the line; you cannot find them without decoding both sides.
- **Ignoring recorded easements.** Easements move physical features that surveyors then mistake for boundary evidence. Decode them too.
- **Skipping the county surveyor.** Indiana county surveyors maintain section-corner tie sheets under IC 36-2-12-10. If you do not pull them, you are likely to remonument a corner that has an existing perpetuation record.

## Citations

- **865 IAC 1-12-7** — research scope for boundary surveys.
- **IC 36-2-11-12** — recorder's index obligations.
- **IC 36-2-12-10** — county surveyor section-corner records.
- **2021 ALTA/NSPS Section 5** — record documents to be reviewed.
- **County recorder GIS links** — surfaced through `get_jurisdiction_rules` for each of Marion + 7 surrounding counties.
