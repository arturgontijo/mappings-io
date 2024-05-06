// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", "node_modules/*"],
  },
];
