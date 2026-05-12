import fs from "node:fs";
import path from "node:path";

export type SiteConfig = {
  brand: {
    name: string;
    short_name: string;
    domain: string;
    company: string;
    logo: string;
    footer: string;
  };
  knowledge: {
    focus: string;
    geography: string;
    primary_standards: string[];
    content_dir: string;
    scope?: string;
  };
  repo_url?: string;
  license?: string;
};

/**
 * Very small YAML reader for the project's config.yaml.
 *
 * Avoids adding js-yaml as a runtime dependency. Supports only the subset of
 * YAML actually used in `config.yaml`: nested mapping with two-space indents,
 * scalar string values (single line, optionally quoted), and `- "value"` style
 * sequences. If the schema grows, swap this out for js-yaml.
 */
function parseSimpleYaml(text: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  const stack: { indent: number; node: Record<string, unknown> | unknown[] }[] = [
    { indent: -1, node: root },
  ];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;
    // Strip comments after a space.
    const line = rawLine.replace(/\s+#.*$/, "");
    if (!line.trim()) continue;

    const indent = line.length - line.trimStart().length;
    const content = line.trim();

    // Pop until parent's indent is less than current.
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].node;

    if (content.startsWith("- ")) {
      const value = content.slice(2).trim();
      if (!Array.isArray(parent)) continue;
      parent.push(stripQuotes(value));
      continue;
    }

    const colonIdx = content.indexOf(":");
    if (colonIdx === -1) continue;
    const key = content.slice(0, colonIdx).trim();
    const valueRaw = content.slice(colonIdx + 1).trim();

    if (!valueRaw) {
      // Determine if children are list or map by peeking ahead.
      let isList = false;
      for (let j = i + 1; j < lines.length; j++) {
        const peek = lines[j];
        if (!peek.trim()) continue;
        const peekIndent = peek.length - peek.trimStart().length;
        if (peekIndent <= indent) break;
        isList = peek.trimStart().startsWith("- ");
        break;
      }
      const child: Record<string, unknown> | unknown[] = isList ? [] : {};
      if (Array.isArray(parent)) {
        parent.push(child);
      } else {
        (parent as Record<string, unknown>)[key] = child;
      }
      stack.push({ indent, node: child });
    } else {
      if (Array.isArray(parent)) continue;
      (parent as Record<string, unknown>)[key] = stripQuotes(valueRaw);
    }
  }

  return root;
}

function stripQuotes(value: string): string {
  const v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

let cached: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (cached) return cached;
  const candidates = [
    path.join(process.cwd(), "..", "config.yaml"),
    path.join(process.cwd(), "config.yaml"),
  ];
  let text = "";
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      text = fs.readFileSync(p, "utf8");
      break;
    }
  }
  const parsed = (parseSimpleYaml(text) ?? {}) as Record<string, unknown>;
  const brand = (parsed.brand ?? {}) as Record<string, string>;
  const knowledge = (parsed.knowledge ?? {}) as Record<string, unknown>;

  const standards = Array.isArray(knowledge.primary_standards)
    ? (knowledge.primary_standards as string[])
    : [];

  const scope =
    typeof knowledge.scope === "string"
      ? (knowledge.scope as string)
      : `${(knowledge.focus as string) ?? "Land surveying and civil engineering"} reference for ${
          (knowledge.geography as string) ?? "the United States"
        }, with curated standards and jurisdictional detail.`;

  cached = {
    brand: {
      name: brand.name ?? "Civil 3D Master Guide",
      short_name: brand.short_name ?? brand.name ?? "C3D Guide",
      domain: brand.domain ?? "",
      company: brand.company ?? "",
      logo: brand.logo ?? "",
      footer: brand.footer ?? "Original content licensed CC BY-SA 4.0.",
    },
    knowledge: {
      focus: (knowledge.focus as string) ?? "",
      geography: (knowledge.geography as string) ?? "",
      primary_standards: standards,
      content_dir: (knowledge.content_dir as string) ?? "content",
      scope,
    },
    repo_url:
      typeof parsed.repo_url === "string"
        ? (parsed.repo_url as string)
        : "https://github.com/civil3d-master-guide/civil3d-master-guide",
    license: typeof parsed.license === "string"
      ? (parsed.license as string)
      : "CC BY-SA 4.0",
  };
  return cached;
}
