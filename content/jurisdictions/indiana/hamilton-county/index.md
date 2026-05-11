---
title: "Hamilton County, Indiana"
section: "jurisdictions/indiana/hamilton-county"
order: 20
visibility: public
tags: [indiana, hamilton-county, carmel, fishers, noblesville]
updated: 2026-05-11
sources:
  - title: "Hamilton County government"
    url: "https://www.hamiltoncounty.in.gov/"
    verified: 2026-05-06
  - title: "Hamilton County Surveyor"
    url: "https://www.hamiltoncounty.in.gov/239/Surveyor"
    verified: 2026-05-11
  - title: "Hamilton County Recorder"
    url: "https://www.hamiltoncounty.in.gov/228/Recorder"
    verified: 2026-05-11
# verification-needed: setbacks (Hamilton County Zoning Ordinance applies to unincorporated
#   areas only; values below are typical R-1 / B-1 / A-2 yards and must be confirmed for any
#   specific parcel against the currently adopted ordinance)
# verification-needed: stormwater_thresholds (Hamilton County Stormwater Management Technical
#   Standards Manual editions evolve; verify the trigger thresholds against the currently
#   adopted manual)
# verification-needed: recording_requirements.fee_first_page_usd (fees set under IC 36-2-7-10
#   and revised periodically)
submittal_checklist:
  - id: stamped-signed-by-licensed-surveyor
    label: "Plat or survey stamped and signed by an Indiana-licensed land surveyor"
    category: submittal
    citation: "IC 25-21.5; 865 IAC 1-12"
  - id: county-surveyor-review-regulated-drain
    label: "Hamilton County Surveyor review for any regulated drain crossing or relocation"
    category: review
    citation: "IC 36-9-27"
  - id: drainage-report-per-county-manual
    label: "Drainage report per Hamilton County Stormwater Management Technical Standards Manual"
    category: submittal
  - id: idem-rule-5-noi
    label: "IDEM Rule 5 NOI for construction disturbance >= 1 ac"
    category: submittal
    citation: "327 IAC 15-5"
  - id: highway-permit
    label: "Hamilton County Highway permit for county-road access or work in county ROW"
    category: submittal
  - id: plan-commission-approval
    label: "Hamilton County Plan Commission action on primary and secondary plat"
    category: review
    citation: "Hamilton County Subdivision Control Ordinance"
  - id: monumentation-set
    label: "Corner monuments set per 865 IAC 1-12-19 with type and size noted on the plat"
    category: drafting
    citation: "865 IAC 1-12-19"
  - id: legal-description
    label: "Legal description matches plat geometry and ties to a PLSS corner"
    category: drafting
  - id: surety-bond
    label: "Performance and maintenance surety posted before construction release"
    category: submittal
  - id: plat-recorded
    label: "Approved plat recorded with the Hamilton County Recorder"
    category: recording
    citation: "IC 36-2-11; IC 36-7-3-7"
setbacks:
  residential:
    front_ft: 40
    side_ft: 10
    rear_ft: 25
    corner_side_ft: 25
  commercial:
    front_ft: 50
    side_ft: 15
    rear_ft: 30
  agricultural:
    front_ft: 50
    side_ft: 25
    rear_ft: 50
  citations:
    - "Hamilton County Zoning Ordinance (unincorporated areas only)"
stormwater_thresholds:
  detention_trigger_sqft: null
  water_quality_trigger_sqft: null
  bmp_required_above_sqft: null
  citations:
    - "Hamilton County Stormwater Management Technical Standards Manual (verify adopted edition)"
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
plat_requirements:
  - item: "North arrow"
    required: true
  - item: "Graphic and written scale"
    required: true
  - item: "Indiana-licensed land surveyor seal and signature"
    required: true
    notes: "865 IAC 1-12"
  - item: "Basis of bearings statement"
    required: true
  - item: "Legal description tied to PLSS corner"
    required: true
  - item: "Monumentation table"
    required: true
    notes: "865 IAC 1-12-19"
  - item: "Boundary courses and distances on every line"
    required: true
  - item: "Curve data table"
    required: true
  - item: "Lot numbers, lot areas, block designations"
    required: true
  - item: "Easements with dimensions and purpose"
    required: true
  - item: "Right-of-way widths and street names"
    required: true
  - item: "Floodplain / floodway boundaries with FIRM panel reference"
    required: true
  - item: "Vicinity map"
    required: true
  - item: "Owner's certificate and dedication"
    required: true
  - item: "Surveyor's certificate"
    required: true
  - item: "Plan Commission, Auditor, and Recorder certificate blocks"
    required: true
---

> **TL;DR**
> 1. Hamilton County is north of Marion. **Noblesville is the county seat**. Major cities/towns: **Carmel, Fishers, Noblesville, Westfield, Cicero, Sheridan, Arcadia, Atlanta**.
> 2. Hamilton County is heavily MS4-regulated; both the county and most cities have their own stormwater technical standards.
> 3. **Hamilton County Surveyor's Office** is the regulated-drain authority. The county has its own **Stormwater Management Technical Standards Manual**.

## Authorities

- **Hamilton County government** — https://www.hamiltoncounty.in.gov/
- **Hamilton County Surveyor** — https://www.hamiltoncounty.in.gov/239/Surveyor
- **Hamilton County Engineer (Highway Department)** — https://www.hamiltoncounty.in.gov/229/Highway
- **Hamilton County Plan Commission** — https://www.hamiltoncounty.in.gov/237/Planning-Department
- **Hamilton County Drainage Board** — under the Surveyor.

## Key documents

- **Hamilton County Stormwater Management Technical Standards Manual** — the county-adopted stormwater + drainage standards (verify current revision via Surveyor's site).
- **Subdivision Control Ordinance** — Hamilton County (unincorporated areas).

## Municipalities

- [Carmel](municipalities/carmel/index.md) — large city, adopted **Carmel Stormwater Technical Standards Manual** + Carmel Engineering standards.
- [Fishers](municipalities/fishers/index.md) — incorporated as a city 2015; has its own engineering and stormwater standards.
- [Noblesville](municipalities/noblesville/index.md) — county seat; adopted standards manual.
- [Westfield](municipalities/westfield/index.md) — fast-growing; own engineering and stormwater standards.
- [Cicero](municipalities/cicero/index.md)
- [Sheridan](municipalities/sheridan/index.md)
- [Arcadia](municipalities/arcadia/index.md)
- [Atlanta](municipalities/atlanta/index.md)

## Related

- [State of Indiana](../state/index.md)
- [Indianapolis MSA stormwater overview](../state/idem-rule-13.md)
