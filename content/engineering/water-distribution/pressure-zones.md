---
title: "Pressure Zones"
section: "engineering/water-distribution"
order: 60
visibility: public
tags: [water, distribution, pressure-zone, prv, booster]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Water Works (Ten States Standards), 2018 ed., §8.2"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "AWWA M32, Computer Modeling of Water Distribution Systems, 4th ed."
    url: https://www.awwa.org/Store/Product-Details/productId/73587
    verified: 2026-05-06
---

> **TL;DR**
> 1. Maintain static pressure between **40 and 80 psi** at all services under normal conditions. Residual pressure must stay above **20 psi** during fire flow and above **35 psi** during peak-hour demand.
> 2. Where terrain or system hydraulics push static pressure above **80 psi**, install a **pressure-reducing valve (PRV) station** to create a lower-pressure zone. Where pressure drops below **40 psi**, use a **booster pump station** or a separate higher-elevation supply.
> 3. A pressure zone is defined by a single hydraulic grade line (HGL) — every service in the zone sees pressure set by the difference between the HGL and its ground elevation.
> 4. Elevated storage (water tower or standpipe) sets the HGL for its zone. The tank overflow elevation equals the HGL. Size storage for equalization + fire flow + emergency reserve.

## Pressure criteria

Ten States §8.2.1 and AWWA best practice set the following pressure targets:

| Condition | Minimum | Maximum | Notes |
|---|---|---|---|
| Normal static | 40 psi | 80 psi | Measured at the service meter |
| Peak-hour demand | 35 psi | — | At the most distant or highest service |
| Fire flow (MDD + fire) | 20 psi | — | At the flowing hydrant |
| Static (absolute max) | — | 100 psi | Above 80 psi a PRV at the service is required by most plumbing codes |

Pressure above 80 psi causes fixture damage, leaks, and water waste. Pressure below 35 psi causes customer complaints; below 20 psi creates cross-connection and backsiphonage risk.

## What defines a pressure zone

A pressure zone is a contiguous portion of the distribution system that is served by a single hydraulic grade line (HGL). The HGL is set by:

- The **overflow elevation of an elevated storage tank** (water tower, standpipe) — when the tank is full, the HGL equals the tank overflow elevation. As the tank drains, the HGL tracks the tank water surface.
- The **set-point pressure of a PRV station** — downstream of the PRV, the HGL equals the PRV discharge pressure converted to an elevation at the PRV location.
- The **discharge pressure of a booster pump** — the pump raises the HGL for the zone it feeds.
- The **hydraulic grade at a supply point** (well, treatment plant clearwell, transmission main entry point).

Every service in the zone sees a static pressure equal to `(HGL elevation - service ground elevation) x 0.433 psi/ft`.

## PRV stations

A PRV station reduces pressure at the boundary between a high-pressure zone and a lower-pressure zone. Design elements:

- **PRV sizing** — select for the range of flows the station will see, from minimum nighttime domestic demand to maximum-day demand plus fire flow. A common configuration is a **small PRV** (2 in to 4 in) for low-flow conditions and a **large PRV** (6 in to 12 in) that opens at higher demands.
- **Set point** — the downstream pressure set point, typically 50 to 70 psi depending on the zone topography.
- **Upstream strainer** — Y-strainer to protect the PRV pilot circuit. Size the strainer so headloss at peak flow is less than 2 psi.
- **Isolation valves** — upstream and downstream of the PRV and strainer, for maintenance shutoff.
- **Bypass** — a manually operated bypass valve (normally closed) that allows flow if the PRV fails. Size the bypass to carry at least average-day demand.
- **Vault or building** — below-grade vault (precast or cast-in-place) or above-grade building, with drainage, ventilation, and security.
- **Pressure gauges and telemetry** — upstream and downstream pressure gauges, with SCADA reporting for larger stations.

### PRV failure modes

- **PRV fails open** — downstream pressure rises to the full upstream HGL. Services may see 100+ psi, causing pipe and fixture damage. Install a **pressure relief valve** downstream to limit the overpressure, and alarm the SCADA system.
- **PRV fails closed** — downstream zone loses supply. The bypass valve must be opened manually. Some utilities install a pressure-sustaining valve on the bypass that opens automatically at a low-pressure set point.

## Booster pump stations

Where the system HGL is too low to maintain adequate pressure (hilltop neighborhoods, areas far from the supply source), a booster pump station raises the HGL for the downstream zone.

- **Pumps** — variable-speed drives (VFDs) are standard to match pump output to demand and avoid pressure surges. Duplex pumps (each sized for average demand; both running for fire flow) with a common discharge header.
- **Suction pressure** — must not drop below about 20 psi on the suction side to prevent cavitation and negative pressures that could pull contaminants into the main.
- **Check valve** — on the pump discharge to prevent backflow when the pump is off.
- **Pressure tank** — a small hydropneumatic tank on the discharge side may be needed to prevent rapid cycling at low demand.

## Elevated storage

An elevated storage tank (water tower) or ground-level tank with pumps serves three purposes:

- **Equalization** — stores water during low-demand periods and releases it during peak demand, smoothing the load on the supply system.
- **Fire flow** — provides the required fire-flow volume at the required pressure without relying solely on pumps.
- **Emergency reserve** — maintains supply during power outages or supply disruptions.

### Sizing

Ten States §7 and AWWA M32 provide sizing guidance:

- **Equalization volume** — the difference between peak-hour and average demand, integrated over the peak period. A common shortcut: 25% of maximum daily demand.
- **Fire-flow volume** — required fire flow (gpm) multiplied by the required duration (hours). For a 1,500 gpm fire flow for 2 hours: 1,500 x 120 = 180,000 gallons.
- **Emergency volume** — at least 1 day of average daily demand for small systems; the utility's vulnerability assessment drives the value for larger systems.

The tank overflow elevation sets the HGL. The tank bottom (or the minimum operating level) must be high enough that residual pressure stays above 20 psi during the fire-flow drawdown at the lowest service in the zone.

## Zone boundary design

At zone boundaries:

- **Closed boundary** — a PRV station or check valve separates the zones. Flow crosses the boundary only through the station. This is the most common arrangement.
- **Open boundary with booster** — a booster pump station feeds the higher zone from the lower zone. The pump runs whenever the higher zone needs supply.
- **Interconnection** — an emergency interconnection with manual valves allows zones to be linked during maintenance or emergencies. Normally closed.

Show zone boundaries on the utility system map and in the hydraulic model. Label each zone with its HGL elevation and the controlling storage or supply point.

## Common review issues

- Service at an elevation of 900 ft with an HGL of 920 ft — static pressure is only 8.7 psi. Below the 40 psi minimum; the service needs a higher zone or a booster.
- PRV station with no bypass — if the PRV fails closed, the zone loses water.
- Elevated tank overflow at 1,050 ft serving a service at 810 ft — static pressure is 104 psi. Exceeds 80 psi; a PRV at the service or a separate low-pressure zone is required.
- Booster pump with no check valve — when the pump shuts off, water flows backward and the higher zone drains.
- No fire-flow storage analysis — even if the tank is large, confirm that the fire-flow drawdown does not drop the HGL below the 20-psi residual at the critical node.

## Related

- [Demand estimation](demand-estimation.md)
- [Pipe sizing and velocity](pipe-sizing-velocity.md)
- [Valves](valves.md)
- [EPANET](epanet.md)
- [Ten States Standards (water)](ten-states-standards-water.md)
