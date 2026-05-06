---
title: "Pre-Survey Planning for Topographic Surveys"
section: "field-and-boundary/topographic-surveys"
order: 10
visibility: public
tags: [topo, planning, reconnaissance, utility-locate, indiana-811, equipment-selection]
updated: 2026-05-06
sources:
  - title: "Indiana 811 — Dig Law (IC 8-1-26)"
    url: https://www.indiana811.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Review the scope, visit the site, and call **Indiana 811** (or your state's one-call) at least 48 business hours before fieldwork — it is a legal requirement and protects your crew.
> 2. Build a **control network plan** before mobilizing: identify published benchmarks, plan GPS base locations or confirm RTK network coverage, and choose redundant check points.
> 3. Agree on a **field coding scheme** with the office before the crew leaves — codes that don't match the description key set produce manual rework.

## Scope review

Read the entire scope document, proposal, and any referenced plan sets before planning fieldwork. Look for:

- **Contour interval** and accuracy standard (e.g., 1 ft contours, ASPRS Class II).
- **Boundary extents.** Survey limits may differ from property lines. Confirm whether boundary is included or separate.
- **Underground utilities.** Does the scope require rim/invert shots, or only surface evidence? If inverts are needed, plan for manhole access, traffic control, and confined-space awareness.
- **Tree survey requirements.** Caliper threshold (commonly 6 in. DBH), species identification, drip-line shots, or point-only.
- **Deliverable format.** DWG with surface? LandXML? Contour PDF? This affects how you code and how dense you shoot.

## Site reconnaissance

Visit the site or study current aerial imagery before mobilizing. Note:

- **Access constraints.** Locked gates, occupied buildings, active roads. Determine whether ROE (right of entry) letters are needed.
- **Vegetation and visibility.** Dense canopy degrades RTK; thick underbrush slows conventional crews. Decide if the job needs machete work, drone supplement, or a winter survey window.
- **Traffic and safety.** Will you need traffic control, high-visibility vests, or a work-zone plan?
- **Control opportunities.** Look for stable, intervisible points for traverse setup or GPS base placement. Identify the closest NGS monument and any county/city benchmarks.
- **Terrain complexity.** Note walls, steep banks, water features, and structures that will need dense breakline shots.

## Utility locate request

In Indiana, file a locate request through **Indiana 811** at least two full business days (48 hours) before field work begins. The locate ticket is free; failing to call is a misdemeanor under IC 8-1-26.

- Request the ticket online at indiana811.org or by dialing 811.
- The utility owners will mark their facilities within the response window.
- If marks are absent or incomplete on the day of the survey, contact 811 again before digging or probing.
- Photograph utility marks if you plan to include them in the survey. Locate marks are approximate (typically 18 to 24 in. tolerance); do not rely on them for horizontal pipe position.

## Control network plan

Before mobilizing, decide:

1. **Horizontal datum and projection.** State plane, zone, realization (e.g., NAD83(2011), Indiana East).
2. **Vertical datum.** NAVD88, with geoid model noted (Geoid18).
3. **Control source.** Published NGS marks, county control, project-specific monuments, or CORS-derived.
4. **Base station or network RTK.** If using a local base, choose a setup location with clear sky and security. If using a network (e.g., Indiana CORS, SmartNet, KeyNet), confirm subscription is active and test coverage at the site.
5. **Redundancy.** Set at least two control points on site that can be re-occupied. Check into a known benchmark at the start and end of the day.

## Equipment selection

Match equipment to scope and conditions:

| Condition | Recommended primary | Notes |
|---|---|---|
| Open site, 1 ft contours | GNSS RTK rover | Fastest for open ground |
| Heavy canopy or urban canyon | Robotic total station + prism | GNSS will not fix reliably |
| Large site, dense topo | Drone (Part 107) or mobile LiDAR | Supplement with conventional for utilities/trees |
| Tight tolerance (0.1 ft contours) | Total station, static GPS control | RTK vertical noise too large |

Always bring a backup: a manual level and rod for vertical checks, a tape for structure ties, a distance meter for inaccessible measurements.

## Coding scheme

Before the crew departs, distribute a written code list that matches the Civil 3D description key set in use. The list should include:

- Feature code (e.g., `EP` for edge of pavement).
- Linework control commands (start, close, end, curve start).
- Attribute fields if using attribute-coded topography (tree diameter, pipe size).
- Codes for features the crew will encounter on this specific site.

See [field code conventions](field-code-conventions.md) for detailed guidance on code structure.

## Crew briefing

Hold a brief meeting (5 to 10 minutes) covering:

- Scope limits and accuracy requirements.
- Safety plan: traffic, confined space, terrain hazards.
- Control plan: base location, backsight, check shots.
- Coding scheme and any site-specific codes.
- Communication plan: radios, cell coverage, end-of-day check-in.
- Deliverable deadline and any client-specific notes.

## Related

- [Control for topos](control-for-topos.md)
- [Field code conventions](field-code-conventions.md)
- [Breakline strategy](breakline-strategy.md)
- [Drone topos](drone-topos.md)
- [Topo QA/QC](topo-qa-qc.md)
