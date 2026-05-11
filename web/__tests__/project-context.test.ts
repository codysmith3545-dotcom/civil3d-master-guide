import { describe, it, expect, beforeEach } from "vitest";

import {
  buildProjectContext,
  retrieveProjectChunks,
} from "@/lib/project-context";
import { setProjectStore, type ProjectStore } from "@/lib/project-store";
import {
  composeSystemPrompt,
  parseCitations,
} from "@/lib/chat-with-project";

/**
 * A note on Supabase absence: in this worktree there is no
 * `web/lib/projects.ts` (it's owned by Agent 5B-Schema) and no Supabase
 * environment. The project-store seam lets us inject a synchronous
 * in-memory implementation here so the RAG layer is testable without
 * the database.
 */

function makeStore(overrides: Partial<ProjectStore> = {}): ProjectStore {
  return {
    async getProject() {
      return null;
    },
    async getProjectChunks() {
      return [];
    },
    ...overrides,
  };
}

beforeEach(() => {
  // Clear any prior registration between tests.
  setProjectStore(null);
});

describe("buildProjectContext", () => {
  it("returns kbChunks even when the project has no documents", async () => {
    setProjectStore(
      makeStore({
        async getProject(id) {
          return { id, boundsGeoJSON: undefined };
        },
        async getProjectChunks() {
          return [];
        },
      }),
    );

    const ctx = await buildProjectContext("proj-1", "stopping sight distance", {
      userId: "user-1",
      jurisdictionLookup: false,
    });

    expect(ctx.projectId).toBe("proj-1");
    expect(ctx.projectChunks).toEqual([]);
    expect(ctx.jurisdictionRules).toBeNull();
    // kbChunks comes from `retrieve()`, which reads the prebuilt search
    // index from `public/search-index.json`. In a test environment that
    // file may not exist; retrieve() returns []. Either way the field is
    // an array of the right shape.
    expect(Array.isArray(ctx.kbChunks)).toBe(true);
  });

  it("retrieves and ranks project chunks via BM25", async () => {
    const chunks = [
      {
        id: "c1",
        documentId: "d1",
        source: "stormwater-report.pdf",
        text: "Site stormwater detention sized for the 100-year storm with first-flush BMP requirements.",
      },
      {
        id: "c2",
        documentId: "d1",
        source: "stormwater-report.pdf",
        text: "Driveway geometry per AASHTO commercial driveway tables.",
      },
      {
        id: "c3",
        documentId: "d2",
        source: "alta-survey.pdf",
        text: "ALTA/NSPS Table A item 11(b) underground utilities per Plan-of-Record.",
      },
    ];

    setProjectStore(
      makeStore({
        async getProject(id) {
          return { id };
        },
        async getProjectChunks() {
          return chunks;
        },
      }),
    );

    const ctx = await buildProjectContext("proj-2", "stormwater detention", {
      userId: "u",
      jurisdictionLookup: false,
    });

    expect(ctx.projectChunks.length).toBeGreaterThan(0);
    // Top hit should be the stormwater chunk, not the ALTA one.
    expect(ctx.projectChunks[0]!.source).toBe("stormwater-report.pdf");
    expect(ctx.projectChunks[0]!.documentId).toBe("d1");
  });

  it("derives jurisdiction rules from project bounds when provided", async () => {
    setProjectStore(
      makeStore({
        async getProject(id) {
          return {
            id,
            // A square in downtown Indianapolis (Marion County), [lng, lat] order.
            boundsGeoJSON: {
              type: "Polygon",
              coordinates: [[
                [-86.16, 39.76],
                [-86.15, 39.76],
                [-86.15, 39.77],
                [-86.16, 39.77],
                [-86.16, 39.76],
              ]],
            },
          };
        },
      }),
    );

    const ctx = await buildProjectContext("proj-3", "anything", {
      userId: "u",
    });
    expect(ctx.jurisdictionRules).not.toBeNull();
    expect(ctx.jurisdictionRules?.state).toBe("indiana");
    expect(ctx.jurisdictionRules?.county).toBe("marion-county");
  });

  it("falls back gracefully when no project store is registered", async () => {
    // Don't register anything — store autoload finds nothing, returns
    // empty project. We should still get an object back, no throw.
    setProjectStore(null);
    const ctx = await buildProjectContext("proj-missing", "drainage", {
      userId: "u",
    });
    expect(ctx.projectChunks).toEqual([]);
    expect(ctx.jurisdictionRules).toBeNull();
  });
});

