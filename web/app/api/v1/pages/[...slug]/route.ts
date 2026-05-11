import type { NextRequest } from "next/server";
import { getPageBySlug } from "@/lib/content";
import { jsonResponse, errorResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const g = guard(req);
  if (!g.ok) return g.response;

  // Defensive path sanitization: refuse anything that would let a caller
  // climb out of content/. We rely on getPageBySlug for the lookup, which
  // also constrains within CONTENT_ROOT, but it's cheap to reject obvious
  // traversal up-front.
  const segments = (params.slug ?? []).map((s) => decodeURIComponent(s));
  if (segments.some((s) => s.includes("..") || s.startsWith("/") || s.includes("\0"))) {
    return errorResponse("invalid_input", "Invalid slug path", 400, g.headers);
  }

  const page = getPageBySlug(segments);
  if (!page) {
    return errorResponse("not_found", `Page not found: ${segments.join("/")}`, 404, g.headers);
  }
  // Public API never exposes invite-gated content.
  if ((page.frontmatter as Record<string, unknown>)["visibility"] === "invite") {
    return errorResponse("not_found", "Page not available via public API", 404, g.headers);
  }

  return jsonResponse(
    {
      slug: page.slug,
      href: page.href,
      title: (page.frontmatter as Record<string, unknown>)["title"] ?? page.slug,
      section: (page.frontmatter as Record<string, unknown>)["section"] ?? null,
      frontmatter: page.frontmatter,
      body: page.body,
    },
    { extraHeaders: g.headers },
  );
}
