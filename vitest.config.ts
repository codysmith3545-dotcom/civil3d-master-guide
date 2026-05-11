import { defineConfig } from "vitest/config";
import { existsSync } from "node:fs";
import * as path from "node:path";

/**
 * Vitest config for the Civil 3D Master Guide monorepo.
 *
 * Tests live at tests/** at the repo root, plus colocated *.test.ts files
 * inside mcp-server/src. The mcp-server uses TypeScript NodeNext module
 * resolution, where relative imports must end in ".js" even though the
 * source files are ".ts". The resolver plugin below rewrites those ".js"
 * imports to the matching ".ts" file when one exists, so tests can import
 * directly from mcp-server/src/** without going through dist/.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "mcp-server/src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  plugins: [
    {
      name: "rewrite-js-to-ts-for-nodenext-source",
      enforce: "pre",
      async resolveId(source, importer) {
        if (!importer) return null;
        if (!source.startsWith(".") && !source.startsWith("/")) return null;
        if (!source.endsWith(".js")) return null;
        const importerDir = path.dirname(importer);
        const absolute = path.resolve(importerDir, source);
        const tsCandidate = absolute.replace(/\.js$/, ".ts");
        if (existsSync(tsCandidate)) return tsCandidate;
        return null;
      },
    },
  ],
});
