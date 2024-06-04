import { enumeratedLiterals, InvalidLiteralValueError } from "~/literals";

describe(
  "the literals object is properly attributed with a 'throwInvalidValue' method that " +
    "properly returns",
  () => {
    it("throws error with appropriate message", () => {
      const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {});
      const fn = () => Literals.throwInvalidValue("cucumber");

      expect(fn).toThrow();
      expect(fn).toThrow(
        "The value 'cucumber' is invalid, it must be one of 'apple', 'banana', " +
          "'blueberry', or 'orange'.",
      );
    });
    it("throws error with a provided error message", () => {
      const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {});
      const fn = () => Literals.throwInvalidValue("cucumber", "The value is not a fruit!");

      expect(fn).toThrow(InvalidLiteralValueError);
      expect(fn).toThrow("The value 'cucumber' is invalid: The value is not a fruit!");
    });
    it("throws error using configuration options", () => {
      const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {
        invalidValueErrorMessage: (values, value) =>
          `The value ${value} is not a fruit, the first fruit is ${values[0]}.`,
      });
      const fn = () => Literals.throwInvalidValue("cucumber");

      expect(fn).toThrow(InvalidLiteralValueError);
      expect(fn).toThrow("The value cucumber is not a fruit, the first fruit is apple.");
    });
  },
);
