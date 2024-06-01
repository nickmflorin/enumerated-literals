import { TestModule } from "./jest.config.base";
import { withLintConfig } from "./jest.config.lint";

export default withLintConfig({
  module: TestModule.eslint,
  runner: "jest-runner-eslint",
  testMatch: ["!**/*.json"],
});
