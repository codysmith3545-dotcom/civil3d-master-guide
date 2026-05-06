#!/usr/bin/env node
// Lints every markdown file under content/.
// Checks:
//   - frontmatter parses
//   - required fields: title, section, order, visibility, updated
//   - visibility in {public, invite}
//   - updated parses as ISO date
//   - body has '> **TL;DR**' within first 50 lines
//   - no emoji or other out-of-range characters in body
//
// Exits non-zero if any file fails.

import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = resolve(ROOT, 'content');

const REQUIRED_FIELDS = ['title', 'section', 'order', 'visibility', 'updated'];
const ALLOWED_VISIBILITY = new Set(['public', 'invite']);

// Allowed character ranges (covers ASCII + Latin-1/Latin-Extended-A/B + IPA + common
// typographic punctuation/spaces, math/currency we actually use, plus arrows).
// Anything outside these ranges (including emoji, dingbats, CJK, etc.) is rejected,
// with the exception of the explicit allowlist (★).
const CODEPOINT_ALLOWLIST = new Set([0x2605]); // ★

function isAllowedChar(cp) {
  if (CODEPOINT_ALLOWLIST.has(cp)) return true;
  // C0 controls: allow tab, LF, CR. Others not allowed.
  if (cp === 0x09 || cp === 0x0a || cp === 0x0d) return true;
  if (cp < 0x20) return false;
  // Basic Latin + Latin-1 Supplement + Latin Extended-A + Latin Extended-B + IPA + Spacing modifiers + Combining diacritics + Greek + Cyrillic
  if (cp >= 0x20 && cp <= 0x04ff) return true;
  // General punctuation block (en/em dashes, smart quotes, ellipsis, etc.)
  if (cp >= 0x2000 && cp <= 0x206f) return true;
  // Superscripts and subscripts
  if (cp >= 0x2070 && cp <= 0x209f) return true;
  // Currency symbols
  if (cp >= 0x20a0 && cp <= 0x20cf) return true;
  // Letterlike symbols (a few are useful: №, ™, ℃, ℉, etc.)
  if (cp >= 0x2100 && cp <= 0x214f) return true;
  // Number forms (½, ¼, etc. mostly live in Latin-1 but a few here)
  if (cp >= 0x2150 && cp <= 0x218f) return true;
  // Arrows
  if (cp >= 0x2190 && cp <= 0x21ff) return true;
  // Mathematical operators (×, ÷ are in Latin-1; ≤, ≥, ≈ here)
  if (cp >= 0x2200 && cp <= 0x22ff) return true;
  // Geometric shapes etc are 0x25xx -> mostly disallow, but we already allowlisted ★ above.
  // Box drawing (sometimes used in ASCII tables)
  if (cp >= 0x2500 && cp <= 0x257f) return true;
  return false;
}

function findOffendingChars(text) {
  const offenders = new Map();
  let i = 0;
  while (i < text.length) {
    const cp = text.codePointAt(i);
    if (!isAllowedChar(cp)) {
      const ch = String.fromCodePoint(cp);
      offenders.set(cp, (offenders.get(cp) || 0) + 1);
      // also note the line number of the first occurrence?
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return offenders;
}

function isValidIsoDate(value) {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
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

async function lintFile(abs) {
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
  // Required: key must be present with a defined, non-null value. An empty string is
  // tolerated for `section` (used for top-level pages like 00-index.md and glossary.md).
  for (const f of REQUIRED_FIELDS) {
    const v = fm[f];
    if (v === undefined || v === null) {
      errors.push(`missing required frontmatter field: ${f}`);
      continue;
    }
    if (v === '' && f !== 'section') {
      errors.push(`required frontmatter field is empty: ${f}`);
    }
  }

  if (fm.visibility !== undefined && !ALLOWED_VISIBILITY.has(fm.visibility)) {
    errors.push(`invalid visibility: ${fm.visibility} (must be 'public' or 'invite')`);
  }

  if (fm.updated !== undefined && !isValidIsoDate(fm.updated)) {
    errors.push(`updated is not an ISO date: ${fm.updated}`);
  }

  if (typeof fm.order !== 'number') {
    if (fm.order !== undefined) {
      errors.push(`order must be a number, got ${typeof fm.order}: ${fm.order}`);
    }
  }

  // TL;DR check within the first 50 lines of the body (post-frontmatter content).
  const body = parsed.content || '';
  const first50 = body.split('\n').slice(0, 50);
  const tldrRegex = /^>\s*\*\*TL;DR\*\*/;
  if (!first50.some((ln) => tldrRegex.test(ln))) {
    errors.push(`missing '> **TL;DR**' blockquote within first 50 lines of body`);
  }

  // Emoji / out-of-range character check on body
  const offenders = findOffendingChars(body);
  if (offenders.size) {
    const sample = [...offenders.entries()]
      .slice(0, 5)
      .map(([cp, count]) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')} (${String.fromCodePoint(cp)}) x${count}`)
      .join(', ');
    errors.push(`disallowed characters in body: ${sample}`);
  }

  return errors;
}

async function main() {
  const files = (await walk(CONTENT_DIR)).sort();
  let pass = 0;
  let fail = 0;
  const failures = [];

  for (const abs of files) {
    const errors = await lintFile(abs);
    const rel = relative(ROOT, abs).split(sep).join('/');
    if (errors.length === 0) {
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

  if (fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
