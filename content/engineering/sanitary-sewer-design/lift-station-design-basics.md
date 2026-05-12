---
title: "Lift Station Design Basics"
section: "engineering/sanitary-sewer-design"
order: 50
visibility: public
tags: [lift-station, pump-station, wet-well, firm-capacity, force-main, redundancy, ten-states]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePressurePipeNetwork, EditPressurePipeNetwork]
relatedCalculators: [sanitary-sewer-sizing, force-main, mannings]
updated: 2026-05-11
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §40-§49"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "Hydraulic Institute Standards (ANSI/HI 9.8 Pump Intake Design)"
    url: https://www.pumps.org/
    verified: 2026-05-11
  - title: "ASCE/EWRI MOP 60, Chapter 12 (Pumping Stations)"
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-11
  - title: "Indiana 327 IAC 3 (Wastewater Construction Permits)"
    url: https://www.in.gov/legislative/iac/title327.html
    verified: 2026-05-11
---

> **TL;DR**
> 1. Lift stations must have **firm capacity** equal to peak design flow with the **largest single pump out of service** (Ten States §42.3); the typical config is duplex (two pumps, lead-lag) for small stations and triplex for medium stations.
> 2. Wet well minimum **active volume** is set by motor-cycle limits — typically `V = T × Q / 4` where T is the minimum cycle time (10-15 min for constant-speed pumps; reduced for VFD-driven).
> 3. Force mains: **2-8 ft/s velocity range** (Ten States §48.41) — 2.0 ft/s minimum for scour at average flow; 8 ft/s maximum for surge / corrosion control. Minimum diameter **4 in** (§48.4).

## What a lift station does

A sanitary lift station (pump station) lifts wastewater from a gravity collection point to a higher elevation where it can resume gravity flow or be discharged into a treatment plant. The components:

- **Wet well** — receives incoming gravity sewer, holds working volume.
- **Pumps** — typically submersible centrifugal in small/medium stations; dry-pit centrifugal in larger.
- **Force main** — pressurized discharge pipe from pumps to the next gravity manhole or treatment plant.
- **Controls** — float switches, transducers, or ultrasonic level sensors; SCADA where available.
- **Backup power** — required for any station serving > 100 EDU under most Indiana standards.

## Firm capacity and redundancy

Ten States §42.3: the station shall pump the peak design flow with the **largest single unit out of service**. This is the firm capacity standard.

Implications:

- **Duplex (2 pumps):** firm capacity = capacity of one pump. Pumps must each be sized to deliver design peak alone.
- **Triplex (3 pumps):** firm capacity = capacity of two pumps. Each pump sized at half the peak.
- **More than triplex (large stations):** firm = total minus largest. Allows smaller pumps but more pumps.

The lead pump cycles to handle inflow; the lag starts on high level; the lag-lag (third in triplex) starts on extreme high. All pumps must be capable of running together at the design head without exceeding motor service-factor amps.

## Wet-well sizing

The wet-well active volume (between pump-on and pump-off levels) is bounded by:

- **Minimum cycle time** to protect motors. Typical T = 10 min for constant-speed under 50 hp; 15 min for over 50 hp. NEMA / Ten States: avoid more than 6 starts per hour for constant-speed motors.
- **Maximum retention time** to avoid septicity / odor. Typical max 30 min at average flow.

For a constant-speed lead pump with capacity Qp and inflow Qin (Qin variable, max = Qp by definition at design):

`V_active = (T × Qp) / 4`

This comes from the worst-case cycling scenario (Qin = Qp/2) where on-time and off-time both equal T/2.

Example: Qp = 200 gpm, T = 10 min -> V_active = (10 × 200) / 4 = 500 gal = 66.8 cf. Above pump-off, below pump-on. Add freeboard above pump-on for the high-level alarm and below pump-off for pump submergence (per Hydraulic Institute ANSI/HI 9.8).

VFD-driven pumps run continuously near matched inflow and need much smaller wet wells; minimum is set by intake submergence, not cycling.

