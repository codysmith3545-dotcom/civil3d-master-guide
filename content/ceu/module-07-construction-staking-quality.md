---
title: "CEU Module 7 - Construction Staking Quality"
section: "ceu"
order: 7
visibility: public
tags: [ceu, indiana, professional-development, construction-staking, qa-qc]
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
  - title: "INDOT Survey Manual - Construction Staking"
    url: https://www.in.gov/indot/design-manual/
    verified: 2026-05-11
  - title: "ACSM/NSPS Positional Accuracy Standards"
    url: https://www.nsps.us.com/
    verified: 2026-05-11
  - title: "ASCE 38 - Standard Guideline for the Collection and Depiction of Existing Subsurface Utility Data"
    url: https://www.asce.org/publications-and-news/asce-standards
    verified: 2026-05-11
---

> **TL;DR**
> 1. Construction staking precision should be **commensurate with construction tolerances**, which are usually looser than survey-grade. Don't over-precise; do verify.
> 2. **Densify control** before staking. Stake from primary control tied to NGS or project control, not from random points-of-convenience.
> 3. **Layout precision** depends as much on **stake placement and identification** as on the underlying coordinate. A correct coordinate on an illegible or mislabeled stake produces a wrong wall.
> 4. **As-built verification** closes the loop: every staked feature should be re-shot after construction to confirm position and elevation. As-builts are also where many liability claims start, so the discipline is mandatory.

## Learning objectives

- Plan a control densification appropriate to the project's tolerances.
- Match staking precision to construction tolerance per the relevant standard (INDOT, ACI, ASTM).
- Identify the quality-control checks that catch the most common staking errors.
- Document as-built verification in a form that supports the surveyor's certification.

## Reading

### 1. Construction staking is risk management

A construction stake is a temporary monument that tells a contractor where to put something permanent. If the stake is wrong, the wall, curb, pipe, or column is wrong. The surveyor's liability for construction staking is direct: the work that follows depends on the stakes.

The risk is asymmetric. A boundary survey has its measurement permanently recorded on a plat with a seal; a staking error often disappears under concrete. By the time anyone notices, the cost of repair is many times the cost of the stake.

Practical implications:

- The staking standard of care is at least as high as the boundary standard of care, even though the survey product looks ephemeral.
- The staking record - the stake list, calc sheets, field notes, as-builts - must be retainable and reproducible.
- Verification is part of the work, not an optional add.

### 2. Control densification

Before any staking, the surveyor builds a network of project control monuments dense enough to stake every feature from a clear sight or a short instrument move.

Typical Indiana practice for a commercial site:

- 4-6 primary control points placed around the perimeter, tied to NGS or project-published control by RTK plus static post-processing (or by total-station traverse from published monuments).
- Secondary points inside the work area, typically on stable surfaces (top of curb, concrete pads), at intervals appropriate to the staking equipment.
- All primary points monumented with stamped caps; secondary points often nails-and-disks or PK nails.

Control should be **verified before staking begins** by independent re-observation. A simple discipline: shoot every primary control point from at least two other primary control points and check the residuals. Residuals over a project-specific threshold (say, 0.02 ft horizontal, 0.04 ft vertical for a typical site) get re-investigated before any field crew sets a stake.

### 3. Staking precision vs construction tolerance

Different features have different construction tolerances. The stake's positional accuracy should be **tighter than the construction tolerance** but not absurdly tighter.

| Feature | Typical construction tolerance | Typical staking accuracy target |
|---------|--------------------------------|----------------------------------|
| Property corners | per 865 IAC 1-12 | 0.02 ft horizontal |
| Curb stakes | 0.05 ft (typical municipal spec) | 0.02 ft |
| Building corners | 0.10 ft (varies by structural type) | 0.02 ft |
| Storm pipe invert | 0.05-0.10 ft (per spec) | 0.02 ft vertical |
| Mass grading | 0.5 ft | 0.05 ft (or coarse machine control) |
| Curb top-of-curb elevation | 0.01-0.02 ft | 0.01 ft |
| ADA ramp slopes | per 2010 ADA Standards (max 1:12 running, 1:48 cross) | tight enough to verify slope |

Specifications govern; the table is for planning. The principle: **measure the spec, target one-third of it**, allow the rest for placement, dust, weather, contractor cuts.

### 4. Stake legibility and identification

A correct coordinate on a stake that the contractor cannot read or that gets pulled produces an error indistinguishable from a wrong coordinate.

Best practices:

