---
title: "CEU Module 3 - Modern RTK GNSS Best Practices"
section: "ceu"
order: 3
visibility: public
tags: [ceu, indiana, professional-development, gnss, rtk]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
ceu:
  hours: 1.0
  category: technical
  format: self-study
  approval_status: pending
  approval_body: "Indiana State Board of Registration for Surveyors"
  approval_id: null
sources:
  - title: "NGS Online Positioning User Service (OPUS)"
    url: https://geodesy.noaa.gov/OPUS/
    verified: 2026-05-11
  - title: "INDOT - GPS/GNSS Survey Specifications (Survey Manual)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
  - title: "NGS GNSS Survey Specifications NOAA TM NOS NGS 58/59"
    url: https://geodesy.noaa.gov/PUBS_LIB/NGS-58.pdf
    verified: 2026-05-11
---

> **TL;DR**
> 1. **Initialization (fix) quality** is not the same as **point accuracy**. A "fixed" solution can still be wrong by 5-10 cm under poor PDOP or multipath. Always check.
> 2. For boundary-grade work, **occupy each control point at two different times** with at least a 4-hour gap, and use independent fixes; reject solutions that disagree by more than the equipment tolerance.
> 3. **Vertical accuracy** from RTK is typically 1.5-2 times the horizontal accuracy and depends on a good geoid model (currently **GEOID18**; **GEOID2022** is forthcoming).
> 4. **Multipath**, **canopy**, and **PDOP > 4** are the most common silent killers. Log them and discard occupations that exceed your written QA thresholds.

## Learning objectives

- Set up a base station with a tie to published control adequate for boundary-grade work.
- Identify and document conditions (multipath, PDOP, ionospheric activity) that compromise an RTK solution.
- Estimate the expected vertical error of an RTK observation given a stated horizontal sigma.
- Decide when an OPUS or static session is required to supplement an RTK survey.

## Reading

### 1. The RTK rover is a calibrated instrument, not a magic wand

A modern multi-constellation RTK rover (GPS L1/L2/L5, GLONASS, Galileo, BeiDou) routinely reports horizontal precisions of 0.6-1.0 cm + 1 ppm. The catch: that is **the precision of the carrier-phase solution**, not the **accuracy of the resulting coordinate**. Several real-world effects, none of which the receiver detects automatically, can degrade accuracy without warning:

- **Base setup error.** A 5 mm centering error at the base translates to a 5 mm shift in every rover point. A wrong base elevation translates 1:1.
- **Multipath at the rover.** Signals bouncing off a vehicle, a wet road, a wall, or even the operator. Hardest to detect; easiest to mistake for a "fixed" solution.
- **Canopy and partial obstruction.** A clear sky to 15 degrees elevation is the typical specification; below that, multipath and cycle slips multiply.
- **Cellular or radio link latency.** Long latency on correction streams degrades fix integrity, especially with moving rovers.

### 2. Base setup discipline

**Option A - Set up on a known monument.** Tie to NGS published control or a project control point you established by static observation. Always double-check the height of instrument and the antenna model entered in the controller. The most common silent base error is selecting the wrong antenna phase center.

**Option B - Set up on an unknown point.** Acceptable if (a) the rover ties to published control by independent observation, (b) you record at least two separate "calibrations" (site localizations) and verify they agree, and (c) the base position is later refined by an OPUS or RTN-derived solution and the project recomputed if needed.

**Option C - Network RTK.** A virtual reference station (VRS) network in Indiana includes the Indiana DOT INCORS network, county-provided permanent stations, and commercial subscriptions. Document **which** station served you on **which** date, including the broadcast format and the geoid model in use.

### 3. Fix quality vs accuracy

The controller usually reports the solution as "fixed", "float", or "autonomous." Treat the label as necessary but not sufficient:

| Indicator | What it tells you |
|-----------|-------------------|
| Solution type | Fixed only - reject float for any survey-grade point |
| Number of satellites | 7+ is comfortable; 5 is the bare minimum |
| PDOP | 1-2 is excellent; 4 is a soft limit; reject > 6 |
| HRMS / VRMS | Internal precision estimate. Trust trend, not absolute number |
| Age of corrections | Under 1 s ideal, under 5 s acceptable, reject if > 10 s |
| Satellite geometry | Visualize sky plot before trusting a fix |

