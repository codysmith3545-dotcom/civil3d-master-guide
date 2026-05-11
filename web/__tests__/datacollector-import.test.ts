/**
 * Smoke tests for the data-collector-import wiring.
 *
 * Doesn't render the React UI (that would require jsdom + RTL); instead it
 * checks that the parser package is reachable from the web workspace, that the
 * exported helpers match the shape the page consumes, and that the canonical
 * round-trip works through the same code path the UI calls.
 */

import { describe, expect, it } from "vitest";

import {
  detectFormat,
  exportCsv,
  exportLandXML,
  exportPnezd,
  importText,
  type DcCsvColumn,
  type DcPoint,
} from "@civil3d-master-guide/datacollector-import";

const PNEZD = "1,5000.000,5000.000,800.000,IPF\n2,5100.123,5050.456,801.250,REBAR\n";

describe("data-collector import wiring (web smoke)", () => {
  it("detects PNEZD from pasted text", () => {
    expect(detectFormat(PNEZD)).toBe("generic-pnezd");
  });

  it("parses PNEZD into the shape the UI expects", () => {
    const r = importText(PNEZD, "generic-pnezd");
    expect(r.points).toHaveLength(2);
    const p: DcPoint = r.points[0]!;
    expect(p.number).toBe("1");
    expect(p.northing).toBe(5000);
    expect(p.easting).toBe(5000);
    expect(p.elevation).toBe(800);
    expect(p.description).toBe("IPF");
  });

  it("round-trips PNEZD through exportPnezd", () => {
    const r = importText(PNEZD, "generic-pnezd");
    const csv = exportPnezd(r.points);
    const r2 = importText(csv, "generic-pnezd");
    expect(r2.points).toEqual(r.points);
  });

  it("exports custom column orders via exportCsv", () => {
    const r = importText(PNEZD, "generic-pnezd");
    const cols: DcCsvColumn[] = ["N", "E", "Z", "D"];
    const csv = exportCsv(r.points, cols);
    // First line should not start with the point number.
    const first = csv.split("\n")[0]!;
    expect(first.startsWith("5000")).toBe(true);
  });

  it("emits LandXML CgPoint elements", () => {
    const r = importText(PNEZD, "generic-pnezd");
    const xml = exportLandXML(r.points);
    expect(xml).toContain("<CgPoints>");
    expect((xml.match(/<CgPoint /g) ?? []).length).toBe(r.points.length);
  });

  it("detects Carlson RW5 by record-type token", () => {
    const rw5 = "JB,J,DT01-01-2026\nSP,PN1,N 1.0,E 2.0,EL 3.0,--TEST\n";
    expect(detectFormat(rw5)).toBe("carlson-rw5");
    const r = importText(rw5, "carlson-rw5");
    expect(r.points).toHaveLength(1);
    expect(r.points[0]!.description).toBe("TEST");
  });
});
