import { humanizeList } from "~/formatters";

import { parseAccessors } from "./accessors";
import {
  type Literals,
  type LiteralsValues,
  type LiteralsValue,
  type ExcludeLiterals,
  type ExtractLiterals,
  isLiteralModel,
  type LiteralsModels,
  type LiteralsAttributeValues,
  type LiteralsAttributeValue,
  type LiteralsModelAttributeName,
} from "./core";
import {
  type EnumeratedLiterals,
  type LiteralsModel,
  type GetModelSafeRT,
  type GetModelSafeOptions,
} from "./exposed";
import {
  type EnumeratedLiteralsOptions,
  type EnumeratedLiteralsDynamicOptions,
  type OptionsWithNewSet,
  pickStaticOptions,
} from "./options";

export {
  type EnumeratedLiterals,
  type EnumeratedLiteralsType,
  type EnumeratedLiteralsModel,
} from "./exposed";

/**
 * A generic type that results in a type referred to internally as an "EnumeratedLiteralMap", which
 * is formed from the strings defined in the read-only array type defined by the generic type
 * parameter {@link V}.
 *
 * Generally, an {@link EnumeratedLiterals} is defined as an object that is used to represent the
 * discrete, literal {@link string} values that a given variable can exhibit, by providing both
 * properties to access the discrete values themselves and a property to access an {@link Array} of
 * all possible discrete values.
 *
 * This type should be used when defining discrete values that a variable can exhibit, as it defines
 * both accessors for those constants and an accessor for all possible options.
 *
 * @example
 * const Permissions = enumeratedLiterals(["admin", "dev", "user"] as const)
 * Permissions.ADMIN // "admin"
 * Permissions.__ALL__ // ["admin", "dev", "user"]
 *
 * @param {types.UniqueArray<L, O>} data
 *   A read-only array of values that the variable is allowed to exhibit.
 *
 * @returns {@link EnumeratedLiterals<L, O>}
 */
