---
title: "Pavement Staking"
section: "field-and-boundary/construction-staking"
order: 25
visibility: public
tags: [construction-staking, pavement, centerline, edge-of-pavement, subgrade, blue-top, cross-slope]
updated: 2026-05-06
---

> **TL;DR**
> 1. Pavement staking typically involves **centerline and edge-of-pavement (EP) offset stakes** at 50 ft intervals on tangent, tightening on curves — with cut/fill referenced to either **subgrade or finished grade**, depending on the construction phase.
> 2. **Blue tops** are grade hubs set to the exact design elevation (subgrade or finished grade) that the paving crew uses as a direct reference — they must be within 0.01 ft vertically.
> 3. Always note on the lath whether the grade reference is **subgrade or finished surface**, and document the pavement section thickness so the contractor can verify the relationship.

## Centerline staking

Centerline stakes define the horizontal alignment. They are typically offset stakes (not on the centerline itself, which will be graded over), set at a consistent offset (commonly 25 to 50 ft from centerline) with station and offset noted.

1. Generate stakeout points along the horizontal alignment at 50 ft intervals on tangent.
2. At PCs, PTs, and other alignment geometry points, stake the exact station.
3. On horizontal curves, tighten to 25 ft intervals or closer on tight radii.
4. Set offset stakes on both sides of the alignment if the contractor needs both.
5. Mark each stake with the station, offset distance and direction, and cut or fill to the design surface (subgrade or finished grade, as specified).

## Edge-of-pavement staking

EP stakes define the lateral extent of the pavement. They can be offset from the EP itself (common) or set directly on the EP line if the pavement edge is being formed.

- Use the pavement typical section to compute the EP position from the centerline alignment at each station.
- Account for superelevation transitions on curves — the EP elevation shifts relative to centerline through the transition.
- Stake both left and right EP on divided roads and one-way sections.

## Subgrade vs. finished grade

Pavement construction has layers: subgrade, aggregate base, binder course, surface course. The surveyor must know which surface the contractor needs:

| Construction phase | Grade reference |
|---|---|
| Rough grading | Subgrade (bottom of pavement section) |
| Base course placement | Top of aggregate base |
| Binder paving | Top of binder course (finished grade minus surface course thickness) |
| Final paving | Finished grade (top of surface course) |

A typical urban street section might be: 6 in. aggregate base + 2 in. binder + 1.5 in. surface = 9.5 in. total pavement section. Subgrade is 9.5 in. (0.79 ft) below finished grade.

Mark on the lath which surface the cut/fill refers to. A stake that says "F 0.42" is ambiguous if the contractor does not know whether that is fill to subgrade or fill to finished grade. Write "F 0.42 TO SG" or "F 0.42 TO FG" explicitly.

## Blue-top procedure

Blue tops are wooden hubs driven so that the top of the hub is at the exact design elevation. The name comes from the traditional practice of marking the top with blue lumber crayon (or paint) to distinguish grade hubs from offset hubs.

**Procedure:**

1. Drive a 2 in. by 2 in. wooden hub into the ground at the design point (or at the specified offset).
2. Using a level and rod (or a precisely calibrated RTK setup), determine the elevation of the top of the hub.
3. If the hub top is too high, tap it down. If too low, pull it slightly and re-drive, or shim with a tack.
4. Final elevation should be within **0.01 ft** of the design elevation.
5. Mark the top of the hub with blue crayon or paint.
6. Set a guard stake with the station, offset, and design elevation.

Blue tops are most commonly used for:

- Final subgrade before base placement.
- Finished grade for concrete paving (the paver or screed rides on the hubs).
- Curb and gutter flow line grades (when the curb machine does not use a string line).

Blue tops require a level and rod for the final adjustment. RTK alone is typically not precise enough for the 0.01 ft vertical tolerance.

## Cross-slope verification

Pavements are crowned or cross-sloped for drainage. Standard cross slopes:

- **Normal crown (two-lane road):** 2.0% from centerline to each EP.
- **One-directional slope (parking lots, some urban streets):** 1.0% to 2.0%.
- **Superelevated curves:** Varies per design, up to the maximum superelevation rate (commonly 4% to 8% depending on design speed and jurisdiction).

To verify cross slope in the field:

1. Shoot or level the centerline and both EPs at the same station.
2. Compute the elevation difference divided by the horizontal distance.
3. Compare to the design cross slope.
4. A tolerance of 0.25% (e.g., 1.75% to 2.25% for a 2.0% design) is typical for finished pavement.

On superelevation transitions, verify the cross slope at the beginning, middle, and end of the transition to confirm the rate of change matches the design.

## Related

- [Curb staking](curb-staking.md)
- [Grade checks](grade-checks.md)
- [Blue-top procedure](pavement-staking.md#blue-top-procedure)
- [Lath conventions](lath-conventions.md)
- [Staking checklist](staking-checklist.md)
