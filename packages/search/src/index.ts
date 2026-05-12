/**
 * Minimal BM25 retriever.
 *
 * This is intentionally tiny: a couple hundred lines of pure TypeScript with
 * no dependencies. The whole RAG layer (`web/lib/project-context.ts` and the
 * MCP `get_project_context` tool) stands on top of this.
 *
 * Usage:
 *
 *   const bm25 = new BM25([
 *     { id: "a", text: "stopping sight distance ..." },
 *     { id: "b", text: "horizontal curve formulas ..." },
 *   ]);
 *   const hits = bm25.search("stopping sight distance", 5);
 *
 * Hits come back sorted by descending score, capped at `topK`.
 */

export interface BM25Document<Meta = Record<string, unknown>> {
  id: string;
  text: string;
  meta?: Meta;
}

export interface BM25Hit<Meta = Record<string, unknown>> {
  id: string;
  score: number;
  text: string;
  meta?: Meta;
}

const STOPWORDS = new Set([
  "a", "an", "and", "or", "the", "of", "to", "for", "in", "on", "at", "by",
  "is", "it", "this", "that", "with", "from", "as", "be", "are", "was", "were",
  "how", "what", "when", "where", "why", "do", "does", "did", "can", "i",
  "you", "your", "we", "our", "they", "their", "but", "if", "not", "no",
]);

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

interface IndexEntry {
  id: string;
  text: string;
  meta?: unknown;
  tokens: string[];
  termFreq: Map<string, number>;
  length: number;
}

export class BM25<Meta = Record<string, unknown>> {
  private readonly entries: IndexEntry[] = [];
  private readonly docFreq = new Map<string, number>();
  private readonly k1: number;
  private readonly b: number;
  private avgLen = 0;

  constructor(docs: BM25Document<Meta>[] = [], opts: { k1?: number; b?: number } = {}) {
    this.k1 = opts.k1 ?? 1.5;
    this.b = opts.b ?? 0.75;
    for (const d of docs) this.add(d);
  }

  add(doc: BM25Document<Meta>): void {
    const tokens = tokenize(doc.text);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) this.docFreq.set(t, (this.docFreq.get(t) ?? 0) + 1);
    this.entries.push({
      id: doc.id,
      text: doc.text,
      meta: doc.meta,
      tokens,
      termFreq: tf,
      length: tokens.length || 1,
    });
    // Re-compute average length lazily — simple total/count.
    const total = this.entries.reduce((s, e) => s + e.length, 0);
    this.avgLen = total / this.entries.length;
  }

  get size(): number {
    return this.entries.length;
  }

  search(query: string, topK = 5): BM25Hit<Meta>[] {
    const qTokens = Array.from(new Set(tokenize(query)));
    if (qTokens.length === 0 || this.entries.length === 0) return [];

    const N = this.entries.length;
    const hits: BM25Hit<Meta>[] = [];

    for (const entry of this.entries) {
      let score = 0;
      for (const q of qTokens) {
        const tf = entry.termFreq.get(q);
        if (!tf) continue;
        const df = this.docFreq.get(q) ?? 0;
        if (df === 0) continue;
        // Robertson/Spaerck-Jones IDF; add 1 to keep it non-negative for tiny corpora.
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        const denom = tf + this.k1 * (1 - this.b + (this.b * entry.length) / (this.avgLen || 1));
        score += idf * ((tf * (this.k1 + 1)) / denom);
      }
      if (score > 0) {
        hits.push({
          id: entry.id,
          score: Math.round(score * 10000) / 10000,
          text: entry.text,
          meta: entry.meta as Meta | undefined,
        });
      }
    }

    hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    return hits.slice(0, topK);
  }
}

/** Convenience: build & query in one shot. */
export function bm25Search<Meta = Record<string, unknown>>(
  docs: BM25Document<Meta>[],
  query: string,
  topK = 5,
): BM25Hit<Meta>[] {
  return new BM25<Meta>(docs).search(query, topK);
}
