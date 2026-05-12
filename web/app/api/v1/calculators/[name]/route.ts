import type { NextRequest } from "next/server";
import { findCalculator, ValidationError } from "@/lib/api/calculators";
import { jsonResponse, errorResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const c = findCalculator(decodeURIComponent(params.name));
  if (!c) {
    return errorResponse("not_found", `Calculator not found: ${params.name}`, 404, g.headers);
  }
  return jsonResponse(
    {
      name: c.name,
      slug: c.slug,
      title: c.title,
      description: c.description,
      inputSchema: c.inputSchema,
      invokeWith: {
        method: "POST",
        contentType: "application/json",
        href: `/api/v1/calculators/${c.name}`,
      },
    },
    { extraHeaders: g.headers },
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const g = guard(req);
  if (!g.ok) return g.response;
  const c = findCalculator(decodeURIComponent(params.name));
  if (!c) {
    return errorResponse("not_found", `Calculator not found: ${params.name}`, 404, g.headers);
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid_input", "Body must be valid JSON", 400, g.headers);
  }
  try {
    const result = c.invoke(body);
    return jsonResponse(
      { name: c.name, result },
      { cache: false, extraHeaders: g.headers },
    );
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse("invalid_input", err.message, 400, g.headers);
    }
    const msg = err instanceof Error ? err.message : "Internal error";
    return errorResponse("internal", msg, 500, g.headers);
  }
}
