/**
 * Browser-side helper for loading and querying the build-time flexsearch
 * index that lives at `/search-index.json`.
 *
 * The build script (`scripts/build-search-index.mjs`) writes a JSON document
 * with the shape:
 *
 *   { generatedAt: string, docs: SearchDoc[] }
 *
 * We do client-side ranking with flexsearch's `Document` class.
 */
"use client";

import FlexSearch from "flexsearch";

export type SearchDoc = {
  id: number;
  slug: string;
  href: string;
  title: string;
  body: string;
  tags?: string[];
  visibility?: string;
};

export type SearchHit = {
  doc: SearchDoc;
  excerpt: string;
};

let indexPromise: Promise<{
  index: FlexSearch.Document<SearchDoc, true>;
  docs: SearchDoc[];
}> | null = null;

export function loadIndex() {
  if (indexPromise) return indexPromise;
  indexPromise = (async () => {
    const res = await fetch("/search-index.json", { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to load search index");
    const json = (await res.json()) as { docs: SearchDoc[] };
    const docs = (json.docs ?? []).filter((d) => d.visibility !== "invite");
    const index = new FlexSearch.Document<SearchDoc, true>({
      tokenize: "forward",
      cache: true,
      document: {
        id: "id",
        index: ["title", "body", "tags"],
        store: true,
      },
    });
    for (const d of docs) index.add(d);
    return { index, docs };
  })();
  return indexPromise;
}

export async function search(query: string, limit = 10): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const { index, docs } = await loadIndex();
  const result = index.search(q, { limit, enrich: true }) as Array<{
    field: string;
    result: Array<{ id: number; doc: SearchDoc }>;
  }>;
  // Merge across fields, preserving rank from each.
  const seen = new Set<number>();
  const ordered: SearchDoc[] = [];
  for (const group of result) {
    for (const r of group.result) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      ordered.push(r.doc ?? docs.find((d) => d.id === r.id)!);
      if (ordered.length >= limit) break;
    }
    if (ordered.length >= limit) break;
  }
  return ordered.map((doc) => ({ doc, excerpt: makeExcerpt(doc.body, q) }));
}

function makeExcerpt(body: string, q: string): string {
  if (!body) return "";
  const lower = body.toLowerCase();
  const i = lower.indexOf(q.toLowerCase());
  if (i === -1) return body.slice(0, 200).trim() + (body.length > 200 ? "…" : "");
  const start = Math.max(0, i - 60);
  const end = Math.min(body.length, i + 180);
  return (start > 0 ? "…" : "") + body.slice(start, end).trim() + (end < body.length ? "…" : "");
}
