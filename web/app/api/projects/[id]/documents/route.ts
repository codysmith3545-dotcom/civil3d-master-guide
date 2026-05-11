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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await hasValidInvite())) return jsonError(401, "Invite required.");
  if (!supabaseConfigured())
    return jsonError(503, SUPABASE_PLACEHOLDER_MESSAGE);

  const loaded = loadProjects();
  if (!loaded.ok) return jsonError(503, loaded.reason);
  if (!loaded.mod.listProjectDocuments) {
    return jsonError(503, "listProjectDocuments is not implemented yet.");
  }
  try {
    const items = await loaded.mod.listProjectDocuments(params.id);
    return NextResponse.json({ items });
  } catch (err) {
    return jsonError(
      500,
      err instanceof Error ? err.message : "Failed to list documents.",
    );
  }
}
