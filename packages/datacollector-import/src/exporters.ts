/**
 * Exporters: PNEZD CSV, custom column-order CSV, and minimal LandXML.
 */

import { csvField } from "./csv.js";
import type { DcCsvColumn, DcPoint } from "./types.js";

function fmtNum(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(digits);
}

export function exportPnezd(points: DcPoint[]): string {
  const lines = points.map((p) =>
    [
      csvField(p.number),
      fmtNum(p.northing),
      fmtNum(p.easting),
      fmtNum(p.elevation),
      csvField(p.description),
    ].join(","),
  );
  return lines.join("\n") + (lines.length > 0 ? "\n" : "");
}

export function exportCsv(points: DcPoint[], columns: DcCsvColumn[]): string {
  if (columns.length === 0) {
    throw new Error("exportCsv: columns must not be empty.");
  }
  const lines = points.map((p) =>
    columns
      .map((col) => {
        switch (col) {
          case "P":
            return csvField(p.number);
          case "N":
            return fmtNum(p.northing);
          case "E":
            return fmtNum(p.easting);
          case "Z":
            return fmtNum(p.elevation);
          case "D":
            return csvField(p.description);
        }
      })
      .join(","),
  );
  return lines.join("\n") + (lines.length > 0 ? "\n" : "");
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Minimal LandXML CgPoints export. LandXML stores coordinates as
 * `northing easting elevation` separated by whitespace.
 *
 * Reference: LandXML 1.2 schema, CgPoint element.
 *   http://www.landxml.org/schema/LandXML-1.2/LandXML-1.2.xsd
 */
export function exportLandXML(points: DcPoint[]): string {
  const now = new Date().toISOString();
  const head = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<LandXML xmlns="http://www.landxml.org/schema/LandXML-1.2" version="1.2"',
    `  date="${now.slice(0, 10)}" time="${now.slice(11, 19)}">`,
    "  <Units>",
    '    <Imperial areaUnit="squareFoot" linearUnit="USSurveyFoot" volumeUnit="cubicYard"',
    '      temperatureUnit="fahrenheit" pressureUnit="inchHG" angularUnit="decimal degrees" directionUnit="decimal degrees"/>',
    "  </Units>",
    "  <CgPoints>",
  ];
  const body = points.map((p) => {
    const attrs: string[] = [`name="${escapeXml(p.number)}"`];
    if (p.description) attrs.push(`desc="${escapeXml(p.description)}"`);
    return `    <CgPoint ${attrs.join(" ")}>${fmtNum(p.northing)} ${fmtNum(p.easting)} ${fmtNum(p.elevation)}</CgPoint>`;
  });
  const tail = ["  </CgPoints>", "</LandXML>", ""];
  return [...head, ...body, ...tail].join("\n");
}
