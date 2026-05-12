---
title: "CEU Module 4 - Deed Research and Record Search"
section: "ceu"
order: 4
visibility: public
tags: [ceu, indiana, professional-development, deed-research, title]
appliesTo: [civil3d-2024, civil3d-2025, civil3d-2026]
updated: 2026-05-11
ceu:
  hours: 1.0
  category: professional-practice
  format: self-study
  approval_status: pending
  approval_body: "Indiana State Board of Registration for Surveyors"
  approval_id: null
sources:
  - title: "Indiana County Recorder offices (statewide directory)"
    url: https://www.in.gov/courts/help/county-court/county-recorder/
    verified: 2026-05-11
  - title: "Indiana Code IC 32-21 - Conveyance of Real Property"
    url: https://iga.in.gov/laws/2024/ic/titles/32
    verified: 2026-05-11
  - title: "865 IAC 1-12 - Research requirements"
    url: https://www.in.gov/pla/professions/professional-surveyors-home/
    verified: 2026-05-11
---

> **TL;DR**
> 1. Start with the **current vesting deed**, then chase backward through prior owners until you reach a **common grantor** with the adjoining tracts. That is the senior/junior reference for boundary work.
> 2. Indiana counties keep recorder records as **deed books** (pre-electronic) and **document numbers** (modern). Cite both styles when they appear on the chain.
> 3. **Problematic deeds** to watch for: mother hubbards, quitclaims of "all my interest," metes with arithmetic that does not close, references to lost or destroyed plats, descriptions that move with a moving monument ("along the centerline of the creek").
> 4. The surveyor's research file is **a permanent record under 865 IAC 1-12** and should be retainable, reproducible, and dated. A scanned, indexed PDF set is the modern minimum.

## Learning objectives

- Build a deed chain from current vesting back to a common grantor.
- Read a metes-and-bounds description and identify closure errors, ambiguous calls, and conflicts with adjoiners.
- Identify the corollary records (plats, vacation orders, condemnation orders, easements) that complete a parcel's title picture.
- Document research findings in a form that satisfies 865 IAC 1-12 and supports the surveyor's professional opinion.

## Reading

### 1. The research goal

A boundary surveyor researches deeds to answer two questions:

1. **What did the original grantor describe?** Without an original description, retracement is guesswork.
2. **How has the description been modified by subsequent conveyances?** Did adjoining tracts split off slivers, easements, or vacated rights-of-way? Did any owner abandon a portion?

The answer is rarely in one document. A complete deed chain shows the parcel as it was first carved out, then every subsequent conveyance, plus the corollary records (plats, vacations, easement grants, condemnation orders) that affect title.

### 2. Indiana recording mechanics

Each Indiana county elects a **Recorder** who maintains real property records. Modern Indiana recorders publish electronic indices accessible through the county website; older books are typically scanned and viewable on-site, with a small fee per page for copies.

Two indexing systems matter:

- **Grantor-grantee index.** Alphabetical by name and year. The primary way to walk a chain backward: search the current owner as grantee, find the conveyance into them, then search the grantor as grantee on an earlier date, and so on.
- **Tract index.** Indexed by Section-Township-Range or by lot/block for platted areas. Useful when names change (marriage, business reorganization) or when a parcel was sold in pieces.

Modern Indiana counties also expose **document numbers** (e.g., "2024009876"), which uniquely identify a recorded instrument and are the preferred citation form for documents after roughly the mid-1990s. Older instruments are cited as **deed book and page** (e.g., "Deed Book 234, Page 17").

### 3. The chain-of-title workflow

A typical chain-of-title build:

1. Identify the **current vesting deed** from the county GIS or tax records. Note the document number, date, grantor, grantee, and the **description** (legal description, exhibit attached or by reference).
2. Search the grantor as a **grantee** to find the prior conveyance into them. Pull that deed; note its grantor and date.
3. Repeat backward. The "stop" is when (a) you reach an original government conveyance (federal land patent, state grant, or original plat), or (b) you cross the **common-grantor horizon** for the adjoiner you are researching.
4. For each conveyance in the chain, note any **exceptions**, **reservations**, or references to surveys or plats. These are where slivers and easements hide.

For each **adjoining tract**, build a parallel chain just deep enough to reach the common grantor. Then compare descriptions: do they share a call, a monument, or a bearing-distance pair? If yes, that is the controlling boundary feature.

### 4. Reading a metes-and-bounds description

A well-drafted metes description begins at a defined **point of beginning** tied to a monument, then describes a closed traverse using calls of the form:

> Thence North 45 deg 23 min 17 sec East, 142.36 feet to an iron pin

The surveyor's job is to:

