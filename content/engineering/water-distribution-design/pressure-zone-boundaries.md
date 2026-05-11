---
title: "Pressure Zone Boundaries (HGL, surge triggers)"
section: "engineering/water-distribution-design"
order: 30
visibility: public
tags: [pressure-zone, hgl, hydraulic-grade-line, surge, prv, booster, ten-states]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePressurePipeNetwork, EditPressurePipeNetwork]
relatedCalculators: [hazen-williams, surge-joukowsky]
updated: 2026-05-11
sources:
  - title: "Recommended Standards for Water Works (Ten States Standards Water), 2018 ed., §8.2"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "AWWA M31 (Distribution Network Analysis for Water Utilities), 3rd ed."
    url: https://www.awwa.org/Store/Product-Details/productId/13107"
    verified: 2026-05-11
  - title: "AWWA M11 (Steel Water Pipe), 5th ed., Chapter on Surge"
    url: https://www.awwa.org/Store/Product-Details/productId/56329221"
    verified: 2026-05-11
  - title: "Indiana 327 IAC 8 (Public Water Supply)"
    url: https://www.in.gov/legislative/iac/title327.html
    verified: 2026-05-11
---

> **TL;DR**
> 1. Pressure zones keep customer static pressure between **35 psi minimum** (most utilities; Ten States §8.2.1 requires ≥ 20 psi during fire flow) and **80 psi maximum** without a PRV (Ten States §8.2.1, IPC 604.8). Customers with > 80 psi at the meter require a pressure-reducing valve.
> 2. A new pressure zone is typically introduced when the **elevation spread within a zone exceeds about 110 ft** (≈ 47 psi), or when high spots fall below the 35 psi target during MDD.
> 3. Surge analysis is triggered when **velocity changes by more than ~2 ft/s** rapidly (pump trip, fast valve closure) or for any force main / transmission main longer than ~1,000 ft; the Joukowsky shock `dP = ρ a dV` is the upper bound.

## Why pressure zones exist

A single zone with HGL = 1,050 ft serving customers from ground = 920 ft (top of hill) to 820 ft (bottom of valley) gives:

- 130 ft head × 0.433 = 56.3 psi at the top — comfortable.
- 230 ft head × 0.433 = 99.6 psi at the bottom — exceeds 80 psi, requires PRV at every service.

If the valley is large, it is cheaper to split into a lower zone fed by a PRV station or a separate tank. If the hill is large, a booster pumps to an upper zone with a higher HGL.

## Pressure targets

| Condition | Pressure (psi) | Source |
|---|---|---|
| Normal min static at meter | 35 | AWWA M31, most Indiana utilities |
| Min during MDD + fire flow | 20 | Ten States §8.2.1 |
| Min during MDD (no fire) | 30 | AWWA M31 |
| Max static at meter (no PRV at customer) | 80 | Ten States §8.2.1; IPC 604.8 |
| Max in mains (working) | typically 150 | Pipe rating; DR-18 PVC limit |
| Max transient (surge) | 1.5 × working | AWWA M11; pipe-rating cap |

## Elevation spread limit

A working rule: a pressure zone spans about **110 ft of elevation difference** to keep within the 35-80 psi window without PRVs. Many Indiana communities run wider zones (130-150 ft) and accept PRVs at services where ground falls below the spread limit.

Example: zone HGL = 1,000 ft. Top of zone (highest customer) at 920 ft -> 35 psi. Bottom of zone at 815 ft -> 80 psi. Total elevation spread = 105 ft. Add a service on a hill at 940 ft -> only 26 psi (below 35 psi target) — must boost, drop the customer's elevation, or expand the zone HGL (which puts low-zone customers over 80 psi).

## When to add a PRV station

- Customer ground elevation falls more than 110 ft below the elevated tank's overflow.
- Static pressure at the lowest service exceeds 80 psi.
- A new development is in a different drainage basin from the existing main tank.

Typical PRV station: two parallel PRVs (one large for normal demand, one small for low-flow), strainer, pressure gauges upstream and downstream, isolation valves, vault with drain. Many Indiana utilities require SCADA monitoring (downstream pressure, flow).

## Booster stations

