#!/usr/bin/env node
// Generates content/civil3d/commands/_index.generated.md by walking
// content/civil3d/commands/ for individual command pages.
// Excludes index.md, shortcuts.md, command-line-cheatsheet.md, and anything under by-category/.
// Output is .gitignored.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const COMMANDS_DIR = resolve(ROOT, 'content', 'civil3d', 'commands');
const OUTPUT = resolve(COMMANDS_DIR, '_index.generated.md');

const EXCLUDED_FILES = new Set(['index.md', 'shortcuts.md', 'command-line-cheatsheet.md', '_index.generated.md', '_template.md']);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip the by-category directory entirely.
      if (entry.name === 'by-category') continue;
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (EXCLUDED_FILES.has(entry.name)) continue;
      out.push(full);
    }
  }
  return out;
}

function fmt(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === undefined || value === null) return '';
  return String(value);
}

function escCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

async function main() {
  const files = await walk(COMMANDS_DIR);
  const rows = [];
  for (const abs of files) {
    const raw = await readFile(abs, 'utf8');
    let parsed;
    try {
      parsed = matter(raw);
    } catch (err) {
      console.error(`! Failed to parse frontmatter: ${abs}: ${err.message}`);
      continue;
    }
    const fm = parsed.data || {};
    const command = fm.command || fm.title || abs.split(sep).pop().replace(/\.md$/, '');
    const category = fmt(fm.category);
    const ribbon = fmt(fm.ribbon || fm.ribbonPath);
    const relPath = relative(COMMANDS_DIR, abs).split(sep).join('/');
    rows.push({ command, category, ribbon, relPath });
  }

  rows.sort((a, b) => a.command.toLowerCase().localeCompare(b.command.toLowerCase()));

  const lines = [];
  lines.push('---');
  lines.push('title: "Civil 3D Commands — Generated Index"');
  lines.push('section: "civil3d/commands"');
  lines.push('order: 999');
  lines.push('visibility: public');
  lines.push('tags: [generated, commands, index]');
  lines.push(`updated: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('---');
  lines.push('');
  lines.push('> **TL;DR**');
  lines.push('> 1. Auto-generated alphabetical index of every per-command page in `content/civil3d/commands/`.');
  lines.push('> 2. Edit the source pages, not this file. Re-run `node scripts/seed-civil3d-commands.mjs` to regenerate.');
  lines.push('');
  lines.push(`Total commands: ${rows.length}`);
  lines.push('');

  if (rows.length === 0) {
    lines.push('_No per-command pages found yet._');
  } else {
    lines.push('| Command | Category | Ribbon | Page |');
    lines.push('|---|---|---|---|');
    for (const r of rows) {
      lines.push(
        `| ${escCell(r.command)} | ${escCell(r.category)} | ${escCell(r.ribbon)} | [${escCell(r.relPath)}](${r.relPath}) |`,
      );
    }
  }
  lines.push('');

  await writeFile(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Wrote ${OUTPUT}`);
  console.log(`Indexed ${rows.length} command page(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
