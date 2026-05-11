---
title: "Service Connection Sizing (tap, curb stop, meter, internal service)"
section: "engineering/water-distribution-design"
order: 40
visibility: public
tags: [service-line, meter, tap, curb-stop, awwa-m22, fixture-units, hunters-curve]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePressurePipeNetwork, EditPressurePipeNetwork]
relatedCalculators: [hazen-williams, fixture-units]
updated: 2026-05-11
sources:
  - title: "AWWA M22 (Sizing Water Service Lines and Meters), 3rd ed."
    url: https://www.awwa.org/Store/Product-Details/productId/65709"
    verified: 2026-05-11
  - title: "International Plumbing Code (IPC) 2024, Chapter 6"
    url: https://codes.iccsafe.org/content/IPC2024P1"
    verified: 2026-05-11
  - title: "Recommended Standards for Water Works (Ten States Standards Water), 2018 ed., §8.7"
    url: https://10statesstandards.com/
    verified: 2026-05-11
  - title: "Indiana 327 IAC 8 (Public Water Supply)"
    url: https://www.in.gov/legislative/iac/title327.html
    verified: 2026-05-11
---

> **TL;DR**
> 1. A service connection has four sized components: **tap** (corp stop at the main), **service line** (main to curb stop), **curb stop / meter setter**, and **internal service** (meter to building). AWWA M22 sizes by **peak instantaneous demand** from fixture-unit count converted via Hunter's curve.
> 2. Indiana residential default: **3/4-in or 1-in copper service** from a 3/4-in or 1-in corporation stop, **5/8 × 3/4-in displacement meter** for ≤ 20 fixture units, with **30 psi minimum residual** at the meter under MDD.
> 3. Commercial / multifamily services are usually sized from a full plumbing fixture-unit count. **Do not size by building area alone** — it under-predicts for high-fixture occupancies (restaurants, hotels) and over-predicts for office.

## Components and their roles

| Component | Purpose | Common sizes |
|---|---|---|
| Tap / corporation stop | Connection at main, isolates service | 3/4, 1, 1-1/2, 2 in |
| Service line (main to curb stop) | Buried pipe to right-of-way line | 3/4 in - 4 in copper or HDPE; > 4 in usually ductile iron |
| Curb stop / meter setter | Utility shutoff and meter location | matched to service size |
| Meter | Billing measurement | 5/8 × 3/4, 3/4, 1, 1-1/2, 2, 3, 4, 6, 8 in |
| Internal service | Meter to building, building-side | per plumbing code |
| Backflow preventer | Cross-connection control | per local utility policy |

## Sizing method (AWWA M22)

The standard process:

1. **Count fixture units** for the building per IPC Table 604.3 (water supply fixture units, WSFU).
2. **Convert WSFU to peak demand** via Hunter's curve (IPC Appendix E or AWWA M22 Figure 3-2). The probabilistic basis of Hunter's curve makes peak less than the simple sum.
3. **Add continuous demand** (process water, cooling, irrigation) separately at the actual rate.
4. **Size service line** so head loss at peak demand keeps residual pressure ≥ 30 psi at the meter / building entry (some utilities require 35 psi).
5. **Size meter** so peak demand is within the meter's normal-range flow (typically 50%-100% of its maximum continuous duty).

### Fixture-unit examples (IPC Table 604.3)

| Fixture | Hot WSFU | Cold WSFU | Total WSFU |
|---|---|---|---|
| Bathtub | 1.0 | 1.0 | 1.4 |
| Lavatory | 0.5 | 0.5 | 0.7 |
| Water closet (1.6 gpf) | 0 | 2.5 | 2.5 |
| Kitchen sink | 1.0 | 1.0 | 1.4 |
| Shower | 1.0 | 1.0 | 1.4 |
| Clothes washer | 1.0 | 1.0 | 1.4 |
| Dishwasher | 1.4 | 0 | 1.4 |
| Hose bibb | 0 | 2.5 | 2.5 |

(WSFU values from IPC 2024 Table 604.3; verify against the current adopted version in your jurisdiction.)

