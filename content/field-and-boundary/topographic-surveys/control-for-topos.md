---
title: "Control for Topographic Surveys"
section: "field-and-boundary/topographic-surveys"
order: 15
visibility: public
tags: [control, gps, rtk, benchmark, ngs, vertical-control, base-station]
updated: 2026-05-06
sources:
  - title: "NGS Datasheet Retrieval"
    url: https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl
    verified: 2026-05-06
  - title: "Indiana DOT Survey Manual — Control Surveys"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Every topo needs **at least two horizontal control points and one vertical benchmark** that can be re-occupied and checked. A single-point setup with no check is unacceptable.
> 2. Tie to **published control** (NGS, county, or INDOT) whenever practical. If you establish project control, document its relationship to published marks so the next surveyor can reproduce your coordinates.
> 3. Check into control at the **start and end** of each day. If your closing check exceeds 0.05 ft horizontal or 0.03 ft vertical, investigate before leaving the site.

## Control network hierarchy

Topographic surveys inherit their accuracy from the control they are tied to. From most authoritative to least:

1. **NGS published marks.** CORS stations, triangulation stations, and leveling benchmarks. Use the NGS Datasheet tool to find marks near the project.
2. **State/county monuments.** Indiana county surveyors maintain section corner monuments and sometimes local control networks. Marion County, Hamilton County, and others publish coordinate lists.
3. **INDOT project control.** For DOT projects, INDOT establishes control monuments with published coordinates and elevations.
4. **Project-specific control.** Points you set and coordinate yourself, tied to one of the sources above.

For most private-sector topos, tying to one or two NGS marks or county benchmarks and then establishing project control monuments is sufficient.

## GPS base station setup

When using a local RTK base station rather than a network:

1. **Choose a location** with unobstructed sky above 10 degrees elevation, away from multipath sources (buildings, fences, large vehicles).
2. **Occupy a known point** whenever possible. If occupying an unknown point, perform a static observation of at least 15 minutes and process against CORS to establish the base coordinate.
3. **Enter the base coordinate** in the correct datum, projection, and geoid model before broadcasting corrections. A wrong base coordinate shifts every shot by the same error.
4. **Monitor base health.** Check the number of satellites, PDOP, and battery throughout the day.

## Network RTK (VRS/CORS)

Indiana has several network RTK options: Indiana CORS (maintained by INDOT), KeyNet, and commercial networks such as SmartNet and Trimble VRS Now. When using a network:

- Confirm the network delivers corrections in your working datum (NAD83(2011)) and that the geoid model matches your project (Geoid18).
- Verify cell coverage at the site. Without a reliable data connection, you have no corrections.
- Perform an **initialization check** at a known point after each new fix. Compare horizontal and vertical to the known value. Accept only if the difference is within your tolerance (typically 0.05 ft H, 0.03 ft V for 1 ft contour work).
- Re-initialize periodically (every 1 to 2 hours or after any satellite loss) and check back into known control.

## Backsight checks

Whether using GNSS or total station, every session begins and ends with a check:

- **GNSS:** Occupy a known control point, record a position, and compare to the published value. Record the delta in your field notes.
- **Total station:** Set up on a known point, sight a known backsight, and verify the angle, distance, and elevation. If using a resection, check a third known point after computing the station position.

Acceptable closure depends on the project specification. For general 1 ft contour topographic surveys:

| Check | Typical tolerance |
|---|---|
| Horizontal position | 0.05 ft |
| Vertical elevation | 0.03 ft |
| Backsight angle | 5 seconds |
| Backsight distance | 0.02 ft |

## Redundant control

Set at least two intervisible project control points that the crew can re-occupy on any return trip. Mark them with mag nails, rebar and caps, or PK nails in stable surfaces (curb, concrete, asphalt). Record their coordinates and descriptions in the project file.

Redundant control protects against:

- A single monument being disturbed or destroyed during construction.
- Errors in the base coordinate propagating undetected.
- Future surveys needing to tie back without repeating your GPS work.

## Vertical benchmarks

Vertical accuracy often controls the quality of a topo more than horizontal accuracy. For 1 ft contours, you need vertical accuracy of approximately 1/3 the contour interval (0.3 ft or better, though many firms target 0.15 ft).

- Use a **published NAVD88 benchmark** as your primary vertical reference.
- If the nearest benchmark is far away, establish a local benchmark by differential leveling from the published mark or by a long-occupation GNSS session with geoid modeling.
- Run a **level loop** to verify your benchmark if the published elevation is suspect (disk heaved, old adjustment).
- For high-accuracy work (0.5 ft contours or tighter), consider running a closed level loop from a published BM through your project control rather than relying solely on GNSS-derived elevations.

## Tying to published control

When connecting to NGS or county marks:

1. Search the NGS database for marks within a few miles of the site. Filter for marks with NAVD88 elevations and NAD83(2011) coordinates.
2. Verify the mark is **recoverable.** Many NGS marks are destroyed, disturbed, or buried. Check the recovery notes on the datasheet.
3. Physically recover the mark before relying on it. Verify the stamping matches the datasheet.
4. If using GNSS, occupy the mark and compare your solution to the published coordinate. A large discrepancy (more than 0.1 ft) may indicate the mark has moved, your equipment is misconfigured, or the published value uses a different adjustment.

## Documentation

Record the following in your project file and field notes:

- Datum, projection, zone, realization, epoch.
- Geoid model.
- List of all control points: name, coordinate, elevation, source, how established.
- Base station location and coordinate (if local base).
- Network RTK provider and mount point (if network).
- Every check-in and check-out observation with computed deltas.

## Related

- [Pre-survey planning](pre-survey-planning.md)
- [Field code conventions](field-code-conventions.md)
- [Datums and projections](../coordinate-systems/datums-and-projections.md)
- [State plane Indiana quick reference](../coordinate-systems/state-plane-indiana-quick-reference.md)
- [Topo QA/QC](topo-qa-qc.md)
