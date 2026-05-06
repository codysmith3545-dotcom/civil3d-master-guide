---
title: "GNSS RTK Surveying"
section: "field-and-boundary/survey-equipment"
order: 20
visibility: public
tags: [gnss, rtk, gps, base-rover, ntrip, cors]
updated: 2026-05-06
sources:
  - title: "INDOT — Indiana CORS (InCORS)"
    url: https://www.in.gov/indot/
    verified: 2026-05-06
  - title: "NGS — CORS Network"
    url: https://geodesy.noaa.gov/CORS/
    verified: 2026-05-06
  - title: "Trimble — RTK Survey Best Practices"
    url: https://www.trimble.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **RTK** delivers approximately 0.02 ft (7 mm) horizontal and 0.05 ft (15 mm) vertical accuracy in real time, making it the standard tool for topographic and stakeout work. **Static** GNSS delivers 0.01 ft or better horizontal for control networks but requires post-processing.
> 2. Always **initialize on a known point** and check back into known control periodically. A fixed solution does not guarantee a correct solution.
> 3. RTK is NOT appropriate under heavy canopy, near tall buildings, or as the sole method for boundary control where monuments must hold sub-centimeter relative accuracy.

## RTK vs Static vs PPK

| Method | Field time per point | Post-processing | Typical horizontal accuracy | Typical vertical accuracy | Best for |
|---|---|---|---|---|---|
| RTK | 5-15 seconds | None | 0.02 ft (7 mm) | 0.05 ft (15 mm) | Topo, stakeout, preliminary boundary |
| PPK | 15-30 seconds | Required | 0.02 ft (7 mm) | 0.04 ft (12 mm) | Areas with intermittent data link |
| Rapid static | 5-20 minutes | Required | 0.01 ft (3-5 mm) | 0.02 ft (7 mm) | Project control, boundary corners |
| Static | 1-4+ hours | Required | 0.003-0.01 ft (1-3 mm) | 0.01 ft (3-5 mm) | High-order control, long baselines |

Accuracy values are for baselines under 10 km with modern multi-frequency, multi-constellation receivers. Longer baselines degrade accuracy.

## Base-rover setup

When operating with a local base station rather than a network:

1. **Select a base location.** Requires clear sky above 10-15 degrees elevation mask, minimal multipath sources, and security for the duration of the session.
2. **Occupy a known point** if possible. Enter the published NAD83(2011) coordinate. If the point is unknown, occupy for at least 15 minutes and post-process against CORS to establish the coordinate before broadcasting.
3. **Set the radio link.** UHF radio (typical 450-470 MHz in the U.S.) is the standard for base-rover communication. Range is 2-5 miles line-of-sight with a standard whip antenna, extendable to 10+ miles with a repeater or high-gain antenna.
4. **Configure the broadcast.** RTCM 3.x is the standard correction format. Set a broadcast interval of 1 second.
5. **Record the base coordinate, antenna height (measured to ARP), and antenna model** in the project notes. An incorrect base coordinate shifts every rover point by the same amount.

## NTRIP and VRS networks

Network RTK eliminates the need for a local base station by streaming corrections from a network of continuously operating reference stations.

### Indiana CORS (InCORS)

InCORS is Indiana's statewide network RTK service, operated by INDOT. It provides VRS corrections covering most of the state. To use it:

- Register for an account through INDOT.
- Configure the rover's NTRIP client with the InCORS caster address, port, and your credentials.
- Select the appropriate mount point (typically a VRS or nearest-station solution in NAD83(2011)).
- Requires cellular data connectivity at the job site.

Other networks available in Indiana include SmartNet (Leica/Hexagon), Trimble VRS Now (CenterPoint RTX), and KeyNet.

### Network vs local base

Network RTK has the advantage of no base station setup and consistent statewide datum realization. However:

- It depends on cellular data coverage. No signal, no corrections.
- Latency in corrections can degrade accuracy in high-dynamics situations.
- You are trusting the network operator's datum realization and transformation. Verify by checking into published control at each site.

## Initialization and solution quality

### Fixed vs float

A **fixed** solution means the receiver has resolved the integer ambiguities of the carrier-phase signal. A **float** solution has not. Only fixed solutions meet survey-grade accuracy specifications.

After powering on the rover and receiving corrections:

1. Wait for a **fixed** solution (typically 10-60 seconds with modern receivers).
2. Occupy a **known control point** and compare the RTK coordinate to the published value. Accept only if the differences are within tolerance (typically 0.05 ft horizontal, 0.05 ft vertical for topo; tighter for control).
3. If the initialization check fails, power-cycle the rover, re-initialize, and re-check. Do not proceed with data collection on a bad check.

### Reliability indicators

- **PDOP (Position Dilution of Precision):** Values below 2.0 are ideal; below 4.0 is acceptable for most survey work; above 6.0 indicates poor satellite geometry. Do not collect boundary or control data with PDOP above 4.0.
- **HRMS / VRMS:** The receiver's internal estimate of horizontal and vertical precision. For topo, accept HRMS less than 0.03 ft and VRMS less than 0.06 ft. These are optimistic estimates; do not use them as the sole quality indicator.
- **Number of satellites:** More is better. Minimum 5 for a 3D fix; 7+ for reliable accuracy. Modern multi-constellation receivers (GPS + GLONASS + Galileo + BeiDou) routinely track 20+ satellites.
- **Age of corrections:** Should be less than 5 seconds. Older corrections degrade the fix.

## Multipath and obstructions

Multipath occurs when satellite signals reflect off nearby surfaces (buildings, vehicles, fences, water) before reaching the antenna. It causes position errors of 0.03-0.15 ft that are difficult to detect because they change slowly.

Mitigation strategies:

- Use a ground plane or choke-ring antenna for base stations.
- Keep the rover away from reflecting surfaces (at least one antenna-height distance).
- Observe longer on points near obstructions and watch for position scatter.

## When RTK is NOT appropriate

- **Under canopy.** Trees block and attenuate satellite signals. Even partial canopy can prevent a fixed solution or cause large multipath errors. Use a total station under canopy.
- **Urban canyons.** Tall buildings block satellites and create severe multipath. Signal reflection off glass and metal facades can shift positions by 0.1 ft or more.
- **Boundary control where sub-centimeter relative accuracy is required.** RTK accuracy is absolute (relative to the base or network). Two RTK-observed boundary corners 50 ft apart each have independent 0.02 ft errors, so the relative distance accuracy between them may be 0.03 ft or worse. For boundary surveys where deed distances must be held, conventional measurement (total station traverse) between corners is more reliable for relative accuracy.
- **Near high-voltage power lines or active radio transmitters.** Electromagnetic interference can disrupt the GNSS signal.
- **Precise vertical control.** RTK vertical accuracy (0.05 ft) may not meet specifications for fine-grading, utility inverts, or leveling work. Use differential leveling for vertical accuracy better than 0.03 ft.

## Re-initialization and checking

During a day of RTK work:

- Re-initialize (power-cycle or force a new fix) every 1-2 hours.
- After each re-initialization, check into a known control point and record the delta.
- At the end of the day, perform a final check observation on the starting control point. Compare to the morning check.
- Document every check observation, including time, coordinate differences, PDOP, and number of satellites.

## Related

- [Total station setup](total-station-setup.md)
- [Data collectors](data-collectors.md)
- [GNSS static for control](../control-networks/gnss-static.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
- [Coordinate systems — datums and projections](../coordinate-systems/datums-and-projections.md)
- [Localization / site calibration](../control-networks/localization.md)
