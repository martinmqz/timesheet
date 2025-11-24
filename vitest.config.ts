import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,        // 👈 enables global expect/describe/it
    environment: "jsdom", // 👈 required for React component tests
    setupFiles: "./vitest.setup.ts",
  },
});