import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/next-env.d.ts"] },
  js.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },

  // Type-aware rules (no-floating-promises, no-misused-promises, ...) for all TypeScript.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        // Root files outside any tsconfig (e.g. vitest.config.ts) use a default project.
        projectService: { allowDefaultProject: ["*.ts"] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Plain JS config files: syntax rules only, no type information.
  { files: ["**/*.{js,mjs,cjs}"], extends: [tseslint.configs.recommended] },

  // React hooks and Next.js rules for the web app.
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended],
    plugins: { "@next/next": nextPlugin },
    rules: { ...nextPlugin.configs.recommended.rules, ...nextPlugin.configs["core-web-vitals"].rules },
    settings: { next: { rootDir: "apps/web/" } },
  },
);
