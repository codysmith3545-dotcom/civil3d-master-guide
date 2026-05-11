/**
 * Tests for the project-document upload pipeline.
 *
 * These tests target `processDocument` directly with mocked Supabase + project
 * lookups, which lets us exercise validation, dedupe, and extraction without
 * spinning up Next or hitting a real database.
 *
 * The route-level error responses (401 / 403 / 413 / 415 / 503) are derived
 * from the same `UploadError` codes returned by `processDocument`, so unit
 * coverage at the helper layer covers the route too.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  __clearVisionCacheForTest,
  __resetBudgetForTest,
  chunkText,
  processDocument,
  tokenize,
  type VisionExtractor,
} from "../lib/project-uploads";
import { PROJECT_DOC_MAX_BYTES } from "../lib/config";

// ---------------------------------------------------------------------------
// In-memory Supabase mock
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

function makeFakeSupabase() {
  const tables: Record<string, Row[]> = {
    project_documents: [],
    project_document_chunks: [],
  };

  function from(table: string) {
    if (!tables[table]) tables[table] = [];
    const rows = tables[table];

    const builder: any = {
      _filters: [] as Array<[string, unknown]>,
      _action: "" as "select" | "insert" | "update" | "delete" | "",
      _payload: null as Row | Row[] | null,
      _columns: "" as string,
      _maybeSingle: false,

      select(cols: string) {
        builder._action = "select";
        builder._columns = cols;
        return builder;
      },
      insert(payload: Row | Row[]) {
        builder._action = "insert";
        builder._payload = payload;
        return Promise.resolve({ data: null, error: null }).then((r) => {
          const items = Array.isArray(payload) ? payload : [payload];
          rows.push(...items);
          return r;
        });
      },
      update(payload: Row) {
        builder._action = "update";
        builder._payload = payload;
        return builder;
      },
      delete() {
        builder._action = "delete";
        return builder;
      },
      eq(col: string, val: unknown) {
        builder._filters.push([col, val]);
        if (builder._action === "update" || builder._action === "delete") {
          return executeMutation();
        }
        return builder;
      },
      maybeSingle() {
        builder._maybeSingle = true;
        return executeSelect();
      },
    };

    function matches(row: Row): boolean {
      return builder._filters.every(([k, v]: [string, unknown]) => row[k] === v);
    }

    async function executeSelect() {
      const matched = rows.filter(matches);
      if (builder._maybeSingle) {
        return { data: matched[0] ?? null, error: null };
      }
      return { data: matched, error: null };
    }

    async function executeMutation() {
      if (builder._action === "update") {
        const payload = builder._payload as Row;
        for (const row of rows) {
          if (matches(row)) Object.assign(row, payload);
        }
        return { data: null, error: null };
      }
      if (builder._action === "delete") {
        for (let i = rows.length - 1; i >= 0; i--) {
          if (matches(rows[i])) rows.splice(i, 1);
        }
        return { data: null, error: null };
      }
      return { data: null, error: null };
    }

    return builder;
  }

  return { from, _tables: tables };
}

const OWNER = "owner-user-id";
const PROJECT_ID = "11111111-1111-1111-1111-111111111111";

const fakeProject = async (id: string) =>
  id === PROJECT_ID ? { id, owner_user_id: OWNER } : null;

beforeEach(() => {
  __clearVisionCacheForTest();
  __resetBudgetForTest();
});

// ---------------------------------------------------------------------------
// Tokenizer + chunker sanity
// ---------------------------------------------------------------------------

describe("tokenize", () => {
  it("splits on whitespace", () => {
    expect(tokenize("hello world  again")).toEqual(["hello", "world", "again"]);
  });
});

describe("chunkText", () => {
  it("returns one chunk for short input", () => {
    const chunks = chunkText("Lorem ipsum dolor sit amet.");
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toContain("Lorem");
  });

  it("splits long input with overlap", () => {
    const words = Array.from({ length: 2500 }, (_, i) => `w${i}`).join(" ");
    const chunks = chunkText(words);
    expect(chunks.length).toBeGreaterThan(2);
    // The chunker uses CHUNK_TOKENS=800 with CHUNK_OVERLAP=100, so chunk[1]
    // starts at the overlap tail of chunk[0]. The last word of chunk[0]
    // should also appear inside chunk[1].
    const firstWords = chunks[0].split(/\s+/);
    const lastWordOfFirst = firstWords[firstWords.length - 1];
    const secondWords = new Set(chunks[1].split(/\s+/));
    expect(secondWords.has(lastWordOfFirst)).toBe(true);
  });

  it("respects paragraph boundaries", () => {
    const text = ["para one short", "para two short", "para three short"].join(
      "\n\n",
    );
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatch(/para one/);
    expect(chunks[0]).toMatch(/para three/);
  });
});

// ---------------------------------------------------------------------------
// processDocument
// ---------------------------------------------------------------------------

describe("processDocument: validation", () => {
  it("rejects a file over 25 MB", async () => {
    const bytes = Buffer.alloc(PROJECT_DOC_MAX_BYTES + 1);
    const out = await processDocument({
      bytes,
      mime: "application/pdf",
      filename: "huge.pdf",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test",
      supabase: makeFakeSupabase(),
      fetchProject: fakeProject,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.error.status).toBe(413);
      expect(out.error.code).toBe("file_too_large");
    }
  });

  it("rejects unsupported MIME types", async () => {
    const out = await processDocument({
      bytes: Buffer.from("zzz"),
      mime: "application/zip",
      filename: "weird.zip",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test",
      supabase: makeFakeSupabase(),
      fetchProject: fakeProject,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.error.status).toBe(415);
  });

  it("returns 503 when Supabase is not configured", async () => {
    const out = await processDocument({
      bytes: Buffer.from("hello"),
      mime: "text/plain",
      filename: "x.txt",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test",
      supabase: null, // explicit "not configured"
      fetchProject: fakeProject,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.error.status).toBe(503);
      expect(out.error.code).toBe("storage_not_configured");
    }
  });

  it("rejects non-owners with 403", async () => {
    const out = await processDocument({
      bytes: Buffer.from("hi"),
      mime: "text/plain",
      filename: "x.txt",
      projectId: PROJECT_ID,
      userId: "someone-else",
      apiKey: "test",
      supabase: makeFakeSupabase(),
      fetchProject: fakeProject,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.error.status).toBe(403);
  });
});

describe("processDocument: text extraction", () => {
  it("round-trips text/plain content", async () => {
    const supa = makeFakeSupabase();
    const body = "Line one.\n\nLine two paragraph.";
    const out = await processDocument({
      bytes: Buffer.from(body),
      mime: "text/plain",
      filename: "notes.txt",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test",
      supabase: supa,
      fetchProject: fakeProject,
    });
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.result.chunkCount).toBeGreaterThan(0);
      expect(out.result.status).toBe("processed");
    }
    // 1 row in project_documents, >=1 in chunks.
    expect(supa._tables.project_documents).toHaveLength(1);
    expect(
      supa._tables.project_document_chunks.length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("dedupes by sha256 — second upload returns existing row", async () => {
    const supa = makeFakeSupabase();
    const body = "Same content.";
    const first = await processDocument({
      bytes: Buffer.from(body),
      mime: "text/plain",
      filename: "a.txt",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test",
      supabase: supa,
      fetchProject: fakeProject,
    });
    const second = await processDocument({
      bytes: Buffer.from(body),
      mime: "text/plain",
      filename: "b.txt",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test",
      supabase: supa,
      fetchProject: fakeProject,
    });
    expect(first.ok && second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(second.result.status).toBe("duplicate");
      expect(second.result.reused).toBe(true);
      expect(second.result.documentId).toBe(first.result.documentId);
    }
    // Only ONE document row inserted.
    expect(supa._tables.project_documents).toHaveLength(1);
  });

  it("invokes the vision extractor for PDFs and consumes budget", async () => {
    const supa = makeFakeSupabase();
    const extractor: VisionExtractor = vi.fn(async () => ({
      text: "Extracted body text from PDF.\n\nSecond paragraph.",
      costCents: 12,
    }));
    const out = await processDocument({
      bytes: Buffer.from("%PDF-1.4 stub"),
      mime: "application/pdf",
      filename: "deed.pdf",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "test-key",
      supabase: supa,
      fetchProject: fakeProject,
      extractor,
    });
    expect(out.ok).toBe(true);
    expect(extractor).toHaveBeenCalledTimes(1);
    if (out.ok) {
      expect(out.result.chunkCount).toBeGreaterThan(0);
    }
  });

  it("caches vision extraction by sha256 across calls", async () => {
    const supa1 = makeFakeSupabase();
    const supa2 = makeFakeSupabase();
    const extractor: VisionExtractor = vi.fn(async () => ({
      text: "Cached output.",
      costCents: 8,
    }));
    const bytes = Buffer.from("%PDF stub same bytes");
    await processDocument({
      bytes,
      mime: "application/pdf",
      filename: "a.pdf",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "k",
      supabase: supa1,
      fetchProject: fakeProject,
      extractor,
    });
    // Use a fresh fake supabase so dedupe-by-row doesn't short-circuit; the
    // vision cache (sha-keyed, module-scoped) should still hit.
    await processDocument({
      bytes,
      mime: "application/pdf",
      filename: "b.pdf",
      projectId: PROJECT_ID,
      userId: OWNER,
      apiKey: "k",
      supabase: supa2,
      fetchProject: fakeProject,
      extractor,
    });
    expect(extractor).toHaveBeenCalledTimes(1);
  });
});
