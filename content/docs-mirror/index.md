---
title: "Docs Mirror"
section: "docs-mirror"
order: 70
visibility: public
tags: [docs-mirror, public-domain, government]
updated: 2026-05-06
---

> **TL;DR**
> 1. Verbatim mirrors of **public-domain** material (government edicts: ordinances, statutes, government-authored design manuals).
> 2. Each mirror page records the **source URL** and **fetch date**, and links back to the official copy.
> 3. **Copyrighted** material (Autodesk, AASHTO, ALTA) is **not** here — those mirrors live in the private companion store, behind login.

## What's mirrored

- **Indiana state authorities**: INDOT Indiana Design Manual (selected chapters), IDEM Rule 5/Rule 13 guidance, Indiana 811 statutes.
- **Counties** (Marion + 7 surrounding): adopted design-standards manuals, drainage ordinances, subdivision control ordinances.
- **Municipalities**: code-of-ordinances excerpts directly relevant to civil/survey work (zoning, subdivision, stormwater, ROW, sidewalk).
- **Federal**: relevant FHWA/USACE/FEMA/USGS materials.

## Index

This index is generated from frontmatter at build time. Browse by jurisdiction:

- [Indiana state mirrors](indiana-state/)
- [County and municipal mirrors](indiana-local/)
- [Federal](federal/)

## Why we mirror

Government websites change. Bookmarks rot. Plan reviewers reference *the version in effect at submittal*. A dated, citable mirror lets you cite an effective version with confidence and search across many ordinances at once.

## Frontmatter convention for mirrors

```yaml
---
title: "Title of the original document"
section: "docs-mirror/<jurisdiction>"
license: "public-domain-government-edict"
source:
  authority: "City of Carmel, Indiana"
  url: "https://www.carmel.in.gov/..."
  retrievedOn: 2026-05-06
  effectiveAs: "Ordinance D-XXXX-XX, adopted 2025-03-04"
disclaimers:
  - "This is a verbatim mirror; refer to the official source for the legally controlling copy."
updated: 2026-05-06
---
```

## Related

- [Indiana jurisdictions](../jurisdictions/indiana/index.md)
- [Legal posture (project README)](../../README.md#legal-posture)
