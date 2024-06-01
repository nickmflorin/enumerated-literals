import { enumeratedLiterals } from "~/literals";

describe("the literals object is properly attributed with accessors", () => {
  describe("the literals object returns the correct values for accessors", () => {
    describe(
      "the literals object returns the correct values for accessors when they are not " +
        "explicitly defined",
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
      "the literals object returns the correct values for accessors when they are not " +
        "explicitly defined but configured to use lower casing",
      () => {
        const ACCESSORS = [
          ["apple", "apple"],
          ["banana", "banana"],
          ["blueberry", "blueberry"],
          ["orange", "orange"],
        ] as const satisfies [string, string][];

        const Literals = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {
          accessorCase: "lower",
        });
        test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
          expect(Literals[accessor]).toBe(value);
        });
      },
    );
    describe(
      "the literals object returns the correct values for accessors when they are " +
        "explicitly defined",
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
  });
  describe("the literals object properly formats raw accessors", () => {
    it("properly removes unncecessary whitespace", () => {
      const ACCESSORS = [
        ["ap_ple", "apple"],
        ["ba_n_ana", "banana"],
        ["blu_eber_r_y", "blueberry"],
        ["ora_nge", "orange"],
      ] as const satisfies [string, string][];

      const Literals = enumeratedLiterals(
        [
          { accessor: "ap  ple", value: "apple" },
          { accessor: "ba n   ana", value: "banana" },
          { accessor: "blu   eber r  y", value: "blueberry" },
          { accessor: "ora  nge", value: "orange" },
        ] as const,
        {},
      );
      test.each(ACCESSORS)("(accessor = %s)", (accessor, value) => {
        expect(Literals[accessor]).toBe(value);
      });
    });
  });
  describe("the literals object throws an error when accessors are invalid", () => {
    const INVALID_ACCESSORS = ["9foo", " foo bar ", "foo&bar"];

    describe("throws an error when the value maps to an invalid accessor", () => {
      test.each(INVALID_ACCESSORS)("(accessor = %s)", accessor => {
        expect(() => enumeratedLiterals([accessor] as const, {})).toThrow();
      });
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
