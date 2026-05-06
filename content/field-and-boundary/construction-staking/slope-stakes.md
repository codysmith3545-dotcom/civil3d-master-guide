---
title: "Slope Stakes"
section: "field-and-boundary/construction-staking"
order: 40
visibility: public
tags: [construction-staking, slope-stakes, cut-fill, catch-point, daylight-line, grading]
updated: 2026-05-06
---

> **TL;DR**
> 1. A slope stake marks the **catch point** — the location where the design slope intersects the existing ground. Finding the catch point is an iterative process: estimate, measure, adjust, repeat until the computed and observed locations converge.
> 2. Mark each slope stake with the **station, offset to centerline, design slope ratio (e.g., 3:1), and cut or fill** so the grading crew knows where the earthwork limit is.
> 3. Slope stakes define the **daylight line** — the outer boundary of grading. Material outside this line should not be disturbed.

## What slope stakes are

Slope stakes mark the edges of earthwork. On a fill section, the slope stake is at the bottom (toe) of the fill slope. On a cut section, it is at the top of the cut slope. The line connecting slope stakes along the project is the daylight line — the boundary between disturbed and undisturbed ground.

## Finding the catch point

The catch point is where the design side slope, projected from the edge of the design template (e.g., edge of shoulder, toe of subgrade), intersects the existing ground. Because the ground surface is irregular, finding the exact intersection requires iteration.

**Manual iterative method:**

1. At the design station, read the design template: edge-of-shoulder elevation and offset from centerline, and the design slope ratio (e.g., 2:1 fill, 3:1 cut).
2. Estimate the catch point offset based on the typical section and a rough ground slope.
3. Walk to the estimated offset and shoot the existing ground elevation.
4. Compute the theoretical design elevation at that offset: starting from the template edge, project the slope ratio out to the measured offset.
5. Compare the computed design elevation to the measured ground elevation.
   - If the ground is above the design elevation (in fill) or below (in cut), the catch point is farther out.
   - If the ground is below the design elevation (in fill) or above (in cut), the catch point is closer in.
6. Adjust the offset estimate and repeat. Usually converges in 2 to 4 iterations.

**Data collector method:**

Most modern data collectors (Trimble Access, Leica Captivate, Carlson SurvCE) have a slope-staking routine that automates this iteration. Load the design alignment, profile, and typical section. The software guides you outward or inward until the design slope and the ground converge.

## Standard slope ratios

Common design slopes used in Indiana and throughout the Midwest:

| Application | Typical slope | Notes |
|---|---|---|
| Fill slopes, general | 3:1 (H:V) | Standard for INDOT and most municipalities |
| Fill slopes, restricted ROW | 2:1 | Steeper; may require erosion protection |
| Cut slopes, soil | 3:1 | Common default |
| Cut slopes, rock | 1:1 or steeper | Depends on geotechnical recommendation |
| Ditch side slopes | 4:1 to 3:1 | 4:1 is mowable; 3:1 is the steepest mowable slope |
| Detention basin side slopes | 4:1 to 3:1 | Many jurisdictions require 4:1 for mowing and safety |

Verify the design slope for each section from the plans. The slope may change between stations (e.g., 3:1 in open sections, 2:1 adjacent to a retaining wall).

## Marking slope stakes

Write on each slope stake:

- **Station** (e.g., STA 15+00).
- **Offset from centerline** (e.g., 42.3' LT).
- **Slope ratio** (e.g., 3:1 FILL or 2:1 CUT).
- **Cut or fill** at the stake (e.g., F 0.0 — at the catch point, cut/fill should be close to zero by definition).
- **Direction arrow** pointing toward centerline.

If the contractor also wants the cut or fill at centerline, shoulder, or ditch for reference, add those values on the back of the lath.

## Daylight line marking

Connect the slope stakes along the project to form the daylight line. Some contractors request:

- Paint or flagging on the ground between slope stakes to visualize the grading limit.
- A continuous staked line (stakes every 50 ft with flagging) so the equipment operator can see the boundary from the cab.
- Orange construction fence along the daylight line where environmentally sensitive areas (wetlands, tree preservation zones) are adjacent.

## Variable sections

Slope staking becomes more complex when the typical section changes between stations:

- **Transition sections.** Where the template transitions from a cut section to a fill section (or vice versa), the slope stakes on one side may be cut while the other side is fill. Stake each side independently.
- **Benched cuts.** A steep cut may require an intermediate bench (flat shelf) partway up the slope. Stake both the bench edge and the daylight line above the bench.
- **Superelevated sections.** In superelevation transitions, the template tilts and the slope stake offsets change. Compute the template edge elevation at each station rather than assuming a constant value.

## Earthwork limit considerations

Slope stakes are not just grade indicators — they define the legal and environmental limit of the contractor's work.

- On public projects, the daylight line must fall within the right-of-way or easement. If slope staking reveals that the design grading extends beyond the ROW, notify the engineer immediately.
- On sites adjacent to wetlands or regulated buffers, the daylight line may be the compliance boundary. Overshoot by one equipment pass and the project faces a permit violation.
- Mark the daylight line clearly and communicate its significance to the grading crew. "Do not grade beyond these stakes" should be part of the pre-construction conversation.

## Related

- [Grade checks](grade-checks.md)
- [Lath conventions](lath-conventions.md)
- [Pavement staking](pavement-staking.md)
- [Working with contractors](working-with-contractors.md)
