---
title: "Marion County, Indiana"
section: "jurisdictions/indiana/marion-county"
order: 10
visibility: public
tags: [indiana, marion-county, indianapolis, unigov]
updated: 2026-05-11
sources:
  - title: "Indianapolis & Marion County (Unigov) — Government"
    url: "https://www.indy.gov/"
    verified: 2026-05-06
  - title: "Marion County Recorder"
    url: "https://www.indy.gov/agency/marion-county-recorder"
    verified: 2026-05-11
  - title: "Code of Ordinances, Indianapolis - Marion County"
    url: "https://library.municode.com/in/indianapolis_-_marion_county/codes/code_of_ordinances"
    verified: 2026-05-11
# verification-needed: setbacks (zoning code reorganised under Chapter 744 / Indy Rezone; numbers
#   shown here are typical Dwelling District D-5 / Commercial C-S values that must be confirmed
#   against the current Consolidated Zoning and Subdivision Ordinance for any specific parcel)
# verification-needed: stormwater_thresholds (Indy Stormwater Manual editions evolve;
#   verify the 5000 sqft detention trigger against the currently adopted edition)
# verification-needed: recording_requirements.fee_first_page_usd (recorder fee schedule
#   is set by ordinance under IC 36-2-7-10 and is periodically revised)
submittal_checklist:
  - id: stamped-signed-by-licensed-surveyor
    label: "Plat or survey stamped and signed by an Indiana-licensed land surveyor"
    category: submittal
    citation: "IC 25-21.5; 865 IAC 1-12"
  - id: legal-description-matches-plat
    label: "Legal description on the recorded instrument matches the plat geometry"
    category: drafting
    citation: "865 IAC 1-12-21"
  - id: north-arrow-and-scale
    label: "North arrow and graphic scale on every plan and plat sheet"
    category: drafting
    citation: "865 IAC 1-12"
  - id: monumentation-set-or-found
    label: "All section, quarter, and boundary monuments shown as set or found with type and size"
    category: drafting
    citation: "865 IAC 1-12-19"
  - id: drainage-report-per-indy-manual
    label: "Drainage report and SWQMP per Indianapolis Stormwater Design and Specifications Manual"
    category: submittal
    citation: "Indy Stormwater Manual"
  - id: idem-rule-5-noi
    label: "IDEM Construction Stormwater General Permit (Rule 5) NOI submitted for disturbance >= 1 ac"
    category: submittal
    citation: "327 IAC 15-5"
  - id: dpw-drainage-permit
    label: "DPW drainage / stormwater plan review approval letter prior to construction"
    category: review
    citation: "Revised Code, Chapter 561 (Stormwater)"
  - id: row-driveway-permit-dpw
    label: "Right-of-way / driveway permit issued by DPW"
    category: submittal
    citation: "Revised Code, Chapter 431 (Use of Public Ways)"
  - id: sanitary-will-serve-citizens
    label: "Sanitary will-serve and connection approval from Citizens Energy Group"
    category: submittal
  - id: marion-county-surveyor-regulated-drain
    label: "Marion County Surveyor signoff if a regulated drain is touched"
    category: review
    citation: "IC 36-9-27"
  - id: ilp-improvement-location-permit
    label: "Improvement Location Permit (ILP) issued by DBNS prior to construction"
    category: submittal
    citation: "Revised Code, Chapter 731 / 744"
  - id: plat-recorded-with-recorder
    label: "Approved plat recorded with the Marion County Recorder"
    category: recording
    citation: "IC 36-7-3-7; IC 36-2-11"
setbacks:
  residential:
    front_ft: 25
    side_ft: 6
    rear_ft: 20
    corner_side_ft: 15
  commercial:
    front_ft: 30
    side_ft: 10
    rear_ft: 25
  agricultural:
    front_ft: 50
    side_ft: 25
    rear_ft: 50
  citations:
    - "Indianapolis - Marion County Revised Code, Chapter 744 (Consolidated Zoning and Subdivision Ordinance)"
stormwater_thresholds:
  detention_trigger_sqft: 5000
  water_quality_trigger_sqft: 5000
  bmp_required_above_sqft: 5000
  citations:
    - "Indianapolis Stormwater Design and Specifications Manual (Indy Stormwater Manual)"
    - "Revised Code, Chapter 561 (Stormwater Management)"
recording_requirements:
  paper_size: "8.5x14"
  margin_top_in: 2
  margin_left_in: 0.5
  margin_right_in: 0.5
  margin_bottom_in: 0.5
  ink_color: black
  fee_first_page_usd: 25
  fee_each_additional_usd: 25
  citations:
    - "IC 36-2-11-16.5 (recording standards)"
    - "IC 36-2-7-10 (recorder fee schedule)"
    - "Marion County Recorder document standards"
