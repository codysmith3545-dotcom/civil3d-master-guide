---
title: "Force Mains and Lift Stations"
section: "engineering/sanitary-sewer"
order: 50
visibility: public
tags: [sanitary, sewer, force-main, lift-station, pump]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §71–77"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "IDEM Construction Permit Program — Lift Station Guidance"
    url: https://www.in.gov/idem/permits/water/wastewater-permits/
    verified: 2026-05-06
  - title: "Hydraulic Institute Standards (ANSI/HI), Rotodynamic Pumps"
    url: https://www.pumps.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Use a lift station (pump station) when gravity flow to the receiving sewer or treatment plant is not feasible due to topography or depth constraints. The pump pushes sewage through a **force main** (pressurized pipe) to a higher discharge point.
> 2. **Force main sizing**: velocity between **2.0 ft/s** (minimum, to prevent solids settling) and **8.0 ft/s** (maximum, to limit headloss and scour). Minimum diameter is **4 in** (Ten States §72.3).
> 3. Lift stations require **duplex pumps** (two pumps, each capable of handling peak flow with one pump out of service), **emergency backup power** (generator or engine-driven pump), and **telemetry/alarm** (Ten States §72).
> 4. Indiana (IDEM) requires a construction permit for any new or modified lift station. The permit application includes a capacity analysis, backup power plan, and alarm notification protocol.

## When gravity is not feasible

Gravity is always preferred for sanitary sewers — no moving parts, no power consumption, minimal maintenance. A lift station is required when:

- The receiving sewer or treatment plant is at a higher elevation than the contributing area and no practical gravity route exists.
- A gravity sewer would require excessive depth (generally > 25 ft) to maintain minimum slope across flat terrain.
- The site is separated from the gravity system by a ridge, highway, or watercourse that cannot be crossed with a gravity sewer at feasible depth.
- An interim connection is needed before a gravity trunk is extended (temporary pump station).

## Lift station types

### Submersible wet-well

The most common type for small to medium municipal stations (up to about 2 mgd). Pumps are installed in a below-grade wet well. Key features:

- **Wet well volume** — sized to limit pump cycles to a maximum of about 6 to 10 starts per hour per pump (more frequent cycling burns motor windings). Effective volume between pump-on and pump-off elevations is typically 5 to 15 minutes of average inflow.
- **Pump selection** — submersible non-clog pumps rated for 3-in solids passage minimum (Ten States §72.42). Select the pump so that the duty point falls in the upper half of the efficiency curve at design flow.
- **Guide rails** — pumps mount on guide rails and discharge into a volute/elbow at the wet-well floor. The pump can be removed from grade without entering the wet well.

### Dry-well / wet-well (duplex)

For larger stations (> 2 mgd) or where maintenance access is critical. Pumps sit in a dry chamber adjacent to the wet well. More expensive to build, but pumps are easier to service and the environment is less corrosive.

### Grinder / pressure sewer (individual)

Small grinder pumps at individual properties that discharge into a common low-pressure force main. Used in rural subdivisions where gravity sewers are impractical. Each pump is typically 2 hp, 1-in to 2-in discharge. Not covered in detail here — see the local utility's pressure-sewer standards.

## Duplex pumps and firm capacity

Ten States §72.41 requires **firm capacity** — the station must handle peak wet-weather flow with the largest pump out of service. For a duplex station (two pumps), each pump must handle 100% of peak flow. For a triplex station, any two of three pumps must handle peak flow.

**Peak flow** for lift station sizing is the same design flow used for gravity sewers upstream: `ADF x PF + I/I`. Add any future tributary area anticipated over the design life (typically 20 to 50 years).

## Force main sizing

Force main diameter is selected to keep velocity within the operating window:

| Flow (gpm) | 4 in (ft/s) | 6 in (ft/s) | 8 in (ft/s) | 10 in (ft/s) |
|---|---|---|---|---|
| 50 | 1.4 | 0.6 | — | — |
| 100 | 2.8 | 1.1 | 0.6 | — |
| 200 | 5.7 | 2.3 | 1.3 | 0.8 |
| 400 | — | 4.5 | 2.6 | 1.6 |
| 800 | — | — | 5.1 | 3.3 |
| 1,500 | — | — | — | 6.1 |

