import { literalsAreModelArray, literalsAreArray, type Literals } from "~/literals/core";

describe("literalsAreModelArray properly returns", () => {
  it("returns true when provided literals are models", () => {
    expect(literalsAreModelArray([{ value: "apple" }])).toBe(true);
  });
  it("returns false when provided literals are values", () => {
    expect(literalsAreModelArray(["banana"])).toBe(false);
  });
  it("throws an error if no models are provided", () => {
    expect(() => literalsAreModelArray([] as Literals)).toThrow();
  });
  it("throws an error when a mixture of models and values are provided", () => {
    expect(() => literalsAreModelArray([{ value: "apple" }, "banana"] as Literals)).toThrow();
  });
});

describe("literalsAreArray properly returns", () => {
  it("returns true when provided literals are values", () => {
    expect(literalsAreArray(["apple"])).toBe(true);
  });
  it("returns false when provided literals are models", () => {
    expect(literalsAreArray([{ value: "banana" }])).toBe(false);
  });
  it("throws an error if no values are provided", () => {
    expect(() => literalsAreArray([] as Literals)).toThrow();
  });
  it("throws an error when a mixture of models and values are provided", () => {
    expect(() => literalsAreArray([{ value: "apple" }, "banana"] as Literals)).toThrow();
  });
});
