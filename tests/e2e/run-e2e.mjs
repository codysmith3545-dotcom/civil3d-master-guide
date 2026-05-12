#!/usr/bin/env node
/**
 * End-to-end smoke harness for civil3d-master-guide.
 *
 * Responsibilities:
 *   1. (Optionally) install workspace deps and build the web app + MCP server.
 *   2. Start the web app on PORT=3001 and wait for /api/health.
 *   3. Run each suite under suites/ in series, collecting pass/fail counts.
 *   4. Tear down child processes on success, failure, or signal.
 *   5. Print a summary table and exit non-zero on any failure.
 *
 * No third-party deps. Uses node:child_process, node:http, node:fs, node:path
 * only. Designed to run both locally (where a dev server can boot) and in CI
 * (where it MUST boot; any failure to start is a test failure).
 *
 * Usage:
 *   node tests/e2e/run-e2e.mjs                 # full run
 *   node tests/e2e/run-e2e.mjs --dry-run       # print plan only
 *   node tests/e2e/run-e2e.mjs --timeout 600   # override per-suite timeout (seconds)
 *   node tests/e2e/run-e2e.mjs --skip-build    # assume web is prebuilt
 *   node tests/e2e/run-e2e.mjs --skip-install  # skip pnpm install
 */

import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SUITES_DIR = path.join(__dirname, "suites");

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const flags = {
  dryRun: argv.includes("--dry-run"),
  skipBuild: argv.includes("--skip-build"),
  skipInstall: argv.includes("--skip-install"),
  noServer: argv.includes("--no-server"),
  timeoutSec: Number(argvValue("--timeout") ?? "300"),
  port: Number(argvValue("--port") ?? "3001"),
  only: argvValue("--only"), // comma-separated suite names, e.g. "mcp,api"
};

function argvValue(key) {
  const i = argv.indexOf(key);
  if (i < 0 || i + 1 >= argv.length) return null;
  return argv[i + 1];
}

const SUITES = [
  { name: "calculators", file: "calculators.test.mjs", needsServer: false },
  { name: "mcp", file: "mcp.test.mjs", needsServer: false },
  { name: "api", file: "api.test.mjs", needsServer: true },
  { name: "content", file: "content.test.mjs", needsServer: true },
  { name: "builds", file: "builds.test.mjs", needsServer: false },
];

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function log(msg) {
  console.log(`${C.dim}[e2e]${C.reset} ${msg}`);
}
function logSection(msg) {
  console.log(`\n${C.bold}${C.cyan}== ${msg} ==${C.reset}`);
}
function logOk(msg) {
  console.log(`${C.green}[ok]${C.reset} ${msg}`);
}
function logErr(msg) {
  console.log(`${C.red}[err]${C.reset} ${msg}`);
}
function logWarn(msg) {
  console.log(`${C.yellow}[warn]${C.reset} ${msg}`);
}

// ---------------------------------------------------------------------------
// HTTP probe (used to wait for the web server)
// ---------------------------------------------------------------------------

function httpGet(url, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(url, { method: "GET" }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () =>
        resolve({
          status: res.statusCode ?? 0,
          headers: res.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        }),
      );
    });
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`timeout ${timeoutMs}ms ${url}`));
    });
    req.end();
  });
}

async function waitForHealth(port, totalTimeoutMs) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < totalTimeoutMs) {
    try {
      const res = await httpGet(`http://127.0.0.1:${port}/api/health`, 2000);
      if (res.status === 200) return true;
      lastErr = new Error(`status=${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await sleep(1000);
  }
  throw new Error(
    `web server did not become healthy in ${totalTimeoutMs}ms: ${lastErr?.message ?? "unknown"}`,
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Child process helpers
// ---------------------------------------------------------------------------

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd ?? REPO_ROOT,
      env: { ...process.env, ...(opts.env ?? {}) },
      stdio: opts.stdio ?? "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve({ code, signal });
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code} (signal ${signal})`));
    });
  });
}

function spawnBackground(cmd, args, opts = {}) {
  const child = spawn(cmd, args, {
    cwd: opts.cwd ?? REPO_ROOT,
    env: { ...process.env, ...(opts.env ?? {}) },
    stdio: opts.stdio ?? ["ignore", "pipe", "pipe"],
    detached: false,
  });
  if (child.stdout) {
    child.stdout.on("data", (d) => {
      if (opts.tag) process.stdout.write(`${C.dim}[${opts.tag}]${C.reset} ${d}`);
    });
  }
  if (child.stderr) {
    child.stderr.on("data", (d) => {
      if (opts.tag) process.stderr.write(`${C.dim}[${opts.tag}!]${C.reset} ${d}`);
    });
  }
  return child;
}

