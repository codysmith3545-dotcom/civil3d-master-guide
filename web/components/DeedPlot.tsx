"use client";

import { useMemo } from "react";
import type { PlottedTraverse } from "@/lib/deed-decoder";

interface Props {
  plotted: PlottedTraverse | null;
  highlightIndex?: number | null;
  width?: number;
  height?: number;
}

/**
 * Lightweight SVG renderer for a plotted traverse. This is intentionally a
 * fallback — once `@civil3d-master-guide/deed-plotter` ships a `renderSvg`,
 * the caller can opt into that for richer curve rendering. Here we draw
 * each course as a straight chord (curves are still drawn as their chord
 * line) plus start/end labels.
 *
 * Coordinate convention: surveying uses Northing (Y) and Easting (X), with
 * north positive. SVG y-axis is positive downward, so we flip the y-axis.
 */
export default function DeedPlot({
  plotted,
  highlightIndex = null,
  width = 480,
  height = 480,
}: Props) {
  const view = useMemo(() => {
    if (!plotted) return null;
    const { bbox } = plotted;
    const dx = Math.max(1, bbox.maxE - bbox.minE);
    const dy = Math.max(1, bbox.maxN - bbox.minN);
    const pad = Math.max(dx, dy) * 0.08;
    const minE = bbox.minE - pad;
    const minN = bbox.minN - pad;
    const w = dx + pad * 2;
    const h = dy + pad * 2;
    const scale = Math.min(width / w, height / h);
    const offsetX = (width - w * scale) / 2;
    const offsetY = (height - h * scale) / 2;
    const project = (p: { n: number; e: number }) => {
      const x = (p.e - minE) * scale + offsetX;
      // Flip Y so north points up.
      const y = height - ((p.n - minN) * scale + offsetY);
      return { x, y };
    };
    return { project, scale };
  }, [plotted, width, height]);

  if (!plotted) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-dashed border-ink-200 bg-ink-50 text-sm text-ink-500"
        style={{ width, height }}
      >
        Plotter package not yet integrated.
      </div>
    );
  }

  if (!view) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-dashed border-ink-200 bg-ink-50 text-sm text-ink-500"
        style={{ width, height }}
      >
        No geometry to render.
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-md border border-ink-100 bg-white"
      aria-label="Plotted deed traverse"
    >
      {plotted.courses.map((c, i) => {
        const a = view.project(c.start);
        const b = view.project(c.end);
        const isHi = highlightIndex === c.courseIndex;
        const stroke = isHi ? "#1e40af" : c.type === "curve" ? "#7c3aed" : "#111827";
        const strokeWidth = isHi ? 2.5 : 1.5;
        return (
          <g key={i}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <circle cx={a.x} cy={a.y} r={isHi ? 3 : 2} fill={stroke} />
            {i === plotted.courses.length - 1 && (
              <circle cx={b.x} cy={b.y} r={2} fill="#111827" />
            )}
          </g>
        );
      })}
      {/* north arrow */}
      <g transform={`translate(${width - 36}, 18)`}>
        <line x1="8" y1="20" x2="8" y2="0" stroke="#111827" strokeWidth="1" />
        <polygon points="4,4 8,0 12,4" fill="#111827" />
        <text x="8" y="34" textAnchor="middle" fontSize="10" fill="#374151">
          N
        </text>
      </g>
    </svg>
  );
}
