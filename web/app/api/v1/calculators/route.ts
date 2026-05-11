import type { NextRequest } from "next/server";
import { listCalculators } from "@/lib/api/calculators";
import { jsonResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const items = listCalculators().map((c) => ({
    name: c.name,
    slug: c.slug,
    title: c.title,
    description: c.description,
    href: `/api/v1/calculators/${c.name}`,
    inputSchema: c.inputSchema,
  }));
  return jsonResponse({ count: items.length, items }, { extraHeaders: g.headers });
}
