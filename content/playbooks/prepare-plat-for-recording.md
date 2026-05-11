---
title: "Prepare Plat for Recording"
section: "playbooks"
order: 30
visibility: public
tags: [playbook, plat, recording, county-recorder, plat-check]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "865 IAC 1-12-18 — Plat Content Requirements"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "IC 36-2-11-16.5 — Standards for Recorded Documents (Indiana)"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-2-11
    verified: 2026-05-11
  - title: "IC 36-7-3-7 — Plat Approval and Recording"
    url: https://iga.in.gov/laws/2024/ic/titles/36#36-7-3
    verified: 2026-05-11
  - title: "National CAD Standard v6 — AIA Layer Naming"
    url: https://www.nationalcadstandard.org/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Load the jurisdiction checklist for the county and municipality before opening the drawing; recording-format rules differ in margin, sheet size, font, and signature placement.
> 2. Build the plat in Civil 3D against the National CAD Standard layer naming for survey and use parcel labels for the metes-and-bounds; never hand-type a description on a recording-ready plat.
> 3. Run the AI Project Companion plat-check loop until clean, then proceed to seal, signatures, and county-recorder submission.

## Phase 1 — Load jurisdiction recording rules

The first action is to pull the recording-format rules for the recording county. Indiana counties broadly follow IC 36-2-11-16.5 (margins, page size, font, paper or media), but municipalities and the county plat committee can impose extras: notarization, soil-and-water district signatures, drainage board signatures, planning department certification.

- [content/field-and-boundary/professional-practice/survey-plat-preparation.md](../field-and-boundary/professional-practice/survey-plat-preparation.md)
- [content/field-and-boundary/professional-practice/subdivision-regulations.md](../field-and-boundary/professional-practice/subdivision-regulations.md)
- Jurisdiction Intelligence checklist + MCP `get_jurisdiction_rules` (returns plat_requirements block per county)
- [content/jurisdictions/indiana/index.md](../jurisdictions/indiana/index.md)

## Phase 2 — Set up the drawing to standards

Open the Civil 3D template that matches your firm and reset layer state to the National CAD Standard layering for survey and boundary. Set drawing units to U.S. survey feet and the coordinate system to the published State Plane Indiana zone for the project. Use the Civil 3D Power Pack monumentation and line/curve table routines instead of hand-built tables.

- [content/standards/cad-layer-standards/index.md](../standards/cad-layer-standards/index.md)
- [content/civil3d/fundamentals/index.md](../civil3d/fundamentals/index.md)
- [content/customization/templates-and-kits/index.md](../customization/templates-and-kits/index.md)
- [content/customization/lisp/useful-routines-index.md](../customization/lisp/useful-routines-index.md)
- Calculator: [state-plane-indiana](../../web/app/tools/state-plane-indiana/page.tsx) for grid/ground checks
- MCP `get_lisp` to retrieve the monumentation-label and line-curve-table routines

## Phase 3 — Build the plat content

Drive every dimension off the parcel geometry. Use parcel labels to generate the metes-and-bounds. Use a description key set so monument symbols come from data. Place the surveyor's report, basis-of-bearings note, legend, scale, north arrow, and signature/seal block per the jurisdiction's plat-content checklist.

- [content/civil3d/parcels/parcel-labels.md](../civil3d/parcels/parcel-labels.md)
- [content/civil3d/parcels/legal-descriptions-from-parcels.md](../civil3d/parcels/legal-descriptions-from-parcels.md)
- [content/civil3d/points/description-keys.md](../civil3d/points/description-keys.md)
- [content/field-and-boundary/legal-descriptions/basis-of-bearings.md](../field-and-boundary/legal-descriptions/basis-of-bearings.md)
- [content/field-and-boundary/monuments-and-evidence/surveyors-report-indiana.md](../field-and-boundary/monuments-and-evidence/surveyors-report-indiana.md)

## Phase 4 — Plat-check loop

Export a PDF of the draft plat and upload it to the AI Project Companion plat-check. The pipeline parses the plat against the jurisdictional checklist and 865 IAC 1-12-18 plat-content rules and returns a flag list: missing item, suspect item, recommendation. Fix every flagged item, re-export, re-upload, and repeat until the run is clean. Save the final report in the project record.

- [content/field-and-boundary/professional-practice/record-keeping.md](../field-and-boundary/professional-practice/record-keeping.md)
- AI Project Companion: project upload + plat-check
- MCP `get_jurisdiction_rules` to verify the checklist used by plat-check matches the current recorded version

## Phase 5 — Seal, sign, and submit

Apply the surveyor's seal and signature per 865 IAC 1-12. If any other licensees signed (engineer, drainage, planning), confirm their signatures and dates. Submit through the county recorder e-filing portal where available; otherwise prepare paper originals on the recorder-approved media. File section-corner tie sheets with the county surveyor in parallel.

- [content/field-and-boundary/monuments-and-evidence/monument-documentation.md](../field-and-boundary/monuments-and-evidence/monument-documentation.md)
- [content/field-and-boundary/professional-practice/indiana-865-iac.md](../field-and-boundary/professional-practice/indiana-865-iac.md)
- County recorder portals linked through `get_jurisdiction_rules`

## Plat-check loop

The plat-check loop deserves its own callout because most teams under-use it. The AI Project Companion runs three passes on a draft plat upload:

1. **Format pass** — page size, margins, font compliance, signature/seal block presence.
2. **Content pass** — 865 IAC 1-12-18 items, jurisdiction-specific additions, basis-of-bearings, monumentation table, legend, scale, north arrow.
3. **Consistency pass** — parcel area on the plat vs the parcel object, metes-and-bounds vs parcel labels, monumentation table vs the points referenced in the geometry.

Run the loop at least twice. The second run frequently catches issues induced by the fixes from the first run.

## Common mistakes

- **Hand-typing the metes-and-bounds description.** Drift from the drawn geometry is almost guaranteed. Use parcel labels and the [Metes and Bounds calculator](../../web/app/tools/metes-and-bounds/page.tsx) for a closure check.
- **Skipping the recorder format rules.** A non-conforming margin or font gets the plat rejected at the counter.
- **Forgetting concurrent submissions.** In Indiana you typically need to file with the recorder, the county surveyor (tie sheets), and sometimes the plat committee on the same business cycle.
- **Using a stale jurisdiction checklist.** Counties update plat-content rules; pull the checklist live via MCP rather than relying on a cached copy from a prior project.
- **Sealing before plat-check passes clean.** A sealed plat with a missing item is an avoidable liability hit; the few minutes the plat-check takes are worth it.

## Citations

- **865 IAC 1-12-18** — plat content for boundary surveys.
- **865 IAC 1-12-25** — surveyor's report.
- **IC 36-2-11-16.5** — Indiana standards for recorded documents (margins, page size, font).
- **IC 36-7-3-7** — plat approval and recording.
- **NCS v6** — AIA layer naming for boundary, monumentation, and survey annotation.
- **2021 ALTA/NSPS** — Sections 5 and 6 where the plat is recorded for an ALTA survey.
