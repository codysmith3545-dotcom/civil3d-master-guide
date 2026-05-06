import { NextRequest } from "next/server";
import { getRawMarkdown, getPageBySlug } from "@/lib/content";
import { canView } from "@/lib/access";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const page = getPageBySlug(params.slug);
  if (!page) {
    return new Response("Not found", { status: 404 });
  }
  const allowed = await canView(page);
  if (!allowed) {
    return new Response("Invite required", { status: 403 });
  }
  const raw = getRawMarkdown(params.slug);
  if (raw == null) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(raw, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}
