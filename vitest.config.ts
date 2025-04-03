import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    globals: true,
    setupFiles: ["./test/setup.ts"],
    environmentOptions: {
      env: {
        DATABASE_URL:
          "postgresql://testuser:testpassword@localhost:5432/testdb?schema=test",
        PORT: "3201",
      },
    },
  },
});
