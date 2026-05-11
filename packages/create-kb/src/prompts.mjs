// Tiny zero-dep prompt helpers built on node:readline.
// Used by the create-knowledge-base CLI.

import { createInterface } from 'node:readline';

let rl = null;

function getRl() {
  if (!rl) {
    rl = createInterface({ input: process.stdin, output: process.stdout });
  }
  return rl;
}

export function closeRl() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

export function ask(question) {
  return new Promise((resolve) => {
    getRl().question(question, (answer) => resolve(answer.trim()));
  });
}

export async function confirm(question, defaultYes = false) {
  const answer = (await ask(question)).toLowerCase();
  if (!answer) return defaultYes;
  return answer === 'y' || answer === 'yes';
}

// Pick one value from a list. Accepts either a number or the literal value.
export async function select(label, options, defaultValue) {
  console.log(label);
  options.forEach((opt, i) => {
    const marker = opt === defaultValue ? '*' : ' ';
    console.log(`  ${marker} ${i + 1}) ${opt}`);
  });
  const raw = await ask(`Choose [${defaultValue}]: `);
  if (!raw) return defaultValue;
  const n = Number(raw);
  if (!Number.isNaN(n) && n >= 1 && n <= options.length) return options[n - 1];
  if (options.includes(raw)) return raw;
  console.log('  Invalid choice — using default.');
  return defaultValue;
}

// Multi-select: returns an array of selected indices.
// Input is "1,3,5" or blank for none.
export async function multiSelect(label, options) {
  console.log(label);
  options.forEach((opt, i) => {
    console.log(`  ${i + 1}) ${opt}`);
  });
  const raw = await ask('Numbers (comma-separated), "all", or blank for none: ');
  if (!raw) return [];
  if (raw.toLowerCase() === 'all') return options.map((_, i) => i);
  return raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n) && n >= 1 && n <= options.length)
    .map((n) => n - 1);
}
