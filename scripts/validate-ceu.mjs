#!/usr/bin/env node
// Validates every CEU module under content/ceu/.
// Each module page must have:
//   - frontmatter.ceu block (object)
//   - ceu.hours       — a number > 0  (the _index.md is exempt and may be 0)
//   - ceu.category    — one of: professional-practice, technical, ethics
//   - ceu.format      — non-empty string
//   - ceu.approval_status — one of: pending, approved, expired
//   - ceu.approval_body   — non-empty string
//
// Exits non-zero if any file fails.

import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CEU_DIR = resolve(ROOT, 'content', 'ceu');

const ALLOWED_CATEGORIES = new Set(['professional-practice', 'technical', 'ethics']);
const ALLOWED_STATUS = new Set(['pending', 'approved', 'expired']);

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

function isIndex(relPath) {
  return (
    relPath.endsWith('/_index.md') ||
    relPath.endsWith('_index.md') ||
    relPath.endsWith('/index.md') ||
    relPath.endsWith('index.md')
  );
}

async function validate(abs) {
  const errors = [];
  const raw = await readFile(abs, 'utf8');
  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    errors.push(`frontmatter parse error: ${err.message}`);
    return errors;
  }
  const fm = parsed.data || {};
  const ceu = fm.ceu;
  if (!ceu || typeof ceu !== 'object') {
    errors.push(`missing 'ceu' frontmatter block`);
    return errors;
  }

  const rel = relative(ROOT, abs).split(sep).join('/');
  const indexExempt = isIndex(rel);

  // hours
  if (typeof ceu.hours !== 'number') {
    errors.push(`ceu.hours must be a number, got ${typeof ceu.hours}`);
  } else if (!indexExempt && !(ceu.hours > 0)) {
    errors.push(`ceu.hours must be > 0 for a module (got ${ceu.hours})`);
  } else if (indexExempt && ceu.hours < 0) {
    errors.push(`ceu.hours must be >= 0 (got ${ceu.hours})`);
  }

  // category
  if (typeof ceu.category !== 'string' || !ALLOWED_CATEGORIES.has(ceu.category)) {
    errors.push(
      `ceu.category must be one of ${[...ALLOWED_CATEGORIES].join('|')} (got ${JSON.stringify(ceu.category)})`,
    );
  }

  // format
  if (typeof ceu.format !== 'string' || ceu.format.length === 0) {
    errors.push(`ceu.format must be a non-empty string`);
  }

  // approval_status
  if (typeof ceu.approval_status !== 'string' || !ALLOWED_STATUS.has(ceu.approval_status)) {
    errors.push(
      `ceu.approval_status must be one of ${[...ALLOWED_STATUS].join('|')} (got ${JSON.stringify(ceu.approval_status)})`,
    );
  }

  // approval_body
  if (typeof ceu.approval_body !== 'string' || ceu.approval_body.length === 0) {
    errors.push(`ceu.approval_body must be a non-empty string`);
  }

  return errors;
}

async function main() {
  const files = (await walk(CEU_DIR)).sort();
  if (files.length === 0) {
    console.error(`No CEU markdown files found under ${relative(ROOT, CEU_DIR)}`);
    process.exit(1);
  }

  let pass = 0;
  let fail = 0;
  let totalHours = 0;
  const failures = [];

  for (const abs of files) {
    const errors = await validate(abs);
    const rel = relative(ROOT, abs).split(sep).join('/');
    if (errors.length === 0) {
      const raw = await readFile(abs, 'utf8');
      const fm = matter(raw).data || {};
      if (!isIndex(rel) && typeof fm.ceu?.hours === 'number') {
        totalHours += fm.ceu.hours;
      }
      console.log(`PASS  ${rel}`);
      pass++;
    } else {
      console.log(`FAIL  ${rel}`);
      for (const e of errors) console.log(`        - ${e}`);
      fail++;
      failures.push({ rel, errors });
    }
  }

  console.log('');
  console.log(`Summary: ${pass} passed, ${fail} failed (out of ${files.length})`);
  console.log(`Total documented module hours: ${totalHours.toFixed(1)} PDH`);

  if (fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
