/**
 * Pure-string SVG renderer for a PlottedTraverse.
 *
 * Plot conventions:
 *   - Input coordinates: (n, e) in feet, north up, east right.
 *   - SVG: origin top-left, y down. We flip y so north points up on screen.
 *   - Equal scaling for n and e so geometry is undistorted.
 *   - Closure error vector: red stroke from last end back to first start.
 *
 * SVG arcs: <path ... A rx ry x-axis-rotation large-arc-flag sweep-flag x y>.
 *   - large-arc-flag = 1 if Δ > 180°, else 0
 *   - sweep-flag: in SVG y-down coordinates, sweep-flag = 1 means the arc
 *     is drawn in the positive-angle (clockwise on the rendered page)
 *     direction. Because we flip y in the viewport, the "right" curve in
 *     ground coordinates (clockwise looking N-up) renders clockwise on the
 *     page too — sweep-flag = 1.
 */

import type { PlottedCourse, PlottedTraverse, Point, SvgOptions } from "./types.js";

const DEG = Math.PI / 180;

interface Transform {
  scale: number;
  /** SVG x = e * scale + offsetX */
  offsetX: number;
  /** SVG y = (maxN - n) * scale + offsetY  (flipped) */
  offsetY: number;
  maxN: number;
}

function makeTransform(
  plotted: PlottedTraverse,
  width: number,
  height: number,
  padding: number,
  extraPoints: Point[] = [],
): Transform {
  let { minN, maxN, minE, maxE } = plotted.bbox;
  for (const p of extraPoints) {
    if (p.n < minN) minN = p.n;
    if (p.n > maxN) maxN = p.n;
    if (p.e < minE) minE = p.e;
    if (p.e > maxE) maxE = p.e;
  }
  // Handle degenerate bbox.
  let nSpan = maxN - minN;
  let eSpan = maxE - minE;
  if (nSpan < 1e-9) nSpan = 1;
  if (eSpan < 1e-9) eSpan = 1;

  const availW = Math.max(1, width - 2 * padding);
  const availH = Math.max(1, height - 2 * padding);
  const scale = Math.min(availW / eSpan, availH / nSpan);

  // Center the geometry.
  const drawnW = eSpan * scale;
  const drawnH = nSpan * scale;
  const offsetX = padding + (availW - drawnW) / 2 - minE * scale;
  const offsetY = padding + (availH - drawnH) / 2;

  return { scale, offsetX, offsetY, maxN };
}

function project(p: Point, t: Transform): { x: number; y: number } {
  return {
    x: p.e * t.scale + t.offsetX,
    y: (t.maxN - p.n) * t.scale + t.offsetY,
  };
}

