#!/usr/bin/env node
// Validates content/exam-prep/ps-indiana/questions/bank.json against the
// expected schema. Exits non-zero on any structural error.
//
// Also warns (does not fail) on:
//   - duplicate question IDs (this IS a hard error)
//   - missing source pages (when pending_source is not true)
//   - difficulty mix far from the target (40/40/20 easy/medium/hard)
//
// Usage:
//   node scripts/validate-question-bank.mjs [path/to/bank.json]

import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { constants as FS } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '..');
const DEFAULT_BANK = resolve(
  ROOT,
  'content/exam-prep/ps-indiana/questions/bank.json',
);
const CONTENT_DIR = resolve(ROOT, 'content/exam-prep/ps-indiana');

const ALLOWED_DIFFICULTY = new Set(['easy', 'medium', 'hard']);
const ID_REGEX = /^ps-in-\d{3}$/;
const CHOICE_ID_REGEX = /^[a-z]$/;

export async function validateBank(bankPath) {
  const errors = [];
  const warnings = [];

  let raw;
  try {
    raw = await readFile(bankPath, 'utf8');
  } catch (err) {
    return {
      ok: false,
      errors: [`could not read bank file: ${err.message}`],
      warnings: [],
      questionCount: 0,
    };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    return {
      ok: false,
      errors: [`bank.json is not valid JSON: ${err.message}`],
      warnings: [],
      questionCount: 0,
    };
  }

  if (!data || typeof data !== 'object') {
    errors.push('bank.json root must be an object');
    return { ok: false, errors, warnings, questionCount: 0 };
  }

  if (!Array.isArray(data.questions)) {
    errors.push('bank.json: "questions" must be an array');
    return { ok: false, errors, warnings, questionCount: 0 };
  }

  const ids = new Set();
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const ctx = `question[${i}]${q && q.id ? ` (${q.id})` : ''}`;

    if (!q || typeof q !== 'object') {
      errors.push(`${ctx}: must be an object`);
      continue;
    }

    // id
    if (typeof q.id !== 'string' || !ID_REGEX.test(q.id)) {
      errors.push(`${ctx}: id must match pattern ps-in-NNN, got ${JSON.stringify(q.id)}`);
    } else if (ids.has(q.id)) {
      errors.push(`${ctx}: duplicate id ${q.id}`);
    } else {
      ids.add(q.id);
    }

    // topic
    if (typeof q.topic !== 'string' || q.topic.length === 0) {
      errors.push(`${ctx}: topic must be a non-empty string`);
    }

    // objective
    if (q.objective !== undefined && typeof q.objective !== 'string') {
      errors.push(`${ctx}: objective must be a string when present`);
    }

    // difficulty
    if (!ALLOWED_DIFFICULTY.has(q.difficulty)) {
      errors.push(
        `${ctx}: difficulty must be easy|medium|hard, got ${JSON.stringify(q.difficulty)}`,
      );
    } else {
      difficultyCounts[q.difficulty] += 1;
    }

    // prompt
    if (typeof q.prompt !== 'string' || q.prompt.trim().length === 0) {
      errors.push(`${ctx}: prompt must be a non-empty string`);
    }

    // choices
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      errors.push(`${ctx}: choices must be an array of at least 2 entries`);
    } else {
      const choiceIds = new Set();
      for (let j = 0; j < q.choices.length; j++) {
        const c = q.choices[j];
        if (!c || typeof c !== 'object') {
          errors.push(`${ctx}: choices[${j}] must be an object`);
          continue;
        }
        if (typeof c.id !== 'string' || !CHOICE_ID_REGEX.test(c.id)) {
          errors.push(`${ctx}: choices[${j}].id must be a single lowercase letter`);
        } else if (choiceIds.has(c.id)) {
          errors.push(`${ctx}: choices[${j}] duplicate id ${c.id}`);
        } else {
          choiceIds.add(c.id);
        }
        if (typeof c.text !== 'string' || c.text.length === 0) {
          errors.push(`${ctx}: choices[${j}].text must be a non-empty string`);
        }
      }
      if (typeof q.correct !== 'string' || !choiceIds.has(q.correct)) {
        errors.push(
          `${ctx}: correct must reference one of the choice ids; got ${JSON.stringify(q.correct)}`,
        );
      }
    }

    // rationale
    if (typeof q.rationale !== 'string' || q.rationale.trim().length === 0) {
      errors.push(`${ctx}: rationale must be a non-empty string`);
    }

    // source
    if (typeof q.source !== 'string' || q.source.length === 0) {
      errors.push(`${ctx}: source must be a non-empty string (page slug)`);
    } else {
      // try to resolve the source page on disk; warn if missing unless pending_source: true
      const candidate = resolve(CONTENT_DIR, `${q.source}.md`);
      let exists = true;
      try {
        await access(candidate, FS.F_OK);
      } catch {
        exists = false;
      }
      if (!exists) {
        if (q.pending_source === true) {
          warnings.push(`${ctx}: source page ${q.source} does not exist yet (pending_source=true)`);
        } else {
          warnings.push(`${ctx}: source page ${q.source} does not exist (expected ${candidate})`);
        }
      }
    }

    if (q.tags !== undefined && !Array.isArray(q.tags)) {
      errors.push(`${ctx}: tags must be an array when present`);
    }
  }

  // Difficulty mix warning
  const total = data.questions.length;
  if (total > 0) {
    const target = { easy: 0.4, medium: 0.4, hard: 0.2 };
    for (const [k, t] of Object.entries(target)) {
      const observed = difficultyCounts[k] / total;
      if (Math.abs(observed - t) > 0.15) {
        warnings.push(
          `difficulty mix off target: ${k}=${(observed * 100).toFixed(0)}% (target ${(t * 100).toFixed(0)}%)`,
        );
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    questionCount: total,
    difficultyCounts,
  };
}

async function main() {
  const bankPath = process.argv[2]
    ? resolve(process.cwd(), process.argv[2])
    : DEFAULT_BANK;
  const result = await validateBank(bankPath);

  console.log(`validate-question-bank: ${bankPath}`);
  console.log(`  questions: ${result.questionCount}`);
  if (result.difficultyCounts) {
    const d = result.difficultyCounts;
    console.log(`  difficulty: easy=${d.easy} medium=${d.medium} hard=${d.hard}`);
  }
  for (const w of result.warnings) console.log(`  WARN  ${w}`);
  for (const e of result.errors) console.log(`  FAIL  ${e}`);

  if (!result.ok) {
    console.error(`validate-question-bank: ${result.errors.length} error(s)`);
    process.exit(1);
  }
  console.log('validate-question-bank: OK');
}

// Only run main() when invoked directly (not when imported by tests).
const invokedDirectly =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1] || '');
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
