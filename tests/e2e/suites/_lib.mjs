/**
 * Tiny test-runner used by every suite. Each suite exports `run(ctx)` and
 * returns { passed, failed, skipped }. We deliberately avoid `node:test` so
 * that a suite can run as a regular ES module (which makes pure-function
 * imports — e.g. the calculator suite — trivial).
 */

export function createRunner(name) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const failures = [];

  async function test(label, fn) {
    try {
      await fn();
      passed += 1;
      // eslint-disable-next-line no-console
      console.log(`  ok  ${label}`);
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? (err.stack ?? err.message) : String(err);
      failures.push({ label, msg });
      // eslint-disable-next-line no-console
      console.log(`  FAIL ${label}\n       ${msg.split("\n").join("\n       ")}`);
    }
  }

  function skip(label, reason) {
    skipped += 1;
    // eslint-disable-next-line no-console
    console.log(`  skip ${label} (${reason})`);
  }

  function finish() {
    return { name, passed, failed, skipped, failures };
  }

  return { test, skip, finish };
}

export function assertEqual(actual, expected, label = "assertEqual") {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertTrue(cond, label = "assertTrue") {
  if (!cond) throw new Error(`${label}: condition was falsy`);
}

export function assertClose(actual, expected, eps, label = "assertClose") {
  if (typeof actual !== "number" || Number.isNaN(actual)) {
    throw new Error(`${label}: expected number, got ${actual}`);
  }
  if (Math.abs(actual - expected) > eps) {
    throw new Error(`${label}: expected ~${expected} ±${eps}, got ${actual}`);
  }
}

export function assertContains(haystack, needle, label = "assertContains") {
  if (typeof haystack !== "string" || typeof needle !== "string") {
    throw new Error(`${label}: both args must be strings`);
  }
  if (!haystack.includes(needle)) {
    throw new Error(
      `${label}: substring not found.\n  needle: ${JSON.stringify(needle.slice(0, 80))}\n  haystack[0..200]: ${JSON.stringify(haystack.slice(0, 200))}`,
    );
  }
}
