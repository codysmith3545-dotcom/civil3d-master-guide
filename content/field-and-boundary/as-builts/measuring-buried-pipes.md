---
title: "Measuring Buried Pipes (Post-Backfill)"
section: "field-and-boundary/as-builts"
order: 40
visibility: public
tags: [as-built, buried-pipe, invert, manhole, drop-measurement, accuracy]
updated: 2026-05-06
---

> **TL;DR**
> 1. After backfill, pipe inverts are measured indirectly — typically by **rim elevation minus drop distance** from the rim to the invert, measured with a tape, rod, or electronic depth gauge.
> 2. The invert reading is the **inside bottom of the pipe** at the structure wall, not the center of the pipe and not the bottom of the structure sump.
> 3. Accuracy is limited by **silt, debris, water in the pipe, and the observer's ability to identify the true invert** — clean the structure bottom if possible, and document conditions that affect the measurement.

## Why post-backfill measurement is different

Before backfill, pipes are visible and accessible. After backfill, the only access points are structures (manholes, inlets, cleanouts) and the pipe interior. The surveyor cannot see or touch the pipe between structures. All measurements are taken at the structure.

This means:

- Horizontal pipe position between structures is inferred from the structure locations, not directly measured.
- Pipe inverts are measured at the structure walls, not at mid-span.
- Pipe grade is computed from the inverts at two structures and the measured distance between them.

## Drop-down measurement from rim

The standard method for post-backfill invert measurement:

1. **Measure the rim elevation** using GNSS or total station. Record to 0.01 ft.
2. **Lower a measuring device** from the rim to the invert:
   - **Weighted steel tape (drop tape):** Lower a plumb-bob-weighted tape into the structure. When the weight touches the invert, read the tape at the rim. The distance from the rim to the invert is the "drop."
   - **Telescoping level rod:** For shallow structures (less than 6 ft), extend a level rod down into the structure and read the distance from rim to invert.
   - **Electronic depth gauge or laser distance meter:** Some crews use a laser distance meter aimed downward from the rim. This can be fast but may be less accurate if the invert is wet or has standing water.
3. **Compute the invert elevation:** Rim elevation minus drop distance = invert elevation.

**Example:** Rim = 786.32 ft. Drop to invert = 7.91 ft. Invert = 786.32 - 7.91 = 778.41 ft.

## Identifying the correct invert point

A structure may have multiple pipes at different elevations entering from different directions. For each pipe:

- The **invert** is the inside bottom of the pipe at the point where the pipe enters the structure wall. It is the lowest point of the pipe's interior cross section.
- On a round pipe, the invert is at the 6 o'clock position.
- Do not measure to the bottom of the manhole channel (bench) or the sump below the pipes. The invert is on the pipe, not the structure floor.
- If the pipe has a precast channel molded into the manhole base (common in sanitary manholes), measure to the bottom of the channel at the pipe opening.

Use a flashlight to see the pipe openings clearly. Identify each pipe, note its direction (N, S, E, W, or bearing), and measure its invert independently.

## Rod readings through the pipe

For shallow pipes or pipes visible from one structure to the next:

1. Place a level rod at the invert of the pipe in one structure.
2. Read the rod from the other structure (using a flashlight and looking through the pipe) to verify the invert elevation agrees.
3. This technique works on straight, short runs (less than 200 ft) with good visibility. On longer runs, curved pipes, or pipes with sag, it is impractical.

A more practical variation: measure the invert at both ends of the pipe independently (drop measurement at each structure) and compare. The two measurements should agree within the expected tolerance (0.03 to 0.05 ft) after accounting for the pipe slope. If they disagree by more, investigate.

## Dealing with water in the pipe

Standing water in the pipe obscures the true invert. Strategies:

- **Wait for dry conditions.** After a storm, water levels in storm sewers drop relatively quickly. Schedule the as-built measurement during dry weather.
- **Pump down.** If the structure has a small amount of standing water, a portable pump can lower the level enough to expose the invert.
- **Measure the water surface** and then measure the pipe inside diameter. Compute the invert: water surface elevation minus the depth of water in the pipe (if the pipe is partially full, the invert is at the bottom of the cross section). This requires knowing or measuring the pipe diameter and estimating the water depth — accuracy degrades.
- **Probe through the water.** Lower a rod or weighted tape through the water until it touches the pipe invert. The water adds uncertainty to the "feel" of the bottom, but on clean pipe this can be accurate to 0.03 to 0.05 ft.

For sanitary sewers with continuous flow, the pipe will never be dry. Measure the invert through the flow using a rod or drop tape. The accuracy is reduced (0.05 to 0.10 ft) compared to a dry measurement. Note the flow conditions on the as-built.

## Dealing with silt and debris

Silt, gravel, and debris in the structure sump or on the pipe invert raise the apparent invert elevation. Before measuring:

- Clear debris from the invert area if accessible from the surface (long-handled scoop, probe).
- If the invert is buried in silt and cannot be cleared, note the condition and the estimated silt depth. Report the measurement as "approximate invert" or "invert obscured by silt."
- On new construction, the contractor should clean structures before requesting the as-built survey. If structures are full of construction debris, request that the contractor clean them before you measure.

## Accuracy considerations

Post-backfill invert measurements are inherently less accurate than pre-backfill measurements because the measurement is indirect:

| Error source | Estimated magnitude |
|---|---|
| Rim elevation (GNSS RTK) | 0.02 to 0.04 ft |
| Drop tape reading (clean, dry) | 0.01 to 0.03 ft |
| Drop tape reading (wet, silty) | 0.03 to 0.10 ft |
| Identifying the correct invert point | 0.01 to 0.05 ft |
| **Combined (RSS)** | **0.03 to 0.12 ft** |

For most municipal as-built requirements (invert accuracy of 0.05 to 0.10 ft), drop measurements in clean, dry structures are adequate. For tight-tolerance work (0.02 ft), use a total station for the rim elevation and a calibrated tape for the drop.

When the achievable accuracy does not meet the requirement (e.g., deep structures with standing water), document the limitation in the as-built certification. A qualified measurement with a stated uncertainty is more honest and useful than a precise-looking number that is wrong.

## Related

- [Storm/sanitary as-builts](storm-sanitary-as-builts.md)
- [What as-builts capture](what-as-builts-capture.md)
- [Certification language](certification-language.md)
- [Utility staking](../construction-staking/utility-staking.md)
