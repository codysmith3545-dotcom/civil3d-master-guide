#!/usr/bin/env node
// Scaffolds a new content page from a relative path under content/.
// Usage: node scripts/new-page.mjs civil3d/surfaces/surface-from-points

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve, sep, posix, basename } from 'node:path';
import { constants as FS } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = resolve(ROOT, 'content');

function usage() {
  console.error('Usage: node scripts/new-page.mjs <relative-path-under-content>');
  console.error('Example: node scripts/new-page.mjs civil3d/surfaces/surface-from-points');
}

function titleFromSlug(slug) {
  // 'surface-from-points' -> 'Surface From Points'
  return slug
    .split('-')
    .map((part) => (part.length ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function todayIso() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function fileExists(p) {
  try {
    await access(p, FS.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    usage();
    process.exit(2);
  }
  // Normalize: drop leading 'content/' if user typed it; drop trailing .md
  let relPath = arg.replace(/^\/+/, '').replace(/^content\//, '');
  if (relPath.endsWith('.md')) relPath = relPath.slice(0, -3);
  if (!relPath) {
    usage();
    process.exit(2);
  }

  // Reject path traversal
  if (relPath.split(/[\\/]/).some((seg) => seg === '..' || seg === '')) {
    console.error(`Refusing path with empty or traversal segment: ${arg}`);
    process.exit(2);
  }

  const slug = relPath.split('/').pop();
  const sectionPath = relPath.split('/').slice(0, -1).join('/');
  const title = titleFromSlug(slug);
  const filePath = resolve(CONTENT_DIR, ...relPath.split('/')) + '.md';

  if (await fileExists(filePath)) {
    console.error(`Refusing to overwrite existing file: ${filePath}`);
    process.exit(1);
  }

  const updated = todayIso();
  const frontmatter =
    `---\n` +
    `title: "${title}"\n` +
    `section: "${sectionPath}"\n` +
    `order: 100\n` +
    `visibility: public\n` +
    `tags: []\n` +
    `updated: ${updated}\n` +
    `---\n\n` +
    `> **TL;DR**\n` +
    `> 1. (Replace this with a 1-5 bullet TL;DR.)\n\n` +
    `## Overview\n\n` +
    `(Write the page body here. Cite sources for any standard or numeric requirement.)\n`;

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, frontmatter, { encoding: 'utf8', flag: 'wx' });

  console.log(`Created ${filePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
