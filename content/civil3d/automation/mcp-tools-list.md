---
title: "MCP Tools List"
section: "civil3d/automation"
order: 10
visibility: public
tags: [mcp, automation, agent, tools, knowledge-base]
updated: 2026-05-11
sources:
  - title: "Model Context Protocol specification"
    url: https://modelcontextprotocol.io
    verified: 2026-05-11
---

> **TL;DR**
> 1. The Civil 3D Master Guide ships an MCP server that exposes the knowledge base and a small set of calculators to MCP-aware clients (Claude Desktop, Claude Code, Cursor).
> 2. Each tool listed below takes a JSON object as input and returns a JSON object as output.
> 3. To add the server to a client, point it at the `civil3d-master-guide-mcp` binary published from `mcp-server/`.

## Knowledge-base tools

- `get_page` -- Fetch a single markdown page by slug. Returns title, section, frontmatter, raw body, and source citations.
- `search_kb` -- Full-text search the knowledge base. Returns the top N matches with slug, title, score, and excerpt.
- `list_commands` -- List Civil 3D commands from `content/civil3d/commands/`. Optional `category` filter.
- `list_jurisdictions` -- List jurisdictional pages under `content/jurisdictions/`. Optional `state` filter.
- `get_resource_index` -- Return the curated outside-resource index parsed from `content/resources/`.

## Engineering and survey calculators

- `run_calculator` -- Run a built-in calculator by name. Available names:
  - `vertical_curve`
  - `horizontal_curve`
  - `rational_method`
  - `mannings_open_channel`
  - `state_plane_indiana_csf`
  - `traverse_closure`
  - `metes_and_bounds`
  - `inverse`
  - `bearing_bearing_intersection`
  - `bearing_distance_intersection`
  - `distance_distance_intersection`
  - `level_loop_adjustment`
  - `area_by_coordinates`
  - `curve_stakeout`
  - `trig_leveling`
  - `solar_observation`
  - `grid_to_ground`

## Deed-decoder tool

- `decode_deed` -- Parse a metes-and-bounds deed description into structured courses, optionally plotted. Input is `{ text: string }`; output is a parsed traverse, an optional plotted traverse (vertices, perimeter, closure, area), and a summary block. See the [Deed Decoder Guide](../../field-and-boundary/legal-descriptions/deed-decoder-guide.md) for the supported phrasings, the closure-precision reading, and the known limitations.

## Related

- [Customization overview](../../customization/index.md)
- [Resources: tools and software](../../resources/tools-and-software.md)