The discipline: **do not accept a point on a single 1-epoch fix**. Configure the controller for a minimum 30-second average with re-initialization between occupations. For boundary-grade points, occupy the point twice, separated by re-initialization (drive away and come back) or by a long enough time that the satellite geometry has rotated.

### 4. Vertical accuracy

RTK vertical is fundamentally less accurate than horizontal because:

- Satellites are only above the antenna; the vertical solution lacks the geometric strength that comes from satellites on opposite sides of the receiver.
- The geoid model (currently **GEOID18** in CONUS) is itself approximate; modeled geoid height error in Indiana is typically a few centimeters.
- Tropospheric delay couples primarily into the vertical.

Expect vertical accuracy to be **1.5 to 2 times** the horizontal accuracy. A rover quoted at 8 mm + 1 ppm horizontal will commonly deliver 15-20 mm vertical, and that is the precision - the accuracy depends on the geoid model. For high-accuracy vertical work (FEMA elevation certificates, flood mitigation projects), supplement RTK with differential leveling tied to NGS benchmarks.

### 5. When to fall back to static or OPUS

RTK is insufficient when:

- The project requires NSRS-tied geodetic control (e.g., establishing primary control for a multi-county utility corridor).
- Canopy or terrain prevents reliable kinematic occupations.
- Vertical accuracy must be ~1 cm or better.

In those cases, run **static GNSS sessions** of 30 minutes to several hours and submit to **NGS OPUS** for an absolute position. OPUS-S (single-baseline) is fine for one-off control; OPUS Projects is appropriate for a coordinated network of control. Document the OPUS solution report in the survey file.

### 6. Documentation and 865 IAC

865 IAC 1-12 requires the surveyor to document the equipment, datum, accuracy class, and methods used. For GNSS work this should include, at a minimum:

- Equipment model and antenna model with phase-center calibration source.
- Datum and realization (e.g., NAD83(2011) epoch 2010.0).
- Geoid model (e.g., GEOID18).
- Base station identity and source.
- Date, time window, and weather/space-weather conditions.
- QA criteria the surveyor enforced (max PDOP, min satellite count, occupation duration, re-occupation strategy).
- Any points discarded and why.

A modern controller can export much of this automatically; the discipline is to file the export, not just the .csv.

## Self-assessment

<details>
<summary>Question 1</summary>

A rover reports a "fixed" solution with HRMS 0.008 m and VRMS 0.015 m. The PDOP is 5.2 and the age of corrections is 8 s. Is this acceptable for setting a property corner?

**Answer:** Probably not. PDOP is at the edge of the soft limit and corrections age is high. Re-occupy when the geometry improves or use a longer averaged occupation with verification by independent fix.
</details>

<details>
<summary>Question 2</summary>

You set up a base on a found 5/8-inch rebar near the project center, then later discover the rebar was disturbed. You have already collected a full day of rover points. What is the recovery strategy?

**Answer:** All rover points are shifted by the same vector as the base. Refine the base position by static post-processing (OPUS) or by tying the base to undisturbed control, then apply the shift to the project. Do not re-survey unless the shift exceeds the precision budget.
</details>

<details>
<summary>Question 3</summary>

What is the expected ratio of vertical to horizontal accuracy for a typical RTK rover?

**Answer:** Approximately 1.5 to 2 times. The vertical is the weaker axis because satellites are only above the receiver.
</details>

<details>
<summary>Question 4</summary>

A project requires NAVD88 elevations to 0.5 cm. Can a single RTK rover deliver this?

**Answer:** Not reliably. Combine RTK with differential leveling tied to NGS benchmarks for the vertical, or run static sessions long enough to drive the vertical sigma below the requirement.
</details>

## Cited sources

1. NGS, *Online Positioning User Service (OPUS) User's Guide*.
2. NGS, NOAA Technical Memoranda NOS NGS 58 and 59 (GNSS survey specifications).
3. INDOT Survey Manual, GPS/GNSS sections.
4. 865 IAC 1-12 (documentation requirements).

## Time log

Estimated 50 minutes of focused study plus 10 minutes of self-assessment. Total: 1.0 PDH.
