---
title: "Playbooks"
section: "playbooks"
order: 0
visibility: public
tags: [playbooks, workflows, index]
updated: 2026-05-11
---

> **TL;DR**
> 1. Playbooks chain the framework's reference content, calculators, jurisdiction intelligence, Civil 3D Power Pack LISP routines, MCP tools, and the AI Project Companion into end-to-end surveyor workflows.
> 2. Each playbook is broken into numbered phases. Each phase lists the specific repo pages and tools that drive that phase, so you can step through a real project without losing the thread.
> 3. Start with [Boundary survey from scratch](boundary-survey-from-scratch.md) if you want the broadest tour of the system, or pick the playbook that matches the job in front of you.

## What a playbook is

A playbook is a how-to for a job a working surveyor or land development professional actually has on their desk. It is not a tutorial for any single tool. Each one assumes you have the underlying reference content available and shows where each piece slots in. The framework components referenced across playbooks are:

- **Deed Decoder** and the MCP `decode_deed` tool — turning a legal description into bearings, distances, curves, and a closure report.
- **Jurisdiction Intelligence** — GPS lookup, jurisdiction checklist, jurisdiction compare, and the MCP `get_jurisdiction_rules` tool.
- **Civil 3D Power Pack** — the LISP routines indexed under [customization/lisp](../customization/lisp/index.md) and surfaced through MCP `get_lisp`.
- **Calculators** — the 17 web calculators under `/tools`, especially [traverse-closure](../../web/app/tools/traverse-closure), [area-by-coordinates](../../web/app/tools/area-by-coordinates), and [metes-and-bounds](../../web/app/tools/metes-and-bounds).
- **AI Project Companion** — project upload and the plat-check pipeline that scans a draft plat for jurisdictional and standard-of-care gaps.

## The 10 playbooks

| # | Playbook | When you reach for it |
|---|---|---|
| 1 | [Boundary survey from scratch](boundary-survey-from-scratch.md) | Client hands you a deed, you owe a sealed boundary survey. |
| 2 | [Record research pre-field](record-research-pre-field.md) | Before mobilizing a crew, gather and decode every adjoiner deed and plat. |
| 3 | [Prepare plat for recording](prepare-plat-for-recording.md) | Final plat ready for the county recorder; needs jurisdiction checklist + recording format compliance. |
| 4 | [Topographic survey workflow](topographic-survey-workflow.md) | Site control through deliverable: GNSS, total station topo, into Civil 3D, out as a surface and contour deliverable. |
| 5 | [Subdivision preliminary plat](subdivision-preliminary-plat.md) | Concept lots through preliminary plat with drainage, setbacks, ROW, and monumentation. |
| 6 | [ALTA/NSPS land title survey](alta-nsps-land-title-survey.md) | A 2021 ALTA/NSPS survey with Table A scope, Schedule B-II analysis, and the certification block. |
| 7 | [Monument restoration (PLSS)](monument-restoration-plss.md) | A section corner is gone; you need to restore it from existing evidence and file a corner record. |
| 8 | [Crossing jurisdictional boundary](crossing-jurisdictional-boundary.md) | A site straddles two cities or a city/county line; deliverables must satisfy both. |
| 9 | [Field team day zero](field-team-day-zero.md) | First morning on a new project: equipment calibration, control setup, scope review. |
| 10 | [Project Companion plat-check loop](prepare-plat-for-recording.md#plat-check-loop) | Iterate a draft plat against the AI Project Companion until the plat-check report is clean (covered inside playbook 3). |

## How to read each playbook

Every playbook follows the same shape:

1. **TL;DR** — three numbered sentences. Read this and stop if you only need orientation.
2. **Phases** — four to seven numbered steps. Each is a short paragraph plus a bulleted list of the exact repo pages and tools used in that phase. Click through to the page; the playbook is the spine.
3. **Common mistakes** — three to five specific failure modes and how to avoid them.
4. **Citations** — the standards, statutes, ordinances, and DOT manuals the playbook leans on, organized by section.

## Related

- [Field & boundary practice](../field-and-boundary/)
- [Civil 3D commands](../civil3d/commands/)
- [Customization (LISP / .NET / Dynamo)](../customization/)
- [Indiana jurisdictions](../jurisdictions/indiana/)
- [Standards](../standards/)
