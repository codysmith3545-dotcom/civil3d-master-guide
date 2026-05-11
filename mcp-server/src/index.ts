#!/usr/bin/env node
/**
 * Entrypoint for the Civil 3D Master Guide MCP server.
 *
 * Supports two transports:
 *   - stdio (default): the server reads JSON-RPC from stdin and writes to stdout.
 *   - http:           a Node http server exposes /sse, /messages, and /health.
 *
 * CLI:
 *   --transport stdio          (default)
 *   --transport http --port N  (default port 3100)
 *
 * Environment:
 *   KB_ROOT             path to the repo root (containing content/)
 *   MCP_BEARER_TOKEN    if set, /sse and /messages require this token
 *   MCP_CORS_ORIGIN     CORS Allow-Origin (default *)
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, SERVER_VERSION } from "./server.js";
import { startHttpTransport } from "./http-transport.js";

interface CliArgs {
  transport: "stdio" | "http";
  port: number;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = { transport: "stdio", port: 3100 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--transport") {
      const v = argv[++i];
      if (v === "stdio" || v === "http") {
        out.transport = v;
      } else {
        throw new Error(`Unknown transport: ${v}. Use 'stdio' or 'http'.`);
      }
    } else if (a === "--port") {
      const v = argv[++i];
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0 || n > 65535) {
        throw new Error(`Invalid --port: ${v}`);
      }
      out.port = n;
    } else if (a === "--help" || a === "-h") {
      process.stderr.write(
        "civil3d-master-guide-mcp [--transport stdio|http] [--port N]\n",
      );
      process.exit(0);
    }
  }
  return out;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.transport === "stdio") {
    process.stderr.write(
      `[civil3d-master-guide-mcp] starting (transport=stdio, version=${SERVER_VERSION})\n`,
    );
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    return;
  }

  // HTTP/SSE transport: each connection gets a fresh Server instance so
  // session state is isolated.
  const authNote = process.env.MCP_BEARER_TOKEN ? " auth=bearer" : " auth=none";
  process.stderr.write(
    `[civil3d-master-guide-mcp] starting (transport=http, port=${args.port}, version=${SERVER_VERSION}${authNote})\n`,
  );
  await startHttpTransport({
    port: args.port,
    serverFactory: () => createServer(),
    version: SERVER_VERSION,
  });
  process.stderr.write(
    `[civil3d-master-guide-mcp] listening on :${args.port} (GET /sse, POST /messages, GET /health)\n`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[civil3d-master-guide-mcp] fatal:", err);
  process.exit(1);
});
