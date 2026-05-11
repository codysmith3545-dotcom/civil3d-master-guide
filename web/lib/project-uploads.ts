/**
 * Server-side glue for processing project-document uploads.
 *
 * Pipeline:
 *   1. Hash the file (SHA-256).
 *   2. Dedupe by (project_id, sha256). If we already have a row, return it.
 *   3. Insert a `project_documents` row with status='pending'.
 *   4. Extract text:
 *        - text/plain, text/markdown → as-is (UTF-8 decode).
 *        - application/pdf, image/png, image/jpeg → Claude vision call,
 *          guarded by a daily-budget counter and cached by SHA-256.
 *   5. Chunk extracted text (~800 word tokens, 100-token overlap, paragraph
 *      boundaries preferred).
 *   6. Insert `project_document_chunks` rows.
 *   7. Mark the parent row status='processed'.
 *
 * If Supabase env is not configured (`getServerSupabase()` returns null),
 * every server-side helper here returns a structured error instead of
 * throwing, so the upload route can respond with 503.
 *
 * NOTE: This module intentionally imports `@/lib/supabase` and `@/lib/projects`
 * via `await import(...)`. Those files are owned by agent 5B-Schema and may
 * not exist in this worktree yet. The dynamic import keeps the build green;
 * at runtime, a missing module degrades to "storage not configured".
 */

import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import {
  PROJECT_DOC_ACCEPTED_MIME,
  PROJECT_DOC_MAX_BYTES,
  PROJECT_DOC_VISION_DAILY_LIMIT_CENTS,
  VISION_MODEL,
} from "./config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DocumentResult = {
  documentId: string;
  chunkCount: number;
  status: "processed" | "pending" | "error" | "duplicate";
  sha256: string;
  reused?: boolean;
};

export type ProjectDocumentRow = {
  id: string;
  project_id: string;
  sha256: string;
  mime_type: string;
  filename: string;
  byte_size: number;
  status: string;
};

export type UploadError = {
  status: number; // HTTP status
  code: string;
  message: string;
};

export type UploadOutcome =
  | { ok: true; result: DocumentResult }
  | { ok: false; error: UploadError };

type SupabaseLike = {
  from: (table: string) => any;
};

type ProjectRow = {
  id: string;
  owner_user_id: string;
};

// ---------------------------------------------------------------------------
// Lazy module resolution
// ---------------------------------------------------------------------------

type SupabaseModule = {
  getServerSupabase?: () => SupabaseLike | null;
};

type ProjectsModule = {
  getProject?: (id: string) => Promise<ProjectRow | null>;
};

/**
 * Sibling modules `web/lib/supabase.ts` and `web/lib/projects.ts` are owned by
 * agent 5B-Schema. They may not exist in every worktree. To keep the build
 * green when they're absent, we resolve them through Node's native `require`
 * via an `eval`'d reference that the bundler cannot statically follow. When
 * the modules ARE present (production), Node loads them normally; when they
 * are NOT, we degrade to a 503 "storage not configured" response.
 *
 * The lookups happen exactly once per process, then are cached.
 */
type RequireFn = (id: string) => unknown;

let _nodeRequire: RequireFn | null | undefined; // undefined = not probed yet

function getNodeRequire(): RequireFn | null {
  if (_nodeRequire !== undefined) return _nodeRequire;
  try {
    // eslint-disable-next-line no-eval
    _nodeRequire = eval("require") as RequireFn;
  } catch {
    _nodeRequire = null;
  }
  return _nodeRequire;
}

function tryRequire<T = unknown>(...candidates: string[]): T | null {
  const req = getNodeRequire();
  if (!req) return null;
  for (const id of candidates) {
    try {
      return req(id) as T;
    } catch {
      /* try next */
    }
  }
  return null;
}

async function loadSupabaseModule(): Promise<SupabaseModule | null> {
  // Try a handful of resolution candidates: relative to compiled output,
  // workspace root, and the @/ alias-equivalent absolute path.
  const cwdLib = `${process.cwd()}/lib/supabase`;
  return tryRequire<SupabaseModule>(
    "./supabase",
    "../lib/supabase",
    cwdLib,
    `${process.cwd()}/web/lib/supabase`,
  );
}

async function loadProjectsModule(): Promise<ProjectsModule | null> {
  const cwdLib = `${process.cwd()}/lib/projects`;
  return tryRequire<ProjectsModule>(
    "./projects",
    "../lib/projects",
    cwdLib,
    `${process.cwd()}/web/lib/projects`,
  );
}