plat_requirements:
  - item: "North arrow"
    required: true
  - item: "Graphic scale and written scale"
    required: true
  - item: "Indiana-licensed land surveyor seal and signature"
    required: true
    notes: "865 IAC 1-12 requires signed and sealed plats"
  - item: "Legal description tied to a U.S. Public Land Survey System corner"
    required: true
    notes: "Section, township, range, and PLSS tie required"
  - item: "Basis of bearings statement"
    required: true
  - item: "Monumentation table (set / found monuments with type and size)"
    required: true
    notes: "865 IAC 1-12-19"
  - item: "Boundary distances and bearings on every line"
    required: true
  - item: "Curve data table (radius, delta, arc, chord bearing and distance)"
    required: true
  - item: "Lot numbers, lot areas, and block designations"
    required: true
  - item: "Public and private easements with dimensions and purpose"
    required: true
  - item: "Right-of-way widths and street names"
    required: true
  - item: "Floodplain / floodway boundaries with FEMA FIRM panel reference"
    required: true
    notes: "Required if any portion of the plat is in a Special Flood Hazard Area"
  - item: "Vicinity / location map"
    required: true
  - item: "Owner's certificate, dedication, and consent"
    required: true
  - item: "Surveyor's certificate"
    required: true
  - item: "Plan Commission approval certificate"
    required: true
  - item: "Auditor and Recorder certificate blocks"
    required: true
---

> **TL;DR**
> 1. **Marion County and the City of Indianapolis are consolidated** under "Unigov" since 1970 — most county functions are run by the City of Indianapolis. Five "excluded cities/towns" inside the county retain their own zoning/planning powers: **Beech Grove, Lawrence, Southport, Speedway**, plus the unincorporated balance ("Indianapolis").
> 2. Civil/site review is run by **DPW (Department of Public Works)** for stormwater/sanitary/ROW and **DBNS (Department of Business and Neighborhood Services)** for zoning/permitting.
> 3. The **Indianapolis Stormwater Design and Specifications Manual (Indy Stormwater Manual)** is the controlling stormwater design document.

## Authorities

- **City of Indianapolis / Marion County (Unigov)** — https://www.indy.gov/
- **DPW (Engineering, Stormwater, Sanitary)** — https://www.indy.gov/agency/department-of-public-works
- **DBNS (Permits, Plan Review)** — https://www.indy.gov/agency/department-of-business-and-neighborhood-services
- **Marion County Surveyor's Office** — https://www.indy.gov/agency/marion-county-surveyors-office
- **Citizens Energy Group** — runs water and sanitary in most of the county (privatized 2011).
- **Marion County Drainage Board** — under DPW; reviews regulated drains.

## Key documents

- **Indianapolis Stormwater Design and Specifications Manual** ("Indy Stormwater Manual") — the city's stormwater BMP and conveyance manual.
- **Subdivision Control Ordinance** — Marion County, in the Code of Ordinances under Chapter 731 (Subdivision Control).
- **Revised Code of the Consolidated City and County (Indianapolis-Marion County)** — https://library.municode.com/in/indianapolis_-_marion_county

## Municipalities (excluded cities/towns)

- [Indianapolis (the unincorporated balance / Unigov)](municipalities/indianapolis/index.md)
- [Beech Grove](municipalities/beech-grove/index.md)
- [Lawrence](municipalities/lawrence/index.md)
- [Southport](municipalities/southport/index.md)
- [Speedway](municipalities/speedway/index.md)

> "Indianapolis" effectively governs all of Marion County except the four excluded cities/towns above. Cumberland straddles the Marion–Hancock county line; for the Marion-side portion, Indianapolis review applies. Verify each project's location in the city/county GIS.

## Plan review (Indianapolis side)

For sites in the Indianapolis (Marion County) portion:
1. **Pre-development meeting** with DPW (recommended for >1 ac).
2. **Drainage permit / stormwater plan review** through DPW.
3. **Construction Stormwater General Permit (CSGP)** — IDEM Rule 5, where applicable.
4. **ROW / driveway permit** — DPW.
5. **Sanitary connection permit** — Citizens Energy Group.
6. **Improvement Location Permit / Building Permit** — DBNS (zoning compliance).

## Related

- [State of Indiana](../state/index.md)
- [IDEM Rule 5](../state/idem-rule-5.md)
- [Stormwater (engineering)](../../../engineering/stormwater/index.md)
- [Plan-review checklist generator](/checklist)
