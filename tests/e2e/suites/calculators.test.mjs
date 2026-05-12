/**
 * calculators.test.mjs
 *
 * Re-imports calculator pure functions from the built mcp-server (dist/)
 * and runs them against small golden inputs. The values are sanity checks,
 * not high-precision regression tests — the point is to catch a calculator
 * silently returning NaN/undefined or throwing.
 *
 * Why this suite exists:
 *   The calculators are reused from MCP, the web UI, and (someday) the public
 *   REST API. A single regression here would silently break every surface.
 */

import path from "node:path";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { createRunner, assertEqual, assertTrue, assertClose } from "./_lib.mjs";

export async function run(ctx) {
  const r = createRunner("calculators");

  const distEntry = path.join(
    ctx.repoRoot,
    "mcp-server",
    "dist",
    "calculators",
    "index.js",
  );

  if (!existsSync(distEntry)) {
    r.skip("import compiled calculators", `${distEntry} not built`);
    return r.finish();
  }

  const calc = await import(pathToFileURL(distEntry).href);

  await r.test("verticalCurve (crest SSD @ 45 mph)", () => {
    const out = calc.verticalCurve({
      g1: 2,
      g2: -2,
      design_speed_mph: 45,
      type: "crest",
      criterion: "ssd",
    });
    assertTrue(typeof out.k_required === "number", "k_required is number");
    assertTrue(out.k_required > 0, "k_required > 0");
    assertTrue(out.l_required_ft > 0, "l_required_ft > 0");
  });

  await r.test("horizontalCurve", () => {
    const out = calc.horizontalCurve({
      r_ft: 500,
      delta_deg: 30,
      pi_station_ft: 1000,
    });
    assertTrue(out.l > 0, "arc length > 0");
    assertTrue(out.t > 0, "tangent > 0");
  });

  await r.test("rationalMethod", () => {
    const out = calc.rationalMethod({
      c: 0.5,
      i_in_hr: 4,
      a_acres: 10,
    });
    assertClose(out.q_cfs, 0.5 * 4 * 10, 0.01, "Q = CiA");
  });

  await r.test("manningsOpenChannel", () => {
    const out = calc.manningsOpenChannel({
      n: 0.013,
      area_sqft: 10,
      hyd_radius_ft: 1.25,
      slope_ft_ft: 0.005,
    });
    assertTrue(out.q_cfs > 0, "Q > 0");
    assertTrue(out.v_fps > 0, "v > 0");
  });

  await r.test("traverseClosure (closed square)", () => {
    // 100 ft square, perfect closure
    const out = calc.traverseClosure({
      legs: [
        { bearing_deg: 0, distance_ft: 100 },
        { bearing_deg: 90, distance_ft: 100 },
        { bearing_deg: 180, distance_ft: 100 },
        { bearing_deg: 270, distance_ft: 100 },
      ],
    });
    assertClose(out.perimeter_ft, 400, 1e-6, "perimeter");
    assertClose(out.linear_closure_ft, 0, 1e-6, "linear closure");
  });

  await r.test("inverse (north 100 ft)", () => {
    const out = calc.inverse({ n1: 0, e1: 0, n2: 100, e2: 0 });
    assertClose(out.distance_ft, 100, 1e-6, "distance");
    assertClose(out.azimuth_deg, 0, 1e-6, "azimuth 0");
  });

  await r.test("areaByCoordinates (10x10 square = 100 sf)", () => {
    const out = calc.areaByCoordinates({
      coordinates: [
        { northing: 0, easting: 0 },
        { northing: 0, easting: 10 },
        { northing: 10, easting: 10 },
        { northing: 10, easting: 0 },
      ],
    });
    assertClose(out.area_sqft, 100, 1e-6, "area_sqft");
  });

  await r.test("calculator index exports", () => {
    const expected = [
      "verticalCurve",
      "horizontalCurve",
      "rationalMethod",
      "manningsOpenChannel",
      "traverseClosure",
      "inverse",
      "areaByCoordinates",
    ];
    for (const name of expected) {
      assertTrue(typeof calc[name] === "function", `${name} export missing`);
    }
  });

  await r.test("invalid input handled (verticalCurve unknown speed)", () => {
    // Out-of-table speed must either throw, return a non-positive K, or
    // attach a notes warning — but it must not crash the process or return
    // NaN/undefined.
    let result = null;
    let threw = false;
    try {
      result = calc.verticalCurve({
        g1: 2,
        g2: -2,
        design_speed_mph: 999,
        type: "crest",
        criterion: "ssd",
      });
    } catch {
      threw = true;
    }
    if (!threw) {
      assertTrue(result != null, "non-null result if not thrown");
      assertTrue(
        typeof result.k_required === "number" && !Number.isNaN(result.k_required),
        "k_required is a real number",
      );
    }
  });

  return r.finish();
}