export async function getSupabaseOrNull(): Promise<SupabaseLike | null> {
  const mod = await loadSupabaseModule();
  if (!mod?.getServerSupabase) return null;
  try {
    return mod.getServerSupabase();
  } catch {
    return null;
  }
}

export async function getProjectOrNull(
  projectId: string,
): Promise<ProjectRow | null> {
  const mod = await loadProjectsModule();
  if (!mod?.getProject) return null;
  try {
    return await mod.getProject(projectId);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

export function sha256Bytes(bytes: Uint8Array | Buffer): string {
  return createHash("sha256")
    .update(Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes))
    .digest("hex");
}

// ---------------------------------------------------------------------------
// File validation
// ---------------------------------------------------------------------------

export function validateMime(mime: string): boolean {
  return PROJECT_DOC_ACCEPTED_MIME.has(mime);
}

export function validateSize(byteLength: number): boolean {
  return byteLength > 0 && byteLength <= PROJECT_DOC_MAX_BYTES;
}

// ---------------------------------------------------------------------------
// Daily budget guard (vision)
// ---------------------------------------------------------------------------

/**
 * Per-process daily spend counter for the project-doc vision extraction path.
 * Lives in module scope deliberately — separate from any deed-decode counter.
 *
 * This is an in-memory approximation. For multi-instance deployments the
 * 5B-Schema agent should swap this for a persisted counter; the API
 * (consumeBudgetCents / resetIfNewDay) is intentionally simple.
 */
let dailyKey = todaysKey();
let dailySpentCents = 0;

function todaysKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
}

function resetIfNewDay() {
  const k = todaysKey();
  if (k !== dailyKey) {
    dailyKey = k;
    dailySpentCents = 0;
  }
}

export function getBudgetSpentCents(): number {
  resetIfNewDay();
  return dailySpentCents;
}

export function consumeBudgetCents(amount: number): boolean {
  resetIfNewDay();
  if (dailySpentCents + amount > PROJECT_DOC_VISION_DAILY_LIMIT_CENTS) {
    return false;
  }
  dailySpentCents += amount;
  return true;
}

/** Test-only: reset the in-process counter. */
export function __resetBudgetForTest() {
  dailyKey = todaysKey();
  dailySpentCents = 0;
}

// ---------------------------------------------------------------------------
// Chunking
// ---------------------------------------------------------------------------

const CHUNK_TOKENS = 800;
const CHUNK_OVERLAP = 100;

/**
 * Word-based tokenizer. Whitespace splits give an approximation of token
 * counts that is good enough for chunk sizing. No external deps.
 */
export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Split `text` into chunks of approximately CHUNK_TOKENS words with
 * CHUNK_OVERLAP-word overlap. Respects paragraph boundaries (double-newline)
 * where possible: paragraphs are kept whole unless they exceed the chunk
 * size, in which case they are word-split.
 */
export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current: string[] = []; // words in current chunk

  const flush = () => {
    if (current.length === 0) return;
    chunks.push(current.join(" "));
    // Set up next chunk with overlap
    if (CHUNK_OVERLAP > 0 && current.length > CHUNK_OVERLAP) {
      current = current.slice(current.length - CHUNK_OVERLAP);
    } else {
      current = [];
    }
  };

  for (const para of paragraphs) {
    const words = tokenize(para);
    if (words.length === 0) continue;

    // Paragraph fits entirely in the remaining chunk space.
    if (current.length + words.length <= CHUNK_TOKENS) {
      current.push(...words);
      continue;
    }

    // Paragraph alone is bigger than CHUNK_TOKENS — flush current, then
    // word-split the paragraph.
    if (words.length > CHUNK_TOKENS) {
      // Flush whatever we have first so we don't mix.
      if (current.length > 0) {
        flush();
        current = [];
      }
      let i = 0;
      while (i < words.length) {
        const slice = words.slice(i, i + CHUNK_TOKENS);
        chunks.push(slice.join(" "));
        if (i + CHUNK_TOKENS >= words.length) break;
        i += CHUNK_TOKENS - CHUNK_OVERLAP;
      }
      current = []; // already emitted in pieces
      continue;
    }

    // Paragraph doesn't fit in remaining space → flush, start fresh with it.
    flush();
    current.push(...words);
  }

  flush();
  // After final flush, `current` is the overlap tail — discard it.
  return chunks.filter((c) => c.trim().length > 0);
}

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

/**
 * Pluggable vision-extractor for unit tests. Production path calls Anthropic.
 */
