---
title: "Bearings and Azimuths"
section: "exam-prep/ps-indiana/fundamentals"
order: 10
visibility: public
tags: [exam-prep, bearings, azimuths, fundamentals]
updated: 2026-05-11
sources:
  - title: "NCEES PS exam reference handbook (current edition)"
    url: https://ncees.org/
    verified: 2026-05-11
---

> **TL;DR**
> 1. An azimuth is measured clockwise from north, 0 to 360 degrees. A bearing is the acute angle from the meridian (north or south), expressed as N or S, then the angle, then E or W.
> 2. Convert azimuth to bearing by quadrant: 0 to 90 is NE (bearing = azimuth), 90 to 180 is SE (bearing = 180 - azimuth, S...E), 180 to 270 is SW (bearing = azimuth - 180, S...W), 270 to 360 is NW (bearing = 360 - azimuth, N...W).
> 3. Back-bearing flips the cardinal letters; back-azimuth differs by 180 degrees (mod 360).
> 4. On the PS exam, watch for assumed-meridian vs grid-north vs astronomic-north framing.

## Definitions

- **Azimuth.** A horizontal direction measured clockwise from a reference meridian, expressed in the range 0 to 360 degrees. Most US practice uses north as the reference; some military and astronomic conventions use south.
- **Bearing.** A horizontal direction expressed as the acute angle (0 to 90 degrees) from either the north or south meridian, prefixed by the meridian letter and suffixed by the side (east or west). Example: N 32 degrees 15 minutes E.
- **Back-bearing.** The bearing of the same line measured from the opposite end. Flip both the cardinal letters: N 32 degrees 15 minutes E becomes S 32 degrees 15 minutes W.
- **Back-azimuth.** Azimuth plus 180 degrees, modulo 360.

## Conversion procedure

Given an azimuth A (degrees, clockwise from north):

| Quadrant | Azimuth range | Bearing |
|---|---|---|
| NE | 0 to 90 | N A E |
| SE | 90 to 180 | S (180 - A) E |
| SW | 180 to 270 | S (A - 180) W |
| NW | 270 to 360 | N (360 - A) W |

## Worked example

Convert azimuth 247 degrees 32 minutes to a bearing.

1. 247 deg 32 min is in the SW quadrant (180 to 270).
2. Bearing angle = 247 deg 32 min - 180 deg = 67 deg 32 min.
3. Bearing = S 67 deg 32 min W.

## Common exam traps

- Forgetting that magnetic, astronomic, grid, and assumed meridians differ by declination and convergence. A bearing is meaningless without a stated basis.
- Confusing "back" with "reverse." A back-bearing of a line is from the far end, not the negation of the angle.
- Using grid azimuths without applying convergence when the problem stipulates astronomic or geodetic north.

## See also

- [Indiana State Plane (Calculator)](/tools/state-plane-indiana)
- [Inverse (Calculator)](/tools/inverse)
- [Solar Observation (Calculator)](/tools/solar-observation)
