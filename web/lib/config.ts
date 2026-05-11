/**
 * Centralised access to environment-driven configuration.
 *
 * This module is intentionally additive — other agents may also append
 * exports here, so keep entries self-contained. Do not throw at import
 * time: read defaults instead, and surface validation errors at the
 * call site that actually needs the value.
 */

/**
 * Whitespace-separated list of additional CSP `frame-ancestors`
 * sources allowed to embed `/embed/*` widgets in an iframe.
 *
 * Examples of valid values (each entry separated by spaces or newlines):
 *   https://example.edu
 *   https://*.wordpress.com
 *   https://blog.someuniversity.edu
 *
 * `'self'` is always included implicitly. If unset, the only allowed
 * embedder is the site itself (most restrictive default).
 */
export function getEmbedFrameAncestors(): string[] {
  const raw = process.env.EMBED_ALLOWED_FRAME_ANCESTORS ?? "";
  const extra = raw
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  // Always include 'self'. Deduplicate.
  const set = new Set<string>(["'self'", ...extra]);
  return Array.from(set);
}

/**
 * Build the `Content-Security-Policy` value used for `/embed/*` responses.
 * Only sets `frame-ancestors` — other CSP directives belong with the
 * security headers configured elsewhere (e.g. middleware).
 */
export function buildEmbedCspHeader(): string {
  const ancestors = getEmbedFrameAncestors().join(" ");
  return `frame-ancestors ${ancestors};`;
}
