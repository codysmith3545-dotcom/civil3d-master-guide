import { NextRequest } from "next/server";
import {
  getRawMarkdown,
  getPageBySlug,
  getContentRoot,
} from "@/lib/content";
import { canView } from "@/lib/access";
import { safeResolveContentPath, PathTraversalError } from "@/lib/path-safety";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  // Defence in depth: validate the slug here as well as inside getPageBySlug.
  // If a future caller bypasses the helper, we still won't open arbitrary
  // files under the content root.
  try {
    safeResolveContentPath(params.slug, getContentRoot());
  } catch (err) {
    if (err instanceof PathTraversalError) {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }

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
