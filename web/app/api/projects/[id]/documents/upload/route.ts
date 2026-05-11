import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { INVITE_COOKIE } from "@/lib/access";
import { verifyToken } from "@/lib/invites";
import {
  PROJECT_DOC_ACCEPTED_MIME,
  PROJECT_DOC_MAX_BYTES,
  getServerAnthropicKey,
} from "@/lib/config";
import { processDocument } from "@/lib/project-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * POST /api/projects/[id]/documents/upload
 *
 * Multipart/form-data body. Required field: `file` (single).
 *
 * Auth: requires a valid `kb_invite` cookie (the JWT's `sub` is treated as
 * the userId). The project's `owner_user_id` must match.
 *
 * Errors:
 *   401 — no/invalid invite token
 *   403 — caller is not the project owner
 *   404 — project not found
 *   413 — file too large
 *   415 — unsupported MIME type
 *   429 — daily vision budget exhausted
 *   502 — vision API failure
 *   503 — project storage (Supabase) not configured
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // --- Auth ---------------------------------------------------------------
  const jar = cookies();
  const token = jar.get(INVITE_COOKIE)?.value;
  if (!token) {
    return jsonError(401, "no_auth", "Invite token missing.");
  }
  const invite = await verifyToken(token);
  if (!invite) {
    return jsonError(401, "no_auth", "Invalid or expired invite token.");
  }
  const userId = invite.sub;

  // --- Multipart parse ----------------------------------------------------
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError(400, "bad_request", "Expected multipart/form-data body.");
  }
  const fileEntry = form.get("file");
  if (!(fileEntry instanceof File)) {
    return jsonError(400, "bad_request", "Missing 'file' field.");
  }

  // Pre-flight checks before reading bytes into memory.
  if (fileEntry.size > PROJECT_DOC_MAX_BYTES) {
    return jsonError(
      413,
      "file_too_large",
      `File exceeds ${PROJECT_DOC_MAX_BYTES} bytes.`,
    );
  }
  const mime = fileEntry.type || "application/octet-stream";
  if (!PROJECT_DOC_ACCEPTED_MIME.has(mime)) {
    return jsonError(415, "unsupported_mime", `Unsupported MIME type: ${mime}`);
  }

  const arrayBuf = await fileEntry.arrayBuffer();
  const bytes = Buffer.from(arrayBuf);

  // --- API key (BYOK for vision; operator fallback if configured) --------
  const headerKey = req.headers.get("x-anthropic-api-key");
  const apiKey = headerKey || getServerAnthropicKey() || "";

  // --- Process ------------------------------------------------------------
  const outcome = await processDocument({
    bytes,
    mime,
    filename: fileEntry.name || "upload",
    projectId: params.id,
    userId,
    apiKey,
  });

  if (!outcome.ok) {
    return jsonError(outcome.error.status, outcome.error.code, outcome.error.message);
  }

  return NextResponse.json({
    documentId: outcome.result.documentId,
    chunkCount: outcome.result.chunkCount,
    status: outcome.result.status,
    sha256: outcome.result.sha256,
    reused: outcome.result.reused ?? false,
  });
}
