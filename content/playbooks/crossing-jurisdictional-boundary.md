---
title: "Crossing Jurisdictional Boundary"
section: "playbooks"
order: 80
visibility: public
tags: [playbook, jurisdiction, compare, multi-municipality, plat]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "IC 36-7-4 — Indiana Local Planning and Zoning"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-7-4
    verified: 2026-05-11
  - title: "IC 36-2-11-16.5 — Standards for Recorded Documents"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-2-11
    verified: 2026-05-11
  - title: "IDEM Rule 13 — Construction Stormwater (327 IAC 15-13)"
    url: https://www.in.gov/idem/stormwater/construction-stormwater-rule-13/
    verified: 2026-05-11
  - title: "865 IAC 1-12 — Indiana Standards of Practice"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Identify every jurisdiction the project polygon intersects: counties, municipalities, school districts (for assessment, not survey but useful), and special districts (drainage, conservancy, MS4).
> 2. Use the Jurisdiction Intelligence compare tool to produce a JurisdictionDelta: a side-by-side of the differing rules across the intersecting jurisdictions.
> 3. Resolve every delta with a written decision in the project package — usually "comply with the more restrictive rule" but not always — and reflect those decisions on the plat and in the surveyor's report.

## Phase 1 — Map every jurisdiction the polygon touches

Take the project polygon (boundary or development footprint) and run Jurisdiction Intelligence GPS lookup at several points around the perimeter and at the centroid. Confirm county, township, municipality, and any overlay districts. Cross-check against county GIS so that you see the corporate-limits line drawn explicitly.

- [content/jurisdictions/indiana/index.md](../jurisdictions/indiana/index.md)
- [content/field-and-boundary/coordinate-systems/index.md](../field-and-boundary/coordinate-systems/index.md)
- Jurisdiction Intelligence GPS lookup (multiple points per parcel)
- MCP `get_jurisdiction_rules` invoked once per identified jurisdiction

## Phase 2 — Build the JurisdictionDelta

Run Jurisdiction Intelligence compare with all identified jurisdictions selected. The JurisdictionDelta returns the rule blocks side-by-side: plat content, monumentation, signature blocks, recording format, stormwater triggers and methods, ROW classification, setback table, sidewalk requirements, drainage board approval requirements. Highlight every row where the rules differ.

- [content/field-and-boundary/professional-practice/subdivision-regulations.md](../field-and-boundary/professional-practice/subdivision-regulations.md)
- [content/engineering/stormwater/idem-rule-13.md](../engineering/stormwater/idem-rule-13.md)
- Jurisdiction Intelligence compare (returns JurisdictionDelta)
- MCP `get_jurisdiction_rules` called per jurisdiction for the underlying source data

## Phase 3 — Resolve deltas with written decisions

Each delta needs a written project decision. The default is to comply with the more restrictive rule, but there are exceptions: rules that apply only inside corporate limits, drainage rules tied to a watershed boundary rather than a corporate boundary, and rules that conflict outright. Document each decision with the source citation.

- [content/field-and-boundary/professional-practice/indiana-865-iac.md](../field-and-boundary/professional-practice/indiana-865-iac.md)
- [content/field-and-boundary/professional-practice/professional-liability.md](../field-and-boundary/professional-practice/professional-liability.md)
- [content/playbooks/prepare-plat-for-recording.md](prepare-plat-for-recording.md)

## Phase 4 — Configure the plat to satisfy all jurisdictions

The plat may need multiple signature blocks (one per municipality), multiple drainage statements, multiple stormwater computation summaries, and possibly multiple recording filings. Use Civil 3D viewport-and-sheet-set conventions to keep the plat on standard recorder-format pages.

- [content/civil3d/plan-production/index.md](../civil3d/plan-production/index.md)
- [content/field-and-boundary/professional-practice/survey-plat-preparation.md](../field-and-boundary/professional-practice/survey-plat-preparation.md)
- [content/field-and-boundary/legal-descriptions/basis-of-bearings.md](../field-and-boundary/legal-descriptions/basis-of-bearings.md)
- Civil 3D Power Pack LISP via MCP `get_lisp` (multi-signature block templates)

## Phase 5 — Run plat-check against each jurisdiction profile

The AI Project Companion plat-check supports a multi-jurisdiction profile: it runs the same draft plat against each jurisdiction's checklist and returns one flag report per. Resolve all flags; this is where deltas you tried to wave away get caught.

- AI Project Companion plat-check (multi-jurisdiction profile)
- MCP `get_jurisdiction_rules` (validate against the live checklist before final submission)

## Phase 6 — Coordinate parallel submissions

Plat may need to be filed with the county recorder once but reviewed by multiple plat committees. Stormwater may require sign-off from two MS4 entities. Coordinate the submission calendar so the more complex review goes first. Track approvals in the project record.

- [content/field-and-boundary/professional-practice/record-keeping.md](../field-and-boundary/professional-practice/record-keeping.md)
- Jurisdiction Intelligence checklist (submission contacts per jurisdiction)

## Common mistakes

- **Using a single GPS point to identify the jurisdiction.** Corporate boundaries cut through parcels; you need points across the polygon.
- **Assuming the more restrictive rule always governs.** It usually does, but watershed-based drainage rules and recorder-county rules are exceptions.
- **Sending the plat to one plat committee.** Both must see it if the polygon crosses the line.
- **Forgetting county-only signatures on a city-side parcel.** Drainage board and county surveyor signatures often apply regardless of municipal annexation.
- **Computing area in mixed units across phases.** Pick one (U.S. survey feet is standard in Indiana) and stay there.

## Citations

- **IC 36-7-4** — subdivision authority of cities, towns, and counties.
- **IC 36-2-11-16.5** — recording format that applies in every county.
- **327 IAC 15-13** — IDEM Rule 13, statewide but with MS4 overlays.
- **865 IAC 1-12** — applies across all Indiana jurisdictions to the survey itself.
- **County and municipal subdivision control ordinances** — pulled per jurisdiction via `get_jurisdiction_rules`.
