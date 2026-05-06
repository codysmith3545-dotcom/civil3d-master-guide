---
title: "Minimum Technical Standards"
section: "field-and-boundary/professional-practice"
order: 20
visibility: public
tags: [minimum-standards, accuracy, precision, field-procedures]
updated: 2026-05-06
sources:
  - title: "865 IAC 1-12 — Standards of Practice for Surveying in Indiana"
    url: https://www.in.gov/pla/professions/land-surveyors/
    verified: 2026-05-06
  - title: "IC 25-21.5-1-7 — Definition of Surveying"
    url: https://iga.in.gov/laws/2024/ic/titles/25#25-21.5
    verified: 2026-05-06
---

> **TL;DR**
> 1. Indiana minimum technical standards under 865 IAC 1-12 require angular closure of 10 seconds times the square root of the number of angles, and linear closure of at least 1:15,000 for boundary surveys.
> 2. GPS-derived positions must meet or exceed the equivalent positional tolerance — typically 0.07 ft (20 mm) horizontal at the 95% confidence level for boundary work.
> 3. A "survey" under Indiana law (IC 25-21.5-1-7) is a professional act that establishes or retraces boundaries, locates improvements, or determines areas. A "sketch" or "exhibit" that does not purport to establish boundaries is not a survey and does not require a seal — but the line can be thin, and mislabeling work to avoid licensing requirements is a violation.

## Angular closure

865 IAC 1-12 requires that traverse angular closure not exceed:

**Allowable angular error = 10" x sqrt(n)**

where *n* is the number of angles in the traverse. For a typical four-sided traverse (n = 4), the maximum angular misclosure is 20 seconds. For an eight-angle traverse, 28 seconds.

These are minimums. Modern total stations routinely achieve 5-second angular closure, and best practice is to aim for 5" x sqrt(n) or better.

## Linear closure

Minimum linear closure ratios by survey type:

| Survey type | Minimum closure ratio |
|-------------|----------------------|
| Boundary survey (urban/suburban) | 1:15,000 |
| Boundary survey (rural, long lines) | 1:10,000 |
| ALTA/NSPS survey | 1:15,000 (per ALTA Table A) |
| Construction staking (horizontal) | 1:10,000 |
| Topographic survey (horizontal control) | 1:10,000 |

These ratios represent the relative positional precision after adjustment. A 1:15,000 ratio means that over a 1,500 ft traverse, the misclosure must not exceed 0.10 ft.

## GNSS accuracy requirements

When using GNSS (GPS/GLONASS/Galileo) for boundary surveys, the positional accuracy must meet or exceed the equivalent of the linear closure standard:

- **RTK observations:** Horizontal precision of 0.07 ft (20 mm) + 1 ppm at the 95% confidence level. For a boundary survey, each point should be observed for a minimum of 180 seconds (3 minutes) with a minimum of two independent observations separated in time.
- **Static observations:** For control networks, static sessions of 30 minutes minimum on baselines under 10 km, with processing to achieve 0.03 ft (10 mm) horizontal at 95% confidence.
- **Network adjustment:** When GNSS is used for the primary control, a least-squares network adjustment should be performed. The adjusted coordinates must pass a chi-square test at the 95% confidence level.

865 IAC does not prescribe specific GNSS methodology in detail, but the accuracy outcome must equal or exceed the traverse closure standards. The surveyor should document the equipment, observation parameters, base station source, and adjustment results in the project record.

## What constitutes a "survey"

IC 25-21.5-1-7 defines the practice of surveying to include:

- Establishing or retracing property boundaries.
- Locating or relocating any monument, boundary, or lot line.
- Determining areas of tracts.
- Preparing plats, maps, or reports pertaining to the above.

Work that falls outside this definition — for example, a conceptual site exhibit that shows approximate lot lines for planning purposes without claiming to establish or retrace boundaries — is not a survey and does not require a surveyor's seal.

However, Indiana courts and the licensing board take a functional approach: if a document is used or reasonably expected to be used as if it establishes boundaries, it is treated as a survey regardless of its label. Common pitfalls:

- A "sketch" that includes bearings and distances to hundredths of a foot, depicts monuments, and is relied upon for a real estate closing — that is functionally a survey.
- A "boundary exhibit" prepared by an engineer for a zoning application that shows property lines — if it purports to locate boundaries, it requires a surveyor's seal.
- Topographic mapping that does not address boundaries is generally not a boundary survey, but if the map shows property lines, the boundary portion is surveying.

The safest practice is to seal any work that depicts property boundaries with specific dimensions, and to clearly label non-survey documents with a disclaimer such as: "This exhibit is not a survey and does not establish or retrace property boundaries."

## Calibration and equipment

865 IAC does not prescribe specific calibration schedules, but the standard of care requires that instruments be maintained and calibrated according to the manufacturer's recommendations. Best practice:

- **Total stations:** Annual factory calibration or service; field checks (collimation, tilt, EDM constant) at the start of each project.
- **GNSS receivers:** Firmware updates per manufacturer. Check antenna height measurement devices for accuracy. Use NGS OPUS or comparable service to verify base station coordinates periodically.
- **Leveling instruments:** Peg test at the start of each day of leveling work.
- **Steel tapes and measuring devices:** Check against a known baseline annually.

Maintain a calibration log. In litigation, a surveyor who cannot demonstrate that equipment was calibrated is vulnerable to a claim that the measurements are unreliable.

## Related

- [865 IAC 1-12 Standards of Practice](indiana-865-iac.md)
- [Survey plat preparation](survey-plat-preparation.md)
- [Coordinate systems](../coordinate-systems/)
- [ALTA survey requirements](../boundary-and-alta/)