function fmt(n: number): string {
  if (!isFinite(n)) return "0";
  // Trim to 3 decimals; SVG doesn't need more precision than this.
  return (Math.round(n * 1000) / 1000).toString();
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function midpoint(a: Point, b: Point): Point {
  return { n: (a.n + b.n) / 2, e: (a.e + b.e) / 2 };
}

function bearingLabel(courseRaw: string): string {
  // Pull a short label from the raw text. Limit length so the SVG stays small.
  const trimmed = courseRaw.replace(/\s+/g, " ").trim();
  return trimmed.length > 50 ? trimmed.slice(0, 47) + "..." : trimmed;
}

export function renderSvg(plotted: PlottedTraverse, options: SvgOptions = {}): string {
  const width = options.widthPx ?? 600;
  const height = options.heightPx ?? 600;
  const padding = options.paddingPx ?? 20;
  const showLabels = options.showLabels ?? true;
  const showClosureError = options.showClosureError ?? true;
  const monuments = options.monumentPoints ?? [];

  const extra = monuments.map((m) => m.point);
  const t = makeTransform(plotted, width, height, padding, extra);

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(width)} ${fmt(height)}" width="${fmt(width)}" height="${fmt(height)}">`,
  );
  parts.push(`<rect x="0" y="0" width="${fmt(width)}" height="${fmt(height)}" fill="white" />`);

  // Build the boundary path.
  if (plotted.courses.length > 0) {
    const first = plotted.courses[0];
    const startPx = project(first.start, t);
    let d = `M ${fmt(startPx.x)} ${fmt(startPx.y)}`;

    for (const c of plotted.courses) {
      d += " " + courseToPathSegment(c, t);
    }

    parts.push(`<path d="${d}" fill="none" stroke="black" stroke-width="1" />`);

    // Per-course labels.
    if (showLabels) {
      for (const c of plotted.courses) {
        parts.push(labelForCourse(c, t));
      }
    }
  }

  // Closure error vector.
  if (showClosureError && plotted.courses.length > 0) {
    const last = plotted.courses[plotted.courses.length - 1].end;
    const first = plotted.courses[0].start;
    const { closureErrorN, closureErrorE } = plotted.closure;
    if (Math.hypot(closureErrorN, closureErrorE) > 1e-6) {
      const a = project(last, t);
      const b = project(first, t);
      parts.push(
        `<line x1="${fmt(a.x)}" y1="${fmt(a.y)}" x2="${fmt(b.x)}" y2="${fmt(b.y)}" stroke="red" stroke-width="1" stroke-dasharray="4 2" />`,
      );
    }
  }

  // Monument points.
  for (const m of monuments) {
    const p = project(m.point, t);
    parts.push(`<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="3" fill="black" />`);
    if (m.label) {
      parts.push(
        `<text x="${fmt(p.x + 5)}" y="${fmt(p.y - 5)}" font-family="sans-serif" font-size="10" fill="black">${escapeXml(m.label)}</text>`,
      );
    }
  }

  parts.push("</svg>");
  return parts.join("");
}

function courseToPathSegment(c: PlottedCourse, t: Transform): string {
  const endPx = project(c.end, t);
  if (c.type === "line") {
    return `L ${fmt(endPx.x)} ${fmt(endPx.y)}`;
  }
  // Arc: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  const r = c.radiusFt * t.scale;
  const largeArc = c.deltaDeg > 180 ? 1 : 0;
  // In screen space (y flipped from ground), a right-curving curve (which is
  // clockwise looking N-up in ground space) renders clockwise on screen.
  // SVG sweep-flag = 1 is the clockwise direction in the y-down page space.
  const sweep = c.direction === "right" ? 1 : 0;
  return `A ${fmt(r)} ${fmt(r)} 0 ${largeArc} ${sweep} ${fmt(endPx.x)} ${fmt(endPx.y)}`;
}

function labelForCourse(c: PlottedCourse, t: Transform): string {
  const mid = midpoint(c.start, c.end);
  const midPx = project(mid, t);
  // Offset perpendicular to the chord direction (course segment) by ~6px.
  const dx = c.end.e - c.start.e;
  const dy = c.end.n - c.start.n;
  const len = Math.hypot(dx, dy);
  let offX = 0;
  let offY = -10;
  if (len > 1e-9) {
    // Perpendicular: (-dy, dx) in (e, n) ground space. Project the offset
    // direction by the same scale, but with y flipped.
    const pe = -dy / len;
    const pn = dx / len;
    offX = pe * 6 * t.scale * 0; // perpendicular offset in pixels — we'll use a fixed pixel offset
    // Use simple fixed offset perpendicular in screen space.
    const screenDx = dx * t.scale;
    const screenDy = -dy * t.scale; // y is flipped
    const sLen = Math.hypot(screenDx, screenDy);
    if (sLen > 1e-9) {
      offX = (-screenDy / sLen) * 8;
      offY = (screenDx / sLen) * 8;
    }
    // suppress unused warnings
    void pe;
    void pn;
  }

  const label = bearingLabel(c.raw);
  return `<text x="${fmt(midPx.x + offX)}" y="${fmt(midPx.y + offY)}" font-family="sans-serif" font-size="10" fill="black" text-anchor="middle">${escapeXml(label)}</text>`;
}
