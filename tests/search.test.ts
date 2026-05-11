import { describe, it, expect, beforeAll } from "vitest";
import * as path from "node:path";
import { loadAllPages, _resetCache, type PageRecord } from "../mcp-server/src/content.js";
import { searchPages } from "../mcp-server/src/search.js";

const REPO_ROOT = path.resolve(__dirname, "..");

describe("searchPages", () => {
  let pages: PageRecord[];

  beforeAll(async () => {
    _resetCache();
    pages = await loadAllPages(REPO_ROOT);
  });

  it("returns at least one result for a common term ('stormwater')", () => {
    const hits = searchPages(pages, "stormwater");
    expect(hits.length).toBeGreaterThan(0);
  });

  it("results are ordered by score descending", () => {
    const hits = searchPages(pages, "stormwater drainage", 25);
    for (let i = 0; i < hits.length - 1; i++) {
      expect(hits[i].score).toBeGreaterThanOrEqual(hits[i + 1].score);
    }
  });

  it("empty/whitespace-only query returns an empty array", () => {
    expect(searchPages(pages, "")).toEqual([]);
    expect(searchPages(pages, "   ")).toEqual([]);
  });

  it("query for stop words alone returns empty array", () => {
    expect(searchPages(pages, "the and of")).toEqual([]);
  });

  it("a query for a content-specific term returns the most relevant page first", () => {
    // 'description-keys' is a known unique slug under civil3d/points/
    const hits = searchPages(pages, "description-keys", 5);
    expect(hits.length).toBeGreaterThan(0);
    // The top hit should mention description-keys in its slug or title
    const top = hits[0];
    const matches =
      top.slug.toLowerCase().includes("description-keys") ||
      top.title.toLowerCase().includes("description") ||
      top.title.toLowerCase().includes("description keys");
    expect(matches).toBe(true);
  });

  it("returns SearchHit objects with slug, title, score, and excerpt fields", () => {
    const hits = searchPages(pages, "civil3d", 3);
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) {
      expect(typeof h.slug).toBe("string");
      expect(typeof h.title).toBe("string");
      expect(typeof h.score).toBe("number");
      expect(typeof h.excerpt).toBe("string");
    }
  });
});
