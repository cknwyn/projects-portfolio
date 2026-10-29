import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "no-console": ["warn", { "allow": ["warn", "error", "log"] }],
      "no-undef": "error",
      "no-constant-condition": "error",
      "no-duplicate-case": "error",
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-unreachable": "error"
    }
  },
  {
    files: ["__tests__/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.jest,
        ...globals.node
      }
    }
  }
];
