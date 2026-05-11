#!/usr/bin/env node
// Audits every markdown file under content/ for frontmatter and convention compliance.
//
// Usage:
//   node scripts/audit-frontmatter.mjs                      # full audit, table report
//   node scripts/audit-frontmatter.mjs --json               # JSON to stdout
//   node scripts/audit-frontmatter.mjs --fix                # apply safe auto-fixes (frontmatter only)
//   node scripts/audit-frontmatter.mjs --section <prefix>   # only audit files whose section starts with <prefix>
//
// Default behavior writes a markdown report to reports/frontmatter-audit-<today>.md
// and prints a one-line summary to stdout. Fixes are logged to
// reports/frontmatter-audit-<today>-fixes.md when --fix is used.
//
// Rule severity:
//   ERROR   — must fix before merge
//   WARNING — review needed
//
// See CONTRIBUTING.md and CLAUDE.md for the canonical conventions.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative, join, sep, dirname } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = resolve(ROOT, 'content');
// task spec calls out customization/lisp/library/** — that path lives inside content/customization in this repo
const SCAN_DIRS = [CONTENT_DIR];

// Required frontmatter keys per task spec (title, section, tags, updated).
// CONTRIBUTING.md also lists order/visibility as required, but the task explicitly
// names this shorter list. We check the task's list as ERRORS and the broader list
// from CONTRIBUTING as WARNINGS where applicable.
const REQUIRED_FIELDS = ['title', 'section', 'tags', 'updated'];
const RECOMMENDED_FIELDS = ['order', 'visibility'];

const TODAY = '2026-05-11';
const STALE_DAYS = 365;

// ----- character / emoji detection (mirrors lint-content.mjs) -----
const CODEPOINT_ALLOWLIST = new Set([0x2605]); // ★
function isAllowedChar(cp) {
  if (CODEPOINT_ALLOWLIST.has(cp)) return true;
  if (cp === 0x09 || cp === 0x0a || cp === 0x0d) return true;
  if (cp < 0x20) return false;
  if (cp >= 0x20 && cp <= 0x04ff) return true;
  if (cp >= 0x2000 && cp <= 0x206f) return true;
  if (cp >= 0x2070 && cp <= 0x209f) return true;
  if (cp >= 0x20a0 && cp <= 0x20cf) return true;
  if (cp >= 0x2100 && cp <= 0x214f) return true;
  if (cp >= 0x2150 && cp <= 0x218f) return true;
  if (cp >= 0x2190 && cp <= 0x21ff) return true;
  if (cp >= 0x2200 && cp <= 0x22ff) return true;
  if (cp >= 0x2500 && cp <= 0x257f) return true;
  return false;
}