- **Mark every stake with the feature, station/offset, and cut/fill**, in marker that survives one rain.
- **Stake offsets, not centerlines**, where practical. A stake 5 ft from the curb stays in place while the curb is poured; a centerline stake gets buried.
- **Use lath, not just hubs**, for any stake the contractor must visually reference from a distance. The lath carries the information; the hub holds the position.
- **Maintain a stake list** with feature, station/offset, designed coordinate, design elevation, cut/fill, and time set. The list is signed and dated.
- **Re-stake when stakes are disturbed.** Document the re-stake.

### 5. Civil 3D inputs to staking

Modern projects use Civil 3D corridors and feature lines as the staking data source. The surveyor should:

- Receive a **staking package** that names every feature line and surface. Use the Civil 3D Stakeout Reports (or comparable robotic-station export).
- Verify the **drawing units and coordinate system** match the project. A drawing in NAD83 grid coordinates without a CSF transform will stake every feature off by the project's CSF (~1:10,000 in Indiana).
- Validate the **design surface** against the geometry. A surface "above" or "below" a curb feature line by 0.05 ft will produce systematic elevation errors.
- **Lock the design at staking baseline.** Any change after staking begins must be a documented revision and an explicit re-stake.

### 6. As-built verification

As-builts are not optional. The surveyor must re-occupy each significant feature after construction and confirm that the constructed position matches the design within tolerance. Findings:

- **Within tolerance.** Document and certify.
- **Outside tolerance, fixable.** Notify the contractor; document the fix.
- **Outside tolerance, accepted by owner.** Document the variance with an explicit acceptance and the owner's representative signature.
- **Outside tolerance, contested.** Document the measurements; do not certify the work as conforming.

The as-built drawing is signed and sealed by the surveyor when the surveyor's measurements support the as-built conditions shown. If the design data and the as-built measurements disagree, the as-built drawing shows what was measured, not what was designed.

### 7. Common staking errors

In approximate order of frequency in claims:

- **Wrong elevation reference.** Used the wrong benchmark; staked everything 1.5 ft low. Catch this before pouring concrete with a redundant benchmark check.
- **Wrong drawing version.** Designer revised the plans; surveyor staked the previous version. Mandatory: version-control the staking file with the same revision number as the plans.
- **CSF not applied.** Grid coordinates staked as ground; long lines drift by inches. Verify at the longest baseline before staking begins.
- **Stake disturbance.** Contractor pulled or buried the stake. Re-set and document.
- **Offset confusion.** Stake labeled "5 ft offset" set 5 ft on the wrong side. Stake the offset on a consistent side (project standard); label every stake unambiguously.

## Self-assessment

<details>
<summary>Question 1</summary>

A site has 4 primary control points. Two of them disagree with each other by 0.06 ft horizontal when checked from a third point. The fourth point appears consistent. What is the correct response?

**Answer:** Investigate before staking. Determine which point is in error - possibly the third point used for the check, possibly one of the two. Do not stake from inconsistent control; the inconsistency is a sign of a systematic problem (disturbed monument, wrong antenna height, wrong scale factor).
</details>

<details>
<summary>Question 2</summary>

What is the typical staking accuracy target for a curb that must be within 0.05 ft of design?

**Answer:** Roughly 0.02 ft (one-third of the construction tolerance), allowing the remaining margin for contractor placement and field conditions.
</details>

<details>
<summary>Question 3</summary>

The Civil 3D drawing was prepared in NAD83 State Plane grid coordinates without a CSF transform applied. The Combined Scale Factor at the site is 0.99993. A 1,000-ft tangent staked from grid coordinates without correction will be off by how much on the ground?

**Answer:** Approximately 0.07 ft over 1,000 ft (the difference between grid and ground at that CSF). Apply the CSF or set the drawing transform before staking.
</details>

<details>
<summary>Question 4</summary>

What does the surveyor sign on an as-built drawing?

**Answer:** The surveyor certifies that the as-built conditions shown reflect the surveyor's measurements of the constructed work, not that the constructed work matches the design. If the design and the measurements disagree, the drawing shows the measured condition.
</details>

## Cited sources

1. INDOT Survey Manual (construction staking sections).
2. ACSM/NSPS *Positional Accuracy Standards for Land Surveys*.
3. ASCE 38, *Standard Guideline for the Collection and Depiction of Existing Subsurface Utility Data*.
4. 2010 ADA Standards for Accessible Design (slope tolerances).

## Time log

Estimated 50 minutes of focused study plus 10 minutes of self-assessment. Total: 1.0 PDH.
