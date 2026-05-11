# Cloning This Framework for a New Domain

This repository is designed as a reusable knowledge-base framework. The infrastructure (Next.js web app, MCP server, shared packages, search, markdown pipeline) is domain-agnostic. Only the content under `content/` and a handful of configuration files are specific to Civil 3D / land surveying.

Follow these steps to adapt the framework for a different business domain.

## Prerequisites

- Node.js 18+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- A Git host (GitHub recommended for CI/CD templates)

## Steps

### 1. Fork or clone the repository

```bash
git clone https://github.com/<your-org>/civil3d-master-guide.git my-domain-guide
cd my-domain-guide
```

### 2. Replace `content/`

Delete all markdown files under `content/`. Replace them with your own domain content. Preserve the directory convention:

```
content/
  00-index.md              # Landing page (required)
  <topic-area>/            # Top-level sections (e.g. "procedures/", "reference/")
    index.md               # Section overview
    <subtopic>.md           # Individual pages
  glossary.md              # Term definitions
  resources/               # Curated external links
```

Every page must have YAML frontmatter. See `CONTRIBUTING.md` for the full spec. At minimum:

```yaml
---
title: Page Title
section: topic-area
tags: [lowercase-hyphenated]
---
```

### 3. Update `config.yaml`

Change `site.title`, `site.description`, and any domain-specific settings to match your domain.

### 4. Customize `prompts/system.md`

Replace Civil 3D and surveying references with your domain's context. This prompt is used by the MCP server and the chat API route to ground AI responses in your content.

### 5. Update `CLAUDE.md`

Rewrite `CLAUDE.md` to describe your domain, directory layout, and rules for AI assistants working in your repo.

### 6. Add domain-specific calculators (optional)

The framework includes a calculator system for pure-function computations:

1. Add a calculator in `packages/sdk/src/calculators/` (copy an existing one as a template).
2. Register it in `packages/sdk/src/calculators/index.ts`.
3. Mirror the MCP tool in `mcp-server/src/calculators/`.
4. Add a UI page at `web/app/tools/<calculator-name>/page.tsx`.

### 7. Update jurisdictions (if applicable)

If your domain has geographic/jurisdictional variations:

1. Replace `content/jurisdictions/indiana/` with your own geography.
2. Follow the pattern: `content/jurisdictions/<state>/<county>/` with municipality subdirectories as needed.

If jurisdictions do not apply to your domain, delete the `content/jurisdictions/` directory entirely and remove jurisdiction-related tools from `mcp-server/src/server.ts`.

### 8. Configure environment

```bash
cp .env.example .env.local
```

Fill in API keys (e.g. `ANTHROPIC_API_KEY` for the chat feature). Review `.env.example` for all available settings.

### 9. Install dependencies and build

```bash
pnpm install
pnpm run build:all
```

Or build individual workspaces:

```bash
pnpm --filter @civil3d-master-guide/content build
pnpm --filter @civil3d-master-guide/search build
pnpm --filter @civil3d-master-guide/sdk build
pnpm --filter @civil3d-master-guide/mcp build
pnpm --filter web build
```

### 10. Verify

```bash
pnpm test           # Run tests (if configured)
pnpm run lint:all   # Lint all workspaces
```

Start the dev server to check that pages render:

```bash
pnpm --filter web dev
```

### 11. Rename packages (optional but recommended)

Search-and-replace `civil3d-master-guide` with your project name across:

- `package.json` (root, `web/`, `mcp-server/`, `packages/*/`)
- `pnpm-workspace.yaml`
- `CLAUDE.md`

### 12. Deploy

- **Web app**: Deploy to Vercel, Netlify, or any Node.js host. `pnpm --filter web build && pnpm --filter web start`.
- **MCP server**: Publish to npm from `mcp-server/` or run directly with `npx`.

## Architecture overview

```
packages/content/    Shared content loader (Frontmatter types, loadAllPages, getPage)
packages/search/     Shared search scorer (tokenize, searchPages, buildExcerpt)
packages/sdk/        Domain calculators (pure functions, no I/O)
mcp-server/          MCP server (tools for AI assistants)
web/                 Next.js web app (docs site, chat, calculator UIs)
content/             Markdown knowledge base (the actual domain content)
```

The shared packages (`packages/*`) are consumed by both `mcp-server/` and `web/` via pnpm workspace dependencies, so code is written once and used everywhere.
