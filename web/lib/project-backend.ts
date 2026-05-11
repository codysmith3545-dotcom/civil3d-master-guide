/**
 * Defensive loader for the sibling-agent backend modules
 * (5B-Schema, 5B-RAG, 5B-Upload). Those modules may or may not exist on disk
 * yet; this UI agent must build and run without them.
 *
 * Every loader returns `{ ok: false, reason }` rather than throwing so that
 * API routes can return a clean 503 and pages can show a clear placeholder.
 *
 * Implementation note: we use `eval('require')` so the bundler does not try
 * to resolve modules that haven't been merged yet. All callers must run on
 * the Node.js runtime (no edge).
 */

export const SUPABASE_PLACEHOLDER_MESSAGE =
  "Projects require Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ANTHROPIC_API_KEY in .env.local, then restart.";

export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

type LoadResult<T> = { ok: true; mod: T } | { ok: false; reason: string };

function tryRequire<T>(specifier: string): LoadResult<T> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-eval
    const req = eval("require") as NodeRequire;
    // Resolve relative to this file: web/lib/project-backend.ts.
    const mod = req(specifier) as T;
    return { ok: true, mod };
  } catch (err) {
    return {
      ok: false,
      reason:
        err instanceof Error
          ? `Module ${specifier} not available: ${err.message}`
          : `Module ${specifier} not available.`,
    };
  }
}

// ---- 5B-Schema -----------------------------------------------------------

export type ProjectSummary = {
  id: string;
  name: string;
  slug: string;
  documentCount?: number;
  updatedAt?: string;
  createdAt?: string;
};

export type ProjectDocument = {
  id: string;
  projectId: string;
  filename: string;
  size?: number;
  status?: "pending" | "processing" | "ready" | "failed" | string;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
  extractedText?: string;
};

type ProjectsModule = {
  listProjects?: (opts?: { userId?: string }) => Promise<ProjectSummary[]>;
  getProject?: (id: string) => Promise<ProjectSummary | null>;
  createProject?: (input: {
    name: string;
    slug?: string;
    userId?: string;
  }) => Promise<ProjectSummary>;
  listProjectDocuments?: (projectId: string) => Promise<ProjectDocument[]>;
  getProjectDocument?: (
    projectId: string,
    documentId: string,
  ) => Promise<ProjectDocument | null>;
  deleteProjectDocument?: (
    projectId: string,
    documentId: string,
  ) => Promise<void>;
};

export function loadProjects(): LoadResult<ProjectsModule> {
  if (!supabaseConfigured()) {
    return { ok: false, reason: SUPABASE_PLACEHOLDER_MESSAGE };
  }
  return tryRequire<ProjectsModule>("./projects");
}

// ---- 5B-RAG --------------------------------------------------------------

export type ProjectChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ProjectChatCitation = {
  id: string;
  documentId?: string;
  filename?: string;
  excerpt?: string;
  url?: string;
};

type ChatStreamEvent =
  | { type: "text"; delta: string }
  | { type: "citations"; items: ProjectChatCitation[] }
  | { type: "error"; message: string };

type ChatModule = {
  chatWithProject?: (input: {
    projectId: string;
    message: string;
    history?: ProjectChatTurn[];
  }) => AsyncIterable<ChatStreamEvent>;
};

export function loadChat(): LoadResult<ChatModule> {
  if (!supabaseConfigured()) {
    return { ok: false, reason: SUPABASE_PLACEHOLDER_MESSAGE };
  }
  return tryRequire<ChatModule>("./chat-with-project");
}

// ---- 5A-MCP jurisdiction rules ------------------------------------------

export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
};

export type JurisdictionRules = {
  submittal_checklist?: ChecklistItem[];
  plat_requirements?: ChecklistItem[];
  [key: string]: unknown;
};

type RulesModule = {
  getJurisdictionRules?: (slug: string) => Promise<JurisdictionRules | null>;
};

export function loadRules(): LoadResult<RulesModule> {
  const a = tryRequire<RulesModule>("./jurisdiction-rules");
  if (a.ok) return a;
  return tryRequire<RulesModule>("../../mcp-server/src/jurisdictions");
}
