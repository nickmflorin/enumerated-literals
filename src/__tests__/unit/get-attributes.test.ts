import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'getAttributes' method that " +
    "properly returns",
  () => {
    it(
      "the getAttributes() method properly returns when the literals model is " +
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
        expect(Literals.getAttributes("value")).toEqual(["apple", "banana", "blueberry", "orange"]);
      },
    );
    it(
      "the getAttributes() method properly returns when the literals model is " +
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
        expect(Literals.getAttributes("color")).toEqual(["red", "yellow", "blue", "orange"]);
      },
    );
    it(
      "the getAttributes() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );
        expect(Literals.getAttributes("value")).toEqual(["apple", "banana", "blueberry", "orange"]);
      },
    );
  },
);
