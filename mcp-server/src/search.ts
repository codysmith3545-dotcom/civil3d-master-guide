import type { PageRecord } from "./content.js";

export interface SearchHit {
  slug: string;
  title: string;
  score: number;
  excerpt: string;
}

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

function uniq<T>(xs: T[]): T[] {
  return Array.from(new Set(xs));
}

function buildExcerpt(body: string, queryTokens: string[], maxLen = 240): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length === 0) return "";
  const lower = flat.toLowerCase();
  let bestIdx = -1;
  for (const tok of queryTokens) {
    const i = lower.indexOf(tok);
    if (i >= 0 && (bestIdx < 0 || i < bestIdx)) bestIdx = i;
  }
  if (bestIdx < 0) {
    return flat.slice(0, maxLen) + (flat.length > maxLen ? "..." : "");
  }
  const start = Math.max(0, bestIdx - 60);
  const end = Math.min(flat.length, start + maxLen);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < flat.length ? "..." : "";
  return prefix + flat.slice(start, end) + suffix;
}

/**
 * Lightweight search scorer: token overlap on title (3x), tags (2x), body (1x);
 * tag-boost when ANY query token appears in frontmatter tags.
 */
export function searchPages(pages: PageRecord[], query: string, limit = 10): SearchHit[] {
  const qTokens = uniq(tokenize(query));
  if (qTokens.length === 0) return [];

  const hits: SearchHit[] = [];

  for (const page of pages) {
    const title = page.title || "";
    const titleTokens = tokenize(title);
    const tags = Array.isArray(page.frontmatter.tags) ? page.frontmatter.tags.map((t) => String(t).toLowerCase()) : [];
    const bodyLower = page.body.toLowerCase();

    let score = 0;

    for (const q of qTokens) {
      // Title hit
      if (titleTokens.includes(q)) score += 3;
      else if (title.toLowerCase().includes(q)) score += 2;

      // Slug / section hit
      if (page.slug.toLowerCase().includes(q)) score += 1.5;

      // Tag hit (boost)
      if (tags.includes(q)) score += 4;
      else if (tags.some((t) => t.includes(q))) score += 2;

      // Body hit (count up to 5 occurrences to cap influence)
      let idx = 0;
      let count = 0;
      while (count < 5) {
        const next = bodyLower.indexOf(q, idx);
        if (next < 0) break;
        count++;
        idx = next + q.length;
      }
      score += count;
    }

    if (score > 0) {
      hits.push({
        slug: page.slug,
        title,
        score: Math.round(score * 100) / 100,
        excerpt: buildExcerpt(page.body, qTokens),
      });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
  return hits.slice(0, limit);
}
