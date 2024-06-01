import { withApplicationConfig } from "./__tests__/jest.config.base";

/**
 * Defines the Jest "projects" that Jest will run in parallel, isolated threads.
 *
 * A Jest "project" is defined as a subset of tests that require separate or modified
 * configurations.  These projects are associated with scoped configuration files, with are denoted
 * as either jest-*.config.ts or jest.config.ts.
 */
export default withApplicationConfig(__dirname, [
  "./__tests__/unit/jest.config.ts",
  "./__tests__/jest.config.eslint.ts",
  "./__tests__/jest.config.prettier.ts",
]);
