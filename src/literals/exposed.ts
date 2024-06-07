import type * as core from "./core";
import type * as options from "./options";

import { type HumanizeListOptions } from "~/formatters";

import { type EnumeratedLiteralsAccessors } from "./accessors";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for JSDoc */
import * as errors from "./errors";

type EnumeratedLiteralsAssertion<L extends core.Literals> = (
  value: unknown,
  errorMessage?: string,
) => asserts value is core.LiteralsMember<L>;

type EnumeratedLiteralsMultipleAssertion<L extends core.Literals> = (
  value: unknown[],
  errorMessage?: string,
) => asserts value is core.LiteralsMember<L>[];

export type GetModelSafeOptions = {
  readonly strict?: boolean;
};

export type GetModelSafeRT<L extends core.Literals, O extends GetModelSafeOptions> = O extends {
  strict: true;
}
  ? core.LiteralsModel<L, core.LiteralsMember<L>>
  : core.LiteralsModel<L, core.LiteralsMember<L>> | null;

type GetModelSafe<L extends core.Literals> = {
  <O extends GetModelSafeOptions>(value: unknown, opts: O): GetModelSafeRT<L, O>;
};

/**
 * @template L - The {@link EnumeratedLiterals} instance type.
 *
 * The type of the constant string literals on the {@link EnumeratedLiterals} instance defined by
 * the generic type parameter 'L'.
 */
export type EnumeratedLiteralsMember<L> =
  L extends EnumeratedLiterals<
    infer Ll extends core.Literals,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    infer _O
  >
    ? core.LiteralsMember<Ll>
    : never;

export type EnumeratedLiteralsModel<L> =
  L extends EnumeratedLiterals<
    infer Ll extends core.Literals,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    infer _O
  >
    ? core.LiteralsModel<Ll, core.LiteralsMember<Ll>>
    : never;

export interface ParseOptions {
  /**
   * Defines how the method should throw or return in the case that it encounters invalid values.
   *
   * If the 'multi' option is 'true', it defines whether or not an
   * {@link errors.InvalidLiteralValueError} should be thrown if any of the values in the provided
   * array of values are not members of the {@link EnumeratedLiterals} instance or if those invalid
   * values should simply be filtered out of the return.
   *
   * If the 'multi' option is 'false', it defines whether or not an
   * {@link errors.InvalidLiteralValueError} should be thrown if the provided value is not a member
   *  of the {@link EnumeratedLiterals} instance or if the method should simply return null.
   */
  readonly strict?: boolean;
  /**
   * An optional error message that should be included in the message of the
   * {@link errors.InvalidLiteralValueError} in the case that the provided value fails the
   * type assertion.
   */
  readonly errorMessage?: string;
  /**
   * Whether or not the method should parse each value in a provided array 'v' separately.
   *
   * If 'true', the method will return an array of the parsed values.  If 'false', the method will
   * return a single parsed value.
   *
   * Default: 'false'
   */
  readonly multi?: boolean;
}

export type ParseArg<O extends ParseOptions> = O extends { multi: true } ? unknown[] : unknown;

export type ParseReturn<L extends core.Literals, O extends ParseOptions> = O extends { multi: true }
  ? core.LiteralsMember<L>[]
  : O extends {
        strict: false;
      }
    ? core.LiteralsMember<L> | null
    : core.LiteralsMember<L>;

export interface IEnumeratedLiteralsBase<
  L extends core.Literals,
  O extends options.EnumeratedLiteralsOptions<L>,
