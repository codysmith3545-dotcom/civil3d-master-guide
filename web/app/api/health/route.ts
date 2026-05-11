import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe used by the e2e harness and any uptime monitor.
 *
 * Returns a small JSON document. Never reads disk or external services so a
 * 200 here means "the process is up and serving requests"; it does not imply
 * that downstream resources (KB, search index) loaded successfully.
 */
export async function GET(_req: NextRequest) {
  const version =
    process.env.GIT_COMMIT_SHA ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.npm_package_version ??
    "0.1.0";
  return Response.json(
    {
      ok: true,
      ts: new Date().toISOString(),
      version,
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
