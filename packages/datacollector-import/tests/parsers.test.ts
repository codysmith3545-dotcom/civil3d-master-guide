import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  detectFormat,
  exportCsv,
  exportLandXML,
  exportPnezd,
  importText,
} from "../src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = (n: string) => readFileSync(join(HERE, "fixtures", n), "utf8");

describe("parseGenericPnezd", () => {
  it("parses 5 valid PNEZD rows", () => {
    const r = importText(FIX("sample.pnezd.csv"), "generic-pnezd");
    expect(r.points).toHaveLength(5);
    expect(r.points[0]).toEqual({
      number: "1",
      northing: 5000,
      easting: 5000,
      elevation: 800,
      description: "IPF",
    });
    expect(r.warnings).toEqual([]);
  });

  it("rejects malformed rows with a warning", () => {
    const r = importText("1,bad,5000,800,desc\n2,5100,5050,801,REBAR", "generic-pnezd");
    expect(r.points).toHaveLength(1);
    expect(r.warnings.length).toBe(1);
  });
});

describe("parseGenericNezd", () => {
  it("parses NEZD rows and assigns sequential numbers", () => {
    const r = importText(FIX("sample.nezd.csv"), "generic-nezd");
    expect(r.points).toHaveLength(3);
    expect(r.points[0].number).toBe("1");
    expect(r.points[2].description).toBe("FENCE");
  });
});

describe("parseGenericPxyz", () => {
  it("treats X as easting and Y as northing", () => {
    const r = importText(FIX("sample.pxyz.csv"), "generic-pxyz");
    expect(r.points).toHaveLength(3);
    // First row is "1,5000,5000,800" — P,X,Y,Z. So easting=5000, northing=5000.
    expect(r.points[0].easting).toBe(5000);
    expect(r.points[0].northing).toBe(5000);
    // Second row "2,5050.250,5100.000,801.500" → easting=5050.25, northing=5100
    expect(r.points[1].easting).toBe(5050.25);
    expect(r.points[1].northing).toBe(5100);
    expect(r.points[1].elevation).toBe(801.5);
  });
});

describe("parseTrimbleCsv", () => {
  it("preserves descriptions with embedded commas inside quotes", () => {
    const r = importText(FIX("sample.trimble.csv"), "trimble-csv");
    expect(r.points).toHaveLength(4);
    expect(r.points[0].description).toBe("Iron pin found, capped LS 12345");
    expect(r.points[0].notes).toBe("CONTROL");
    expect(r.points[2].description).toBe("Tree, 24in oak");
  });
});

describe("parseTopconCsv", () => {
  it("extracts notes from the 6th column", () => {
    const r = importText(FIX("sample.topcon.csv"), "topcon-csv");
    expect(r.points).toHaveLength(3);
    expect(r.points[0].notes).toBe("Found and accepted");
    expect(r.points[1].description).toBe("REBAR");
  });
});

describe("parseCarlsonRw5", () => {
  it("extracts SP and GPS records and notes the rest as warnings", () => {
    const r = importText(FIX("sample.rw5"), "carlson-rw5");
    // Fixture has 3 SP + 1 GPS = 4 position records; JB, MO, OC, BK, SS get warned.
    expect(r.points).toHaveLength(4);
    expect(r.points[0]).toEqual({
      number: "1",
      northing: 5000,
      easting: 5000,
      elevation: 800,
      description: "CP1",
    });
    const gps = r.points.find((p) => p.number === "20");
    expect(gps?.description).toBe("GNSS_PT");
    expect(r.warnings.length).toBeGreaterThanOrEqual(4);
  });
});

describe("detectFormat", () => {
  it("detects each fixture correctly", () => {
    expect(detectFormat(FIX("sample.pnezd.csv"))).toBe("generic-pnezd");
    expect(detectFormat(FIX("sample.nezd.csv"))).toBe("generic-nezd");
    expect(detectFormat(FIX("sample.pxyz.csv"))).toBe("generic-pxyz");
    expect(detectFormat(FIX("sample.trimble.csv"))).toBe("trimble-csv");
    // Topcon has 6 cols, 5th alphabetic, 6th alphabetic → topcon
    expect(detectFormat(FIX("sample.topcon.csv"))).toBe("topcon-csv");
    expect(detectFormat(FIX("sample.rw5"))).toBe("carlson-rw5");
  });

  it("uses .rw5 extension as a hint", () => {
    expect(detectFormat("anything", "field.rw5")).toBe("carlson-rw5");
  });

  it("returns 'unknown' on garbage", () => {
    expect(detectFormat("just some prose without commas")).toBe("unknown");
  });
});

describe("exportPnezd round-trip", () => {
  it("re-imports identically after PNEZD export", () => {
    const original = importText(FIX("sample.pnezd.csv"), "generic-pnezd");
    const csv = exportPnezd(original.points);
    const round = importText(csv, "generic-pnezd");
    expect(round.points).toEqual(original.points);
  });

  it("can round-trip Trimble fixture through PNEZD (notes are dropped)", () => {
    const original = importText(FIX("sample.trimble.csv"), "trimble-csv");
    const csv = exportPnezd(original.points);
    const round = importText(csv, "generic-pnezd");
    expect(round.points).toHaveLength(original.points.length);
    expect(round.points[0].northing).toBe(original.points[0].northing);
    expect(round.points[0].description).toBe(original.points[0].description);
  });
});

describe("exportCsv with custom column order", () => {
  it("emits NEZD when given [N,E,Z,D]", () => {
    const r = importText(FIX("sample.pnezd.csv"), "generic-pnezd");
    const csv = exportCsv(r.points, ["N", "E", "Z", "D"]);
    const round = importText(csv, "generic-nezd");
    expect(round.points).toHaveLength(r.points.length);
    expect(round.points[0].easting).toBe(r.points[0].easting);
  });
});

describe("exportLandXML", () => {
  it("produces a CgPoints block with one CgPoint per input", () => {
    const r = importText(FIX("sample.pnezd.csv"), "generic-pnezd");
    const xml = exportLandXML(r.points);
    expect(xml).toContain("<CgPoints>");
    expect((xml.match(/<CgPoint /g) ?? []).length).toBe(r.points.length);
    expect(xml).toContain('name="1"');
    expect(xml).toContain("5000.000 5000.000 800.000");
  });

  it("escapes XML-significant characters in description", () => {
    const xml = exportLandXML([
      { number: "1", northing: 0, easting: 0, elevation: 0, description: "A & B <C>" },
    ]);
    expect(xml).toContain("A &amp; B &lt;C&gt;");
  });
});
