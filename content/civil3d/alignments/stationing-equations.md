---
title: "Stationing Equations"
section: "civil3d/alignments"
order: 35
visibility: public
tags: [alignment, stationing, station-equation, ahead, back]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [EDITGEOMETRY, ALIGNMENTPROPERTIES]
updated: 2026-05-06
---

> **TL;DR**
> 1. A station equation resets the station value at a specific point along the alignment. The **back station** is the station just before the equation; the **ahead station** is the new value after the reset. Station equations handle gaps, overlaps, or ties to existing stationing.
> 2. Use station equations when tying into existing construction stationing, matching phase boundaries, or connecting to a previously designed alignment where the stationing must agree with existing plan sheets.
> 3. Add a station equation in Alignment Properties > Station Equations tab. Specify the raw station (the location), the ahead station (the new value), and whether the equation increases or decreases.

## What a station equation does

An alignment normally carries continuous stationing from its start point. Station 0+00 at the beginning increments by the measured distance to the end. A station equation introduces a discontinuity: at the equation point, the station value jumps to a new number.

Example: an alignment starts at Sta 0+00 and runs 1,500 ft. At the 1,000 ft mark, you need the stationing to jump to Sta 25+00 (matching an existing road's stationing). You add a station equation:

- **Back station**: 10+00 (the station at the equation point using the original numbering).
- **Ahead station**: 25+00 (the new station after the equation).

After the equation, the next 500 ft of alignment runs from Sta 25+00 to Sta 30+00.

## When to use station equations

- **Matching existing construction**: a new road extension must match the stationing of an existing road at the tie-in point.
- **Phase boundaries**: Phase 1 ends at Sta 15+00; Phase 2 starts at Sta 15+00 with a new alignment, but the combined plan set needs continuous numbering.
- **Route joins**: two alignments meeting at a point where the downstream stationing must agree with a previously published plan set.
- **Datum changes**: rarely, a project resets stationing at a jurisdictional boundary.

## Increase vs decrease equations

Station equations can produce two conditions:

- **Increasing (ahead > back)**: the station jumps forward. The interval between back and ahead is a gap — those station values do not exist on the alignment. This is the common case when tying into higher stationing.
- **Decreasing (ahead < back)**: the station jumps backward. The interval between ahead and back is an overlap — some station values occur twice on the alignment (once before and once after the equation). Civil 3D distinguishes them by appending a suffix (e.g., "Sta 12+50 (Back)" and "Sta 12+50 (Ahead)").

## Adding a station equation in Civil 3D

1. Right-click the alignment > Alignment Properties.
2. Go to the Station Equations tab.
3. Click "Add" (the green plus icon).
4. Enter the **Raw Station** — the true geometric distance from the alignment start where the equation should apply. You can also pick a point on the alignment in the drawing.
5. Enter the **Station Ahead** value — the new station number after the equation.
6. Set the **Increase/Decrease** flag to match the direction of the jump.
7. OK.

The alignment's labels automatically reflect the new stationing downstream of the equation. Profiles, sample lines, and corridors that reference the alignment also update.

## Multiple station equations

An alignment can have multiple station equations. They are evaluated in order from start to end. Each equation resets the running station value for everything downstream until the next equation.

## Station equation labels

Station equations are typically annotated on plan sheets with a special label at the equation point showing both the back and ahead values. The default label set includes a station equation label style. If the label set omits it, add it under Alignment Properties > Labels > Station Equations.

A typical annotation reads:

    STA 10+00.00 BACK = STA 25+00.00 AHEAD

## Impact on dependent objects

Station equations affect all objects that reference the alignment's stationing:

| Object | Behavior |
|---|---|
| Profile | Station axis adjusts; profile data is continuous but axis labels reflect the equation |
| Profile view | Station axis shows the gap or overlap per the equation |
| Corridor | Targets and assembly placement use the raw (internal) station; display uses the equation-adjusted station |
| Sample lines | Can be placed by equation-adjusted station |
| Plan production | Sheets reference equation-adjusted stationing |
| Pipe networks referenced by station | Must account for the equation when placing structures at specific stations |

## Common mistakes

- **Placing the equation at the wrong raw station.** Verify the raw station by checking the alignment's geometry or using the station tracker. A misplaced equation shifts all downstream stationing.
- **Forgetting to update labels.** After adding an equation, confirm that major station labels now show the corrected values and that the equation label itself is visible.
- **Overlapping station values causing confusion.** When a decrease equation creates duplicate station values, call them out clearly on the plan set with "(Back)" and "(Ahead)" suffixes. Coordinate with the contractor.

## Related

- [Horizontal alignment basics](horizontal-alignment-basics.md)
- [Alignment labels and tables](alignment-labels.md)
- [Editing alignments](editing-alignments.md)
