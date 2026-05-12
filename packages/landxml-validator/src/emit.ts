/**
 * Canonical XML emitter.
 *
 * Re-emit a parsed LandXmlElement tree with consistent indentation and
 * normalized whitespace inside attribute values. Useful for the "Download
 * cleaned" feature in the web tool.
 */

import type { LandXmlElement } from "./types.js";

const PROLOG = '<?xml version="1.0" encoding="UTF-8"?>\n';

function escapeAttr(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeText(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function emitElement(el: LandXmlElement, depth: number, indent: string): string {
  const pad = indent.repeat(depth);
  const attrEntries = Object.entries(el.attrs);
  const attrStr = attrEntries.length
    ? " " +
      attrEntries
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(" ")
    : "";

  const hasChildren = el.children.length > 0;
  const hasText = el.text !== undefined && el.text.trim() !== "";

  if (!hasChildren && !hasText) {
    return `${pad}<${el.name}${attrStr}/>`;
  }
  if (!hasChildren && hasText) {
    return `${pad}<${el.name}${attrStr}>${escapeText(el.text!.trim())}</${el.name}>`;
  }
  // Children: each on its own line, indented one level deeper.
  const lines: string[] = [`${pad}<${el.name}${attrStr}>`];
  if (hasText) {
    lines.push(`${pad}${indent}${escapeText(el.text!.trim())}`);
  }
  for (const c of el.children) {
    lines.push(emitElement(c, depth + 1, indent));
  }
  lines.push(`${pad}</${el.name}>`);
  return lines.join("\n");
}

/**
 * Emit a canonical XML document for the given root element. Two-space indent,
 * UTF-8 prolog, no extraneous whitespace.
 */
export function emitCanonical(
  root: LandXmlElement,
  options: { indent?: string; includeProlog?: boolean } = {},
): string {
  const indent = options.indent ?? "  ";
  const prolog = options.includeProlog === false ? "" : PROLOG;
  return prolog + emitElement(root, 0, indent) + "\n";
}
