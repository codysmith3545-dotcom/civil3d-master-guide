---
title: "Distance Measurement"
section: "exam-prep/ps-indiana/fundamentals"
order: 20
visibility: public
tags: [exam-prep, edm, taping, distance, fundamentals]
updated: 2026-05-11
sources:
  - title: "Brinker and Wolf, Elementary Surveying (general background)"
    url: https://en.wikipedia.org/wiki/Surveying
    verified: 2026-05-11
---

> **TL;DR**
> 1. Surveyors measure distance with tapes (rare today), electronic distance meters (EDM, inside total stations), and GNSS-derived coordinates.
> 2. EDM measurements need atmospheric, prism-constant, instrument, slope-to-horizontal, and (for boundary plats) often grid-to-ground corrections.
> 3. For a slope distance S and zenith angle z, horizontal distance = S * sin(z); vertical component = S * cos(z).
> 4. Ground distance to grid distance: ground * (1 / combined scale factor). Grid to ground: grid * CSF.

## Slope to horizontal

Most total stations report slope distance plus zenith (or vertical) angle. Convert:

- Horizontal distance H = S * sin(z), where z is zenith angle from vertical.
- Vertical difference dV = S * cos(z), positive when the target is above the instrument horizontal axis (after accounting for instrument and target heights).

If a vertical angle V (from horizontal) is reported instead: H = S * cos(V), dV = S * sin(V).

## Atmospheric correction

EDMs derive distance from the speed of light through air. Temperature, pressure, and humidity change air density and hence propagation speed. Most modern total stations accept temperature and pressure inputs and apply parts-per-million (ppm) corrections automatically.

## Grid versus ground

When a project is in State Plane (Indiana East or West), measured ground distance must be multiplied by the combined scale factor (CSF = grid scale factor * elevation factor) to obtain grid distance. For a boundary plat that lists ground distances, this conversion is reversed (divide by CSF) when comparing to State Plane coordinates.

In Indiana East (NAD83), CSFs at typical project elevations near 700 to 900 ft cluster around 0.9999 to 0.99995. The exact value depends on latitude and elevation; compute per project. See [Indiana State Plane (Calculator)](/tools/state-plane-indiana).

## Common exam math

- A slope distance of 200.00 ft at zenith 87 deg 00 min: H = 200 * sin(87) = 199.726 ft; dV = 200 * cos(87) = 10.467 ft.
- Ground distance of 1000.00 ft at CSF = 0.99988: grid distance = 1000 * 0.99988 = 999.880 ft.

## See also

- [Coordinate systems](coordinate-systems.md)
- [Grid-to-ground (Calculator)](/tools/grid-to-ground)
