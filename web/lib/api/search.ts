/**
 * Token-overlap search for the public REST API.
 *
 * Mirrors the scoring style of mcp-server/src/search.ts (token overlap +
 * tag boost) so the MCP and REST surfaces return comparable hits. Uses
 * the same content set the web app exposes.
 */

import { listAll, type Page } from "../content";

export type ApiSearchHit = {
  slug: string;
  href: string;
  title: string;
  score: number;
  excerpt: string;
  tags?: string[];
};

const STOPWORDS = new Set([
  "a", "an", "and", "or", "the", "of", "to", "for", "in", "on", "at", "by",
  "is", "it", "this", "that", "with", "from", "as", "be", "are", "was", "were",
  "how", "what", "when", "where", "why", "do", "does", "did", "can", "i",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function buildExcerpt(body: string, queryTokens: string[], maxLen = 240): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length === 0) return "";
  const lower = flat.toLowerCase();
  let best = -1;
  for (const t of queryTokens) {
    const idx = lower.indexOf(t);
    if (idx >= 0 && (best < 0 || idx < best)) best = idx;
  }
  if (best < 0) return flat.slice(0, maxLen);
  const start = Math.max(0, best - 60);
  const end = Math.min(flat.length, start + maxLen);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < flat.length ? "…" : "";
  return prefix + flat.slice(start, end) + suffix;
}

function pageTags(p: Page): string[] {
  const t = (p.frontmatter as Record<string, unknown>)["tags"];
  return Array.isArray(t) ? (t as string[]).map(String) : [];
}

function pageTitle(p: Page): string {
  const t = (p.frontmatter as Record<string, unknown>)["title"];
  return typeof t === "string" ? t : p.slug;
}

export function searchKb(query: string, limit = 10): ApiSearchHit[] {
  const q = tokenize(query);
  if (q.length === 0) return [];
  const pages = listAll();
  const hits: ApiSearchHit[] = [];
  for (const p of pages) {
    if ((p.frontmatter as Record<string, unknown>)["visibility"] === "invite") continue;
    const title = pageTitle(p);
    const tags = pageTags(p);
    const titleTokens = new Set(tokenize(title));
    const tagTokens = new Set(tags.flatMap((t) => tokenize(t)));
    const bodyTokens = new Set(tokenize(p.body).slice(0, 4000));
    let score = 0;
    for (const t of q) {
      if (titleTokens.has(t)) score += 5;
      if (tagTokens.has(t)) score += 3;
      if (bodyTokens.has(t)) score += 1;
    }
    if (score <= 0) continue;
    hits.push({
      slug: p.slug,
      href: p.href,
      title,
      score,
      excerpt: buildExcerpt(p.body, q),
      tags: tags.length ? tags : undefined,
    });
  }
  hits.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
  return hits.slice(0, limit);
}
