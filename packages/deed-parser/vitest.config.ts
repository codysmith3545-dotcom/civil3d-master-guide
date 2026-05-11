import { defineConfig } from "vitest/config";
import { existsSync } from "node:fs";
import * as path from "node:path";

/**
 * Local Vitest config for @civil3d-master-guide/deed-parser.
 *
 * The package uses TypeScript NodeNext module resolution, where relative
 * imports must end in ".js" even though the source files are ".ts". The
 * resolver plugin below rewrites those ".js" imports to the matching ".ts"
 * file when one exists, so tests can import directly from src/** without
 * going through dist/.
 *
 * Matches the pattern in the repo-root vitest.config.ts.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
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
