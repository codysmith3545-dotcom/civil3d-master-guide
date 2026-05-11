---
title: "CEU Module 2 - Coordinate Systems and Datums"
section: "ceu"
order: 2
visibility: public
tags: [ceu, indiana, professional-development, datums, state-plane]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
ceu:
  hours: 1.0
  category: technical
  format: self-study
  approval_status: pending
  approval_body: "Indiana State Board of Registration for Surveyors"
  approval_id: null
sources:
  - title: "NGS - Geodetic Tool Kit and State Plane Coordinate System"
    url: https://geodesy.noaa.gov/SPCS/
    verified: 2026-05-11
  - title: "NOAA - VERTCON 3.0 and Vertical Datums"
    url: https://geodesy.noaa.gov/TOOLS/Vertcon/vertcon.html
    verified: 2026-05-11
  - title: "Indiana State Plane Coordinate System (East/West zones)"
    url: https://www.in.gov/dnr/water/
    verified: 2026-05-11
---

> **TL;DR**
> 1. **NAD27** is the legacy horizontal datum (Clarke 1866 ellipsoid, fixed at Meades Ranch, KS). **NAD83** is the current realization (GRS80 ellipsoid), with periodic adjustments (1986, HARN, 2007, 2011). Differences in Indiana run roughly tens of meters; never mix datums.
> 2. **NGVD29** is the legacy vertical datum. **NAVD88** is the current vertical datum; the offset in Indiana is roughly **-0.3 to -0.5 ft** (NAVD88 is below NGVD29). Verify locally with the NGS **VERTCON** tool.
> 3. Indiana has **two State Plane zones**: **East (FIPS 1301)** for the eastern half, **West (FIPS 1302)** for the western half. The boundary runs roughly along the western edge of Putnam, Owen, Greene, Daviess, Pike, and Warrick counties.
> 4. A new National Spatial Reference System (NSRS) is being deployed to replace NAD83/NAVD88. Until the new datums are official in Indiana, continue using NAD83(2011) and NAVD88 unless a project deliverable specifies otherwise.

## Learning objectives

- State the ellipsoid and origin of NAD27 and NAD83.
- Convert between NGVD29 and NAVD88 elevations using NGS VERTCON.
- Identify which Indiana counties are in the East zone versus the West zone.
- Recognize when a project requires a Combined Scale Factor (CSF) to convert grid distances to ground distances.

## Reading

### 1. Horizontal datums

A geodetic datum is a mathematical model of the Earth that lets us assign coordinates to points on it. Two pieces are needed: an **ellipsoid** (the size and shape of the model) and a **realization** (where the ellipsoid is anchored to the actual Earth).

**NAD27** (North American Datum of 1927) uses the **Clarke 1866 ellipsoid**, anchored at Meades Ranch, Kansas. NAD27 coordinates were computed by hand-adjusted triangulation networks and are accurate to roughly a few meters at the network level, but with sometimes large local distortions. NAD27 should be considered a historical datum; modern survey projects do not deliver in NAD27 except when required by a legacy reference (an old plat, an old subdivision tied to NAD27 station coordinates).

