import fs from "node:fs";
import path from "node:path";

export type LispRoutineEntry = {
  name: string;
  command: string;
  category: string;
  summary: string;
  lspFile: string;
  docFile: string;
  appliesTo: string[];
};

const VALID_NAME_RE = /^[A-Za-z0-9_-]+$/;

const REPO_ROOT =
  process.env.CIVIL3D_REPO_ROOT ?? path.join(process.cwd(), "..");

export function getLispLibraryDir(): string {
  const override = process.env.LISP_LIBRARY_DIR;
  if (override && override.trim().length > 0) return path.resolve(override);
  return path.join(REPO_ROOT, "customization", "lisp", "library");
}

function extractFrontmatterScalar(fm: string, key: string): string | null {
  const re = new RegExp(`^${key}\\s*:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m");
  const m = fm.match(re);
  return m && m[1] ? m[1].trim() : null;
}

function extractAppliesToFromDoc(docText: string): string[] {
  const fmMatch = docText.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return [];
  const fm = fmMatch[1];
  const inline = fm.match(/^appliesTo\s*:\s*\[([^\]]*)\]\s*$/m);
  if (inline && inline[1]) {
    return inline[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
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

function extractCommandFromDoc(docText: string, fallback: string): string {
  const fmMatch = docText.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const cmd = extractFrontmatterScalar(fmMatch[1], "command");
    if (cmd) return cmd;
  }
  const head = docText.match(/^#\s+(?:Command\s*:\s*)?([A-Z][A-Za-z0-9_-]*)/m);
  if (head && head[1]) return head[1].trim();
  return fallback.toUpperCase();
}

function extractSummaryFromDoc(docText: string, fallback: string): string {
  const fmMatch = docText.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const s = extractFrontmatterScalar(fmMatch[1], "summary");
    if (s) return s;
  }
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

function scanLibrary(libDir: string): LispRoutineEntry[] {
  if (!fs.existsSync(libDir)) return [];
  let cats: fs.Dirent[];
  try {
    cats = fs.readdirSync(libDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: LispRoutineEntry[] = [];
  for (const cat of cats) {
    if (!cat.isDirectory() || cat.name.startsWith(".")) continue;
    const catDir = path.join(libDir, cat.name);
    let files: fs.Dirent[];
    try {
      files = fs.readdirSync(catDir, { withFileTypes: true });
    } catch {
      continue;
    }
    const stems = new Map<string, { lsp?: string; md?: string }>();
    for (const f of files) {
      if (!f.isFile()) continue;
      const lower = f.name.toLowerCase();
      if (lower.endsWith(".lsp")) {
        const stem = f.name.replace(/\.lsp$/i, "");
        const e = stems.get(stem) ?? {};
        e.lsp = f.name;
        stems.set(stem, e);
      } else if (lower.endsWith(".md")) {
        const stem = f.name.replace(/\.md$/i, "");
        const e = stems.get(stem) ?? {};
        e.md = f.name;
        stems.set(stem, e);
      }
    }
    for (const [stem, pair] of stems) {
      if (!pair.lsp || !pair.md) continue;
      let docText = "";
      try {
        docText = fs.readFileSync(path.join(catDir, pair.md), "utf8");
      } catch {
        continue;
      }
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

let cached: LispRoutineEntry[] | null = null;
let cacheKey = "";

export function listLispEntries(): LispRoutineEntry[] {
  const libDir = getLispLibraryDir();
  if (cached && cacheKey === libDir) return cached;
  const idxPath = path.join(libDir, "index.json");
  let entries: LispRoutineEntry[] = [];
  if (fs.existsSync(idxPath)) {
    try {
      const raw = fs.readFileSync(idxPath, "utf8");
      const parsed = JSON.parse(raw) as { routines?: LispRoutineEntry[] };
      if (parsed && Array.isArray(parsed.routines) && parsed.routines.length > 0) {
        entries = parsed.routines;
      }
    } catch {
      // fall through
    }
  }
  if (entries.length === 0) {
    entries = scanLibrary(libDir);
  }
  cached = entries;
  cacheKey = libDir;
  return entries;
}

export function getLispEntry(name: string): LispRoutineEntry | null {
  if (!name || !VALID_NAME_RE.test(name)) return null;
  return listLispEntries().find((e) => e.name === name) ?? null;
}

export function readLispSource(entry: LispRoutineEntry): string | null {
  const libDir = getLispLibraryDir();
  const p = path.join(libDir, entry.lspFile);
  // path-traversal guard: ensure resolved path stays inside libDir
  const resolved = path.resolve(p);
  if (!resolved.startsWith(path.resolve(libDir) + path.sep)) return null;
  try {
    return fs.readFileSync(resolved, "utf8");
  } catch {
    return null;
  }
}

export function readLispDoc(entry: LispRoutineEntry): string | null {
  const libDir = getLispLibraryDir();
  const p = path.join(libDir, entry.docFile);
  const resolved = path.resolve(p);
  if (!resolved.startsWith(path.resolve(libDir) + path.sep)) return null;
  try {
    return fs.readFileSync(resolved, "utf8");
  } catch {
    return null;
  }
}

export function categoryCounts(entries: LispRoutineEntry[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of entries) {
    out[e.category] = (out[e.category] ?? 0) + 1;
  }
  return out;
}
