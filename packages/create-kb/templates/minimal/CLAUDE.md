# CLAUDE.md — guidance for AI assistants working in this repo

## What this repo is

{{brand.name}} — {{knowledge.scope}}

The single source of truth is markdown under `content/`. A Next.js web app
(`web/`) renders it; an MCP server (`mcp-server/`) exposes it programmatically.

## How to navigate

Start at `content/00-index.md`. Pages have YAML frontmatter
(title, section, tags, sources). The first body block is a TL;DR blockquote.

## Rules

1. **Cite sources.** Every claim from an external standard must link the source.
2. **Stay current.** Set `appliesTo:` to versions you actually verified.
3. **Don't republish copyrighted material.** Summarize + link.
4. **No invented values.** Look it up or say you don't know.
5. **Match existing conventions** (see `CONTRIBUTING.md` if present).
6. **Keep prose plain.** No marketing voice. No emoji.

## When you're unsure

Ask. Better to clarify than to write something wrong into a reference.
