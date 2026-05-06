---
title: "GNSS Static Observations for Control"
section: "field-and-boundary/control-networks"
order: 50
visibility: public
tags: [gnss, static, baseline, session-planning]
updated: 2026-05-06
sources:
  - title: "NGS — Guidelines for Establishing GPS-Derived Ellipsoid Heights, NOAA TM NOS NGS-58"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS-58.pdf
    verified: 2026-05-06
  - title: "NGS — CORS Network"
    url: https://geodesy.noaa.gov/CORS/
    verified: 2026-05-06
  - title: "Trimble — GNSS Planning Online"
    url: https://www.gnssplanning.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. Static GNSS is the most accurate GNSS method, delivering **0.003-0.01 ft (1-3 mm) horizontal** and **0.01 ft (3-5 mm) vertical** accuracy for baselines under 10 km. It requires post-processing.
> 2. **Session length** depends on baseline length: minimum 1 hour for baselines under 10 km, 2+ hours for 10-50 km, and 4+ hours for baselines over 50 km. Longer sessions improve accuracy.
> 3. **Connect to CORS** in every static network. CORS provide a fixed reference in NAD83(2011) and eliminate the need to occupy a second known point simultaneously.
> 4. **Antenna height recording** is the most common source of static GNSS errors. Measure the slant height at three points on the ground plane and compute the true vertical height. Record the antenna model exactly.

## When to use static GNSS

Use static GNSS when:

- Establishing project control points that will serve as the basis for all subsequent survey work.
- The accuracy requirement exceeds what RTK can deliver (better than 0.02 ft horizontal).
- Connections to the national geodetic framework (CORS, NGS passive marks) are needed.
- The project requires accuracy reporting at a confidence level (FGDC, ASPRS).
- ALTA/NSPS Table A Item 6 (positional accuracy) is selected.

## Session planning

### Satellite availability

Before going to the field, check satellite availability for the planned observation window:

