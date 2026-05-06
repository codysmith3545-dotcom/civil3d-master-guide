#!/usr/bin/env node
// Reads config.yaml and prompts/system.md, generates:
//   exports/system-prompt.txt   — rendered system prompt
//   exports/gpt-config.json     — ChatGPT Custom GPT spec
//   exports/llms-<section>.txt  — segmented llms files by top-level section
//
// Uses gray-matter to parse YAML (it wraps js-yaml internally).

import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import { resolve, relative, join, sep, posix } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const EXPORTS_DIR = resolve(ROOT, 'exports');
const CONTENT_DIR = resolve(ROOT, 'content');

// ---------------------------------------------------------------------------
// YAML parsing via gray-matter: wrap the file content in frontmatter fences
// so gray-matter can parse it.
// ---------------------------------------------------------------------------

function parseYaml(text) {
  const wrapped = `---\n${text}\n---\n`;
  const { data } = matter(wrapped);
  return data;
}

// ---------------------------------------------------------------------------
// Handlebars-style template rendering (simple subset)
// Supports: {{path.to.value}}, {{#each path}}...{{this}}...{{/each}},
//           {{#each path}}...{{this.key}}...{{/each}}
// ---------------------------------------------------------------------------

function resolveValue(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function renderTemplate(template, data) {
  let result = template;

  // Process {{#each ...}} blocks first
  const eachRegex = /\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  result = result.replace(eachRegex, (_match, path, body) => {
    const arr = resolveValue(data, path);
    if (!Array.isArray(arr)) return '';
    // Trim leading/trailing newlines from the loop body so we don't get
    // double blank lines between items.
    const trimmedBody = body.replace(/^\n/, '').replace(/\n$/, '');
    return arr
      .map((item) => {
        let rendered = trimmedBody;
        if (typeof item === 'string') {
          rendered = rendered.replace(/\{\{this\}\}/g, item);
        } else if (typeof item === 'object' && item !== null) {
          // Replace {{this.key}} patterns
          rendered = rendered.replace(/\{\{this\.([\w.]+)\}\}/g, (_m, key) => {
            return resolveValue(item, key) ?? '';
          });
          rendered = rendered.replace(/\{\{this\}\}/g, JSON.stringify(item));
        }
        return rendered;
      })
      .join('\n');
  });

  // Process simple {{path.to.value}} placeholders
  result = result.replace(/\{\{([\w.]+)\}\}/g, (_match, path) => {
    const val = resolveValue(data, path);
    if (val == null) return '';
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
  });

  // Collapse runs of 3+ newlines down to 2 (single blank line)
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

// ---------------------------------------------------------------------------
// Walk content directory
// ---------------------------------------------------------------------------

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Section mapping for segmented llms files
// ---------------------------------------------------------------------------

const SECTION_MAP = {
  'civil3d': 'civil3d',
  'engineering': 'engineering',
  'field-and-boundary': 'field-survey',
  'standards': 'standards',
  'customization': 'customization',
  'jurisdictions': 'jurisdictions',
  'resources': 'civil3d',
  'docs-mirror': 'standards',
  'glossary': 'civil3d',
  '00-index': 'civil3d',
};

function getSection(relFromContent) {
  const first = relFromContent.split(posix.sep)[0];
  const key = first.endsWith('.md') ? first.replace(/\.md$/, '') : first;
  return SECTION_MAP[key] || 'civil3d';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Ensure exports/ exists
  await mkdir(EXPORTS_DIR, { recursive: true });

  // 1. Read and parse config.yaml
  const configRaw = await readFile(resolve(ROOT, 'config.yaml'), 'utf8');
  const config = parseYaml(configRaw);

  // 2. Read the system prompt template and render it
  const templatePath = resolve(ROOT, config.ai?.system_prompt_template || 'prompts/system.md');
  const template = await readFile(templatePath, 'utf8');
  const systemPrompt = renderTemplate(template, config);

  await writeFile(resolve(EXPORTS_DIR, 'system-prompt.txt'), systemPrompt, 'utf8');
  console.log('  wrote exports/system-prompt.txt');

  // 3. Generate gpt-config.json
  const gptConfig = {
    name: config.brand?.name || 'Knowledge Base',
    description: `AI assistant for ${config.knowledge?.focus || 'domain knowledge'} in ${config.knowledge?.geography || 'the US'}. Powered by a curated knowledge base with ${config.calculators?.enabled?.length || 0} calculators.`,
    instructions: systemPrompt,
    conversation_starters: [
      `What does ${config.knowledge?.geography || 'my area'} require for stormwater detention?`,
      'How do I calculate a vertical curve?',
      'What are the ALTA/NSPS minimum standards for a boundary survey?',
      'Show me the rational method formula with an example.',
      `What jurisdictions are covered in the knowledge base?`,
    ],
  };

  await writeFile(
    resolve(EXPORTS_DIR, 'gpt-config.json'),
    JSON.stringify(gptConfig, null, 2) + '\n',
    'utf8',
  );
  console.log('  wrote exports/gpt-config.json');

  // 4. Build segmented llms files
  const files = (await walk(CONTENT_DIR)).sort();
  const sections = new Map(); // section-name -> [{ repoRel, title, body }]

  for (const abs of files) {
    const raw = await readFile(abs, 'utf8');
    let parsed;
    try {
      parsed = matter(raw);
    } catch {
      continue;
    }
    if (parsed.data?.visibility === 'invite') continue;

    const relFromContent = relative(CONTENT_DIR, abs).split(sep).join(posix.sep);
    const repoRel = 'content/' + relFromContent;
    const title = parsed.data?.title || relFromContent;
    const section = getSection(relFromContent);

    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push({ repoRel, title, body: parsed.content });
  }

  const sectionNames = ['civil3d', 'engineering', 'field-survey', 'jurisdictions', 'standards', 'customization'];
  let totalSegmented = 0;

  for (const name of sectionNames) {
    const pages = sections.get(name) || [];
    if (pages.length === 0) continue;

    pages.sort((a, b) => a.repoRel.localeCompare(b.repoRel));

    const parts = pages.map(
      (p) => `# ${p.repoRel}\n\n${p.body.trim()}\n`,
    );
    const content = parts.join('\n\n---\n\n');

    await writeFile(resolve(EXPORTS_DIR, `llms-${name}.txt`), content + '\n', 'utf8');
    totalSegmented += pages.length;
    console.log(`  wrote exports/llms-${name}.txt (${pages.length} pages)`);
  }

  console.log(`\nbuild-exports complete: ${totalSegmented} pages across ${sectionNames.length} segments`);
}

main().catch((err) => {
  console.error('build-exports failed:', err);
  process.exit(1);
});
