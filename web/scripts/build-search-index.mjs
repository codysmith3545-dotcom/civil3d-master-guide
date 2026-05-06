#!/usr/bin/env node
/**
 * build-search-index.mjs
 *
 * Reads all .md files from ../content/, parses YAML frontmatter with
 * gray-matter, splits each page body at h2 (## ) boundaries, and writes a
 * JSON search index to web/public/search-index.json.
 *
 * Output shape:
 *   {
 *     generatedAt: string,
 *     count: number,
 *     docs: SearchDoc[]
 *   }
 *
 * Each page contributes one "page-level" entry (heading=null, body = full
 * body text) plus one entry per h2 chunk so a query can match either a
 * specific section or the page as a whole.
 *
 * Run at build time:  node scripts/build-search-index.mjs
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.resolve(import.meta.dirname, "..", "..", "content");
const OUT_FILE = path.resolve(import.meta.dirname, "..", "public", "search-index.json");

/**
 * Recursively collect all .md files under `dir`, returning paths relative to
 * `base`.
 */
async function collectMarkdown(dir, base) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMarkdown(full, base)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

/**
 * Turn a relative file path into a slug: strip .md extension and
 * normalize separators.
 */
function toSlug(relPath) {
  return relPath.replace(/\.md$/, "").replace(/\\/g, "/");
}

/**
 * Collapse runs of whitespace and trim. Used to normalize chunk bodies for
 * the index.
 */
function normalizeWhitespace(s) {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Split a markdown body into chunks at h2 (`## `) boundaries.
 * - Text before the first h2 becomes the "Introduction" chunk (only emitted
 *   if it has content).
 * - Each subsequent h2 starts a new chunk; the heading line is consumed and
 *   stored separately on the chunk.
 *
 * Returns: Array<{ heading: string | null, body: string }>
 */
function splitByH2(content) {
  const lines = content.split(/\r?\n/);
  const chunks = [];
  let currentHeading = null; // null marks the pre-first-h2 / introduction chunk
  let buffer = [];

  const flush = () => {
    const body = normalizeWhitespace(buffer.join("\n"));
    if (!body && currentHeading === null) {
      // No intro content; skip.
      return;
    }
    chunks.push({
      heading: currentHeading === null ? "Introduction" : currentHeading,
      body,
    });
  };

  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      // Flush previous chunk before starting a new one.
      flush();
      currentHeading = m[1].trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  // Flush trailing chunk.
  flush();
  return chunks;
}

async function main() {
  const files = await collectMarkdown(CONTENT_DIR, CONTENT_DIR);
  const docs = [];
  let nextId = 0;

  for (const relPath of files) {
    const absPath = path.join(CONTENT_DIR, relPath);
    const raw = await readFile(absPath, "utf8");
    const { data: fm, content } = matter(raw);

    const slug = toSlug(relPath);
    const href = "/docs/" + slug;
    const title = typeof fm.title === "string" ? fm.title : slug;
    const section = typeof fm.section === "string" ? fm.section : "";
    const tags = Array.isArray(fm.tags) ? fm.tags.filter((t) => typeof t === "string") : [];
    const visibility = typeof fm.visibility === "string" ? fm.visibility : undefined;
    const updated =
      typeof fm.updated === "string"
        ? fm.updated
        : fm.updated instanceof Date
          ? fm.updated.toISOString().slice(0, 10)
          : undefined;

    // Page-level entry (heading=null) — full body, not truncated. Used as a
    // backstop so multi-section queries can still resolve the page itself.
    const fullBody = normalizeWhitespace(content);
    docs.push({
      id: nextId++,
      slug,
      parentSlug: slug,
      href,
      title,
      heading: null,
      section,
      tags,
      visibility,
      updated,
      body: fullBody,
    });

    // Heading-scoped chunk entries.
    const chunks = splitByH2(content);
    chunks.forEach((chunk, i) => {
      if (!chunk.body) return;
      docs.push({
        id: nextId++,
        slug: `${slug}#${i}`,
        parentSlug: slug,
        href: chunk.heading && chunk.heading !== "Introduction"
          ? `${href}#${slugifyHeading(chunk.heading)}`
          : href,
        title,
        heading: chunk.heading,
        section,
        tags,
        visibility,
        updated,
        body: chunk.body,
      });
    });
  }

  // Sort by parentSlug then id for deterministic output.
  docs.sort((a, b) => {
    if (a.parentSlug !== b.parentSlug) return a.parentSlug.localeCompare(b.parentSlug);
    return a.id - b.id;
  });

  // Reassign ids after sort so they remain dense and stable per build.
  docs.forEach((d, i) => {
    d.id = i;
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    count: docs.length,
    docs,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");

  console.log(
    `search-index: wrote ${docs.length} entries (${files.length} pages) to ${path.relative(process.cwd(), OUT_FILE)}`,
  );
}

/**
 * Convert an h2 heading into a URL fragment. Mirrors GitHub-style anchors
 * roughly enough for our purposes — rehype-slug applies the canonical rule
 * at render time, so this is best-effort for href hints.
 */
function slugifyHeading(heading) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

main().catch((err) => {
  console.error("build-search-index failed:", err);
  process.exit(1);
});
