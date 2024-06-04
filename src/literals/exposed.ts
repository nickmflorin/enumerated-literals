import { type HumanizeListOptions } from "~/formatters";

import { type EnumeratedLiteralsAccessors } from "./accessors";
import {
  type Literals,
  type LiteralsValues,
  type LiteralsArray,
  type LiteralsValue,
  type ExcludeLiterals,
  type ExtractLiterals,
  type LiteralsBaseModelArray,
  type LiteralsModels,
  type LiteralsModelAttributeName,
  type LiteralsAttributeValues,
  type LiteralsAttributeValue,
} from "./core";
import {
  type EnumeratedLiteralsOptions,
  type OptionsWithNewSet,
  type EnumeratedLiteralsDynamicOptions,
} from "./options";

type EnumeratedLiteralsAssertion<L extends Literals> = (
  value: unknown,
  errorMessage?: string,
) => asserts value is LiteralsValue<L>;

export type LiteralsModel<
  L extends Literals,
  V extends LiteralsValue<L> = LiteralsValue<L>,
> = L extends LiteralsArray
  ? V extends LiteralsValue<L>
    ? { value: V }
    : never
  : L extends LiteralsBaseModelArray
    ? V extends LiteralsValue<L>
      ? Extract<L[number], { value: V }>
      : never
    : never;

export type GetModelSafeOptions = {
  readonly strict?: boolean;
};

export type GetModelSafeRT<L extends Literals, O extends GetModelSafeOptions> = O extends {
  strict: true;
}
  ? LiteralsModel<L, LiteralsValue<L>>
  : LiteralsModel<L, LiteralsValue<L>> | null;

type GetModelSafe<L extends Literals> = {
  <O extends GetModelSafeOptions>(value: unknown, opts: O): GetModelSafeRT<L, O>;
};

/**
 * @template L - The {@link EnumeratedLiterals} instance type.
 *
 * The type of the constant string literals on the {@link EnumeratedLiterals} instance defined by
 * the generic type parameter 'L'.
 */
export type EnumeratedLiteralsType<L> =
  L extends EnumeratedLiterals<
    infer Ll extends Literals,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    infer _O
  >
    ? LiteralsValue<Ll>
    : never;

export type EnumeratedLiteralsModel<L> =
  L extends EnumeratedLiterals<
    infer Ll extends Literals,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    infer _O
  >
    ? LiteralsModel<Ll, LiteralsValue<Ll>>
    : never;

export type EnumeratedLiteralsProvidedForm = "models" | "values";

/**
 * A generic type that represents the return of the {@link enumeratedLiterals} method.
 *
 * Generally, this type represents a set of discrete, constant string literal values as an object
 * containing those values, attributes used to access those values individually, and a handful of
 * strongly-typed methods related to those values.
 */
export type EnumeratedLiterals<
  L extends Literals,
  O extends EnumeratedLiteralsOptions<L>,
