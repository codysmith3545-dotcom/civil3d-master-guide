/**
 * Resource-index helpers for the public REST API.
 *
 * Parses content/resources/*.md into a category -> items[] index, mirroring
 * mcp-server's buildResourceIndex.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getContentRoot } from "../content";

export type ResourceItem = {
  text: string;
  url?: string;
  starred?: boolean;
};

function categoryFromFilename(name: string): string {
  const stem = name.replace(/\.md$/i, "");
  if (stem === "books") return "books";
  if (stem === "youtube-channels") return "youtube";
  if (stem === "blogs") return "blogs";
  if (stem === "forums-and-communities") return "forums";
  if (stem === "podcasts") return "podcasts";
  if (stem === "training-and-certs") return "training";
  if (stem === "tools-and-software") return "tools";
  return stem;
}

function extractResources(body: string): ResourceItem[] {
  const items: ResourceItem[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (!m) continue;
    const raw = m[1]!.trim();
    const starred = /^[★]/.test(raw);
    const cleaned = raw.replace(/^[★]\s*/, "");
    const link = cleaned.match(/\[([^\]]+)\]\(([^)]+)\)/);
    items.push({
      text: cleaned,
      url: link ? link[2] : undefined,
      starred: starred || undefined,
    });
  }
  return items;
}

export function buildResourceIndex(): Record<string, ResourceItem[]> {
  const dir = path.join(getContentRoot(), "resources");
  const out: Record<string, ResourceItem[]> = {};
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (!ent.isFile() || !ent.name.toLowerCase().endsWith(".md")) continue;
    if (ent.name === "index.md") continue;
    const cat = categoryFromFilename(ent.name);
    const raw = fs.readFileSync(path.join(dir, ent.name), "utf8");
    const parsed = matter(raw);
    out[cat] = extractResources(parsed.content);
  }
  return out;
}