describe("retrieveProjectChunks", () => {
  it("returns empty when the corpus is empty", () => {
    expect(retrieveProjectChunks([], "anything")).toEqual([]);
  });
});

describe("composeSystemPrompt", () => {
  it("includes KB, project, and jurisdiction blocks with stable delimiters", () => {
    const prompt = composeSystemPrompt({
      projectId: "proj-snapshot",
      kbChunks: [
        {
          score: 1,
          text: "Stopping Sight Distance\nAASHTO Green Book Table 3-1: SSD at 30 mph is 200 ft.",
          source: "engineering/sight-distance",
        },
      ],
      projectChunks: [
        {
          score: 2.5,
          text: "Project stormwater report — detention pond V=42,000 cf.",
          source: "stormwater-report.pdf",
          documentId: "doc-1",
        },
      ],
      jurisdictionRules: {
        state: "indiana",
        county: "marion-county",
        summary: "Project centroid falls within Marion County, Indiana.",
        contentRefs: ["jurisdictions/indiana/marion-county/index"],
      },
    });

    // Asserting key delimiters and content; this is the "snapshot" of the
    // structural contract the chat helper relies on.
    expect(prompt).toContain("<project_id>proj-snapshot</project_id>");
    expect(prompt).toContain(
      '<retrieved_kb_chunk source="engineering/sight-distance">',
    );
    expect(prompt).toContain("AASHTO Green Book Table 3-1: SSD at 30 mph is 200 ft.");
    expect(prompt).toContain(
      '<project_document source="stormwater-report.pdf" doc_id="doc-1">',
    );
    expect(prompt).toContain("Project stormwater report");
    expect(prompt).toContain("<jurisdiction_rules>");
    expect(prompt).toContain("state=indiana; county=marion-county");
    expect(prompt).toContain("jurisdictions/indiana/marion-county/index");
  });

  it("notes when no KB chunks were retrieved", () => {
    const prompt = composeSystemPrompt({
      projectId: "proj-empty",
      kbChunks: [],
      projectChunks: [],
      jurisdictionRules: null,
    });
    expect(prompt).toContain("No public knowledge-base excerpts were retrieved");
    // The data sections should be absent. Their tag NAMES are mentioned
    // inside the rules block, so we test for the structural delimiters
    // (with attributes / newline anchors) instead of the bare tag name.
    expect(prompt).not.toContain(
      '<retrieved_kb_chunk source="',
    );
    expect(prompt).not.toContain("<project_document source=");
    expect(prompt).not.toContain("\n<jurisdiction_rules>");
  });
});

describe("parseCitations", () => {
  it("classifies citations by origin", () => {
    const ctx = {
      projectId: "p",
      kbChunks: [{ score: 1, text: "x", source: "engineering/sight-distance" }],
      projectChunks: [
        {
          score: 1,
          text: "y",
          source: "stormwater-report.pdf",
          documentId: "doc-1",
        },
      ],
      jurisdictionRules: null,
    };
    const raw =
      'AASHTO sets SSD at 200 ft for 30 mph<cite source="engineering/sight-distance">Table 3-1</cite>. ' +
      'The project report sized the pond at 42,000 cf<cite source="stormwater-report.pdf" doc_id="doc-1">page 7</cite>.';
    const cites = parseCitations(raw, ctx);
    expect(cites).toHaveLength(2);
    expect(cites[0]!.kind).toBe("kb");
    expect(cites[0]!.source).toBe("engineering/sight-distance");
    expect(cites[1]!.kind).toBe("project");
    expect(cites[1]!.documentId).toBe("doc-1");
  });
});
