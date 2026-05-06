---
title: "Basis of Bearings"
section: "field-and-boundary/legal-descriptions"
order: 40
visibility: public
tags: [bearings, basis, state-plane, indiana, datum]
updated: 2026-05-06
sources:
  - title: "NOAA NGS — State Plane Coordinate System"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-06
  - title: "865 IAC 1-12 Indiana Surveyor Rules"
    url: https://www.in.gov/pla/professions/professional-surveyors-home/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Every plat and description must state how its bearings were derived. The three options are **geodetic (true)**, **grid (state plane)**, and **assumed**.
> 2. In Indiana practice, "Indiana State Plane Grid bearings, East Zone, NAD83(2011)" is the most common modern basis. Always declare the zone and the realization.
> 3. Bearings on different bases differ. Convergence makes geodetic and grid bearings disagree; that disagreement varies across the project area.

## The three bases

**Geodetic (true) bearings** are referenced to the geographic meridian — the direction of true north as defined by Earth's rotation axis. A geodetic bearing at one point is not the same as the geodetic bearing of the same line measured from the other end, because the meridians converge toward the pole.

**Grid bearings** are referenced to the grid north of a particular projection — for surveyors in the United States, almost always the State Plane Coordinate System (SPCS). Grid bearings are constant along a straight grid line: the forward and back grid bearings of the same line differ by exactly 180°. Grid bearings differ from geodetic bearings by the **convergence angle**, which varies with longitude across the zone.

**Assumed bearings** are referenced to an arbitrary direction declared by the surveyor — most often by holding one boundary line at a stated bearing and rotating everything else into that frame. They are valid only within the survey itself; they have no relationship to north outside the document.

## Indiana state plane bearings

Indiana is divided into two State Plane zones (see the [state plane Indiana quick reference](../coordinate-systems/state-plane-indiana-quick-reference.md)):

- **Indiana East (FIPS 1301)** — central meridian 85°40' W; covers the eastern half of the state, including Marion, Hamilton, Hancock, Madison, and Shelby counties.
- **Indiana West (FIPS 1302)** — central meridian 87°05' W; covers the western half, including Hendricks, Boone, Morgan, and Johnson counties.

Both zones use a Transverse Mercator projection on NAD83. Modern realizations are NAD83(2011) epoch 2010.0; older work may be NAD83(86) or NAD83(HARN). The realization changes coordinates by inches; bearings change less but the basis statement should still cite the realization.

A "grid bearing" in Indiana means a bearing measured in either the East or the West zone — they are not interchangeable. State the zone every time.

## How to state the basis

Declare the basis on the plat in a single, unambiguous sentence. Include datum, zone, realization, and the controlling line:

- "The basis of bearings for this survey is the Indiana State Plane Coordinate System, East Zone (FIPS 1301), NAD83(2011) epoch 2010.0, derived from GNSS observations on station ABCD (PID xxxxxx). The South line of Section 14-T16N-R4E was held as North 89°53'27" East, grid."
- "Bearings are based upon Indiana State Plane West Zone, NAD83(2011), determined by static GNSS observation at the project site on [date]."
- "Bearings are assumed; the East line of the Northeast Quarter of Section 9-T17N-R3E was assumed to bear North 00°00'00" East. This basis has no geodetic meaning."

The same basis statement appears on the plat and in the legal description. If a description is rotated to match an older deed (a common compatibility move), state that explicitly.

## Convergence and grid-vs-geodetic differences

The convergence angle γ at a point is approximately:

γ ≈ (λ - λ₀) · sin(φ)

where λ is the longitude of the point, λ₀ is the central meridian of the zone, and φ is the latitude. In central Indiana the convergence is small but non-zero; near the zone edges it can exceed half a degree. **Geodetic bearings and grid bearings differ by γ.** A line that runs East-West "true" has a slightly different grid bearing depending on where in the zone it sits.

For a single project, convergence is usually treated as constant. For multi-county or zone-edge work, it is not.

## Practical conventions

- **Mixing bases is forbidden in a single description.** All courses use one basis.
- **State plane bearings vs ground geometry.** If your basis is grid, your bearings are grid; your distances may still be ground (if you held ground distances on the field calls). State the distance basis as well: "Distances are ground at average project elevation 825 feet, combined scale factor [x]."
- **Re-bearing old descriptions.** When a 1953 description is incorporated by reference into a new plat, do not silently re-bear it; instead include the old basis verbatim and add a separate "current" basis statement.
- **Rotation between deeds.** It is common to find two adjoining deeds whose bearings differ by 1° or more — they were tied to different references. Note the rotation when comparing, but do not "correct" a deed you do not own.

## Common pitfalls

- Stating "Indiana State Plane" without naming the zone.
- Citing NAD83 without the realization.
- Mixing magnetic bearings (from a hand compass) into a description without saying so. Magnetic bearings are time-dependent and should not be used in modern descriptions.
- Forgetting to state the distance basis when bearings are grid; readers assume grid distances unless told otherwise.

## Related

- [State plane Indiana quick reference](../coordinate-systems/state-plane-indiana-quick-reference.md)
- [Combined scale factor](../coordinate-systems/combined-scale-factor.md)
- [NAD83 vs NAD83(2011) vs WGS84](../coordinate-systems/nad83-vs-2011-vs-wgs84.md)
