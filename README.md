# Civil 3D Master Guide

A reference for everything useful to a land surveyor and civil engineer working in Autodesk Civil 3D — workflows, the full command catalog, jurisdictional design standards (Indiana focus), calculators, and curated resources. Built so it can be consumed equally well by you, your teammates, and any AI assistant (Claude, Claude Code, Cursor, Codex, ChatGPT).

## How to use it

- **Browse on GitHub** — every page is a markdown file under `content/`. Start at [content/00-index.md](content/00-index.md).
- **Browse on the web** — once deployed, the site renders the same content with search, a chat assistant, and interactive calculators.
- **Use it inside an AI tool** — see [AI assistant setup](#ai-assistant-setup) below.

## Repo layout

```
content/                   # Markdown source of truth
  civil3d/                 # Core Civil 3D workflows + command catalog
  field-and-boundary/      # Survey practice, boundary, ALTA, legal descriptions
  engineering/             # Stormwater, sanitary, water, roadway, ADA, earthwork
  standards/               # AASHTO/ALTA/state DOT/CAD layer standards
  customization/           # LISP, .NET, Dynamo, templates
  jurisdictions/indiana/   # State + 8 counties + their municipalities
  resources/               # Curated reading list
  docs-mirror/             # Verbatim public-domain mirrors (ordinances, INDOT IDM)
  glossary.md
web/                       # Next.js web app (deploys to Vercel)
mcp-server/                # Model Context Protocol server (npx-runnable)
scripts/                   # Build + maintenance scripts
```

## Coverage

- **Civil 3D core** — fundamentals, survey database, points, surfaces, alignments, profiles, corridors, pipe networks, grading, parcels, plan production, data shortcuts.
- **Civil 3D command catalog** — every command name, ribbon location, related commands, common symptoms that lead to it.
- **Field & boundary practice** — boundary/ALTA, topo, construction staking, as-builts, legal descriptions, monuments, easements/ROW, coordinate systems.
- **Civil engineering** — stormwater, sanitary sewer, water, roadway design (AASHTO), ADA, earthwork, erosion control, hydraulics.
- **Standards** — AASHTO, ALTA/NSPS, state DOT, CAD layer standards (NCS), plotting/CTB.
- **Customization** — LISP, .NET API, Dynamo for Civil 3D, DWT templates, country kits.
- **Indiana jurisdictions** — Marion + Hamilton, Hancock, Shelby, Johnson, Morgan, Hendricks, Boone counties + every incorporated municipality.

## AI assistant setup

This guide is designed to be ingested by AI tools.

**Claude Code / Cursor / Codex (repo-aware):**
1. `git clone https://github.com/codysmith3545-dotcom/civil3d-master-guide.git`
2. The `CLAUDE.md` at the root tells the assistant how the content is organized. Cursor users can symlink `CLAUDE.md` to `.cursorrules`.

**Claude Project / ChatGPT Custom GPT:**
1. Once the site is deployed, upload `llms-full.txt` from the site root as a knowledge file.
2. Or paste the URL to `llms.txt` and let the assistant fetch what it needs.

**Any MCP-aware client (Claude Desktop, Claude Code):**
- `npx -y @civil3d-master-guide/mcp` (after the `mcp-server/` package is published) exposes tools `get_page`, `search_kb`, `list_commands`, `run_calculator`, `jurisdiction_at`.

## Page conventions

Every content page starts with frontmatter (see [CONTRIBUTING.md](CONTRIBUTING.md)) and a TL;DR block. Body teaches the *why*; the TL;DR answers the question fast.

## Legal posture

- **Public-domain content** (municipal ordinances, state/federal government manuals) is mirrored verbatim with attribution.
- **Licensed content** (Autodesk help, AASHTO/ALTA, third-party manuals) is *never* in the public repo; mirrors live in a separate private store gated by company login.
- **Citation-only** when we have neither rights nor a licensed copy.

See [content/00-index.md](content/00-index.md) for the full table of contents.

## Status

Initial scaffold + seeded content. Phase 1 (MVP) targets: full tree scaffolded, top ~50 pages with substantive content, Indiana jurisdictions seeded, web app running.

## License

Original content in this repo is licensed under [CC BY-SA 4.0](LICENSE). Verbatim mirrors of public-domain government works retain their original public-domain status.
