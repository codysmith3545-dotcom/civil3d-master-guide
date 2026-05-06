---
title: "Sanitary Manhole Design"
section: "engineering/sanitary-sewer"
order: 30
visibility: public
tags: [sanitary-sewer, manhole, drop-manhole, ten-states, benching]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreateNetwork, EditPipeNetwork, EditStructureProperties]
relatedCalculators: [manhole-spacing]
updated: 2026-05-06
sources:
  - title: "Recommended Standards for Wastewater Facilities (Ten States Standards), 2014 ed., §44"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "ASCE/EWRI Manual of Practice No. 60, Chapter 12"
    url: https://ascelibrary.org/doi/book/10.1061/9780784408001
    verified: 2026-05-06
---

> **TL;DR**
> 1. Place a manhole at every change of size, slope, alignment, or material, and at every junction. Maximum spacing for sewers 15 in and smaller is **400 ft** (Ten States §44.2); for sewers 18 in to 30 in, **500 ft**.
> 2. Standard manhole inside diameter is **48 in** for 8-in to 15-in mains; **60 in** for 18-in to 30-in; **72 in** for 30-in to 48-in. Larger diameters or junctions need junction manholes or vaults.
> 3. Use a **drop connection** when an incoming sewer is 24 in or more above the outgoing sewer invert. External drops are preferred for maintenance.
> 4. Provide channel benching from incoming inverts to the outgoing invert at full pipe diameter; bench surfaces slope up to the chamber wall at about 8% to drain.

## Spacing and location

Ten States Standards §44.2 sets the maximum manhole spacing:

- 15 in and smaller: 400 ft
- 18 in to 30 in: 500 ft
- 36 in and larger: governed by access and cleaning equipment, often 600 ft

Place a manhole at every:

- Change in pipe size, slope, material, or alignment.
- Junction of two or more sewers.
- End of an upstream stub (terminal manhole).
- Intersection where future extension is anticipated.

Curved alignments are allowed in some Indiana cities (Indianapolis Citizens Energy, Carmel) for mains 24 in and larger, with a minimum radius around 100 ft and the requirement that the curve be uniform and inspectable. Smaller mains must run straight between manholes — modern push-camera and lateral-launch CCTV equipment requires it.

## Diameter

Minimum inside diameter (ID) is set by the largest pipe entering and the angle between pipes:

| Largest pipe | Minimum manhole ID |
|---|---|
| 8 in to 15 in | 48 in |
| 18 in to 21 in | 60 in |
| 24 in to 30 in | 60 in (72 in if multiple inflow angles) |
| 36 in to 42 in | 72 in |
| 48 in and larger | 84 in or junction structure |

For a junction where pipes enter at angles, increase ID one step. Drop manholes need the larger ID to accommodate the drop bowl.

## Cone vs flat-top

- **Eccentric cone top** is the standard for manholes 4 ft to about 12 ft deep. The cone tapers from the 48-in barrel to a 24-in opening. The eccentric configuration leaves one side of the chamber with a vertical face for ladder rungs or step irons.
- **Concentric cone** is allowed but less common — the ladder is offset from the wall and harder to maintain.
- **Flat-top slabs** are used where cover is too shallow for a cone (less than about 3 ft from rim to top of barrel) or where the manhole is in a paved travel lane and the cone shape conflicts with the pavement section. Flat-top slabs require an H-20 (or HS-25) rated structural design.

Manholes deeper than ~20 ft commonly add an intermediate landing platform, especially if confined-space entry is anticipated.

## Drop manholes

Required when the incoming sewer invert is 24 in or more above the outgoing sewer invert (Ten States §44.3). Two configurations:

- **External drop** — a vertical drop pipe outside the manhole barrel, with a tee or wye at the inflow elevation and a sweep into the manhole at the outflow elevation. Preferred because the manhole interior is unobstructed for cleaning and inspection.
- **Internal drop** — a vertical pipe inside the manhole, anchored to the wall. Lower cost but obstructs the channel and is harder to maintain. Used where right-of-way constrains the external drop.

The drop pipe diameter typically matches the incoming sewer; the connection at the bottom should sweep into the channel rather than entering perpendicular to the flow.

## Vented vs solid lids

- **Solid lids** are the default. They keep stormwater and grit out and odors in. Use them on residential streets, in landscaped areas, and anywhere the manhole is not at a low point.
- **Vented (pickhole or grated) lids** are used at the upstream end of force-main discharges, at the start of long downstream runs that need air relief, and on rare occasions for odor management at venting points coordinated with the system H2S and odor-control plan. Many cities prohibit vented lids in flood-prone areas because they admit floodwater.

Frame-and-cover assemblies are typically H-20 rated (urban) or HS-25 (highway). Bolt-down covers are required in flood-prone areas, in pavement designed for traffic, and at any manhole where surcharge could lift the lid. Locking covers are common in subdivisions to deter dumping.

## Invert benching and channels

The flow channel through the manhole is shaped to maintain hydraulic efficiency and prevent solids deposition. Standards:

- **Channel depth** equals the full diameter of the larger of the incoming or outgoing pipes.
- **Bench surface** slopes from the channel up to the chamber wall at about 1 in per ft (about 8%) to drain dripped sewage and washdown water back to the flow.
- **Channel curvature** is smooth and circular; no sharp angles. Where two or more sewers enter, the channels merge with the same hydraulic radius as the outgoing sewer.
- **Drop in invert** through the manhole — at least 0.10 ft (1.2 in) for straight runs, more for changes in alignment. Indianapolis and several Indiana cities require 0.20 ft (2.4 in) where the alignment changes by 45° or more.

Pre-cast manholes commonly come with the bench cast in to a generic shape that the contractor finishes in the field with grout. Pay attention to the cast-in invert orientation when ordering — wrong orientation is a common construction mistake.

## Inflow / infiltration prevention

- **Frame seal** — chimney seal (rubber or polymer) between the precast cone and the frame casting; prevents inflow at the joint.
- **Joint gaskets** — O-ring or profile-rubber gaskets between barrel sections (ASTM C443).
- **Boot connectors** — flexible boot at every pipe penetration (ASTM C923). No grouted-in pipes for new construction.
- **Watertight castings** — bolt-down, gasketed lids in flood-prone areas; insert-type pan inserts under solid lids in low-lying or flood-fringe areas.

## Common review issues

- 48-in manhole on a 21-in main — needs to be 60-in.
- Drop in invert through the manhole is less than 0.10 ft — fail.
- Drop manhole shown but configured as internal where right-of-way allows external — flagged for revision.
- Vented lid shown in a flood-prone area — replace with solid bolt-down.
- Step irons specified instead of safety-rated ladder where chamber depth exceeds 6 ft.

## Related

- [Pipe sizing and slopes](pipe-sizing-and-slopes.md)
- [Manning's reference](../hydraulics/mannings-reference.md)
