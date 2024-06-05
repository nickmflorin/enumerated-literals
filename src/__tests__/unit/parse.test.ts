import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'parse' method that " + "properly returns",
  () => {
    describe(
      "the parse() method properly returns when the literals model is " +
        "instantiated with models",
      () => {
        const MODELS = [
          ["APPLE", "apple"],
          ["BANANA", "banana"],
          ["BLUEBERRY", "blueberry"],
          ["ORANGE", "orange"],
        ] as const satisfies [string, string][];
        const Literals = enumeratedLiterals(
          [
            { value: MODELS[0][1], accessor: MODELS[0][0] },
            { value: MODELS[1][1], accessor: MODELS[1][0] },
            { value: MODELS[2][1], accessor: MODELS[2][0] },
            { value: MODELS[3][1], accessor: MODELS[3][0] },
          ] as const,
          {},
        );
        test.each(MODELS.map(m => m[1]))("(value = %s)", value => {
          expect(Literals.parse(value)).toBe(value);
        });
        it("throws an error when the value is not in the literals model", () => {
          expect(() => Literals.parse("grape")).toThrow();
        });
      },
    );
    describe(
      "the parse() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const VALUES = ["apple", "banana", "blueberry", "orange"] as const;
        const Literals = enumeratedLiterals(VALUES, {});
        test.each(VALUES)("(value = %s)", value => {
          expect(Literals.parse(value)).toBe(value);
        });
        it("throws an error when the value is not in the literals model", () => {
          expect(() => Literals.parse("grape")).toThrow();
        });
      },
    );
  },
);
