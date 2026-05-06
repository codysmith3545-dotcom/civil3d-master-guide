---
title: "Traverse Types & Adjustment"
section: "field-and-boundary/control-networks"
order: 30
visibility: public
tags: [traverse, closed, open, loop, connecting]
updated: 2026-05-06
sources:
  - title: "Wolf & Ghilani — Elementary Surveying, 16th ed."
    url: https://www.pearson.com/
    verified: 2026-05-06
  - title: "Indiana Administrative Code — 865 IAC 1-12 (Minimum Standards for Land Surveying)"
    url: https://www.in.gov/pla/professions/land-surveyor/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Use **closed traverses** (loop or connecting). An open traverse has no check on accumulated error and is acceptable only for preliminary reconnaissance.
> 2. The **compass rule (Bowditch)** is the traditional adjustment method and is adequate for single-loop traverses. **Least squares** is required for networks with redundancy or mixed observation types.
> 3. Minimum precision for boundary surveys in Indiana is typically **1:10,000** or better, depending on the survey type and local requirements. Always check the applicable standard before starting.

## Traverse types

### Open traverse

An open traverse starts at a known point and ends at an unknown point. There is no closure check — errors accumulate along the traverse with no way to detect them.

**When acceptable:** Preliminary route surveys, reconnaissance, temporary construction control where the points will be verified by other means.

**When NOT acceptable:** Boundary surveys, final control, any work where the coordinates must be defensible.

### Closed loop traverse

A closed loop traverse starts and ends at the **same point**, forming a closed polygon. The angular misclosure and linear misclosure provide a check on the observations.

- **Angular misclosure** = sum of measured interior angles - theoretical sum. Theoretical sum = (n - 2) * 180 degrees, where n = number of angles (sides).
- **Linear misclosure** = distance between the computed position of the closing point and its known position.
- **Precision** = 1 / (linear misclosure / total traverse distance). Expressed as a ratio (e.g., 1:15,000).

A closed loop checks internal consistency but does not check the absolute position of any point. If the starting coordinates or azimuth are wrong, the entire loop is shifted or rotated.

### Connecting (closed between two known points) traverse

A connecting traverse starts at one known point with a known backsight azimuth and closes on a **different** known point with a known closing azimuth. This is the strongest single-traverse configuration because it checks both internal consistency and absolute position.

The misclosure is computed as the difference between the computed coordinates of the closing point and its published coordinates.

### Double-run traverse

A double-run traverse is observed twice: once in the forward direction and once in the reverse direction. The two runs provide redundancy and help identify blunders. Used for higher-order control where precision must be demonstrated.

## Adjustment methods

### Compass rule (Bowditch)

The compass rule distributes the linear misclosure proportionally to the cumulative distance from the starting point. It assumes errors are equally likely in angles and distances.

**Adjustment formula:**

```
Correction_N_i = -(misclosure_N) * (cumulative_distance_i / total_distance)
Correction_E_i = -(misclosure_E) * (cumulative_distance_i / total_distance)
```

The compass rule is simple, widely understood, and adequate for single-loop traverses with reasonably uniform leg lengths. It does not produce accuracy estimates for the adjusted coordinates.

### Transit rule

The transit rule distributes the misclosure proportionally to the absolute values of the latitude and departure of each leg. It assumes distance measurements are more precise than angle measurements. It is rarely used in modern practice.

### Crandall rule

The Crandall method adjusts only the distances, holding the angles fixed. It is used when angles are measured with much higher precision than distances (e.g., direction observations with many repetitions). It is rarely appropriate with modern EDM instruments where distance precision often exceeds angular precision.

### Least squares

Least squares adjusts all observations simultaneously based on their assigned weights. It handles redundant observations, multiple loops, mixed observation types (angles, distances, GNSS vectors), and produces accuracy estimates (error ellipses, standard deviations) for every adjusted coordinate.

**Use least squares when:**
- The traverse has redundant observations (cross-ties, multiple loops).
- You need to report positional accuracy (FGDC, ASPRS, or ALTA Table A Item 6).
- The network includes both conventional and GNSS observations.
- Project specifications require it.

## How Civil 3D's traverse tool relates

Civil 3D supports traverse analysis through the Survey tab in Toolspace:

1. Build a traverse from a sequence of setups in the survey database.
2. Right-click the traverse and run Traverse Analysis.
3. Choose the adjustment method: Compass Rule, Transit Rule, Crandall Rule, or Least Squares.
4. Review the report showing angular misclosure, linear misclosure, precision ratio, and adjusted coordinates.
5. Accept to update the survey database coordinates.

For least-squares adjustment of a full network (not just a single traverse), use the Network node in the survey database. See [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md).

## Minimum precision requirements

Precision requirements depend on the survey type and the applicable standard. The following are typical minimums:

| Survey type | Minimum precision (linear) | Angular closure | Source |
|---|---|---|---|
| ALTA/NSPS Land Title Survey | Relative Positional Accuracy 0.07 ft + 50 ppm | N/A (accuracy-based standard) | ALTA/NSPS 2021 Standards |
| Indiana boundary survey | 1:10,000 minimum | 10" * sqrt(n) | Indiana minimum standards |
| Second-order Class I control | 1:50,000 | 1.0" * sqrt(n) | FGDC |
| Second-order Class II control | 1:20,000 | 1.5" * sqrt(n) | FGDC |
| Third-order Class I control | 1:10,000 | 2.0" * sqrt(n) | FGDC |
| Third-order Class II control | 1:5,000 | 3.0" * sqrt(n) | FGDC |
| Construction staking | 1:5,000 to 1:10,000 | Project-specific | Varies |

Where n = number of angles in the traverse.

Note: The ALTA/NSPS standard has moved from precision-based (ratio) to accuracy-based (Relative Positional Accuracy). The traverse precision ratio is still a useful field check but is not the final quality measure for ALTA surveys.

## Field procedure for a connecting traverse

1. Set up on the starting control point. Sight the backsight reference and set the initial azimuth.
2. Measure the angle and distance to the first traverse point. Observe in Face 1 and Face 2 (direct and reverse) and mean the results.
3. Leapfrog to each subsequent station, measuring angles and distances in both faces.
4. At the closing control point, measure the angle to the closing backsight reference and compare the observed closing azimuth to the known azimuth.
5. Compute the angular misclosure and linear misclosure in the field (or use the data collector's traverse closure function) before leaving the site.
6. If the closure exceeds the project specification, identify the problem and re-measure the suspect leg(s) while still in the field.

## Related

- [Network design](network-design.md)
- [Least-squares concepts](least-squares-concepts.md)
- [Level networks](level-networks.md)
- [Accuracy standards](accuracy-standards.md)
- [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md)
