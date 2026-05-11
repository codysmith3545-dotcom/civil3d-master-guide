import * as path from "node:path";

/**
 * Thrown when a requested slug attempts to escape the content root or
 * contains otherwise-disallowed segments. Mirror of the web/lib helper —
 * keep behaviour in sync with `web/lib/path-safety.ts`.
 */
export class PathTraversalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PathTraversalError";
  }
}

const FORBIDDEN_NAMES = new Set([".", ".."]);

function assertSafeSegment(segment: unknown): asserts segment is string {
  if (typeof segment !== "string") {
    throw new PathTraversalError("Path segment must be a string.");
  }
  if (segment.length === 0) {
    throw new PathTraversalError("Empty path segment is not allowed.");
  }
  if (segment.includes("\0")) {
    throw new PathTraversalError("Path segment contains NUL byte.");
  }
  const lower = segment.toLowerCase();
  if (
    lower.includes("%2f") ||
    lower.includes("%5c") ||
    lower.includes("%2e%2e")
  ) {
    throw new PathTraversalError(
      "Path segment contains URL-encoded separator or parent reference.",
    );
  }
  if (segment.includes("/") || segment.includes("\\")) {
    throw new PathTraversalError("Path segment contains an embedded separator.");
  }
  if (segment.includes("..")) {
    throw new PathTraversalError("Path segment contains a parent reference.");
  }
  if (segment.startsWith(".")) {
    throw new PathTraversalError("Path segments may not start with a dot.");
  }
  if (FORBIDDEN_NAMES.has(segment)) {
    throw new PathTraversalError("Reserved path segment.");
  }
}

/**
 * Resolve a slug (string or already split into segments) under `contentRoot`,
 * guaranteeing the returned absolute path is still rooted at `contentRoot`.
 * Throws `PathTraversalError` for any attempt to escape.
 */
export function safeResolveContentPath(
  slug: string[] | string,
  contentRoot: string,
): string {
  const segments = Array.isArray(slug)
    ? slug
    : String(slug)
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter(Boolean);

  if (segments.length === 0) {
    throw new PathTraversalError("Empty slug.");
  }

  for (const seg of segments) {
    assertSafeSegment(seg);
  }

  const root = path.resolve(contentRoot);
  const resolved = path.resolve(root, ...segments);
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    throw new PathTraversalError(
      `Resolved path escapes the content root: ${resolved}`,
    );
  }
  return resolved;
}
