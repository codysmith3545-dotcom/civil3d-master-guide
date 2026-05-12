import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseLandXml,
  emitCanonical,
  parseCoordTriples,
  parseCoordPairs,
  tokenizeNumbers,
} from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const fix = (name: string) =>
  readFileSync(join(here, "fixtures", name), "utf8");

describe("coords - parseCoordTriples", () => {
  it("parses three numbers into one tuple", () => {
    expect(parseCoordTriples("1 2 3")).toEqual([[1, 2, 3]]);
  });

  it("parses six numbers into two tuples", () => {
    expect(parseCoordTriples("1 2 3 4 5 6")).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("returns empty for empty string", () => {
    expect(parseCoordTriples("")).toEqual([]);
  });

  it("ignores trailing partial tuple", () => {
    expect(parseCoordTriples("1 2 3 4")).toEqual([[1, 2, 3]]);
  });

  it("handles tabs and newlines as separators", () => {
    expect(parseCoordTriples("1\t2\n3")).toEqual([[1, 2, 3]]);
  });

  it("preserves NaN in invalid token", () => {
    const out = parseCoordTriples("1 BAD 3");
    expect(out).toHaveLength(1);
    expect(Number.isNaN(out[0]![1])).toBe(true);
  });
});

describe("coords - parseCoordPairs", () => {
  it("parses pairs", () => {
    expect(parseCoordPairs("1 2 3 4")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("ignores trailing odd token", () => {
    expect(parseCoordPairs("1 2 3")).toEqual([[1, 2]]);
  });
});

describe("coords - tokenizeNumbers", () => {
  it("returns flat array, NaN preserved", () => {
    const out = tokenizeNumbers("1 BAD 3");
    expect(out).toHaveLength(3);
    expect(Number.isNaN(out[1]!)).toBe(true);
  });
});

describe("emit - canonical output", () => {
  it("round-trips simple element", () => {
    const root = parseLandXml('<LandXML version="1.2"/>');
    const out = emitCanonical(root);
    expect(out).toContain('<?xml version="1.0"');
    expect(out).toContain('<LandXML version="1.2"/>');
  });

  it("indents children by two spaces", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><Units><Imperial linearUnit="USSurveyFoot"/></Units></LandXML>',
    );
    const out = emitCanonical(root);
    expect(out).toContain("\n  <Units>");
    expect(out).toContain("\n    <Imperial");
  });

  it("escapes attribute values", () => {
    const root = parseLandXml(
      '<LandXML version="1.2" desc="a &amp; b"/>',
    );
    const out = emitCanonical(root);
    expect(out).toContain('desc="a &amp; b"');
  });

  it("preserves text content", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><P>100 200 300</P></LandXML>',
    );
    const out = emitCanonical(root);
    expect(out).toContain("100 200 300");
  });

  it("can omit prolog when requested", () => {
    const root = parseLandXml('<LandXML version="1.2"/>');
    const out = emitCanonical(root, { includeProlog: false });
    expect(out.startsWith("<LandXML")).toBe(true);
  });

  it("supports custom indent", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><A/></LandXML>',
    );
    const out = emitCanonical(root, { indent: "    " });
    expect(out).toContain("\n    <A/>");
  });

  it("re-parses canonical output to equivalent tree", () => {
    const original = parseLandXml(fix("valid-typical.xml"));
    const canonical = emitCanonical(original);
    const reparsed = parseLandXml(canonical);
    expect(reparsed.name).toBe(original.name);
    expect(reparsed.attrs).toEqual(original.attrs);
    expect(reparsed.children.length).toBe(original.children.length);
  });
});
