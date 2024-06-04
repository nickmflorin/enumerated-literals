import { enumeratedLiterals } from "~/literals";

describe(
  "the literals object is properly attributed with a 'getAttribute' method that " +
    "properly returns",
  () => {
    it(
      "the getAttribute() method properly returns when the literals model is " +
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
        expect(Literals.getAttribute("apple", "value")).toEqual("apple");
        expect(Literals.getAttribute("banana", "value")).toEqual("banana");
        expect(Literals.getAttribute("blueberry", "value")).toEqual("blueberry");
        expect(Literals.getAttribute("orange", "value")).toEqual("orange");
      },
    );
    it(
      "the getAttribute() method properly returns when the literals model is " +
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
        expect(Literals.getAttribute("apple", "color")).toEqual("red");
        expect(Literals.getAttribute("banana", "color")).toEqual("yellow");
        expect(Literals.getAttribute("blueberry", "color")).toEqual("blue");
        expect(Literals.getAttribute("orange", "color")).toEqual("orange");
      },
    );
    it(
      "the getAttribute() method properly returns when the literals model is " +
        "instantiated with values",
      () => {
        const Literals = enumeratedLiterals(
          ["apple", "banana", "blueberry", "orange"] as const,
          {},
        );
        expect(Literals.getAttribute("apple", "value")).toEqual("apple");
        expect(Literals.getAttribute("banana", "value")).toEqual("banana");
        expect(Literals.getAttribute("blueberry", "value")).toEqual("blueberry");
        expect(Literals.getAttribute("orange", "value")).toEqual("orange");
      },
    );
  },
);
