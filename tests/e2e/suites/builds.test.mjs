/**
 * builds.test.mjs
 *
 * Asserts `pnpm -r --if-present build` exits 0 across all workspaces.
 *
 * In the standard run-e2e.mjs flow we already build web + mcp-server before
 * starting the server, so this suite is mostly a belt-and-suspenders check
 * that picks up new workspaces. If --skip-build was passed we still run this
 * to validate the full repo can compile.
 *
 * Why this suite exists:
 *   Catches a workspace that was added without `build` wired up, or one
 *   whose tsconfig was broken by a refactor.
 */

import { spawn } from "node:child_process";
import { createRunner } from "./_lib.mjs";

function runCmd(cmd, args, cwd, timeoutMs = 5 * 60_000) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1" },
    });
    const out = [];
    const err = [];
    child.stdout.on("data", (d) => out.push(d.toString()));
    child.stderr.on("data", (d) => err.push(d.toString()));
    const timer = setTimeout(() => {
      try {
        child.kill("SIGTERM");
      } catch {
        // ignore
      }
    }, timeoutMs);
    child.on("exit", (code, signal) => {
      clearTimeout(timer);
      resolve({
        code: code ?? -1,
        signal,
        stdout: out.join(""),
        stderr: err.join(""),
      });
    });
  });
}

export async function run(ctx) {
  const r = createRunner("builds");

  await r.test("pnpm -r --if-present build exits 0", async () => {
    const res = await runCmd("pnpm", ["-r", "--if-present", "build"], ctx.repoRoot);
    if (res.code !== 0) {
      const tail = (res.stderr || res.stdout).split("\n").slice(-30).join("\n");
      throw new Error(`pnpm build failed (code=${res.code} signal=${res.signal})\n${tail}`);
    }
  });

  return r.finish();
}
