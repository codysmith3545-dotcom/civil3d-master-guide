import { NextRequest, NextResponse } from "next/server";
import { hasValidInvite } from "@/lib/access";
import {
  loadProjects,
  supabaseConfigured,
  SUPABASE_PLACEHOLDER_MESSAGE,
} from "@/lib/project-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, message: string) {
  return new NextResponse(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function guard(): Promise<NextResponse | null> {
  if (!(await hasValidInvite())) {
    return jsonError(401, "Invite required.");
  }
  if (!supabaseConfigured()) {
    return jsonError(503, SUPABASE_PLACEHOLDER_MESSAGE);
  }
  return null;
}

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;

  const loaded = loadProjects();
  if (!loaded.ok) return jsonError(503, loaded.reason);
  if (!loaded.mod.listProjects) {
    return jsonError(503, "listProjects is not implemented yet.");
  }

  try {
    const items = await loaded.mod.listProjects();
    return NextResponse.json({ items });
  } catch (err) {
    return jsonError(
      500,
      err instanceof Error ? err.message : "Failed to list projects.",
    );
  }
}

export async function POST(req: NextRequest) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: { name?: unknown; slug?: unknown };
  try {
    body = (await req.json()) as { name?: unknown; slug?: unknown };
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug =
    typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : undefined;
  if (!name) return jsonError(400, "name is required.");

  const loaded = loadProjects();
  if (!loaded.ok) return jsonError(503, loaded.reason);
  if (!loaded.mod.createProject) {
    return jsonError(503, "createProject is not implemented yet.");
  }

  try {
    const created = await loaded.mod.createProject({ name, slug });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return jsonError(
      500,
      err instanceof Error ? err.message : "Failed to create project.",
    );
  }
}
