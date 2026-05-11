import { describe, it, expect, beforeAll } from "vitest";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(__dirname, "fixtures", "lisp");

// Force the LISP library to point at the fixture before importing the module
// (the module reads the env on each call, so setting it here is enough).
process.env.LISP_LIBRARY_DIR = FIXTURE_DIR;

let listLispRoutines: typeof import("../src/lisp.js").listLispRoutines;
let getLisp: typeof import("../src/lisp.js").getLisp;

beforeAll(async () => {
  const mod = await import("../src/lisp.js");
  listLispRoutines = mod.listLispRoutines;
  getLisp = mod.getLisp;
});

describe("listLispRoutines", () => {
  it("returns one entry per category fixture", async () => {
    const items = await listLispRoutines();
    expect(items.length).toBeGreaterThanOrEqual(2);
    const names = items.map((i) => i.name).sort();
    expect(names).toContain("lfrz-pattern");
    expect(names).toContain("point-dump");
  });

  it("populates command, category, summary, appliesTo from doc frontmatter", async () => {
    const items = await listLispRoutines();
    const lfrz = items.find((i) => i.name === "lfrz-pattern");
    expect(lfrz).toBeDefined();
    expect(lfrz!.command).toBe("LFRZ-PATTERN");
    expect(lfrz!.category).toBe("layer");
    expect(lfrz!.summary).toContain("Freeze");
    expect(lfrz!.appliesTo).toContain("civil3d-2024");
  });

  it("handles block-form appliesTo lists too", async () => {
    const items = await listLispRoutines();
    const pd = items.find((i) => i.name === "point-dump");
    expect(pd).toBeDefined();
    expect(pd!.appliesTo).toEqual(
      expect.arrayContaining(["civil3d-2024", "civil3d-2025"]),
    );
  });
});

describe("getLisp", () => {
  it("returns null for an unknown routine", async () => {
    const r = await getLisp("non-existent-routine");
    expect(r).toBeNull();
  });

  it("rejects path-traversal-style names", async () => {
    const r = await getLisp("../etc/passwd");
    expect(r).toBeNull();
  });

  it("returns the .lsp source and .md doc for a real routine", async () => {
    const r = await getLisp("lfrz-pattern");
    expect(r).not.toBeNull();
    expect(r!.meta.name).toBe("lfrz-pattern");
    expect(r!.meta.command).toBe("LFRZ-PATTERN");
    expect(r!.lspSource).toContain("defun c:LFRZ-PATTERN");
    expect(r!.docMarkdown).toContain("LFRZ-PATTERN");
  });
});
