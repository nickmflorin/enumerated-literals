import { InvalidLiteralValueError, enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'getModel' method that " + "properly returns",
  () => {
    it("the getModel() method properly throws when the literals value does not " + "exist", () => {
      const Literals = enumeratedLiterals(
        [
          { value: "apple" },
          { value: "banana" },
          { value: "blueberry" },
          { value: "orange" },
        ] as const,
        {},
      );
      expect(() => Literals.getModel("foobar" as "apple")).toThrow(InvalidLiteralValueError);
    });
    it(
      "the getModel() method properly returns when the literals model is " +
        "instantiated with models and no other attributes",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple" },
            { value: "banana" },
            { value: "blueberry" },
            { value: "orange" },
          ] as const,
          {},
        );
        expect(Literals.getModel("apple")).toMatchObject({ value: "apple" });
        expect(Literals.getModel("banana")).toMatchObject({ value: "banana" });
        expect(Literals.getModel("blueberry")).toMatchObject({ value: "blueberry" });
        expect(Literals.getModel("orange")).toMatchObject({ value: "orange" });
      },
    );
    it(
      "the getModel() method properly returns when the literals model is " +
        "instantiated with models and other attributes",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple", color: "red", accessor: "APPLE" },
            { value: "banana", color: "yellow", accessor: "BANANA" },
            { value: "blueberry", color: "blue", accessor: "BLUEBERRY" },
            { value: "orange", color: "orange", accessor: "ORANGE" },
          ] as const,
          {},
        );
        expect(Literals.getModel("apple")).toMatchObject({ value: "apple", color: "red" });
        expect(Literals.getModel("banana")).toMatchObject({ value: "banana", color: "yellow" });
        expect(Literals.getModel("blueberry")).toMatchObject({
          value: "blueberry",
          color: "blue",
        });
        expect(Literals.getModel("orange")).toMatchObject({ value: "orange", color: "orange" });
      },
    );
    it(
      "the getModel() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );

        expect(Literals.getModel("apple")).toMatchObject({ value: "apple" });
        expect(Literals.getModel("banana")).toMatchObject({ value: "banana" });
        expect(Literals.getModel("blueberry")).toMatchObject({ value: "blueberry" });
        expect(Literals.getModel("orange")).toMatchObject({ value: "orange" });
      },
    );
  },
);

describe(
  "the literals object is properly attributed with a 'getModelSafe' method that " +
    "properly returns",
  () => {
    it(
      "the getModelSafe() method properly returns null when the literals value does not " + "exist",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple" },
            { value: "banana" },
            { value: "blueberry" },
            { value: "orange" },
          ] as const,
          {},
        );
        expect(Literals.getModelSafe("foobar", {})).toBeNull();
      },
    );
    it(
      "the getModelSafe() method properly throws when the literals value does not " + "exist",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple" },
            { value: "banana" },
            { value: "blueberry" },
            { value: "orange" },
          ] as const,
          {},
        );
        expect(() => Literals.getModelSafe("foobar", { strict: true })).toThrow(
          InvalidLiteralValueError,
        );
      },
    );
    it(
      "the getModelSafe() method properly returns when the literals model is " +
        "instantiated with models and no other attributes",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple" },
            { value: "banana" },
            { value: "blueberry" },
            { value: "orange" },
          ] as const,
          {},
        );
        expect(Literals.getModelSafe("apple", {})).toMatchObject({ value: "apple" });
        expect(Literals.getModelSafe("banana", {})).toMatchObject({ value: "banana" });
        expect(Literals.getModelSafe("blueberry", {})).toMatchObject({ value: "blueberry" });
        expect(Literals.getModelSafe("orange", {})).toMatchObject({ value: "orange" });
      },
    );
    it(
      "the getModelSafe() method properly returns when the literals model is " +
        "instantiated with models and other attributes",
      () => {
        const Literals = enumeratedLiterals(
          [
            { value: "apple", color: "red", accessor: "APPLE" },
            { value: "banana", color: "yellow", accessor: "BANANA" },
            { value: "blueberry", color: "blue", accessor: "BLUEBERRY" },
            { value: "orange", color: "orange", accessor: "ORANGE" },
          ] as const,
          {},
        );
        expect(Literals.getModelSafe("apple", {})).toMatchObject({ value: "apple", color: "red" });
        expect(Literals.getModelSafe("banana", {})).toMatchObject({
          value: "banana",
          color: "yellow",
        });
        expect(Literals.getModelSafe("blueberry", {})).toMatchObject({
          value: "blueberry",
          color: "blue",
        });
        expect(Literals.getModelSafe("orange", {})).toMatchObject({
          value: "orange",
          color: "orange",
        });
      },
    );
    it(
      "the getModelSafe() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );

        expect(Literals.getModelSafe("apple", {})).toMatchObject({ value: "apple" });
        expect(Literals.getModelSafe("banana", {})).toMatchObject({ value: "banana" });
        expect(Literals.getModelSafe("blueberry", {})).toMatchObject({ value: "blueberry" });
        expect(Literals.getModelSafe("orange", {})).toMatchObject({ value: "orange" });
      },
    );
  },
);
