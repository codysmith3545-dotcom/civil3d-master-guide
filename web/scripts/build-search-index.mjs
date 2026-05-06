#!/usr/bin/env node
/**
 * build-search-index.mjs
 *
 * Reads all .md files from ../content/, parses YAML frontmatter with
 * gray-matter, and writes a JSON search index to web/public/search-index.json.
 *
 * Run at build time:  node scripts/build-search-index.mjs
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.resolve(import.meta.dirname, "..", "..", "content");
const OUT_FILE = path.resolve(import.meta.dirname, "..", "public", "search-index.json");
const BODY_LIMIT = 500;

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
 * Turn a relative file path into a slug: strip .md extension and leading
 * slashes.
 */
function toSlug(relPath) {
  return relPath.replace(/\.md$/, "").replace(/\\/g, "/");
}

async function main() {
  const files = await collectMarkdown(CONTENT_DIR, CONTENT_DIR);
  const index = [];

  for (const relPath of files) {
    const absPath = path.join(CONTENT_DIR, relPath);
    const raw = await readFile(absPath, "utf8");
    const { data: fm, content } = matter(raw);

    const slug = toSlug(relPath);
    const title = typeof fm.title === "string" ? fm.title : slug;
    const section = typeof fm.section === "string" ? fm.section : "";
    const tags = Array.isArray(fm.tags) ? fm.tags : [];

    // First 500 characters of the body after frontmatter, collapsed whitespace.
    const body = content.replace(/\s+/g, " ").trim().slice(0, BODY_LIMIT);

    index.push({ slug, title, section, tags, body });
  }

  // Sort by slug for deterministic output.
  index.sort((a, b) => a.slug.localeCompare(b.slug));

  // Ensure public/ exists.
  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index, null, 2), "utf8");

  console.log(
    `search-index: wrote ${index.length} entries to ${path.relative(process.cwd(), OUT_FILE)}`,
  );
}

main().catch((err) => {
  console.error("build-search-index failed:", err);
  process.exit(1);
});