function findOffendingChars(text) {
  const offenders = new Map();
  let i = 0;
  while (i < text.length) {
    const cp = text.codePointAt(i);
    if (!isAllowedChar(cp)) {
      offenders.set(cp, (offenders.get(cp) || 0) + 1);
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

function daysBetween(isoA, isoB) {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

const TAG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
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

// Loads the canonical command index from content/civil3d/commands/.
async function loadKnownCommands() {
  const cmdDir = join(CONTENT_DIR, 'civil3d', 'commands');
  if (!existsSync(cmdDir)) return new Set();
  const out = new Set();
  const entries = await readdir(cmdDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.md')) continue;
    if (e.name === '_template.md' || e.name === 'index.md') continue;
    const slug = e.name.replace(/\.md$/, '');
    out.add(slug.toLowerCase());
    // also seed the explicit `command:` frontmatter field if present
    try {
      const raw = await readFile(join(cmdDir, e.name), 'utf8');
      const fm = matter(raw).data || {};
      if (typeof fm.command === 'string') out.add(fm.command.toLowerCase());
      if (typeof fm.title === 'string') out.add(fm.title.toLowerCase());
    } catch {
      /* ignore */
    }
  }
  return out;
}

// Section path expected from disk location.
function expectedSection(absPath) {
  const rel = relative(CONTENT_DIR, absPath).split(sep).join('/');
  const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';
  return dir;
}

function pushErr(out, rule, detail) {
  out.errors.push({ rule, detail });
}
function pushWarn(out, rule, detail) {
  out.warnings.push({ rule, detail });
}

// ---------- audit one file ----------
export async function auditFile(abs, opts = {}) {
  const { knownCommands = new Set(), today = TODAY } = opts;
  const out = { file: relative(ROOT, abs).split(sep).join('/'), errors: [], warnings: [], fixesApplied: [] };
  let raw;
  try {
    raw = await readFile(abs, 'utf8');
  } catch (err) {
    pushErr(out, 'READ_ERROR', err.message);
    return out;
  }

  // FRONTMATTER_PRESENT — file must start with '---'
  const trimmed = raw.replace(/^﻿/, '');
  if (!trimmed.startsWith('---\n') && !trimmed.startsWith('---\r\n')) {
    pushErr(out, 'MISSING_FRONTMATTER', 'First line is not `---`');
    return out;
  }

  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    pushErr(out, 'FRONTMATTER_PARSE', err.message);
    return out;
  }
  const fm = parsed.data || {};

  // REQUIRED_FIELDS
  for (const k of REQUIRED_FIELDS) {
    const v = fm[k];
    if (v === undefined || v === null) {
      pushErr(out, 'MISSING_REQUIRED', `missing field \`${k}\``);
    } else if (typeof v === 'string' && v.trim() === '' && k !== 'section') {
      pushErr(out, 'EMPTY_REQUIRED', `empty field \`${k}\``);
    } else if (Array.isArray(v) && v.length === 0 && k === 'tags') {
      pushWarn(out, 'EMPTY_TAGS', '`tags` is an empty array');
    }
  }

  // RECOMMENDED (order/visibility) — warning if missing
  for (const k of RECOMMENDED_FIELDS) {
    if (fm[k] === undefined || fm[k] === null) {
      pushWarn(out, 'MISSING_RECOMMENDED', `missing recommended field \`${k}\``);
    }
  }

  // UPDATED_ISO_DATE
  if (fm.updated !== undefined && fm.updated !== null) {
    if (!isValidIsoDate(fm.updated)) {
      const detail = fm.updated instanceof Date
        ? `parsed as Date — must be quoted ISO string YYYY-MM-DD`
        : `not ISO YYYY-MM-DD: ${JSON.stringify(fm.updated)}`;
      pushErr(out, 'BAD_DATE_FORMAT', detail);
    } else {
      // stale check
      const iso = fm.updated instanceof Date
        ? fm.updated.toISOString().slice(0, 10)
        : fm.updated;
      const age = daysBetween(iso, today);
      if (age > STALE_DAYS) {
        pushWarn(out, 'STALE_UPDATED', `last updated ${iso} (${age} days ago)`);
      }
    }
  }

  // TAG_FORMAT
  if (Array.isArray(fm.tags)) {
    for (const t of fm.tags) {
      if (typeof t !== 'string') {
        pushErr(out, 'BAD_TAG', `non-string tag: ${JSON.stringify(t)}`);
      } else if (!TAG_RE.test(t)) {
        pushErr(out, 'BAD_TAG', `tag \`${t}\` is not lowercase-hyphenated`);
      }
    }
  } else if (fm.tags !== undefined && fm.tags !== null) {
    pushErr(out, 'BAD_TAG', `tags must be an array, got ${typeof fm.tags}`);
  }

  // SECTION_MATCHES_DIR
  const expSection = expectedSection(abs);
  if (typeof fm.section === 'string') {
    // Allow empty section for top-level files (00-index.md, glossary.md)
    if (fm.section === '' && expSection === '') {
      /* ok */
    } else if (fm.section !== expSection) {
      pushErr(out, 'SECTION_MISMATCH', `section \`${fm.section}\` does not match directory \`${expSection}\``);
    }
  }

  // TL;DR in first body block
  const body = parsed.content || '';
  // Find the first non-empty line of the body — must be a TL;DR blockquote per CLAUDE.md.
  // Be tolerant: allow it within the first ~5 non-empty lines (some pages have a heading first).
  const lines = body.split('\n');
  const firstNonEmpty = lines.findIndex((l) => l.trim() !== '');
  const tldrRe = /^>\s*\*\*TL;?DR\*\*/i;
  let tldrFound = false;
  if (firstNonEmpty >= 0) {
    // The first body block must be the TL;DR blockquote.
    const firstLine = lines[firstNonEmpty];
    if (tldrRe.test(firstLine)) {
      tldrFound = true;
    } else {
      // Loosen: scan the first 50 lines — if TL;DR exists somewhere but not first, warn only
      const has = lines.slice(0, 50).some((l) => tldrRe.test(l));
      if (has) {
        pushWarn(out, 'TLDR_NOT_FIRST', 'TL;DR blockquote is present but not the first body block');
        tldrFound = true;
      }
    }
  }
  if (!tldrFound) {
    pushErr(out, 'MISSING_TLDR', "first body block is not '> **TL;DR**'");
  }

  // NO_EMOJI in body
  const offenders = findOffendingChars(body);
  if (offenders.size) {
    const sample = [...offenders.entries()]
      .slice(0, 5)
      .map(([cp, count]) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')} (${String.fromCodePoint(cp)}) x${count}`)
      .join(', ');
    pushErr(out, 'EMOJI_OR_DISALLOWED_CHAR', `disallowed characters in body: ${sample}`);
  }

  // WARNINGS

  // appliesTo recommended for civil3d-behavior pages
  const isCivil3dPage =
    (typeof fm.section === 'string' && fm.section.startsWith('civil3d')) ||
    (Array.isArray(fm.relatedCommands) && fm.relatedCommands.length > 0) ||
    (Array.isArray(fm.related) && fm.related.length > 0);
  if (isCivil3dPage && !fm.appliesTo) {
    pushWarn(out, 'MISSING_APPLIESTO', 'civil3d-behavior page should set `appliesTo`');
  }

  // sources / verified recommended
  if (!Array.isArray(fm.sources) || fm.sources.length === 0) {
    pushWarn(out, 'MISSING_SOURCES', 'no `sources` listed');
  } else {
    for (const s of fm.sources) {
      if (!s || typeof s !== 'object') {
        pushWarn(out, 'BAD_SOURCE', `source entry is not an object: ${JSON.stringify(s)}`);
        continue;
      }
      if (!s.title) pushWarn(out, 'BAD_SOURCE', 'source missing `title`');
      if (!s.url) pushWarn(out, 'BAD_SOURCE', 'source missing `url`');
      if (!s.verified) {
        pushWarn(out, 'BAD_SOURCE', `source \`${s.title || s.url || '?'}\` missing \`verified\` date`);
      } else if (!isValidIsoDate(s.verified)) {
        pushWarn(out, 'BAD_SOURCE', `source \`verified\` is not ISO: ${JSON.stringify(s.verified)}`);
      }
    }
  }

  // INVENTED_COMMAND check — scan body for backtick `CamelCaseCommand` tokens
  if (knownCommands && knownCommands.size > 0) {
    const tokenRe = /`([A-Z][A-Za-z0-9]+)`/g;
    const seen = new Set();
    let m;
    while ((m = tokenRe.exec(body)) !== null) {
      const tok = m[1];
      // heuristic: only flag if it looks like a Civil 3D command (mixed-case, len ≥ 6, contains a lowercase letter)
      if (tok.length < 6) continue;
      if (!/[a-z]/.test(tok)) continue;
      if (seen.has(tok)) continue;
      seen.add(tok);
      if (!knownCommands.has(tok.toLowerCase())) {
        pushWarn(out, 'POSSIBLE_INVENTED_COMMAND', `\`${tok}\` is not in content/civil3d/commands/`);
      }
    }
  }

  return out;
}

// ---------- auto-fix safe issues ----------
// Surgical, line-level edits to the YAML frontmatter block. Does NOT
// re-stringify the YAML (which would reformat the entire file). Returns
// {fixedRaw, changes[]} or null if no changes.
//
// Fixable rules:
//   - US-format date in `updated:` (MM/DD/YYYY -> YYYY-MM-DD)
//   - Uppercase / underscored tags inside an inline `tags: [...]` list
//     (only the inline form — multi-line tag blocks are left alone to avoid
//      reformatting risk)
//   - Trailing whitespace on individual frontmatter lines
//
// Anything else (missing fields, missing TL;DR, emoji in body, etc.) is left
// for the human to fix.
function applySafeFixes(raw /* , audit */) {
  const trimmed = raw.replace(/^﻿/, '');
  if (!trimmed.startsWith('---\n') && !trimmed.startsWith('---\r\n')) return null;
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const lines = raw.split(eol);
  // Find frontmatter bounds.
  if (lines[0] !== '---') return null;
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { endIdx = i; break; }
  }
  if (endIdx < 0) return null;

  const changes = [];
  for (let i = 1; i < endIdx; i++) {
    const original = lines[i];
    let line = original;

    // Trim trailing whitespace
    const rtrimmed = line.replace(/[ \t]+$/, '');
    if (rtrimmed !== line) {
      changes.push(`trimmed trailing whitespace on line ${i + 1}`);
      line = rtrimmed;
    }

    // US-date repair on the `updated:` line.
    const dm = line.match(/^(\s*updated\s*:\s*)["']?(\d{1,2})\/(\d{1,2})\/(\d{4})["']?\s*$/);
    if (dm) {
      const [, prefix, mm, dd, yyyy] = dm;
      const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      line = `${prefix}${iso}`;
      changes.push(`updated US-date -> ${iso}`);
    }

    // Inline tags array — downcase + hyphenate.
    const tm = line.match(/^(\s*tags\s*:\s*)\[(.+)\]\s*$/);
    if (tm) {
      const [, prefix, inner] = tm;
      const items = inner.split(',').map((s) => s.trim()).filter(Boolean);
      let any = false;
      const fixed = items.map((it) => {
        // Strip surrounding quotes
        const m2 = it.match(/^(['"])(.*)\1$/);
        const stripped = m2 ? m2[2] : it;
        const lower = stripped.toLowerCase().replace(/[_\s]+/g, '-');
        if (lower !== stripped) {
          any = true;
          changes.push(`tag \`${stripped}\` -> \`${lower}\``);
        }
        return lower;
      });
      if (any) {
        line = `${prefix}[${fixed.join(', ')}]`;
      }
    }

    lines[i] = line;
  }

  if (changes.length === 0) return null;
  return { fixedRaw: lines.join(eol), changes };
}

// ---------- CLI ----------
async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

function parseArgs(argv) {
  const args = { json: false, fix: false, section: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') args.json = true;
    else if (a === '--fix') args.fix = true;
    else if (a === '--section') args.section = argv[++i] || null;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const knownCommands = await loadKnownCommands();

  const allFiles = [];
  for (const d of SCAN_DIRS) allFiles.push(...(await walk(d)));
  allFiles.sort();

  // Section filter (use directory-based section, not frontmatter)
  const filtered = args.section
    ? allFiles.filter((p) => expectedSection(p).startsWith(args.section))
    : allFiles;

  const results = [];
  const fixesLog = [];
  for (const abs of filtered) {
    const audit = await auditFile(abs, { knownCommands, today: TODAY });
    if (args.fix) {
      const raw = await readFile(abs, 'utf8');
      const fix = applySafeFixes(raw, audit);
      if (fix) {
        await writeFile(abs, fix.fixedRaw, 'utf8');
        audit.fixesApplied = fix.changes;
        fixesLog.push({ file: audit.file, changes: fix.changes });
        // re-audit after the fix so the report reflects the fixed state
        const post = await auditFile(abs, { knownCommands, today: TODAY });
        post.fixesApplied = fix.changes;
        results.push(post);
        continue;
      }
    }
    results.push(audit);
  }

  // Summary
  const errCount = results.reduce((n, r) => n + r.errors.length, 0);
  const warnCount = results.reduce((n, r) => n + r.warnings.length, 0);
  const errFiles = results.filter((r) => r.errors.length > 0).length;
  const warnFiles = results.filter((r) => r.warnings.length > 0).length;
  const summaryLine = `Audited ${results.length} files: ${errCount} errors across ${errFiles} files; ${warnCount} warnings across ${warnFiles} files.`;

  if (args.json) {
    process.stdout.write(JSON.stringify({ summary: summaryLine, results }, null, 2) + '\n');
    return errCount > 0 ? 1 : 0;
  }

  // Write markdown report
  await ensureDir(resolve(ROOT, 'reports'));
  const reportPath = resolve(ROOT, `reports/frontmatter-audit-${TODAY}.md`);
  const md = renderReport(results, { errCount, warnCount });
  await writeFile(reportPath, md, 'utf8');

  if (args.fix && fixesLog.length > 0) {
    const fixesPath = resolve(ROOT, `reports/frontmatter-audit-${TODAY}-fixes.md`);
    const fmd = renderFixesLog(fixesLog);
    await writeFile(fixesPath, fmd, 'utf8');
  }

  console.log(summaryLine);
  console.log(`Report: ${relative(ROOT, reportPath).split(sep).join('/')}`);
  return errCount > 0 ? 1 : 0;
}

function renderReport(results, { errCount, warnCount }) {
  const lines = [];
  lines.push(`# Frontmatter audit — ${TODAY}`);
  lines.push('');
  lines.push(`- Files scanned: ${results.length}`);
  lines.push(`- Errors: ${errCount} (must fix before merge)`);
  lines.push(`- Warnings: ${warnCount} (review needed)`);
  lines.push('');
  lines.push('Rule severity follows CONTRIBUTING.md and CLAUDE.md. Errors block merge; warnings need human review.');
  lines.push('');
  lines.push('## Coverage notes');
  lines.push('');
  lines.push('- `content/customization/lisp/` is treated as full content (same frontmatter rules). The task spec mentioned a `library/<category>/` subtree of 50 routine docs; that subtree does not yet exist in this worktree (Quality-LispLint or a content agent will add it). When those pages land, this auditor will pick them up automatically because it walks `content/` recursively.');
  lines.push('- `content/jurisdictions/indiana/**` and `content/field-and-boundary/legal-descriptions/**` are covered.');
  lines.push('');

  const errRows = [];
  const warnRows = [];
  for (const r of results) {
    for (const e of r.errors) errRows.push([r.file, e.rule, e.detail]);
    for (const w of r.warnings) warnRows.push([r.file, w.rule, w.detail]);
  }

  lines.push('## Errors');
  lines.push('');
  if (errRows.length === 0) {
    lines.push('_No errors._');
  } else {
    lines.push('| File | Rule | Detail |');
    lines.push('|------|------|--------|');
    for (const [f, rule, d] of errRows) {
      lines.push(`| \`${f}\` | ${rule} | ${escapeCell(d)} |`);
    }
  }
  lines.push('');
  lines.push('## Warnings');
  lines.push('');
  if (warnRows.length === 0) {
    lines.push('_No warnings._');
  } else {
    lines.push('| File | Rule | Detail |');
    lines.push('|------|------|--------|');
    for (const [f, rule, d] of warnRows) {
      lines.push(`| \`${f}\` | ${rule} | ${escapeCell(d)} |`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function renderFixesLog(fixesLog) {
  const lines = [];
  lines.push(`# Frontmatter auto-fixes — ${TODAY}`);
  lines.push('');
  lines.push(`Files modified: ${fixesLog.length}`);
  lines.push('');
  lines.push('| File | Changes |');
  lines.push('|------|---------|');
  for (const f of fixesLog) {
    lines.push(`| \`${f.file}\` | ${f.changes.map(escapeCell).join('; ')} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function escapeCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

// Run when invoked directly, not when imported by tests.
const invokedDirectly = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('audit-frontmatter.mjs');
if (invokedDirectly) {
  main().then((code) => process.exit(code ?? 0)).catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
