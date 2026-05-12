import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { decodeDeed, MAX_INPUT_BYTES } from "../src/decode-deed.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(__dirname, "fixtures", "deeds");

interface FixtureEntry {
  filename: string;
  expectedCourseCount: number;
  expectedClosurePrecision: string;
  category: string;
  expectedUnparsedFragments?: number;
}

interface FixtureIndex {
  note: string;
  expectedClosurePrecisionNote: string;
  fixtures: FixtureEntry[];
}

const index: FixtureIndex = JSON.parse(
  readFileSync(join(FIXTURE_DIR, "_index.json"), "utf8"),
);

describe("decode_deed fixture corpus", () => {
  it("has 20 fixtures listed in _index.json", () => {
    expect(index.fixtures.length).toBe(20);
  });

  it("every .txt fixture is described in _index.json", () => {
    const txtFiles = readdirSync(FIXTURE_DIR)
      .filter((f) => f.endsWith(".txt"))
      .sort();
    const listed = new Set(index.fixtures.map((f) => f.filename));
    for (const t of txtFiles) {
      expect(listed.has(t), `unindexed fixture: ${t}`).toBe(true);
    }
    expect(txtFiles.length).toBe(20);
  });

  for (const entry of index.fixtures) {
    it(`round-trips fixture: ${entry.filename}`, async () => {
      const text = readFileSync(join(FIXTURE_DIR, entry.filename), "utf8");
      const result = await decodeDeed({ text });

      // Course count (allow some leniency for stressor noise)
      if (entry.category === "stressor") {
        expect(result.summary.courseCount).toBeGreaterThanOrEqual(
          Math.max(1, entry.expectedCourseCount - 1),
        );
      } else {
        expect(result.summary.courseCount).toBe(entry.expectedCourseCount);
      }

      // Plotter present when course count >= 2
      if (result.summary.courseCount >= 2) {
        expect(result.plotted).toBeDefined();
        expect(Number.isFinite(result.plotted!.perimeterFt)).toBe(true);
        expect(Number.isFinite(result.plotted!.closureFt)).toBe(true);
        // precisionRatio may be Infinity for a perfectly-closed traverse;
        // still required to be > 0 (so not NaN, not -ve).
        expect(result.plotted!.precisionRatio).toBeGreaterThan(0);
      }

      // Unparsed fragments
      if (entry.expectedUnparsedFragments != null) {
        expect(result.summary.unparsedFragments).toBeGreaterThanOrEqual(
          entry.expectedUnparsedFragments,
        );
      }

      // summary parserSource / plotterSource are present and valid
      expect(["sibling", "fallback"]).toContain(result.summary.parserSource);
      expect(["sibling", "fallback", "unavailable"]).toContain(
        result.summary.plotterSource,
      );
    });
  }
});

describe("decode_deed shape", () => {
  it("returns the DecodeDeedResult shape on a simple input", async () => {
    const text = readFileSync(
      join(FIXTURE_DIR, "03-hamilton-rectangle.txt"),
      "utf8",
    );
    const result = await decodeDeed({ text });
    expect(result).toHaveProperty("parsed");
    expect(result.parsed).toHaveProperty("courses");
    expect(result.parsed).toHaveProperty("unparsed");
    expect(result.parsed).toHaveProperty("normalizedText");
    expect(result).toHaveProperty("summary");
    expect(result.summary.courseCount).toBeGreaterThan(0);
    expect(result.summary.lineCourses + result.summary.curveCourses).toBe(
      result.summary.courseCount,
    );
  });

  it("rectangle fixtures close tightly", async () => {
    const text = readFileSync(
      join(FIXTURE_DIR, "03-hamilton-rectangle.txt"),
      "utf8",
    );
    const result = await decodeDeed({ text });
    expect(result.plotted).toBeDefined();
    expect(result.plotted!.closureFt).toBeLessThan(0.01);
    expect(result.plotted!.precisionRatio).toBeGreaterThan(50000);
    // 5 acres exactly: 660 x 330 ft = 217800 sqft = 5 acres
    expect(result.plotted!.areaAcres).toBeGreaterThan(4.99);
    expect(result.plotted!.areaAcres).toBeLessThan(5.01);
  });

  it("due-cardinal fixture parses all four courses", async () => {
    const text = readFileSync(
      join(FIXTURE_DIR, "20-edge-due-east-west.txt"),
      "utf8",
    );
    const result = await decodeDeed({ text });
    expect(result.summary.courseCount).toBe(4);
    expect(result.plotted!.closureFt).toBeLessThan(0.01);
  });
});

describe("decode_deed input validation", () => {
  it("rejects empty input", async () => {
    await expect(decodeDeed({ text: "" })).rejects.toThrow();
    await expect(decodeDeed({ text: "   " })).rejects.toThrow();
  });

  it("rejects input exceeding the byte cap", async () => {
    const huge = "thence North 00 degrees 00 minutes 00 seconds East, 100.00 feet; ".repeat(2000);
    expect(Buffer.byteLength(huge, "utf8")).toBeGreaterThan(MAX_INPUT_BYTES);
    await expect(decodeDeed({ text: huge })).rejects.toThrow(/exceeds/);
  });

  it("accepts input near but under the byte cap", async () => {
    // Build a string a couple KB under the cap
    const chunk = "thence North 12 degrees 34 minutes 56 seconds East, 100.00 feet; ";
    let big = "";
    while (Buffer.byteLength(big, "utf8") + chunk.length < MAX_INPUT_BYTES - 1000) {
      big += chunk;
    }
    const result = await decodeDeed({ text: big });
    expect(result.summary.courseCount).toBeGreaterThan(0);
  });
});

describe("decode_deed MCP-handler shape", () => {
  it("matches the DecodeDeedResult contract", async () => {
    const text = readFileSync(
      join(FIXTURE_DIR, "01-marion-simple-square.txt"),
      "utf8",
    );
    const result = await decodeDeed({ text });
    // shape
    expect(typeof result.summary.courseCount).toBe("number");
    expect(typeof result.summary.lineCourses).toBe("number");
    expect(typeof result.summary.curveCourses).toBe("number");
    expect(typeof result.summary.unparsedFragments).toBe("number");
    expect(Array.isArray(result.parsed.courses)).toBe(true);
    expect(Array.isArray(result.parsed.unparsed)).toBe(true);
    expect(typeof result.parsed.normalizedText).toBe("string");
  });
});
