/**
 * content.test.mjs
 *
 * Walks content/**\/*.md, picks the first N pages, and for each fires a
 * GET /docs/<slug>. Asserts:
 *   - status is 200 (page not gated) or 403 (invite-only); never 5xx
 *   - if 200, the body contains the page's TL;DR substring extracted from
 *     the first blockquote of the markdown (best-effort; if no TL;DR found
 *     we just assert HTML envelope present).
 *
 * Why this suite exists:
 *   Catches "page renders 500 because remark plugin chokes on something in
 *   this one file". Cheap insurance for a 400+ page corpus.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { request as httpRequest } from "node:http";
import { createRunner, assertTrue, assertContains } from "./_lib.mjs";

/** Strip a leading YAML frontmatter block (--- ... ---) without a YAML parser. */
function stripFrontmatter(raw) {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return raw;
  const after = raw.indexOf("\n", end + 4);
  return after < 0 ? "" : raw.slice(after + 1);
}

const MAX_PAGES = 20;

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(url, { method: "GET" }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () =>
        resolve({
          status: res.statusCode ?? 0,
          body: Buffer.concat(chunks).toString("utf8"),
          headers: res.headers,
        }),
      );
    });
    req.on("error", reject);
    req.setTimeout(15_000, () => req.destroy(new Error(`timeout ${url}`)));
    req.end();
  });
}

async function walk(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith(".md")) out.push(full);
    }
  }
  out.sort();
  return out;
}

function extractTldr(body) {
  // first blockquote block: lines starting with > separated by non-blank
  const m = body.match(/^>\s*.+(?:\n>.*)*$/m);
  if (!m) return null;
  return m[0]
    .replace(/^>\s?/gm, "")
    .replace(/\*\*TL;DR:?\*\*/i, "")
    .replace(/^TL;DR:?\s*/i, "")
    .trim();
}

export async function run(ctx) {
  const r = createRunner("content");
  const contentRoot = path.join(ctx.repoRoot, "content");
  const files = await walk(contentRoot);
  if (files.length === 0) {
    r.skip("walk content/", "no .md files found");
    return r.finish();
  }

  const sample = files.slice(0, MAX_PAGES);
  for (const file of sample) {
    const rel = path.relative(contentRoot, file).replace(/\\/g, "/");
    const slug = rel.replace(/\.md$/, "");
    await r.test(`GET /docs/${slug}`, async () => {
      const raw = await fs.readFile(file, "utf8");
      const parsed = { content: stripFrontmatter(raw) };
      const url = `${ctx.baseUrl}/docs/${slug}`;
      const res = await httpGet(url);
      assertTrue(
        res.status === 200 || res.status === 403 || res.status === 404,
        `forbidden status ${res.status} on ${slug}`,
      );
      assertTrue(res.status < 500, `5xx on ${slug}`);
      if (res.status === 200) {
        // basic envelope
        assertContains(res.body, "<html", "html envelope");
        const tldr = extractTldr(parsed.content);
        if (tldr && tldr.length >= 20) {
          // The TL;DR is rendered (and may be HTML-escaped). Pick a stable
          // 20-char window without markdown link syntax to assert presence.
          const snippet = tldr
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[`*_]/g, "")
            .slice(0, 40)
            .trim();
          if (snippet.length >= 15) {
            assertTrue(
              res.body.includes(snippet) ||
                // some pages may collapse whitespace
                res.body.replace(/\s+/g, " ").includes(snippet.replace(/\s+/g, " ")),
              `TL;DR snippet not found in body: ${JSON.stringify(snippet)}`,
            );
          }
        }
      }
    });
  }

  return r.finish();
}
