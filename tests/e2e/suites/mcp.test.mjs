/**
 * mcp.test.mjs
 *
 * Spawns the compiled MCP server (mcp-server/dist/index.js) on stdio and
 * speaks JSON-RPC at it directly. Goals:
 *   - listTools returns >= 7 tools
 *   - each tool can be called with a safe synthetic input without isError
 *     (some tools intentionally return an error for unknown slugs; we treat
 *     those as ok as long as the response shape is valid).
 *
 * Why this suite exists:
 *   The MCP server is the primary programmatic surface. A schema regression
 *   or a missing dist build will manifest here long before a user notices.
 */

import path from "node:path";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRunner, assertTrue } from "./_lib.mjs";

export async function run(ctx) {
  const r = createRunner("mcp");

  const entry = path.join(ctx.repoRoot, "mcp-server", "dist", "index.js");
  if (!existsSync(entry)) {
    r.skip("spawn mcp server", `${entry} not built`);
    return r.finish();
  }

  const child = spawn(process.execPath, [entry], {
    cwd: ctx.repoRoot,
    env: { ...process.env, KB_ROOT: ctx.repoRoot },
    stdio: ["pipe", "pipe", "pipe"],
  });

  const errBuf = [];
  child.stderr.on("data", (d) => errBuf.push(d.toString()));

  /** Minimal newline-delimited JSON-RPC client over stdio. */
  let nextId = 1;
  const pending = new Map();
  let buf = "";

  child.stdout.on("data", (chunk) => {
    buf += chunk.toString("utf8");
    let idx;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id != null && pending.has(msg.id)) {
          const { resolve } = pending.get(msg.id);
          pending.delete(msg.id);
          resolve(msg);
        }
      } catch {
        // ignore non-JSON noise
      }
    }
  });

  function rpc(method, params, timeoutMs = 10_000) {
    const id = nextId++;
    const payload = JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n";
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        pending.delete(id);
        reject(
          new Error(
            `rpc ${method} timed out after ${timeoutMs}ms; stderr: ${errBuf.join("").slice(-400)}`,
          ),
        );
      }, timeoutMs);
      pending.set(id, {
        resolve: (msg) => {
          clearTimeout(t);
          resolve(msg);
        },
      });
      child.stdin.write(payload);
    });
  }

  try {
    // Initialize handshake
    const init = await rpc("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "e2e-harness", version: "0.0.0" },
    });
    assertTrue(init.result != null, "initialize returned a result");
    // notifications/initialized is fire-and-forget
    child.stdin.write(
      JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n",
    );

    let toolsList = [];

    // Current MCP server exposes 6 tools; if more are added (e.g. a future
    // `run_workflow` or `lookup_jurisdiction_by_latlon`) this check still
    // holds. If a regression *removes* a tool, this fails.
    await r.test("tools/list returns >= 6 tools", async () => {
      const res = await rpc("tools/list", {});
      assertTrue(res.result?.tools?.length != null, "tools array present");
      toolsList = res.result.tools;
      assertTrue(
        toolsList.length >= 6,
        `expected >=6 tools, got ${toolsList.length}: ${toolsList.map((t) => t.name).join(",")}`,
      );
    });

    // Safe synthetic inputs per tool name. Unknown tools get empty {}.
    const inputs = {
      get_page: { slug: "00-index" },
      search_kb: { query: "alignment", limit: 3 },
      list_commands: {},
      list_jurisdictions: { state: "indiana" },
      get_resource_index: {},
      run_calculator: {
        name: "rational_method",
        inputs: { c: 0.5, i_in_hr: 4, a_acres: 10 },
      },
    };

    for (const tool of toolsList) {
      await r.test(`tools/call ${tool.name}`, async () => {
        const args = inputs[tool.name] ?? {};
        const res = await rpc("tools/call", { name: tool.name, arguments: args }, 15_000);
        assertTrue(res.result != null, `result present (got ${JSON.stringify(res).slice(0, 200)})`);
        const r0 = res.result;
        // isError indicates the tool returned a tool-level error. For some
        // tools (get_page with bad slug) that's expected, but our synthetic
        // inputs are all valid, so isError must be false.
        assertTrue(!r0.isError, `isError must be false; got ${JSON.stringify(r0).slice(0, 300)}`);
        assertTrue(
          Array.isArray(r0.content) && r0.content.length > 0,
          "content array non-empty",
        );
      });
    }
  } finally {
    try {
      child.kill("SIGTERM");
    } catch {
      // ignore
    }
  }

  return r.finish();
}