export const enumeratedLiterals = <L extends Literals, O extends EnumeratedLiteralsOptions<L>>(
  literals: L,
  options: O,
): EnumeratedLiterals<L, O> => {
  if ([...literals].length === 0) {
    throw new Error(
      "The 'enumeratedLiterals' method must be called with a non-empty array as its first " +
        "argument.",
    );
  }

  const areModels = [...literals].map(l => isLiteralModel(l));
  if (areModels.some(Boolean) && !areModels.every(Boolean)) {
    throw new Error(
      "All literals must be of the same form, either as a 'model' or a string 'value'.  " +
        "They cannot be a mixture of 'model'(s) and string 'value'(s).",
    );
  }

  const values = [...literals].map(l => (isLiteralModel(l) ? l.value : l)) as LiteralsValues<L>;
  const models = [...literals].map(l =>
    isLiteralModel(l) ? l : { value: l },
  ) as LiteralsModels<L>;

  return {
    ...parseAccessors(literals, options),
    __provided_form__: areModels.every(Boolean) ? "models" : "values",
    options,
    values,
    models,
    humanize(options) {
      return humanizeList([...this.values], options);
    },
    getAttributes<N extends LiteralsModelAttributeName<L>>(
      attribute: N,
    ): LiteralsAttributeValues<L, N> {
      const attrs: LiteralsAttributeValues<L, N>[number][] = [];
      for (const m of this.models) {
        attrs.push(m[attribute]);
      }
      return attrs as LiteralsAttributeValues<L, N>;
    },
    getAttribute<V extends LiteralsValue<L>, N extends LiteralsModelAttributeName<L>>(
      value: V,
      attribute: N,
    ): LiteralsAttributeValue<L, V, N> {
      const attr = this.getModel(value)[attribute];
      return attr as LiteralsAttributeValue<L, V, N>;
    },
    getModel<V extends LiteralsValue<L>>(
      this: EnumeratedLiterals<L, O>,
      v: V,
    ): LiteralsModel<L, V> {
      this.assert(v);
      const found = this.models.find(l => l.value === v);
      if (!found) {
        this.throwInvalidValue(v);
      }
      return found as LiteralsModel<L, V>;
    },
    getModelSafe<Og extends GetModelSafeOptions>(
      this: EnumeratedLiterals<L, O>,
      v: unknown,
      opts: Og,
    ): GetModelSafeRT<L, Og> {
      const contains = this.contains(v);
      if (contains === false) {
        if (opts?.strict === true) {
          this.throwInvalidValue(v);
        }
        return null as GetModelSafeRT<L, Og>;
      }
      return this.getModel(v as LiteralsValue<L>);
    },
    throwInvalidValue(this: EnumeratedLiterals<L, O>, v: unknown, errorMessage?: string): never {
      if (errorMessage === undefined && this.options.invalidValueErrorMessage !== undefined) {
        throw new Error(this.options.invalidValueErrorMessage(this.values, v));
      } else if (errorMessage) {
        throw new Error(errorMessage);
      } else if (this.values.length === 0) {
        throw new Error(
          "Internal Error: The values on the literals instance are empty, this should not " +
            "be allowed, and should have been checked before this point in the code!",
        );
      } else if (this.values.length === 1) {
        throw new Error(`The value ${v} is not valid, it must be ${this.values[0]}.`);
      }
      const humanizedValues = this.humanize({ conjunction: "or" });
      throw new Error(`The value ${v} is not valid, it must be one of ${humanizedValues}.`);
    },
    contains(this: EnumeratedLiterals<L, O>, v: unknown): v is LiteralsValue<L> {
      return typeof v === "string" && this.values.includes(v);
    },
    parse(this: EnumeratedLiterals<L, O>, v: unknown, errorMessage?: string): LiteralsValue<L> {
      this.assert(v, errorMessage);
      return v;
    },
    assert(this: EnumeratedLiterals<L, O>, v: unknown, errorMessage?: string) {
      if (!this.contains(v)) {
        this.throwInvalidValue(v, errorMessage);
      }
    },
    pick<
      T extends readonly LiteralsValues<L>[number][],
      Ot extends EnumeratedLiteralsDynamicOptions<ExtractLiterals<L, T>>,
    >(
      this: EnumeratedLiterals<L, O>,
      vs: T,
      opts: Ot,
    ): EnumeratedLiterals<
      ExtractLiterals<L, T>,
      OptionsWithNewSet<ExtractLiterals<L, T>, Ot, L, O>
    > {
      const invalidValues = [...vs].filter(v => !this.contains(v));
      // This should be prevented by TS but we want to check just in case.
      if (invalidValues.length > 0) {
        throw new Error(
          `The values ${humanizeList(invalidValues)} are not valid members of this instance.`,
        );
      }
      const newOptions = {
        ...pickStaticOptions<L, O>(this.options),
        ...opts,
      } as OptionsWithNewSet<ExtractLiterals<L, T>, Ot, L, O>;

      if (this.__provided_form__ === "models") {
        const extracted = this.models.filter(m => vs.includes(m.value)) as ExtractLiterals<L, T>;
        return enumeratedLiterals(extracted, newOptions);
      }
      return enumeratedLiterals(
        this.values.filter(v => vs.includes(v)) as ExtractLiterals<L, T>,
        newOptions,
      );
    },
    omit<
      T extends readonly LiteralsValues<L>[number][],
      Ot extends EnumeratedLiteralsDynamicOptions<ExcludeLiterals<L, T>>,
    >(
      this: EnumeratedLiterals<L, O>,
      vs: T,
      opts?: Ot,
    ): EnumeratedLiterals<
      ExcludeLiterals<L, T>,
      OptionsWithNewSet<ExcludeLiterals<L, T>, Ot, L, O>
    > {
      const invalidValues = [...vs].filter(v => !this.contains(v));
      // This should be prevented by TS but we want to check just in case.
      if (invalidValues.length > 0) {
        throw new Error(
          `The values ${humanizeList(invalidValues)} are not valid members of this instance.`,
        );
      }
      const newOptions = {
        ...pickStaticOptions<L, O>(this.options),
        ...opts,
      } as OptionsWithNewSet<ExcludeLiterals<L, T>, Ot, L, O>;

      if (this.__provided_form__ === "models") {
        const excluded = this.models.filter(m => !vs.includes(m.value)) as ExcludeLiterals<L, T>;
        return enumeratedLiterals(excluded, newOptions);
      }
      return enumeratedLiterals(
        this.values.filter(v => !vs.includes(v)) as ExcludeLiterals<L, T>,
        newOptions,
      );
    },
  };
};
