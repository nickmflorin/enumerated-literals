import { InvalidLiteralValueError } from "~/literals";
import type { LiteralsArray } from "~/literals/core";

describe("InvalidLiteralValueError properly instantiates", () => {
  it("throws an error if it is instantiated wtih no values", () => {
    expect(
      () =>
        new InvalidLiteralValueError("cucumber", {
          values: [] as unknown as LiteralsArray,
          message: "foobar",
        }),
    ).toThrow(
      "Internal Error: The values on the literals instance are empty, this should not be " +
        "allowed, and should have been checked before this point in the code!",
    );
  });
});
