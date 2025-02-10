/* eslint-disable import/no-anonymous-default-export */
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "next/core-web-vitals",
    "plugin:storybook/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:testing-library/react",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        // "no-console": "warn",
        "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-explicit-any": "warn",
        "testing-library/render-result-naming-convention": "warn",
        "testing-library/no-node-access": "warn",
    },
}];