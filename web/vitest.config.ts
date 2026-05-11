import { defineConfig } from "vitest/config";

/**
 * Vitest config for the `web` package. Only used for non-Next tests
 * (integration smoke tests). Next.js code is exercised through `next build`.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
  },
});
