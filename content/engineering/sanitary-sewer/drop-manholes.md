---
title: "Drop Manholes"
section: "engineering/sanitary-sewer"
order: 40
visibility: public
tags: [sanitary, sewer, drop-manhole, invert]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §44.3"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "ASCE/EWRI Manual of Practice No. 60, Chapter 12"
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-06
---

> **TL;DR**
> 1. A drop manhole (or drop connection) is required when an incoming sewer invert is **24 in (2 ft) or more** above the outgoing sewer invert (Ten States §44.3). Some jurisdictions trigger a drop at 18 in.
> 2. **External drops** (vertical pipe outside the barrel) are preferred — they keep the manhole interior clear for cleaning and CCTV. **Internal drops** (pipe inside the barrel) cost less but obstruct maintenance.
> 3. Drop pipe diameter matches the incoming sewer. The bottom connection sweeps into the manhole channel at or below the outgoing invert elevation.
> 4. In Civil 3D pipe networks, model a drop manhole by setting the incoming pipe invert at the actual high elevation and placing a structure rule or custom part that reflects the drop configuration.

## When a drop is required

The fundamental problem: if a sewer enters a manhole well above the outgoing invert, the free-falling sewage erodes the manhole bench, generates hydrogen sulfide (H2S) from turbulence, and creates splash and odor problems. A drop connection conveys the flow down in a controlled pipe instead of letting it cascade.

Ten States Standards §44.3 sets the trigger at a **24-in (2.0 ft)** differential between the incoming sewer invert and the outgoing sewer invert. Many Indiana cities adopt this threshold directly. Some (Indianapolis Citizens Energy, Carmel) trigger a drop at **18 in (1.5 ft)** to reduce H2S generation in flatter systems. When the differential is less than 24 in but more than about 6 in, most agencies require the incoming pipe to enter the manhole at a steep slope (matching the bench) rather than a flat invert — this is sometimes called a "ramp" entry.

## External drop configuration

The external drop is a vertical (or near-vertical) pipe assembly mounted on the outside of the manhole barrel:

1. **Inlet tee or wye** — the incoming sewer terminates in a tee or wye fitting at the high invert elevation. The through leg of the tee is plugged or capped for access and cleaning.
2. **Vertical drop pipe** — extends from the tee down the outside of the barrel. Diameter matches the incoming sewer (8 in minimum). The pipe is supported by stainless-steel brackets bolted to the barrel wall at 4 to 6 ft intervals.
3. **Elbow and sweep** — at the bottom, a long-radius elbow (typically 1/8 bend or 1/4 bend with a sweep) directs flow through the barrel wall and into the manhole channel at or below the outgoing invert.
4. **Concrete encasement** — many specifications require the external drop pipe and fittings to be encased in 6 in of concrete for structural protection and to prevent frost damage.

### Advantages

- Manhole interior is unobstructed for cleaning equipment and CCTV cameras.
- The upper tee provides a cleanout access point — a jet nozzle can be inserted at the top.
- Splash and H2S generation are contained in the drop pipe rather than the manhole chamber.

### Disadvantages

- Requires more excavation around the manhole.
- More fittings and supports to install.
- May conflict with other utilities or right-of-way limits.

## Internal drop configuration

The internal drop places the vertical pipe inside the manhole:

1. **Inlet** — the incoming sewer enters the manhole at the high elevation, discharging into a vertical pipe mounted on the manhole wall.
2. **Vertical pipe** — runs down the interior wall, secured with stainless-steel brackets at 4 to 6 ft intervals.
3. **Elbow** — at the bottom, the pipe sweeps into the bench channel.

### Advantages

- No additional excavation outside the barrel.
- Lower material and labor cost.

### Disadvantages

- Obstructs cleaning and inspection equipment.
- Drop pipe brackets can catch debris.
- Splash within the chamber accelerates H2S corrosion of the cone, frame, and lid.

Most Indiana plan reviewers prefer external drops and will flag an internal drop unless the designer demonstrates a site constraint (limited right-of-way, existing utility conflict) that prevents the external configuration.

## Sizing and hydraulics

- **Drop pipe diameter** — match the incoming sewer diameter. Do not reduce diameter at the drop; flow at full velocity entering a constriction creates surcharge and overflow risk.
- **Drop height** — no practical maximum, but drops exceeding about 15 ft should include intermediate anchor points and may need an energy dissipation chamber at the base.
- **Energy dissipation** — the long-radius sweep at the base provides adequate energy dissipation for most municipal drops. For drops exceeding 20 ft or flows exceeding about 3 cfs, consider a plunge pool or impact pad at the base inside the manhole.
- **Ventilation** — tall drops entrain air, which must escape. Vent the manhole through a vented lid or a separate vent pipe routed to grade. H2S management at the vent may be required (carbon filter, chemical scrubber, or biofilter).

## Modeling in Civil 3D

Civil 3D pipe networks do not have a native "drop manhole" part in the default catalog, but the configuration can be modeled:

1. **Structure placement** — place a standard manhole at the junction. Set the manhole sump depth and rim elevation per the design.
2. **Incoming pipe** — set the incoming pipe's downstream invert (at the structure) to the actual high invert elevation. The pipe profile will show the incoming sewer terminating high.
3. **Outgoing pipe** — set the outgoing pipe's upstream invert at the design outgoing elevation. The structure will display the invert differential in the profile view.
4. **Parts list annotation** — add a note or custom property to the structure identifying it as an external or internal drop. If using a custom parts catalog, create a drop-manhole part with the correct geometry so that the structure renders correctly in section views and data tables.
5. **Interference check** — use the pipe network interference check to confirm that the external drop pipe (if modeled as a separate pipe segment) does not conflict with adjacent utilities.

For Storm and Sanitary Analysis (SSA), the drop does not affect the hydraulic analysis of the gravity system upstream or downstream — SSA treats the manhole as a node with an energy loss. Confirm that the headloss coefficient at the junction accounts for the drop.

## Common review issues

- Incoming invert is 30 in above outgoing invert but no drop connection shown — fail per Ten States §44.3.
- Internal drop specified but external drop is feasible — reviewer will request the preferred configuration.
- Drop pipe diameter is smaller than the incoming sewer — fail; diameter must match.
- No cleanout or access at the top of the drop — the upper tee or wye is required.
- Profile view does not clearly label the drop configuration — add a note calling out "EXT DROP MH" or "INT DROP MH."

## Related

- [Manhole design](manhole-design.md)
- [Pipe sizing and slopes](pipe-sizing-and-slopes.md)
- [Force mains and lift stations](force-mains-and-lift-stations.md)
