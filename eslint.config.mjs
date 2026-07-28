import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Keep the existing legacy findings visible without blocking every change.
  // New code should not add to these warnings; retire them incrementally.
  {
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },

  // SECURITY: ban console statements in authentication code.
  // console.log in auth files can expose credentials (phone, OTP, password)
  // in browser developer tools, screen recordings, and remote-support sessions.
  {
    files: [
      "src/app/login/**",
      "src/app/signup/**",
      "src/app/forgot-password/**",
      "src/context/AuthContext*",
      "src/lib/auth*",
      "src/lib/api*",
      "**/auth/**",
      "**/*auth*",
    ],
    rules: {
      "no-console": "error",
    },
  },
]);

export default eslintConfig;
