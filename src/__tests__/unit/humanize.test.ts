import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'humanize' method that " + "properly returns",
  () => {
    describe(
      "the 'humanize' method properly returns when the literals are instantiated with " +
        "string values",
      () => {
        const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"], {});

        it("properly returns a humanized list of values", () => {
          expect(Literals.humanize()).toEqual("apple, banana, blueberry, and orange");
        });
        it("properly returns a single value", () => {
          expect(Literals.pick(["apple"] as const, {}).humanize()).toEqual("apple");
        });
        it("properly returns two values", () => {
          expect(Literals.pick(["apple", "banana"] as const, {}).humanize()).toEqual(
            "apple and banana",
          );
        });
        it("properly returns a humanized list of values when conjunction is changed", () => {
          expect(Literals.humanize({ conjunction: "or" })).toEqual(
            "apple, banana, blueberry, or orange",
          );
        });
        it("properly returns a humanized list of values without an oxford comma", () => {
          expect(Literals.humanize({ conjunction: "or", oxfordComma: false })).toEqual(
            "apple, banana, blueberry or orange",
          );
        });
        it("properly returns a humanized list of values when delimiter is changed", () => {
          expect(Literals.humanize({ delimiter: "." })).toEqual(
            "apple. banana. blueberry. and orange",
          );
        });
        it("properly returns humanized list of values when a formatter is provided", () => {
          expect(
            Literals.humanize({ conjunction: "or", oxfordComma: false, formatter: v => `'${v}'` }),
          ).toEqual("'apple', 'banana', 'blueberry' or 'orange'");
        });
      },
    );
    describe(
      "the 'humanize' method properly returns when the literals are instantiated with " +
        "model values",
      () => {
        const Literals = enumeratedLiterals(
          [{ value: "apple" }, { value: "banana" }, { value: "blueberry" }, { value: "orange" }],
          {},
        );

        it("properly returns a humanized list of values", () => {
          expect(Literals.humanize()).toEqual("apple, banana, blueberry, and orange");
        });
        it("properly returns a single value", () => {
          expect(Literals.pick(["apple"] as const, {}).humanize()).toEqual("apple");
        });
        it("properly returns two values", () => {
          expect(Literals.pick(["apple", "banana"] as const, {}).humanize()).toEqual(
            "apple and banana",
          );
        });
        it("properly returns a humanized list of values when conjunction is changed", () => {
          expect(Literals.humanize({ conjunction: "or" })).toEqual(
            "apple, banana, blueberry, or orange",
          );
        });
        it("properly returns a humanized list of values without an oxford comma", () => {
          expect(Literals.humanize({ conjunction: "or", oxfordComma: false })).toEqual(
            "apple, banana, blueberry or orange",
          );
        });
        it("properly returns a humanized list of values when delimiter is changed", () => {
          expect(Literals.humanize({ delimiter: "." })).toEqual(
            "apple. banana. blueberry. and orange",
          );
        });
        it("properly returns humanized list of values when a formatter is provided", () => {
          expect(
            Literals.humanize({ conjunction: "or", oxfordComma: false, formatter: v => `'${v}'` }),
          ).toEqual("'apple', 'banana', 'blueberry' or 'orange'");
        });
      },
    );
  },
);
