import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'omit' method that " + "properly returns",
  () => {
    describe(
      "the omit() method properly returns when the literals model is " + "instantiated with models",
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
        const SubsetLiterals = Literals.omit(["apple", "blueberry"] as const);

        it("returns an object with the correct values", () => {
          expect(SubsetLiterals.values).toEqual(["banana", "orange"]);
        });

        it("returns an object with the correct accessors", () => {
          expect(SubsetLiterals.BANANA).toBe("banana");
          expect(SubsetLiterals.ORANGE).toBe("orange");
        });

        it("returns an object that excludes non-omited accessors", () => {
          expect(SubsetLiterals["APPLE" as keyof typeof SubsetLiterals]).toBeUndefined();
          expect(SubsetLiterals["BLUEBERRY" as keyof typeof SubsetLiterals]).toBeUndefined();
        });
      },
    );
    describe(
      "the omit() method properly returns when the literals model is " + "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );
        const SubsetLiterals = Literals.omit(["apple", "blueberry"] as const);

        it("returns an object with the correct values", () => {
          expect(SubsetLiterals.values).toEqual(["banana", "orange"]);
        });

        it("returns an object with the correct accessors", () => {
          expect(SubsetLiterals.BANANA).toBe("banana");
          expect(SubsetLiterals.ORANGE).toBe("orange");
        });

        it("returns an object that excludes non-omited accessors", () => {
          expect(SubsetLiterals["APPLE" as keyof typeof SubsetLiterals]).toBeUndefined();
          expect(SubsetLiterals["BLUEBERRY" as keyof typeof SubsetLiterals]).toBeUndefined();
        });
      },
    );
  },
);
