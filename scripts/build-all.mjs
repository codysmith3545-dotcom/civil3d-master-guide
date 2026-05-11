#!/usr/bin/env node
// Unified build orchestrator.
// Reads config.yaml, then runs each build step in order.
// Reports success/failure for each step with timing.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

// ---------------------------------------------------------------------------
// Build steps — each has a label and a command to run from the repo root.
// Steps are run in order; a failure in one step logs the error but continues
// to the next (except for the final web build, which depends on earlier steps).
// ---------------------------------------------------------------------------

const steps = [
  {
    label: 'lint-content',
    cmd: 'node scripts/lint-content.mjs',
    optional: true,
  },
  {
    label: 'build-search-index',
    cmd: 'node web/scripts/build-search-index.mjs',
    optional: false,
  },
  {
    label: 'build-llms-txt',
    cmd: 'node scripts/build-llms-txt.mjs',
    optional: false,
  },
  {
    label: 'build-exports',
    cmd: 'node scripts/build-exports.mjs',
    optional: false,
  },
  {
    label: 'jurisdiction-changes-rss',
    cmd: 'node scripts/jurisdiction-changes-rss.mjs',
    optional: true,
  },
  {
    label: 'mcp-server build',
    cmd: 'pnpm --filter @civil3d-master-guide/mcp run build',
    optional: true,
  },
  {
    label: 'web build',
    cmd: 'pnpm --filter web run build',
    optional: false,
  },
];

function run(label, cmd, optional) {
  const start = Date.now();
  try {
    execSync(cmd, {
      cwd: ROOT,
      stdio: 'pipe',
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  [pass]  ${label} (${elapsed}s)`);
    return true;
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const tag = optional ? 'skip' : 'FAIL';
    console.error(`  [${tag}]  ${label} (${elapsed}s)`);
    if (err.stderr) {
      const msg = err.stderr.toString().trim().split('\n').slice(0, 8).join('\n');
      if (msg) console.error(`          ${msg.replace(/\n/g, '\n          ')}`);
    }
    return optional; // optional failures don't block the pipeline
  }
}

async function main() {
  console.log('build-all: starting unified build pipeline\n');
  const overall = Date.now();
  let failed = false;

  for (const step of steps) {
    const ok = run(step.label, step.cmd, step.optional);
    if (!ok) {
      failed = true;
      console.error(`\nbuild-all: aborting — required step "${step.label}" failed.`);
      break;
    }
  }

  const totalElapsed = ((Date.now() - overall) / 1000).toFixed(1);
  console.log(`\nbuild-all: ${failed ? 'FAILED' : 'complete'} in ${totalElapsed}s`);
  if (failed) process.exit(1);
}

main();
