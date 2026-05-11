#!/usr/bin/env node
// Fixture-based tests for scripts/validate-question-bank.mjs.
// Run with: node scripts/__tests__/validate-question-bank.test.mjs
//
// Each test writes a small bank file to a temp directory, runs the validator,
// and asserts on the result. No external test framework required.

import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

import { validateBank } from '../validate-question-bank.mjs';

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

async function writeBank(dir, data) {
  const file = join(dir, 'bank.json');
  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  return file;
}

function validQuestion(overrides = {}) {
  return {
    id: 'ps-in-001',
    topic: 'fundamentals/bearings-azimuths',
    objective: 'NCEES PS test',
    difficulty: 'easy',
    prompt: 'What is 2 + 2?',
    choices: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '6' },
    ],
    correct: 'b',
    rationale: '2 + 2 = 4.',
    source: 'fundamentals/bearings-azimuths',
    pending_source: true,
    tags: ['math'],
    ...overrides,
  };
}

test('accepts a minimal valid bank', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, { questions: [validQuestion()] });
  const result = await validateBank(file);
  assert.equal(result.ok, true, `errors: ${result.errors.join('; ')}`);
  assert.equal(result.questionCount, 1);
});

test('rejects bad id pattern', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, {
    questions: [validQuestion({ id: 'q-001' })],
  });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some((e) => e.includes('ps-in-NNN')),
    `expected id-format error, got: ${result.errors.join('; ')}`,
  );
});

test('rejects duplicate ids', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, {
    questions: [validQuestion(), validQuestion()],
  });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('duplicate id')));
});

test('rejects bad difficulty', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, {
    questions: [validQuestion({ difficulty: 'extreme' })],
  });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('difficulty')));
});

test('rejects correct that does not match a choice id', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, {
    questions: [validQuestion({ correct: 'z' })],
  });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('correct must reference')));
});

test('rejects fewer than 2 choices', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, {
    questions: [
      validQuestion({
        choices: [{ id: 'a', text: 'only one' }],
        correct: 'a',
      }),
    ],
  });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('at least 2')));
});

test('rejects empty prompt', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, {
    questions: [validQuestion({ prompt: '   ' })],
  });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('prompt')));
});

test('rejects missing rationale', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const q = validQuestion();
  delete q.rationale;
  const file = await writeBank(dir, { questions: [q] });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('rationale')));
});

test('rejects non-array questions', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = await writeBank(dir, { questions: 'nope' });
  const result = await validateBank(file);
  assert.equal(result.ok, false);
});

test('warns on missing source page when not pending', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const q = validQuestion({
    source: 'definitely-does-not-exist/page',
  });
  delete q.pending_source;
  const file = await writeBank(dir, { questions: [q] });
  const result = await validateBank(file);
  assert.equal(result.ok, true);
  assert.ok(
    result.warnings.some((w) => w.includes('definitely-does-not-exist/page')),
    `expected missing-source warning, got: ${result.warnings.join('; ')}`,
  );
});

test('rejects invalid JSON', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qbank-'));
  const file = join(dir, 'bank.json');
  await writeFile(file, '{ not valid json', 'utf8');
  const result = await validateBank(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('not valid JSON')));
});

test('actual bank.json validates clean', async () => {
  const root = resolve(import.meta.dirname, '..', '..');
  const file = join(
    root,
    'content/exam-prep/ps-indiana/questions/bank.json',
  );
  const result = await validateBank(file);
  assert.equal(
    result.ok,
    true,
    `errors: ${result.errors.join('; ')}`,
  );
  assert.equal(result.questionCount, 50);
});

async function main() {
  let pass = 0;
  let fail = 0;
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`  pass  ${t.name}`);
      pass++;
    } catch (err) {
      console.error(`  FAIL  ${t.name}`);
      console.error(`        ${err.message}`);
      fail++;
    }
  }
  console.log(`\n${pass} passed, ${fail} failed (out of ${tests.length})`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
