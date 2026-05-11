/**
 * Project-scoped RAG context builder.
 *
 * Combines three retrieval channels into a single object the chat layer
 * (and the MCP `get_project_context` tool) can pass into the model:
 *
 *  - Public-KB chunks via `retrieve(...)` from `web/lib/rag.ts` (the
 *    BM25-flavoured token-overlap retriever that already powers
 *    `/api/chat`).
 *  - Project-document chunks via a fresh BM25 index built from whatever
 *    `getProjectStore()` returns. When Supabase isn't wired up, this is
 *    just an empty array — the public KB still works.
 *  - Jurisdiction rules: if the project record carries a GeoJSON bound,
 *    we compute a centroid and run `getJurisdictionRules`.
 *
 * The output is intentionally plain data, no Anthropic SDK dependency, so
 * the same builder can be reused by:
 *  - the chat helper (`chatWithProject`),
 *  - the MCP `get_project_context` tool,
 *  - and any future "what does the agent know about this project?" UI.
 */

import { BM25 } from "@civil3d-master-guide/search";
import { retrieve } from "@/lib/rag";
import { getProjectStore, type ProjectChunk } from "@/lib/project-store";
import {
  getJurisdictionRules,
  centroidOfGeoJSON,
  type JurisdictionRulesResult,
} from "@/lib/jurisdiction-rules";

export interface KbChunk {
  score: number;
  text: string;
  source: string;
}

export interface ProjectChunkHit {
  score: number;
  text: string;
  source: string;
  documentId: string;
}

export interface ProjectContext {
  projectId: string;
  kbChunks: KbChunk[];
  projectChunks: ProjectChunkHit[];
  jurisdictionRules: JurisdictionRulesResult | null;
}

export interface BuildProjectContextOptions {
  kbK?: number;
  projectK?: number;
  jurisdictionLookup?: boolean;
  /** Caller-supplied user id; used by the project store for access checks. */
  userId?: string;
}

const DEFAULTS = {
  kbK: 5,
  projectK: 5,
  jurisdictionLookup: true,
};

export async function buildProjectContext(
  projectId: string,
  userQuery: string,
  options: BuildProjectContextOptions = {},
): Promise<ProjectContext> {
  const kbK = options.kbK ?? DEFAULTS.kbK;
  const projectK = options.projectK ?? DEFAULTS.projectK;
  const wantJurisdiction = options.jurisdictionLookup ?? DEFAULTS.jurisdictionLookup;
  const userId = options.userId ?? "";

  // 1) Public KB retrieval — re-uses the existing retriever so we stay
  //    consistent with what `/api/chat` shows the model. Even if there is
  //    no project, callers can use this as a thin wrapper around the KB.
  const kbChunks: KbChunk[] = [];
  try {
    const hits = await retrieve(userQuery, kbK);
    // The existing retriever doesn't expose a numeric score, so we
    // approximate one by rank (higher = better). This keeps the public
    // shape stable even if we later swap to a real BM25.
    hits.forEach((h, i) => {
      kbChunks.push({
        score: Math.round((1 - i / Math.max(1, hits.length)) * 1000) / 1000,
        text: `${h.title}\n${h.excerpt}`,
        source: h.path,
      });
    });
  } catch {
    // Search index may not have been built yet (`pnpm build:search`).
    // Degrade gracefully — the model just won't get KB context.
  }

  // 2) Project document retrieval. The store may not be wired up; that's
  //    fine, we return zero project chunks.
  let projectChunks: ProjectChunkHit[] = [];
  let project: Awaited<ReturnType<typeof loadProject>> = null;
  try {
    project = await loadProject(projectId, userId);
  } catch {
    project = null;
  }

  if (project?.chunks?.length) {
    projectChunks = retrieveProjectChunks(project.chunks, userQuery, projectK);
  }

  // 3) Jurisdiction rules from project bounds.
  let jurisdictionRules: JurisdictionRulesResult | null = null;
  if (wantJurisdiction && project?.boundsGeoJSON) {
    const centroid = centroidOfGeoJSON(project.boundsGeoJSON);
    if (centroid) {
      jurisdictionRules = getJurisdictionRules(centroid);
    }
  }

  return {
    projectId,
    kbChunks,
    projectChunks,
    jurisdictionRules,
  };
}

interface LoadedProject {
  chunks: ProjectChunk[];
  boundsGeoJSON?: unknown;
}

async function loadProject(projectId: string, userId: string): Promise<LoadedProject | null> {
  const store = await getProjectStore();
  const record = await store.getProject(projectId, userId);
  if (!record) return null;
  const chunks = await store.getProjectChunks(projectId, userId);
  return {
    chunks,
    boundsGeoJSON: record.boundsGeoJSON,
  };
}

/**
 * Build a per-project BM25 index over the project's chunks and return the
 * top-K hits for the query. Separate from the KB retriever on purpose —
 * the project corpus is usually tiny (a handful of PDFs), and a fresh
 * BM25 each request keeps things stateless.
 */
export function retrieveProjectChunks(
  chunks: ProjectChunk[],
  query: string,
  topK = 5,
): ProjectChunkHit[] {
  if (chunks.length === 0) return [];
  const bm25 = new BM25<ProjectChunk>(
    chunks.map((c) => ({
      id: c.id,
      text: c.text,
      meta: c,
    })),
  );
  return bm25.search(query, topK).map((h) => ({
    score: h.score,
    text: h.text,
    source: h.meta?.source ?? "unknown",
    documentId: h.meta?.documentId ?? "unknown",
  }));
}
