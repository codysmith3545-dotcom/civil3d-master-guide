# Security review — Phase 4

This document tracks security findings against the Phase-4 surface of the
Civil 3D Master Guide (web app, MCP server, content pipeline) and the fixes
applied by Quality-SecurityFixes.

The findings catalogued below correspond to the SEV-* identifiers used by
Quality-SecurityReview. If Quality-SecurityReview's full write-up lands in
this directory later, this file should be merged into it; the
`## Fixes applied` section remains authoritative for what shipped on this
worktree.

## Findings in scope

| ID        | Severity | Title                                             |
| --------- | -------- | ------------------------------------------------- |
| SEV-H-1   | High     | Path traversal in `/api/raw/[...slug]`            |
| SEV-M-1   | Medium   | MCP `getPage` path-safety parity                  |
| SEV-M-2   | Medium   | `/api/chat` has no rate limit, body cap, or Zod   |
| SEV-M-3   | Medium   | Prompt-injection via retrieved excerpts / msgs    |
| SEV-M-4   | Medium   | `INVITE_SECRET` placeholder accepted silently     |
| SEV-M-5   | Medium   | Markdown pipeline emits unsanitized raw HTML      |

## Fixes applied

Branch: `worktree-agent-a6abb8991628bb543`.

### SEV-H-1 — Path traversal in `/api/raw/[...slug]`
- New helper `web/lib/path-safety.ts` exports `safeResolveContentPath()` and
  `PathTraversalError`. It rejects empty slugs, segments containing `..`,
  `/`, `\`, NUL, or URL-encoded equivalents (`%2f`, `%5c`, `%2e%2e`),
  segments starting with `.`, and any resolved path that does not have
  `contentRoot` as a separator-aware prefix.
- `web/lib/content.ts` → `getPageBySlug()` now routes through
  `safeResolveContentPath()` and returns `null` on traversal attempts.
- `web/app/api/raw/[...slug]/route.ts` adds an explicit
  `safeResolveContentPath()` guard as defence-in-depth so the route stays
  safe even if a future caller bypasses the helper.

### SEV-M-1 — MCP `getPage` path safety
- Mirrored helper at `mcp-server/src/path-safety.ts`. Identical reject
  rules to the web version (intentional duplication — MCP cannot import
  from `web/`).
- `mcp-server/src/content.ts` → `getPage()` now validates the slug with
  `safeResolveContentPath()` before any `fs.access` / `fs.readFile`.

### SEV-M-2 — `/api/chat` rate limit + body cap + Zod
- IP-keyed sliding-window limiter at `web/lib/rate-limit.ts`.
- `web/middleware.ts` (new) applies it to:
  - `/api/chat` — 30 req/min/IP
  - `/api/deed-decode` — 10 req/min/IP (AI vision)
  - `/api/raw/*` — 60 req/min/IP
  - `/api/projects/*` — 60 req/min/IP
  Includes `Retry-After`, `X-RateLimit-*` headers on responses.
- `web/app/api/chat/route.ts`:
  - Zod schema `ChatBodySchema` validates `{ messages: ChatMessage[], apiKey? }`. Rejects with 400 on schema failure with a concise issue summary.
  - `readBoundedJson()` enforces a 256 KB body cap, returning 413 on overflow. Checks `Content-Length` first then re-checks the materialized buffer.

### SEV-M-3 — Prompt-injection delimiters
- `/api/chat/route.ts` now wraps every retrieved KB chunk in
  `<retrieved_excerpt source="..." index="..." title="...">…</retrieved_excerpt>`.
- User messages are wrapped in `<user_message>…</user_message>`.
- Both are passed through `escapeForTaggedContent()` which HTML-escapes
  `<` and `>` so the model cannot be tricked into seeing a closing tag
  inside attacker-controlled content.
- System prompt has an explicit "Security & trust boundary" clause
  instructing the model to treat content inside those tags as data, not
  instructions, and to surface obvious injection attempts in its reply.

### SEV-M-4 — `INVITE_SECRET` placeholder check
- `web/lib/invites.ts` validates `INVITE_SECRET` on module init when the
  variable is set: rejects a known list of placeholder values
  (`change-me-to-a-random-secret-min-16-chars`, `change-me`, `secret`,
  etc.) and enforces a 16-char minimum length. Throws at startup rather
  than per-request so a misconfigured deployment never serves a single
  invite token signed with a placeholder.

### SEV-M-5 — Markdown sanitization
- `web/lib/content.ts` adds `rehype-sanitize` after `rehype-pretty-code`
  and before `rehype-stringify`. Schema starts from `defaultSchema` and
  allow-lists the `className`/`data-*` attributes that `rehype-pretty-code`
  emits, so syntax highlighting still works but `<script>`, `<iframe>`,
  `on*` handlers, and `javascript:` URLs are dropped. The `rehype-stringify`
  call no longer passes `allowDangerousHtml` (sanitize already produced a
  clean tree).

## Tests added

| File | Count | Covers |
| ---- | ----- | ------ |
| `web/__tests__/path-safety.test.ts` | 14 | `..`, `..%2f`, NUL, dotfiles, embedded separators, empty slug, sibling-prefix bypass |
| `web/__tests__/chat-route-validation.test.ts` | 10 | Zod schema, body-size guard, tag-escape helper |
| `web/__tests__/middleware-rate-limit.test.ts` | 7 | Limit/refill/independence of buckets and IPs, `clientIp` resolution |
| `web/__tests__/markdown-sanitize.test.ts` | 5 | `<script>`, `on*` handlers, `javascript:` URLs, `<iframe>`, code-block preservation |
| `mcp-server/tests/content-path-safety.test.ts` | 10 | Same suite + integration test that `getPage` refuses `..`, `..%2f`, absolute paths, and reads only files under `content/` |

Total: 46 new tests, all green.

## Build verification

- `pnpm install` — clean.
- `pnpm --filter "@civil3d-master-guide/mcp" build` — passes.
- `pnpm --filter "@civil3d-master-guide/mcp" test` — 10/10 passing.
- `pnpm --filter web build` — passes (Next.js production build with
  middleware compiled at 27 kB).
- `pnpm --filter web test` — 36/36 passing.

## Out of scope (deliberately untouched)

- `web/app/projects/**`, `web/app/api/projects/**`,
  `web/lib/project-context.ts`, `web/lib/chat-with-project.ts`
  (5B-Workspace / 5B-Upload / 5B-RAG).
- `supabase/**` (5B-Schema).
- `mcp-server/src/server.ts`, `mcp-server/src/schemas.ts` (5A-MCP).
- `web/lib/config.ts` (touched by 4B-3 and 5B-Schema; not present on this
  worktree).
