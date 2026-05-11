# {{brand.name}}

> {{knowledge.scope}}

Scaffolded from the Civil 3D Master Guide framework via `create-knowledge-base`.

## Stack

- `content/` — markdown knowledge base (single source of truth)
- `web/` — Next.js renderer
- `mcp-server/` — MCP server exposing the content programmatically
- `packages/` — workspace packages (SDK, calculators, etc.)
- `scripts/` — build + lint utilities

## Quick start

```bash
pnpm install
pnpm dev
```

## Configuration

See [`config.yaml`](./config.yaml). Brand, AI model, auth mode, and calculator
selection live there.

## Authoring

Every page lives under `content/` and has YAML frontmatter
(title, section, tags, sources). The first body block should be a TL;DR blockquote.

## License

This project is released under the {{license}} license.
