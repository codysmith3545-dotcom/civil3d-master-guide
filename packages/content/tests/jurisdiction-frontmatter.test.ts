import { describe, it, expect } from "vitest";
import {
  parseFrontmatter,
  isJurisdictionPage,
  JURISDICTION_TYPED_FIELDS,
} from "../src/index.js";

describe("parseFrontmatter (jurisdiction typed fields)", () => {
  it("accepts a minimal frontmatter with no typed jurisdiction fields", () => {
    const { frontmatter, issues } = parseFrontmatter({
      title: "Hamilton County, Indiana",
      section: "jurisdictions/indiana/hamilton-county",
      order: 20,
      visibility: "public",
      updated: "2026-05-11",
    });
    expect(issues).toEqual([]);
    expect(frontmatter.title).toBe("Hamilton County, Indiana");
    expect(frontmatter.submittal_checklist).toBeUndefined();
  });

  it("parses a full submittal_checklist", () => {
    const { frontmatter, issues } = parseFrontmatter({
      title: "X",
      section: "jurisdictions/indiana/marion-county",
      submittal_checklist: [
        {
          id: "stamped-signed-by-licensed-surveyor",
          label: "Plat is stamped and signed by an Indiana-licensed land surveyor",
          category: "submittal",
          citation: "IC 25-21.5-1-15",
        },
        {
          id: "north-arrow",
          label: "North arrow shown",
          category: "drafting",
        },
      ],
    });
    expect(issues).toEqual([]);
    expect(frontmatter.submittal_checklist).toHaveLength(2);
    expect(frontmatter.submittal_checklist?.[0].category).toBe("submittal");
    expect(frontmatter.submittal_checklist?.[0].citation).toBe("IC 25-21.5-1-15");
  });

  it("flags a checklist item with an invalid category", () => {
    const { issues } = parseFrontmatter({
      submittal_checklist: [{ id: "x", label: "x", category: "bogus" }],
    });
    expect(issues.some((i) => i.field.includes("category"))).toBe(true);
  });

  it("parses setbacks with all three categories", () => {
    const { frontmatter, issues } = parseFrontmatter({
      setbacks: {
        residential: { front_ft: 25, side_ft: 6, rear_ft: 20, corner_side_ft: 15 },
        commercial: { front_ft: 30, side_ft: 10, rear_ft: 25 },
        agricultural: { front_ft: 50, side_ft: 25, rear_ft: 50 },
        citations: ["Indianapolis-Marion County Code Chapter 744"],
      },
    });
    expect(issues).toEqual([]);
    expect(frontmatter.setbacks?.residential?.front_ft).toBe(25);
    expect(frontmatter.setbacks?.commercial?.rear_ft).toBe(25);
    expect(frontmatter.setbacks?.citations?.[0]).toMatch(/Indianapolis/);
  });

  it("flags a setbacks numeric field that is a string", () => {
    const { issues } = parseFrontmatter({
      setbacks: { residential: { front_ft: "twenty-five" } },
    });
    expect(issues.some((i) => i.field === "setbacks.residential.front_ft")).toBe(true);
  });

  it("parses stormwater_thresholds with citations", () => {
    const { frontmatter, issues } = parseFrontmatter({
      stormwater_thresholds: {
        detention_trigger_sqft: 5000,
        water_quality_trigger_sqft: 5000,
        bmp_required_above_sqft: 5000,
        citations: ["Indy Stormwater Design and Specifications Manual"],
      },
    });
    expect(issues).toEqual([]);
    expect(frontmatter.stormwater_thresholds?.detention_trigger_sqft).toBe(5000);
  });

  it("parses recording_requirements with a paper size and ink color", () => {
    const { frontmatter, issues } = parseFrontmatter({
      recording_requirements: {
        paper_size: "8.5x14",
        margin_top_in: 2,
        margin_left_in: 0.5,
        margin_right_in: 0.5,
        margin_bottom_in: 0.5,
        ink_color: "black",
        fee_first_page_usd: 25,
        fee_each_additional_usd: 25,
        citations: ["IC 36-2-11-16.5"],
      },
    });
    expect(issues).toEqual([]);
    expect(frontmatter.recording_requirements?.paper_size).toBe("8.5x14");
    expect(frontmatter.recording_requirements?.ink_color).toBe("black");
  });

  it("flags an invalid paper size", () => {
    const { issues } = parseFrontmatter({
      recording_requirements: { paper_size: "A4" },
    });
    expect(issues.some((i) => i.field === "recording_requirements.paper_size")).toBe(true);
  });

  it("parses plat_requirements with notes", () => {
    const { frontmatter, issues } = parseFrontmatter({
      plat_requirements: [
        { item: "north arrow", required: true },
        { item: "monumentation table", required: true, notes: "Indiana-licensed surveyor seal alongside" },
        { item: "vicinity map", required: false },
      ],
    });
    expect(issues).toEqual([]);
    expect(frontmatter.plat_requirements).toHaveLength(3);
    expect(frontmatter.plat_requirements?.[1].notes).toMatch(/surveyor seal/);
  });

  it("flags a plat_requirements item missing required: boolean", () => {
    const { issues } = parseFrontmatter({
      plat_requirements: [{ item: "north arrow", required: "yes" }],
    });
    expect(issues.some((i) => i.field === "plat_requirements[0].required")).toBe(true);
  });

  it("preserves untouched existing fields alongside the new ones", () => {
    const { frontmatter, issues } = parseFrontmatter({
      title: "Carmel",
      section: "jurisdictions/indiana/hamilton-county/municipalities/carmel",
      tags: ["indiana", "hamilton-county", "carmel"],
      setbacks: { residential: { front_ft: 30 } },
    });
    expect(issues).toEqual([]);
    expect(frontmatter.title).toBe("Carmel");
    expect(frontmatter.tags).toEqual(["indiana", "hamilton-county", "carmel"]);
    expect(frontmatter.setbacks?.residential?.front_ft).toBe(30);
  });

  it("identifies a jurisdiction page from its section", () => {
    expect(isJurisdictionPage({ section: "jurisdictions/indiana/marion-county" })).toBe(true);
    expect(isJurisdictionPage({ section: "civil3d/surfaces" })).toBe(false);
  });

  it("exports the list of typed jurisdiction fields used by the linter", () => {
    expect(JURISDICTION_TYPED_FIELDS).toContain("submittal_checklist");
    expect(JURISDICTION_TYPED_FIELDS).toContain("plat_requirements");
    expect(JURISDICTION_TYPED_FIELDS).toHaveLength(5);
  });
});
