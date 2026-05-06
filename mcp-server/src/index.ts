#!/usr/bin/env node
/**
 * Entrypoint for the Civil 3D Master Guide MCP server.
 *
 * Speaks MCP over stdio. Resolves the knowledge-base root from the KB_ROOT
 * environment variable, then by walking up from process.cwd(), then from the
 * directory of this binary. The repo's `content/` directory must be locatable
 * from one of those starting points.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // The transport keeps the process alive; nothing else to do here.
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[civil3d-master-guide-mcp] fatal:", err);
  process.exit(1);
});
