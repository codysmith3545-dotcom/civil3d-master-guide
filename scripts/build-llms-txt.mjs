#!/usr/bin/env node
// Builds llms.txt and llms-full.txt at the repo root from content/.
// Convention: https://llmstxt.org/
//
// llms.txt    - markdown index, grouped by top-level section with one-line summaries.
// llms-full.txt - concatenated bodies of every public page, separated by '\n\n---\n\n'.
//
// Pages with `visibility: invite` are skipped from both outputs.

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, relative, join, sep, posix } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = resolve(ROOT, 'content');

const PROJECT_TITLE = 'Civil 3D Master Guide';
const PROJECT_BLURB =
  'A reference knowledge base for land surveying and civil engineering work in Autodesk Civil 3D — workflows, the full command catalog, jurisdictional design standards (Indiana focus), and curated resources.';

// Top-level grouping. Order is the order they appear in llms.txt.
const SECTION_GROUPS = [
  { key: 'civil3d', label: 'Civil 3D' },
  { key: 'field-and-boundary', label: 'Field & boundary' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'standards', label: 'Standards' },
  { key: 'customization', label: 'Customization' },
  { key: 'jurisdictions', label: 'Jurisdictions' },
  { key: 'resources', label: 'Resources' },
  { key: 'docs-mirror', label: 'Reference' },
  { key: 'glossary', label: 'Reference' },
  { key: '00-index', label: 'Reference' },
];

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(full);
      out.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function toPosixRel(absPath) {
  return relative(ROOT, absPath).split(sep).join(posix.sep);
}

function topLevelKey(relFromContent) {
  // relFromContent is something like "civil3d/surfaces/index.md" or "glossary.md".
  const first = relFromContent.split(posix.sep)[0];
  if (first.endsWith('.md')) {
    return first.replace(/\.md$/, '');
  }
  return first;
}

function firstParagraph(body) {
  // Skip leading blockquote (TL;DR) and find first regular paragraph.
  const lines = body.split('\n');
  let i = 0;
  // skip blank lines
  while (i < lines.length && lines[i].trim() === '') i++;
  // skip TL;DR blockquote block
  if (i < lines.length && lines[i].startsWith('>')) {
    while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
      // move past the blockquote and its trailing blank lines
      if (lines[i].trim() === '') {
        // stop at blank between blockquote and next block
        i++;
        break;
      }
      i++;
    }
  }
  // skip blanks and headings, take first prose paragraph
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('#') || line.startsWith('>')) {
      i++;
      continue;
    }
    // Collect the paragraph
    const para = [];
    while (i < lines.length && lines[i].trim() !== '') {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length) {
      return para.join(' ');
    }
  }
  return '';
}

function summarize(text, max = 160) {
  const cleaned = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max - 1).replace(/[ ,;:.\-]+$/, '') + '…';
}

function classify(relFromContent) {
  const topKey = topLevelKey(relFromContent);
  const match = SECTION_GROUPS.find((g) => g.key === topKey);
  if (match) return match.label;
  return 'Other';
}

async function main() {
  const files = (await walk(CONTENT_DIR)).sort();
  const pages = [];
  let skippedInvite = 0;
  let skippedBad = 0;

  for (const abs of files) {
    const raw = await readFile(abs, 'utf8');
    let parsed;
    try {
      parsed = matter(raw);
    } catch (err) {
      console.error(`! Failed to parse frontmatter: ${abs}: ${err.message}`);
      skippedBad++;
      continue;
    }
    const fm = parsed.data || {};
    if (fm.visibility === 'invite') {
      skippedInvite++;
      continue;
    }
    const relFromContent = relative(CONTENT_DIR, abs).split(sep).join(posix.sep);
    const repoRel = 'content/' + relFromContent;
    const title = fm.title || relFromContent;
    const order = typeof fm.order === 'number' ? fm.order : 1000;
    const group = classify(relFromContent);
    const summary = summarize(firstParagraph(parsed.content));

    pages.push({
      abs,
      relFromContent,
      repoRel,
      title,
      order,
      group,
      summary,
      body: parsed.content,
    });
  }

  // Build grouped index. Group order matches SECTION_GROUPS order; pages within a group
  // sort by (order asc, title asc) for determinism.
  const groupOrder = [];
  for (const g of SECTION_GROUPS) {
    if (!groupOrder.includes(g.label)) groupOrder.push(g.label);
  }
  groupOrder.push('Other');

  const grouped = new Map();
  for (const label of groupOrder) grouped.set(label, []);
  for (const page of pages) {
    if (!grouped.has(page.group)) grouped.set(page.group, []);
    grouped.get(page.group).push(page);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  }

  // Render llms.txt
  const lines = [];
  lines.push(`# ${PROJECT_TITLE}`);
  lines.push('');
  lines.push(`> ${PROJECT_BLURB}`);
  lines.push('');
  for (const label of groupOrder) {
    const list = grouped.get(label) || [];
    if (!list.length) continue;
    lines.push(`## ${label}`);
    lines.push('');
    for (const p of list) {
      const summary = p.summary ? `: ${p.summary}` : '';
      lines.push(`- [${p.title}](${p.repoRel})${summary}`);
    }
    lines.push('');
  }
  // any extra group not in the canonical list
  for (const [label, list] of grouped.entries()) {
    if (groupOrder.includes(label)) continue;
    if (!list.length) continue;
    lines.push(`## ${label}`);
    lines.push('');
    for (const p of list) {
      const summary = p.summary ? `: ${p.summary}` : '';
      lines.push(`- [${p.title}](${p.repoRel})${summary}`);
    }
    lines.push('');
  }
  const llmsTxt = lines.join('\n');

  // Render llms-full.txt - sorted by repoRel for determinism.
  const fullPages = [...pages].sort((a, b) => a.repoRel.localeCompare(b.repoRel));
  const fullParts = fullPages.map((p) => {
    return `# ${p.repoRel}\n\n${p.body.trim()}\n`;
  });
  const llmsFull = fullParts.join('\n\n---\n\n');

  await writeFile(resolve(ROOT, 'llms.txt'), llmsTxt + '\n', 'utf8');
  await writeFile(resolve(ROOT, 'llms-full.txt'), llmsFull + '\n', 'utf8');

  const totalPublic = pages.length;
  const groupCounts = [...grouped.entries()]
    .filter(([, list]) => list.length)
    .map(([label, list]) => `${label}=${list.length}`)
    .join(', ');

  console.log(`Wrote llms.txt and llms-full.txt`);
  console.log(`  public pages: ${totalPublic}`);
  console.log(`  invite pages skipped: ${skippedInvite}`);
  if (skippedBad) console.log(`  unparseable pages skipped: ${skippedBad}`);
  console.log(`  groups: ${groupCounts}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
