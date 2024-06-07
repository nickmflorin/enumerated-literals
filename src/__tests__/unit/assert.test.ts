import { enumeratedLiterals, InvalidLiteralValueError } from "~/literals";

describe(
  "the literals object is properly attributed with a 'assert' method that " + "properly returns",
  () => {
    describe(
      "the assert() method properly returns when the literals model is " +
        "instantiated with models",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple", accessor: "APPLE" },
            { value: "banana", accessor: "BANANA" },
            { value: "blueberry", accessor: "BLUEBERRY" },
            { value: "orange", accessor: "ORANGE" },
          ] as const,
          {},
        );
        it("throws when value is not in the set of literals", () => {
          const fn = () => Literals.assert("grape");
          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The value 'grape' is invalid, it must be one of 'apple', 'banana', 'blueberry', " +
              "or 'orange'.",
          );
        });
        it("does not throw when value is in the set of literals", () => {
          expect(() => Literals.assert("apple")).not.toThrow(InvalidLiteralValueError);
        });
      },
    );
    describe(
      "the assert() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );

        it("throws when value is not in the set of literals", () => {
          const fn = () => Literals.assert("grape");
          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The value 'grape' is invalid, it must be one of 'apple', 'banana', 'blueberry', " +
              "or 'orange'.",
          );
        });
        it("does not throw when value is in the set of literals", () => {
          expect(() => Literals.assert("apple")).not.toThrow();
        });
      },
    );
  },
);

describe(
  "the literals object is properly attributed with a 'assertMultiple' method that " +
    "properly returns",
  () => {
    describe(
      "the assertMultiple() method properly returns when the literals model is " +
        "instantiated with models",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple", accessor: "APPLE" },
            { value: "banana", accessor: "BANANA" },
            { value: "blueberry", accessor: "BLUEBERRY" },
            { value: "orange", accessor: "ORANGE" },
          ] as const,
          {},
        );
        it("throws when all values are not in the set of literals", () => {
          const fn = () => Literals.assertMultiple(["pear", "grape"]);
          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The values 'pear' and 'grape' are invalid, they must be one of 'apple', " +
              "'banana', 'blueberry', or 'orange'.",
          );
        });
        it("throws when just one value is not in the set of literals", () => {
          const fn = () => Literals.assertMultiple(["apple", "grape"]);
          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The value 'grape' is invalid, it must be one of 'apple', 'banana', 'blueberry', " +
              "or 'orange'.",
          );
        });
        it("does not throw when all values are in the set of literals", () => {
          expect(() => Literals.assertMultiple(["apple", "banana"])).not.toThrow();
        });
      },
    );
    describe(
      "the assert() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );
        it("throws when all values are not in the set of literals", () => {
          const fn = () => Literals.assertMultiple(["pear", "grape"]);
          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The values 'pear' and 'grape' are invalid, they must be one of 'apple', " +
              "'banana', 'blueberry', or 'orange'.",
          );
        });
        it("throws when just one value is not in the set of literals", () => {
          const fn = () => Literals.assertMultiple(["apple", "grape"]);
          expect(fn).toThrow(InvalidLiteralValueError);
          expect(fn).toThrow(
            "The value 'grape' is invalid, it must be one of 'apple', 'banana', 'blueberry', " +
              "or 'orange'.",
          );
        });
        it("does not throw when all values are in the set of literals", () => {
          expect(() => Literals.assertMultiple(["apple", "banana"])).not.toThrow();
        });
      },
    );
  },
);
