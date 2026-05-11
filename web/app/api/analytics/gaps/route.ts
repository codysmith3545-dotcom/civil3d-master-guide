/**
 * Content gap analysis endpoint.
 *
 * GET returns the top 20 zero-result search queries from the last 30 days,
 * grouped by normalized query text (lowercased, trimmed, whitespace-collapsed).
 *
 * Auth: requires Authorization: Bearer <ANALYTICS_GAPS_TOKEN>.
 *       If the env var is unset, returns 503 (the endpoint is intentionally
 *       inert until an operator opts in).
 */
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

interface Gap {
  query: string;
  count: number;
  lastSeen: string;
}

interface AnalyticsRecord {
  ts: string;
  event: string;
  props?: Record<string, unknown>;
}

function getLogPath(): string {
  const fromEnv = process.env.ANALYTICS_LOG_PATH;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return path.join(process.cwd(), ".analytics", "events.ndjson");
}

function normalize(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

async function readEvents(filePath: string): Promise<AnalyticsRecord[]> {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return [];
  }
  const out: AnalyticsRecord[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as AnalyticsRecord;
      if (parsed && typeof parsed.event === "string") out.push(parsed);
    } catch {
      // skip malformed lines
    }
  }
  return out;
}

export async function GET(request: Request): Promise<Response> {
  const expected = process.env.ANALYTICS_GAPS_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "unconfigured", message: "ANALYTICS_GAPS_TOKEN is not set." },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization") ?? "";
  const provided = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const events = await readEvents(getLogPath());
  const cutoff = Date.now() - WINDOW_MS;

  const buckets = new Map<string, { count: number; lastSeen: string }>();
  for (const e of events) {
    if (e.event !== "search") continue;
    if (!e.props) continue;
    const rc = e.props.resultCount;
    if (typeof rc !== "number" || rc !== 0) continue;
    const q = e.props.query;
    if (typeof q !== "string" || q.trim().length === 0) continue;

    const ts = Date.parse(e.ts);
    if (!Number.isFinite(ts) || ts < cutoff) continue;

    const key = normalize(q);
    const prev = buckets.get(key);
    if (!prev) {
      buckets.set(key, { count: 1, lastSeen: e.ts });
    } else {
      prev.count += 1;
      if (Date.parse(e.ts) > Date.parse(prev.lastSeen)) prev.lastSeen = e.ts;
    }
  }

  const gaps: Gap[] = Array.from(buckets.entries())
    .map(([query, v]) => ({ query, count: v.count, lastSeen: v.lastSeen }))
    .sort((a, b) => b.count - a.count || (a.query < b.query ? -1 : 1))
    .slice(0, 20);

  return NextResponse.json({ gaps });
}
