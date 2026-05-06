/**
 * Server-side retrieval for the /api/chat route.
 *
 * Reads the pre-built search-index.json and uses the shared search utilities
 * from @civil3d-master-guide/search for tokenization and excerpt generation.
 */

import fs from "node:fs";
import path from "node:path";
import { tokenize, buildExcerpt } from "@civil3d-master-guide/search";

export type RetrievedChunk = {
  path: string;
  title: string;
  excerpt: string;
};

type IndexEntry = {
  id: number;
  slug: string;
  href: string;
  title: string;
  visibility?: string;
  body: string;
};

let cache: IndexEntry[] | null = null;

function loadIndex(): IndexEntry[] {
  if (cache) return cache;
  const indexPath = path.join(process.cwd(), "public", "search-index.json");
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed?.docs) ? (parsed.docs as IndexEntry[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function score(entry: IndexEntry, queryTokens: string[]): number {
  if (!queryTokens.length) return 0;
  const titleTokens = tokenize(entry.title);
  const bodyTokens = tokenize(entry.body);
  let s = 0;
  for (const q of queryTokens) {
    if (titleTokens.includes(q)) s += 5;
    for (const t of bodyTokens) {
      if (t === q) s += 1;
      else if (t.startsWith(q) && q.length >= 4) s += 0.4;
    }
  }
  return s;
}

/**
 * Stub semantic-retrieval. Reads the same flexsearch source-of-truth JSON
 * the client search uses and ranks documents by simple keyword overlap.
 * Replace with a real embedding-backed retriever when content is large enough.
 */
export async function retrieve(
  query: string,
  topN = 5,
): Promise<RetrievedChunk[]> {
  const docs = loadIndex().filter(
    (d) => d.visibility !== "invite",
  );
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const ranked = docs
    .map((d) => ({ d, s: score(d, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topN);
  return ranked.map(({ d }) => ({
    path: d.href,
    title: d.title,
    excerpt: buildExcerpt(d.body, tokens),
  }));
}
