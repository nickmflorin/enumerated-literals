import type { Literals, LiteralsValues } from "./core";

import { humanizeList } from "~/formatters";

import { type EnumeratedLiteralsInvalidValueErrorMessage } from "./options";

interface InvalidLiteralValueErrorConfig<L extends Literals> {
  readonly values: LiteralsValues<L>;
  readonly message?: string | EnumeratedLiteralsInvalidValueErrorMessage<L>;
}

const toErrorMessage = <L extends Literals>(
  value: unknown,
  { message, values }: InvalidLiteralValueErrorConfig<L>,
): string => {
  if (values.length === 0) {
    throw new Error(
      "Internal Error: The values on the literals instance are empty, this should not " +
        "be allowed, and should have been checked before this point in the code!",
    );
  }
  if (message !== undefined) {
    return typeof message === "string"
      ? `The value '${value}' is invalid: ${message}`
      : message(values, value);
  }
  const humanizedValues = humanizeList([...values], {
    conjunction: "or",
    formatter: v => `'${v}'`,
  });
  return `The value '${value}' is invalid, it must be one of ${humanizedValues}.`;
};

export class InvalidLiteralValueError<L extends Literals> extends Error {
  public readonly value: unknown;

  constructor(value: unknown, { values, message }: InvalidLiteralValueErrorConfig<L>) {
    super(toErrorMessage(value, { values, message }));
    this.name = "InvalidLiteralValueError";
    this.value = value;
  }
}
