/**
 * Analytics receiver endpoint.
 *
 * Accepts a JSON array of events from the client analytics module.
 * Validation:
 *   - Max 100 events per request.
 *   - Max 2 KB serialized per individual event.
 *
 * Storage:
 *   - Always appends to NDJSON file (default web/.analytics/events.ndjson,
 *     override with ANALYTICS_LOG_PATH env). Note: serverless filesystems are
 *     ephemeral, so the file is best-effort.
 *   - If SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set, also POST to the
 *     `analytics_events` table via PostgREST. If neither is set we log a
 *     one-time warning telling operators that events are being written to
 *     ephemeral disk only.
 *
 * Rate limiting: handled by the global /api/* middleware (Agent 5).
 */
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_EVENTS = 100;
const MAX_EVENT_BYTES = 2 * 1024;

let warnedAboutEphemeral = false;

interface IncomingEvent {
  ts?: unknown;
  sessionId?: unknown;
  event?: unknown;
  props?: unknown;
}

function isValidEvent(e: unknown): e is {
  ts: string;
  sessionId: string;
  event: string;
  props: Record<string, string | number | boolean>;
} {
  if (!e || typeof e !== "object") return false;
  const obj = e as IncomingEvent;
  if (typeof obj.ts !== "string") return false;
  if (typeof obj.sessionId !== "string") return false;
  if (typeof obj.event !== "string" || obj.event.length === 0) return false;
  if (obj.props !== undefined) {
    if (!obj.props || typeof obj.props !== "object" || Array.isArray(obj.props)) {
      return false;
    }
    for (const [, v] of Object.entries(obj.props as Record<string, unknown>)) {
      const t = typeof v;
      if (t !== "string" && t !== "number" && t !== "boolean") return false;
    }
  }
  return true;
}

function getLogPath(): string {
  const fromEnv = process.env.ANALYTICS_LOG_PATH;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return path.join(process.cwd(), ".analytics", "events.ndjson");
}

async function appendToNdjson(events: object[]): Promise<void> {
  const filePath = getLogPath();
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
    const lines = events.map((e) => JSON.stringify(e)).join("\n") + "\n";
    await fs.appendFile(filePath, lines, "utf8");
  } catch (err) {
    // Best-effort. Do not fail the request because disk is read-only.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] disk append failed:", err);
    }
  }
}

async function pushToSupabase(events: object[]): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    if (!warnedAboutEphemeral) {
      warnedAboutEphemeral = true;
      console.warn(
        "[analytics] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set; events written to ephemeral disk only.",
      );
    }
    return;
  }
  try {
    await fetch(`${url.replace(/\/$/, "")}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(events),
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] supabase push failed:", err);
    }
  }
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!Array.isArray(payload)) {
    return NextResponse.json({ error: "expected_array" }, { status: 400 });
  }
  if (payload.length === 0) {
    return new Response(null, { status: 204 });
  }
  if (payload.length > MAX_EVENTS) {
    return NextResponse.json(
      { error: "too_many_events", limit: MAX_EVENTS },
      { status: 413 },
    );
  }

  const accepted: object[] = [];
  for (const e of payload) {
    if (!isValidEvent(e)) continue;
    const serialized = JSON.stringify(e);
    if (Buffer.byteLength(serialized, "utf8") > MAX_EVENT_BYTES) continue;
    accepted.push(e);
  }

  if (accepted.length === 0) {
    return new Response(null, { status: 204 });
  }

  await appendToNdjson(accepted);
  await pushToSupabase(accepted);

  return new Response(null, { status: 204 });
}
