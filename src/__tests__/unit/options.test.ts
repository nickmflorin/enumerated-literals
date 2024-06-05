import { type Literals } from "~/literals/core";
import { getDefaultLiteralsAccessorOptions } from "~/literals/options";

describe("getDefaultLiteralsAccessorOptions properly returns", () => {
  it("throws an error when value is not a valid model array or values array", () => {
    expect(() => getDefaultLiteralsAccessorOptions([1, 2, 3, 4] as unknown as Literals)).toThrow(
      "Unreachable code path!",
    );
  });
});
