# tests/e2e — end-to-end smoke harness

A self-contained harness that runs the full stack and asserts nothing is on
fire. It uses **only Node built-ins** (no Playwright, no Jest, no axios) so
that it can run in any CI worker with `pnpm` and `node >= 20`.

## TL;DR

```sh
# from repo root
node tests/e2e/run-e2e.mjs            # full run: install, build, start, suite, teardown
node tests/e2e/run-e2e.mjs --dry-run  # print the plan, do nothing
node tests/e2e/run-e2e.mjs --skip-install --skip-build  # iterate quickly
node tests/e2e/run-e2e.mjs --only mcp,calculators        # subset
```

Exit code:

- `0` — every suite passed
- `1` — at least one suite failed
- `2` — harness itself errored (install/build/server didn't start)

## What it covers

| Suite          | Needs server | What it asserts |
|----------------|--------------|------------------|
| `calculators`  | no           | Imports the compiled calculator pure functions from `mcp-server/dist/calculators/` and exercises each with golden inputs. Catches silent NaN/throw regressions. |
| `mcp`          | no           | Spawns `mcp-server/dist/index.js` over stdio, completes the MCP `initialize` handshake, calls `tools/list` (must return >=7 tools), then calls every tool with safe synthetic input and asserts `isError !== true`. |
| `api`          | yes          | HTTP probes the running web server: `/api/health`, `/`, `/docs`, `/tools`, plus a few docs sub-routes. Must not 5xx. Optional `POST /api/v1/calculators/traverse-closure` is treated as feature-gated (404 is acceptable). |
| `content`      | yes          | Walks `content/**/*.md`, takes the first 20 pages, GETs `/docs/<slug>`. Asserts no 5xx; for 200 responses asserts the rendered HTML contains a stable slice of the page's TL;DR. |
| `builds`       | no           | `pnpm -r --if-present build` must exit 0. Belt-and-suspenders against a workspace whose build silently rotted. |

## How `run-e2e.mjs` orchestrates

1. (Unless `--skip-install`) `pnpm install --frozen-lockfile=false`.
2. (Unless `--skip-build`) `pnpm -F web build`, then `pnpm -F mcp-server build`.
3. If any selected suite needs the server, start `pnpm -F web start -- -p 3001`
   in the background and poll `http://127.0.0.1:3001/api/health` (60 s budget).
4. Run each suite as a dynamic import; each exports `run(ctx)` and returns
   `{ passed, failed, skipped, failures }`. The harness imposes a per-suite
   timeout (default 300 s; override with `--timeout`).
5. Print a summary table via `console.table`.
6. SIGTERM the web child; flush; exit.

The harness installs `SIGINT` / `SIGTERM` handlers so it tears down the web
process even on Ctrl-C.

## Fixtures

`fixtures/` holds small, public-domain or synthetic inputs used by suites that
need a file argument:

- `deed-sample.txt` — synthetic metes-and-bounds description (5-acre square)
- `plat-sample.pdf` — empty placeholder (some tools accept a buffer, this is
  enough to exercise the codepath)
- `project-context-sample.json` — a project-context blob shaped like the
  expected schema

## Troubleshooting

**`web server did not become healthy in 60000ms`**

The web build succeeded but the server didn't bind to 3001 fast enough. Most
common causes:

- The 3001 port is already in use. `lsof -i:3001` and kill the squatter, or
  pass `--port 3010`.
- The build's `next start` is failing because `.next` is missing — re-run
  without `--skip-build`.
- `web/lib/content.ts` couldn't resolve `CONTENT_ROOT`. Confirm `content/`
  exists at the repo root.

**`mcp` suite fails with `entry not built`**

You ran with `--skip-build` against a clean tree. `pnpm -F mcp-server build`
once, then re-run.

**`calculators` suite skipped**

Same root cause as above — the compiled `dist/calculators/index.js` is missing.

**One docs page 5xxs in `content`**

Open it locally with `pnpm -F web dev` and view it at `/docs/<slug>`. Almost
always a remark/rehype plugin tripping on an exotic markdown construct in a
specific file.

**`builds` suite hangs**

A workspace `build` script is interactive (e.g. waiting for tty input). We
pass `CI=1` and a 5-minute hard timeout but a misconfigured script can still
stall its own subprocess. Run `pnpm -r --if-present build` manually to see
where it gets stuck.

## Adding a new suite

1. Create `tests/e2e/suites/<name>.test.mjs` that exports `async function run(ctx)`.
2. Use `createRunner(name)` from `./_lib.mjs` to track pass/fail.
3. Return `runner.finish()` at the end.
4. Add an entry to the `SUITES` array in `run-e2e.mjs` with `needsServer: true|false`.

`ctx` provides `{ repoRoot, port, baseUrl, httpGet, sleep, log }`.

## CI integration

`.github/workflows/ci.yml` has an `e2e` job that runs after lint + build. It
invokes `node tests/e2e/run-e2e.mjs --timeout 600` and fails the build on any
non-zero exit.
