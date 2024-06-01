import { type ModuleConfig, withModuleConfig } from "./jest.config.base";

const base = __dirname.replace(/\/__tests__$/, "");

/**
 * Returns the Jest configuration function that should be used in a linting (ESLint and/or Prettier)
 * environment.
 */
export const withLintConfig = (config: ModuleConfig) =>
  withModuleConfig(base, {
    ...config,
    /* Jest will respect our ESLint configuration in terms of what files should not be linted.
       However, by default Jest will only look for files that are denoted as being applicable for
       tests.  This means that we have to explicitly tell Jest to look at all files in the project,
       and let the `.eslint.js` file control everything after.

       https://jestjs.io/docs/configuration#testmatch-arraystring
     */
    testMatch: [`${base}/**/*`, `!${base}/dist/**/*`, ...(config.testMatch || [])],
  });