- **Check closure.** Trace each call as a vector; the sum should return to the point of beginning within a tolerance reasonable for the date and method of original survey. Pre-1900 descriptions may close to 1:1000 at best; modern descriptions should close to 1:5000 or better.
- **Identify ambiguous calls.** "Thence along the road" is precise only if the road's centerline or right-of-way is defined elsewhere. "More or less" is a flag, not a measurement.
- **Cross-check adjoiners.** Each call should be consistent with the adjoiner's description. If Adams's deed says "thence East 100 ft along the line of Baker," then Baker's deed should call the same line.

### 5. Problematic descriptions

Common red flags:

- **Mother hubbard clause.** "Also all other real estate owned by the grantor in [county]." Means the conveyance is broader than the metes description. Investigate.
- **Quitclaim of "all interest."** Conveys whatever the grantor has, even if that is nothing. Useful for clearing clouds but not a substitute for a recorded source of title.
- **Reference to a plat that does not exist.** Some 19th-century Indiana deeds cite plats that were never recorded or were destroyed in courthouse fires. Treat the cited plat as a phantom and rebuild the parcel from contemporaneous deeds.
- **Movable monuments.** "Along the centerline of Crooked Creek" gives the surveyor a problem: where was the centerline on the date of the original conveyance? Indiana case law generally fixes the line at the centerline as it existed when the deed was made, unless a court has held otherwise for the specific water body.
- **Arithmetic errors.** A call of "East 100 ft, thence North 100 ft, thence South 45 deg West 141.4 ft to point of beginning" looks good until you notice that South 45 West from (100,100) returns to (0,0), which is correct, but a single misread degree or transposed digit can throw the closure by tens of feet.

### 6. Corollary records to pull

Beyond the deeds themselves, a complete research file in Indiana includes:

- Recorded **subdivision plats** (county recorder and county engineer/surveyor).
- **Right-of-way vacation orders** by county commissioners or municipal councils.
- **Condemnation orders** (state or local agencies).
- **Easement grants** (utility, drainage, access).
- The **original government survey field notes** (BLM/GLO surveys for PLSS counties; available at the BLM GLO Records site).
- **Highway plans** for any state or county road bordering the parcel; INDOT historic plans are accessible through INDOT's record retention process.
- The **county surveyor's section corner records**, often the best source of recovered PLSS evidence.

### 7. Documentation

865 IAC 1-12 requires the surveyor to retain the research underlying every recorded survey for the period prescribed by the rule. In practice this means a per-project research file containing:

- A **deed chain summary** (grantor / grantee / date / document number / description excerpt).
- Scanned copies of every deed in the chain.
- Plats, vacations, easements, and other corollary records.
- A **research narrative** documenting what was searched, what was found, and what gaps remain.
- A **conclusions section** stating the surveyor's interpretation of how the records resolve or do not resolve the boundary.

The narrative is the most important part: a successor surveyor must be able to reconstruct your reasoning from the file alone.

## Self-assessment

<details>
<summary>Question 1</summary>

Why is the grantor-grantee index the primary tool for chain-of-title work?

**Answer:** It allows the researcher to walk backward in time by finding each prior conveyance into the current owner, then searching that prior owner as a grantee on an earlier date.
</details>

<details>
<summary>Question 2</summary>

A 1957 deed describes a tract as "the West 100 feet of the East 200 feet of Lot 12, except a strip 10 feet wide off the South thereof for road purposes." A modern survey shows the lot is 199.6 ft wide. How wide is the conveyed tract?

**Answer:** 100 ft wide (the senior right of "the East 200 feet" controls; subtract a 100-ft strip from the east 200-ft tract). The deficiency falls in whatever remains west of that.
</details>

<details>
<summary>Question 3</summary>

A description calls "thence along the meander of the Wabash River." How should the surveyor handle this on a modern retracement?

**Answer:** Determine whether the river is navigable (state-owned bed, line at OHWM) or non-navigable (thread of the stream). Locate the appropriate line as of today, and note in the report whether the river has migrated since the conveyance date.
</details>

<details>
<summary>Question 4</summary>

Name three corollary records, beyond deeds, that should be part of a complete Indiana research file.

**Answer:** Any three of: recorded subdivision plat, right-of-way vacation order, easement grant, condemnation order, county surveyor section corner record, INDOT or county highway plans, original BLM/GLO survey notes.
</details>

## Cited sources

1. Indiana Code IC 32-21 (Conveyance of Real Property).
2. 865 IAC 1-12 (research and documentation requirements).
3. BLM General Land Office Records, https://glorecords.blm.gov/.
4. Indiana County Recorder offices statewide directory.

## Time log

Estimated 50 minutes of focused study plus 10 minutes of self-assessment. Total: 1.0 PDH.
