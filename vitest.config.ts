import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["src/setupTests.ts"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/setupTests.ts",
        "src/lib/pokedex-types.ts",
        "src/data/mocks/**",
        "src/components/icons.tsx",
        "src/components/type-icon.tsx",
        "src/components/type-badge.tsx",
        "src/components/metric-card.tsx",
        "src/components/page-header.tsx",
        "src/components/elemento-outline.tsx",
        "src/components/directional-transition.tsx",
        "src/components/settings.tsx",
        "**/*.stories.tsx",
        "**/*.d.ts",
        "next.config.ts",
        "postcss.config.mjs",
        ".next/**",
        "**/server/**",
        "**/chunks/**"
      ]
    }
  },
});
