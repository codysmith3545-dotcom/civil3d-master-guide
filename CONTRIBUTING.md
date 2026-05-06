# Contributing

## Page conventions

Every page lives under `content/` as a markdown file with frontmatter and a mandatory TL;DR block.

```yaml
---
title: "Vertical Curve Design"
section: "engineering/roadway-design"
order: 30
visibility: public                # or "invite"
tags: [vertical-curve, profile, aashto, k-value]
appliesTo: [civil3d-2022, civil3d-2024, civil3d-2025]
relatedCommands: [CreateProfile, EditProfileGeometry]
relatedCalculators: [vertical-curve]
jurisdictionRefs: [indiana/state/indot]
updated: 2026-05-06
sources:
  - title: AASHTO GBOG 7th ed., §3.4
    url: https://...
    verified: 2026-05-06
---

> **TL;DR**
> 1. K = L / A. Pick K from AASHTO Table 3-34 by design speed.
> 2. Sag vs crest controls vary — sag is usually headlight, crest is sight distance.
> 3. In Civil 3D, set design check sets on the profile (`EditProfileDesignChecks`).
```

### Frontmatter fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | What appears in nav and tab title |
| `section` | yes | Folder path, e.g. `civil3d/surfaces` |
| `order` | yes | Sort order within its folder (10, 20, 30…) |
| `visibility` | yes | `public` (default) or `invite` |
| `tags` | recommended | Lowercase, hyphenated |
| `appliesTo` | recommended | Civil 3D versions; use `civil3d-YYYY` |
| `relatedCommands` | optional | Civil 3D command names |
| `relatedCalculators` | optional | Calculator slugs in `web/lib/calculators/` |
| `jurisdictionRefs` | optional | e.g. `indiana/hamilton-county/carmel` |
| `updated` | yes | ISO date |
| `sources` | recommended | Each with `title`, `url`, `verified` date |

### Body conventions

- **Start with TL;DR.** A blockquote with 1–5 numbered bullets that answers the question for a reader who only reads the top. Mandatory.
- **Teach the why, not just the what.** Identifiers explain themselves; explain hidden constraints, gotchas, and the reasoning behind defaults.
- **Cite sources.** When you state a numeric standard or a regulatory requirement, link to it.
- **Versioning.** If a behavior changed in a Civil 3D release, note which release.
- **No emoji.** Keep it professional; a few people will print these.

## Folder ownership

```
content/civil3d/        Civil 3D objects, workflows, commands
content/field-and-boundary/  Survey practice in the real world
content/engineering/    Civil engineering reference material
content/standards/      Industry standards (curated summaries + links)
content/customization/  LISP, .NET, Dynamo, templates
content/jurisdictions/  Indiana state, counties, municipalities
content/resources/      Curated outside-world reading list
content/docs-mirror/    Verbatim mirrors of public-domain materials
```

## License buckets (where verbatim copies go)

When you bring in external content, decide which bucket it belongs in:

- **Bucket 1 — Public domain.** Government edicts (statutes, ordinances), federal works, government-authored design manuals. Mirror verbatim under `content/docs-mirror/` with a `source.url` and `source.verifiedOn` in frontmatter.
- **Bucket 2 — Licensed.** Autodesk help, AASHTO, ALTA, paid manuals. **Do not commit to this repo.** Goes in the private companion repo / R2 bucket only, gated behind login.
- **Bucket 3 — Citation only.** No license, no public-domain status. Link and summarize in our words.

When in doubt, ask — better to defer than to publish something you shouldn't.

## Workflow

### Adding a new page

```bash
node scripts/new-page.mjs civil3d/surfaces/surface-from-points
```

This scaffolds the file with valid frontmatter and a TL;DR block.

### Editing an existing page

Open the file, edit, bump `updated:` to today.

### Submitting

1. Branch off `main`: `git checkout -b yourname/short-topic`
2. Commit with a clear message.
3. Open a PR. CI runs lint + link check.
4. After review, merge.

## Local dev

```bash
pnpm install
pnpm -F web dev    # runs the Next.js site at localhost:3000
pnpm -F mcp-server dev   # runs the MCP server in stdio mode
pnpm build:llms    # regenerates llms.txt + llms-full.txt
pnpm verify:links  # checks jurisdiction links
```

## Style

- Prose is plain English; no marketing voice.
- Acronyms are spelled out on first use per page (`Triangulated Irregular Network (TIN)`).
- Code/commands in backticks. Civil 3D commands match Autodesk's casing (e.g. `CreateAlignmentEntities`).
- Numeric standards always include units.

## Releases

Publishing the SDK and MCP server to npm is automated by `.github/workflows/release.yml`.

1. Bump versions in `packages/sdk/package.json` and `mcp-server/package.json`.
2. Commit and push to `main`.
3. Tag with a SemVer tag matching `v*.*.*` and push the tag:

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

The workflow will:

- install, build, and run tests
- publish `@civil3d-master-guide/sdk` to npm with provenance
- publish `@civil3d-master-guide/mcp` (the MCP server) to npm with provenance
- create a GitHub release with auto-generated notes

### Required secrets

Set these in **Settings -> Secrets and variables -> Actions**:

- `NPM_TOKEN`: an npm automation token with publish rights to the
  `@civil3d-master-guide` scope. The workflow consumes it as `NODE_AUTH_TOKEN`.

`GITHUB_TOKEN` is provided automatically by Actions; no manual setup needed.

## Analytics

The web app emits privacy-respecting events (page views, searches, calculator
usage, chat messages) via `web/lib/analytics.ts`. Events carry only an
anonymous per-session UUID and event-specific properties; no IP, no user
agent, no user identifier. Events are appended to NDJSON on disk
(default `web/.analytics/events.ndjson`, override with `ANALYTICS_LOG_PATH`)
and optionally mirrored to Supabase if `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are set.

The content-gap endpoint (`GET /api/analytics/gaps`) returns the top 20
zero-result search queries from the last 30 days. It is gated by
`Authorization: Bearer <ANALYTICS_GAPS_TOKEN>`; if the env var is unset
the endpoint returns 503.
