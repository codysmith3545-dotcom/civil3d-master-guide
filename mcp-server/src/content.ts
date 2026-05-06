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
  type PageRecord,
} from "@civil3d-master-guide/content";

// ---------------------------------------------------------------------------
// Caching layer
// ---------------------------------------------------------------------------

let cachedRoot: string | null = null;
let cachedPages: PageRecord[] | null = null;
let cacheKey: string | null = null;

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
  const cdir = root;
  if (cachedPages && cacheKey === cdir) return cachedPages;
  cachedPages = await _loadAllPages(root);
  cacheKey = cdir;
  return cachedPages;
}

/** Reset internal caches; mainly for tests. */
export function _resetCache(): void {
  cachedRoot = null;
  cachedPages = null;
  cacheKey = null;
}
