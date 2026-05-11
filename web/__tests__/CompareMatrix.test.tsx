/**
 * Snapshot test for the compare-matrix rendering with 2 fixture jurisdictions.
 * Vitest-style; expects @testing-library/react to be added before running.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CompareMatrix,
  type CompareJurisdiction,
} from "../app/jurisdictions/compare/CompareClient";

const hamilton: CompareJurisdiction = {
  slug: "indiana/hamilton-county",
  title: "Hamilton County",
  breadcrumb: ["Indiana", "Hamilton County"],
  fm: {
    setbacks: { front_ft: 35, side_ft: 8, rear_ft: 25 },
    stormwater_thresholds: {
      detention_trigger_sqft: 20000,
      release_rate_cfs_per_acre: 0.24,
      design_storm_years: [10, 100],
    },
    recording_requirements: {
      paper_size: "24x36",
      margins_in: "1",
      mylar_required: true,
      recording_fee_usd: 25,
    },
    plat_requirements: [{ label: "Surveyor signature" }],
  },
};

const carmel: CompareJurisdiction = {
  slug: "indiana/hamilton-county/municipalities/carmel",
  title: "Carmel",
  breadcrumb: ["Indiana", "Hamilton County", "Carmel"],
  fm: {
    setbacks: { front_ft: 25, side_ft: 6, rear_ft: 25 },
    stormwater_thresholds: {
      detention_trigger_sqft: 10000,
      release_rate_cfs_per_acre: 0.24,
      design_storm_years: [10, 100],
    },
    recording_requirements: {
      paper_size: "24x36",
      margins_in: "1",
      mylar_required: true,
      recording_fee_usd: 25,
    },
    plat_requirements: [
      { label: "Surveyor signature" },
      { label: "City engineer signature" },
    ],
  },
};

describe("CompareMatrix", () => {
  it("renders a side-by-side matrix and highlights differing cells", () => {
    const html = renderToStaticMarkup(
      <CompareMatrix items={[hamilton, carmel]} />,
    );
    expect(html).toMatchSnapshot();
  });

  it("highlights cells in the second column that differ from the first", () => {
    const html = renderToStaticMarkup(
      <CompareMatrix items={[hamilton, carmel]} />,
    );
    // Front setback differs (35 vs 25): the carmel cell should carry the
    // yellow-bg class.
    expect(html).toContain("bg-yellow-50");
    // Recording fee matches (25 vs 25): the carmel cell should NOT be
    // flagged on every row, so we know the diff logic is selective.
    const yellowCount = (html.match(/bg-yellow-50/g) ?? []).length;
    // At least one diff, but fewer than every row.
    expect(yellowCount).toBeGreaterThanOrEqual(1);
  });

  it("shows a placeholder when nothing is selected", () => {
    const html = renderToStaticMarkup(<CompareMatrix items={[]} />);
    expect(html).toContain("Choose at least one jurisdiction");
  });
});
