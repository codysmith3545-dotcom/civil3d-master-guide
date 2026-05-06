---
title: "Corridor-Based Grading vs Feature-Line Grading"
section: "civil3d/grading"
order: 40
visibility: public
tags: [grading, corridor, feature-line, daylight, subassembly, hybrid]
appliesTo: [civil3d-2023, civil3d-2024, civil3d-2025]
relatedCommands: [CreateCorridor, GradingCreate, CreateFeatureLine, DaylightSubassembly]
updated: 2026-05-06
sources:
  - title: Autodesk Civil 3D Help — Corridors Overview
    url: https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1F2A3B4C-5D6E-7F8A-9B0C-1D2E3F4A5B6C
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Corridor-based grading** uses assemblies with daylight subassemblies to project cut/fill slopes parametrically along an alignment. It updates predictably when the alignment or profile changes and is the preferred method for roads, channels, and other linear features.
> 2. **Feature-line grading** uses grading objects projected from manually drawn feature lines. It handles freeform shapes (building pads, irregular detention basins, complex lot grading) that corridors cannot model easily.
> 3. Most real projects use **both** — corridors for the road and linear infrastructure, feature-line grading for pads and site work, with the two stitched together in a composite finished-grade surface.

## Corridor-based grading

A corridor is a 3D model built by sweeping an assembly (cross-section template) along an alignment and profile. Daylight subassemblies in the assembly project cut or fill slopes to a target surface.

### Strengths

- **Parametric.** When the alignment shifts or the profile grade changes, the corridor — including daylight slopes — updates automatically.
- **Consistent cross-section.** Every station along the corridor uses the same assembly logic. Slope ratios, bench widths, and ditch geometries are uniform unless overridden by targets.
- **Multi-region support.** Different assembly configurations can apply to different regions of the corridor (e.g., urban section vs rural section).
- **Section views.** Corridor sections display complete cross-sections with all subassembly components, making plan review and quantity takeoff straightforward.

### Limitations

- **Linear features only.** Corridors follow alignments — they handle roads, channels, levees, and similar linear geometry well but cannot easily model a rectangular building pad or an irregular pond shape.
- **Assembly complexity.** Modeling unusual grading conditions (variable slope, slope with a retaining wall at one station and a fill slope at another) requires conditional subassemblies or multiple regions, which adds complexity.
- **Daylight search failures.** If the daylight subassembly cannot find the target surface within its search distance, the corridor leaves a gap. Troubleshooting requires adjusting frequency, targets, or the assembly.

### Common daylight subassemblies

| Subassembly | Behavior |
|---|---|
| DaylightStandard | Projects a cut or fill slope at specified ratios until hitting the target surface |
| DaylightBench | Projects a slope, inserts a horizontal bench at a specified interval, then continues to the surface |
| DaylightMaxWidth | Projects a slope but stops at a maximum horizontal distance, useful for constrained ROW |
| DaylightMinWidth | Ensures a minimum horizontal projection before daylighting |

## Feature-line grading

Feature-line grading uses manually drawn feature lines as baselines, with grading objects projecting slopes to targets (surface, elevation, distance).

### Strengths

- **Freeform shapes.** Building pads, parking lots, detention basins, and irregular lot grading are straightforward — draw the perimeter, set elevations, and project.
- **Local control.** Each vertex of the feature line can have a unique elevation. Grading objects can use different criteria on different segments of the same feature line.
- **Infill.** Closed feature lines can be infilled to create flat pad surfaces — something corridors do not natively produce.
- **Volume balancing.** The Grading Volume Tools can iteratively adjust pad elevations to balance cut and fill.

### Limitations

- **Manual updates.** When the design changes (e.g., the building shifts 10 ft), the feature lines and grading objects must be manually adjusted. There is no parametric link to an alignment or profile.
- **Fragility.** Complex grading with many overlapping objects can be difficult to edit without breaking adjacent objects. Deleting one grading object may leave gaps in the surface.
- **No parametric cross-section.** There is no assembly-based template ensuring consistent slopes across the site.
- **Performance.** Large sites with hundreds of grading objects can become slow to rebuild.

## When to use each

| Scenario | Recommended approach |
|---|---|
| Road design with cut/fill slopes | Corridor with daylight subassembly |
| Channel or ditch design | Corridor |
| Building pad grading | Feature-line grading |
| Parking lot grading | Feature-line grading (or corridor if the lot follows a linear alignment) |
| Detention/retention basin | Feature-line grading |
| Levee or embankment | Corridor |
| Complex lot grading (residential subdivision) | Feature-line grading |
| Highway interchange | Corridor (multiple alignments) |
| Site grading connecting road to building | Feature-line grading (fills the gap between corridor and pad) |

## Hybrid workflows

The most practical approach on real projects:

1. **Design the road corridor** with an assembly that includes daylight subassemblies. The corridor produces a surface covering the road prism and its cut/fill slopes.
2. **Extract corridor feature lines** (top of curb, edge of shoulder, daylight catch point) for reference.
3. **Design building pads and site grading** with feature lines and grading objects. Use the extracted corridor feature lines as elevation references.
4. **Build a composite finished-grade surface:**
   - Start with the existing-ground surface.
   - Paste the corridor surface.
   - Paste each grading group surface.
   - Add manual breaklines where corridor and grading surfaces meet to ensure smooth transitions.
5. **Compute earthwork** from the composite surface vs existing ground.

### Resolving the transition zone

Where the corridor daylight slope meets the feature-line grading, there is often a gap or overlap. Resolve this by:

- Drawing a feature line along the corridor's daylight catch point and using it as the baseline for the adjacent site grading.
- Or extending the site grading feature lines to meet the corridor feature lines, snapping elevation to match.
- In the composite surface, the paste order matters — the last-pasted surface wins in overlap areas. Paste the more authoritative surface last.

## Related

- [Feature lines](feature-lines.md)
- [Grading objects](grading-objects.md)
- [Grading groups](grading-groups.md)
- [Troubleshooting grading](troubleshooting-grading.md)
