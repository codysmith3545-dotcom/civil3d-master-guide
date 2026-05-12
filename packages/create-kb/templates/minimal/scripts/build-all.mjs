#!/usr/bin/env node
// Build orchestrator for {{brand.name}}. Extend as your pipeline grows.

import { execSync } from 'node:child_process';

const steps = [
  { label: 'lint-content', cmd: 'node scripts/lint-content.mjs', optional: true },
];

let failed = false;
for (const s of steps) {
  try {
    execSync(s.cmd, { stdio: 'inherit' });
    console.log(`  [pass] ${s.label}`);
  } catch (e) {
    console.error(`  [${s.optional ? 'skip' : 'FAIL'}] ${s.label}`);
    if (!s.optional) failed = true;
  }
}
if (failed) process.exit(1);
