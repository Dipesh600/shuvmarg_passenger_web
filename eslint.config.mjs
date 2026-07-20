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
      "no-console": ["error", { allow: [] }],
    },
  },
]);

export default eslintConfig;

