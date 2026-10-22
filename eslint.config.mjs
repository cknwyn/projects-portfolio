import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-undef": "error",
      "no-constant-condition": "error",
      "no-duplicate-case": "error",
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-unreachable": "error"
    }
  }
];
