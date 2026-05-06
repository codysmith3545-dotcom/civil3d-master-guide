---
title: "Auto Levels & Digital Levels"
section: "field-and-boundary/survey-equipment"
order: 30
visibility: public
tags: [level, auto-level, digital-level, differential-leveling]
updated: 2026-05-06
sources:
  - title: "FGDC — Standards and Specifications for Geodetic Control Networks"
    url: https://www.fgdc.gov/standards
    verified: 2026-05-06
  - title: "Wolf & Ghilani — Elementary Surveying, 16th ed."
    url: https://www.pearson.com/
    verified: 2026-05-06
---

> **TL;DR**
> 1. **Automatic (compensator) levels** are the workhorse for differential leveling. They self-level within the compensator range (typically 10-15 arc-minutes) once the circular bubble is centered.
> 2. **Digital bar-code levels** read an invar bar-code rod electronically, eliminating reading errors and recording observations automatically. They are the standard for second-order and higher leveling work.
> 3. Perform the **two-peg test** at the start of every project to verify the instrument's collimation. Allowable collimation error varies by class, but as a rule, correct if the error exceeds 0.005 ft in a 200 ft sight.
> 4. Leveling accuracy classes: second-order = 6 mm * sqrt(K), third-order = 12 mm * sqrt(K), where K is the one-way leveling distance in kilometers.

## Automatic (compensator) levels

An automatic level uses a pendulum compensator to maintain a truly horizontal line of sight after the instrument is approximately leveled. The surveyor centers the circular bubble, and the compensator handles fine leveling.

### Key specifications

| Specification | Typical value (survey-grade) |
|---|---|
| Accuracy (1 km double run) | 0.5-2.5 mm |
| Compensator range | 10-15 arc-minutes |
| Magnification | 24x-32x |
| Minimum focus distance | 0.3-0.5 m (1.0-1.6 ft) |

Common models: Leica NA720/NA730, Trimble/Spectra AL series, Topcon AT-B series, Sokkia B-series.

### Compensator check

Before use each day, verify the compensator is free:

1. Level the instrument and sight a well-defined target.
2. Gently tap the instrument body. The crosshair should oscillate briefly and return to the same position.
3. If the crosshair drifts or does not return, the compensator may be stuck (common in cold weather or after rough transport). Gently rotate the instrument to free it. If the problem persists, do not use the instrument.

## Digital bar-code levels

Digital levels use a CCD sensor to read a specially encoded invar bar-code rod. The instrument determines the rod reading and distance to the rod electronically, eliminating the human reading error that is the largest error source in conventional leveling.

### Advantages over optical levels

- Eliminates rod-reading errors (typically 0.001-0.003 ft per reading).
- Automatically records observations to internal memory or a data collector.
- Faster workflow: the observer presses a button instead of reading, recording, and computing in the field book.
- Higher accuracy for the same observation time.

### Limitations

- Requires manufacturer-specific bar-code rods. Standard leveling rods cannot be read digitally.
- Performance degrades in low light, direct sunlight on the rod, or when the rod is partially obscured.
- Minimum and maximum reading distances depend on the rod scale (typically 2-100 m).
- Cost is higher than automatic levels.

Common models: Leica DNA03/DNA10, Trimble DiNi, Topcon DL-500 series.

## Two-peg test

The two-peg test detects and quantifies collimation error (the line of sight not being truly horizontal). Perform it at the start of every project or whenever the instrument has been transported or bumped.

### Procedure

1. Set two points (A and B) approximately 200 ft (60 m) apart on level ground.
2. Set up the instrument at the **midpoint** between A and B. Read the rod at A (reading a1) and at B (reading b1). Compute the true elevation difference: delta_H = a1 - b1. At the midpoint, collimation error cancels because the sight distances are equal.
3. Move the instrument to a position approximately 10 ft (3 m) beyond point A (so the sight to A is short and the sight to B is long).
4. Read the rod at A (reading a2) and at B (reading b2). Compute the apparent elevation difference: delta_H' = a2 - b2.
5. The collimation error over the long sight distance is: e = delta_H' - delta_H.
6. If |e| > 0.005 ft for a 200 ft sight, adjust the instrument. Most automatic levels have an adjustable reticle; digital levels have an electronic calibration routine.

### Example

- Midpoint readings: a1 = 4.562 ft, b1 = 3.891 ft. True delta_H = 0.671 ft.
- End setup readings: a2 = 4.211 ft, b2 = 3.535 ft. Apparent delta_H' = 0.676 ft.
- Error: e = 0.676 - 0.671 = 0.005 ft over approximately 190 ft. This is borderline; adjust if possible, or keep balanced sight distances to mitigate.

## Differential leveling procedures

### BS-HI-FS method

The standard field procedure for differential leveling:

1. Set up the level approximately halfway between the benchmark (BM) and the first turning point (TP).
2. Read the **backsight (BS)** on the BM rod. HI = BM elevation + BS.
3. Read the **foresight (FS)** on the TP rod. TP elevation = HI - FS.
4. Move the instrument forward, past the TP. The former TP becomes the new BS point.
5. Repeat until you reach the end point or close back on the starting BM.

### Turning points

A turning point is a stable, well-defined point where the rod is held between consecutive instrument setups. Use:

- A steel turning pin (turtle) on soil.
- A stable surface feature (manhole rim, bolt head, concrete corner) on hardscape.
- Never use a soft or unstable surface (loose gravel, grass, wood) as a turning point.

### Balancing sight distances

Keep BS and FS distances approximately equal (within 10% of each other) at every setup. This cancels collimation error and earth-curvature/refraction effects. For a 200 ft maximum sight, this means the instrument should be within 10 ft of the midpoint between BS and FS rods.

### Closing the loop

Run the level circuit as a loop (return to the starting BM) or close on a second published BM. Compute the misclosure:

```
Misclosure = Observed elevation of closing BM - Published elevation of closing BM
```

Compare to the allowable misclosure for the survey class:

| Order | Allowable misclosure |
|---|---|
| Second-order Class I | 6 mm * sqrt(K) |
| Second-order Class II | 8 mm * sqrt(K) |
| Third-order | 12 mm * sqrt(K) |

Where K = one-way leveling distance in kilometers. For a 2 km loop (1 km one-way), third-order allowable misclosure = 12 mm * sqrt(1) = 12 mm (0.039 ft).

If the misclosure exceeds the tolerance, re-run the level circuit. Do not distribute an out-of-tolerance misclosure.

## Related

- [Total station setup](total-station-setup.md)
- [Calibration and maintenance](calibration-and-maintenance.md)
- [Level networks](../control-networks/level-networks.md)
- [Control for topographic surveys](../topographic-surveys/control-for-topos.md)
