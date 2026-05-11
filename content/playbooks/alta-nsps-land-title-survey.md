---
title: "ALTA/NSPS Land Title Survey"
section: "playbooks"
order: 60
visibility: public
tags: [playbook, alta, nsps, title-survey, table-a, schedule-b]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "2021 Minimum Standard Detail Requirements for ALTA/NSPS Land Title Surveys"
    url: https://www.nsps.us.com/page/ALTAACSM
    verified: 2026-05-11
  - title: "865 IAC 1-12 — Indiana Standards of Practice"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "FEMA Flood Map Service Center"
    url: https://msc.fema.gov/portal/home
    verified: 2026-05-11
  - title: "ALTA Endorsement Forms (American Land Title Association)"
    url: https://www.alta.org/policy-forms/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Scope Table A items in writing with the client and title company before fieldwork; every item adds time, certifications, and liability.
> 2. Run record research, decode the title commitment's Schedule B-II exceptions and Schedule A legal description through the Deed Decoder, and field-locate every easement and encroachment that the title work flagged.
> 3. Deliver the plat against the 2021 ALTA/NSPS standard with the certification block exactly as required, run plat-check, then issue.

## Phase 1 — Scope Table A and Schedule B-II

Confirm the Table A items in writing. Items 1, 2, 3, 4, and 11 are nearly always selected; items 5 (vertical relief), 6 (zoning), 11 (utilities), 13 (utility provider names), 16 (recent earth moving), 17 (proposed changes), and 19 (offsite easements) are the most negotiated. Pull the title commitment and decode Schedule B-II exceptions one by one.

- [content/standards/alta-nsps/structure.md](../standards/alta-nsps/structure.md)
- [content/standards/alta-nsps/table-a.md](../standards/alta-nsps/table-a.md)
- [content/standards/alta-nsps/certification.md](../standards/alta-nsps/certification.md)
- [content/field-and-boundary/boundary-and-alta/title-commitment-review.md](../field-and-boundary/boundary-and-alta/title-commitment-review.md)
- Deed Decoder + MCP `decode_deed` for each Schedule B-II easement

## Phase 2 — Record research and adjoiner work

Follow the [record research pre-field playbook](record-research-pre-field.md). For ALTA work the bar is higher: the surveyor must show that record documents per Section 5 were reviewed, even those that turned out not to govern.

- [content/playbooks/record-research-pre-field.md](record-research-pre-field.md)
- [content/field-and-boundary/boundary-and-alta/alta-nsps-overview.md](../field-and-boundary/boundary-and-alta/alta-nsps-overview.md)
- [content/field-and-boundary/boundary-and-alta/senior-and-junior-rights.md](../field-and-boundary/boundary-and-alta/senior-and-junior-rights.md)
- Jurisdiction Intelligence checklist (for jurisdictional add-ons to ALTA, e.g., Indiana surveyor's report)

## Phase 3 — Field locate Table A items and exceptions

Run a coordinated field session that captures boundary, monuments, building footprints, ROW improvements, visible utilities, observed evidence of easements (manholes, valves, poles), parking counts and types if scoped, flood-zone reference points, and any physical evidence of Schedule B-II exceptions. Use the same field-code conventions as your topo work.

- [content/field-and-boundary/boundary-and-alta/alta-nsps-checklist.md](../field-and-boundary/boundary-and-alta/alta-nsps-checklist.md)
- [content/field-and-boundary/topographic-surveys/field-code-conventions.md](../field-and-boundary/topographic-surveys/field-code-conventions.md)
- [content/field-and-boundary/survey-equipment/total-station-setup.md](../field-and-boundary/survey-equipment/total-station-setup.md)
- Calculator: [traverse-closure](../../web/app/tools/traverse-closure/page.tsx)
- Calculator: [area-by-coordinates](../../web/app/tools/area-by-coordinates/page.tsx)

## Phase 4 — Analyze encroachments and easements

Plot every easement from Schedule B-II against the located improvements. Flag encroachments in both directions: improvements over a recorded easement, and improvements that cross the property line. Note unrecorded easements implied by visible utility evidence.

- [content/field-and-boundary/easements-and-row/index.md](../field-and-boundary/easements-and-row/index.md)
- [content/field-and-boundary/boundary-and-alta/pincushion-and-adjoiners.md](../field-and-boundary/boundary-and-alta/pincushion-and-adjoiners.md)
- [content/field-and-boundary/advanced-boundary/common-boundary-disputes.md](../field-and-boundary/advanced-boundary/common-boundary-disputes.md)
- Civil 3D Power Pack LISP via MCP `get_lisp` (easement-plotting macros)

## Phase 5 — Build the ALTA plat

Build the plat in Civil 3D with the parcel as the boundary, building footprints as a polyline group, easements as a separate layer set, and a Table A response block that addresses every selected item. Include the certification block exactly as the 2021 standard prescribes; the certification language is not optional and not the place for creativity.

- [content/standards/alta-nsps/structure.md](../standards/alta-nsps/structure.md)
- [content/standards/alta-nsps/alta-traps.md](../standards/alta-nsps/alta-traps.md)
- [content/civil3d/parcels/parcel-labels.md](../civil3d/parcels/parcel-labels.md)
- [content/civil3d/plan-production/index.md](../civil3d/plan-production/index.md)

## Phase 6 — Plat-check, certification, delivery

Run the plat-check with the ALTA profile. Confirm Schedule A legal matches what is on the plat. Confirm the certification names match the parties from the title commitment. Apply seal, sign, issue under cover letter to title company and client.

- [content/standards/alta-nsps/state-overlays.md](../standards/alta-nsps/state-overlays.md)
- [content/field-and-boundary/professional-practice/working-with-title-companies.md](../field-and-boundary/professional-practice/working-with-title-companies.md)
- AI Project Companion plat-check (ALTA profile)

## Common mistakes

- **Certifying to parties not in the title commitment.** The certification block is binding; verify every name.
- **Reporting a Schedule B-II exception "not plottable" without trying.** The standard requires a good-faith effort to plot every exception that has any geometric content.
- **Mixing flood-zone effective dates.** Always cite the effective FIRM panel and date on the plat.
- **Skipping the Indiana surveyor's report on an ALTA where the boundary changed.** State overlay still applies even with ALTA certification.
- **Holding a found monument silently in the ALTA narrative.** The narrative must explain every departure from record.

## Citations

- **2021 ALTA/NSPS** — Sections 3 (research), 5 (fieldwork), 6 (plat content), 7 (certification), Table A.
- **865 IAC 1-12-25** — Indiana surveyor's report.
- **FEMA FIRM** — flood-zone reference for Table A item 3.
- **ALTA endorsement forms** — for endorsements that drive specific Table A items (e.g., 9.2 zoning).
- **NCS v6** — layer naming used for the ALTA deliverable.
