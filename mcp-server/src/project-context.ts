/**
 * MCP-side project context.
 *
 * Mirrors `web/lib/project-context.ts` but with no Next.js / Anthropic
 * dependencies. Used by the `get_project_context` MCP tool — AI clients
 * (Claude Desktop, Cursor) call it to fetch a project's KB + project-doc
 * + jurisdiction context as plain JSON.
 *
 * KB retrieval re-uses the same `searchPages` BM25-ish scorer the
 * `search_kb` tool uses, so an MCP client gets results consistent with the
 * web app.
 *
 * Project chunks: MCP clients don't run a Supabase session, so the
 * project-document channel is read from a pluggable loader. By default
 * we return an empty array; the host application (Civil 3D Master Guide
 * server) registers a loader that talks to Supabase via the service-role
 * key.
 */

import { resolveKbRoot, loadAllPages } from "./content.js";
import { searchPages } from "./search.js";
import {
  getJurisdictionRules,
  centroidOfGeoJSON,
  type JurisdictionRulesResult,
} from "./jurisdiction-rules.js";

export interface KbChunkOut {
  score: number;
  text: string;
  source: string;
}

export interface ProjectChunkOut {
  score: number;
  text: string;
  source: string;
  documentId: string;
}

export interface ProjectContextOut {
  projectId: string;
  kbChunks: KbChunkOut[];
  projectChunks: ProjectChunkOut[];
  jurisdictionRules: JurisdictionRulesResult | null;
}

export interface ProjectChunk {
  id: string;
  documentId: string;
  source: string;
  text: string;
}

export interface ProjectRecord {
  id: string;
  boundsGeoJSON?: unknown;
}

export interface ProjectLoader {
  getProject(projectId: string, userId: string): Promise<ProjectRecord | null>;
  getProjectChunks(projectId: string, userId: string): Promise<ProjectChunk[]>;
}

let registeredLoader: ProjectLoader | null = null;

/** Wire in a project loader (Supabase-backed in production, in-memory in tests). */
export function setProjectLoader(loader: ProjectLoader | null): void {
  registeredLoader = loader;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

/**
 * Same lightweight BM25-ish scoring used by the public KB search, applied
 * to a small project corpus. Kept inline (not imported from
 * `@civil3d-master-guide/search`) to keep `mcp-server` standalone-publishable
 * via npm.
 */
function scoreProjectChunks(chunks: ProjectChunk[], query: string, topK: number): ProjectChunkOut[] {
  const qTokens = Array.from(new Set(tokenize(query)));
  if (qTokens.length === 0 || chunks.length === 0) return [];

  // Build doc frequency + length per chunk.
  const N = chunks.length;
  const docFreq = new Map<string, number>();
  const tfs: Array<{ tf: Map<string, number>; length: number }> = [];
  for (const c of chunks) {
    const toks = tokenize(c.text);
    const tf = new Map<string, number>();
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
    tfs.push({ tf, length: toks.length || 1 });
  }
  const avgLen = tfs.reduce((s, x) => s + x.length, 0) / Math.max(1, tfs.length);
  const k1 = 1.5;
  const b = 0.75;

  const out: ProjectChunkOut[] = [];
  chunks.forEach((c, i) => {
    const { tf, length } = tfs[i]!;
    let score = 0;
    for (const q of qTokens) {
      const t = tf.get(q);
      if (!t) continue;
      const df = docFreq.get(q) ?? 0;
      if (df === 0) continue;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      const denom = t + k1 * (1 - b + (b * length) / (avgLen || 1));
      score += idf * ((t * (k1 + 1)) / denom);
    }
    if (score > 0) {
      out.push({
        score: Math.round(score * 10000) / 10000,
        text: c.text,
        source: c.source,
        documentId: c.documentId,
      });
    }
  });

  out.sort((a, b) => b.score - a.score || a.source.localeCompare(b.source));
  return out.slice(0, topK);
}

export interface GetProjectContextInput {
  projectId: string;
  userId: string;
  query?: string;
  kbK?: number;
  projectK?: number;
  jurisdictionLookup?: boolean;
}

export async function getProjectContext(input: GetProjectContextInput): Promise<ProjectContextOut> {
  const query = input.query ?? "";
  const kbK = input.kbK ?? 5;
  const projectK = input.projectK ?? 5;
  const wantJurisdiction = input.jurisdictionLookup ?? true;

  // 1) Public KB retrieval.
  let kbChunks: KbChunkOut[] = [];
  if (query.trim().length > 0) {
    try {
      const root = await resolveKbRoot();
      const pages = await loadAllPages(root);
      const hits = searchPages(pages, query, kbK);
      kbChunks = hits.map((h) => ({
        score: h.score,
        text: `${h.title}\n${h.excerpt}`,
        source: h.slug,
      }));
    } catch {
      // KB not located — return empty.
    }
  }

  // 2) Project chunks via the registered loader (if any).
  let projectChunks: ProjectChunkOut[] = [];
  let project: ProjectRecord | null = null;
  if (registeredLoader) {
    try {
      project = await registeredLoader.getProject(input.projectId, input.userId);
      if (project) {
        const chunks = await registeredLoader.getProjectChunks(input.projectId, input.userId);
        projectChunks = scoreProjectChunks(chunks, query, projectK);
      }
    } catch {
      project = null;
    }
  }

  // 3) Jurisdiction rules.
  let jurisdictionRules: JurisdictionRulesResult | null = null;
  if (wantJurisdiction && project?.boundsGeoJSON) {
    const centroid = centroidOfGeoJSON(project.boundsGeoJSON);
    if (centroid) jurisdictionRules = getJurisdictionRules(centroid);
  }

  return {
    projectId: input.projectId,
    kbChunks,
    projectChunks,
    jurisdictionRules,
  };
}