1. Use an online planning tool such as Trimble GNSS Planning ([gnssplanning.com](https://www.gnssplanning.com/)) or the manufacturer's planning module in the processing software.
2. Enter the project location and the planned observation date/time.
3. Review the number of visible satellites and PDOP values. Aim for windows with PDOP below 3.0 and at least 8 satellites visible (across all constellations).
4. Avoid observation windows with high PDOP or gaps in satellite coverage. These windows will produce weaker solutions even with long observation times.

### Baseline length and session duration

The minimum observation time depends on the baseline length, the number of frequencies, and the required accuracy:

| Baseline length | Minimum session (dual-frequency, multi-constellation) | Recommended session |
|---|---|---|
| < 5 km | 30 minutes | 1 hour |
| 5-10 km | 1 hour | 1.5 hours |
| 10-20 km | 1.5 hours | 2 hours |
| 20-50 km | 2 hours | 3-4 hours |
| > 50 km | 4 hours | 6+ hours |

These are minimums for modern multi-frequency, multi-constellation receivers. Older GPS-only receivers require longer sessions. For critical control (primary network, high-accuracy requirements), double the minimum session length.

### Observation rate

Set the observation recording interval (epoch rate) to 15 seconds for baselines under 20 km or 30 seconds for longer baselines. This balances data density with file size. For precise applications, 5-second or 1-second intervals may be specified.

## Field procedure

1. **Set up the antenna** on a tripod/tribrach over the control point. Use a fixed-height tripod if available (eliminates antenna height measurement error). Otherwise, level the tribrach and center over the point.
2. **Measure the antenna height.** Measure the slant height from the ground mark to the antenna reference point (ARP) at three equally spaced points around the ground plane. Average the three measurements. Compute the true vertical height using the manufacturer's published offset from slant height to ARP. Record both the slant height and the vertical height, along with the measurement method.
3. **Record the antenna model and serial number** exactly as it appears in the NGS antenna calibration database (e.g., "TRM115000.00 NONE"). An incorrect antenna model introduces centimeter-level errors through wrong phase center values.
4. **Start the receiver.** Verify it is tracking the expected number of satellites and logging data at the correct interval.
5. **Do not disturb the setup** during the observation session. Do not lean on the tripod, shade the antenna with your body, or park a vehicle nearby (multipath).
6. **At the end of the session**, re-measure the antenna height before taking down the setup. If the two measurements disagree by more than 2 mm (0.007 ft), investigate (settled tripod, bumped antenna, measurement error).

## Baseline processing

After the observation sessions, process the baselines in post-processing software (Trimble Business Center, Leica Infinity, NovAtel Waypoint, etc.):

1. **Import the RINEX or proprietary observation files** from all stations including CORS.
2. **Set the correct antenna models and heights** for every station.
3. **Process baselines** independently. The software resolves integer ambiguities for each baseline. A "fixed" solution (all ambiguities resolved to integers) is required for survey-grade accuracy. A "float" solution indicates the baseline was too long, the session too short, or the data quality too poor.
4. **Review baseline results.** Check the RMS of the baseline solution, the ratio test (fixed vs next-best solution; a ratio above 3.0 indicates reliable ambiguity resolution), and the formal standard errors.

### Connecting to CORS

Include at least two CORS stations in the processing:

- Download CORS data from [geodesy.noaa.gov/CORS/](https://geodesy.noaa.gov/CORS/) for the observation window.
- Process baselines from each project station to at least one CORS.
- The CORS coordinates are held fixed in the subsequent network adjustment, placing the network in NAD83(2011).

## Network adjustment

After baseline processing, adjust the network:

1. Import all processed baselines into the adjustment software.
2. Fix the CORS stations (and any other published control) as known coordinates.
3. Run a minimally constrained adjustment first to check internal consistency.
4. Run the fully constrained adjustment and review the variance factor, standardized residuals, and adjusted coordinate accuracies.

See [Least-squares concepts](least-squares-concepts.md) and [Network adjustment in Civil 3D](../../civil3d/survey/network-adjustment.md) for details on interpreting the adjustment results.

## Tropospheric and ionospheric modeling

### Troposphere

The troposphere delays GNSS signals by approximately 2.3 m at the zenith, varying with temperature, pressure, and humidity. For baselines under 10 km, the tropospheric delay is largely common to both ends and cancels in differencing. For longer baselines, the software estimates tropospheric delay parameters per station. Accurate meteorological data (temperature, pressure, humidity) at the antenna improves the tropospheric model for long baselines.

### Ionosphere

The ionosphere delays GNSS signals by an amount that depends on the electron density and the signal frequency. Dual-frequency receivers form the ionosphere-free combination, which removes the first-order ionospheric delay. This is standard for all survey-grade static processing.

Single-frequency receivers cannot remove the ionospheric delay and are limited to short baselines (under 5 km) and quiet ionospheric conditions. They are not recommended for control work.

## Antenna height recording

Antenna height errors are the most common and most costly mistake in static GNSS surveys. An error of 0.01 m (0.03 ft) in the antenna height propagates directly to the elevation of the point.

### Slant vs true vertical

Most antennas are measured as a slant height from the ground mark to the edge of the ground plane (or a measurement notch on the antenna). The true vertical height to the ARP is:

```
Vertical height = sqrt(slant^2 - radius^2) + ARP_offset
```

Where:
- slant = measured slant distance
- radius = horizontal distance from the antenna edge to the center (half the ground plane diameter; published by the manufacturer)
- ARP_offset = vertical offset from the ground plane edge to the ARP (published by the manufacturer)

Many processing software packages accept the slant height directly and compute the vertical height from the antenna model. Verify that the software is applying the correct computation by checking a known example.

### Best practices

- Measure before and after the session. If they disagree, investigate.
- Use fixed-height tripods when available (e.g., 2.000 m fixed height).
- Take a photo of the setup showing the antenna, tripod, and measurement tape.
- Record the measurement method (slant to ground plane edge, vertical to ARP, etc.) in the field notes.

## Related

- [GNSS RTK](../survey-equipment/gnss-rtk.md)
- [Network design](network-design.md)
- [Least-squares concepts](least-squares-concepts.md)
- [Accuracy standards](accuracy-standards.md)
- [Localization](localization.md)
