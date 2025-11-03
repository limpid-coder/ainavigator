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
    // Ignore UI animation components with Math.random() during render
    "**/ui/motion-wrapper.tsx",
    "**/ui/playful-background.tsx",
    "**/ui/skeleton.tsx",
  ]),
  {
    rules: {
      // Relax TypeScript rules for MVP development
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      // React rules
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/set-state-in-effect": "off",
      // Next.js rules
      "@next/next/no-img-element": "warn",
      // Disable React Compiler rules during MVP development
      "react-compiler/react-compiler": "off",
    },
  },
]);

export default eslintConfig;
