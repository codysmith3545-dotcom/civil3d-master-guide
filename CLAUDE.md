# CLAUDE.md — guidance for AI assistants working in this repo

This file is read by Claude Code (and, when symlinked as `.cursorrules`, by Cursor) on session start. Same content also makes a good system-prompt addendum for Claude Projects / Custom GPTs that have the repo as a knowledge source.

## What this repo is

A reference knowledge base for land surveying and civil engineering work in Autodesk Civil 3D. The single source of truth is markdown under `content/`. A Next.js web app (`web/`) renders it; an MCP server (`mcp-server/`) exposes it programmatically. Domain focus: U.S. (AASHTO, ALTA/NSPS, NCS), with an Indiana jurisdictional layer (Marion + 7 surrounding counties + their municipalities).

## How to navigate the content

Start at `content/00-index.md`. The tree:

```
content/civil3d/                 Civil 3D objects, workflows, commands
content/field-and-boundary/      Real-world survey practice
content/engineering/             Civil-engineering reference material
content/standards/               AASHTO/ALTA/NCS curated summaries + links
content/customization/           LISP / .NET / Dynamo / templates
content/jurisdictions/indiana/   State + county + municipality pages
content/resources/               Curated outside resources
content/docs-mirror/             Verbatim public-domain mirrors
content/glossary.md              Term definitions
```

Every page has YAML frontmatter (title, section, tags, appliesTo, relatedCommands, sources). The first body block is always a TL;DR blockquote — that's usually what the user wants.

## Rules when answering questions or editing content

1. **Cite sources.** Every claim that comes from a standard, ordinance, or Autodesk help page must link the source. If you can't cite, say so.
2. **Stay current.** When you write about a Civil 3D behavior, set `appliesTo:` to the versions you verified. Don't pretend a 2020 workflow is current if you didn't check 2024+.
3. **Don't republish copyrighted material.** Autodesk help, AASHTO, ALTA materials never go in this public repo. Summarize + link, or note that the verbatim text lives in the private companion store. Municipal ordinances, INDOT IDM, and other government works *can* be mirrored verbatim under `content/docs-mirror/`.
4. **No invented commands or values.** If you don't know an exact command name, ribbon path, or numeric standard, say so or look it up. Never make one up.
5. **Match existing conventions.** Use the frontmatter spec from `CONTRIBUTING.md`. Lowercase hyphenated tags. ISO dates. Civil 3D command names match Autodesk's casing.
6. **Keep prose plain.** No marketing voice. No emoji. Concise sentences. Numeric standards always include units.

## Common tasks

- **"What does Civil 3D command X do?"** Check `content/civil3d/commands/<X>.md`. If missing, scaffold it from the template at `content/civil3d/commands/_template.md`.
- **"What does Carmel require for stormwater?"** Check `content/jurisdictions/indiana/hamilton-county/municipalities/carmel/` and the city's design-standards manual link.
- **"How do I set up description keys?"** `content/civil3d/points/description-keys.md`.
- **Adding a new jurisdiction:** copy `content/jurisdictions/_template/` and fill in.
- **Adding a new command:** `node scripts/new-page.mjs civil3d/commands/<CommandName>` then fill in.

## What this codebase is not

- It is not a list of company-proprietary procedures. It is generic + Indiana-jurisdictional reference content.
- It is not a project-management tool.
- It is not a place to dump licensed material — that belongs in the private store, behind auth.

## When you're unsure

Ask. The user would much rather clarify than have you write something wrong into a reference that other people will rely on.
