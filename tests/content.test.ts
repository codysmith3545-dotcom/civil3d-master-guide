import { describe, it, expect, beforeAll } from "vitest";
import * as path from "node:path";
import { loadAllPages, _resetCache, type PageRecord } from "../mcp-server/src/content.js";

const REPO_ROOT = path.resolve(__dirname, "..");

describe("loadAllPages", () => {
  let pages: PageRecord[];

  beforeAll(async () => {
    _resetCache();
    pages = await loadAllPages(REPO_ROOT);
  });

  it("returns more than 100 page records", () => {
    expect(pages.length).toBeGreaterThan(100);
  });

  it("every record has a slug, title, body, and frontmatter", () => {
    for (const p of pages) {
      expect(typeof p.slug).toBe("string");
      expect(p.slug.length).toBeGreaterThan(0);
      expect(typeof p.title).toBe("string");
      expect(typeof p.body).toBe("string");
      expect(p.frontmatter).toBeDefined();
      expect(typeof p.frontmatter).toBe("object");
    }
  });

  it("contains the canonical content/00-index.md page", () => {
    const indexPage = pages.find((p) => p.slug === "00-index");
    expect(indexPage).toBeDefined();
  });

  it("contains at least one civil3d page (slug includes 'civil3d/')", () => {
    const civil = pages.find((p) => p.slug.startsWith("civil3d/"));
    expect(civil).toBeDefined();
  });

  it("all slugs are unique", () => {
    const slugs = pages.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
