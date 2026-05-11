---
title: "Public REST API"
section: "developers"
order: 1
visibility: public
tags: [developers, api, rest, integration]
updated: 2026-05-11
---

> **TL;DR**
> A read-only HTTP mirror of the MCP server's tools, mounted at `/api/v1/*`. Every endpoint returns JSON, supports CORS, and is rate-limited to 60 requests per minute per IP. An OpenAPI 3.1 spec is available at `/api/v1/openapi.json`.

## Conventions

- **Base URL.** `https://<deploy>/api/v1`
- **Auth.** Optional. Send `X-API-Key: <key>` to bypass the per-IP rate limit. The server compares against the comma-separated `PUBLIC_API_KEYS` environment variable.
- **CORS.** `Access-Control-Allow-Origin: *` on every response. OPTIONS preflights return 204.
- **Caching.** GET responses set `Cache-Control: public, max-age=300, stale-while-revalidate=3600`.
- **Errors.** Structured: `{ "error": { "code": "invalid_input" | "not_found" | "rate_limited" | "internal", "message": "…" } }`.

## Endpoints

### GET `/pages/{slug}`

Fetch a single markdown page. `{slug}` is the same path-style slug used in `/docs/<slug>` on the web app.

```bash
curl https://<host>/api/v1/pages/civil3d/commands/index
```

Returns: `{ slug, href, title, section, frontmatter, body }`.

### GET `/search?q=…&limit=10`

Full-text search. Token-overlap scoring with a frontmatter-tag boost. `limit` is between 1 and 50, default 10.

```bash
curl "https://<host>/api/v1/search?q=corridor&limit=5"
```

### GET `/commands?category=…`

List Civil 3D commands. Optional `category` filter (case-insensitive against frontmatter `category`).

### GET `/jurisdictions?state=…`

State -> county -> municipality tree. Optional `state` slug filter (e.g. `indiana`). The legacy flat list is preserved on the `flat` field for backward compatibility.

### GET `/jurisdictions/at?lat=…&lng=…`

Point-in-bounds lookup. Returns the most-specific match (municipality wins over county wins over state) plus its parent chain, based on `bounds: [minLng, minLat, maxLng, maxLat]` frontmatter on jurisdiction index pages.

### GET `/jurisdictions/rules?slug=…` or `?lat=…&lng=…`

Typed rules for a jurisdiction. Cascades upward (municipality -> county -> state). Returns `{ slug, rules, sources }` where `sources` notes which jurisdiction supplied each field.

Fields: `submittal_checklist`, `setbacks`, `stormwater_thresholds`, `recording_requirements`, `plat_requirements`. Anything still missing after cascade is returned as `null`.

### GET `/calculators`

List every calculator with its name, slug, title, description, invocation URL, and a JSON Schema describing the input.

```bash
curl https://<host>/api/v1/calculators
```

### GET `/calculators/{name}`

Describe a single calculator.

### POST `/calculators/{name}`

Run a calculator. POST a JSON body matching the calculator's input schema.

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"legs":[{"bearing_deg":0,"distance_ft":100},{"bearing_deg":90,"distance_ft":100},{"bearing_deg":180,"distance_ft":100},{"bearing_deg":270,"distance_ft":100}]}' \
  https://<host>/api/v1/calculators/traverse_closure
```

Returns: `{ name, result }`. The `result` shape is the underlying pure-function calculator's output (documented in each `/tools/<slug>` page).

### GET `/lisp`

List curated LISP routines (metadata only).

### GET `/lisp/{name}`

Fetch one routine's source and documentation.

### POST `/decode-deed`

Parse a metes-and-bounds deed description into structured courses, optionally plotted from (0, 0).

```bash
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Thence N 12° 34´ 56\" E, 123.45 feet; thence S 45° 00´ 00\" E, 100 feet."}' \
  https://<host>/api/v1/decode-deed
```

Curve calls (`thence along a curve…`) are flagged in `unresolved_curve_calls` and not solved.

### GET `/resources`

The curated outside-resource index as `{ books, youtube, blogs, forums, podcasts, training, tools }`.

### GET `/openapi.json`

Machine-readable OpenAPI 3.1 spec describing every endpoint. Useful for generating typed client SDKs.

## Rate limits

- 60 requests / minute / IP by default.
- Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` (seconds to window reset).
- Send `X-API-Key` to bypass.

## Stability

The `/api/v1/*` surface is versioned: breaking changes will ship under `/api/v2/*`. Field additions are allowed at any time, so clients should ignore unknown fields.
