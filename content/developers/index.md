---
title: "Developers"
section: "developers"
order: 0
visibility: public
tags: [developers, api, integrations]
updated: 2026-05-11
---

> **TL;DR**
> The Civil 3D Master Guide exposes its knowledge base through two integration surfaces. Pick the one that matches your tooling.

## Integration surfaces

- [Public REST API](public-api.md) — read-only HTTP endpoints under `/api/v1/*`. Designed for blog embeds, course pages, third-party AI agents, and anything that cannot speak the Model Context Protocol.
- MCP server — installs as a local CLI for Claude Desktop, Claude Code, Cursor, and other MCP-aware clients. See `mcp-server/README.md` at the repository root.

## Choosing between them

| You want to… | Use |
|---|---|
| Embed a calculator in a static site | Public REST API (POST `/api/v1/calculators/{name}`) |
| Let an LLM agent answer questions from the guide | MCP server (richer, streaming, tool-call protocol) |
| Build a chrome extension that linkifies command names | Public REST API (`/api/v1/commands`) |
| Run inside CI to validate that links in a PR resolve | Public REST API (`/api/v1/pages/...`) |

## Licensing

Content is CC-BY-SA-4.0. Calculator code is MIT. Attribute the source page when you reuse content; see [`LICENSE`](../../LICENSE) for the binding terms.
