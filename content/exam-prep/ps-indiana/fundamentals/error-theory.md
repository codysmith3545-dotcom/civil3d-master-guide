---
title: "Error Theory and Adjustments"
section: "exam-prep/ps-indiana/fundamentals"
order: 50
visibility: public
tags: [exam-prep, error-theory, least-squares, adjustment]
updated: 2026-05-11
sources:
  - title: "Ghilani and Wolf, Adjustment Computations (general reference)"
    url: https://en.wikipedia.org/wiki/Surveying
    verified: 2026-05-11
---

> **TL;DR**
> 1. Errors fall into three classes: blunders (eliminate), systematic (model and correct), and random (treated probabilistically).
> 2. Standard deviation sigma of repeated measurements of a quantity = sqrt(sum((x_i - x_mean)^2) / (n - 1)).
> 3. Error propagation for a sum or difference: variance of result = sum of variances of inputs (assuming independence). For multiplication or division of independent quantities, fractional variances combine.
> 4. Traverse closure: linear precision = closure / perimeter, often reported as 1:X. Compass rule (Bowditch) distributes closure proportionally to leg length; least squares is rigorous.

## Error classes

- **Blunders.** Mistakes (transposed digits, wrong point, instrument misread). Detect by redundant observations and review.
- **Systematic errors.** Repeatable biases (un-calibrated EDM, incorrect prism constant, temperature/pressure mis-set, sag in a tape). Model and correct.
- **Random errors.** Small variations from many small unrelated causes. Treated statistically; root of all "accuracy" calculations.

## Standard deviation

For n repeated measurements x_1, ..., x_n of the same quantity:

- Mean x_mean = sum(x_i) / n
- Sample standard deviation s = sqrt(sum((x_i - x_mean)^2) / (n - 1))
- Standard deviation of the mean = s / sqrt(n)

## Error propagation

For independent measurements with variances sigma_i^2 combined into a result y:

- y = sum of x_i: variance of y = sum of sigma_i^2
- y = constant * x: variance of y = constant^2 * sigma_x^2
- y = x_1 * x_2: (sigma_y / y)^2 ~= (sigma_1 / x_1)^2 + (sigma_2 / x_2)^2 (small-error approximation)

For a function y = f(x_1, ..., x_n) of independent variables, the general law of variance propagation is sigma_y^2 = sum of (df/dx_i)^2 * sigma_i^2.

## Traverse precision

For a closed traverse:

- Linear misclosure = sqrt(closure_lat^2 + closure_dep^2)
- Linear precision = linear misclosure / total perimeter, expressed as 1:N
- 865 IAC sets minimum precision standards by survey class. Most Class A boundary work expects 1:10,000 or better.

## Compass rule (Bowditch)

Distribute the latitude closure to each leg in proportion to leg length divided by perimeter. Same for departure. Apply with opposite sign to drive closure to zero.

- correction_lat_i = -(closure_lat) * (L_i / perimeter)
- correction_dep_i = -(closure_dep) * (L_i / perimeter)

## Least squares (overview)

For overdetermined networks (more observations than unknowns), least squares minimizes the weighted sum of squared residuals. Modern adjustment software solves the normal equations and provides standard deviations and error ellipses for each adjusted point. Hand calculation is rare; conceptual understanding is exam fodder.

## See also

- [Traverse closure (Calculator)](/tools/traverse-closure)
- [Control Networks and Adjustment](/docs/field-and-boundary/control-networks)
