# Fork this framework

The Civil 3D Master Guide is built as a reusable framework. You can fork it
into a new domain (ArcGIS Pro Master Guide, Revit Master Guide, OpenRoads
Master Guide, etc.) with the scaffolder CLI.

## Quick start

```bash
npx create-knowledge-base@latest my-domain-guide
cd my-domain-guide
pnpm dev
```

The scaffolder will prompt you for:

- Brand name + primary/accent hex colors
- Knowledge scope (one sentence)
- Primary jurisdiction (country/region)
- Calculators to include (multi-select from the existing 17, or none)
- AI model preference (Claude Opus / Sonnet / Haiku)
- Auth mode (none / open / invite-only)
- License (MIT / Apache-2.0 / CC-BY-4.0)

It will write `config.yaml`, `prompts/system.md`, a `package.json` matching
your project name, then run `pnpm install` and `git init` + an initial commit.

## What you get

The scaffold mirrors the framework's directory structure:

```
my-domain-guide/
  content/           Markdown knowledge base (source of truth)
  web/               Next.js renderer (stub)
  mcp-server/        MCP server (stub)
  packages/          Workspace packages (SDK, calculators, etc.)
  scripts/           Build + lint utilities
  prompts/           AI system prompt template
  config.yaml        Brand, AI model, auth, calculators
  CLAUDE.md          AI-assistant guidance
  README.md          Project README
```

## Config-driven build

`config.yaml` is the single source of brand/AI/auth/calculator wiring.
`scripts/build-all.mjs` reads it and orchestrates the rest of the pipeline.

## Substituted variables

The scaffolder uses a small handlebars subset. See
`packages/create-kb/README.md` for the full variable list and template syntax.

## After scaffolding

1. Edit `config.yaml` to tune brand and AI model.
2. Replace stub `web/` and `mcp-server/` with real wiring (port from the
   reference Civil 3D Master Guide implementation).
3. Author content under `content/` — every page has YAML frontmatter and
   a TL;DR blockquote as the first body block.
4. Add or remove calculators in `config.yaml` to match your domain.

## Non-interactive use

```bash
npx create-knowledge-base my-domain-guide --non-interactive
```

Accepts defaults for every prompt. Useful in CI and tests.

Flags:
- `--non-interactive` — accept defaults for every prompt
- `--no-install` — skip `pnpm install`
- `--no-git` — skip `git init`
