import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { parseLandXml, validate, summarize } from "../src/index.js";
import type { ValidationIssue } from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const fix = (name: string) =>
  readFileSync(join(here, "fixtures", name), "utf8");

function load(name: string) {
  const root = parseLandXml(fix(name));
  return { root, issues: validate(root), summary: summarize(root) };
}

function codes(issues: ValidationIssue[]): string[] {
  return issues.map((i) => i.code);
}

describe("validate - MISSING_VERSION", () => {
  it("flags missing version as error", () => {
    const { issues } = load("missing-version.xml");
    expect(codes(issues)).toContain("MISSING_VERSION");
    const issue = issues.find((i) => i.code === "MISSING_VERSION")!;
    expect(issue.severity).toBe("error");
    expect(issue.xpath).toBe("/LandXML");
  });

  it("does not flag valid file", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("MISSING_VERSION");
  });
});

describe("validate - UNSUPPORTED_VERSION", () => {
  it("warns on version 0.9", () => {
    const { issues } = load("unsupported-version.xml");
    const issue = issues.find((i) => i.code === "UNSUPPORTED_VERSION")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("0.9");
  });

  it("accepts version 1.2", () => {
    const root = parseLandXml('<LandXML version="1.2"><Units><Imperial/></Units></LandXML>');
    expect(codes(validate(root))).not.toContain("UNSUPPORTED_VERSION");
  });

  it("accepts version 2.0", () => {
    const root = parseLandXml('<LandXML version="2.0"><Units><Imperial/></Units></LandXML>');
    expect(codes(validate(root))).not.toContain("UNSUPPORTED_VERSION");
  });
});

describe("validate - MISSING_UNITS", () => {
  it("warns when no <Units> block", () => {
    const { issues } = load("missing-units.xml");
    const issue = issues.find((i) => i.code === "MISSING_UNITS")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("warning");
  });

  it("does not warn when units present", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("MISSING_UNITS");
  });
});

describe("validate - MIXED_UNITS", () => {
  it("errors when both <Imperial> and <Metric> present", () => {
    const { issues } = load("mixed-units.xml");
    const issue = issues.find((i) => i.code === "MIXED_UNITS")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("error");
  });

  it("does not error for imperial-only", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("MIXED_UNITS");
  });
});

describe("validate - EMPTY_SURFACE", () => {
  it("warns on surface with no points", () => {
    const { issues } = load("empty-surface.xml");
    const issue = issues.find((i) => i.code === "EMPTY_SURFACE")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("EG-Empty");
  });

  it("does not warn on populated surface", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("EMPTY_SURFACE");
  });
});

describe("validate - ALIGNMENT_NO_GEOM", () => {
  it("errors when CoordGeom is empty", () => {
    const { issues } = load("alignment-no-geom.xml");
    const issue = issues.find((i) => i.code === "ALIGNMENT_NO_GEOM")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("error");
  });

  it("does not error for alignment with line geometry", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("ALIGNMENT_NO_GEOM");
  });
});

describe("validate - PARCEL_NOT_CLOSED", () => {
  it("warns when first/last vertex differ", () => {
    const { issues } = load("parcel-not-closed.xml");
    const issue = issues.find(
      (i) => i.code === "PARCEL_NOT_CLOSED" && i.message.includes("OPEN-LOT"),
    )!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("warning");
  });

  it("does not warn when parcel closes within 0.01", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("PARCEL_NOT_CLOSED");
  });
});

describe("validate - NEGATIVE_AREA", () => {
  it("warns when parcel area attribute is negative", () => {
    const { issues } = load("parcel-not-closed.xml");
    const issue = issues.find((i) => i.code === "NEGATIVE_AREA")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("warning");
    expect(issue.message).toContain("NEG-AREA");
  });

  it("does not warn for positive area", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("NEGATIVE_AREA");
  });
});

describe("validate - INVALID_COORD", () => {
  it("errors on NaN coordinate token", () => {
    const { issues } = load("bad-coords.xml");
    const issue = issues.find((i) => i.code === "INVALID_COORD")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("error");
  });
});

describe("validate - LARGE_COORD", () => {
  it("flags coordinates > 1e7 as info", () => {
    const { issues } = load("bad-coords.xml");
    const issue = issues.find((i) => i.code === "LARGE_COORD")!;
    expect(issue).toBeDefined();
    expect(issue.severity).toBe("info");
  });

  it("does not flag normal state-plane coordinates", () => {
    const { issues } = load("valid-typical.xml");
    expect(codes(issues)).not.toContain("LARGE_COORD");
  });
});

describe("summarize - structure", () => {
  it("captures schema version", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.schemaVersion).toBe("1.2");
  });

  it("captures application metadata", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.application?.name).toBe("Civil 3D");
    expect(summary.application?.version).toBe("2025");
    expect(summary.application?.manufacturer).toBe("Autodesk");
  });

  it("captures unit metadata", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.units?.linear).toBe("USSurveyFoot");
    expect(summary.units?.area).toBe("squareFoot");
  });

  it("counts surfaces and points", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.surfaces).toHaveLength(1);
    expect(summary.surfaces[0]!.pntCount).toBe(4);
    expect(summary.surfaces[0]!.faceCount).toBe(2);
  });

  it("computes elevation range from points", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.surfaces[0]!.minElev).toBe(800);
    expect(summary.surfaces[0]!.maxElev).toBe(808);
  });

  it("counts alignments and PVIs", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.alignments).toHaveLength(1);
    expect(summary.alignments[0]!.staStart).toBe(1000);
    expect(summary.alignments[0]!.staEnd).toBe(1500);
    expect(summary.alignments[0]!.pviCount).toBe(3);
  });

  it("counts parcels and area", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.parcels).toHaveLength(1);
    expect(summary.parcels[0]!.areaSqFt).toBe(10000);
  });

  it("counts CgPoints with northing/easting bounds", () => {
    const { summary } = load("valid-typical.xml");
    expect(summary.cgPoints.count).toBe(3);
    expect(summary.cgPoints.minNorthing).toBe(100);
    expect(summary.cgPoints.maxNorthing).toBe(200);
    expect(summary.cgPoints.minEasting).toBe(200);
    expect(summary.cgPoints.maxEasting).toBe(300);
  });

  it("splits issues into errors and warnings buckets", () => {
    const { summary } = load("missing-version.xml");
    expect(summary.errors.some((e) => e.code === "MISSING_VERSION")).toBe(true);
  });

  it("returns empty cgPoints stats when no points", () => {
    const { summary } = load("empty-surface.xml");
    expect(summary.cgPoints.count).toBe(0);
    expect(summary.cgPoints.minNorthing).toBe(0);
  });
});

describe("summarize - issues are partitioned correctly", () => {
  it("warning-only issue goes to warnings", () => {
    const { summary } = load("missing-units.xml");
    expect(
      summary.warnings.some((w) => w.code === "MISSING_UNITS"),
    ).toBe(true);
    expect(
      summary.errors.some((w) => w.code === "MISSING_UNITS"),
    ).toBe(false);
  });

  it("info severity goes to warnings bucket (non-error)", () => {
    const { summary } = load("bad-coords.xml");
    // LARGE_COORD is info; should be in warnings bucket per spec
    expect(summary.warnings.some((w) => w.code === "LARGE_COORD")).toBe(true);
  });

  it("error issue goes to errors", () => {
    const { summary } = load("mixed-units.xml");
    expect(summary.errors.some((e) => e.code === "MIXED_UNITS")).toBe(true);
  });
});
