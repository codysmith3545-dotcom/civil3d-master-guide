#!/usr/bin/env node
// Reports the mirror_status of every markdown file under content/docs-mirror/.
//
// Pages declare frontmatter:
//   mirror_status: placeholder    -> outline only, awaiting human paste
//   mirror_status: complete       -> verbatim text is in place
//   (omitted)                     -> treated as "n/a" (e.g. index pages)
//
// Output is a table sorted by status (placeholder first), then by path.
// Exits 0 always — this is a status report, not a lint. The pipeline reads
// the report to decide what still needs human attention.

import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const MIRROR_DIR = resolve(ROOT, 'content', 'docs-mirror');

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return out;
    throw err;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

async function main() {
  const files = (await walk(MIRROR_DIR)).sort();
  const rows = [];
  let placeholders = 0;
  let complete = 0;
  let unmarked = 0;

  for (const abs of files) {
    const rel = relative(ROOT, abs).split(sep).join('/');
    const raw = await readFile(abs, 'utf8');
    let fm = {};
    try {
      fm = matter(raw).data || {};
    } catch {
      // ignore parse errors here; lint script catches those
    }
    const status = fm.mirror_status;
    const title = fm.title || '(no title)';
    let bucket;
    if (status === 'placeholder') {
      bucket = 'placeholder';
      placeholders++;
    } else if (status === 'complete') {
      bucket = 'complete';
      complete++;
    } else {
      bucket = 'n/a';
      unmarked++;
    }
    rows.push({ rel, title, status: bucket });
  }

  // Sort: placeholders first, then complete, then n/a; within each by path.
  const order = { placeholder: 0, complete: 1, 'n/a': 2 };
  rows.sort((a, b) => {
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return a.rel.localeCompare(b.rel);
  });

  const W_STATUS = 12;
  const W_PATH = 60;
  console.log('docs-mirror status report');
  console.log('');
  console.log(`${pad('status', W_STATUS)}${pad('path', W_PATH)}title`);
  console.log(`${pad('------', W_STATUS)}${pad('----', W_PATH)}-----`);
  for (const r of rows) {
    console.log(`${pad(r.status, W_STATUS)}${pad(r.rel, W_PATH)}${r.title}`);
  }
  console.log('');
  console.log(`Summary: ${placeholders} placeholder, ${complete} complete, ${unmarked} unmarked (n/a) — ${rows.length} total`);

  if (placeholders > 0) {
    console.log('');
    console.log(`Note: ${placeholders} page(s) still awaiting verbatim text paste.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
