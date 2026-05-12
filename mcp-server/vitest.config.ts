import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // jurisdiction-rules.test.ts uses node:test (compiled via tsconfig.test.json).
    exclude: [
      "tests/jurisdiction-rules.test.ts",
      "node_modules/**",
      "dist/**",
      "dist-tests/**",
    ],
    environment: "node",
  },
});
