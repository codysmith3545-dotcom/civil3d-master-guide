import fs from "node:fs/promises";
import path from "node:path";

/**
 * By-the-numbers grid. Counts are computed at build time from the file
 * system; this component is intentionally a Server Component so it stays
 * static across the SSG output.
 */

const REPO_ROOT = path.join(process.cwd(), "..");
const CONTENT_ROOT = path.join(REPO_ROOT, "content");

async function safeReadDir(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.map((e) => path.join(dir, e.name));
  } catch {
    return [];
  }
}

async function walkFiles(
  root: string,
  filter: (full: string) => boolean,
): Promise<string[]> {
  const out: string[] = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: import("node:fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && filter(full)) out.push(full);
    }
  }
  return out;
}

export async function countMarkdownPages(): Promise<number> {
  const files = await walkFiles(CONTENT_ROOT, (f) => f.endsWith(".md"));
  return files.length;
}

export async function countCivil3dCommands(): Promise<number> {
  const dir = path.join(CONTENT_ROOT, "civil3d", "commands");
  const entries = await safeReadDir(dir);
  return entries.filter(
    (p) => p.endsWith(".md") && !p.endsWith("_template.md") && !p.endsWith("index.md"),
  ).length;
}

export async function countLispRoutines(): Promise<number> {
  // Preferred location: customization/lisp/library/**/*.lsp (per task spec).
  const lib = path.join(REPO_ROOT, "customization", "lisp", "library");
  const lspFiles = await walkFiles(lib, (f) => f.endsWith(".lsp"));
  if (lspFiles.length > 0) return lspFiles.length;
  // Fallback: count the reference pages we publish about LISP.
  const dir = path.join(CONTENT_ROOT, "customization", "lisp");
  const entries = await safeReadDir(dir);
  return entries.filter((p) => p.endsWith(".md") && !p.endsWith("index.md")).length;
}

export async function countJurisdictions(): Promise<number> {
  const dir = path.join(CONTENT_ROOT, "jurisdictions", "indiana");
  const entries = await safeReadDir(dir);
  let count = 0;
  for (const entry of entries) {
    if (!entry.endsWith("-county")) continue;
    try {
      const stat = await fs.stat(path.join(entry, "index.md"));
      if (stat.isFile()) count++;
    } catch {
      // ignore
    }
  }
  return count;
}

const CALCULATOR_COUNT = 17;
const MCP_TOOL_COUNT = 6;

export type HomeNumbers = {
  pages: number;
  commands: number;
  calculators: number;
  lispRoutines: number;
  jurisdictions: number;
  mcpTools: number;
};

export async function loadHomeNumbers(): Promise<HomeNumbers> {
  const [pages, commands, lispRoutines, jurisdictions] = await Promise.all([
    countMarkdownPages(),
    countCivil3dCommands(),
    countLispRoutines(),
    countJurisdictions(),
  ]);
  return {
    pages,
    commands,
    calculators: CALCULATOR_COUNT,
    lispRoutines,
    jurisdictions,
    mcpTools: MCP_TOOL_COUNT,
  };
}

function Stat({
  value,
  label,
  sublabel,
}: {
  value: number;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <div className="text-3xl font-semibold tracking-tight text-ink-900">
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-sm font-medium text-ink-800">{label}</div>
      {sublabel ? (
        <div className="mt-1 text-xs text-ink-500">{sublabel}</div>
      ) : null}
    </div>
  );
}

export default async function HomeNumbers() {
  const n = await loadHomeNumbers();
  return (
    <section aria-labelledby="numbers-heading" className="mt-20">
      <div className="mb-6 flex items-baseline justify-between">
        <h2
          id="numbers-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          By the numbers
        </h2>
        <span className="text-xs text-ink-500">
          Counts generated at build time from this repo.
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Stat value={n.pages} label="Markdown pages" sublabel="under content/" />
        <Stat
          value={n.commands}
          label="Civil 3D commands"
          sublabel="indexed with ribbon paths"
        />
        <Stat
          value={n.calculators}
          label="Calculators"
          sublabel="survey + engineering"
        />
        <Stat
          value={n.lispRoutines}
          label="AutoLISP routines"
          sublabel="reference library"
        />
        <Stat
          value={n.jurisdictions}
          label="Counties covered"
          sublabel="Indiana, with municipalities"
        />
        <Stat
          value={n.mcpTools}
          label="MCP tools"
          sublabel="exposed to AI assistants"
        />
      </div>
    </section>
  );
}