function killTree(child, signal = "SIGTERM") {
  if (!child || child.killed || child.exitCode != null) return;
  try {
    child.kill(signal);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Plan & dry-run
// ---------------------------------------------------------------------------

function printPlan() {
  logSection("Plan (dry-run)");
  log(`Repo root: ${REPO_ROOT}`);
  log(`Port: ${flags.port}`);
  log(`Timeout per suite: ${flags.timeoutSec}s`);
  log(`Install deps:   ${!flags.skipInstall}`);
  log(`Build web+mcp:  ${!flags.skipBuild}`);
  log(`Start server:   ${!flags.noServer}`);
  log("Steps:");
  let i = 1;
  if (!flags.skipInstall) log(`  ${i++}. pnpm install`);
  if (!flags.skipBuild) log(`  ${i++}. pnpm -F web build`);
  if (!flags.skipBuild) log(`  ${i++}. pnpm -F mcp-server build`);
  if (!flags.noServer) log(`  ${i++}. start web (next start) on PORT=${flags.port}`);
  if (!flags.noServer) log(`  ${i++}. wait for /api/health`);
  for (const s of SUITES) {
    if (flags.only && !flags.only.split(",").includes(s.name)) continue;
    log(`  ${i++}. suite: ${s.name} (${s.file})${s.needsServer ? " [server]" : ""}`);
  }
  log(`  ${i++}. teardown`);
}

// ---------------------------------------------------------------------------
// Suite runner
// ---------------------------------------------------------------------------

async function runSuite(suite, ctx) {
  const file = path.join(SUITES_DIR, suite.file);
  if (!existsSync(file)) {
    return { name: suite.name, ok: false, error: `suite file missing: ${file}`, stats: null };
  }
  const start = Date.now();
  try {
    const mod = await import(pathToFileURL(file).href);
    if (typeof mod.run !== "function") {
      return {
        name: suite.name,
        ok: false,
        error: "suite has no exported run(ctx) function",
        stats: null,
      };
    }
    const stats = await Promise.race([
      mod.run(ctx),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`suite timeout after ${flags.timeoutSec}s`)),
          flags.timeoutSec * 1000,
        ),
      ),
    ]);
    const dur = Date.now() - start;
    return {
      name: suite.name,
      ok: stats.failed === 0,
      stats,
      durationMs: dur,
    };
  } catch (err) {
    const dur = Date.now() - start;
    return {
      name: suite.name,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      stats: null,
      durationMs: dur,
    };
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (flags.dryRun) {
    printPlan();
    process.exit(0);
  }

  let webChild = null;
  const cleanup = () => {
    if (webChild) killTree(webChild);
  };
  process.on("SIGINT", () => {
    logWarn("SIGINT received; shutting down");
    cleanup();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(143);
  });

  try {
    if (!flags.skipInstall) {
      logSection("pnpm install");
      await run("pnpm", ["install", "--frozen-lockfile=false"]);
    } else {
      log("--skip-install: skipping pnpm install");
    }

    if (!flags.skipBuild) {
      logSection("build web");
      await run("pnpm", ["-F", "web", "build"]);
      logSection("build mcp-server");
      await run("pnpm", ["-F", "mcp-server", "build"]);
    } else {
      log("--skip-build: skipping builds");
    }

    const needsServer =
      !flags.noServer &&
      SUITES.some(
        (s) =>
          s.needsServer &&
          (!flags.only || flags.only.split(",").includes(s.name)),
      );

    if (needsServer) {
      logSection(`start web on :${flags.port}`);
      webChild = spawnBackground(
        "pnpm",
        ["-F", "web", "start", "--", "-p", String(flags.port)],
        {
          tag: "web",
          env: {
            PORT: String(flags.port),
            HOSTNAME: "127.0.0.1",
            NEXT_TELEMETRY_DISABLED: "1",
          },
        },
      );
      webChild.on("exit", (code, sig) => {
        if (code !== 0 && code != null) {
          logErr(`web exited unexpectedly code=${code} sig=${sig}`);
        }
      });
      await waitForHealth(flags.port, 60_000);
      logOk(`web healthy on http://127.0.0.1:${flags.port}`);
    }

    const ctx = {
      repoRoot: REPO_ROOT,
      port: flags.port,
      baseUrl: `http://127.0.0.1:${flags.port}`,
      httpGet,
      sleep,
      log,
    };

    const results = [];
    for (const suite of SUITES) {
      if (flags.only && !flags.only.split(",").includes(suite.name)) continue;
      if (suite.needsServer && flags.noServer) {
        results.push({
          name: suite.name,
          ok: false,
          error: "skipped (server disabled)",
          stats: null,
        });
        continue;
      }
      logSection(`suite: ${suite.name}`);
      const r = await runSuite(suite, ctx);
      results.push(r);
      if (r.ok) logOk(`${suite.name}: ${summarize(r)}`);
      else logErr(`${suite.name}: ${summarize(r)}`);
    }

    logSection("summary");
    const table = results.map((r) => ({
      suite: r.name,
      ok: r.ok ? "PASS" : "FAIL",
      passed: r.stats?.passed ?? 0,
      failed: r.stats?.failed ?? 0,
      skipped: r.stats?.skipped ?? 0,
      ms: r.durationMs ?? 0,
      note: r.error ?? "",
    }));
    // eslint-disable-next-line no-console
    console.table(table);

    const totalFailed = results.reduce(
      (acc, r) => acc + ((r.stats?.failed ?? (r.ok ? 0 : 1))),
      0,
    );
    const anyFail = results.some((r) => !r.ok);
    process.exitCode = anyFail || totalFailed > 0 ? 1 : 0;
  } catch (err) {
    logErr(err instanceof Error ? err.stack ?? err.message : String(err));
    process.exitCode = 2;
  } finally {
    cleanup();
    // give the child a moment to flush stdout
    await sleep(200);
  }
}

function summarize(r) {
  if (r.error) return `error: ${r.error}`;
  if (!r.stats) return "no stats";
  return `passed=${r.stats.passed} failed=${r.stats.failed} skipped=${r.stats.skipped ?? 0}`;
}

main();
