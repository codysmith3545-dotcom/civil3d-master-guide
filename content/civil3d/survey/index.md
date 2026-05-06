---
title: "Survey in Civil 3D"
section: "civil3d/survey"
order: 20
visibility: public
tags: [survey, fbk, figures, linework, network-adjustment]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D's survey workflow centers on the **Survey Database** (an external SQLite-style store) and **Figure Prefix Database** (defines what each figure code represents).
> 2. Field data flows in as `.fbk` (field book) or raw observation files; the database adjusts and produces points + figures.
> 3. **Description keys** turn point descriptions into the right symbols/layers; **figure prefixes** turn linework codes into figures (which can become breaklines).

## Pages

- [Survey database](survey-database.md)
- [Field book (.fbk) format](field-book-format.md)
- [Importing raw observations](importing-raw-observations.md)
- [Figures and figure prefix databases](figures-and-figure-prefixes.md)
- [Linework code sets](linework-code-sets.md)
- [Equipment databases](equipment-databases.md)
- [Network adjustment (least squares)](network-adjustment.md)
- [Survey points vs COGO points](survey-points-vs-cogo-points.md)
- [Editing survey data](editing-survey-data.md)
- [Survey query language](survey-query-language.md)

## Related

- [Points](../points/index.md) (description keys, point groups)
- [Coordinate systems](../../field-and-boundary/coordinate-systems/index.md)
- [Topographic surveys](../../field-and-boundary/topographic-surveys/index.md)