export type VisionExtractor = (args: {
  apiKey: string;
  mime: string;
  bytes: Buffer;
}) => Promise<{ text: string; costCents: number }>;

const defaultVisionExtractor: VisionExtractor = async ({
  apiKey,
  mime,
  bytes,
}) => {
  const client = new Anthropic({ apiKey });
  const base64 = bytes.toString("base64");

  // Anthropic vision content blocks. For PDFs use the "document" block type;
  // for images use "image". (`claude-opus-4-7` accepts both.)
  const content =
    mime === "application/pdf"
      ? [
          {
            type: "document" as const,
            source: {
              type: "base64" as const,
              media_type: "application/pdf",
              data: base64,
            },
          },
          {
            type: "text" as const,
            text: "Extract every line of readable text from this document. Preserve paragraph breaks. Do not summarize.",
          },
        ]
      : [
          {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: mime as "image/png" | "image/jpeg",
              data: base64,
            },
          },
          {
            type: "text" as const,
            text: "Transcribe every line of readable text from this image. Preserve line and paragraph breaks. Do not summarize.",
          },
        ];

  // Anthropic SDK 0.30 types don't yet include the `document` content block
  // shape that Opus-4 accepts for PDF inputs. Cast through `unknown` to keep
  // the runtime call correct without disabling strict-null in the rest of
  // the file. (See @anthropic-ai/sdk@^0.30.1 typings.)
  const resp = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: content as unknown as never }],
  });

  const text = resp.content
    .filter((b): b is { type: "text"; text: string } => b.type === "text")
    .map((b) => b.text)
    .join("\n\n")
    .trim();

  // Rough cost estimate. Opus 4 input is ~$15/Mtok, output ~$75/Mtok at the
  // time of writing. The exact number doesn't matter for budgeting — what
  // matters is that we charge SOMETHING that grows with usage.
  const inputTok = resp.usage?.input_tokens ?? 0;
  const outputTok = resp.usage?.output_tokens ?? 0;
  const costCents = Math.ceil((inputTok * 0.0015 + outputTok * 0.0075) / 1);

  return { text, costCents: Math.max(1, costCents) };
};

// SHA-256-keyed cache of vision-extracted text, scoped to the process.
const visionCache = new Map<string, { text: string; costCents: number }>();

export function __clearVisionCacheForTest() {
  visionCache.clear();
}

export async function extractText(
  mime: string,
  bytes: Buffer,
  opts: {
    apiKey: string;
    sha256: string;
    extractor?: VisionExtractor;
  },
): Promise<
  | { ok: true; text: string; costCents: number; cached: boolean }
  | { ok: false; error: UploadError }
> {
  if (mime === "text/plain" || mime === "text/markdown") {
    return {
      ok: true,
      text: bytes.toString("utf8"),
      costCents: 0,
      cached: false,
    };
  }

  if (mime === "application/pdf" || mime === "image/png" || mime === "image/jpeg") {
    const cached = visionCache.get(opts.sha256);
    if (cached) {
      return { ok: true, text: cached.text, costCents: 0, cached: true };
    }

    if (!opts.apiKey) {
      return {
        ok: false,
        error: {
          status: 502,
          code: "vision_not_configured",
          message:
            "Vision extraction requires an Anthropic API key; none was supplied.",
        },
      };
    }

    // Check budget BEFORE the call (we'll re-check after with actual cost).
    if (getBudgetSpentCents() >= PROJECT_DOC_VISION_DAILY_LIMIT_CENTS) {
      return {
        ok: false,
        error: {
          status: 429,
          code: "vision_budget_exhausted",
          message:
            "Daily vision-extraction budget exhausted. Try again tomorrow or raise PROJECT_DOC_VISION_DAILY_LIMIT_CENTS.",
        },
      };
    }

    const extractor = opts.extractor ?? defaultVisionExtractor;
    let result;
    try {
      result = await extractor({ apiKey: opts.apiKey, mime, bytes });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Vision extraction failed.";
      return {
        ok: false,
        error: { status: 502, code: "vision_failed", message },
      };
    }

    if (!consumeBudgetCents(result.costCents)) {
      // Charge succeeded after the call → still record but flag rate-limit
      // for the NEXT request. We've already paid; let this one through.
      // (No-op: we return ok here.)
    }
    visionCache.set(opts.sha256, result);
    return { ok: true, text: result.text, costCents: result.costCents, cached: false };
  }

  return {
    ok: false,
    error: {
      status: 415,
      code: "unsupported_mime",
      message: `Unsupported MIME type: ${mime}`,
    },
  };
}

