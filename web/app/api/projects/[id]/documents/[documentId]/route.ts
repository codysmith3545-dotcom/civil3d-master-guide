import { NextResponse } from "next/server";
import { hasValidInvite } from "@/lib/access";
import {
  loadProjects,
  supabaseConfigured,
  SUPABASE_PLACEHOLDER_MESSAGE,
} from "@/lib/project-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; documentId: string } },
) {
  if (!(await hasValidInvite())) return jsonError(401, "Invite required.");
  if (!supabaseConfigured())
    return jsonError(503, SUPABASE_PLACEHOLDER_MESSAGE);

  const loaded = loadProjects();
  if (!loaded.ok) return jsonError(503, loaded.reason);
  if (!loaded.mod.deleteProjectDocument) {
    return jsonError(503, "deleteProjectDocument is not implemented yet.");
  }
  try {
    await loaded.mod.deleteProjectDocument(params.id, params.documentId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return jsonError(
      500,
      err instanceof Error ? err.message : "Failed to delete document.",
    );
  }
}
