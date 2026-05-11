---
title: "Monument Restoration (PLSS)"
section: "playbooks"
order: 70
visibility: public
tags: [playbook, plss, monument, section-corner, restoration, indiana]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "BLM Manual of Surveying Instructions 2009"
    url: https://www.blm.gov/sites/default/files/documents/Manual-Of-Surveying-Instructions-2009.pdf
    verified: 2026-05-11
  - title: "IC 36-2-12-10 — Indiana County Surveyor Section-Corner Perpetuation"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-2-12
    verified: 2026-05-11
  - title: "865 IAC 1-12-22 — Indiana Standards for Section Corner Records"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "Indiana Section Corner Perpetuation Fund Program"
    url: https://www.in.gov/dlgf/4926.htm
    verified: 2026-05-11
---

> **TL;DR**
> 1. Restoration is evidence work first and computation second; pull every tie sheet, deed reference, and adjoiner survey that touches the corner before mobilizing.
> 2. Walk the BLM Manual hierarchy: existing original monuments, accessories, collateral evidence, then proportional measurement; do not jump straight to proportioning.
> 3. Set a permanent monument per 865 IAC 1-12-22, file the section-corner tie sheet with the county surveyor under IC 36-2-12-10, and update the surveyor's report so future retracements have your evidence.

## Phase 1 — Pull all prior evidence on the corner

Pull the county surveyor's existing tie sheet (if any), the original GLO field notes (Bureau of Land Management plats), every recorded survey within the surrounding sections that ties the corner, and every deed in the affected sections. Decode each instrument's calls that reference the corner.

- [content/field-and-boundary/monuments-and-evidence/section-corner-evidence.md](../field-and-boundary/monuments-and-evidence/section-corner-evidence.md)
- [content/field-and-boundary/advanced-boundary/plss-corner-restoration.md](../field-and-boundary/advanced-boundary/plss-corner-restoration.md)
- [content/field-and-boundary/legal-descriptions/plss-descriptions.md](../field-and-boundary/legal-descriptions/plss-descriptions.md)
- Deed Decoder + MCP `decode_deed` for each adjoiner deed referencing the corner
- Jurisdiction Intelligence checklist (county surveyor link + perpetuation fund process)

## Phase 2 — Establish search control

Set GNSS or traverse control good enough to support sub-tenth searching across a quarter-section. Tie any existing corners in adjacent sections so you have a redundant geometric framework. Compute predicted positions for the missing corner from every source you have.

- [content/field-and-boundary/survey-equipment/gnss-rtk.md](../field-and-boundary/survey-equipment/gnss-rtk.md)
- [content/field-and-boundary/control-networks/gnss-static.md](../field-and-boundary/control-networks/gnss-static.md)
- [content/field-and-boundary/control-networks/accuracy-standards.md](../field-and-boundary/control-networks/accuracy-standards.md)
- Calculator: [traverse-closure](../../web/app/tools/traverse-closure/page.tsx)
- Civil 3D Power Pack LISP (proportionate measurement helper) via MCP `get_lisp`

## Phase 3 — Field search by evidence hierarchy

Walk the BLM hierarchy in order. (1) Existing original monument: dig within the predicted position. (2) Accessories: bearing trees, accessory stones, mounds described in original field notes. (3) Collateral evidence: fences, occupation, adjoining surveys. (4) Proportionate measurement as a last resort. Document every dig with photos and a description, even negative results.

- [content/field-and-boundary/monuments-and-evidence/hierarchy-of-evidence.md](../field-and-boundary/monuments-and-evidence/hierarchy-of-evidence.md)
- [content/field-and-boundary/monuments-and-evidence/monument-types.md](../field-and-boundary/monuments-and-evidence/monument-types.md)
- [content/field-and-boundary/monuments-and-evidence/disturbed-monuments.md](../field-and-boundary/monuments-and-evidence/disturbed-monuments.md)
- [content/field-and-boundary/advanced-boundary/common-boundary-disputes.md](../field-and-boundary/advanced-boundary/common-boundary-disputes.md)

## Phase 4 — Restore and monument

Once the restored position is decided, set a permanent monument that meets 865 IAC 1-12-22 (typically a cast iron monument or aluminum cap on a long iron rod, marked with the surveyor's license number). Tie at minimum four accessories (trees, bolts in pavement, drill holes in concrete) with bearings and distances suitable for re-recovery.

- [content/field-and-boundary/monuments-and-evidence/monument-documentation.md](../field-and-boundary/monuments-and-evidence/monument-documentation.md)
- [content/field-and-boundary/professional-practice/minimum-technical-standards.md](../field-and-boundary/professional-practice/minimum-technical-standards.md)
- Civil 3D Power Pack LISP (corner-tie-sheet macro) via MCP `get_lisp`

## Phase 5 — File the tie sheet and update the public record

Prepare the section-corner tie sheet per the county surveyor's required format (Indiana counties differ; pull the template via Jurisdiction Intelligence). File with the county surveyor under IC 36-2-12-10 and, if applicable, claim from the Indiana Section Corner Perpetuation Fund. Upload the tie sheet plus the surveyor's report to the AI Project Companion so the record is part of the project's permanent archive.

- [content/field-and-boundary/monuments-and-evidence/surveyors-report-indiana.md](../field-and-boundary/monuments-and-evidence/surveyors-report-indiana.md)
- [content/field-and-boundary/professional-practice/record-keeping.md](../field-and-boundary/professional-practice/record-keeping.md)
- MCP `get_jurisdiction_rules` for the county's tie-sheet format
- AI Project Companion (project upload of the tie sheet + report)

## Phase 6 — Integrate into the parent project (5A/5B)

If the restoration was performed in support of a boundary or ALTA survey, fold the restored corner back into the parent project, update parcel geometry, refresh dependent parcel labels, and re-run the parent project's plat-check.

- [content/playbooks/boundary-survey-from-scratch.md](boundary-survey-from-scratch.md)
- [content/playbooks/alta-nsps-land-title-survey.md](alta-nsps-land-title-survey.md)
- AI Project Companion plat-check (re-run on the parent project)

## Common mistakes

- **Jumping to proportionate measurement.** The BLM Manual is explicit about the order; proportion only after original monuments, accessories, and collateral evidence have been exhausted.
- **Failing to dig deep enough.** Original monuments can be 18 in to 36 in below grade, especially in cultivated land. Use a probe and a metal detector.
- **Setting an undersized monument.** Section corners are intended to last centuries; use a monument that matches that intent.
- **Forgetting to file the tie sheet.** A restoration that is not perpetuated in the public record will be redone by the next surveyor.
- **Holding a fence as collateral evidence without documenting age or origin.** A 20-year-old fence is not section-corner evidence; document the why.

## Citations

- **BLM Manual of Surveying Instructions 2009** — Chapter V (restoration of lost or obliterated corners).
- **IC 36-2-12-10** — county surveyor perpetuation duty.
- **865 IAC 1-12-22** — monument standards for section corners.
- **Indiana Section Corner Perpetuation Fund** — reimbursement program rules.
- **NCS v6** — survey/monumentation layering used on the deliverable plat.
