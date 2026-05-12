---
title: "Boundary Survey From Scratch"
section: "playbooks"
order: 10
visibility: public
tags: [playbook, boundary, retracement, civil3d, deed-decoder]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "865 IAC 1-12 — Indiana Standards of Practice for Surveying"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "IC 25-21.5 — Indiana Professional Surveyors Act"
    url: https://iga.in.gov/laws/2024/ic/titles/25#25-21.5
    verified: 2026-05-11
  - title: "2021 ALTA/NSPS Minimum Standard Detail Requirements"
    url: https://www.nsps.us.com/page/ALTAACSM
    verified: 2026-05-11
  - title: "Indiana County Surveyor — Section Corner Tie Sheets (IC 36-2-12-10)"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-2-12
    verified: 2026-05-11
---

> **TL;DR**
> 1. Receive the deed, decode it, and check closure before you ever set a tripod; a description that does not close is the single biggest signal that your field problem is going to be harder than the client thinks.
> 2. Use Jurisdiction Intelligence to load the rules that govern the parcel, then run the survey to 865 IAC 1-12 minimum technical standards, holding the senior call hierarchy from your retracement analysis.
> 3. Produce a Civil 3D plat (parcels, labels, monumentation, surveyor's report) and run the AI Project Companion plat-check before sealing.

## Phase 1 — Receive and decode the deed

The deed is the starting evidence and also the first piece of QA you owe the project. Open the document, transcribe the metes-and-bounds calls, and run them through the Deed Decoder. The decoder returns a closure report, a sketch, and flags ambiguous calls (passing calls, blank curve data, missing point of beginning). Anything that does not close inside 1:5,000 needs an explanation in your project notes before fieldwork starts.

- [content/field-and-boundary/legal-descriptions/index.md](../field-and-boundary/legal-descriptions/index.md)
- [content/field-and-boundary/legal-descriptions/writing-metes-and-bounds.md](../field-and-boundary/legal-descriptions/writing-metes-and-bounds.md)
- [content/field-and-boundary/legal-descriptions/call-priority.md](../field-and-boundary/legal-descriptions/call-priority.md)
- Deed Decoder web tool and MCP `decode_deed`
- Calculator: [Metes and Bounds writer](../../web/app/tools/metes-and-bounds/page.tsx)

## Phase 2 — Pull jurisdiction rules and adjoiner records

Before the crew rolls, ask Jurisdiction Intelligence which county, township, and municipality the parcel falls in (GPS lookup), then pull the jurisdictional checklist via MCP `get_jurisdiction_rules`. In Indiana, also pull the county surveyor's section corner tie sheets for any controlling PLSS corners. Decode every adjoiner deed; junior/senior rights you miss here cost you a remonumentation later.

- [content/jurisdictions/indiana/index.md](../jurisdictions/indiana/index.md)
- [content/field-and-boundary/monuments-and-evidence/section-corner-evidence.md](../field-and-boundary/monuments-and-evidence/section-corner-evidence.md)
- [content/field-and-boundary/boundary-and-alta/senior-and-junior-rights.md](../field-and-boundary/boundary-and-alta/senior-and-junior-rights.md)
- Jurisdiction Intelligence GPS lookup + MCP `get_jurisdiction_rules`
- Deed Decoder (one pass per adjoiner)

## Phase 3 — Field traverse and monument recovery

Set control to 865 IAC 1-12 standards: angular closure under 10 seconds times the square root of n, linear closure 1:15,000 or better. Recover monuments along the way and document each in field notes (type, condition, position relative to record). Tie all PLSS corners that control. Photograph found monuments and capture tie sheets per IC 36-2-12-10 when the county surveyor's record is incomplete.

- [content/field-and-boundary/professional-practice/minimum-technical-standards.md](../field-and-boundary/professional-practice/minimum-technical-standards.md)
- [content/field-and-boundary/monuments-and-evidence/monument-documentation.md](../field-and-boundary/monuments-and-evidence/monument-documentation.md)
- [content/field-and-boundary/survey-equipment/total-station-setup.md](../field-and-boundary/survey-equipment/total-station-setup.md)
- [content/field-and-boundary/survey-equipment/gnss-rtk.md](../field-and-boundary/survey-equipment/gnss-rtk.md)
- Calculator: [traverse-closure](../../web/app/tools/traverse-closure/page.tsx)

## Phase 4 — Adjustment and boundary resolution

Reduce the field data, run a least-squares adjustment, then resolve the boundary against the hierarchy of evidence: senior rights, monuments called for, monuments found, record courses, area. Document each resolution decision in plain prose. If you held a found monument over a record call, write down why. The MCP `decode_deed` tool can return ideal coordinates from the deed so you can quickly compute deltas between record and held positions.

- [content/field-and-boundary/control-networks/least-squares-concepts.md](../field-and-boundary/control-networks/least-squares-concepts.md)
- [content/field-and-boundary/monuments-and-evidence/hierarchy-of-evidence.md](../field-and-boundary/monuments-and-evidence/hierarchy-of-evidence.md)
- [content/field-and-boundary/boundary-and-alta/retracement-methodology.md](../field-and-boundary/boundary-and-alta/retracement-methodology.md)
- Civil 3D Power Pack LISP routines via MCP `get_lisp` (e.g. inverse routines, monument-label macros)
- Calculator: [area-by-coordinates](../../web/app/tools/area-by-coordinates/page.tsx)

## Phase 5 — Civil 3D plat production

Bring the adjusted points into Civil 3D, create parcels in a site that matches the resolved geometry, apply the surveyor's report point group and monument styles, and label per the jurisdiction's plat-content checklist. Use parcel labels to generate the metes-and-bounds description and write it back to the [Metes and Bounds calculator](../../web/app/tools/metes-and-bounds/page.tsx) to verify closure to the same tolerance you required of the source deed.

- [content/civil3d/parcels/creating-parcels.md](../civil3d/parcels/creating-parcels.md)
- [content/civil3d/parcels/legal-descriptions-from-parcels.md](../civil3d/parcels/legal-descriptions-from-parcels.md)
- [content/civil3d/points/description-keys.md](../civil3d/points/description-keys.md)
- [content/civil3d/plan-production/index.md](../civil3d/plan-production/index.md)
- Civil 3D Power Pack routines (monument labels, line/curve table generator)

## Phase 6 — Plat-check and seal

Upload the draft plat to the AI Project Companion. The plat-check pipeline scans against the loaded jurisdiction checklist plus 865 IAC 1-12 plat content rules: north arrow with basis of bearings, scale, legend, surveyor's report, monumentation table, signature block. Fix every flagged item, re-run the check, and only then apply the digital seal. File the section-corner tie sheets with the county surveyor on the same trip you record the plat.

- [content/field-and-boundary/professional-practice/survey-plat-preparation.md](../field-and-boundary/professional-practice/survey-plat-preparation.md)
- [content/field-and-boundary/monuments-and-evidence/surveyors-report-indiana.md](../field-and-boundary/monuments-and-evidence/surveyors-report-indiana.md)
- AI Project Companion: project upload + plat-check

## Common mistakes

- **Skipping the deed-decode step.** Surveyors who go to the field with an unread description discover the description does not close on a Friday afternoon. Always decode first.
- **Failing to pull jurisdiction rules.** Indiana counties differ on signature blocks, monumentation, and recording media. Use Jurisdiction Intelligence on day zero, not after the plat is drafted.
- **Holding a found monument without explaining why.** If you depart from a record call, the surveyor's report must say so. The plat-check will flag a silent override.
- **Mixing CORS-derived coordinates with traverse without basis-of-bearings reconciliation.** Pick one basis and disclose it on the plat per the [basis-of-bearings page](../field-and-boundary/legal-descriptions/basis-of-bearings.md).
- **Computing area to four decimals on a 1:15,000 closure.** Precision must match accuracy. Use the [area-by-coordinates](../../web/app/tools/area-by-coordinates/page.tsx) calculator and round to the level the standard supports.

## Citations

- **865 IAC 1-12** — Section 12 (boundary survey accuracy), Section 18 (plat content), Section 25 (surveyor's report).
- **IC 25-21.5-1-7** — definition of surveying.
- **IC 36-2-12-10** — Indiana County Surveyor section-corner perpetuation duties.
- **2021 ALTA/NSPS** — Section 3.E (boundary monumentation), Section 5 (plat content).
- **NCS v6** — Layer naming for boundary, monumentation, and survey annotation.
