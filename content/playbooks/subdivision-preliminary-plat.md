---
title: "Subdivision Preliminary Plat"
section: "playbooks"
order: 50
visibility: public
tags: [playbook, subdivision, preliminary-plat, stormwater, lotting]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "IC 36-7-4 — Indiana Local Planning and Zoning (subdivision)"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-7-4
    verified: 2026-05-11
  - title: "IDEM Rule 13 (327 IAC 15-13) — Construction Stormwater"
    url: https://www.in.gov/idem/stormwater/construction-stormwater-rule-13/
    verified: 2026-05-11
  - title: "INDOT Design Manual, Chapter 46 — Drainage Design"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
  - title: "865 IAC 1-12-18 — Plat Content"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Use Jurisdiction Intelligence to load the subdivision regulations, stormwater triggers, setback table, and ROW classification for the municipality and county at once; preliminary plats live or die on the local rules.
> 2. Draw lots in Civil 3D parcels with parcel sizing tools, lay out ROW with alignments and offsets, and tag each lot with a numbering scheme that survives recording.
> 3. Build the monumentation table from the parcel geometry and run the plat-check loop before submitting to plat committee.

## Phase 1 — Jurisdiction intake

A preliminary plat is governed by overlapping rules: county subdivision control, municipal zoning, stormwater rules (state plus MS4 plus local), and right-of-way classification (county highway, INDOT, municipal). Pull all four in one pass.

- [content/field-and-boundary/professional-practice/subdivision-regulations.md](../field-and-boundary/professional-practice/subdivision-regulations.md)
- [content/engineering/stormwater/idem-rule-13.md](../engineering/stormwater/idem-rule-13.md)
- [content/jurisdictions/indiana/index.md](../jurisdictions/indiana/index.md)
- MCP `get_jurisdiction_rules` (returns the subdivision + stormwater + ROW + setback blocks)
- Jurisdiction Intelligence compare (for sites near a city/county boundary)

## Phase 2 — Drainage and stormwater triggers

Determine disturbed area, land cover changes, and whether the project triggers IDEM Rule 13 and the local MS4 stormwater ordinance. Compute the design storm (often 10-year or 100-year per local rule). Size detention/retention with the local methodology. The stormwater outcome shapes lotting more than any aesthetic decision.

- [content/engineering/stormwater/scs-curve-number.md](../engineering/stormwater/scs-curve-number.md)
- [content/engineering/stormwater/rational-method-and-tc.md](../engineering/stormwater/rational-method-and-tc.md)
- [content/engineering/stormwater/detention-sizing.md](../engineering/stormwater/detention-sizing.md)
- [content/engineering/stormwater/indiana-idf-curves.md](../engineering/stormwater/indiana-idf-curves.md)
- Calculator: [rational-method](../../web/app/tools/rational-method/page.tsx)
- Calculator: [mannings](../../web/app/tools/mannings/page.tsx)

## Phase 3 — ROW, setbacks, and lot layout

Lay out the public ROW first (alignment + offsets), apply the setback envelope from the zoning code per Jurisdiction Intelligence, then place parcels inside the buildable envelope. Use parcel sizing to test lot frontage, depth, and minimum area against the code without manual iteration.

- [content/civil3d/alignments/index.md](../civil3d/alignments/index.md)
- [content/civil3d/parcels/creating-parcels.md](../civil3d/parcels/creating-parcels.md)
- [content/civil3d/parcels/parcel-sizing.md](../civil3d/parcels/parcel-sizing.md)
- [content/field-and-boundary/easements-and-row/index.md](../field-and-boundary/easements-and-row/index.md)
- Civil 3D Power Pack LISP (lot-numbering and lot-line-label macros) via MCP `get_lisp`

## Phase 4 — Monumentation plan and lot numbering

Plan monumentation per 865 IAC 1-12 and the local plat ordinance: external boundary corners, block corners, lot corners, ROW intersection monuments. Lay out lot numbering in a sequence that survives future re-platting. Generate the monumentation table from the geometry rather than hand-keying it.

- [content/field-and-boundary/monuments-and-evidence/monument-types.md](../field-and-boundary/monuments-and-evidence/monument-types.md)
- [content/field-and-boundary/monuments-and-evidence/monument-documentation.md](../field-and-boundary/monuments-and-evidence/monument-documentation.md)
- [content/civil3d/parcels/parcel-labels.md](../civil3d/parcels/parcel-labels.md)
- Civil 3D Power Pack LISP (monumentation table generator) via MCP `get_lisp`

## Phase 5 — Plat content and plat-check

Build the preliminary plat with title block, north arrow, basis of bearings, scale, legend, lot dimensions, ROW dimensions, easements, the monumentation table, and the surveyor's certification. Submit to the plat-check loop before the plat committee deadline.

- [content/field-and-boundary/professional-practice/survey-plat-preparation.md](../field-and-boundary/professional-practice/survey-plat-preparation.md)
- [content/field-and-boundary/legal-descriptions/basis-of-bearings.md](../field-and-boundary/legal-descriptions/basis-of-bearings.md)
- AI Project Companion plat-check (preliminary plat profile)
- Calculator: [area-by-coordinates](../../web/app/tools/area-by-coordinates/page.tsx) for lot area reconciliation

## Phase 6 — Plat committee iteration

Plat committees almost always come back with comments. Use Jurisdiction Intelligence to confirm whether comments are advisory or binding. Update geometry, refresh parcel labels, re-run plat-check, re-submit.

- [content/field-and-boundary/professional-practice/subdivision-regulations.md](../field-and-boundary/professional-practice/subdivision-regulations.md)
- MCP `get_jurisdiction_rules` (each county varies on committee authority)
- AI Project Companion plat-check (re-run after each revision)

## Common mistakes

- **Designing stormwater after lots are locked in.** You end up taking the smallest lot for the basin. Run stormwater concurrently with lotting from day one.
- **Using a setback table from the wrong municipality.** The Jurisdiction Intelligence compare tool exists for this reason.
- **Hand-keying the monumentation table.** Drift between table and geometry is a plat-check fail.
- **Numbering lots clockwise from the southeast on a site that already has phase 1 lots numbered counter-clockwise.** Carry numbering convention forward across phases.
- **Forgetting the soil-and-water district signature.** In several Indiana counties this signature is on the recordable plat; pull the jurisdictional checklist early.

## Citations

- **IC 36-7-4** — subdivision control authority and plat content.
- **327 IAC 15-13** — IDEM Rule 13 construction stormwater.
- **INDOT Design Manual Chapter 46** — drainage design where INDOT facilities are downstream.
- **865 IAC 1-12-18** — plat content for the surveyor's portion.
- **Local subdivision control ordinance** — pulled by `get_jurisdiction_rules` for the exact municipality.
