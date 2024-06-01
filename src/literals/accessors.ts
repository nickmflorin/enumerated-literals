import { type Literals, type LiteralsBaseModelArray, type LiteralsArray } from "./core";
import {
  type EnumeratedLiteralsOptions,
  type DefaultAccessorOptions,
  getDefaultLiteralsAccessorOptions,
} from "./options";

export type AccessorCase = "upper" | "lower" | null;

export type RemoveUnnecessaryWhiteSpace<S extends string> =
  S extends `${infer L extends string}  ${infer R extends string}`
    ? RemoveUnnecessaryWhiteSpace<`${L} ${R}`>
    : S;

export type ParseAccessorCase<
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = O extends {
  accessorCase: infer S;
}
  ? S extends AccessorCase
    ? S
    : never
  : DefaultAccessorOptions<L>["accessorCase"];

export type FormatAccessorCase<
  S extends string,
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> =
  ParseAccessorCase<L, O> extends "upper"
    ? Uppercase<S>
    : ParseAccessorCase<L, O> extends "lower"
      ? Lowercase<S>
      : ParseAccessorCase<L, O> extends null
        ? S
        : never;

export type AccessorSpaceReplacement = "_" | "-" | "";

export type ParseAccessorSpaceReplacement<
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = O extends {
  accessorSpaceReplacement: infer S;
}
  ? S extends AccessorSpaceReplacement
    ? S
    : never
  : DefaultAccessorOptions<L>["accessorSpaceReplacement"];

type ReplaceSpacesWith<
  T extends string,
  R extends AccessorSpaceReplacement,
> = T extends `${infer V extends string} ${infer L extends string}`
  ? ReplaceSpacesWith<`${V}${R}${L}`, R>
  : T;

export type FormatAccessorSpaces<
  S extends string,
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> =
  ParseAccessorSpaceReplacement<L, O> extends "_"
    ? ReplaceSpacesWith<S, "_">
    : ParseAccessorCase<L, O> extends "-"
      ? ReplaceSpacesWith<S, "-">
      : ParseAccessorSpaceReplacement<L, O> extends ""
        ? ReplaceSpacesWith<S, "">
        : never;

export type AccessorHyphenReplacement = "_" | "" | null;

export type ParseAccessorHyphenReplacement<
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = O extends {
  accessorHyphenReplacement: infer S;
}
  ? S extends AccessorSpaceReplacement
    ? S
    : never
  : DefaultAccessorOptions<L>["accessorHyphenReplacement"];

type ReplaceHyphensWith<
  T extends string,
  R extends Extract<AccessorHyphenReplacement, string>,
> = T extends `${infer V extends string}-${infer L extends string}`
  ? ReplaceHyphensWith<`${V}${R}${L}`, R>
  : T;

export type FormatAccessorHyphens<
  S extends string,
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> =
  ParseAccessorHyphenReplacement<L, O> extends "_"
    ? ReplaceHyphensWith<S, "_">
    : ParseAccessorHyphenReplacement<L, O> extends ""
      ? ReplaceHyphensWith<S, "">
      : ParseAccessorHyphenReplacement<L, O> extends null
        ? S
        : never;

export type LiteralsAccessor<
  V extends string,
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = V extends string
  ? FormatAccessorSpaces<
      FormatAccessorHyphens<FormatAccessorCase<RemoveUnnecessaryWhiteSpace<V>, L, O>, L, O>,
      L,
      O
    >
  : never;

export type EnumeratedLiteralsBaseModelArrayAccessors<
  L extends LiteralsBaseModelArray,
  O extends EnumeratedLiteralsOptions<L>,
> = {
  // It is important to condition the key on string such that it distributes over the union.
  [key in keyof L as key extends string
    ? L[key] extends { accessor: infer A extends string }
      ? LiteralsAccessor<A, L, O>
      : L[key] extends { value: infer V extends string }
        ? LiteralsAccessor<V, L, O>
        : never
    : never]: L[key] extends { value: infer V extends string } ? V : never;
};

export type EnumeratedLiteralsArrayAccessors<
  L extends LiteralsArray,
  O extends EnumeratedLiteralsOptions<L>,
> = {
  [key in L[number] as key extends string ? LiteralsAccessor<key, L, O> : never]: key;
};

export type EnumeratedLiteralsAccessors<
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = L extends LiteralsArray
  ? EnumeratedLiteralsArrayAccessors<L, O>
  : L extends LiteralsBaseModelArray
    ? EnumeratedLiteralsBaseModelArrayAccessors<L, O>
    : never;

const AccessorRegex = /^[A-Za-z]+[A-Za-z0-9-_\s]*$/;

const InvalidAccessorConditions: { check: (v: string) => boolean; message: string }[] = [
  {
    check: v => v.trim().length !== v.length,
    message: "The accessor must not contain leading or trailing whitespace.",
  },
  {
    check: v => v.length === 0,
    message: "The accessor must not be an empty string.",
  },
  {
    check: v => !AccessorRegex.test(v),
    message:
      "The accessor must only contain alphanumeric characters, hyphens, underscores, " +
      "and spaces, and it must begin with a alpha character.",
  },
];

export const validateAccessor = <T extends string>(value: T): T => {
  for (const { check, message } of InvalidAccessorConditions) {
    if (check(value)) {
      throw new Error(message);
    }
  }
  return value;
};

export const toLiteralAccessor = <
  V extends string,
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
>(
  v: V,
  literals: L,
  options: O,
): LiteralsAccessor<V, L, O> => {
  const opts = { ...getDefaultLiteralsAccessorOptions(literals), ...options };

  let accessor: string = validateAccessor(v);
  // Remove white space that is more than 1 characters long.
  while (accessor.includes(" ".repeat(2))) {
    accessor = accessor.replaceAll(" ".repeat(2), " ");
  }

  if (opts.accessorCase === "upper") {
    accessor = accessor.toUpperCase();
  } else if (opts.accessorCase === "lower") {
    accessor = accessor.toLowerCase();
  }
  if (opts.accessorHyphenReplacement) {
    accessor = accessor.replaceAll("-", opts.accessorHyphenReplacement);
  }
  accessor = accessor.replaceAll(" ", opts.accessorSpaceReplacement);
  return accessor as LiteralsAccessor<V, L, O>;
};
