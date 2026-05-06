---
title: "Network Adjustment"
section: "civil3d/survey"
order: 40
visibility: public
tags: [survey, network, least-squares, adjustment, traverse]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [TRAVERSEEDITOR, LEASTSQUARESANALYSIS, NETWORKADJUSTMENT]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D supports two adjustment methods on observations stored in the survey database: **Compass Rule (Bowditch)** for single-loop traverses and **Least Squares** for redundant networks.
> 2. Build a Traverse from a sequence of setups for compass rule, or build a Network from selected setups and run Least Squares Analysis. Both produce adjusted coordinates that overwrite the unadjusted database values once accepted.
> 3. Inspect residuals before accepting. Default tolerances ship loose; tighten them in Edit Survey Database Settings to flag problems instead of hiding them.

## When to use which method

- **Compass Rule** distributes the closure error linearly with leg length. It assumes equal precision in angles and distances and one loop. Use only when there is no redundancy beyond a single closed loop. Reference: any standard surveying text (e.g. Wolf and Ghilani, *Elementary Surveying*).
- **Least Squares** fits all observations simultaneously, weighting by their stated standard errors. It handles redundant observations, mixed angle/distance/GPS vector observations, and multiple loops. Required for any project where the deliverable cites positional accuracy at a confidence level (FGDC reporting, ALTA Table A item 6).

## Compass Rule traverse

1. Toolspace > Survey > expand the database > Traverses.
2. Right-click `Traverses` > New. Pick the initial station, initial backsight, and the sequence of stations.
3. Right-click the traverse > Traverse Analysis.
4. The dialog shows angular misclosure, linear misclosure, precision (1:N), and offers Compass Rule, Transit Rule, Crandall Rule, and Least Squares.
5. Choose Compass Rule, review the report, and accept to update coordinates.

The angular misclosure is computed against the sum of measured angles versus the theoretical sum (`(n-2) * 180°` for an interior-angle traverse closed onto itself). Distribute proportionally to leg lengths. Accept when angular misclosure is within the survey's specification, e.g. `±√n × specified angular accuracy`.

## Least Squares network

1. Right-click `Networks` > New. Name and select setups to include.
2. Add the setups by drag-drop or right-click > Add Setups.
3. Right-click the network > Least Squares Analysis. Configure:
   - Confidence level (95% standard for FGDC).
   - Number of iterations (default 10 is usually enough; raise if not converging).
   - Use measurement defaults from database settings, or override per-observation in the Observations tab.
4. Run. Civil 3D produces a report with adjusted coordinates, standard error ellipses, and observation residuals.
5. If residuals are within tolerance, accept to write back. If not, inspect outliers and either re-weight or remove the bad observation.

### Standard errors that drive the weights

Edit Survey Database Settings > Least Squares Analysis Defaults sets the assumed precision of each observation type:

- Pointing error (e.g. 2 seconds for a 2" total station).
- Reading error.
- Centering error of instrument and target (typical 0.005 ft for tribrach, 0.02 ft for prism pole).
- EDM constant and ppm (e.g. 0.003 m + 2 ppm).

These should match the equipment in the Equipment Database. Wrong precision values guarantee misleading results: too tight and good observations get flagged, too loose and bad ones pass.

## Reading the report

The least-squares report includes:

- **Number of redundancies** (degrees of freedom). Zero redundancy means the network is just-determined and adjustment is impossible.
- **Standard deviation of unit weight** (variance factor). Should be close to 1.0; far from 1.0 indicates the input weights don't match the actual observation quality.
- **Adjusted coordinates** with horizontal and vertical standard deviations, plus error ellipse parameters (a, b, theta).
- **Observation residuals** — the difference between observed and adjusted. Tabular format with standardized residuals; a standardized residual greater than about 3 is a candidate outlier.

## Tolerances

Edit Survey Database Settings > Network Tolerances and Traverse Analysis Defaults set the bands above which Civil 3D flags a problem:

- Horizontal angle tolerance — default 5"; tighten to `instrument_accuracy × √n` where `n` is the number of repetitions.
- Vertical angle tolerance — default 5".
- Distance tolerance — set to `EDM_accuracy + ppm × distance`.
- Coordinate tolerance — usually 0.05 ft for typical land surveying; tighten for high-precision control.

## Workflow tips

- **Hold control fixed in the LSA**. Mark known control with `H` (horizontal fix) and `V` (vertical fix) in the Control Points node before running. Otherwise the network drifts to wherever the redundancy pulls it.
- **Mix in GPS vectors** when available. Import them as a separate observation type; least squares blends them with terrestrial observations using the right covariance matrix.
- **Re-run after editing.** Any change to observations leaves the network in an "out of date" state. Right-click and re-run; do not rely on a stale report.
- **Snapshot the report** in the project folder. The PDF or text export is the auditable record.

## Common gotchas

- **Unit weight wildly off**. If standard deviation of unit weight is 5 or 10, the precision settings don't match reality. Check tribrach centering errors first.
- **Dependent observations counted twice**. Some collectors store both face-1 and face-2 angles separately; with the wrong setting Civil 3D treats them as independent and over-weights the angular component.
- **Forgotten free station setups**. Free stations propagate error like any other; don't lock their coordinates as control by accident.
- **Network not refreshing in drawing**. After accepting an adjustment, the inserted figures and points in DWGs need a `Synchronize` from Prospector > Survey to pick up new coordinates.

## Related

- [Survey database](survey-database.md)
- [Figures and figure prefixes](figures-and-figure-prefixes.md)
- [Linework code sets](linework-code-sets.md)