> {
  /**
   * The constant string literal values on the {@link EnumeratedLiterals} instance.
   */
  readonly members: core.LiteralsMembers<L>;
  /**
   * The {@link object}(s) associated with each member of the {@link EnumeratedLiterals} instance.
   */
  readonly models: core.LiteralsModels<L>;
  /**
   * Returns a human readable string representing the members associated with the
   * {@link EnumeratedLiterals} instance.
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
   * @template {core.LiteralsMember<L>} value - The model value.
   * @template {LiteralsModelAttributeName<L>} N - The attribute name.
   *
   * Returns the value for a given attribute, {@link N}, on the model associated with a specific
   * member, {@link V}, of the {@link EnumeratedLiterals} instance.
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
   * @param {V} member
   *   The member on the {@link EnumeratedLiterals} instance.
   *
   * @param {N} attribute
   *   The name of the attribute for which the value should be returned.
   *
   * @returns {LiteralsAttributeValue<L, V, N>} The value for the given attribute, {@link N}, on
   * the model associated with the member, {@link V}, of the {@link EnumeratedLiterals} instance.
   */
  getAttribute<V extends core.LiteralsMember<L>, N extends core.LiteralsModelAttributeName<L>>(
    member: V,
    attribute: N,
  ): core.LiteralsAttributeValue<L, V, N>;
  /**
   * Returns the model associated with a specific member {@link core.LiteralsMember<L>} of the
   * {@link EnumeratedLiterals}.
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
  getModel<V extends core.LiteralsMember<L>>(v: V): core.LiteralsModel<L, V>;
  /**
   * Returns the model associated with a specific member
   * {@link core.LiteralsMember<L>} of the {@link EnumeratedLiterals} instance if that provided
   * value is in fact a member of the {@link EnumeratedLiterals} instance.
   *
   * In other words, this method does not assume that the provided value is a member of the
   * {@link EnumeratedLiterals} instance, but will instead either return {@link null} or throw
   * an {@link errors.InvalidLiteralValueError} in the case that it is not.
   *
   * @throws An {@link errors.InvalidLiteralValueError} if the provided value is not a member of
   * the {@link EnumeratedLiterals} instance and the 'strict' option is not 'false'.
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
   * Returns the provided value typed as a member of the {@link EnumeratedLiterals} instance,
   * {@link core.LiteralsMember<V>}, if the value is indeed a member of the
   * {@link EnumeratedLiterals} instance.
   *
   * Otherwise, the method will throw an {@link errors.InvalidLiteralValueError}.
   *
   * @see ParseOptions
   * @see ParseReturn
   *
   * @param {unknown} v
   *   The value that should be parsed.
   *
   * @param {ParseOptions} options
   *   Options that define the behavior of the method:
   *
   * @throws An {@link errors.InvalidLiteralValueError} 'strict' and either the provided value is
   * not a member of the {@link EnumeratedLiterals} instance or any of the values in the provided
   * array are not members of the {@link EnumeratedLiterals} instance.
   *
   * @returns {ParseReturn<L, O>} Either the provided value typed as member of the
   * {@link EnumeratedLiterals} instance, or the values in the provided array that are members of
   * the {@link EnumeratedLiterals} instance.
   */
  parse<O extends ParseOptions>(v: ParseArg<O>, options: O): ParseReturn<L, O>;
  /**
   * A type assertion that throws an {@link errors.InvalidLiteralValueError} if the provided value
   * is a member of the {@link EnumeratedLiterals} instance.
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
   * A type assertion that throws an {@link errors.InvalidLiteralValuesError} if any of the values
   * in the provided array are not members of the {@link EnumeratedLiterals} instance.
   *
   * @param {unknown[]} v
   *   The values that the assertion should be made with.
   *
   * @param {string} errorMessage
   *   An optional error message that should be included in the message of the
   *   {@link errors.InvalidLiteralValuesError} in the case that the provided value 'v' fails the
   *   type assertion.
   *
   * @throws An {@link errors.InvalidLiteralValuesError} if the provided value 'v' is not in the set
   * of constant string literals on the {@link EnumeratedLiterals} instance.
   */
  assertMultiple: EnumeratedLiteralsMultipleAssertion<L>;
  /**
   * A typeguard that returns whether or not the provided value is a member of the
   * {@link EnumeratedLiterals} instance.
   *
   * @param {unknown} v
   *   The applicable value that the method should return whether or not it is a member of the
   *   {@link EnumeratedLiterals} instance.
   *
   * @returns {boolean} Whether or not the provided value is in a member of the
   * {@link EnumeratedLiterals} instance.
   */
  contains(v: unknown): v is core.LiteralsMember<L>;
  /**
   * A typeguard that returns whether or not the all of the values in the provided array are members
   * of the {@link EnumeratedLiterals} instance.
   *
   * @param {unknown[]} v
   *   An array of applicable values that the method should determine whether or not they are
   *   members of the {@link EnumeratedLiterals} instance.
   *
   * @returns {boolean} Whether or not all of the values in the provided array are members of the
   * {@link EnumeratedLiterals} instance.
   */
  containsMultiple(v: unknown[]): v is core.LiteralsMember<L>[];
  /**
   * Returns a new {@link EnumeratedLiterals} instance that consists of just the members that are
   * provided to the method.
   */
  pick<
    T extends readonly core.LiteralsMembers<L>[number][],
    Ot extends options.EnumeratedLiteralsDynamicOptions<core.ExtractLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ): EnumeratedLiterals<
    core.ExtractLiterals<L, T>,
    options.OptionsWithNewSet<core.ExtractLiterals<L, T>, Ot, L, O>
  >;
  /**
   * Returns a new {@link EnumeratedLiterals} instance that consists of just the members on the
   * instance excluding those that are provided to the method.
   */
  omit<
    T extends readonly core.LiteralsMembers<L>[number][],
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
  throwInvalidValue(v: unknown, errorMessage?: string): never;
}

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
> = EnumeratedLiteralsAccessors<L, O> & IEnumeratedLiteralsBase<L, O>;