Typical 4-bedroom home: 1 bathtub + 3 lavatories + 3 water closets + 1 kitchen sink + 1 shower + 1 clothes washer + 1 dishwasher + 2 hose bibbs = roughly 1.4 + 2.1 + 7.5 + 1.4 + 1.4 + 1.4 + 1.4 + 5.0 = ~21.6 WSFU. Hunter's curve at ~22 WSFU → roughly 18-20 gpm peak demand.

### Hunter's curve key points

Approximate gpm from Hunter's curve (single-occupancy residential, flush tanks):

| WSFU | Peak demand (gpm) |
|---|---|
| 5 | 7 |
| 10 | 12 |
| 20 | 18 |
| 50 | 33 |
| 100 | 55 |
| 200 | 95 |
| 500 | 180 |
| 1000 | 290 |
| 2000 | 470 |

(Values follow Hunter's published curves; the smooth curve is best read from AWWA M22 Figure 3-2.)

## Meter sizing

Match peak demand to the meter's normal-range maximum (continuous duty rating):

| Meter size | Max continuous (gpm) | Typical use |
|---|---|---|
| 5/8 × 3/4 in | 20 | Single-family ≤ 25 WSFU |
| 3/4 in | 30 | Large single-family, small duplex |
| 1 in | 50 | Townhouse / small commercial |
| 1-1/2 in | 100 | Multifamily small bldg, restaurant |
| 2 in | 160 | Multifamily medium, retail |
| 3 in turbine | 350 | Commercial / industrial |
| 4 in compound | 600 | Hospital, large commercial |
| 6 in compound | 1,250 | Industrial |
| 8 in compound | 1,800 | Industrial |

Oversized meters under-register low flows (irrigation drips, leaks) — significant revenue loss. Undersized meters over-pressurize and wear quickly. AWWA M22 explicitly recommends compound meters for buildings with both very low (fire-watch) and very high (peak occupancy) flow ranges.

## Service line sizing

The service line should not lose more than about 5-10 psi at peak demand. Use Hazen-Williams or the manufacturer's friction chart. For 1-in Type K copper at 18 gpm:

`hf ≈ 0.025 ft/ft (typical chart value); 100 ft of service → 2.5 ft = 1.1 psi loss.`

Acceptable. A 3/4-in copper at 18 gpm would lose roughly 0.08 ft/ft × 100 ft = 8 ft = 3.5 psi — also acceptable, but tighter.

## Worked example

4-bedroom home with finished basement bathroom: 28 WSFU total. Hunter's curve peak ≈ 22 gpm. Site:

- Main pressure (static) = 65 psi.
- Service line length = 120 ft, expected to be 1-in HDPE (C = 150).
- Internal service through 100 ft of 3/4-in copper (C = 130).

Head loss at 22 gpm:

- 1-in HDPE: Hazen-Williams ≈ 0.018 ft/ft × 120 ft = 2.2 ft = 1.0 psi.
- 5/8 × 3/4-in meter loss at 22 gpm: ≈ 3.5 psi (typical AWWA M22 chart).
- 3/4-in copper internal: ≈ 0.10 ft/ft × 100 ft = 10 ft = 4.3 psi.

Total loss ≈ 8.8 psi. Building entry pressure ≈ 65 - 8.8 = 56.2 psi at peak. Comfortable. **5/8 × 3/4-in meter, 1-in service is adequate.**

## Common review comments

- Sized service by building square footage rather than fixture count — under-sizes restaurants and hotels.
- Used aggregate (summed) gpm rather than Hunter's curve peak — over-sizes 5x to 10x.
- Meter on the high-end of its continuous range — short meter life; upsize by one step.
- Missing backflow preventer on irrigation tap — required by 327 IAC 8 in Indiana.
- Service crosses a sanitary lateral within 18 in vertical — fails 327 IAC 8-3.2 separation rule.

## Related

- [Demand estimation (breadth)](../water-distribution/demand-estimation.md)
- [Pipe sizing and velocity (breadth)](../water-distribution/pipe-sizing-velocity.md)
- [Backflow prevention (breadth)](../water-distribution/backflow.md)
- [Fire-flow requirements](fire-flow-requirements.md)
- [Hazen-Williams calculator](/tools/hazen-williams)
- [Fixture-unit calculator](/tools/fixture-units)