## Pump intake design (ANSI/HI 9.8)

- **Minimum submergence:** `S = D + 2.3 V D^0.5 / g^0.5` (Hydraulic Institute form), or use the manufacturer's curve. Insufficient submergence -> air entrainment -> impeller damage.
- **Floor clearance:** typically 0.3 to 0.5 D below the bell.
- **Side wall clearance:** 0.75 D minimum.
- **Approach velocity:** ≤ 0.5 ft/s in the wet well at maximum pump rate.

These are mandatory for proper pump performance; violating them voids most manufacturers' warranties.

## Force main design

Ten States §48.4 / §48.41:

- **Minimum diameter:** 4 in (§48.4).
- **Velocity range:** 2-8 ft/s. Below 2 ft/s solids settle; above 8 ft/s erosion and surge pressures increase.
- **Maximum static pressure:** governed by pipe material rating. DR-18 PVC pressure pipe: 235 psi; ductile iron Class 350: 350 psi.
- **Air release valves** at high points; cleanouts / blow-offs at low points.

### Surge analysis

For force mains > ~1,000 ft or with rapid stop / start, perform a surge analysis (Joukowsky `dP = ρ a dV` for instantaneous closure; full transient with method of characteristics for variable closure). Surges can multiply the operating pressure by 3-5x. Provide surge suppression (slow-closing check valves, surge tanks, vacuum-relief valves) where transient pressures exceed the pipe rating.

## Backup power

Ten States §42.5 requires either:

- Permanent on-site generator with automatic transfer switch.
- Connection point + portable generator with appropriate response-time plan.
- Storage capacity for the longest expected outage at design peak (rarely practical except at very small stations).

Indiana 327 IAC 3 effectively adopts Ten States. Indianapolis DPW typically requires on-site generators for stations serving > 250 EDU.

## Worked example

Subdivision: 300 lots, ADF = 30,000 gpd, Babbitt PF = 4.4 at P = 0.81 thousand (slightly tweaked by mix of residential vs commercial here), Qpeak = 132,000 gpd ≈ 92 gpm + I/I 8 gpm ≈ 100 gpm design.

Choose duplex submersibles, each rated 100 gpm at TDH (compute from force-main length + static lift + minor losses). Wet-well active volume = (10 × 100) / 4 = 250 gal = 33.4 cf. Use a 5-ft diameter wet well; 33.4 cf at A = 19.6 sf = 1.7 ft active depth. Add 1.0 ft to pump-off (submergence), 1.5 ft above pump-on (alarm + freeboard); total wet-well depth from invert ≈ 4-5 ft below incoming sewer + freeboard.

Force main: 6-in DR-18 PVC, target velocity at 100 gpm = 100 / (7.48 × 60) = 0.223 cfs; A = π(0.5)^2 / 4 = 0.196 sf; V = 1.14 ft/s. **Below the 2 ft/s minimum** — use 4-in instead. Re-check: A = 0.0873 sf, V = 2.56 ft/s. Meets Ten States.

(Verify against the local utility's wet-well standards and the actual pump curve once selected.)

## Common review comments

- Firm capacity calculated with all pumps running — must assume largest pump down.
- No backup-power provision — required for any non-trivial station.
- Wet-well cycle time below 5 min — motor will burn out within months.
- Force-main velocity at 1.5 ft/s — solids settle; re-size to a smaller diameter.
- No air-release valve at the high point — gas pocket will block flow.
- No surge analysis on a 6,000-ft force main with two solenoid check valves — surge can rupture pipe.

## Related

- [Force mains and lift stations (breadth)](../sanitary-sewer/force-mains-and-lift-stations.md)
- [Ten States Standards summary](../sanitary-sewer/ten-states-standards.md)
- [Peaking factor derivation](peaking-factor-derivation.md)
- [Force main sizing calculator](/tools/force-main)
- [Sanitary sewer sizing calculator](/tools/sanitary-sewer-sizing)