Select the diameter where velocity is between 2.0 ft/s (minimum for self-cleaning) and 8.0 ft/s (maximum for headloss and water hammer). Some Indiana utilities allow up to 10 ft/s for short force mains (< 1,000 ft).

### Headloss

Compute friction headloss with the Hazen-Williams or Darcy-Weisbach equation. For PVC force mains, Hazen-Williams C = 140 to 150 for new pipe; design with C = 130 to account for aging and biofilm. Add minor losses for bends, valves, and fittings (typically 10% to 20% of friction loss for short runs; compute explicitly for longer systems).

**Total dynamic head (TDH)** = static lift (elevation difference from wet-well pump-off level to the discharge point) + friction loss + minor losses.

## Air release and combination valves

Force mains trap air at high points, which reduces capacity and can cause surging. Install:

- **Air release valves** at every high point in the force main profile.
- **Combination air/vacuum valves** at high points and at the discharge end.
- **Valve vaults** — each air valve sits in a below-grade vault with a vented lid. Locate vaults in accessible areas (not under pavement if possible).

Ten States §72.3 requires air release valves; most Indiana utilities specify the combination type.

## Emergency backup power

Ten States §72.6 requires an **alternative power source** for all lift stations. Options:

- **Permanent standby generator** — sized to start and run all station loads (pumps, controls, HVAC, lighting). Transfer switch (automatic or manual) is required. Most Indiana cities require an automatic transfer switch (ATS) with exerciser.
- **Portable generator connection** — acceptable for small stations in some jurisdictions, with a transfer switch and a utility response plan that gets the generator on site within 2 to 4 hours.
- **Engine-driven pump** — a diesel or natural-gas engine drives one of the two pumps directly. Less common in new construction.

IDEM reviews the backup power plan as part of the construction permit. Stations serving more than about 200 connections typically require a permanent generator.

## Alarm and telemetry

Ten States §72.7 requires an alarm system. Standard provisions:

- **High-water alarm** — activated when the wet-well level reaches a set point above the pump-on elevation. Sends a signal to the utility's SCADA system or a remote dialer.
- **Pump failure alarm** — triggered by motor overload, loss of power, or no flow detected when the pump should be running.
- **Power failure alarm** — separate from pump failure; indicates loss of normal power.
- **Telemetry** — most Indiana utilities require cellular or radio SCADA integration with real-time monitoring of wet-well level, pump run time, flow, and alarm status.

Audio-visual alarms (strobe and horn) at the station are common in addition to remote notification.

## IDEM permitting

A new or modified lift station in Indiana requires an IDEM construction permit under 327 IAC 3-2. The application must include:

- Design flow calculations (ADF, peaking factor, I/I).
- Pump curves and selection data.
- Force main hydraulic analysis (TDH, velocity).
- Wet-well sizing and cycle-time calculations.
- Backup power plan.
- Alarm and notification protocol.
- Site plan showing setbacks, access, and floodplain status (stations must be above the 100-yr flood elevation or be floodproofed).

The permit review typically takes 60 to 90 days. Submit early in the design process; the permit must be issued before construction begins.

## Common review issues

- Single pump (simplex) station — fail; duplex minimum.
- Force main velocity below 2.0 ft/s at average flow — solids will settle; upsize the pump or reduce pipe diameter.
- No air release valve at a high point — flagged.
- Backup power plan is "portable generator available within 24 hours" — most agencies require 2 to 4 hours maximum, and many require permanent generators for anything beyond a handful of connections.
- Wet well too large — results in long retention time, septic conditions, and odor. Keep the effective volume between pump-on and pump-off to about 5 to 15 minutes of average inflow.
- Wet well too small — pump cycles exceed 10 per hour, shortening motor life.

## Related

- [Flow estimation](flow-estimation.md)
- [Pipe sizing and slopes](pipe-sizing-and-slopes.md)
- [Drop manholes](drop-manholes.md)
- [Service connections](service-connections.md)
- [Ten States Standards summary](ten-states-standards.md)
