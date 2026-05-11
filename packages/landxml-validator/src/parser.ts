/**
 * Minimal hand-rolled XML parser tailored for LandXML.
 *
 * LandXML files are well-formed XML and we never need to deal with
 * namespaces beyond the default LandXML schema, mixed content models,
 * or DOCTYPE declarations in any meaningful way. This keeps the parser
 * compact and dependency-free.
 *
 * Supported:
 *   - Elements with attributes (single or double quoted values)
 *   - Self-closing tags
 *   - Text content (including whitespace runs that surveyors care about,
 *     because <P> and <PntList3D> bodies are coordinate text)
 *   - Comments and CDATA sections (skipped / preserved as text)
 *   - The XML prolog and DOCTYPE (skipped)
 *   - Numeric and named character entities (lt, gt, amp, quot, apos)
 *
 * Not supported:
 *   - DTD validation
 *   - Namespace-aware lookups (consumer code can match suffixes if needed)
 *   - Mixed parents that contain both significant text and child elements;
 *     the parser keeps text on the element's `text` property and children
 *     are still appended, but ordering between the two is lost.
 */

import type { LandXmlElement } from "./types.js";

interface ParserState {
  src: string;
  i: number;
}

const NAME_RE = /^[A-Za-z_][\w\-.:]*/;

export class LandXmlParseError extends Error {
  public readonly position: number;
  public readonly line: number;
  public readonly column: number;
  constructor(message: string, src: string, position: number) {
    const before = src.slice(0, position);
    const line = (before.match(/\n/g)?.length ?? 0) + 1;
    const lastNl = before.lastIndexOf("\n");
    const column = lastNl < 0 ? position + 1 : position - lastNl;
    super(`${message} (line ${line}, col ${column})`);
    this.name = "LandXmlParseError";
    this.position = position;
    this.line = line;
    this.column = column;
  }
}

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, body: string) => {
    if (body.startsWith("#x") || body.startsWith("#X")) {
      const cp = parseInt(body.slice(2), 16);
      if (Number.isFinite(cp)) return String.fromCodePoint(cp);
      return m;
    }
    if (body.startsWith("#")) {
      const cp = parseInt(body.slice(1), 10);
      if (Number.isFinite(cp)) return String.fromCodePoint(cp);
      return m;
    }
    switch (body) {
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "amp":
        return "&";
      case "quot":
        return '"';
      case "apos":
        return "'";
      default:
        return m;
    }
  });
}

function skipWhitespace(state: ParserState): void {
  while (state.i < state.src.length && /\s/.test(state.src[state.i]!)) state.i++;
}

function startsWith(state: ParserState, s: string): boolean {
  return state.src.startsWith(s, state.i);
}

function readName(state: ParserState): string {
  const rest = state.src.slice(state.i);
  const m = rest.match(NAME_RE);
  if (!m) {
    throw new LandXmlParseError("Expected element name", state.src, state.i);
  }
  state.i += m[0].length;
  return m[0];
}

function readAttrValue(state: ParserState): string {
  const quote = state.src[state.i];
  if (quote !== '"' && quote !== "'") {
    throw new LandXmlParseError(
      "Expected attribute value (quoted)",
      state.src,
      state.i,
    );
  }
  state.i++;
  const start = state.i;
  while (state.i < state.src.length && state.src[state.i] !== quote) state.i++;
  if (state.i >= state.src.length) {
    throw new LandXmlParseError("Unterminated attribute value", state.src, start);
  }
  const raw = state.src.slice(start, state.i);
  state.i++; // consume closing quote
  return decodeEntities(raw);
}

function readAttrs(state: ParserState): Record<string, string> {
  const attrs: Record<string, string> = {};
  while (state.i < state.src.length) {
    skipWhitespace(state);
    const ch = state.src[state.i];
    if (ch === ">" || ch === "/" || ch === undefined) break;
    const name = readName(state);
    skipWhitespace(state);
    if (state.src[state.i] !== "=") {
      // Boolean attribute (uncommon in LandXML, but handle gracefully)
      attrs[name] = "";
      continue;
    }
    state.i++; // consume =
    skipWhitespace(state);
    attrs[name] = readAttrValue(state);
  }
  return attrs;
}

function skipComment(state: ParserState): void {
  // assumes <!-- already matched
  state.i += 4;
  const end = state.src.indexOf("-->", state.i);
  if (end < 0) {
    throw new LandXmlParseError("Unterminated comment", state.src, state.i - 4);
  }
  state.i = end + 3;
}

function skipProlog(state: ParserState): void {
  // <?xml ... ?>
  state.i += 2;
  const end = state.src.indexOf("?>", state.i);
  if (end < 0) {
    throw new LandXmlParseError("Unterminated XML prolog", state.src, state.i - 2);
  }
  state.i = end + 2;
}

function skipDoctype(state: ParserState): void {
  // <!DOCTYPE ... >
  // Handle bracketed internal subsets minimally.
  state.i += 2;
  let depth = 0;
  while (state.i < state.src.length) {
    const ch = state.src[state.i]!;
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    else if (ch === ">" && depth <= 0) {
      state.i++;
      return;
    }
    state.i++;
  }
  throw new LandXmlParseError("Unterminated DOCTYPE", state.src, state.i);
}

