import { describe, expect, it } from "vitest";
import { plotTraverse } from "../src/plot.js";
import { renderSvg } from "../src/svg.js";
import { smallSquare, curveHeavy, badClosure } from "./fixtures/index.js";

function countOccurrences(s: string, sub: string): number {
  let i = 0;
  let c = 0;
  while ((i = s.indexOf(sub, i)) !== -1) {
    c++;
    i += sub.length;
  }
  return c;
}

describe("renderSvg", () => {
  it("emits a top-level <svg> with viewBox and width/height", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, { widthPx: 400, heightPx: 400 });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain('viewBox="0 0 400 400"');
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="400"');
    expect(svg.endsWith("</svg>")).toBe(true);
  });

  it("renders a single <path> for the boundary", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, { showLabels: false, showClosureError: false });
    expect(countOccurrences(svg, "<path")).toBe(1);
  });

  it("contains no NaN strings", () => {
    const p = plotTraverse(curveHeavy);
    const svg = renderSvg(p);
    expect(svg).not.toContain("NaN");
    expect(svg).not.toContain("Infinity");
  });

  it("uses an A (arc) path command for curves", () => {
    const p = plotTraverse(curveHeavy);
    const svg = renderSvg(p);
    // The boundary path should contain one A command for the curve.
    const pathMatch = svg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    expect(pathMatch![1]).toMatch(/\sA\s/);
  });

  it("shows closure-error vector when traverse does not close", () => {
    const p = plotTraverse(badClosure);
    const svg = renderSvg(p, { showClosureError: true });
    expect(svg).toContain('stroke="red"');
  });

  it("omits closure-error vector on perfect close", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, { showClosureError: true });
    expect(svg).not.toContain('stroke="red"');
  });

  it("includes per-course labels when showLabels is true", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, { showLabels: true });
    // Each label is a <text> element.
    expect(countOccurrences(svg, "<text")).toBe(4);
  });

  it("hides per-course labels when showLabels is false", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, { showLabels: false, showClosureError: false });
    expect(countOccurrences(svg, "<text")).toBe(0);
  });

  it("draws monument circles and labels", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, {
      monumentPoints: [{ point: { n: 0, e: 0 }, label: "POB" }],
    });
    expect(countOccurrences(svg, "<circle")).toBe(1);
    expect(svg).toContain("POB");
  });

  it("uses default 600x600 dimensions", () => {
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p);
    expect(svg).toContain('viewBox="0 0 600 600"');
  });

  it("escapes XML special characters in labels", () => {
    // Monument label with characters that must be escaped.
    const p = plotTraverse(smallSquare);
    const svg = renderSvg(p, {
      monumentPoints: [{ point: { n: 0, e: 0 }, label: "A & B <test>" }],
    });
    expect(svg).toContain("A &amp; B &lt;test&gt;");
  });
});
