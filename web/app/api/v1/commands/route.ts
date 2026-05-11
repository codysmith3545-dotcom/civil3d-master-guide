import path from "node:path";
import type { NextRequest } from "next/server";
import { listAll } from "@/lib/content";
import { jsonResponse, optionsResponse } from "@/lib/api/response";
import { guard } from "@/lib/api/guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

type CommandEntry = {
  command: string;
  category?: string;
  ribbon?: string;
  related?: string[];
  symptoms?: string[];
  slug: string;
  href: string;
  title: string;
};

export async function GET(req: NextRequest) {
  const g = guard(req);
  if (!g.ok) return g.response;

  const { searchParams } = new URL(req.url);
  const categoryFilter = searchParams.get("category")?.trim().toLowerCase() || undefined;

  const items: CommandEntry[] = [];
  for (const p of listAll()) {
    if (!p.slug.startsWith("civil3d/commands/")) continue;
    const base = path.basename(p.slug);
    if (
      base === "index" ||
      base === "shortcuts" ||
      base === "command-line-cheatsheet" ||
      base === "_template"
    ) {
      continue;
    }
    const fm = p.frontmatter as Record<string, unknown>;
    if ((fm["visibility"] as string) === "invite") continue;
    const command = typeof fm["command"] === "string" ? (fm["command"] as string) : base;
    const category = typeof fm["category"] === "string" ? (fm["category"] as string) : undefined;
    if (categoryFilter && (category ?? "").toLowerCase() !== categoryFilter) continue;
    items.push({
      command,
      category,
      ribbon: typeof fm["ribbon"] === "string" ? (fm["ribbon"] as string) : undefined,
      related: Array.isArray(fm["related"]) ? (fm["related"] as string[]) : undefined,
      symptoms: Array.isArray(fm["symptoms"]) ? (fm["symptoms"] as string[]) : undefined,
      slug: p.slug,
      href: p.href,
      title: typeof fm["title"] === "string" ? (fm["title"] as string) : command,
    });
  }
  items.sort((a, b) => a.command.localeCompare(b.command));
  return jsonResponse({ count: items.length, items }, { extraHeaders: g.headers });
}
