---
title: "Least-Squares Adjustment Concepts"
section: "field-and-boundary/control-networks"
order: 20
visibility: public
tags: [least-squares, adjustment, statistics, residuals]
updated: 2026-05-06
sources:
  - title: "Wolf & Ghilani — Adjustment Computations, 6th ed."
    url: https://www.wiley.com/
    verified: 2026-05-06
  - title: "FGDC-STD-007 — Geospatial Positioning Accuracy Standards"
    url: https://www.fgdc.gov/standards
    verified: 2026-05-06
---

> **TL;DR**
> 1. Least squares finds the set of adjusted coordinates that **minimizes the sum of weighted squared residuals** across all observations simultaneously. It is the only rigorous method for adjusting a redundant network.
> 2. The **weight matrix** controls how much each observation influences the result. Weight = 1 / (standard deviation)^2. An observation you trust more gets a higher weight.
> 3. Check the **a posteriori variance factor** (should be near 1.0) and **standardized residuals** (flag values above 3.0 as potential blunders). These are your primary diagnostic tools.
> 4. You do not need to understand the matrix algebra to use least squares effectively, but you do need to understand what the output statistics mean.

## What least squares does

Every survey measurement (angle, distance, elevation difference, GNSS baseline component) contains random error. When a network has redundant observations — more measurements than the minimum needed to compute the unknowns — the observations will not agree perfectly. Least squares resolves the disagreement by finding the adjusted values that:

1. Satisfy the geometric relationships between observations and coordinates.
2. Minimize the sum of weighted squared residuals (v^T * P * v), where v is the vector of residuals and P is the weight matrix.

The result is a set of adjusted coordinates along with statistical measures of their quality.

## Observation equations

Each measurement generates an observation equation that relates the observed value to the unknown coordinates. In parametric (observation equation) form:

```
observed_value + residual = f(unknown_coordinates)
```

Examples:

- **Horizontal distance** from point A to point B: D_obs + v = sqrt((N_B - N_A)^2 + (E_B - E_A)^2)
- **Horizontal angle** at point B from A to C: alpha_obs + v = arctan((E_C - E_B)/(N_C - N_B)) - arctan((E_A - E_B)/(N_A - N_B))
- **GNSS baseline** delta-N from A to B: dN_obs + v = N_B - N_A

The system of observation equations is linearized (Taylor series expansion) and solved iteratively. Most software handles this automatically; the surveyor's job is to provide correct observations and reasonable weights.

## Weight matrix

The weight matrix P controls how much each observation contributes to the adjustment. The standard approach:

```
Weight = 1 / (sigma^2)
```

Where sigma is the estimated standard deviation of the observation. An angle measured with a 2" instrument gets a higher weight (smaller sigma) than one measured with a 5" instrument. A short EDM distance (lower ppm effect) gets a higher weight than a long one.

### Setting realistic weights

The weights must reflect the actual precision of the observations, not the manufacturer's best-case specification. Include:

- **Instrument precision:** From the manufacturer spec (e.g., 2" angular, 2 mm + 2 ppm distance).
- **Centering error:** How well the instrument and target are centered over the point. Forced centering (tribrach swap) is approximately 0.001-0.003 ft; prism pole is 0.01-0.02 ft.
- **Target height error:** For vertical observations.
- **Atmospheric modeling error:** For long EDM distances.

If the weights are too optimistic (sigma too small), the adjustment will report a high variance factor and flag too many observations as outliers. If the weights are too pessimistic (sigma too large), real blunders will pass undetected.

## A priori vs a posteriori variance factor

The **a priori variance factor** (sigma_0^2) is set to 1.0 by convention before the adjustment. After the adjustment, the **a posteriori variance factor** (s_0^2) is computed:

```
s_0^2 = (v^T * P * v) / DOF
```

Where DOF = degrees of freedom (number of observations minus number of unknowns).

### Interpreting the variance factor

- **s_0^2 near 1.0:** The assigned weights match the actual observation quality. The network is well-behaved.
- **s_0^2 significantly greater than 1.0** (e.g., 2.0, 5.0): The observations are worse than you estimated, or there are undetected blunders. The weights are too optimistic.
- **s_0^2 significantly less than 1.0** (e.g., 0.3): The observations are better than you estimated. The weights are too pessimistic. This is the less dangerous direction, but it means your error estimates are conservative.

A chi-squared test formalizes this assessment. At the 95% confidence level, s_0^2 should fall within the interval defined by the chi-squared distribution with DOF degrees of freedom. Most adjustment software reports whether the chi-squared test passes or fails.

## Chi-squared test for overall network quality

The chi-squared test checks whether the a posteriori variance factor is statistically consistent with the a priori value of 1.0:

```
Test statistic = DOF * s_0^2
Accept if: chi-squared(alpha/2, DOF) < DOF * s_0^2 < chi-squared(1-alpha/2, DOF)
```

Where alpha is the significance level (typically 0.05 for 95% confidence).

If the test fails on the high side, investigate:

1. Look for observations with large standardized residuals (potential blunders).
2. Verify that the weights reflect the actual equipment and procedures used.
3. Check for systematic errors (incorrect prism constants, wrong atmospheric corrections, bad base coordinate).

## Standardized residuals for blunder detection

A **standardized residual** scales each residual by its estimated standard deviation:

```
Standardized residual = v_i / sigma_v_i
```

Where sigma_v_i is the standard deviation of the residual (computed from the variance-covariance matrix of the residuals).

### Interpretation

- **|standardized residual| < 2:** Normal. The observation is consistent with the rest of the network.
- **2 < |standardized residual| < 3:** Suspicious. Investigate but do not automatically reject.
- **|standardized residual| > 3:** Likely blunder. The observation is statistically inconsistent with the rest of the network at the 99.7% confidence level. Investigate the field notes, check for data entry errors, and consider removing the observation and re-adjusting.

Do not blindly remove observations with large residuals. Each removal should be justified by a plausible explanation (transposed digits, wrong prism height, wrong target, etc.). Removing observations without justification degrades the network integrity.

## Practical interpretation for the field surveyor

You do not need to compute least squares by hand. Modern software (Civil 3D, Star*Net, MicroSurvey STAR, Columbus) handles the computation. Your responsibilities:

1. **Provide correct input.** Enter the right observations, instrument heights, target heights, and control coordinates. Garbage in, garbage out.
2. **Set realistic weights.** Match the precision values in the software to your actual equipment and field procedures.
3. **Read the output.** Check the variance factor, the chi-squared test, the standardized residuals, and the error ellipses. If something is flagged, investigate before accepting.
4. **Do not over-constrain.** Run a minimally constrained adjustment first to verify internal consistency. Then add all fixed control and re-adjust.
5. **Archive the report.** The adjustment report is the statistical documentation of your network quality. It supports accuracy statements on plats and reports.

## Related

- [Network design](network-design.md)
- [Traverse types](traverse-types.md)
- [Accuracy standards](accuracy-standards.md)
- [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md)
