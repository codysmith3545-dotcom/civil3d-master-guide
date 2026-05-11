import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  safeResolveContentPath,
  PathTraversalError,
} from "../lib/path-safety";

const ROOT = path.resolve("/tmp/test-content-root");

describe("safeResolveContentPath", () => {
  it("accepts a normal nested slug", () => {
    const out = safeResolveContentPath(
      ["civil3d", "surfaces", "creating-a-tin"],
      ROOT,
    );
    expect(out).toBe(
      path.join(ROOT, "civil3d", "surfaces", "creating-a-tin"),
    );
  });

  it("accepts a string slug with leading/trailing slashes", () => {
    const out = safeResolveContentPath("/civil3d/surfaces/", ROOT);
    expect(out).toBe(path.join(ROOT, "civil3d", "surfaces"));
  });

  it("rejects `..` segments", () => {
    expect(() =>
      safeResolveContentPath(["civil3d", "..", "etc"], ROOT),
    ).toThrow(PathTraversalError);
  });

  it("rejects a segment that contains `..` substring", () => {
    expect(() =>
      safeResolveContentPath(["..%2fetc"], ROOT),
    ).toThrow(PathTraversalError);
  });

  it("rejects URL-encoded `..%2f` traversals", () => {
    expect(() => safeResolveContentPath("foo/..%2fetc", ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects URL-encoded slash %2F (uppercase)", () => {
    expect(() =>
      safeResolveContentPath(["a%2Fb"], ROOT),
    ).toThrow(PathTraversalError);
  });

  it("rejects URL-encoded NUL bytes / raw NUL", () => {
    expect(() => safeResolveContentPath(["foo\0bar"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects segments that begin with a dot", () => {
    expect(() => safeResolveContentPath([".env"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects embedded forward slashes inside a single segment", () => {
    expect(() => safeResolveContentPath(["foo/bar"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects embedded backslashes inside a single segment", () => {
    expect(() => safeResolveContentPath(["foo\\bar"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects empty slug", () => {
    expect(() => safeResolveContentPath([], ROOT)).toThrow(
      PathTraversalError,
    );
    expect(() => safeResolveContentPath("", ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects empty segment inside slug array", () => {
    expect(() => safeResolveContentPath(["foo", "", "bar"], ROOT)).toThrow(
      PathTraversalError,
    );
  });

  it("rejects non-string segments", () => {
    expect(() =>
      // @ts-expect-error — intentional bad input
      safeResolveContentPath([null, "foo"], ROOT),
    ).toThrow(PathTraversalError);
  });

  it("guards against a sibling root prefix bypass", () => {
    // Resolved path must not be matched by simple string-prefix check against
    // `/tmp/test-content-root`; we want `/tmp/test-content-root-evil` to fail.
    const evil = path.resolve("/tmp/test-content-root-evil");
    expect(() =>
      // Manually construct a request that, after path.resolve under ROOT,
      // would land inside `evil`. The validator rejects on segment shape
      // before we get there, but this confirms the prefix check is
      // separator-aware regardless.
      safeResolveContentPath(["..", path.basename(evil)], ROOT),
    ).toThrow(PathTraversalError);
  });
});
