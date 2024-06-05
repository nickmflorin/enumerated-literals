import { humanizeList } from "~/formatters";

describe("humanizeList properly returns", () => {
  const values = ["apple", "banana", "blueberry", "orange"];

  it("properly returns an empty string when an empty array is provided", () => {
    expect(humanizeList([], {})).toEqual("");
  });
  it("properly returns a humanized list of values", () => {
    expect(humanizeList(values)).toEqual("apple, banana, blueberry, and orange");
  });
  it("properly returns a single value", () => {
    expect(humanizeList([values[0]])).toEqual("apple");
  });
  it("properly returns two values", () => {
    expect(humanizeList(values.slice(0, 2), {})).toEqual("apple and banana");
  });
  it("properly returns a humanized list of values when conjunction is changed", () => {
    expect(humanizeList(values, { conjunction: "or" })).toEqual(
      "apple, banana, blueberry, or orange",
    );
  });
  it("properly returns a humanized list of values without an oxford comma", () => {
    expect(humanizeList(values, { conjunction: "or", oxfordComma: false })).toEqual(
      "apple, banana, blueberry or orange",
    );
  });
  it("properly returns a humanized list of values when delimiter is changed", () => {
    expect(humanizeList(values, { delimiter: "." })).toEqual(
      "apple. banana. blueberry. and orange",
    );
  });
  it("properly returns humanized list of values when a formatter is provided", () => {
    expect(
      humanizeList(values, { conjunction: "or", oxfordComma: false, formatter: v => `'${v}'` }),
    ).toEqual("'apple', 'banana', 'blueberry' or 'orange'");
  });
});
