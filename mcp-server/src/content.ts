/**
 * Content loading for the MCP server.
 *
 * Delegates to @civil3d-master-guide/content for the core types and logic,
 * adding a thin caching layer on top so repeated tool calls within the same
 * server session don't re-walk the filesystem.
 */

import { fileURLToPath } from "node:url";
import * as path from "node:path";

// Re-export shared types and helpers so existing imports keep working.
export {
  type Frontmatter,
  type PageRecord,
  contentDir,
  normalizeSlug,
  getPage,
} from "@civil3d-master-guide/content";

import {
  resolveKbRoot as _resolveKbRoot,
  loadAllPages as _loadAllPages,
  contentDir,
  type PageRecord,
} from "@civil3d-master-guide/content";

// ---------------------------------------------------------------------------
// Caching layer
// ---------------------------------------------------------------------------

let cachedRoot: string | null = null;

interface PageCacheEntry {
  pages: PageRecord[];
  loadedAt: number;
  cdir: string;
}

let pageCache: PageCacheEntry | null = null;

function pageCacheTtlMs(): number {
  return process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 60 * 1000;
}

export function invalidateCache(): void {
  pageCache = null;
}

export async function resolveKbRoot(): Promise<string> {
  if (cachedRoot) return cachedRoot;
  let startDir: string | undefined;
  try {
    startDir = path.dirname(fileURLToPath(import.meta.url));
  } catch {
    // ignore
  }
  cachedRoot = await _resolveKbRoot(startDir);
  return cachedRoot;
}

export async function loadAllPages(root: string): Promise<PageRecord[]> {
  const cdir = contentDir(root);
  const now = Date.now();
  if (
    pageCache &&
    pageCache.cdir === cdir &&
    now - pageCache.loadedAt <= pageCacheTtlMs()
  ) {
    return pageCache.pages;
  }

  const pages = await _loadAllPages(root);
  pageCache = { pages, loadedAt: now, cdir };
  return pages;
}

/** Reset internal caches; mainly for tests. */
export function _resetCache(): void {
  cachedRoot = null;
  pageCache = null;
}
