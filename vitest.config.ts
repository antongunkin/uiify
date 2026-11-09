import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    // Style tests run a full Tailwind compile (the uiify style compiles twice: adapter and own entry);
    // under the parallel `npm run checks` load they take 5–10 s, above Vitest's 5 s default.
    testTimeout: 30_000,
  },
});