**NAD83** (North American Datum of 1983) uses the **GRS80 ellipsoid** and is geocentric (origin near the Earth's center of mass). NAD83 has been re-realized several times:

- **NAD83(1986)** - the original.
- **NAD83(HARN)** - High Accuracy Reference Network, mid-1990s.
- **NAD83(NSRS2007)** - readjusted with CORS data.
- **NAD83(2011)** - epoch 2010.0; the current realization used by NGS.

Differences between NAD27 and NAD83 in Indiana are on the order of 10-30 m horizontally. Differences between NAD83 realizations are typically a few centimeters - small but enough to matter on high-precision control.

### 2. Vertical datums

The vertical datum is independent of the horizontal datum.

**NGVD29** (National Geodetic Vertical Datum of 1929) is a tidally-referenced datum derived from a least-squares adjustment of differential leveling tied to 26 tide gauges. NGVD29 is the legacy datum on most pre-1990 plans in Indiana.

**NAVD88** (North American Vertical Datum of 1988) is referenced to a single tide gauge at Father Point, Quebec. NAVD88 is the official vertical datum of the United States and the datum required for FEMA Flood Insurance Rate Maps in Indiana.

The **NGVD29-to-NAVD88 offset** is location-specific. Across Indiana the offset typically runs **-0.3 ft to -0.5 ft**, meaning an elevation labeled "100.00 NGVD29" corresponds roughly to "99.5-99.7 NAVD88." Never apply a single number across a project area; use NGS **VERTCON** (linked above) to compute the local offset.

A new vertical datum, **NAPGD2022**, will replace NAVD88 in the next NSRS modernization. Until NGS publishes the rollout for Indiana, projects should remain on NAVD88.

### 3. Indiana State Plane Coordinate System (SPCS)

The State Plane Coordinate System projects the geodetic ellipsoid onto a developable surface (Lambert or Transverse Mercator) so that small areas can be treated as if they were on a plane.

Indiana uses the **Transverse Mercator** projection with two zones:

- **Indiana East (FIPS 1301)** - covers approximately the eastern 2/3 of the state.
- **Indiana West (FIPS 1302)** - covers approximately the western 1/3 of the state.

The boundary between the zones is a north-south line running approximately along the western boundaries of Lake, Porter, Newton, Jasper, White, Carroll, Tippecanoe, Fountain, Vermillion (W zone), versus Putnam, Owen, Greene, Daviess, Pike, Warrick (boundary line lies between). The authoritative boundary description is in NGS publications; consult the NGS SPCS page for the exact county list.

Linear units: SPCS 83 in Indiana is typically delivered in **U.S. Survey Feet**, though INDOT projects increasingly use **International Feet** or meters. Always confirm units in the project's coordinate reference statement; the difference is 2 ppm and will show on long lines.

### 4. Grid vs ground

A State Plane coordinate is a **grid** coordinate. The distance between two grid coordinates does not equal the distance you would tape on the ground for two reasons:

1. **Scale factor (k)** - how the projection stretches or shrinks distance relative to the ellipsoid. Always less than 1.0 at the central meridian of a Transverse Mercator zone; greater than 1.0 near the zone edges.
2. **Elevation factor** - the ratio of the ellipsoid distance to the ground distance. Above the ellipsoid, ground distances are longer than ellipsoid; below, they are shorter. In Indiana, all ground is above the ellipsoid, so the elevation factor is always less than 1.0.

The **Combined Scale Factor (CSF)** is the product:

```
CSF = k * (R_ellipsoid / (R_ellipsoid + H))
```

where H is the orthometric elevation (close enough; geoid height applies a small correction). For typical Indiana ground (250-300 m elevation), CSF is approximately **0.99990 to 0.99996**. To convert a grid distance to a ground distance:

```
ground = grid / CSF
```

The **state-plane-indiana** calculator on this site computes CSF from latitude, longitude, and elevation. For most projects, computing a single project CSF at the centroid is acceptable; for long linear projects (highways, pipelines), the CSF should be computed at multiple points and Civil 3D's drawing scale set accordingly.

### 5. Civil 3D drawing settings

In Civil 3D 2024-2026, drawing coordinate settings live under **Settings > Drawing Settings**:

- **Zone** - pick the NGS-published zone (NAD83(2011) - Indiana East, U.S. Survey Foot).
- **Transformation** - tick **Apply transform settings**, then enter the Combined Scale Factor as a **fixed scale** or a **reference point + scale**.
- **Object Layers** - unrelated to projection but ties to NCS layer naming, see Module 6.

Civil 3D will then accept grid coordinates from a points file and display them as ground in the drawing while preserving the grid coordinate for export. Do not "scale the drawing" with `SCALE` to make ground coordinates match grid; that breaks the transform.

## Self-assessment

<details>
<summary>Question 1</summary>

A 1955 plat shows a benchmark elevation of "725.40, mean sea level." The contemporary engineer needs the elevation in NAVD88 to design a sanitary outfall connection. What is the correct approach?

**Answer:** Treat "MSL" on a 1955 plat as NGVD29. Run NGS VERTCON for the project location to get the local NGVD29-to-NAVD88 offset (commonly -0.3 to -0.5 ft in Indiana), then apply it. Do not assume a single statewide number.
</details>

<details>
<summary>Question 2</summary>

A project in Hendricks County has a centroid CSF of 0.99993. The plan calls for a 1,000.00-ft tangent on the ground. What is the grid distance?

**Answer:** Grid = ground * CSF = 1000.00 * 0.99993 = 999.93 ft.
</details>

<details>
<summary>Question 3</summary>

Which Indiana SPCS zone covers Marion County?

**Answer:** Indiana East (FIPS 1301).
</details>

<details>
<summary>Question 4</summary>

True or false: A NAD83(2011) coordinate and a NAD83(1986) coordinate at the same physical point will differ by tens of meters.

**Answer:** False. Differences between NAD83 realizations are typically a few centimeters; tens of meters is the order of difference between NAD27 and NAD83.
</details>

## Cited sources

1. NGS, *State Plane Coordinate System of 1983*, NOAA Manual NOS NGS 5.
2. NGS VERTCON 3.0 documentation.
3. FGCC, *Standards and Specifications for Geodetic Control Networks*.
4. Civil 3D Drawing Settings documentation (Autodesk Knowledge Network, 2024-2026 versions).

## Time log

Estimated 50 minutes of focused study plus 10 minutes of self-assessment. Total: 1.0 PDH.
