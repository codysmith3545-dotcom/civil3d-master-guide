/**
 * LISP-routine catalog for the public REST API.
 *
 * Reads metadata from content/customization/lisp/library/index.json when it
 * exists (the curated library format documented in the MCP server). When the
 * library has not been populated yet, returns an empty list.
 *
 * Source format (per index.json entry):
 *   {
 *     "name": "slug",
 *     "command": "C:MYCMD",
 *     "category": "points",
 *     "summary": "One-line description.",
 *     "appliesTo": ["civil3d-2024", "civil3d-2025"],
 *     "files": { "source": "my-routine.lsp", "doc": "my-routine.md" }
 *   }
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getContentRoot } from "../content";

export type LispMeta = {
  name: string;
  command?: string;
  category?: string;
  summary?: string;
  appliesTo?: string[];
};

export type LispRoutine = LispMeta & {
  source: string;
  documentation: string;
  documentationFrontmatter?: Record<string, unknown>;
};

function libraryDir(): string {
  return path.join(getContentRoot(), "customization", "lisp", "library");
}

function readIndex(): LispMeta[] {
  const indexPath = path.join(libraryDir(), "index.json");
  if (!fs.existsSync(indexPath)) return [];
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e === "object" && typeof e.name === "string")
      .map((e: Record<string, unknown>) => ({
        name: String(e["name"]),
        command: typeof e["command"] === "string" ? (e["command"] as string) : undefined,
        category: typeof e["category"] === "string" ? (e["category"] as string) : undefined,
        summary: typeof e["summary"] === "string" ? (e["summary"] as string) : undefined,
        appliesTo: Array.isArray(e["appliesTo"]) ? (e["appliesTo"] as string[]) : undefined,
      }));
  } catch {
    return [];
  }
}

export function listLispRoutines(): LispMeta[] {
  return readIndex();
}

export function getLispRoutine(name: string): LispRoutine | null {
  const meta = readIndex().find((e) => e.name === name);
  if (!meta) return null;
  // Look for source + doc by convention: <name>.lsp and <name>.md alongside index.json.
  const src = path.join(libraryDir(), `${name}.lsp`);
  const doc = path.join(libraryDir(), `${name}.md`);
  let source = "";
  let documentation = "";
  let documentationFrontmatter: Record<string, unknown> | undefined;
  if (fs.existsSync(src)) source = fs.readFileSync(src, "utf8");
  if (fs.existsSync(doc)) {
    const parsed = matter(fs.readFileSync(doc, "utf8"));
    documentation = parsed.content;
    documentationFrontmatter = parsed.data as Record<string, unknown>;
  }
  return { ...meta, source, documentation, documentationFrontmatter };
}
