import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: tests only cover pure logic, so they
// don't need the React or Tailwind plugins.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
