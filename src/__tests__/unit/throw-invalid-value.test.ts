import { enumeratedLiterals, InvalidLiteralValueError } from "~/literals";

describe(
  "the literals object is properly attributed with a 'throwInvalidValue' method that " +
    "properly returns",
  () => {
    describe(
      "the throwInvalidValue() method properly returns when a single value is " + "provided",
      () => {
        it("throws error with appropriate message", () => {
          const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {});
          const fn = () => Literals.throwInvalidValue("cucumber");

          expect(fn).toThrow(InvalidLiteralValueError);
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
            invalidValueErrorMessage: ({ expected, received }) =>
              `The value ${received[0]} is not a fruit, the first fruit is ${expected[0]}.`,
          });
          const fn = () => Literals.throwInvalidValue("cucumber");

          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow("The value cucumber is not a fruit, the first fruit is apple.");
        });
      },
    );
    describe(
      "the throwInvalidValue() method properly returns when a multiple values are " + "provided",
      () => {
        it("throws error with appropriate message", () => {
          const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {});
          const fn = () => Literals.throwInvalidValue(["cucumber", "pear"]);

          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The values 'cucumber' and 'pear' are invalid, they must be one of 'apple', " +
              "'banana', 'blueberry', or 'orange'.",
          );
        });
        it("throws error with a provided error message", () => {
          const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {});
          const fn = () =>
            Literals.throwInvalidValue(["cucumber", "pear"], "The value is not a fruit!");

          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The values 'cucumber' and 'pear' are invalid: The value is not a fruit!",
          );
        });
        it("throws error using configuration options", () => {
          const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {
            invalidValueErrorMessage: ({ expected, received }) =>
              `The value ${received[0]} is not a fruit, the first fruit is ${expected[0]}.`,
          });
          const fn = () => Literals.throwInvalidValue(["pear", "cucumber"]);

          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow("The value pear is not a fruit, the first fruit is apple.");
        });
      },
    );
  },
);
