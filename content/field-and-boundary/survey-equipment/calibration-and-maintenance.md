---
title: "Calibration & Maintenance"
section: "field-and-boundary/survey-equipment"
order: 50
visibility: public
tags: [calibration, maintenance, collimation, edm-check]
updated: 2026-05-06
sources:
  - title: "NGS — Calibration Baseline Program"
    url: https://geodesy.noaa.gov/CBLINES/
    verified: 2026-05-06
  - title: "NGS — Antenna Calibrations"
    url: https://geodesy.noaa.gov/ANTCAL/
    verified: 2026-05-06
  - title: "Indiana Society of Professional Land Surveyors"
    url: https://www.ispls.org/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **EDM baseline checks** should be performed at least annually and whenever an instrument is suspected of drift. Indiana has several NGS calibration baselines near Indianapolis.
> 2. **Collimation checks** (2C error and index error) should be done at the start of every project or after any rough transport. This takes 5 minutes and catches problems that would otherwise corrupt an entire dataset.
> 3. **GNSS antenna phase center calibrations** are published by NGS. Always use the correct antenna/radome model in your processing software; an incorrect model can introduce centimeter-level systematic errors.
> 4. Document all calibration activities in a log that travels with the instrument. This is both a QA record and professional liability protection.

## EDM baseline checks

An EDM (Electronic Distance Measurement) baseline is a series of precisely known distances between permanent monuments. By measuring these known distances with your instrument, you can detect constant errors, scale errors, and cyclic errors.

### NGS calibration baselines near Indianapolis

NGS maintains calibration baselines across the country. Baselines near central Indiana include:

- **Indianapolis (Eagle Creek Park):** A multi-pillar baseline with distances from approximately 50 m to 1,400 m. This is the most convenient for firms based in the Indianapolis metro area.
- **West Lafayette (Purdue University):** A baseline maintained in conjunction with the Purdue civil engineering department.
- **Bloomington (Indiana University):** Available for firms in southern Indiana.

To find baselines, use the NGS Calibration Baseline database at [geodesy.noaa.gov/CBLINES/](https://geodesy.noaa.gov/CBLINES/).

### Procedure

1. Set up the instrument on each baseline pillar in sequence.
2. Measure the distance to every other pillar (all combinations).
3. Compare your measured distances to the NGS-published values.
4. Compute the constant error (intercept) and scale error (slope) by regression.
5. If the constant error exceeds the instrument's published accuracy (typically 1-2 mm), or the scale error exceeds the published ppm, send the instrument for factory calibration.

### Frequency

- **Annually** for instruments in regular use.
- **After any repair or suspected damage.**
- **Before high-precision projects** (control surveys, ALTA surveys where Table A Item 6 is selected).

## Collimation checks

### Horizontal collimation (2C error)

Check at the start of every project. See [Total station setup — 2C error](total-station-setup.md) for the full procedure. Summary:

1. Sight a target in Face 1 and Face 2.
2. Compute 2C = F1 - (F2 +/- 180 degrees).
3. If 2C exceeds twice the instrument's angular accuracy (e.g., > 10" for a 5" instrument), adjust using the instrument's electronic calibration.

### Vertical collimation (index error)

Check alongside the 2C check. See [Total station setup — Index error](total-station-setup.md).

### When to check

- At the start of every project.
- After the instrument is bumped, dropped, or transported in a vehicle without proper cushioning.
- If field checks (backsight comparisons, loop closures) show unexpected discrepancies.
- After any temperature change greater than approximately 20 degrees C from the last check (thermal expansion can shift optical components).

## Compensator check (levels)

For automatic levels:

1. Level the instrument and sight a distant rod.
2. Tap the instrument body. The crosshair should oscillate and return to the same reading.
3. If the reading shifts or the crosshair does not oscillate, the compensator may be stuck.

For total stations with a dual-axis compensator:

1. Level carefully and read the compensator tilt values on the display.
2. Gently tilt the instrument off-level by loosening a tribrach screw slightly. The compensator readings should change proportionally.
3. Re-level and verify the readings return to near zero.

## GNSS antenna phase center calibration

The phase center of a GNSS antenna (the electronic point where the signal is measured) does not coincide with the physical antenna reference point (ARP). The offset varies by satellite elevation angle, azimuth, and frequency. Using incorrect phase center values introduces systematic vertical errors of 1-5 cm and horizontal errors of 1-3 mm.

### Using NGS published values

NGS publishes absolute antenna calibration values for most survey-grade antennas at [geodesy.noaa.gov/ANTCAL/](https://geodesy.noaa.gov/ANTCAL/). These calibrations include:

- **Mean phase center offset (PCO):** The average offset from the ARP in north, east, and up components for each frequency.
- **Phase center variations (PCV):** Elevation- and azimuth-dependent corrections.

When processing GNSS data:

1. Identify the exact antenna model and radome type (e.g., "TRM115000.00 NONE" for a Trimble Zephyr 3 without radome).
2. Verify that your processing software (Trimble Business Center, Leica Infinity, etc.) has the correct calibration loaded. Most software updates include current NGS antenna files.
3. If your antenna is not in the NGS database, contact the manufacturer or submit it for calibration.

### Common mistakes

- Using a radome in the field but selecting "NONE" for radome in the software (or vice versa). The radome changes the phase center by several millimeters.
- Entering the wrong antenna model because two models look physically similar.
- Not updating the antenna calibration file after a software update.

## Recommended check intervals

| Check | Frequency | Time required |
|---|---|---|
| Collimation (2C and index) | Every project start; after transport | 5 minutes |
| Compensator (level or total station) | Every day of use | 1 minute |
| EDM baseline | Annually; before precision projects | 2-4 hours |
| GNSS antenna model verification | Every project start | 2 minutes |
| Tribrach circular bubble | Monthly; after drops | 2 minutes |
| Level rod graduation check | Annually; if rod has been damaged | 30 minutes |
| Data collector firmware version | Quarterly | 5 minutes |

## Documentation for QA records

Maintain a calibration log for each instrument. Record:

- Instrument serial number and model.
- Date and location of each check.
- Results (2C value, index error, EDM baseline differences, compensator status).
- Action taken (adjusted, sent for service, passed).
- Name of the person performing the check.

This log serves multiple purposes:

- **QA/QC:** Demonstrates that equipment was verified before use on a project.
- **Professional liability:** If a survey is challenged, the calibration record shows due diligence.
- **Maintenance planning:** Trends in calibration values (e.g., 2C slowly increasing) indicate when to schedule factory service before the instrument fails in the field.

## Related

- [Total station setup](total-station-setup.md)
- [Auto levels and digital levels](auto-levels-and-digital-levels.md)
- [GNSS RTK](gnss-rtk.md)
- [Accuracy standards](../control-networks/accuracy-standards.md)
