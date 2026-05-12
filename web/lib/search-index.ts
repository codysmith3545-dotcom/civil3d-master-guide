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
  /** Slug of the parent markdown page; same as `slug` for page-level entries. */
  parentSlug?: string;
  href: string;
  title: string;
  /** H2 heading this chunk lives under, or null for the page-level entry. */
  heading?: string | null;
  body: string;
  section?: string;
  tags?: string[];
  visibility?: string;
  updated?: string;
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
  // Pull a few extra results so we still hit `limit` after parent-slug dedupe.
  const fetchLimit = limit * 4;
  const result = index.search(q, { limit: fetchLimit, enrich: true }) as unknown as Array<{
    field: string;
    result: Array<{ id: number; doc: SearchDoc }>;
  }>;
  // Merge across fields, preserving rank from each. Dedupe by parentSlug so
  // multiple chunks of the same page collapse to a single hit.
  const seenIds = new Set<number>();
  const seenParents = new Set<string>();
  const ordered: SearchDoc[] = [];
  for (const group of result) {
    for (const r of group.result) {
      if (seenIds.has(r.id)) continue;
      seenIds.add(r.id);
      const doc = r.doc ?? docs.find((d) => d.id === r.id)!;
      const parentKey = doc.parentSlug ?? doc.slug;
      if (seenParents.has(parentKey)) continue;
      seenParents.add(parentKey);
      ordered.push(doc);
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
