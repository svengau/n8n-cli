import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      extension: [".ts"],
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      reportsDirectory: "./.coverage",
    },
    exclude: ["build/**", ".history/**", "**/node_modules/**"],
    env: {},
  },
});
