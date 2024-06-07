import type * as core from "./core";

import { humanizeList } from "~/formatters";

export type EnumeratedLiteralsInvalidValueErrorMessage<L extends core.Literals> = (params: {
  expected: core.LiteralsMembers<L>;
  received: unknown[];
}) => string;

interface InvalidLiteralValueErrorConfig<L extends core.Literals> {
  readonly values: core.LiteralsMembers<L>;
  readonly message?: string | EnumeratedLiteralsInvalidValueErrorMessage<L>;
}

/* eslint-disable-next-line no-redeclare */
function toErrorMessage<L extends core.Literals>(
  value: unknown,
  { message: _message, values }: InvalidLiteralValueErrorConfig<L>,
): string {
  /* This should never happen - an error should have been thrown ahead of time inside of the
     'enumeratedLiterals' method. */
  if (values.length === 0) {
    throw new Error(
      "Internal Error: The values on the literals instance are empty, this should not " +
        "be allowed, and should have been checked before this point in the code!",
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error("Internal Error: The array of invalid values must be non-empty!");
    }
    const humanized = humanizeList(
      value.map(v => String(v)),
      { conjunction: "and", formatter: v => `'${v}'` },
    );
    if (_message !== undefined) {
      const message = _message as EnumeratedLiteralsInvalidValueErrorMessage<L> | string;
      if (value.length === 1) {
        return toErrorMessage(value[0], {
          values,
          message,
        });
      }
      return `The values ${humanized} are invalid: ${typeof message === "string" ? message : message({ expected: values, received: value })}`;
    } else {
      const humanizedValues = humanizeList([...values], {
        conjunction: "or",
        formatter: v => `'${v}'`,
      });
      if (value.length === 1) {
        return toErrorMessage(value[0], { values, message: _message });
      }
      return `The values ${humanized} are invalid, they must be one of ${humanizedValues}.`;
    }
  } else if (_message !== undefined) {
    const message = _message as EnumeratedLiteralsInvalidValueErrorMessage<L> | string;
    return `The value '${value}' is invalid: ${typeof message === "string" ? message : message({ expected: values, received: [value] })}`;
  }
  const humanizedValues = humanizeList([...values], {
    conjunction: "or",
    formatter: v => `'${v}'`,
  });
  return `The value '${value}' is invalid, it must be one of ${humanizedValues}.`;
}

export class InvalidLiteralValueError<L extends core.Literals> extends Error {
  public readonly value: unknown;

  constructor(value: unknown, { values, message }: InvalidLiteralValueErrorConfig<L>) {
    super(toErrorMessage(value, { values, message }));
    this.name = "InvalidLiteralValueError";
    this.value = value;
  }
}
