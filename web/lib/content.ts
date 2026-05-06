import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

export type Frontmatter = {
  title?: string;
  section?: string;
  order?: number;
  visibility?: "public" | "invite";
  tags?: string[];
  appliesTo?: string[];
  relatedCommands?: string[];
  relatedCalculators?: string[];
  jurisdictionRefs?: string[];
  updated?: string;
  sources?: { title: string; url: string; verified?: string }[];
  [key: string]: unknown;
};

export type Page = {
  /** Path-style slug from the content root, with no extension. e.g. `civil3d/surfaces/index`. */
  slug: string;
  /** URL-style slug for the docs route. */
  href: string;
  /** Path on disk. */
  filePath: string;
  frontmatter: Frontmatter;
  /** Raw markdown body (no frontmatter). */
  body: string;
};

export type NavNode = {
  name: string;
  href?: string;
  title?: string;
  order?: number;
  children: NavNode[];
};

export type Heading = { depth: number; text: string; id: string };

const CONTENT_ROOT =
  process.env.CIVIL3D_CONTENT_ROOT ??
  path.join(process.cwd(), "..", "content");

// In-memory caches keyed by absolute content root.
const fileListCache = new Map<string, string[]>();
const pageCache = new Map<string, Page>();
const renderCache = new Map<string, { html: string; headings: Heading[] }>();

function listMarkdownFiles(root: string): string[] {
  const cached = fileListCache.get(root);
  if (cached) return cached;
  const out: string[] = [];
  if (!fs.existsSync(root)) {
    fileListCache.set(root, out);
    return out;
  }
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith(".md")) out.push(full);
    }
  }
  out.sort();
  fileListCache.set(root, out);
  return out;
}

function fileToSlug(filePath: string, root: string): string {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  return rel.replace(/\.md$/, "");
}

function readPageAt(filePath: string, root: string): Page {
  const cached = pageCache.get(filePath);
  if (cached) return cached;
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const slug = fileToSlug(filePath, root);
  const href = "/docs/" + slug;
  const page: Page = {
    slug,
    href,
    filePath,
    frontmatter: parsed.data as Frontmatter,
    body: parsed.content,
  };
  pageCache.set(filePath, page);
  return page;
}

export function listAll(): Page[] {
  return listMarkdownFiles(CONTENT_ROOT).map((f) => readPageAt(f, CONTENT_ROOT));
}

export function getPageBySlug(slugSegments: string[] | string): Page | null {
  const slug = Array.isArray(slugSegments)
    ? slugSegments.join("/")
    : slugSegments;
  const cleaned = slug.replace(/^\/+|\/+$/g, "");
  // Try direct file, then index.md inside the folder.
  const candidates = [
    path.join(CONTENT_ROOT, cleaned + ".md"),
    path.join(CONTENT_ROOT, cleaned, "index.md"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return readPageAt(c, CONTENT_ROOT);
  }
  return null;
}

/**
 * Build a nav tree from the markdown filesystem.
 * Folders become NavNode parents; their `index.md` (if any) populates href/title.
 */
export function getNav(): NavNode {
  const root: NavNode = { name: "", children: [] };
  for (const page of listAll()) {
    if (page.frontmatter.visibility === "invite") continue; // do not advertise gated pages in nav
    const segments = page.slug.split("/");
    let cursor = root;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const isLast = i === segments.length - 1;
      if (isLast && seg === "index") {
        // populate cursor metadata
        cursor.title = (page.frontmatter.title as string) ?? cursor.name;
        cursor.href = page.href.replace(/\/index$/, "");
        cursor.order = (page.frontmatter.order as number | undefined) ?? cursor.order;
        continue;
      }
      let next = cursor.children.find((c) => c.name === seg);
      if (!next) {
        next = { name: seg, children: [] };
        cursor.children.push(next);
      }
      if (isLast) {
        next.href = page.href;
        next.title = (page.frontmatter.title as string) ?? seg;
        next.order = page.frontmatter.order as number | undefined;
      }
      cursor = next;
    }
  }
  // Sort recursively by order then title.
  const sortNode = (n: NavNode) => {
    n.children.sort((a, b) => {
      const ao = a.order ?? 9999;
      const bo = b.order ?? 9999;
      if (ao !== bo) return ao - bo;
      return (a.title ?? a.name).localeCompare(b.title ?? b.name);
    });
    n.children.forEach(sortNode);
  };
  sortNode(root);
  return root;
}

/**
 * Render markdown body to HTML and extract a flat heading list (for "On this page").
 */
export async function renderMarkdown(
  body: string,
): Promise<{ html: string; headings: Heading[] }> {
  const cached = renderCache.get(body);
  if (cached) return cached;

  const headings: Heading[] = [];
  const headingExtractor = () => (tree: any) => {
    const visit = (node: any) => {
      if (
        node.type === "element" &&
        typeof node.tagName === "string" &&
        /^h[1-6]$/.test(node.tagName)
      ) {
        const depth = Number(node.tagName.substring(1));
        const id = node.properties?.id as string | undefined;
        const text = nodeText(node);
        if (id && text && depth <= 4) headings.push({ depth, text, id });
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
  const nodeText = (n: any): string => {
    if (n.type === "text") return n.value as string;
    if (Array.isArray(n.children)) return n.children.map(nodeText).join("");
    return "";
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: true,
    })
    .use(headingExtractor)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(body);

  const out = { html: String(file), headings };
  renderCache.set(body, out);
  return out;
}

export function getContentRoot(): string {
  return CONTENT_ROOT;
}

export function getRawMarkdown(slugSegments: string[] | string): string | null {
  const page = getPageBySlug(slugSegments);
  if (!page) return null;
  try {
    return fs.readFileSync(page.filePath, "utf8");
  } catch {
    return null;
  }
}
