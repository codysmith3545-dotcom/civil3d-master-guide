import fs from "node:fs";
import path from "node:path";

export type RetrievedChunk = {
  path: string;
  title: string;
  excerpt: string;
};

type IndexEntry = {
  id: number;
  slug: string;
  parentSlug?: string;
  href: string;
  title: string;
  heading?: string | null;
  section?: string;
  tags?: string[];
  visibility?: string;
  updated?: string;
  body: string;
};

type LoadedIndex = {
  docs: IndexEntry[];
  // Pre-tokenized doc fields (lazily built once per process).
  bodyTokens: string[][];
  titleTokens: string[][];
  headingTokens: string[][];
  tagTokens: string[][];
  // BM25 statistics.
  avgdl: number;
  // term -> document-frequency (number of docs containing the term anywhere
  // searchable). Computed on first query.
  df: Map<string, number> | null;
  // Cached IDF for terms we've already seen.
  idf: Map<string, number>;
};

let cache: LoadedIndex | null = null;

function loadIndex(): LoadedIndex {
  if (cache) return cache;
  const indexPath = path.join(process.cwd(), "public", "search-index.json");
  let docs: IndexEntry[] = [];
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.docs)) {
      docs = parsed.docs as IndexEntry[];
    } else if (Array.isArray(parsed)) {
      // Backward compat with old flat-array index shape.
      docs = parsed as IndexEntry[];
    }
  } catch {
    docs = [];
  }

  // Filter invite-only at load time so they never participate in scoring.
  docs = docs.filter((d) => d.visibility !== "invite");

  const bodyTokens = docs.map((d) => tokenize(d.body));
  const titleTokens = docs.map((d) => tokenize(d.title));
  const headingTokens = docs.map((d) => tokenize(d.heading ?? ""));
  const tagTokens = docs.map((d) => tokenize((d.tags ?? []).join(" ")));

  const totalLen = bodyTokens.reduce((acc, t) => acc + t.length, 0);
  const avgdl = bodyTokens.length > 0 ? totalLen / bodyTokens.length : 0;

  cache = {
    docs,
    bodyTokens,
    titleTokens,
    headingTokens,
    tagTokens,
    avgdl,
    df: null,
    idf: new Map(),
  };
  return cache;
}

function tokenize(s: string): string[] {
  if (!s) return [];
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Compute document-frequency for the corpus once. A term counts if it
 * appears in ANY of body / title / heading / tags for that doc — that way
 * matches in metadata still get IDF mass.
 */
function buildDocumentFrequency(idx: LoadedIndex): Map<string, number> {
  const df = new Map<string, number>();
  for (let i = 0; i < idx.docs.length; i++) {
    const seen = new Set<string>();
    for (const list of [
      idx.bodyTokens[i],
      idx.titleTokens[i],
      idx.headingTokens[i],
      idx.tagTokens[i],
    ]) {
      for (const t of list) seen.add(t);
    }
    for (const t of seen) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  return df;
}

function idfFor(idx: LoadedIndex, term: string): number {
  if (idx.idf.has(term)) return idx.idf.get(term)!;
  if (!idx.df) idx.df = buildDocumentFrequency(idx);
  const N = idx.docs.length || 1;
  const n = idx.df.get(term) ?? 0;
  // BM25 IDF (Robertson/Sparck-Jones), clamped to >=0 to avoid negative
  // scores for very common terms.
  const raw = Math.log(1 + (N - n + 0.5) / (n + 0.5));
  const v = Math.max(0, raw);
  idx.idf.set(term, v);
  return v;
}

const K1 = 1.5;
const B = 0.75;
const TITLE_BOOST = 5;
const HEADING_BOOST = 5;
const TAG_BOOST = 2;

/**
 * BM25 score for a single document against the query terms, with field
 * boosts for title/heading/tags.
 */
function scoreBM25(idx: LoadedIndex, docIdx: number, queryTokens: string[]): number {
  const body = idx.bodyTokens[docIdx];
  const title = idx.titleTokens[docIdx];
  const heading = idx.headingTokens[docIdx];
  const tags = idx.tagTokens[docIdx];
  const dl = body.length || 1;
  const avgdl = idx.avgdl || 1;

  let score = 0;
  for (const q of queryTokens) {
    const tf = countOccurrences(body, q);
    if (tf > 0) {
      const idf = idfFor(idx, q);
      const denom = tf + K1 * (1 - B + B * (dl / avgdl));
      score += idf * ((tf * (K1 + 1)) / denom);
    }
    if (title.includes(q)) score += TITLE_BOOST * idfFor(idx, q);
    if (heading.includes(q)) score += HEADING_BOOST * idfFor(idx, q);
    if (tags.includes(q)) score += TAG_BOOST * idfFor(idx, q);
  }
  return score;
}

function countOccurrences(tokens: string[], term: string): number {
  let n = 0;
  for (const t of tokens) if (t === term) n++;
  return n;
}

function makeExcerpt(body: string, queryTokens: string[]): string {
  if (!body) return "";
  const MAX = 240;
  const PAD = 80;
  const lower = body.toLowerCase();
  let bestIdx = -1;
  let bestLen = 0;
  for (const q of queryTokens) {
    const i = lower.indexOf(q);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
      bestIdx = i;
      bestLen = q.length;
    }
  }
  if (bestIdx === -1) {
    const slice = body.slice(0, MAX).trim();
    return slice + (body.length > MAX ? "…" : "");
  }
  const center = bestIdx + bestLen / 2;
  let start = Math.max(0, Math.floor(center - PAD - bestLen / 2));
  let end = Math.min(body.length, start + MAX);
  // If we hit the right edge, shift left so we still return up to MAX chars.
  if (end - start < MAX && start > 0) {
    start = Math.max(0, end - MAX);
  }
  const slice = body.slice(start, end).trim();
  return (start > 0 ? "…" : "") + slice + (end < body.length ? "…" : "");
}

/**
 * Retrieve top-N chunks ranked by BM25 against the query. Deduplicates by
 * parentSlug so the result set isn't dominated by multiple sections of the
 * same page; the highest-scoring chunk per page wins.
 */
export async function retrieve(
  query: string,
  topN = 5,
): Promise<RetrievedChunk[]> {
  const idx = loadIndex();
  const tokens = tokenize(query);
  if (!tokens.length || idx.docs.length === 0) return [];

  const ranked: { i: number; s: number }[] = [];
  for (let i = 0; i < idx.docs.length; i++) {
    const s = scoreBM25(idx, i, tokens);
    if (s > 0) ranked.push({ i, s });
  }
  ranked.sort((a, b) => b.s - a.s);

  // Deduplicate by parentSlug so the top-N spans distinct pages.
  const seen = new Set<string>();
  const out: RetrievedChunk[] = [];
  for (const { i } of ranked) {
    const d = idx.docs[i];
    const key = d.parentSlug ?? d.slug;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      path: d.href,
      title: d.title,
      excerpt: makeExcerpt(d.body, tokens),
    });
    if (out.length >= topN) break;
  }
  return out;
}
