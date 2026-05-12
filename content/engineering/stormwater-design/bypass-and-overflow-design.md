---
title: "Bypass and Emergency Overflow Design"
section: "engineering/stormwater-design"
order: 50
visibility: public
tags: [bypass, offline-detention, emergency-spillway, overflow-weir, broad-crested-weir, riser-failure]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025, civil3d-2026]
relatedCommands: [CreatePondFromObject, CreateNetwork]
relatedCalculators: [detention-sizing, mannings, broad-crested-weir]
updated: 2026-05-11
sources:
  - title: "USDA NRCS TR-60 (Earth Dams and Reservoirs)"
    url: https://directives.sc.egov.usda.gov/OpenNonWebContent.aspx?content=27397.wba
    verified: 2026-05-11
  - title: "FHWA HDS-2 (Highway Hydrology), 2nd ed."
    url: https://www.fhwa.dot.gov/engineering/hydraulics/pubs/02001/
    verified: 2026-05-11
  - title: "Indianapolis Stormwater Design and Specifications Manual"
    url: https://www.indy.gov/activity/storm-water-design-and-construction-specifications
    verified: 2026-05-11
  - title: "INDOT Indiana Design Manual, Chapter 203 (Hydrology)"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Detention bypass routes the portion of inflow above the BMP's design capacity around the BMP, protecting the BMP from re-suspension and washout — typical in offline water-quality designs.
> 2. Emergency overflow (spillway) sizes for the **100-yr event with the principal outlet assumed plugged**, or for the **500-yr** event for high-hazard impoundments per TR-60 / state dam-safety rules.
> 3. Indiana MS4 standards require **≥ 1.0 ft freeboard** between the emergency-spillway design WSE and the top of berm; many cities require 1.5 ft for berms over 6 ft tall.

## When to bypass

Two common bypass situations:

1. **Offline water-quality BMP.** The BMP (bioretention cell, sand filter, manufactured treatment device) is sized for WQv at a low design flow. Anything above that bypasses the BMP via a diversion weir or splitter manhole and flows directly to the downstream system.
2. **Off-site flow through a development.** Existing run-on from an upstream watershed has to traverse the site to reach the discharge point. If detaining it adds no value (and may worsen downstream timing) the off-site flow can be bypassed around the basin in a separate pipe or channel.

The Indiana Stormwater Quality Manual permits offline BMPs and explicitly favors bypass for sediment-sensitive practices such as sand filters and bioretention.

## Diversion / splitter design

A splitter structure (typically a manhole or weir box) diverts flow up to a threshold rate to the BMP and passes everything above that to the bypass pipe. Design steps:

1. Compute the **WQv peak inflow** (often the 1-yr 5-min or the WQv rainfall intensity).
2. Set the **diversion weir crest** so the BMP-feed pipe runs full at the WQv peak; higher flows back up and spill over the weir into the bypass.
3. Hand-check both extremes: very low flows fully enter the BMP (no bypass at first-flush); very high flows pass through with the BMP-feed pipe surcharged but flow into the BMP no greater than its hydraulic capacity.
4. Confirm the splitter does not cause backwater into upstream pipes at the 100-yr.

## Emergency spillway / overflow weir

Every detention or retention impoundment needs an emergency outlet path that operates **without depending on the principal spillway**. The classic failure mode is a riser plugged by debris during a peak event; the spillway must safely pass the design flood without overtopping the berm.

### Spillway design event

- **Indiana MS4 typical:** 100-yr 24-hr event, riser plugged.
- **High-hazard dam (TR-60 Hazard Class C):** 500-yr or PMF, depending on dam class. Indiana DNR Division of Water permits dams over 20 ft high or storing more than 100 ac-ft.
- **INDOT IDM Chapter 203:** 100-yr for typical roadway detention.

### Broad-crested weir equation

`Q = Cw L H^(3/2)`

with:

- `Cw` = 2.6 to 3.1 (English) for grass-lined broad-crested spillway; **use 2.6 to 3.0 for grass-lined**, 3.0 to 3.1 for paved.
- `L` = crest length (ft)
- `H` = head above crest (ft)

For sharp-crested weirs `Cw ≈ 3.3`. Use the broad-crested value for earthen spillways (the typical case).

### Sizing example

Required spillway discharge `Qe = 65 cfs` at design head `H = 1.0 ft` (Indiana MS4 minimum freeboard). Grass-lined, `Cw = 2.7`.

`L = Q / (Cw H^(3/2)) = 65 / (2.7 × 1.0^1.5) = 24.1 ft`

Round up to 25 ft. Crest elevation = 100-yr WSE; top of berm ≥ crest + 1.0 ft (Indiana MS4); for berms > 6 ft tall many cities require 1.5 ft.

### Spillway protection

- **Grass-lined (vegetated):** acceptable for short-duration flows up to about 4-5 ft/s. Sod establishment period requires temporary lining (turf reinforcement mat).
- **Riprap-lined:** for spillways with flows above ~5 ft/s. Size riprap by `D50 ≥ 0.5 (V^2 / (2 g (SG-1)))` (USACE EM-1110-2-1601 form; SG ≈ 2.65 for granite).
- **Articulated concrete block:** for high-velocity earthen spillways where riprap layer thickness is impractical.

## Bypass pipe sizing

The bypass pipe carries the difference between the inflow design event and the design flow into the BMP. Size it for the **larger of**:

- 100-yr peak minus the BMP-feed peak (if both run at full capacity).
- Pipe-full Manning velocity ≤ 10 ft/s (avoids scour at the splitter outlet).

Confirm the bypass pipe HGL does not surcharge above the downstream manhole rim at the 100-yr.

## Worked example (offline bioretention with bypass)

Site: 2.0-ac parking lot, 95% impervious. WQv = first 1.0 in over impervious.

- WQv peak (from rational, Td = Tc = 5 min, C = 0.85, i_10yr_5min ≈ 7.0 in/hr): Qp,wq ≈ 0.85 × 7.0 × 2.0 × 0.95 = 11.3 cfs at the inlet during the WQv event. (For the lower-frequency WQv design rainfall the peak is much smaller; many manuals size the diversion for the larger of WQv inflow peak or about 0.5 cfs/ac.)
- 10-yr peak (i ≈ 8.5 in/hr at Tc = 5 min): Qp,10 ≈ 14.5 cfs.
- 100-yr peak (i ≈ 9.6 in/hr): Qp,100 ≈ 16.3 cfs.

Splitter: 10-in BMP-feed orifice set so it flows full at the WQv peak. Bypass weir crest set so 100-yr - BMP-feed = 16.3 - 1.0 = 15.3 cfs goes to bypass; at 1.0 ft head and Cw = 2.7, required L = 15.3 / (2.7 × 1.0) = 5.7 ft. Round to 6 ft.

(Calibrate against the local Atlas 14 IDF data and the actual BMP-feed pipe hydraulics; this example uses representative values for illustration only.)

## Common review comments

- Spillway sized for the 100-yr **with riser working** — should assume riser plugged.
- Spillway crest at the 100-yr WSE — must be **above** it.
- No grass establishment lining specified — fails when first storm hits before vegetation establishes.
- Bypass pipe HGL surcharges the upstream system — re-size or lower the diversion crest.
- High-hazard impoundment sized for 100-yr only — Indiana DNR Division of Water requires PMF / 500-yr.

## Related

- [Detention basin sizing](detention-basin-sizing.md)
- [Water-quality volume](water-quality-volume.md)
- [Storm pipe design (breadth)](../stormwater/storm-pipe-design.md)
- [Manning's calculator](/tools/mannings)
- [Detention sizing calculator](/tools/detention-sizing)
