---
title: "Valves in Water Distribution"
section: "engineering/water-distribution"
order: 30
visibility: public
tags: [water, distribution, valve, gate, butterfly, prv]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Water Works (Ten States Standards), 2018 ed., §8.4"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "AWWA M44, Distribution Valves: Selection, Installation, Field Testing, and Maintenance, 3rd ed."
    url: https://www.awwa.org/Store/Product-Details/productId/79565
    verified: 2026-05-06
  - title: "AWWA C509 (Resilient Seated Gate Valves) and AWWA C504 (Butterfly Valves)"
    url: https://www.awwa.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Gate valves** (resilient seated, AWWA C509/C515) are the standard isolation valve for mains up to 12 in. **Butterfly valves** (AWWA C504) are used for larger mains (16 in and above) and where space is limited.
> 2. Place isolation valves so that any segment can be shut down while affecting the **fewest customers** — the **n-1 rule** means a segment bounded by n valves can be isolated by closing n-1 of them. Typical spacing: **500 to 800 ft** in distribution grids.
> 3. **Pressure-reducing valves (PRVs)** regulate pressure at zone boundaries (see [pressure zones](pressure-zones.md)). **Air release valves** vent trapped air at high points. **Check valves** prevent backflow at pump discharges and interconnections.
> 4. All valves require a **valve box** accessible from grade, annual exercising, and a record in the GIS/asset-management system.

## Gate valves

Gate valves (resilient-seated, non-rising stem per AWWA C509 or C515) are the workhorse isolation valve in water distribution. They provide full-bore flow when open (minimal headloss) and a positive shutoff when closed.

- **Sizes**: 4 in through 12 in are standard. 14 in and 16 in gate valves exist but butterfly valves are more common at these sizes.
- **Turns to open**: typically 12 to 20 turns depending on size. Opening direction is counterclockwise (left) per AWWA convention — "left to open, right to close."
- **Operating nut**: standard 2-in square nut, accessible from grade through a valve box with an extension stem if needed.
- **Joint types**: mechanical joint (MJ) flanges, push-on joint ends, or flange-by-MJ. Match the joint type to the adjoining pipe.

### Where to place gate valves

- At every tee, cross, and branch in the distribution grid.
- On each leg of a tee — typically 3 valves at a tee (one on each leg) so that any one leg can be isolated.
- On each leg of a cross — typically 4 valves.
- On each side of a water main crossing a bridge, railroad, or major utility corridor.
- At the connection to an existing system (tie-in valve).
- On the branch to each fire hydrant (see [hydrant placement](hydrant-placement.md)).

### Spacing

Ten States §8.4.3 requires valves "at sufficiently close intervals to minimize inconvenience and sanitary hazard during repairs." In practice:

- **500 ft maximum** in commercial/industrial areas.
- **800 ft maximum** in residential areas.
- Shorter spacing where shutdowns affect critical facilities (hospitals, schools, data centers).

The **n-1 rule**: to isolate a pipe segment bounded by n valves, you close n-1 valves. For a tee with 3 valves, closing any 2 isolates one leg. Minimizing the number of customers within any single isolation zone is the design objective — the local utility may set a cap (e.g., no more than 25 services in one isolation zone).

## Butterfly valves

Butterfly valves (AWWA C504) are used for mains 16 in and larger, where a gate valve would be too heavy and expensive. They are also used in pressure-reducing valve (PRV) stations, pump stations, and meter vaults.

- **Quarter-turn operation** — faster to operate than a gate valve, but susceptible to water hammer if closed too fast. Install gear operators or actuators on valves 20 in and larger.
- **Headloss** — higher than a gate valve because the disc sits in the flow path. Account for the headloss in the hydraulic model.
- **Not suitable for throttling** unless specifically rated for it. Standard butterfly valves are for on/off isolation only.

## Pressure-reducing valves (PRVs)

PRVs reduce downstream pressure to a set point. Used at zone boundaries where the hydraulic grade from the supply zone exceeds the desired static pressure in the lower zone. See [pressure zones](pressure-zones.md) for station design.

Key specifications:

- **Pilot-operated, globe-pattern PRVs** (e.g., Cla-Val 90-01, Watts ACV) are the standard for distribution service.
- Size the PRV for the range of flows it will see — low-flow accuracy and high-flow capacity are both critical. Many stations use a small PRV and a large PRV in parallel.
- **Bypass** — a manually operated bypass valve allows flow if the PRV fails closed. Sized to carry at least the average-day demand; the bypass valve is normally closed.
- **Strainer** — a Y-strainer upstream of the PRV protects the pilot circuit from debris.

## Air release and vacuum valves

Air accumulates at high points in water mains and reduces hydraulic capacity, causes surging, and damages meters.

- **Air release valves** — small-orifice valves that vent air under pressure at high points in the pipeline profile. Typical 1-in or 2-in body.
- **Air/vacuum valves** — large-orifice valves that admit air during pipe draining and release air during filling. Prevent vacuum collapse.
- **Combination air valves** — combine air release and air/vacuum functions. Required by most Indiana utilities at every high point and at intervals of 1,000 to 2,000 ft on long, relatively flat force mains or transmission mains.

Install each air valve in a below-grade vault with a vented lid. In freezing climates (including Indiana) use a heated vault or an anti-freeze drain-back configuration to prevent the valve from freezing.

## Check valves

Check valves prevent reverse flow. Required at:

- **Pump discharges** — prevents backflow when the pump shuts off. Swing check (AWWA C508) is standard. Cushioned (non-slam) check valves reduce water hammer.
- **Interconnections between pressure zones** — prevents high-zone water from flowing into the low-zone supply when the booster pump is off.
- **Backflow prevention assemblies** — see [backflow](backflow.md) for cross-connection control devices, which incorporate check valves as part of a testable assembly.

## Altitude valves

Altitude valves control the level in elevated storage tanks. They close when the tank is full (to prevent overflow) and open when the tank is draining (to allow the tank to supply the system). Most modern installations use telemetry-controlled motorized valves rather than traditional hydraulic altitude valves.

## Valve exercising and maintenance

AWWA M44 recommends exercising all distribution valves **annually**. Exercising means fully opening and fully closing the valve, then returning it to its normal position. Exercising:

- Confirms the valve operates and can be found.
- Prevents stem corrosion and seat bonding.
- Updates the utility's GIS/asset database with the current valve condition.

Valves that cannot be fully closed or fully opened are scheduled for repair or replacement. A utility with a mature valve exercising program typically finds 3% to 8% of valves inoperable on any given cycle.

## Common review issues

- Three-legged tee with only 2 valves — one leg cannot be isolated without shutting down the entire tee.
- Valve spacing exceeds 800 ft in a residential area — add a valve.
- No valve on a hydrant branch — fail per Ten States §8.4.4.
- PRV station with no bypass — add a bypass valve.
- Air release valve missing at a high point — flagged on the profile review.

## Related

- [Pipe sizing and velocity](pipe-sizing-velocity.md)
- [Hydrant placement](hydrant-placement.md)
- [Backflow](backflow.md)
- [Pressure zones](pressure-zones.md)
- [Demand estimation](demand-estimation.md)
