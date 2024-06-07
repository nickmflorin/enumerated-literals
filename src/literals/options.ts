import {
  type AccessorCase,
  type AccessorSpaceReplacement,
  type AccessorHyphenReplacement,
} from "./accessors";
import {
  type Literals,
  type LiteralsBaseModelArray,
  type LiteralsArray,
  literalsAreArray,
  literalsAreModelArray,
} from "./core";
import { type EnumeratedLiteralsInvalidValueErrorMessage } from "./errors";

export type DefaultAccessorOptions<L extends Literals> = L extends LiteralsArray
  ? {
      readonly accessorSpaceReplacement: "_";
      readonly accessorHyphenReplacement: "_";
      readonly accessorCase: "upper";
    }
  : L extends LiteralsBaseModelArray
    ? {
        readonly accessorSpaceReplacement: "_";
        readonly accessorHyphenReplacement: null;
        readonly accessorCase: null;
      }
    : never;

export const DEFAULT_ACCESSOR_ARRAY_OPTIONS: DefaultAccessorOptions<LiteralsArray> = {
  accessorSpaceReplacement: "_" as const,
  accessorHyphenReplacement: "_" as const,
  accessorCase: "upper",
};

/*
If the accessors are explicitly provided on the model, we assume that the developer has provided the
explicit, literal accessor they want to be used, and unless they explicitly provide the options for
space replacement, hyphen replacement or casing, we will assume the minimal defaults such that the
accessor they provide is transformed the least amount.
*/
export const DEFAULT_ACCESSOR_MODEL_ARRAY_OPTIONS: DefaultAccessorOptions<LiteralsBaseModelArray> =
  {
    accessorSpaceReplacement: "_" as const,
    accessorHyphenReplacement: null,
    accessorCase: null,
  };

export const getDefaultLiteralsAccessorOptions = <L extends Literals>(
  literals: L,
): DefaultAccessorOptions<L> => {
  if (literalsAreModelArray(literals)) {
    return DEFAULT_ACCESSOR_MODEL_ARRAY_OPTIONS as DefaultAccessorOptions<L>;
  } else if (literalsAreArray(literals)) {
    return DEFAULT_ACCESSOR_ARRAY_OPTIONS as DefaultAccessorOptions<L>;
  }
  throw new Error("Unreachable code path!");
};

export type EnumeratedLiteralsDynamicOptions<L extends Literals> = Partial<{
  readonly invalidValueErrorMessage: EnumeratedLiteralsInvalidValueErrorMessage<L>;
}>;

export type EnumeratedLiteralsOptions<L extends Literals> = EnumeratedLiteralsDynamicOptions<L> &
  Partial<{
    readonly accessorSpaceReplacement: AccessorSpaceReplacement;
    readonly accessorHyphenReplacement: AccessorHyphenReplacement;
    readonly accessorCase: AccessorCase;
  }>;

export const ENUMERATED_LITERALS_STATIC_OPTIONS = [
  "accessorSpaceReplacement",
  "accessorHyphenReplacement",
  "accessorCase",
] as const;

type EnumeratedLiteralsStaticOption = (typeof ENUMERATED_LITERALS_STATIC_OPTIONS)[number];

type EnumeratedLiteralsStaticOptions<
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = Pick<O, EnumeratedLiteralsStaticOption & keyof O>;

export const pickStaticOptions = <L extends Literals, O extends EnumeratedLiteralsOptions<L>>(
  opts: O,
): EnumeratedLiteralsStaticOptions<L, O> => {
  let staticOptions: EnumeratedLiteralsStaticOptions<L, O> = {} as EnumeratedLiteralsStaticOptions<
    L,
    O
  >;
  for (const k of ENUMERATED_LITERALS_STATIC_OPTIONS) {
    if (opts[k] !== undefined) {
      staticOptions = { ...staticOptions, [k]: opts[k] };
    }
  }
  return staticOptions;
};

export type OptionsWithNewSet<
  L extends Literals,
  O extends EnumeratedLiteralsDynamicOptions<L>,
  LOld extends Literals,
  OOld extends EnumeratedLiteralsOptions<LOld>,
> = {
  [key in keyof O | keyof OOld]: key extends EnumeratedLiteralsStaticOption
    ? OOld[key]
    : key extends keyof O
      ? O[key]
      : never;
};
