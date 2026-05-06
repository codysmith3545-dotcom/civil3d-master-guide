/**
 * Search for the MCP server.
 *
 * Delegates to @civil3d-master-guide/search for scoring and excerpt generation.
 * Re-exports the public API so existing imports in server.ts keep working.
 */

export { searchPages, type SearchHit } from "@civil3d-master-guide/search";
