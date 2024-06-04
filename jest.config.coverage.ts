import { withBaseConfig } from "./src/__tests__/jest.config.base";

export default withBaseConfig(__dirname, {
  // Scope the tests that Jest will run to just tests in the `__tests__/unit` directory.
  testMatch: [`${__dirname}/src/__tests__/unit/**/*.test.ts`],
  collectCoverage: true,
  coverageReporters: ["text", "cobertura"],
});
