import { promises as fs } from "node:fs";
import * as path from "node:path";
import { resolveKbRoot } from "./content.js";

export interface LispRoutineMeta {
  name: string;
  command: string;
  category: string;
  summary: string;
  appliesTo: string[];
}

export interface LispRoutineEntry extends LispRoutineMeta {
  lspFile: string;
  docFile: string;
}

export interface GetLispResult {
  meta: LispRoutineMeta;
  lspSource: string;
  docMarkdown: string;
}

interface IndexFile {
  routines: LispRoutineEntry[];
}

const VALID_NAME_RE = /^[A-Za-z0-9_-]+$/;

/**
 * Resolve the on-disk root for the LISP library.
 *
 * Precedence:
 *   1. LISP_LIBRARY_DIR env var (absolute path to a directory containing index.json).
 *   2. <kbRoot>/customization/lisp/library
 */
export async function resolveLispLibraryDir(): Promise<string> {
  const envDir = process.env.LISP_LIBRARY_DIR;
  if (envDir && envDir.trim().length > 0) {
    return path.resolve(envDir);
  }
  const root = await resolveKbRoot();
  return path.join(root, "customization", "lisp", "library");
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function isDir(p: string): Promise<boolean> {
  try {
    const s = await fs.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Try to extract a routine command from the .md doc. Looks for a YAML
 * frontmatter `command:` line first, then for a "# Command: X" or "# X"
 * heading. Falls back to the routine name uppercased.
 */
function extractCommandFromDoc(docText: string, fallback: string): string {
  const fmMatch = docText.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const cmd = fm.match(/^command\s*:\s*["']?([^"'\n]+)["']?\s*$/m);
    if (cmd && cmd[1]) return cmd[1].trim();
  }
  const head = docText.match(/^#\s+(?:Command\s*:\s*)?([A-Z][A-Za-z0-9_-]*)/m);
  if (head && head[1]) return head[1].trim();
  return fallback.toUpperCase();
}

function extractSummaryFromDoc(docText: string, fallback: string): string {
  // Prefer frontmatter `summary:` field
  const fmMatch = docText.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const s = fm.match(/^summary\s*:\s*["']?([^"'\n]+)["']?\s*$/m);
    if (s && s[1]) return s[1].trim();
  }
  // Otherwise first non-frontmatter, non-heading, non-blockquote line
  const body = fmMatch ? docText.slice(fmMatch[0].length) : docText;
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("#")) continue;
    if (t.startsWith(">")) continue;
    return t.replace(/[*_`]/g, "").slice(0, 200);
  }
  return fallback;
}

function extractAppliesToFromDoc(docText: string): string[] {
  const fmMatch = docText.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return [];
  const fm = fmMatch[1];
  // appliesTo: [a, b, c]
  const inline = fm.match(/^appliesTo\s*:\s*\[([^\]]*)\]\s*$/m);
  if (inline && inline[1]) {
    return inline[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  // appliesTo: \n  - a\n  - b
  const block = fm.match(/^appliesTo\s*:\s*\n((?:\s*-\s*.+\n?)+)/m);
  if (block && block[1]) {
    return block[1]
      .split(/\r?\n/)
      .map((l) => l.match(/^\s*-\s*(.+)$/))
      .filter((m): m is RegExpMatchArray => Boolean(m))
      .map((m) => m[1].trim().replace(/^["']|["']$/g, ""));
  }
  return [];
}

/**
 * Scan the library directory for matched `<category>/<name>.lsp` + `<category>/<name>.md`
 * pairs and return a synthesized index. Used when index.json is missing or empty.
 */
async function scanLibrary(libDir: string): Promise<LispRoutineEntry[]> {
  if (!(await isDir(libDir))) return [];
  const out: LispRoutineEntry[] = [];
  const categories = await fs.readdir(libDir, { withFileTypes: true });
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    if (cat.name.startsWith(".")) continue;
    const catDir = path.join(libDir, cat.name);
    let files: import("node:fs").Dirent[] = [];
    try {
      files = await fs.readdir(catDir, { withFileTypes: true });
    } catch {
      continue;
    }
    const byStem = new Map<string, { lsp?: string; md?: string }>();
    for (const f of files) {
      if (!f.isFile()) continue;
      const lower = f.name.toLowerCase();
      if (lower.endsWith(".lsp")) {
        const stem = f.name.replace(/\.lsp$/i, "");
        const entry = byStem.get(stem) ?? {};
        entry.lsp = f.name;
        byStem.set(stem, entry);
      } else if (lower.endsWith(".md")) {
        const stem = f.name.replace(/\.md$/i, "");
        const entry = byStem.get(stem) ?? {};
        entry.md = f.name;
        byStem.set(stem, entry);
      }
    }
    for (const [stem, pair] of byStem) {
      if (!pair.lsp || !pair.md) continue;
      const docText = await fs.readFile(path.join(catDir, pair.md), "utf8");
      out.push({
        name: stem,
        command: extractCommandFromDoc(docText, stem),
        category: cat.name,
        summary: extractSummaryFromDoc(docText, ""),
        lspFile: `${cat.name}/${pair.lsp}`,
        docFile: `${cat.name}/${pair.md}`,
        appliesTo: extractAppliesToFromDoc(docText),
      });
    }
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

async function readIndex(libDir: string): Promise<LispRoutineEntry[]> {
  const idxPath = path.join(libDir, "index.json");
  if (await fileExists(idxPath)) {
    try {
      const raw = await fs.readFile(idxPath, "utf8");
      const parsed = JSON.parse(raw) as IndexFile;
      if (parsed && Array.isArray(parsed.routines) && parsed.routines.length > 0) {
        return parsed.routines;
      }
    } catch {
      // fall through to scan
    }
  }
  return scanLibrary(libDir);
}

/** Return metadata for all known LISP routines. */
export async function listLispRoutines(): Promise<LispRoutineMeta[]> {
  const libDir = await resolveLispLibraryDir();
  const entries = await readIndex(libDir);
  return entries.map((e) => ({
    name: e.name,
    command: e.command,
    category: e.category,
    summary: e.summary,
    appliesTo: e.appliesTo,
  }));
}

/** Return full source + doc for a single routine. */
export async function getLisp(name: string): Promise<GetLispResult | null> {
  if (!name || !VALID_NAME_RE.test(name)) return null;
  const libDir = await resolveLispLibraryDir();
  const entries = await readIndex(libDir);
  const entry = entries.find((e) => e.name === name);
  if (!entry) return null;
  const lspPath = path.join(libDir, entry.lspFile);
  const docPath = path.join(libDir, entry.docFile);
  let lspSource = "";
  let docMarkdown = "";
  try {
    lspSource = await fs.readFile(lspPath, "utf8");
  } catch {
    return null;
  }
  try {
    docMarkdown = await fs.readFile(docPath, "utf8");
  } catch {
    docMarkdown = "";
  }
  return {
    meta: {
      name: entry.name,
      command: entry.command,
      category: entry.category,
      summary: entry.summary,
      appliesTo: entry.appliesTo,
    },
    lspSource,
    docMarkdown,
  };
}

/** Return the resolved library entry (incl. file paths) for a given name, or null. */
export async function getLispEntry(name: string): Promise<LispRoutineEntry | null> {
  if (!name || !VALID_NAME_RE.test(name)) return null;
  const libDir = await resolveLispLibraryDir();
  const entries = await readIndex(libDir);
  return entries.find((e) => e.name === name) ?? null;
}

/** Expose the full entry list (for the web UI). */
export async function listLispEntries(): Promise<LispRoutineEntry[]> {
  const libDir = await resolveLispLibraryDir();
  return readIndex(libDir);
}
