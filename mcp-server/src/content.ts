import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

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

let cachedRoot: string | null = null;
let cachedPages: PageRecord[] | null = null;
let cacheKey: string | null = null;

/**
 * Resolve the knowledge-base root by:
 *   1. Honouring KB_ROOT env var (must contain a `content/` dir or be one).
 *   2. Walking up from process.cwd().
 *   3. Walking up from the directory of this binary.
 */
export async function resolveKbRoot(): Promise<string> {
  if (cachedRoot) return cachedRoot;

  const candidates: string[] = [];
  const env = process.env.KB_ROOT;
  if (env && env.trim().length > 0) {
    candidates.push(path.resolve(env));
  }
  candidates.push(process.cwd());
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    candidates.push(here);
  } catch {
    // ignore
  }

  for (const start of candidates) {
    const found = await walkUpFor(start, "content");
    if (found) {
      cachedRoot = found;
      return found;
    }
    // Also accept a path that already IS a content dir.
    if (await isDir(path.join(start, "00-index.md")) === false) {
      // not informative; just try next
    }
    const direct = await isDir(start);
    if (direct) {
      // If user pointed KB_ROOT directly at content/
      if (path.basename(start) === "content" && (await fileExists(path.join(start, "00-index.md")))) {
        cachedRoot = path.dirname(start);
        return cachedRoot;
      }
    }
  }
  throw new Error(
    "Could not locate the Civil 3D Master Guide content/ directory. " +
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

export async function loadAllPages(root: string): Promise<PageRecord[]> {
  const cdir = contentDir(root);
  if (cachedPages && cacheKey === cdir) return cachedPages;

  const pages: PageRecord[] = [];
  await walkMd(cdir, cdir, pages);
  cachedPages = pages;
  cacheKey = cdir;
  return pages;
}

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

/** Reset internal caches; mainly for tests. */
export function _resetCache(): void {
  cachedRoot = null;
  cachedPages = null;
  cacheKey = null;
}
