import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";
import typescriptEslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "next.config.js", "src/**/*.stories.tsx"],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  ...nextConfig,
  {
    plugins: {
      "@typescript-eslint": typescriptEslint.plugin,
    },
    rules: {
      "prefer-const": "warn",
      "no-undef": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", ["parent", "sibling"], "index"],
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/jsx-key": "off",
    },
  },
  prettierConfig,
];
