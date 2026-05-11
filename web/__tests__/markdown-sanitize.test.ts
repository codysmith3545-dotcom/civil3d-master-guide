import { describe, it, expect } from "vitest";
import { renderMarkdown } from "../lib/content";

describe("markdown sanitization", () => {
  it("strips inline <script> tags from authored markdown", async () => {
    const body = `# hello\n\n<script>alert('xss')</script>\n\ntext`;
    const { html } = await renderMarkdown(body);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert(");
  });

  it("strips on* event handler attributes", async () => {
    const body = `<a href="https://example.com" onclick="alert(1)">link</a>`;
    const { html } = await renderMarkdown(body);
    expect(html.toLowerCase()).not.toContain("onclick");
  });

  it("strips javascript: URLs from anchor hrefs", async () => {
    const body = `[click me](javascript:alert(1))`;
    const { html } = await renderMarkdown(body);
    expect(html.toLowerCase()).not.toContain("javascript:");
  });

  it("strips <iframe> tags", async () => {
    const body = `before\n\n<iframe src="https://evil.example"></iframe>\n\nafter`;
    const { html } = await renderMarkdown(body);
    expect(html).not.toContain("<iframe");
  });

  it("preserves code blocks and headings", async () => {
    const body = "# Heading\n\nSome text.\n\n```ts\nconst x = 1;\n```\n";
    const { html, headings } = await renderMarkdown(body);
    expect(html).toContain("Heading");
    expect(html).toMatch(/<pre|<code/);
    expect(headings.length).toBeGreaterThan(0);
  });
});