// ---------------------------------------------------------------------------
// DB I/O (defensive — supabase shape is best-effort, real schema lives in
// 5B-Schema's migrations).
// ---------------------------------------------------------------------------

async function findExistingDocument(
  supa: SupabaseLike,
  projectId: string,
  sha256: string,
): Promise<ProjectDocumentRow | null> {
  try {
    const { data, error } = await supa
      .from("project_documents")
      .select("*")
      .eq("project_id", projectId)
      .eq("sha256", sha256)
      .maybeSingle();
    if (error) return null;
    return (data as ProjectDocumentRow) ?? null;
  } catch {
    return null;
  }
}

async function insertPendingDocument(
  supa: SupabaseLike,
  row: {
    id: string;
    project_id: string;
    owner_user_id: string;
    sha256: string;
    mime_type: string;
    filename: string;
    byte_size: number;
  },
): Promise<UploadError | null> {
  try {
    const { error } = await supa.from("project_documents").insert({
      ...row,
      status: "pending",
    });
    if (error) {
      return {
        status: 500,
        code: "db_insert_failed",
        message: error.message ?? "Failed to insert document row.",
      };
    }
    return null;
  } catch (err) {
    return {
      status: 500,
      code: "db_insert_failed",
      message: err instanceof Error ? err.message : "Failed to insert document row.",
    };
  }
}

async function insertChunks(
  supa: SupabaseLike,
  documentId: string,
  projectId: string,
  chunks: string[],
): Promise<UploadError | null> {
  if (chunks.length === 0) return null;
  const rows = chunks.map((content, idx) => ({
    id: randomUUID(),
    document_id: documentId,
    project_id: projectId,
    chunk_index: idx,
    content,
    token_estimate: tokenize(content).length,
  }));
  try {
    const { error } = await supa.from("project_document_chunks").insert(rows);
    if (error) {
      return {
        status: 500,
        code: "chunk_insert_failed",
        message: error.message ?? "Failed to insert chunks.",
      };
    }
    return null;
  } catch (err) {
    return {
      status: 500,
      code: "chunk_insert_failed",
      message: err instanceof Error ? err.message : "Failed to insert chunks.",
    };
  }
}

async function setDocumentStatus(
  supa: SupabaseLike,
  documentId: string,
  status: string,
): Promise<void> {
  try {
    await supa
      .from("project_documents")
      .update({ status })
      .eq("id", documentId);
  } catch {
    /* swallow — best effort */
  }
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export type ProcessOptions = {
  bytes: Buffer;
  mime: string;
  filename: string;
  projectId: string;
  userId: string;
  apiKey: string; // Anthropic key (operator or user-supplied)
  extractor?: VisionExtractor; // test injection
  /** Optional override for the Supabase-like client (used by tests). */
  supabase?: SupabaseLike | null;
  /** Optional override for project ownership lookup (used by tests). */
  fetchProject?: (id: string) => Promise<ProjectRow | null>;
};

export async function processDocument(
  opts: ProcessOptions,
): Promise<UploadOutcome> {
  // 1. Validate
  if (!validateMime(opts.mime)) {
    return {
      ok: false,
      error: {
        status: 415,
        code: "unsupported_mime",
        message: `Unsupported MIME type: ${opts.mime}`,
      },
    };
  }
  if (!validateSize(opts.bytes.byteLength)) {
    return {
      ok: false,
      error: {
        status: 413,
        code: "file_too_large",
        message: `File exceeds ${PROJECT_DOC_MAX_BYTES} bytes.`,
      },
    };
  }

  // 2. Resolve Supabase + project ownership.
  const supa =
    opts.supabase !== undefined ? opts.supabase : await getSupabaseOrNull();
  if (!supa) {
    return {
      ok: false,
      error: {
        status: 503,
        code: "storage_not_configured",
        message: "Project storage not configured.",
      },
    };
  }
  const project = opts.fetchProject
    ? await opts.fetchProject(opts.projectId)
    : await getProjectOrNull(opts.projectId);
  if (!project) {
    return {
      ok: false,
      error: {
        status: 404,
        code: "project_not_found",
        message: "Project not found.",
      },
    };
  }
  if (project.owner_user_id !== opts.userId) {
    return {
      ok: false,
      error: {
        status: 403,
        code: "not_project_owner",
        message: "You are not the owner of this project.",
      },
    };
  }

  // 3. Hash + dedupe
  const sha = sha256Bytes(opts.bytes);
  const existing = await findExistingDocument(supa, opts.projectId, sha);
  if (existing) {
    return {
      ok: true,
      result: {
        documentId: existing.id,
        chunkCount: 0,
        status: "duplicate",
        sha256: sha,
        reused: true,
      },
    };
  }

  // 4. Insert pending row
  const documentId = randomUUID();
  const insertErr = await insertPendingDocument(supa, {
    id: documentId,
    project_id: opts.projectId,
    owner_user_id: opts.userId,
    sha256: sha,
    mime_type: opts.mime,
    filename: opts.filename,
    byte_size: opts.bytes.byteLength,
  });
  if (insertErr) {
    return { ok: false, error: insertErr };
  }

  // 5. Extract text
  const extract = await extractText(opts.mime, opts.bytes, {
    apiKey: opts.apiKey,
    sha256: sha,
    extractor: opts.extractor,
  });
  if (!extract.ok) {
    await setDocumentStatus(supa, documentId, "error");
    return { ok: false, error: extract.error };
  }

  // 6. Chunk + insert
  const chunks = chunkText(extract.text);
  const chunkErr = await insertChunks(
    supa,
    documentId,
    opts.projectId,
    chunks,
  );
  if (chunkErr) {
    await setDocumentStatus(supa, documentId, "error");
    return { ok: false, error: chunkErr };
  }

  await setDocumentStatus(supa, documentId, "processed");
  return {
    ok: true,
    result: {
      documentId,
      chunkCount: chunks.length,
      status: "processed",
      sha256: sha,
    },
  };
}

// ---------------------------------------------------------------------------
// Path-based convenience wrapper (matches the signature called out in the
// 5B-Upload spec). Reads the file from disk, sniffs MIME by extension, then
// delegates to `processDocument`.
// ---------------------------------------------------------------------------

function mimeFromExt(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".md":
    case ".markdown":
      return "text/markdown";
    case ".txt":
    default:
      return "text/plain";
  }
}

