/**
 * Project-store seam.
 *
 * The project workspace (5B-Workspace + 5B-Schema) stores per-project
 * documents and chunks in Supabase. Those tables and the typed helpers
 * (`web/lib/projects.ts`, `web/lib/supabase.ts`) are owned by other agents
 * and are not present in this worktree — so this module is the seam that
 * lets us build & test the RAG layer without them.
 *
 * Resolution order:
 *
 *  1. A loader registered at runtime via `setProjectStore(...)` (used in
 *     tests and during initial deployment).
 *  2. `web/lib/projects.ts` if it exists (5B-Schema's helper) — looked up
 *     via dynamic import so we don't hard-depend on the file at build time.
 *  3. Fallback: return an empty project (no documents, no chunks, no
 *     bounds). The RAG pipeline then degrades to the public KB only.
 *
 * The seam keeps Agent 5B-RAG independent of Agent 5B-Schema's exact API
 * surface. The expected shape is documented below.
 */

export interface ProjectChunk {
  /** Stable id (uuid or chunk-N). Used for citation references. */
  id: string;
  /** Document id this chunk belongs to. */
  documentId: string;
  /** Human-readable label for the source document. */
  source: string;
  /** Plain-text content of the chunk. */
  text: string;
  /** Optional ordering hint within the document. */
  order?: number;
}

export interface ProjectRecord {
  id: string;
  name?: string;
  ownerUserId?: string;
  members?: string[];
  /** GeoJSON Polygon / MultiPolygon / Feature / FeatureCollection. */
  boundsGeoJSON?: unknown;
}

export interface ProjectStore {
  /** Return the project record or null if it does not exist / user has no access. */
  getProject(projectId: string, userId: string): Promise<ProjectRecord | null>;
  /** Return all indexed chunks for a project's documents. */
  getProjectChunks(projectId: string, userId: string): Promise<ProjectChunk[]>;
}

let registered: ProjectStore | null = null;

/**
 * Register a project store. The workspace UI / API routes call this once at
 * startup with the live Supabase-backed implementation. Tests register a
 * synchronous in-memory store.
 */
export function setProjectStore(store: ProjectStore | null): void {
  registered = store;
}

/**
 * Return the active project store. Throws if none is registered AND the
 * `web/lib/projects.ts` autoloader isn't available — callers should treat a
 * throw as "no project backend; fall back to public-KB-only".
 */
export async function getProjectStore(): Promise<ProjectStore> {
  if (registered) return registered;

  // Best-effort auto-discovery of the 5B-Schema helper. We use a dynamic
  // import wrapped in try/catch so the build doesn't fail when the file
  // doesn't exist yet.
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — optional module owned by Agent 5B-Schema.
    const mod = await import("./projects.js").catch(() => null);
    if (mod && typeof (mod as { getProject?: unknown }).getProject === "function") {
      // Adapt the 5B-Schema helper to our ProjectStore interface.
      const adapted: ProjectStore = {
        async getProject(projectId, userId) {
          const m = mod as {
            getProject: (id: string, userId: string) => Promise<ProjectRecord | null>;
          };
          return m.getProject(projectId, userId);
        },
        async getProjectChunks(projectId, userId) {
          const m = mod as {
            getProjectChunks?: (id: string, userId: string) => Promise<ProjectChunk[]>;
          };
          if (typeof m.getProjectChunks !== "function") return [];
          return m.getProjectChunks(projectId, userId);
        },
      };
      registered = adapted;
      return adapted;
    }
  } catch {
    // ignore
  }

  // Fallback: a store that returns empty results. Lets the RAG pipeline run
  // with just the public KB while Supabase isn't wired up.
  const fallback: ProjectStore = {
    async getProject() {
      return null;
    },
    async getProjectChunks() {
      return [];
    },
  };
  return fallback;
}
