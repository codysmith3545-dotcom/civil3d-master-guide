/**
 * HTTP/SSE transport for the Civil 3D Master Guide MCP server.
 *
 * Uses Node's built-in `http` module (no Express dependency) and the
 * `SSEServerTransport` shipped with `@modelcontextprotocol/sdk`.
 *
 * Routes:
 *   GET  /sse       — opens an SSE stream and connects the MCP server
 *   POST /messages  — receives JSON-RPC messages from the client
 *   GET  /health    — returns server health JSON (no auth required)
 *
 * Auth:
 *   If MCP_BEARER_TOKEN is set in the environment, /sse and /messages
 *   require an `Authorization: Bearer <token>` header. /health is always open.
 *
 * CORS:
 *   Allow-Origin defaults to "*" but can be overridden via MCP_CORS_ORIGIN.
 */

import * as http from "node:http";
import { URL } from "node:url";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { loadAllPages, resolveKbRoot } from "./content.js";

export interface HttpTransportOptions {
  port: number;
  host?: string;
  serverFactory: () => Server;
  version: string;
}

interface SessionEntry {
  transport: SSEServerTransport;
  server: Server;
}

const startedAt = Date.now();

function corsHeaders(): Record<string, string> {
  const origin = process.env.MCP_CORS_ORIGIN ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, mcp-session-id",
    "Access-Control-Expose-Headers": "mcp-session-id",
  };
}

function applyCors(res: http.ServerResponse): void {
  for (const [k, v] of Object.entries(corsHeaders())) {
    res.setHeader(k, v);
  }
}

function isAuthorized(req: http.IncomingMessage): boolean {
  const token = process.env.MCP_BEARER_TOKEN;
  if (!token || token.length === 0) return true;
  const auth = req.headers["authorization"];
  if (!auth || Array.isArray(auth)) return false;
  const expected = `Bearer ${token}`;
  // Constant-ish-time compare for short strings; not a substitute for crypto-grade compare.
  if (auth.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < auth.length; i++) {
    mismatch |= auth.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  applyCors(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export async function startHttpTransport(opts: HttpTransportOptions): Promise<http.Server> {
  const { port, host = "0.0.0.0", serverFactory, version } = opts;

  // Map sessionId -> session. SSEServerTransport allocates a session id per
  // connection; the client posts to /messages?sessionId=... to route messages.
  const sessions = new Map<string, SessionEntry>();

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const pathname = url.pathname;

    // CORS preflight.
    if (req.method === "OPTIONS") {
      applyCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }

    // ---- /health (no auth) ----
    if (pathname === "/health" && req.method === "GET") {
      let pageCount: number | null = null;
      try {
        const root = await resolveKbRoot();
        const pages = await loadAllPages(root);
        pageCount = pages.length;
      } catch {
        pageCount = null;
      }
      sendJson(res, 200, {
        status: "ok",
        version,
        pageCount,
        uptime: Math.round((Date.now() - startedAt) / 1000),
        sessions: sessions.size,
      });
      return;
    }

    // ---- bearer auth on /sse and /messages ----
    if ((pathname === "/sse" || pathname === "/messages") && !isAuthorized(req)) {
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }

    // ---- GET /sse ----
    if (pathname === "/sse" && req.method === "GET") {
      applyCors(res);
      const transport = new SSEServerTransport("/messages", res);
      const server = serverFactory();
      try {
        await server.connect(transport);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[civil3d-master-guide-mcp] SSE connect error:", err);
        try {
          res.end();
        } catch {
          /* ignore */
        }
        return;
      }
      const sid = transport.sessionId;
      sessions.set(sid, { transport, server });
      transport.onclose = () => {
        sessions.delete(sid);
      };
      // SSEServerTransport.start() (called via server.connect) keeps the response open.
      return;
    }

    // ---- POST /messages?sessionId=... ----
    if (pathname === "/messages" && req.method === "POST") {
      const sid = url.searchParams.get("sessionId");
      if (!sid) {
        sendJson(res, 400, { error: "missing sessionId query parameter" });
        return;
      }
      const entry = sessions.get(sid);
      if (!entry) {
        sendJson(res, 404, { error: "no such session" });
        return;
      }
      applyCors(res);
      try {
        await entry.transport.handlePostMessage(req, res);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[civil3d-master-guide-mcp] /messages error:", err);
        if (!res.headersSent) {
          sendJson(res, 500, { error: "internal error" });
        }
      }
      return;
    }

    // ---- 404 ----
    sendJson(res, 404, { error: "not found", path: pathname });
  });

  await new Promise<void>((resolve) => {
    httpServer.listen(port, host, () => resolve());
  });

  return httpServer;
}
