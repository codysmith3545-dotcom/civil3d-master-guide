#!/usr/bin/env node
// jurisdiction-changes-rss.mjs
//
// Generate an RSS 2.0 feed listing recent git changes under content/jurisdictions/.
// One <item> per (file, commit) — capped at 50 commits per file. Output is
// written to web/public/jurisdiction-changes.rss (gitignored).
//
// Skips silently when:
//   * there is no git history at all (shallow clones, fresh extractions)
//   * a file has never been edited (no commits touch it)
//
// File moves are followed via `git log --follow`.

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), '..');
const JURISDICTIONS_DIR = join(ROOT, 'content', 'jurisdictions');
const OUTPUT = join(ROOT, 'web', 'public', 'jurisdiction-changes.rss');
const MAX_COMMITS_PER_FILE = 50;
const REPO_URL = 'https://github.com/codysmith3545-dotcom/civil3d-master-guide';
const DEFAULT_BRANCH = 'main';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tryExec(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    return null;
  }
}

function hasGitHistory() {
  const out = tryExec('git rev-parse --is-inside-work-tree');
  if (!out || out.trim() !== 'true') return false;
  const log = tryExec('git log -1 --format=%H');
  return Boolean(log && log.trim());
}

function listJurisdictionFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop();
    for (const entry of readdirSync(cur)) {
      if (entry.startsWith('.')) continue;
      const abs = join(cur, entry);
      const st = statSync(abs);
      if (st.isDirectory()) stack.push(abs);
      else if (st.isFile() && entry.toLowerCase().endsWith('.md')) out.push(abs);
    }
  }
  return out;
}

/**
 * Return up to MAX_COMMITS_PER_FILE commits that touched `file`, newest first.
 * Each entry: { hash, isoDate, subject }.
 * Returns [] if the file has no git history.
 */
function commitsForFile(file) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  // Use --follow to track through renames. Format with NUL separators so
  // commit subjects with embedded delimiters don't break parsing.
  const fmt = '%H%x1f%aI%x1f%s';
  const raw = tryExec(
    `git log --follow --max-count=${MAX_COMMITS_PER_FILE} --pretty=format:${fmt} -z -- "${rel}"`
  );
  if (!raw) return [];
  const out = [];
  for (const entry of raw.split('\0')) {
    if (!entry) continue;
    const parts = entry.split('\x1f');
    if (parts.length < 3) continue;
    const [hash, isoDate, subject] = parts;
    if (!hash || !isoDate) continue;
    out.push({ hash, isoDate, subject: (subject ?? '').trim() });
  }
  return out;
}

function xmlEscape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc2822(isoDate) {
  // Convert ISO 8601 → RFC 2822 (RSS 2.0 pubDate format).
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function blobUrl(filePath, hash) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  return `${REPO_URL}/blob/${hash}/${rel}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (!hasGitHistory()) {
    console.log('jurisdiction-changes-rss: skipping — no git history available.');
    return;
  }
  if (!existsSync(JURISDICTIONS_DIR)) {
    console.log('jurisdiction-changes-rss: skipping — content/jurisdictions/ not found.');
    return;
  }

  const files = listJurisdictionFiles(JURISDICTIONS_DIR);
  const items = [];

  for (const file of files) {
    const commits = commitsForFile(file);
    if (commits.length === 0) continue; // never edited; skip
    const relFile = relative(ROOT, file).replace(/\\/g, '/');
    for (const c of commits) {
      items.push({
        relFile,
        hash: c.hash,
        isoDate: c.isoDate,
        subject: c.subject,
        link: blobUrl(file, c.hash),
      });
    }
  }

  // Sort newest first.
  items.sort((a, b) => (a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0));

  const nowRfc = new Date().toUTCString();
  const xmlItems = items
    .map((it) => {
      const title = `${it.relFile}: ${it.subject || it.hash.slice(0, 7)}`;
      const guid = `${it.hash}:${it.relFile}`;
      return [
        '    <item>',
        `      <title>${xmlEscape(title)}</title>`,
        `      <link>${xmlEscape(it.link)}</link>`,
        `      <guid isPermaLink="false">${xmlEscape(guid)}</guid>`,
        `      <pubDate>${rfc2822(it.isoDate)}</pubDate>`,
        `      <description>${xmlEscape(`Commit ${it.hash.slice(0, 7)} on ${it.relFile}: ${it.subject}`)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>Civil 3D Master Guide — Jurisdiction Changes</title>',
    `    <link>${xmlEscape(`${REPO_URL}/tree/${DEFAULT_BRANCH}/content/jurisdictions`)}</link>`,
    '    <description>Recent commits touching content under content/jurisdictions/.</description>',
    `    <lastBuildDate>${nowRfc}</lastBuildDate>`,
    '    <language>en-US</language>',
    xmlItems,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, rss, 'utf8');
  console.log(
    `jurisdiction-changes-rss: wrote ${items.length} item(s) across ${files.length} file(s) → ${relative(ROOT, OUTPUT)}`
  );
}

main();
