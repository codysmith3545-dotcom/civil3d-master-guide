import { defineConfig } from "vitest/config";
import * as path from "node:path";

export default defineConfig({
  // Anchor the project root to this directory so vitest doesn't walk up
  // and try to resolve sibling worktree files.
  root: __dirname,
  test: {
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
