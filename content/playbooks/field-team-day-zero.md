---
title: "Field Team Day Zero"
section: "playbooks"
order: 90
visibility: public
tags: [playbook, field-team, calibration, control, mobilization]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
sources:
  - title: "865 IAC 1-12 — Indiana Standards of Practice for Surveying"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-11
  - title: "NGS Guidelines for RTK GNSS Surveys (NOAA Technical Memorandum NOS NGS 58)"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS_58.pdf
    verified: 2026-05-11
  - title: "INDOT Design Manual, Chapter 28 — Survey"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
  - title: "Trimble / Leica / Topcon Equipment Operations Manuals"
    url: https://www.trimble.com/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Verify equipment is in calibration, batteries are charged, firmware is current, and the data collector has the right project loaded before the truck leaves the yard.
> 2. On site, set primary control to better than the project accuracy class with redundant ties to published marks or CORS, and run the planned scope of work past the AI Project Companion plat-check pre-flight so you do not collect to the wrong specification.
> 3. Brief the crew on jurisdiction-specific deliverables (signature blocks, monumentation, special districts) so they pick up the right evidence the first time.

## Phase 1 — Equipment calibration and pre-flight

Run the manufacturer's pre-flight on each instrument. Total stations: collimation, tilt, EDM constant against the project baseline. GNSS: firmware up to date, antenna height tape verified, base station coordinate verified against the latest CORS solution. Levels: peg test. Tribrachs and prisms: optical plummet check.

- [content/field-and-boundary/survey-equipment/calibration-and-maintenance.md](../field-and-boundary/survey-equipment/calibration-and-maintenance.md)
- [content/field-and-boundary/survey-equipment/total-station-setup.md](../field-and-boundary/survey-equipment/total-station-setup.md)
- [content/field-and-boundary/survey-equipment/auto-levels-and-digital-levels.md](../field-and-boundary/survey-equipment/auto-levels-and-digital-levels.md)
- [content/field-and-boundary/survey-equipment/gnss-rtk.md](../field-and-boundary/survey-equipment/gnss-rtk.md)
- [content/field-and-boundary/survey-equipment/data-collectors.md](../field-and-boundary/survey-equipment/data-collectors.md)

## Phase 2 — Project file and field code load

Confirm the data collector is loaded with the current project file: control coordinates, design data (alignment, surface, layout points), feature code list paired to the office description-key set, and the correct coordinate system / projection / geoid model.

- [content/civil3d/points/description-keys.md](../civil3d/points/description-keys.md)
- [content/field-and-boundary/topographic-surveys/field-code-conventions.md](../field-and-boundary/topographic-surveys/field-code-conventions.md)
- [content/field-and-boundary/coordinate-systems/index.md](../field-and-boundary/coordinate-systems/index.md)
- Calculator: [state-plane-indiana](../../web/app/tools/state-plane-indiana/page.tsx) (verify zone)
- Calculator: [grid-to-ground](../../web/app/tools/grid-to-ground/page.tsx)

## Phase 3 — Scope briefing and jurisdictional intake

Brief the crew on the jurisdictional deliverables that affect what they pick up. Setback evidence (where the fence sits relative to the line), monumentation expectations, evidence flags from record research (the conflict hit list from Phase 4 of the record-research playbook), signature blocks that drive the plat content.

- [content/playbooks/record-research-pre-field.md](record-research-pre-field.md)
- [content/playbooks/crossing-jurisdictional-boundary.md](crossing-jurisdictional-boundary.md)
- Jurisdiction Intelligence GPS lookup + checklist
- MCP `get_jurisdiction_rules` (read out the field-relevant items: monument type, accessory requirements)
- AI Project Companion: scope-review pass on the proposed deliverable list

## Phase 4 — On-site control setup

Set primary control on arrival. Tie to at least two published marks or run static against CORS. Verify the project elevation datum by check-leveling to a project benchmark. Set instrument station, back-sight, and check a second known point before any collection begins.

- [content/field-and-boundary/control-networks/index.md](../field-and-boundary/control-networks/index.md)
- [content/field-and-boundary/control-networks/gnss-static.md](../field-and-boundary/control-networks/gnss-static.md)
- [content/field-and-boundary/control-networks/level-networks.md](../field-and-boundary/control-networks/level-networks.md)
- [content/field-and-boundary/control-networks/localization.md](../field-and-boundary/control-networks/localization.md)
- Calculator: [traverse-closure](../../web/app/tools/traverse-closure/page.tsx)
- Calculator: [level-loop](../../web/app/tools/level-loop/page.tsx)

## Phase 5 — Document, hand off, debrief

Before leaving the site, document: control coordinates as set, observation log, raw data backup off the data collector, equipment status, and any anomalies (vandalism, missing monuments, fresh disturbance). Hand off to the office for processing. Debrief the crew on what slowed them down so it does not repeat.

- [content/field-and-boundary/professional-practice/record-keeping.md](../field-and-boundary/professional-practice/record-keeping.md)
- [content/civil3d/survey/importing-raw-observations.md](../civil3d/survey/importing-raw-observations.md)
- AI Project Companion (upload raw observations and field notes to the project record)

## Common mistakes

- **Loading yesterday's project file into the data collector.** The control coordinates are wrong by 1,000 ft and the day is half over before anyone notices.
- **Skipping the back-sight check.** A 180-degree zero error eats a morning.
- **Trusting CORS without check-leveling.** Geoid model errors are real; verify against a benchmark before relying on RTK heights.
- **Briefing the crew on geometry but not on jurisdiction.** They go home without the fence-line evidence the plat needs.
- **Leaving without a raw-data backup.** Data collector failures eat days when there is no backup; back up before the truck leaves the site.

## Citations

- **865 IAC 1-12-12** — accuracy requirements for boundary surveys.
- **NOAA NGS NOS NGS 58** — RTK observation guidelines.
- **INDOT Design Manual Chapter 28** — control survey accuracy classes for INDOT projects.
- **Equipment manuals** — pre-flight procedures vary by manufacturer; follow the manual.
- **Local jurisdiction checklists** — pulled fresh via `get_jurisdiction_rules` each day-zero, not cached from prior projects.
