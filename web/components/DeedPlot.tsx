"use client";

/**
 * DeedPlot — renders a pre-plotted traverse as inline SVG.
 *
 * The package `@civil3d-master-guide/deed-plotter` is responsible for the
 * actual geometry and SVG generation. This component is a thin wrapper that
 * runs renderSvg in-browser and injects the markup.
 *
 * Pass a PlottedTraverse object (the output of plotTraverse from the
 * deed-plotter package). The remaining props are SvgOptions and are
 * forwarded straight to renderSvg.
 */

import { useMemo } from "react";
import { renderSvg } from "@civil3d-master-guide/deed-plotter";
import type {
  PlottedTraverse,
  SvgOptions,
} from "@civil3d-master-guide/deed-plotter";

export interface DeedPlotProps extends SvgOptions {
  plotted: PlottedTraverse;
  className?: string;
}

export function DeedPlot({ plotted, className, ...svgOptions }: DeedPlotProps) {
  const svg = useMemo(() => renderSvg(plotted, svgOptions), [plotted, svgOptions]);

  return (
    <div
      className={className}
      // The package emits pure SVG markup, no scripts.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default DeedPlot;
