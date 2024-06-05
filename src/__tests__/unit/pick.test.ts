import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'pick' method that " + "properly returns",
  () => {
    it("the pick() method properly throws when values are not on literals instance", () => {
      const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
      expect(() => Literals.pick(["foo" as "apple"], {})).toThrow();
    });
    describe(
      "the pick() method properly returns when the literals model is " + "instantiated with models",
      () => {
        const MODELS = [
          ["AP-PLE", "apple"],
          ["BANANA", "banana"],
          ["BLUE BERRY", "blueberry"],
          ["ORANGE", "orange"],
        ] as const satisfies [string, string][];

        const literalsData = [
          { value: MODELS[0][1], accessor: MODELS[0][0] },
          { value: MODELS[1][1], accessor: MODELS[1][0] },
          { value: MODELS[2][1], accessor: MODELS[2][0] },
          { value: MODELS[3][1], accessor: MODELS[3][0] },
        ] as const;

        const Literals = enumeratedLiterals(literalsData, {});
        const SubsetLiterals = Literals.pick(["apple", "blueberry"], {});

        it("returns an object with the correct values", () => {
          expect(SubsetLiterals.values).toEqual(["apple", "blueberry"]);
        });

        it("returns an object with the correct accessors", () => {
          expect(SubsetLiterals["AP-PLE"]).toBe("apple");
          expect(SubsetLiterals.BLUE_BERRY).toBe("blueberry");
        });

        it("returns an object that excludes non-picked accessors", () => {
          expect(SubsetLiterals["BANANA" as keyof typeof SubsetLiterals]).toBeUndefined();
          expect(SubsetLiterals["ORANGE" as keyof typeof SubsetLiterals]).toBeUndefined();
        });

        describe(
          "the pick() method returns a set of literals that respect original " + "options",
          () => {
            it("respects the accessor case option", () => {
              const ConfiguredLiterals = enumeratedLiterals(literalsData, {
                accessorCase: "lower",
              });
              const SubsetLiterals = ConfiguredLiterals.pick(["apple", "blueberry"], {});
              expect(SubsetLiterals["ap-ple"]).toBe("apple");
              expect(SubsetLiterals.blue_berry).toBe("blueberry");
            });
            it("respects the space replacement option", () => {
              const ConfiguredLiterals = enumeratedLiterals(literalsData, {
                accessorSpaceReplacement: "",
              });
              const SubsetLiterals = ConfiguredLiterals.pick(["apple", "blueberry"], {});
              expect(SubsetLiterals["AP-PLE"]).toBe("apple");
              expect(SubsetLiterals["BLUEBERRY"]).toBe("blueberry");
            });
            it("respects the hyphen replacement option", () => {
              const ConfiguredLiterals = enumeratedLiterals(literalsData, {
                accessorHyphenReplacement: "_",
              });
              const SubsetLiterals = ConfiguredLiterals.pick(["apple", "blueberry"], {});
              expect(SubsetLiterals.AP_PLE).toBe("apple");
              expect(SubsetLiterals.BLUE_BERRY).toBe("blueberry");
            });
          },
        );
      },
    );
    describe(
      "the pick() method properly returns when the literals model is " + "instantiated with values",
      () => {
        const literalsData = ["ap-ple", "banana", "blue berry", "orange"] as const;

        const Literals = enumeratedLiterals(literalsData, {});
        const SubsetLiterals = Literals.pick(["ap-ple", "blue berry"] as const, {});

        it("returns an object with the correct values", () => {
          expect(SubsetLiterals.values).toEqual(["ap-ple", "blue berry"]);
        });

        it("returns an object with the correct accessors", () => {
          expect(SubsetLiterals.AP_PLE).toBe("ap-ple");
          expect(SubsetLiterals.BLUE_BERRY).toBe("blue berry");
        });

        it("returns an object that excludes non-picked accessors", () => {
          expect(SubsetLiterals["BANANA" as keyof typeof SubsetLiterals]).toBeUndefined();
          expect(SubsetLiterals["ORANGE" as keyof typeof SubsetLiterals]).toBeUndefined();
        });

        describe(
          "the pick() method returns a set of literals that respect original " + "options",
          () => {
            it("respects the accessor case option", () => {
              const ConfiguredLiterals = enumeratedLiterals(literalsData, {
                accessorCase: "lower",
              });
              const SubsetLiterals = ConfiguredLiterals.pick(["ap-ple", "blue berry"], {});
              expect(SubsetLiterals.ap_ple).toBe("ap-ple");
              expect(SubsetLiterals.blue_berry).toBe("blue berry");
            });
            it("respects the space replacement option", () => {
              const ConfiguredLiterals = enumeratedLiterals(literalsData, {
                accessorSpaceReplacement: "",
              });
              const SubsetLiterals = ConfiguredLiterals.pick(["ap-ple", "blue berry"], {});
              expect(SubsetLiterals.AP_PLE).toBe("ap-ple");
              expect(SubsetLiterals["BLUEBERRY"]).toBe("blue berry");
            });
            it("respects the hyphen replacement option", () => {
              const ConfiguredLiterals = enumeratedLiterals(literalsData, {
                accessorHyphenReplacement: "_",
              });
              const SubsetLiterals = ConfiguredLiterals.pick(["ap-ple", "blue berry"], {});
              expect(SubsetLiterals.AP_PLE).toBe("ap-ple");
              expect(SubsetLiterals.BLUE_BERRY).toBe("blue berry");
            });
          },
        );
      },
    );
  },
);
