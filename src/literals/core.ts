export type LiteralsArray = readonly [string, ...string[]];

export type LiteralsBaseModel<V extends string = string> = {
  readonly value: V;
  readonly accessor?: string;
};

export const isLiteralModel = <V extends string = string>(v: unknown): v is LiteralsBaseModel<V> =>
  typeof v === "object" && v !== null && "value" in v && v.value !== undefined;

export type LiteralsBaseModelArray<V extends string = string> = readonly LiteralsBaseModel<V>[];

export type Literals = LiteralsArray | LiteralsBaseModelArray;

export const literalsAreModelArray = (literals: Literals): literals is LiteralsBaseModelArray => {
  if (literals.length === 0) {
    throw new Error(
      "The 'enumeratedLiterals' method must be called with a non-empty array as its first " +
        "argument.",
    );
  } else if (literals.some(l => isLiteralModel(l))) {
    if (!literals.every(l => isLiteralModel(l))) {
      throw new Error(
        "Encountered a set of literals that contains a combination of strings and models. " +
          "The literals must either contain all strings, or all models.",
      );
    }
    return true;
  }
  return false;
};

export const literalsAreArray = (literals: Literals): literals is LiteralsArray => {
  if (literals.length === 0) {
    throw new Error(
      "The 'enumeratedLiterals' method must be called with a non-empty array as its first " +
        "argument.",
    );
  } else if (literals.some(l => typeof l === "string")) {
    if (!literals.every(l => typeof l === "string")) {
      throw new Error(
        "Encountered a set of literals that contains a combination of strings and models. " +
          "The literals must either contain all strings, or all models.",
      );
    }
    return true;
  }
  return false;
};

export type LiteralsMember<L extends Literals> = L extends LiteralsArray
  ? L[number]
  : L extends LiteralsBaseModelArray
    ? L[number]["value"]
    : never;

export type LiteralsBaseModelArrayValues<L extends LiteralsBaseModelArray> = L extends readonly [
  infer Li extends LiteralsBaseModel,
]
  ? readonly [Li["value"]]
  : L extends readonly [infer Li extends LiteralsBaseModel, ...infer R extends LiteralsBaseModel[]]
    ? readonly [Li["value"], ...LiteralsBaseModelArrayValues<R>]
    : never;

export type LiteralsArrayModels<L extends readonly string[]> = L extends readonly [
  infer Li extends string,
]
  ? readonly [{ value: Li }]
  : L extends readonly [infer Li extends string, ...infer R extends string[]]
    ? readonly [{ value: Li }, ...LiteralsArrayModels<R>]
    : never;

export type LiteralsMembers<L extends Literals> = L extends LiteralsArray
  ? L
  : L extends LiteralsBaseModelArray
    ? LiteralsBaseModelArrayValues<L>
    : never;

export type LiteralsModel<
  L extends Literals,
  V extends LiteralsMember<L> = LiteralsMember<L>,
> = L extends LiteralsArray
  ? V extends LiteralsMember<L>
    ? { value: V }
    : never
  : L extends LiteralsBaseModelArray
    ? V extends LiteralsMember<L>
      ? Extract<L[number], { value: V }>
      : never
    : never;

export type LiteralsModelAttributeName<L extends Literals> = L extends LiteralsArray
  ? "value"
  : L extends LiteralsBaseModelArray
    ? Exclude<keyof L[number], "accessor">
    : never;

export type LiteralsBaseModelArrayAttributeValues<
  L extends readonly LiteralsBaseModel[],
  N extends string,
> =
  N extends LiteralsModelAttributeName<L>
    ? L extends readonly [infer Li extends LiteralsBaseModel]
      ? readonly [Li[N]]
      : L extends readonly [
            infer Li extends LiteralsBaseModel,
            ...infer R extends LiteralsBaseModel[],
          ]
        ? readonly [Li[N], ...LiteralsBaseModelArrayAttributeValues<R, N>]
        : never
    : never;

export type LiteralsAttributeValues<
  L extends Literals,
  N extends LiteralsModelAttributeName<L>,
> = L extends LiteralsBaseModelArray
  ? LiteralsBaseModelArrayAttributeValues<L, N>
  : L extends LiteralsArray
    ? L
    : never;

export type LiteralsAttributeValue<
  L extends Literals,
  V extends LiteralsMember<L>,
  N extends LiteralsModelAttributeName<L>,
> = L extends LiteralsBaseModelArray
  ? Extract<L[number], { value: V }>[N]
  : N extends "value"
    ? Extract<L[number], V>
    : never;

export type LiteralsModels<L extends Literals> = L extends LiteralsArray
  ? LiteralsArrayModels<L>
  : L;

export type ExtractLiteralsFromModelArray<
  L extends LiteralsBaseModelArray,
  I extends readonly LiteralsMembers<L>[number][],
> = L extends readonly [infer Li extends LiteralsBaseModel]
  ? Li["value"] extends I[number]
    ? readonly [Li]
    : readonly []
  : L extends readonly [infer H extends LiteralsBaseModel, ...infer R extends LiteralsBaseModel[]]
    ? H["value"] extends I[number]
      ? readonly [H, ...ExtractLiteralsFromModelArray<R, I>]
      : ExtractLiteralsFromModelArray<R, I>
    : never;

export type ExtractLiteralsFromArray<
  L extends LiteralsArray,
  I extends readonly LiteralsMembers<L>[number][],
> = L extends readonly [infer Li extends string]
  ? Li extends I[number]
    ? readonly [Li]
    : readonly []
  : L extends readonly [infer H extends string, ...infer R extends LiteralsArray]
    ? H extends I[number]
      ? readonly [H, ...ExtractLiteralsFromArray<R, I>]
      : ExtractLiteralsFromArray<R, I>
    : never;

export type ExtractLiterals<
  L extends Literals,
  I extends readonly LiteralsMembers<L>[number][],
> = L extends LiteralsArray
  ? ExtractLiteralsFromArray<L, I>
  : L extends LiteralsBaseModelArray
    ? ExtractLiteralsFromModelArray<L, I>
    : never;

export type ExcludeLiteralsFromModelArray<
  L extends LiteralsBaseModelArray,
  I extends readonly LiteralsMembers<L>[number][],
> = L extends readonly [infer Li extends LiteralsBaseModel]
  ? Li["value"] extends I[number]
    ? readonly []
    : readonly [Li]
  : L extends readonly [infer H extends LiteralsBaseModel, ...infer R extends LiteralsBaseModel[]]
    ? H["value"] extends I[number]
      ? ExcludeLiteralsFromModelArray<R, I>
      : readonly [H, ...ExcludeLiteralsFromModelArray<R, I>]
    : never;

export type ExcludeLiteralsFromArray<
  L extends LiteralsArray,
  I extends readonly LiteralsMembers<L>[number][],
> = L extends readonly [infer Li extends string]
  ? Li extends I[number]
    ? readonly []
    : readonly [Li]
  : L extends readonly [infer H extends string, ...infer R extends LiteralsArray]
    ? H extends I[number]
      ? ExcludeLiteralsFromArray<R, I>
      : readonly [H, ...ExcludeLiteralsFromArray<R, I>]
    : never;

export type ExcludeLiterals<
  L extends Literals,
  I extends readonly LiteralsMembers<L>[number][],
> = L extends LiteralsArray
  ? ExcludeLiteralsFromArray<L, I>
  : L extends LiteralsBaseModelArray
    ? ExcludeLiteralsFromModelArray<L, I>
    : never;
