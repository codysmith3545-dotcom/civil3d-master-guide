---
title: "Plane Trigonometry for Surveyors"
section: "exam-prep/ps-indiana/fundamentals"
order: 40
visibility: public
tags: [exam-prep, trigonometry, math, fundamentals]
updated: 2026-05-11
---

> **TL;DR**
> 1. Most PS exam math reduces to right-triangle trig (sin, cos, tan), law of sines, law of cosines, and area formulas.
> 2. Traverse latitudes and departures: latitude = distance * cos(bearing), departure = distance * sin(bearing). Use signs by quadrant (NE +,+; SE -,+; SW -,-; NW +,-).
> 3. Area by coordinates (shoelace): A = 0.5 * |sum((x_i)(y_{i+1}) - (x_{i+1})(y_i))|.
> 4. Curve geometry: tangent T = R * tan(delta/2); arc length L = R * delta (delta in radians); chord C = 2 * R * sin(delta/2).

## Right-triangle review

For a right triangle with hypotenuse c, opposite o, adjacent a, and angle theta at the vertex opposite o:

- sin(theta) = o / c
- cos(theta) = a / c
- tan(theta) = o / a

## Law of sines

For a triangle with sides a, b, c opposite angles A, B, C:

a / sin(A) = b / sin(B) = c / sin(C)

## Law of cosines

c^2 = a^2 + b^2 - 2 * a * b * cos(C)

Useful when you have two sides and the included angle, or three sides and need an angle.

## Latitudes and departures

For a traverse leg of distance D and bearing angle theta from north:

- Latitude (N-S component) = D * cos(theta)
- Departure (E-W component) = D * sin(theta)

Signs follow quadrant: NE leg gives + lat, + dep; SE gives - lat, + dep; SW gives - lat, - dep; NW gives + lat, - dep.

## Area by coordinates (shoelace)

For a closed polygon with vertices (x_1, y_1), ..., (x_n, y_n) listed in order:

A = 0.5 * |sum from i=1 to n of (x_i * y_{i+1} - x_{i+1} * y_i)|

where (x_{n+1}, y_{n+1}) = (x_1, y_1).

## Horizontal curve geometry

For a circular curve with radius R and central angle delta:

- Tangent length T = R * tan(delta / 2)
- Arc length L = R * delta (delta in radians; or L = pi * R * delta_deg / 180)
- Chord length C = 2 * R * sin(delta / 2)
- Middle ordinate M = R * (1 - cos(delta / 2))
- External E = R * (sec(delta / 2) - 1) = R * (1/cos(delta/2) - 1)

## See also

- [Horizontal curve (Calculator)](/tools/horizontal-curve)
- [Area by coordinates (Calculator)](/tools/area-by-coordinates)
- [Traverse closure (Calculator)](/tools/traverse-closure)
