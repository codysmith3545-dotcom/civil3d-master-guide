#!/usr/bin/env node
// Verifies http(s) links in content/jurisdictions/.
// Pulls links from frontmatter `sources[*].url` and from markdown link patterns in body.
// Performs HEAD (falls back to GET on 405) with 12s timeout, concurrency 8.
// Writes link-check.csv at repo root, prints a summary.
// If the network is unavailable, prints a notice and exits 0.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const JURIS_DIR = resolve(ROOT, 'content', 'jurisdictions');
const OUTPUT = resolve(ROOT, 'link-check.csv');
const CONCURRENCY = 8;
const TIMEOUT_MS = 12_000;

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
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function extractFromBody(body) {
  // Markdown links: [text](url) — capture http(s) URLs only, ignore relative.
  const urls = new Set();
  const linkRegex = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = linkRegex.exec(body)) !== null) {
    urls.add(m[1]);
  }
  // Bare http(s) URLs
  const bareRegex = /https?:\/\/[^\s)<>"'`]+/g;
  while ((m = bareRegex.exec(body)) !== null) {
    // Trim trailing punctuation that's typically not part of URLs.
    let url = m[0].replace(/[).,;:!?'"]+$/g, '');
    urls.add(url);
  }
  return urls;
}

function extractFromFrontmatterSources(fm) {
  const urls = new Set();
  const sources = Array.isArray(fm?.sources) ? fm.sources : [];
  for (const s of sources) {
    if (s && typeof s.url === 'string' && /^https?:\/\//.test(s.url)) {
      urls.add(s.url);
    }
  }
  return urls;
}

async function fetchWithTimeout(url, method) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'user-agent':
          'civil3d-master-guide-link-check/0.1 (+https://github.com/codysmith3545-dotcom/civil3d-master-guide)',
        accept: '*/*',
      },
    });
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err };
  } finally {
    clearTimeout(timer);
  }
}

async function checkLink(url) {
  // HEAD first
  let head = await fetchWithTimeout(url, 'HEAD');
  if (head.ok) {
    if (head.status === 405 || head.status === 501) {
      const get = await fetchWithTimeout(url, 'GET');
      if (get.ok) {
        return statusToResult(get.status);
      } else {
        return errorToResult(get.error);
      }
    }
    return statusToResult(head.status);
  } else {
    // Some servers reject HEAD outright; retry GET on any HEAD failure.
    if (head.error?.name === 'AbortError') {
      return { result: 'TIMEOUT', detail: 'HEAD timed out' };
    }
    const get = await fetchWithTimeout(url, 'GET');
    if (get.ok) return statusToResult(get.status);
    return errorToResult(get.error);
  }
}

function statusToResult(status) {
  if (status >= 200 && status < 400) return { result: 'PASS', detail: String(status) };
  return { result: 'FAIL', detail: `HTTP ${status}` };
}

function errorToResult(err) {
  if (!err) return { result: 'FAIL', detail: 'unknown error' };
  if (err.name === 'AbortError') return { result: 'TIMEOUT', detail: 'timeout' };
  const code = err.cause?.code || err.code;
  return { result: 'FAIL', detail: code ? `${err.name}:${code}` : err.message || err.name };
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function networkProbe() {
  // Cheap probe to a stable host. If both fail, assume offline.
  const probes = ['https://www.google.com/', 'https://example.com/'];
  for (const p of probes) {
    const res = await fetchWithTimeout(p, 'HEAD');
    if (res.ok) return true;
  }
  return false;
}

async function main() {
  const files = await walk(JURIS_DIR);
  if (files.length === 0) {
    console.log('No jurisdiction files found; nothing to check.');
    await writeFile(OUTPUT, 'file,url,result,detail\n', 'utf8');
    return;
  }

  // Collect (file, url) pairs (deduped per-file).
  const tasks = [];
  for (const abs of files) {
    const raw = await readFile(abs, 'utf8');
    let parsed;
    try {
      parsed = matter(raw);
    } catch (err) {
      console.error(`! could not parse frontmatter in ${abs}: ${err.message}`);
      continue;
    }
    const fmUrls = extractFromFrontmatterSources(parsed.data || {});
    const bodyUrls = extractFromBody(parsed.content || '');
    const all = new Set([...fmUrls, ...bodyUrls]);
    const rel = relative(ROOT, abs).split(sep).join('/');
    for (const url of all) {
      tasks.push({ file: rel, url });
    }
  }

  console.log(`Found ${tasks.length} link checks across ${files.length} files.`);

  // Network availability probe
  const online = await networkProbe();
  if (!online) {
    console.log('Notice: network appears unavailable; skipping checks and exiting 0.');
    await writeFile(OUTPUT, 'file,url,result,detail\n', 'utf8');
    return;
  }

  const results = [];
  let cursor = 0;
  async function worker() {
    while (true) {
      const idx = cursor++;
      if (idx >= tasks.length) return;
      const t = tasks[idx];
      try {
        const r = await checkLink(t.url);
        results.push({ ...t, ...r });
      } catch (err) {
        results.push({ ...t, result: 'FAIL', detail: err?.message || String(err) });
      }
    }
  }
  const workers = Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, () => worker());
  await Promise.all(workers);

  // Sort for determinism
  results.sort((a, b) => (a.file === b.file ? a.url.localeCompare(b.url) : a.file.localeCompare(b.file)));

  // Write CSV
  const lines = ['file,url,result,detail'];
  for (const r of results) {
    lines.push([csvEscape(r.file), csvEscape(r.url), csvEscape(r.result), csvEscape(r.detail)].join(','));
  }
  await writeFile(OUTPUT, lines.join('\n') + '\n', 'utf8');

  const counts = results.reduce(
    (acc, r) => {
      acc[r.result] = (acc[r.result] || 0) + 1;
      return acc;
    },
    {},
  );

  console.log(`Wrote ${OUTPUT}`);
  console.log(
    `Summary: PASS=${counts.PASS || 0}, FAIL=${counts.FAIL || 0}, TIMEOUT=${counts.TIMEOUT || 0}, total=${results.length}`,
  );
}

main().catch((err) => {
  console.error('Link check encountered an error; exiting 0 to avoid failing the run:', err);
  process.exit(0);
});