Drive the upper zone HGL high enough that:

`HGL_upper ≥ ground_top + (35 psi / 0.433) = ground_top + 81 ft`
`HGL_upper ≤ ground_lowest + (80 psi / 0.433) = ground_lowest + 185 ft`

Storage tank in the upper zone is preferred over a hydro-pneumatic booster because it provides fire-flow capacity without the booster running. Where storage is not feasible, AWWA M31 allows hydropneumatic systems with redundant pumps and surge tanks for small developments.

## Surge analysis

The Joukowsky equation (rapid-closure upper bound):

`dP = ρ a dV`

With ρ = water density (1.94 slugs/cf), a = pressure wave celerity (typically 2,500-4,000 ft/s for PVC, higher for ductile iron and steel), dV = velocity change (ft/s):

`dH = a dV / g`

For a = 3,500 ft/s and dV = 5 ft/s: `dH = 3,500 × 5 / 32.2 = 543 ft = 235 psi`. Most pipe pressure ratings (DR-18 PVC = 235 psi working; DR-14 = 305 psi) cannot tolerate this on top of working pressure.

### Surge triggers

Run a full transient analysis when:

- A pump trip is possible on a force main or transmission main > 1,000 ft.
- A valve closes in less than 2 L / a (the "critical time"; faster than this is effectively instantaneous closure).
- A check valve is downstream of a pump on a long discharge line.

Wave speed `a` for typical materials:

| Material | Approximate a (ft/s) |
|---|---|
| DR-18 PVC, 6 in | 1,500-1,800 |
| DR-18 PVC, 12 in | 1,400-1,700 |
| Ductile iron, lined | 3,500-4,000 |
| Steel | 3,500-4,000 |
| HDPE DR-11 | 700-900 |

(These depend on diameter, wall thickness, and modulus; consult AWWA M11 / AWWA M55 for exact values.)

### Surge mitigation

- Slow-closing check valves (3-10 s closure).
- Pressurized surge tank or air chamber.
- Vacuum-relief / air-release valves at high points.
- Bypass loop around the pump for upsurge relief.

## Worked example

Subdivision on a 90-ft tall hill. Existing single-zone HGL = 920 ft from a tank, ground at top of hill = 845 ft (residual 32.5 psi — under the 35 psi target). MDD at the top services = 0.30 cfs in a 6-in main, length 1,800 ft from the main; head loss at C = 120 ≈ 5 ft. Pressure at MDD = (920 - 5 - 845) × 0.433 = 30.3 psi.

Below 30 psi at MDD — fails for both the 35 psi static target and the 30 psi MDD target. Two options:

1. Booster station feeding an upper zone with HGL = 980 ft (60 ft higher). Static at top = (980 - 845) × 0.433 = 58.5 psi. Requires elevated tank or hydro-pneumatic storage.
2. Re-route customers to the existing upper zone if one exists nearby.

Option 1 selected. Booster: two duplex centrifugal pumps, firm capacity = MDD + fire flow = 0.30 + 1,000 gpm/449 = 2.53 cfs total. Each pump rated 2.53 cfs at 60-ft TDH. Add a 50,000-gal storage tank for fire flow (1,500 gpm × 2 hr / 7.48 × 0.6 fill = ~30,000 gal usable plus margin).

(Final pump curve and storage sized in the design report.)

## Common review comments

- Static pressure at the highest service is 27 psi — fails 35 psi target. Add a booster or expand the zone HGL.
- Two PRV settings on the same station 20 psi apart — they will hunt; spread them by ≥ 5 psi.
- 6-in transmission main runs 2 miles at 4 ft/s with no surge analysis on pump-trip — required.
- Wave speed computed for thick-wall steel applied to PVC — use the right material/diameter table.

## Related

- [Pressure zones (breadth)](../water-distribution/pressure-zones.md)
- [Demand estimation (breadth)](../water-distribution/demand-estimation.md)
- [Fire-flow requirements](fire-flow-requirements.md)
- [Looping, redundancy, and dead-ends](looping-redundancy-and-deadends.md)
- [Hazen-Williams calculator](/tools/hazen-williams)
- [Surge (Joukowsky) calculator](/tools/surge-joukowsky)
