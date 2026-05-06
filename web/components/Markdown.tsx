/**
 * Tiny server-rendered Markdown wrapper used by tools/landing pages that want
 * to inline a small markdown blob. The docs route does its own rendering.
 */
import { renderMarkdown } from "@/lib/content";

export default async function Markdown({ source }: { source: string }) {
  const { html } = await renderMarkdown(source);
  return (
    <div
      className="prose prose-ink max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
