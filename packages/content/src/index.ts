/**
 * @civil3d-master-guide/content
 *
 * Shared content-loading utilities for the Civil 3D Master Guide knowledge base.
 * Both the MCP server and the Next.js web app import from here so that
 * frontmatter types, slug normalization, and directory-walking logic are
 * defined exactly once.
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Frontmatter {
  title?: string;
  section?: string;
  order?: number;
  visibility?: string;
  tags?: string[];
  appliesTo?: string[];
  relatedCommands?: string[];
  relatedCalculators?: string[];
  jurisdictionRefs?: string[];
  updated?: string;
  sources?: Array<{ title?: string; url?: string; verified?: string }>;
  category?: string;
  ribbon?: string;
  related?: string[];
  symptoms?: string[];
  state?: string;
  county?: string;
  municipality?: string;
  bounds?: [number, number, number, number];
  [key: string]: unknown;
}

export interface PageRecord {
  slug: string;
  absPath: string;
  relPath: string;
  frontmatter: Frontmatter;
  body: string;
  title: string;
  section: string;
  sources: Array<{ title?: string; url?: string; verified?: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function isDir(p: string): Promise<boolean> {
  try {
    const s = await fs.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Return the `content/` subdirectory of the given root. */
export function contentDir(root: string): string {
  return path.join(root, "content");
}

/** Normalize a slug input by stripping leading/trailing slashes, .md, and resolving // collapses. */
export function normalizeSlug(input: string): string {
  let s = input.trim().replace(/\\/g, "/");
  s = s.replace(/^\/+/, "").replace(/\/+$/, "");
  s = s.replace(/\.md$/i, "");
  s = s.replace(/\/+/g, "/");
  return s;
}

// ---------------------------------------------------------------------------
// Directory walking
// ---------------------------------------------------------------------------

async function walkMd(base: string, dir: string, out: PageRecord[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name.startsWith(".")) continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walkMd(base, abs, out);
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith(".md")) {
      try {
        const raw = await fs.readFile(abs, "utf8");
        const parsed = matter(raw);
        const fm = (parsed.data || {}) as Frontmatter;
        const rel = path.relative(base, abs).replace(/\\/g, "/");
        const slug = rel.replace(/\.md$/i, "");
        out.push({
          slug,
          absPath: abs,
          relPath: rel,
          frontmatter: fm,
          body: parsed.content,
          title: typeof fm.title === "string" ? fm.title : path.basename(rel, ".md"),
          section: typeof fm.section === "string" ? fm.section : path.dirname(rel),
          sources: Array.isArray(fm.sources) ? (fm.sources as PageRecord["sources"]) : [],
        });
      } catch {
        // skip unreadable files
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Walk `<root>/content/` recursively and return every .md file as a
 * `PageRecord`. The caller is responsible for caching the result if desired.
 *
 * @param root  The repo root (parent of the `content/` directory).
 */
export async function loadAllPages(root: string): Promise<PageRecord[]> {
  const cdir = contentDir(root);
  const pages: PageRecord[] = [];
  await walkMd(cdir, cdir, pages);
  return pages;
}

/**
 * Look up a single page by slug (e.g. `civil3d/commands/AddAlignmentLabel`).
 * Tries `<slug>.md` and `<slug>/index.md`.
 */
export async function getPage(root: string, slugInput: string): Promise<PageRecord | null> {
  const slug = normalizeSlug(slugInput);
  const base = contentDir(root);

  const tryPaths = [
    path.join(base, `${slug}.md`),
    path.join(base, slug, "index.md"),
    path.join(base, `${slug}/index.md`),
  ];

  for (const p of tryPaths) {
    if (await fileExists(p)) {
      const raw = await fs.readFile(p, "utf8");
      const parsed = matter(raw);
      const fm = (parsed.data || {}) as Frontmatter;
      const rel = path.relative(base, p).replace(/\\/g, "/");
      return {
        slug: rel.replace(/\.md$/i, ""),
        absPath: p,
        relPath: rel,
        frontmatter: fm,
        body: parsed.content,
        title: typeof fm.title === "string" ? fm.title : path.basename(rel, ".md"),
        section: typeof fm.section === "string" ? fm.section : path.dirname(rel),
        sources: Array.isArray(fm.sources) ? (fm.sources as PageRecord["sources"]) : [],
      };
    }
  }
  return null;
}

/**
 * Resolve the knowledge-base root by:
 *   1. Honouring KB_ROOT env var (must contain a `content/` dir or be one).
 *   2. Walking up from process.cwd().
 *   3. Walking up from `startDir` if provided.
 */
export async function resolveKbRoot(startDir?: string): Promise<string> {
  const candidates: string[] = [];
  const env = process.env.KB_ROOT;
  if (env && env.trim().length > 0) {
    candidates.push(path.resolve(env));
  }
  candidates.push(process.cwd());
  if (startDir) {
    candidates.push(startDir);
  }

  for (const start of candidates) {
    const found = await walkUpFor(start, "content");
    if (found) return found;

    // Also accept a path that IS a content dir.
    if (
      path.basename(start) === "content" &&
      (await fileExists(path.join(start, "00-index.md")))
    ) {
      return path.dirname(start);
    }
  }
  throw new Error(
    "Could not locate the content/ directory. " +
      "Set the KB_ROOT environment variable to the repo root (the directory containing content/).",
  );
}

async function walkUpFor(start: string, name: string): Promise<string | null> {
  let dir = path.resolve(start);
  for (let i = 0; i < 12; i++) {
    const candidate = path.join(dir, name);
    if (await isDir(candidate)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}
