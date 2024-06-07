import { type HumanizeListOptions, humanizeList } from "~/formatters";

import { parseAccessors } from "./accessors";
import * as core from "./core";
import { InvalidLiteralValueError } from "./errors";
import {
  type GetModelSafeRT,
  type GetModelSafeOptions,
  type ParseOptions,
  type ParseReturn,
  type ParseArg,
  type IEnumeratedLiteralsBase,
  type EnumeratedLiterals,
} from "./exposed";
import * as options from "./options";

export { InvalidLiteralValueError } from "./errors";
export { type EnumeratedLiteralsMember, type EnumeratedLiteralsModel } from "./exposed";

export class EnumeratedLiteralsBase<
  L extends core.Literals,
  O extends options.EnumeratedLiteralsOptions<L>,
> implements IEnumeratedLiteralsBase<L, O>
{
  private readonly _literals: L;
  private readonly _options: O;

  constructor(literals: L, options: O) {
    if ([...literals].length === 0) {
      throw new Error(
        "The 'enumeratedLiterals' method must be called with a non-empty array as its first " +
          "argument.",
      );
    }

    const areModels = [...literals].map(l => core.isLiteralModel(l));
    if (areModels.some(Boolean) && !areModels.every(Boolean)) {
      throw new Error(
        "All literals must be of the same form, either as a 'model' or a string 'value'.  " +
          "They cannot be a mixture of 'model'(s) and string 'value'(s).",
      );
    }
    this._literals = literals;
    this._options = options;
  }

  private get providedForm() {
    return [...this._literals].map(l => core.isLiteralModel(l)).every(Boolean)
      ? "models"
      : "values";
  }

  public get members() {
    return [...this._literals].map(l =>
      core.isLiteralModel(l) ? l.value : l,
    ) as core.LiteralsMembers<L>;
  }

  public get models() {
    return [...this._literals].map(l =>
      core.isLiteralModel(l) ? l : { value: l },
    ) as core.LiteralsModels<L>;
  }

  public getModelSafe<Og extends GetModelSafeOptions>(v: unknown, opts: Og): GetModelSafeRT<L, Og> {
    const contains = this.contains(v);
    if (contains === false) {
      if (opts?.strict === true) {
        this.throwInvalidValue(v);
      }
      return null as GetModelSafeRT<L, Og>;
    }
    return this.getModel(v as core.LiteralsMember<L>);
  }

  public getModel<V extends core.LiteralsMember<L>>(v: V): core.LiteralsModel<L, V> {
    this.assert(v);
    const found = this.models.find(l => l.value === v);
    if (!found) {
      return this.throwInvalidValue(v);
    }
    return found as core.LiteralsModel<L, V>;
  }

  public getAttributes<N extends core.LiteralsModelAttributeName<L>>(
    attribute: N,
  ): core.LiteralsAttributeValues<L, N> {
    const attrs: core.LiteralsAttributeValues<L, N>[number][] = [];
    for (const m of this.models) {
      attrs.push(m[attribute]);
    }
    return attrs as core.LiteralsAttributeValues<L, N>;
  }

  public getAttribute<
    V extends core.LiteralsMember<L>,
    N extends core.LiteralsModelAttributeName<L>,
  >(value: V, attribute: N): core.LiteralsAttributeValue<L, V, N> {
    const attr = this.getModel(value)[attribute];
    return attr as core.LiteralsAttributeValue<L, V, N>;
  }

  private split(v: unknown[]) {
    let invalidPrimitives: unknown[] = [];
    let parsed: core.LiteralsMember<L>[] = [];
    for (const vi of v) {
      if (!this.contains(vi)) {
        invalidPrimitives = [...invalidPrimitives, vi];
      } else {
        parsed = [...parsed, vi];
      }
    }
    return [parsed, invalidPrimitives];
  }

  public parse<O extends ParseOptions>(v: ParseArg<O>, opts: O): ParseReturn<L, O> {
    if (opts.multi === true) {
      if (!Array.isArray(v)) {
        // This should be prevented by TypeScript - but we still need to ensure this is the case.
        throw new Error("The value provided must be an array when 'multi' is set to true.");
      }
      const [parsed, invalids] = this.split(v);
      if (invalids.length > 0 && opts.strict !== false) {
        return this.throwInvalidValue(invalids);
      }
      return parsed as ParseReturn<L, O>;
    }
    this.assert(v, opts?.errorMessage);
    return v as ParseReturn<L, O>;
  }

  public humanize(opts?: HumanizeListOptions<string>) {
    return humanizeList([...this.members], opts);
  }

  public throwInvalidValue(v: unknown, errorMessage?: string): never {
    throw new InvalidLiteralValueError(v, {
      message: errorMessage ?? this._options.invalidValueErrorMessage,
      values: this.members,
    });
  }

  public contains(v: unknown): v is core.LiteralsMember<L> {
    return typeof v === "string" && this.members.includes(v);
  }

  public containsMultiple(v: unknown[]): v is core.LiteralsMember<L>[] {
    if (v.length === 0) {
      throw new Error("This type-check can only be performed with a non-empty array of values.");
    }
    return v.every(vi => this.contains(vi));
  }

  public assert(v: unknown, errorMessage?: string) {
    if (!this.contains(v)) {
      this.throwInvalidValue(v, errorMessage);
    }
  }

  public assertMultiple(v: unknown[], errorMessage?: string) {
    const [_, invalids] = this.split(v);
    if (invalids.length > 0) {
      return this.throwInvalidValue(invalids, errorMessage);
    }
  }

  public pick<
    T extends readonly core.LiteralsMembers<L>[number][],
    Ot extends options.EnumeratedLiteralsDynamicOptions<core.ExtractLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ): EnumeratedLiterals<
    core.ExtractLiterals<L, T>,
    options.OptionsWithNewSet<core.ExtractLiterals<L, T>, Ot, L, O>
  > {
    const invalidValues = [...vs].filter(v => !this.contains(v));
    // This should be prevented by TS but we want to check just in case.
    if (invalidValues.length > 0) {
      throw new Error(
        `The values ${humanizeList(invalidValues)} are not valid members of this instance.`,
      );
    }
    const newOptions = {
      ...options.pickStaticOptions<L, O>(this._options),
      ...opts,
    } as options.OptionsWithNewSet<core.ExtractLiterals<L, T>, Ot, L, O>;

    if (this.providedForm === "models") {
      const extracted = this.models.filter(m => vs.includes(m.value)) as core.ExtractLiterals<L, T>;
      return enumeratedLiterals(extracted, newOptions);
    }
    return enumeratedLiterals(
      this.members.filter(v => vs.includes(v)) as core.ExtractLiterals<L, T>,
      newOptions,
    );
  }

  static create<L extends core.Literals, O extends options.EnumeratedLiteralsOptions<L>>(
    literals: L,
    options: O,
  ) {
    return new EnumeratedLiteralsBase(literals, options);
  }

  public omit<
    T extends readonly core.LiteralsMembers<L>[number][],
    Ot extends options.EnumeratedLiteralsDynamicOptions<core.ExcludeLiterals<L, T>>,
  >(
    vs: T,
    opts: Ot,
  ): EnumeratedLiterals<
    core.ExcludeLiterals<L, T>,
    options.OptionsWithNewSet<core.ExcludeLiterals<L, T>, Ot, L, O>
  > {
    const invalidValues = [...vs].filter(v => !this.contains(v));
    // This should be prevented by TS but we want to check just in case.
    if (invalidValues.length > 0) {
      throw new Error(
        `The values ${humanizeList(invalidValues)} are not valid members of this instance.`,
      );
    }
    const newOptions = {
      ...options.pickStaticOptions<L, O>(this._options),
      ...opts,
    } as options.OptionsWithNewSet<core.ExcludeLiterals<L, T>, Ot, L, O>;

    if (this.providedForm === "models") {
      const excluded = this.models.filter(m => !vs.includes(m.value)) as core.ExcludeLiterals<L, T>;
      return enumeratedLiterals(excluded, newOptions);
    }
    return enumeratedLiterals(
      this.members.filter(v => !vs.includes(v)) as core.ExcludeLiterals<L, T>,
      newOptions,
    );
  }
}

export const enumeratedLiterals = <
  L extends core.Literals,
  O extends options.EnumeratedLiteralsOptions<L>,
>(
  literals: L,
  o: O,
): EnumeratedLiterals<L, O> => {
  const base = new EnumeratedLiteralsBase(literals, o);
  const accessors = parseAccessors(literals, o);

  for (const k in accessors) {
    Object.assign(base, { [k]: accessors[k] });
  }
  return base as EnumeratedLiterals<L, O>;
};
