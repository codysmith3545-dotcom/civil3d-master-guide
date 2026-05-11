/**
 * MCP wrapper around @civil3d-master-guide/landxml-validator.
 *
 * Exposes a single async function for the MCP server to register as a tool.
 * Kept in its own file so the main server.ts only needs an APPEND-style
 * import + tool entry.
 */

import {
  parseLandXml,
  summarize,
  type LandXmlSummary,
} from "@civil3d-master-guide/landxml-validator";

export interface ValidateLandXmlInput {
  xml: string;
}

export async function validateLandXml(
  input: ValidateLandXmlInput,
): Promise<LandXmlSummary> {
  if (typeof input?.xml !== "string" || input.xml.trim() === "") {
    throw new Error("validateLandXml: `xml` must be a non-empty string.");
  }
  const root = parseLandXml(input.xml);
  return summarize(root);
}
