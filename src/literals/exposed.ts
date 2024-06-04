import type * as core from "./core";
import type * as options from "./options";

import { type HumanizeListOptions } from "~/formatters";

import { type EnumeratedLiteralsAccessors } from "./accessors";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for JSDoc */
import * as errors from "./errors";

type EnumeratedLiteralsAssertion<L extends core.Literals> = (
  value: unknown,
  errorMessage?: string,
) => asserts value is core.LiteralsValue<L>;

export type LiteralsModel<
  L extends core.Literals,
  V extends core.LiteralsValue<L> = core.LiteralsValue<L>,
> = L extends core.LiteralsArray
  ? V extends core.LiteralsValue<L>
    ? { value: V }
    : never
  : L extends core.LiteralsBaseModelArray
    ? V extends core.LiteralsValue<L>
      ? Extract<L[number], { value: V }>
      : never
    : never;

export type GetModelSafeOptions = {
  readonly strict?: boolean;
};

export type GetModelSafeRT<L extends core.Literals, O extends GetModelSafeOptions> = O extends {
  strict: true;
}
  ? LiteralsModel<L, core.LiteralsValue<L>>
  : LiteralsModel<L, core.LiteralsValue<L>> | null;

type GetModelSafe<L extends core.Literals> = {
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
    infer Ll extends core.Literals,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    infer _O
  >
    ? core.LiteralsValue<Ll>
    : never;

export type EnumeratedLiteralsModel<L> =
  L extends EnumeratedLiterals<
    infer Ll extends core.Literals,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    infer _O
  >
    ? LiteralsModel<Ll, core.LiteralsValue<Ll>>
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
  L extends core.Literals,
  O extends options.EnumeratedLiteralsOptions<L>,
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
  readonly values: core.LiteralsValues<L>;
  /**
   * The {@link object}(s) associated with each value on the {@link EnumeratedLiterals} instance.
   */
  readonly models: core.LiteralsModels<L>;
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
   * @returns {string} A human readable representation of the values on the
   * {@link EnumeratedLiterals} instance.
   */
  humanize(options?: HumanizeListOptions<string>): string;
  /**
   * @template {LiteralsModelAttributeName<L>} N - The attribute name.
   *
   * Returns the values for a given attribute, {@link N}, on each model that is associated with
   * the {@link EnumeratedLiterals} instance.
   *
   * @param {N} attribute
   *   The name of the attribute for which the values should be returned.
   *
   * @returns {LiteralsAttributeValues<L, N>} The values for the given attribute, {@link N}, on each
   * model associated with the {@link EnumeratedLiterals} instance.
   */
  getAttributes<N extends core.LiteralsModelAttributeName<L>>(
    attribute: N,
  ): core.LiteralsAttributeValues<L, N>;
  /**
   * @template {core.LiteralsValue<L>} value - The model value.
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
   * @returns {LiteralsAttributeValue<L, V, N>} The value for the given attribute, {@link N}, on
   * the model associated with the value, {@link V}, on the {@link EnumeratedLiterals} instance.
   */
  getAttribute<V extends core.LiteralsValue<L>, N extends core.LiteralsModelAttributeName<L>>(
    value: V,
    attribute: N,
  ): core.LiteralsAttributeValue<L, V, N>;
  /**
   * Returns the model associated with a specific constant string literal value,
   * {@link core.LiteralsValue<L>} on the {@link EnumeratedLiterals}.
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
  getModel<V extends core.LiteralsValue<L>>(v: V): LiteralsModel<L, V>;
  /**
   * Returns the model associated with a specific constant string literal value,
   * {@link core.LiteralsValue<L>} on the {@link EnumeratedLiterals} instance if that provided value
   * is in fact on the {@link EnumeratedLiterals} instance.
   *
   * In other words, this method does not assume that the provided value is in the set of constant
   * string literals on the {@link EnumeratedLiterals} instance, but instead will either return
   * {@link null} or throw.
   *
   * @throws An {@link errors.InvalidLiteralValueError} if the provided value 'v' is not in the set
   * of constant string literals on the {@link EnumeratedLiterals} instance.
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
  getModelSafe: GetModelSafe<L>;
  /**
   * Returns the provided value, 'v', typed as a value in the set of constant string literal values
   * on the {@link EnumeratedLiterals} instance, {@link core.LiteralsValue<V>}, if the value is
   * indeed in the set of constant string literal values on the {@link EnumeratedLiterals} instance.
   *
   * Otherwise, the method will throw an {@link errors.InvalidLiteralValueError}.
   *
   * @param {unknown} v
   *   The value that should be parsed.
   *
   * @param {string} errorMessage
   *   An optional error message that should be included in the message of the
   *   {@link errors.InvalidLiteralValueError} in the case that the provided value 'v' fails the
   *   type assertion.
   *
   * @throws An {@link errors.InvalidLiteralValueError} if the provided value 'v' is not in the set
   * of constant string literals on the {@link EnumeratedLiterals} instance.
   *
   * @returns {core.LiteralsValue<L>} The provided value, 'v', typed as a value in the set of
   * constant string literal values on the {@link EnumeratedLiterals} instance, if the provided
   * value 'v' exists on the set of constants string literal values on the
   * {@link EnumeratedLiterals} instance.
   */
  parse(v: unknown, errorMessage?: string): core.LiteralsValue<L>;
  /**
   * A type assertion that throws an {@link errors.InvalidLiteralValueError} if the provided value
   * is not in the set of constant string literal values on the {@link EnumeratedLiterals} instance.
   *
   * @param {unknown} v
   *   The value that the assertion should be made with.
   *
   * @param {string} errorMessage
   *   An optional error message that should be included in the message of the
   *   {@link errors.InvalidLiteralValueError} in the case that the provided value 'v' fails the
   *   type assertion.
   *
   * @throws An {@link errors.InvalidLiteralValueError} if the provided value 'v' is not in the set
   * of constant string literals on the {@link EnumeratedLiterals} instance.
   */
  assert: EnumeratedLiteralsAssertion<L>;
  /**
   * A typeguard that returns whether or not the provided value 'v' is in the set of constant string
   * literal values on the {@link EnumeratedLiterals} instance.
   *
   * @param {unknown} v
   *   The applicable value that the method should return whether or not it is in the set of
   *   constant string literals on this {@link EnumeratedLiterals} instance.
   *
   * @returns {boolean} Whether or not the provided value 'v' is in the set of constant string
   * literal values on the {@link EnumeratedLiterals} instance.
   */
  contains(v: unknown): v is core.LiteralsValue<L>;
  /**
   * Returns a new {@link EnumeratedLiterals} instance that consists of just the values that are
   * provided to the method.
   */
  pick<
    T extends readonly core.LiteralsValues<L>[number][],
    Ot extends options.EnumeratedLiteralsDynamicOptions<core.ExtractLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ): EnumeratedLiterals<
    core.ExtractLiterals<L, T>,
    options.OptionsWithNewSet<core.ExtractLiterals<L, T>, Ot, L, O>
  >;
  /**
   * Returns a new {@link EnumeratedLiterals} instance that consists of just the values on the
   * instance excluding those that are provided to the method.
   */
  omit<
    T extends readonly core.LiteralsValues<L>[number][],
    Ot extends options.EnumeratedLiteralsDynamicOptions<core.ExcludeLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ): EnumeratedLiterals<
    core.ExcludeLiterals<L, T>,
    options.OptionsWithNewSet<core.ExcludeLiterals<L, T>, Ot, L, O>
  >;
  /**
   * Throws an {@link errors.InvalidLiteralValueError}.
   *
   * The message on the {@link errors.InvalidLiteralValueError} is automatically generated based on
   * the string literals on the {@link EnumeratedLiterals} instance, but it can be configured with
   *
   * - The 'invalidValueErrorMessage' property on the {@link options.EnumeratedLiteralsOptions}.
   * - The 'errorMessage' argument to this method.
   *
   * @param {unknown} v
   *   The value that is invalid.
   *
   * @param {string} errorMessage
   *   An optional error message that should be included in the thrown
   *   {@link errors.InvalidLiteralValueError}.
   *
   * @throws Always throws an {@link errors.InvalidLiteralValueError}.
   */
  throwInvalidValue(v: unknown, errorMessage?: string): void;
};
