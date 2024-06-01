import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'pick' method that " + "properly returns",
  () => {
    describe(
      "the pick() method properly returns when the literals model is " + "instantiated with models",
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
        const SubsetLiterals = Literals.pick(["apple", "blueberry"]);

        it("returns an object with the correct values", () => {
          expect(SubsetLiterals.values).toEqual(["apple", "blueberry"]);
        });

        it("returns an object with the correct accessors", () => {
          expect(SubsetLiterals.APPLE).toBe("apple");
          expect(SubsetLiterals.BLUEBERRY).toBe("blueberry");
        });

        it("returns an object that excludes non-picked accessors", () => {
          expect(SubsetLiterals["BANANA" as keyof typeof SubsetLiterals]).toBeUndefined();
          expect(SubsetLiterals["ORANGE" as keyof typeof SubsetLiterals]).toBeUndefined();
        });
      },
    );
    describe(
      "the pick() method properly returns when the literals model is " + "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );
        const SubsetLiterals = Literals.pick(["apple", "blueberry"] as const);

        it("returns an object with the correct values", () => {
          expect(SubsetLiterals.values).toEqual(["apple", "blueberry"]);
        });

        it("returns an object with the correct accessors", () => {
          expect(SubsetLiterals.APPLE).toBe("apple");
          expect(SubsetLiterals.BLUEBERRY).toBe("blueberry");
        });

        it("returns an object that excludes non-picked accessors", () => {
          expect(SubsetLiterals["BANANA" as keyof typeof SubsetLiterals]).toBeUndefined();
          expect(SubsetLiterals["ORANGE" as keyof typeof SubsetLiterals]).toBeUndefined();
        });
      },
    );
  },
);
