import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**", "**/coverage/**"]
    },
    js.configs.recommended,
    ...compat.extends("plugin:@typescript-eslint/recommended", "prettier"),
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        },
    }
];