import { enumeratedLiterals } from "~/literals";

describe("the literals object is properly attributed with accessors", () => {
  describe("the literals object returns the correct values for accessors", () => {
    describe(
      "the literals object returns the correct values for accessors when they are not " +
        "explicitly defined",
      () => {
        describe(
          "the literals object returns the correct values for accessors when default " +
            "casing is used",
          () => {
            const ACCESSORS = [
              ["APPLE", "apple"],
              ["BANANA", "banana"],
              ["BLUEBERRY", "blueberry"],
              ["ORANGE", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              ["apple", "banana", "blueberry", "orange"] as const,
              {},
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
        describe(
          "the literals object returns the correct values for accessors when null " +
            "casing is used",
          () => {
            const ACCESSORS = [
              ["Apple", "apple"],
              ["Banana", "banana"],
              ["Blueberry", "blueberry"],
              ["Orange", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              [
                { accessor: "Apple", value: "apple" },
                { accessor: "Banana", value: "banana" },
                { accessor: "Blueberry", value: "blueberry" },
                { accessor: "Orange", value: "orange" },
              ] as const,
              { accessorCase: null },
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
        describe(
          "the literals object returns the correct values for accessors when upper " +
            "casing is used",
          () => {
            const ACCESSORS = [
              ["APPLE", "apple"],
              ["BANANA", "banana"],
              ["BLUEBERRY", "blueberry"],
              ["ORANGE", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              ["apple", "banana", "blueberry", "orange"] as const,
              {
                accessorCase: "upper",
              },
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
        describe(
          "the literals object returns the correct values for accessors when lower " +
            "casing is used",
          () => {
            const ACCESSORS = [
              ["apple", "apple"],
              ["banana", "banana"],
              ["blueberry", "blueberry"],
              ["orange", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              ["apple", "banana", "blueberry", "orange"] as const,
              {
                accessorCase: "lower",
              },
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
      },
    );
    describe(
      "the literals object returns the correct values for accessors when they are " +
        "explicitly defined",
      () => {
        describe(
          "the literals object returns the correct values for accessors when upper " +
            "casing is used",
          () => {
            const ACCESSORS = [
              ["APPLE", "apple"],
              ["BANANA", "banana"],
              ["BLUEBERRY", "blueberry"],
              ["ORANGE", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              [
                { accessor: "apple", value: "apple" },
                { accessor: "banana", value: "banana" },
                { accessor: "blueberry", value: "blueberry" },
                { accessor: "orange", value: "orange" },
              ] as const,
              { accessorCase: "upper" },
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
        describe(
          "the literals object returns the correct values for accessors when no " +
            "casing is used",
          () => {
            const ACCESSORS = [
              ["apple", "apple"],
              ["banana", "banana"],
              ["blueberry", "blueberry"],
              ["orange", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              [
                { accessor: "apple", value: "apple" },
                { accessor: "banana", value: "banana" },
                { accessor: "blueberry", value: "blueberry" },
                { accessor: "orange", value: "orange" },
              ] as const,
              {},
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
        describe(
          "the literals object returns the correct values for accessors when lower casing " +
            "is used",
          () => {
            const ACCESSORS = [
              ["apple", "apple"],
              ["banana", "banana"],
              ["blueberry", "blueberry"],
              ["orange", "orange"],
            ] as const satisfies [string, string][];
            const Literals = enumeratedLiterals(
              [
                { accessor: "APPLE", value: "apple" },
                { accessor: "BANANA", value: "banana" },
                { accessor: "Blueberry", value: "blueberry" },
                { accessor: "Orange", value: "orange" },
              ] as const,
              { accessorCase: "lower" },
            );
            test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
              expect(Literals[accessor]).toBe(value);
            });
          },
        );
      },
    );
  });
  describe("the literals object properly formats raw accessors", () => {
    describe("properly removes unncecessary whitespace", () => {
      const ACCESSORS = [
        ["ap_ple", "apple"],
        ["ba_n_ana", "banana"],
        ["blu_eber_r_y", "blueberry"],
        ["ora_nge", "orange"],
      ] as const satisfies [string, string][];
      const Literals = enumeratedLiterals(
        [
          { accessor: " ap  ple", value: "apple" },
          { accessor: "ba n   ana", value: "banana" },
          { accessor: "blu   eber r  y", value: "blueberry" },
          { accessor: "ora  nge  ", value: "orange" },
        ] as const,
        {},
      );
      test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
        expect(Literals[accessor]).toBe(value);
      });
    });
  });

  describe("the literals object throws an error when accessors are invalid", () => {
    const INVALID_ACCESSORS = ["foo *", "foo&bar"];
    const INVALID_MODELS = [
      [INVALID_ACCESSORS[0], "foo"],
      [INVALID_ACCESSORS[1], "bar"],
    ];
    describe("throws an error when the value maps to an invalid accessor", () => {
      test.each(INVALID_ACCESSORS)("(accessor = %s)", accessor => {
        expect(() => enumeratedLiterals([accessor] as const, {})).toThrow();
      });
    });
    describe("throws an error when invalid accessors explicitly defined", () => {
      test.each(INVALID_MODELS)("(accessor = %s)", (accessor, value) => {
        expect(() => enumeratedLiterals([{ accessor, value }] as const, {})).toThrow();
      });
    });
  });

  describe("the literals object throws an error when values are not unique", () => {
    it("throws an error when instantiated with non unique values", () => {
      expect(() => enumeratedLiterals(["apple", "apple", "banana"] as const, {})).toThrow(
        "Encountered duplicate literal values, 'apple'. The literal values must be unique!",
      );
    });
    it("throws an error when instantiated with models with non unique values", () => {
      expect(() =>
        enumeratedLiterals(
          [{ value: "apple" }, { value: "apple" }, { value: "banana" }] as const,
          {},
        ),
      ).toThrow(
        "Encountered duplicate literal values, 'apple'. The literal values must be unique!",
      );
    });
  });

  describe("the literals object throws an error when accessors are not unique", () => {
    it("throws an error when two different values map to the same accessor", () => {
      expect(() => enumeratedLiterals(["foo bar", "foo-bar"] as const, {})).toThrow();
    });
    it(
      "throws an error when two different explicitly defined accessors map to the " + "same value",
      () => {
        expect(() =>
          enumeratedLiterals(
            [
              { accessor: "foo bar", value: "foobar" },
              { accessor: "foo_bar", value: "fooBar" },
            ] as const,
            {},
          ),
        ).toThrow();
      },
    );
    it(
      "throws an error when one explicitly defined accessor maps to the same accessor as one " +
        "explicitly provided value",
      () => {
        expect(() =>
          enumeratedLiterals(
            [{ accessor: "foo bar", value: "foobar" }, { value: "foo  bar" }] as const,
            { accessorCase: "lower", accessorSpaceReplacement: null },
          ),
        ).toThrow(
          "Encountered a value, 'foo  bar', that maps to the same accessor ('foo bar') as the " +
            "explicitly provided accessor, 'foo bar'. The provided accessors and/or values " +
            "must all map to unique accessor values. Either provide an explicit accessor value " +
            "for the value 'foo  bar',change the accessor value 'foo bar'or configure the " +
            "accessor options such that the two do not map to the same accessor.",
        );
      },
    );
    // This is the above test in the reverse direction, to test both conditionals.
    it(
      "throws an error when one explicitly provided value maps to the same accessor as one " +
        "explicitly provided accessor",
      () => {
        expect(() =>
          enumeratedLiterals(
            [{ value: "foo  bar" }, { accessor: "foo bar", value: "foobar" }] as const,
            { accessorCase: "lower", accessorSpaceReplacement: null },
          ),
        ).toThrow(
          "Encountered a value, 'foo  bar', that maps to the same accessor ('foo bar') as the " +
            "explicitly provided accessor, 'foo bar'. The provided accessors and/or values must " +
            "all map to unique accessor values. Either provide an explicit accessor value for " +
            "the value 'foo  bar',change the accessor value 'foo bar' or configure the accessor " +
            "options such that the two do not map to the same accessor.",
        );
      },
    );
    it(
      "throws an error when two different explicitly provided accessors map to the same " +
        "value based on configuration",
      () => {
        expect(() =>
          enumeratedLiterals(
            [
              { accessor: "foo bar", value: "foobar" },
              { accessor: "foo-bar", value: "fooBar" },
            ] as const,
            {
              accessorHyphenReplacement: "_",
            },
          ),
        ).toThrow();
      },
    );
    it("throws an error when two identical, explicitly provided accessors are provided", () => {
      expect(() =>
        enumeratedLiterals(
          [
            { accessor: "foo bar", value: "foobar" },
            { accessor: "foo bar", value: "fooBar" },
          ] as const,
          {},
        ),
      ).toThrow();
    });
  });
});
