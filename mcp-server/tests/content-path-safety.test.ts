import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { getPage, _resetCache } from "../src/content.js";
import {
  safeResolveContentPath,
  PathTraversalError,
} from "../src/path-safety.js";

describe("mcp-server safeResolveContentPath", () => {
  const ROOT = path.resolve("/tmp/mcp-test-root");

  it("rejects `..` traversal", () => {
    expect(() =>
      safeResolveContentPath(["civil3d", "..", "etc"], ROOT),
    ).toThrow(PathTraversalError);
  });

  it("rejects URL-encoded traversals", () => {
    expect(() => safeResolveContentPath("..%2fetc", ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects NUL byte", () => {
    expect(() => safeResolveContentPath(["foo\0"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects dotfile-style segments", () => {
    expect(() => safeResolveContentPath([".env"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("accepts a normal slug", () => {
    expect(safeResolveContentPath(["civil3d", "surfaces"], ROOT)).toBe(
      path.join(ROOT, "civil3d", "surfaces"),
    );
  });
});

describe("mcp-server getPage path safety integration", () => {
  let tmp: string;
  let outside: string;

  beforeAll(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-content-test-"));
    // Build a minimal repo layout: <tmp>/content/foo/bar.md and a sibling
    // file outside `content/` that we'll try to read via traversal.
    const contentDir = path.join(tmp, "content");
    await fs.mkdir(path.join(contentDir, "foo"), { recursive: true });
    await fs.writeFile(
      path.join(contentDir, "foo", "bar.md"),
      "---\ntitle: ok\n---\nhello",
    );
    outside = path.join(tmp, "secret.md");
    await fs.writeFile(outside, "---\ntitle: secret\n---\nsensitive");
    _resetCache();
  });

  afterAll(async () => {
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it("loads a normal page", async () => {
    const page = await getPage(tmp, "foo/bar");
    expect(page).not.toBeNull();
    expect(page?.title).toBe("ok");
  });

  it("returns null for a `..` traversal attempt", async () => {
    const page = await getPage(tmp, "../secret");
    expect(page).toBeNull();
  });

  it("returns null for a URL-encoded traversal", async () => {
    const page = await getPage(tmp, "..%2fsecret");
    expect(page).toBeNull();
  });

  it("returns null for an embedded slash with traversal", async () => {
    const page = await getPage(tmp, "foo/../../secret");
    expect(page).toBeNull();
  });

  it("returns null for absolute paths", async () => {
    const page = await getPage(tmp, "/etc/passwd");
    expect(page).toBeNull();
  });
});