function readCData(state: ParserState): string {
  // assumes <![CDATA[ already matched
  state.i += 9;
  const end = state.src.indexOf("]]>", state.i);
  if (end < 0) {
    throw new LandXmlParseError("Unterminated CDATA", state.src, state.i - 9);
  }
  const text = state.src.slice(state.i, end);
  state.i = end + 3;
  return text;
}

interface ParseElementResult {
  element: LandXmlElement;
}

function parseElement(state: ParserState): ParseElementResult {
  if (state.src[state.i] !== "<") {
    throw new LandXmlParseError("Expected '<'", state.src, state.i);
  }
  state.i++;
  const name = readName(state);
  const attrs = readAttrs(state);
  skipWhitespace(state);
  const element: LandXmlElement = { name, attrs, children: [] };
  if (startsWith(state, "/>")) {
    state.i += 2;
    return { element };
  }
  if (state.src[state.i] !== ">") {
    throw new LandXmlParseError(
      `Expected '>' or '/>' after <${name}>`,
      state.src,
      state.i,
    );
  }
  state.i++;
  // parse content until matching </name>
  const textChunks: string[] = [];
  while (state.i < state.src.length) {
    if (startsWith(state, "</")) {
      state.i += 2;
      const closeName = readName(state);
      skipWhitespace(state);
      if (state.src[state.i] !== ">") {
        throw new LandXmlParseError(
          `Expected '>' to close </${closeName}>`,
          state.src,
          state.i,
        );
      }
      state.i++;
      if (closeName !== name) {
        throw new LandXmlParseError(
          `Mismatched close tag: expected </${name}>, got </${closeName}>`,
          state.src,
          state.i,
        );
      }
      break;
    }
    if (startsWith(state, "<!--")) {
      skipComment(state);
      continue;
    }
    if (startsWith(state, "<![CDATA[")) {
      textChunks.push(readCData(state));
      continue;
    }
    if (state.src[state.i] === "<") {
      const child = parseElement(state).element;
      element.children.push(child);
      continue;
    }
    // text
    const start = state.i;
    while (state.i < state.src.length && state.src[state.i] !== "<") state.i++;
    textChunks.push(decodeEntities(state.src.slice(start, state.i)));
  }
  const joined = textChunks.join("");
  // Only keep text if it has non-whitespace content; trim outer ws.
  const trimmed = joined.trim();
  if (trimmed.length > 0) element.text = trimmed;
  return { element };
}

/**
 * Parse a LandXML document and return the root element.
 * Throws LandXmlParseError on malformed input.
 */
export function parseLandXml(xml: string): LandXmlElement {
  if (typeof xml !== "string") {
    throw new TypeError("parseLandXml expects a string");
  }
  const state: ParserState = { src: xml, i: 0 };
  while (state.i < state.src.length) {
    skipWhitespace(state);
    if (state.i >= state.src.length) break;
    if (startsWith(state, "<?")) {
      skipProlog(state);
      continue;
    }
    if (startsWith(state, "<!--")) {
      skipComment(state);
      continue;
    }
    if (startsWith(state, "<!DOCTYPE") || startsWith(state, "<!doctype")) {
      skipDoctype(state);
      continue;
    }
    if (state.src[state.i] === "<") {
      const { element } = parseElement(state);
      // Allow trailing whitespace / comments after root.
      while (state.i < state.src.length) {
        skipWhitespace(state);
        if (startsWith(state, "<!--")) {
          skipComment(state);
          continue;
        }
        if (state.i < state.src.length) {
          throw new LandXmlParseError(
            "Unexpected content after root element",
            state.src,
            state.i,
          );
        }
      }
      return element;
    }
    throw new LandXmlParseError("Unexpected character", state.src, state.i);
  }
  throw new LandXmlParseError("Empty document", state.src, 0);
}

/**
 * Find the first descendant element with the given local name (case-sensitive).
 * BFS starting from `root` (root itself is excluded unless `includeSelf`).
 */
export function findFirst(
  root: LandXmlElement,
  name: string,
  includeSelf = false,
): LandXmlElement | undefined {
  if (includeSelf && root.name === name) return root;
  const queue: LandXmlElement[] = [...root.children];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.name === name) return node;
    queue.push(...node.children);
  }
  return undefined;
}

/**
 * Find all descendant elements with the given local name (case-sensitive).
 * BFS, root excluded unless `includeSelf`.
 */
export function findAll(
  root: LandXmlElement,
  name: string,
  includeSelf = false,
): LandXmlElement[] {
  const out: LandXmlElement[] = [];
  if (includeSelf && root.name === name) out.push(root);
  const queue: LandXmlElement[] = [...root.children];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.name === name) out.push(node);
    queue.push(...node.children);
  }
  return out;
}

/**
 * Direct (non-recursive) children with the given name.
 */
export function childrenNamed(
  parent: LandXmlElement,
  name: string,
): LandXmlElement[] {
  return parent.children.filter((c) => c.name === name);
}
