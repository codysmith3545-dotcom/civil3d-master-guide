import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { INVITE_COOKIE } from "@/lib/access";
import { verifyToken } from "@/lib/invites";
import { deleteDocument } from "@/lib/project-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * DELETE /api/projects/[id]/documents/[docId]
 *
 * Auth + ownership identical to the upload route. Chunks cascade-delete via
 * the foreign-key relationship defined in 5B-Schema's migration.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; docId: string } },
) {
  const jar = cookies();
  const token = jar.get(INVITE_COOKIE)?.value;
  if (!token) {
    return jsonError(401, "no_auth", "Invite token missing.");
  }
  const invite = await verifyToken(token);
  if (!invite) {
    return jsonError(401, "no_auth", "Invalid or expired invite token.");
  }

  const outcome = await deleteDocument({
    projectId: params.id,
    documentId: params.docId,
    userId: invite.sub,
  });

  if (!outcome.ok) {
    return jsonError(outcome.error.status, outcome.error.code, outcome.error.message);
  }
  return NextResponse.json({ deleted: true, documentId: params.docId });
}