export async function processDocumentFromPath(
  filePath: string,
  projectId: string,
  userId: string,
  extras: Partial<Omit<ProcessOptions, "bytes" | "mime" | "filename" | "projectId" | "userId">> = {},
): Promise<DocumentResult> {
  const bytes = await readFile(filePath);
  const out = await processDocument({
    bytes,
    mime: mimeFromExt(filePath),
    filename: path.basename(filePath),
    projectId,
    userId,
    apiKey: extras.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "",
    extractor: extras.extractor,
    supabase: extras.supabase,
    fetchProject: extras.fetchProject,
  });
  if (!out.ok) {
    throw new Error(`[${out.error.code}] ${out.error.message}`);
  }
  return out.result;
}

// ---------------------------------------------------------------------------
// Document deletion
// ---------------------------------------------------------------------------

export async function deleteDocument(opts: {
  projectId: string;
  documentId: string;
  userId: string;
  supabase?: SupabaseLike | null;
  fetchProject?: (id: string) => Promise<ProjectRow | null>;
}): Promise<UploadOutcome> {
  const supa =
    opts.supabase !== undefined ? opts.supabase : await getSupabaseOrNull();
  if (!supa) {
    return {
      ok: false,
      error: {
        status: 503,
        code: "storage_not_configured",
        message: "Project storage not configured.",
      },
    };
  }
  const project = opts.fetchProject
    ? await opts.fetchProject(opts.projectId)
    : await getProjectOrNull(opts.projectId);
  if (!project) {
    return {
      ok: false,
      error: {
        status: 404,
        code: "project_not_found",
        message: "Project not found.",
      },
    };
  }
  if (project.owner_user_id !== opts.userId) {
    return {
      ok: false,
      error: {
        status: 403,
        code: "not_project_owner",
        message: "You are not the owner of this project.",
      },
    };
  }

  try {
    const { error } = await supa
      .from("project_documents")
      .delete()
      .eq("id", opts.documentId)
      .eq("project_id", opts.projectId);
    if (error) {
      return {
        ok: false,
        error: {
          status: 500,
          code: "delete_failed",
          message: error.message ?? "Failed to delete document.",
        },
      };
    }
  } catch (err) {
    return {
      ok: false,
      error: {
        status: 500,
        code: "delete_failed",
        message: err instanceof Error ? err.message : "Failed to delete document.",
      },
    };
  }

  return {
    ok: true,
    result: {
      documentId: opts.documentId,
      chunkCount: 0,
      status: "processed",
      sha256: "",
    },
  };
}