> = EnumeratedLiteralsAccessors<L, O> & {
  /**
   * Private property that should not be accessed externally.
   */
  readonly __provided_form__: EnumeratedLiteralsProvidedForm;
  /**
   * Private property that should not be accessed externally.
   */
  readonly __options__: O;
  /**
   * The constant string literal values on the {@link EnumeratedLiterals} instance.
   */
  readonly values: LiteralsValues<L>;
  /**
   * The {@link object}(s) associated with each value on the {@link EnumeratedLiterals} instance.
   */
  readonly models: LiteralsModels<L>;
  /**
   * Returns a human readable string representing the constant string literal values associated with
   * the {@link EnumeratedLiterals} instance.
   *
   * @example
   * ```ts
   * import { enumeratedLiterals } from "enumerated-literals";
   *
   * const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
   * // "apple, banana, blueberry, or orange"
   * Fruits.humanize({ conjunction: "or" });
   * ```
   *
   * @param {HumanizeListOptions<string>} options
   *   Options that can be used to customize the humanized string.
   *
   * @returns {string}
   *   A human readable representation of the values on the {@link EnumeratedLiterals} instance.
   */
  readonly humanize: (options?: HumanizeListOptions<string>) => string;
  /**
   * @template {LiteralsModelAttributeName<L>} N - The attribute name.
   *
   * Returns the values for a given attribute, {@link N}, on each model that is associated with
   * the {@link EnumeratedLiterals} instance.
   *
   * @param {N} attribute
   *   The name of the attribute for which the values should be returned.
   *
   * @returns {LiteralsAttributeValues<L, N>}
   *   The values for the given attribute, {@link N}, on each model associated with the
   *   {@link EnumeratedLiterals} instance.
   */
  readonly getAttributes: <N extends LiteralsModelAttributeName<L>>(
    attribute: N,
  ) => LiteralsAttributeValues<L, N>;
  /**
   * @template {LiteralsValue<L>} value - The model value.
   * @template {LiteralsModelAttributeName<L>} N - The attribute name.
   *
   * Returns the value for a given attribute, {@link N}, on the model associated with a specific
   * value, {@link V}, on the {@link EnumeratedLiterals} instance.
   *
   * @example
   * ```ts
   * import { enumeratedLiterals } from "enumerated-literals";
   *
   * const Fruits = enumeratedLiterals([
   *   { value: "apple", description: "A red fruit", label: "Apple" },
   *   { value: "banana", description: "A yellow fruit", label: "Banana" },
   *   { value: "blueberry", description: "A blue fruit", label: "Blueberry" },
   *   { value: "orange", description: "An orange fruit", label: "Orange" }
   * ] as const, {});
   *
   * Fruits.getAttribute("apple", "description"); // "A red fruit"
   * ```
   *
   * @param {V} value
   *   The value on the {@link EnumeratedLiterals} instance.
   *
   * @param {N} attribute
   *   The name of the attribute for which the value should be returned.
   *
   * @returns {LiteralsAttributeValue<L, V, N>}
   *   The value for the given attribute, {@link N}, on the model associated with the value,
   *   {@link V}, on the {@link EnumeratedLiterals} instance.
   */
  readonly getAttribute: <V extends LiteralsValue<L>, N extends LiteralsModelAttributeName<L>>(
    value: V,
    attribute: N,
  ) => LiteralsAttributeValue<L, V, N>;
  /**
   * Returns the model associated with a specific constant string literal value,
   * {@link LiteralsValue<L>} on the {@link EnumeratedLiterals}.
   *
   * @example
   *
   * ```ts
   * import { enumeratedLiterals } from "enumerated-literals";
   *
   * const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
   * Fruits.getModel("apple") // Returns { value: "apple" }
   * ```
   */
  readonly getModel: <V extends LiteralsValue<L>>(v: V) => LiteralsModel<L, V>;
  /**
   * Returns the model associated with a specific constant string literal value,
   * {@link LiteralsValue<L>} on the {@link EnumeratedLiterals} instance if that provided value
   * is in fact on the {@link EnumeratedLiterals} instance.
   *
   * In other words, this method does not assume that the provided value is in the set of constant
   * string literals on the {@link EnumeratedLiterals} instance, but instead will either return
   * `null` (if `options.strict` is `false` or not provided) or throw an
   * {@link InvalidLiteralValueError} (if `options.strict` is `true`) if the provided value is not
   * in the set of constant string literals on the {@link EnumeratedLiterals} instance.
   *
   * @example
   *
   * ```ts
   * import { enumeratedLiterals } from "enumerated-literals";
   *
   * const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
   *
   * const v: unknown = "cucumber";
   * Fruits.getModelSafe(v, { strict: true });
   *
   * Fruits.getModelSafe(v, { strict: false });
   *
   * // Same as above
   * Fruits.getModelSafe(v, {});
   * ```
   */
  readonly getModelSafe: GetModelSafe<L>;
  /**
   * Returns the provided value, 'v', typed as a value in the set of constant string literal values
   * on the {@link EnumeratedLiterals} instance, {@link LiteralsValue<V>}, if the value is indeed
   * in the set of constant string literal values on the {@link EnumeratedLiterals} instance.
   *
   * Otherwise, the method will throw an {@link InvalidLiteralValueError}.
   *
   * @param {unknown} v
   *   The value that should be parsed.
   *
   * @param {string} errorMessage
   *   An optional error message that should be used when an {@link Error} is thrown due to the
   *   provided value 'v' not being in the set of constant string literal values on the
   *   {@link EnumeratedLiterals} instance.
   *
   * @returns {LiteralsValue<L>}
   *   The provided value, 'v', typed as a value in the set of constant string literal values on the
   *   {@link EnumeratedLiterals} instance, if the provided value 'v' exists on the set of
   *   constants string literal values on the {@link EnumeratedLiterals} instance.
   */
  readonly parse: (v: unknown, errorMessage?: string) => LiteralsValue<L>;
  /**
   * A type assertion that throws an {@link InvalidLiteralValueError} if the provided value is not
   * in the set of constant string literal values on the {@link EnumeratedLiterals} instance.
   *
   * @param {unknown} v
   *   The value that the assertion should be made with.
   *
   * @param {string} errorMessage
   *   An optional error message that should be used when an {@link InvalidLiteralValueError} is
   *   thrown due to the provided value 'v' not being in the set of constant string literal values
   *   on the
   *   {@link EnumeratedLiterals} instance.
   */
  readonly assert: EnumeratedLiteralsAssertion<L>;
  /**
   * A typeguard that returns whether or not the provided value 'v' is in the set of constant string
   * literal values on the {@link EnumeratedLiterals} instance.
   *
   * @param {unknown} v
   *   The value for which the determination should be made as to whether it is in the set of
   *   constant string literal values on the {@link EnumeratedLiterals} instance.
   *
   * @returns {v is LiteralsValue<L>}
   *   Whether or not the provided value 'v' is in the set of constant string literal values on the
   *   {@link EnumeratedLiterals} instance.
   */
  readonly contains: (v: unknown) => v is LiteralsValue<L>;
  /**
   * Returns a new {@link EnumeratedLiterals} instance that consists of just the values that are
   * provided to the method.
   */
  readonly pick: <
    T extends readonly LiteralsValues<L>[number][],
    Ot extends EnumeratedLiteralsDynamicOptions<ExtractLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ) => EnumeratedLiterals<
    ExtractLiterals<L, T>,
    OptionsWithNewSet<ExtractLiterals<L, T>, Ot, L, O>
  >;
  /**
   * Returns a new {@link EnumeratedLiterals} instance that consists of just the values on the
   * instance exluding those that are provided to the method.
   */
  readonly omit: <
    T extends readonly LiteralsValues<L>[number][],
    Ot extends EnumeratedLiteralsDynamicOptions<ExcludeLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ) => EnumeratedLiterals<
    ExcludeLiterals<L, T>,
    OptionsWithNewSet<ExcludeLiterals<L, T>, Ot, L, O>
  >;
  /**
   * Throws an {@link InvalidLiteralValueError} with a message that is generated based on optionally
   * provided options to the {@link EnumeratedLiterals} instance on instantiation and the optional
   * message {@link string} that is provided as the seconda argument to the method.
   */
  readonly throwInvalidValue: (v: unknown, errorMessage?: string) => void;
};
