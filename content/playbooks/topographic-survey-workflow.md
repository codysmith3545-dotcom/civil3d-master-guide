---
title: "Topographic Survey Workflow"
section: "playbooks"
order: 40
visibility: public
tags: [playbook, topo, gnss, rtk, civil3d, surface]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "865 IAC 1-12-12 — Survey Accuracy Requirements"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "INDOT Indiana CORS (InCORS) Network"
    url: https://www.in.gov/indot/
    verified: 2026-05-11
  - title: "NGS Guidelines for RTK GNSS Surveys (NOAA Technical Memorandum NOS NGS 58)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS_58.pdf
    verified: 2026-05-11
  - title: "INDOT Design Manual, Chapter 28 — Survey"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Set primary control to better than 0.05 ft horizontal/vertical with redundant ties to published CORS or marks; topo accuracy is bounded by your control.
> 2. Pick up the site with a description-key-driven field code list so the data flows into Civil 3D as classified points and breaklines without hand-classification.
> 3. Build a TIN with breaklines, run topo QA-QC against accuracy class, and deliver the surface plus contours plus a topo plan to the scope the client agreed to.

## Phase 1 — Pre-survey planning and scope

Pull the project polygon, confirm jurisdiction (drainage triggers in particular), confirm vertical datum (almost always NAVD88 in Indiana but verify), and lock the topo accuracy class. Pre-survey planning saves more time than any other phase.

- [content/field-and-boundary/topographic-surveys/pre-survey-planning.md](../field-and-boundary/topographic-surveys/pre-survey-planning.md)
- [content/field-and-boundary/coordinate-systems/index.md](../field-and-boundary/coordinate-systems/index.md)
- Jurisdiction Intelligence GPS lookup + MCP `get_jurisdiction_rules`
- Calculator: [grid-to-ground](../../web/app/tools/grid-to-ground/page.tsx)

## Phase 2 — Site control with GNSS

Establish primary control using static or rapid-static GNSS on at least three points, tied to published NGS marks or InCORS. Adjust the control via least squares. Vertical control on level loops to project benchmarks where the topo will be relied on for hydraulics.

- [content/field-and-boundary/survey-equipment/gnss-rtk.md](../field-and-boundary/survey-equipment/gnss-rtk.md)
- [content/field-and-boundary/control-networks/gnss-static.md](../field-and-boundary/control-networks/gnss-static.md)
- [content/field-and-boundary/control-networks/least-squares-concepts.md](../field-and-boundary/control-networks/least-squares-concepts.md)
- [content/field-and-boundary/control-networks/level-networks.md](../field-and-boundary/control-networks/level-networks.md)
- Calculator: [level-loop](../../web/app/tools/level-loop/page.tsx)

## Phase 3 — Field data collection

Pick up the site with a data collector configured to your field-code conventions. Use the description-key set that maps to your Civil 3D template; otherwise expect to spend equal time classifying back at the office. Use breakline codes for ridges, swales, top/toe of bank, edge-of-pavement, and curb.

- [content/field-and-boundary/topographic-surveys/field-code-conventions.md](../field-and-boundary/topographic-surveys/field-code-conventions.md)
- [content/field-and-boundary/topographic-surveys/breakline-strategy.md](../field-and-boundary/topographic-surveys/breakline-strategy.md)
- [content/field-and-boundary/survey-equipment/data-collectors.md](../field-and-boundary/survey-equipment/data-collectors.md)
- [content/field-and-boundary/survey-equipment/total-station-setup.md](../field-and-boundary/survey-equipment/total-station-setup.md)

## Phase 4 — Import into Civil 3D

Transfer raw observations and the field-coded point file into Civil 3D. Use the survey database to process raw observations into adjusted points. Apply the description-key set so points are classified and styled on import. Apply linework code sets to draw figures and breaklines automatically.

- [content/civil3d/survey/importing-raw-observations.md](../civil3d/survey/importing-raw-observations.md)
- [content/civil3d/survey/linework-code-sets.md](../civil3d/survey/linework-code-sets.md)
- [content/civil3d/survey/figures-and-figure-prefixes.md](../civil3d/survey/figures-and-figure-prefixes.md)
- [content/civil3d/points/description-keys.md](../civil3d/points/description-keys.md)
- [content/civil3d/points/import-export-formats.md](../civil3d/points/import-export-formats.md)
- Civil 3D Power Pack LISP (description-key import macros) via MCP `get_lisp`

## Phase 5 — Build the surface

Create the TIN surface from the topo point group, add breaklines from the figures, add a hide boundary for buildings and any large planar features, and trim the surface to the project polygon. Set the contour style to the deliverable interval (typically 1 ft minor / 5 ft major for site work).

- [content/civil3d/surfaces/index.md](../civil3d/surfaces/index.md)
- [content/field-and-boundary/topographic-surveys/topo-qa-qc.md](../field-and-boundary/topographic-surveys/topo-qa-qc.md)
- Civil 3D Power Pack LISP (surface QA macros, contour smoothing helpers)

## Phase 6 — QA-QC and deliverable

Run the topo QA-QC routine: compare a held-out check-shot set against the surface elevation; spot contours for goose-egg artifacts; profile critical drainage lines and confirm they fall and do not pond. Produce the deliverable per scope (surface, contour plan, point file, ASCII XYZD export). Upload the deliverable to the AI Project Companion plat-check if it includes a sealed topo plan.

- [content/field-and-boundary/topographic-surveys/topo-qa-qc.md](../field-and-boundary/topographic-surveys/topo-qa-qc.md)
- [content/civil3d/plan-production/index.md](../civil3d/plan-production/index.md)
- AI Project Companion plat-check (for sealed topo plans)
- Calculator: [traverse-closure](../../web/app/tools/traverse-closure/page.tsx) (for any temporary traverses set during data collection)

## Common mistakes

- **Trusting RTK alone under canopy.** Multipath and intermittent fix produce slow, hard-to-detect errors. Use total station picks under trees.
- **Mismatching the field-code list and the Civil 3D description-key set.** This converts the topo from automation to manual labor. Maintain both as a paired pair.
- **Skipping the check-shot pass.** A topo without an independent check is unverifiable.
- **Using grid coordinates where ground is needed (or vice versa) without disclosure.** The basis must appear on the deliverable; the [grid-to-ground calculator](../../web/app/tools/grid-to-ground/page.tsx) makes the conversion explicit.
- **Letting contours run through buildings.** Add building hide boundaries before issuing the plan.

## Citations

- **865 IAC 1-12-12** — accuracy requirements applicable to topographic work that supports a boundary determination.
- **INDOT Design Manual Chapter 28** — topographic survey accuracy class definitions for INDOT projects.
- **NOAA NGS Technical Memorandum NOS NGS 58** — guidelines for RTK GNSS observations.
- **NCS v6** — survey/topo layering for plan-set deliverables.
