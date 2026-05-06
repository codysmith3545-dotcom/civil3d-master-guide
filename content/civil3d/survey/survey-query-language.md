---
title: "Survey Query Language"
section: "civil3d/survey"
order: 80
visibility: public
tags: [survey, query, filter, point-groups, export]
appliesTo: [civil3d-2024, civil3d-2025]
relatedCommands: [SHOWSURVEYTAB, CREATEPOINTGROUP]
updated: 2026-05-06
---

> **TL;DR**
> 1. Civil 3D's survey query filters points and figures in the survey database by attribute — description, elevation range, point number range, date, or figure name. Queries work in the Survey tab, point group definitions, and export operations.
> 2. Point groups use a query-like Include/Exclude mechanism (matching on raw description, point number range, elevation range, point name, and more) to dynamically select members from the drawing's point collection.
> 3. Combine wildcards (`*`, `?`, `#`) with comma-separated lists and ranges to build precise filters without manual point selection.

## Survey tab queries

In the Survey tab tree, right-click a node (e.g. Non-control Points, Figures) and choose Query to filter what is displayed or exported.

### Filter criteria for points

| Criterion | Syntax / Example | Notes |
|---|---|---|
| Point number range | `1-100`, `1-50,200-300` | Comma-separated ranges |
| Description match | `EP*`, `MH*,CB*` | AutoCAD wildcards: `*` any, `?` single char, `#` single digit |
| Elevation range | `Min: 700.00, Max: 800.00` | Filters by the point's Z value |
| Date range | Start/end date | Filters by the observation date recorded in the database |

### Filter criteria for figures

| Criterion | Syntax / Example | Notes |
|---|---|---|
| Figure name | `EP*`, `BC*` | Wildcard match on the figure name |
| Layer | `C-TOPO-*` | Figures assigned to matching layers by the prefix database |

Queries are not saved persistently in the database tree. For a reusable filter, define a point group in the drawing (see below).

## Point group query mechanism

Point groups are the primary way Civil 3D users filter and organize COGO and survey points in the drawing. A point group's Include tab functions as a query builder with these tabs:

### Include tab filters

- **Point Numbers**: comma-separated numbers and ranges (`1-50,100,200-300`).
- **Raw Description Matching**: wildcards against the raw (field) description. Example: `EP*,BC*,TC*` includes all edge-of-pavement, back-of-curb, and top-of-curb points.
- **Full Description Matching**: wildcards against the processed full description (after description-key expansion).
- **Point Names**: match on the point name property (rarely used outside utility data).
- **Point Groups**: include all members of another group (nesting).
- **Surface**: include all points that are members of a named surface.
- **Elevations**: minimum/maximum elevation filter.

### Exclude tab

The Exclude tab has the same filters. Exclusions are applied after inclusions: the group includes everything matching the Include criteria, then removes anything matching the Exclude criteria.

### Query Builder tab

For complex logic that the Include/Exclude tabs cannot express, the Query Builder tab allows a free-form Boolean expression:

```
(RawDescription = 'EP*' OR RawDescription = 'BC*') AND Elevation >= 700.00
```

Operators: `=`, `!=`, `<`, `>`, `<=`, `>=`, `AND`, `OR`, `NOT`. String comparisons use AutoCAD wildcards. The query builder is available in Civil 3D 2022 and later.

## Wildcards reference

These wildcards apply in all description-matching and query contexts within Civil 3D (point groups, description keys, survey queries):

| Wildcard | Meaning | Example |
|---|---|---|
| `*` | Any sequence of characters | `EP*` matches `EP`, `EP1`, `EPTOP` |
| `?` | Any single character | `EP?` matches `EP1`, `EPA`, not `EP12` |
| `#` | Any single digit | `EP#` matches `EP1` through `EP9` |
| `@` | Any single alpha character | `EP@` matches `EPA`, `EPB` |
| `.` | Any single non-alphanumeric | `EP.1` matches `EP-1`, `EP.1` |
| `[abc]` | Any one of the listed characters | `EP[123]` matches `EP1`, `EP2`, `EP3` |
| `[~abc]` | Any character not listed | `EP[~123]` matches `EP4`, `EPA`, not `EP1` |
| `~` | Negate the entire pattern | `~EP*` matches anything not starting with `EP` |

## Practical examples

### Topo-only point group

Include raw description: `EP*,BC*,TC*,FL*,GND*,TREE*,BUSH*,FH*,MH*,CB*,TP*`

This captures common topographic codes while excluding control (`CP*`) and construction (`STK*`) points.

### Boundary-only point group

Include raw description: `IP*,MON*,REBAR*,NAIL*,CAP*,PROP*,ROW*`

Limits the group to property corners and right-of-way markers.

### Points within an elevation band

Query Builder: `Elevation >= 780.00 AND Elevation <= 800.00`

Useful for isolating a bench or terrace when building a surface.

### Exclude test shots

Include: `*` (all points). Exclude raw description: `TEST*,DEL*,BAD*`

Assumes the crew prefixed deletable shots with `TEST`, `DEL`, or `BAD`.

## Using queries for export

When exporting points (`POINTSEXPORT` or right-click a point group > Export), the point group's query determines which points write to the file. Define a staking group, for example, that includes only design points, and export it as a staking file for the data collector.

Similarly, the Reports Manager respects point group selection. A point report run on the "Boundary" group outputs only boundary points.

## Common gotchas

- **Wildcard order in description keys vs point groups.** Description keys match first-found; point groups include all matches. A point matching two groups gets its style from the higher-priority group.
- **Full vs raw description.** A raw description of `MH-S 48` becomes full description `Sanitary Manhole 48"` after description-key processing. Querying on `MH*` requires the Raw Description field; querying on `Sanitary*` requires Full Description.
- **Case sensitivity.** Wildcard matching in Civil 3D is case-insensitive. `ep*` matches `EP1`.
- **Dynamic membership.** Point groups are live queries. Adding a point with description `EP99` automatically includes it in any group matching `EP*`. This is a feature, not a bug, but surprises users who expect static membership.
- **Query Builder syntax errors.** Mismatched parentheses or missing quotes around wildcard strings cause the query to fail silently (returning zero points). Test incrementally.

## Related

- [Point groups](../points/point-groups.md)
- [Description keys](../points/description-keys.md)
- [Survey database](survey-database.md)
- [Point reports](../points/point-reports.md)
