---
title: "Multi-Discipline Coordination"
section: "civil3d/data-shortcuts"
order: 40
visibility: public
tags: [data-shortcuts, multi-discipline, coordination, workflow, survey, design, drainage, plans]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateDataShortcuts, CreateReference, SynchronizeReferences]
updated: 2026-05-06
---

> **TL;DR**
> 1. Data shortcuts enable a **publish-and-consume** workflow where each discipline (survey, design, drainage, plans) owns specific objects and shares them downstream via shortcuts.
> 2. The workflow is directional: survey publishes surfaces, design references surfaces and publishes alignments/profiles, drainage references alignments and publishes pipe networks, plans reference everything.
> 3. Communication is critical — shortcuts do not auto-synchronize. Establish a team protocol for when to publish updates and when to synchronize.

## The publish-and-consume model

In a multi-drawing Civil 3D project, each drawing has a role:

- **Source (publisher):** owns and maintains specific Civil 3D objects. Publishes them as data shortcuts.
- **Consumer (subscriber):** references shortcuts from upstream drawings. Uses them as design inputs but does not edit them.

A single drawing can be both a publisher and a consumer. For example, the design drawing consumes the survey surface and publishes alignments.

## Typical discipline workflow

### Step 1: Survey

**Drawing:** `EG-Survey.dwg`

**Owns:**
- Existing-ground surface (built from survey points and breaklines)
- Point groups
- Survey figures

**Publishes:**
- Existing-ground surface

**Consumes:**
- Nothing (survey is the upstream starting point)

### Step 2: Horizontal design

**Drawing:** `ALG-Design.dwg`

**Owns:**
- Horizontal alignments (centerlines, ROW lines, edge of pavement)
- Design profiles (vertical alignment on each horizontal alignment)

**Publishes:**
- Alignments
- Profiles

**Consumes:**
- Existing-ground surface (from survey — to create EG profiles and check clearances)

### Step 3: Corridor

**Drawing:** `COR-Corridor.dwg`

**Owns:**
- Corridor model
- Corridor surface (finished grade within the road prism)

**Publishes:**
- Corridor surface (as a surface shortcut)

**Consumes:**
- Alignments and profiles (from design)
- Existing-ground surface (from survey — as the corridor target surface for daylight)

### Step 4: Grading

**Drawing:** `GRD-SitePlan.dwg`

**Owns:**
- Feature lines, grading objects, grading groups
- Site grading surface (finished grade outside the road corridor)

**Publishes:**
- Site grading surface (as a surface shortcut)

**Consumes:**
- Existing-ground surface (from survey)
- Corridor surface (from corridor — to tie grading to road edges)
- Alignments (from design — for reference)

### Step 5: Drainage

**Drawing:** `STM-Storm.dwg` and `SAN-Sanitary.dwg`

**Owns:**
- Pipe networks (storm, sanitary)

**Publishes:**
- Pipe networks

**Consumes:**
- Alignments (from design — as reference alignments for pipe networks and profile display)
- Existing-ground surface and/or finished-grade surface (for cover checks and rim adjustment)

### Step 6: Plans

**Drawing:** `PLN-PlanProfile.dwg`, `PLN-CrossSections.dwg`

**Owns:**
- Sheet layouts, view frames, labels, annotations
- No Civil 3D design objects

**Publishes:**
- Nothing (plans are the downstream endpoint)

**Consumes:**
- Everything: surfaces, alignments, profiles, pipe networks, corridor surfaces
- Also XREFs the design and survey drawings for plan-view linework

## Dependency graph

```
Survey (surface)
   │
   ├──> Design (alignments, profiles)
   │       │
   │       ├──> Corridor (corridor surface)
   │       │       │
   │       │       └──> Plans
   │       │
   │       ├──> Grading (grading surface)
   │       │       │
   │       │       └──> Plans
   │       │
   │       ├──> Drainage (pipe networks)
   │       │       │
   │       │       └──> Plans
   │       │
   │       └──> Plans
   │
   └──> Plans
```

Changes propagate downward. If the survey surface changes, every downstream drawing needs to synchronize and potentially adjust its design.

## Team coordination protocol

Data shortcuts require communication to work smoothly. Establish these conventions:

### Publishing protocol

- **Announce before publishing.** Let downstream users know when a significant change is coming (e.g., "I am updating the surface with new topo from the east parcel. Sync after 3:00 PM.").
- **Publish at defined milestones.** Avoid publishing continuously — it creates a moving target. Publish at agreed-upon milestones (50% design, 90% design, final).
- **Save before publishing.** Shortcut XML captures the saved state. Unsaved changes are not included.

### Synchronization protocol

- **Synchronize before starting work.** Each morning (or at the start of a work session), synchronize to get the latest upstream data.
- **Synchronize before producing deliverables.** Before printing plans or running quantities, ensure all references are current.
- **Do not synchronize mid-task.** Synchronizing while actively editing a corridor or grading model can cause unexpected recalculations. Synchronize at a natural break point.

### Conflict resolution

- **One owner per object.** Each Civil 3D object has exactly one source drawing. No two drawings should own the same alignment or surface.
- **Communicate alignment changes.** If the design team shifts an alignment, every downstream drawing (corridor, drainage, plans) is affected. Alert the team.
- **Use data shortcuts, not copy/paste.** Copying a surface or alignment into another drawing creates an independent copy that will diverge. Always reference via data shortcuts.

## Composite finished-grade surface

Multiple disciplines contribute to the finished grade:

1. The corridor surface covers the road prism.
2. The grading surface covers the site outside the road.
3. Additional surfaces may cover detention basins, utility corridors, etc.

Build the composite finished-grade surface in a single drawing (often the plans drawing or a dedicated `FG-Composite.dwg`):

1. Reference the existing-ground surface (as the base).
2. Paste the corridor surface.
3. Paste the grading surface(s).
4. Add manual breaklines at transition zones.
5. Publish the composite as a data shortcut for earthwork and cross-section drawings.

## Related

- [Project structure](project-structure.md)
- [Creating data shortcuts](creating-data-shortcuts.md)
- [Referencing, synchronizing, promoting](referencing-syncing-promoting.md)
- [XREFs vs data shortcuts](xrefs-vs-data-shortcuts.md)
