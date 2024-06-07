# Enumerated Literals

[![codecov](https://codecov.io/gh/nickmflorin/enumerated-literals/graph/badge.svg?token=GRCS92W4N6)](https://codecov.io/gh/nickmflorin/enumerated-literals)

The `enumerated-literals` package is a _zero-dependency_ package that provides a strongly-typed,
type-safe and convenient pattern for defining, organizing and managing constant string values in an
application.

```bash
$ npm install enumerated-literals
```

## Basics

At it's core, the `enumerated-literals` package provides a method, `enumeratedLiterals`, that can be
used to define a set of constant string literals in an `enum`-like fashion:

```ts
enumeratedLiterals<L extends Literals, O extends EnumeratedLiteralsOptions<L>>(literals: L, options: O): EnumeratedLiterals<L, O>
```

The first argument to the `enumeratedLiterals` method, `L` (or `Literals`), should be a `const`
(`readonly`) array of `string` values (`string[]`) or `object` values ([models][model]), each of
which contains a `value` key (`{ value: string }`[]).

The second argument provided to the `enumeratedLiterals` method, `O` (or
[`EnumeratedLiteralsOptions<L>`][EnumeratedLiteralsOptions]), should be an `object` type that
contains the options for the instance (see [Configuration Options][options]).

###### Example

```ts
import { enumeratedLiterals, type EnumeratedLiteralMember } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralMember<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

Fruits.APPLE; // Typed as "apple"
Fruits.BANANA; // Typed as "banana"

const doSomethingWithFruit = (fruit: Fruit): void;
doSomethingWithFruit("apple");
```

### Why Not `enum`(s)?

The primary motivation for the `enumerated-literals` package was the fact that constant string
literals are not assignable to their equivalent `enum` members:

```ts
enum Fruits {
  APPLE = "apple",
  BANANA = "banana",
  BLUEBERRY = "blueberry",
  ORANGE = "orange",
}

function getFruitColor(fruit: Fruits): string {
  ...
}

// InvalidLiteralValueError: Argument of type '"apple"' is not assignable to parameter of type 'Fruits'
const appleColor = getFruitColor("apple");
```

This means that whenever the `getFruitColor` function is used throughout an application or codebase,
it requires also importing `Fruits`. While this might seem like a small inconvenience, its
inflexibility can be a pain point in larger applications with a significant number of constants
defined in `enum` fashion.

Additionally, the [EnumeratedLiterals Instance] offers built-in type-checking methods and strongly typed
properties, which provide a more convenient and organized way of making assertions and type-checking
values related to the constant string literals the instance is associated with (see [Built-In Type Checking](#built-in-type-checking)).

## Terminology

The following terms will be referenced throughout this documentation:

#### The `EnumeratedLiterals` Instance

The `EnumeratedLiterals` object that is created and returned by the `enumeratedLiterals` method
(e.g. `Fruits`):

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
```

#### The `EnumeratedLiterals` Members

The constant string literal values that the [`EnumeratedLiterals`][instance] instance contains (e.g.
`"apple"`, `"banana"`, `"blueberry"`, `"orange"`):

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
Fruits.members; // readonly ["apple", "banana", "blueberry", "orange"]
```

The members of the [`EnumeratedLiterals`][instance] instance will always be a `readonly` array of
`string`(s), even when the [`EnumeratedLiterals`][instance] instance is created with a series of
[models][model]:

```ts
const Fruits = enumeratedLiterals(
  [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "orange", label: "Orange" },
  ] as const,
  {},
);

Fruits.members; // readonly ["apple", "banana", "blueberry", "orange"]
```

The type of the [members][member] on an [`EnumeratedLiterals`][instance] instance can be obtained
via the `EnumeratedLiteralMember` generic type:

```ts
// "apple" | "banana" | "blueberry" | "orange"
type Fruit = EnumeratedLiteralMember<typeof Fruits>;
```

#### The `EnumeratedLiterals` Models

The `object`(s) associated with each member on the [`EnumeratedLiterals`][instance] instance. Each
[model][model] can contain other constants, functions or definitions that should be strongly typed
and associated with each [member][member] of the [`EnumeratedLiterals`][instance] instance:

```ts
const Fruits = enumeratedLiterals(
  [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "orange", label: "Orange" },
  ] as const,
  {},
);

// [ { value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }, ... ]
Fruits.models;
```

If the [`EnumeratedLiterals`][instance] instance is created with a `readonly` array of `string`(s),
the [models][model] will simply be an array of `object`(s) with a `value` key:

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
// [ { value: "apple" }, { value: "banana" }, ... ]
Fruits.models;
```

The type of the [models][model] on an [`EnumeratedLiterals`][instance] instance can be obtained via
the `EnumeratedLiteralsModel` generic type:

```ts
// { value: "apple", label: "Apple" } | { value: "banana", label: "Banana" } | ...
type FruitModel = EnumeratedLiteralsModel<typeof Fruits>;
```

#### The `EnumeratedLiterals` Accessors

The properties of the [`EnumeratedLiterals`][instance] instance that are used to access the
[members][member] on the [`EnumeratedLiterals`][instance] instance (e.g. `APPLE` or `BANANA`).

```ts
Fruits.APPLE; // "apple"
const b: "banana" = Fruits.BANANA;
```

The [accessors][accessor] on an [`EnumeratedLiterals`][instance] instance are automatically
generated based on the corresponding [members][member] of the instance. The manner in which the
[accessors][accessor] are generated can be customized

##### Custom Accessors

The manner in which the [accessors][accessor] are generated can be customized by providing specific
[Configuration Options](#configuration-options) to the `enumeratedLiterals` method or by explicitly
defining the [accessors][accessor] for each [member][member] on the [`EnumeratedLiterals`][instance]
instance:

```ts
const Fruits = enumeratedLiterals(
  [
    { value: "apple", accessor: "Apple" },
    { value: "banana", accessor: "Banana" },
    { value: "blueberry", accessor: "Blueberry" },
    { value: "orange", accessor: "Orange" },
  ] as const,
  {},
);

Fruits.Apple; // Typed as "apple"
Fruits.members; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

## Usage

The following describes how the `enumerated-literals` package can be used and the various features
it offers.

### Basic Usage

In its most basic form, an [`EnumeratedLiterals`][instance] instance can be created as follows:

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralMember<typeof Fruits>;
```

The constant string literals, `"apple"`, `"banana"`, `"blueberry"`, and `"orange"` (or
[members][member] of the [`EnumeratedLiterals`][instance] instance) can be accessed as properties of
the `Fruits` object via their associated [accessors][accessor]:

```ts
Fruits.APPLE; // Typed as "apple"
```

The [members][member] of the [`EnumeratedLiterals`][instance] instance can be accessed as a
`readonly` array as follows:

```ts
Fruits.members; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

#### Built-In Type Checking

The [`EnumeratedLiterals`][instance] instance is equipped with the following methods that are useful
for type checking:

##### Assertion

The `assert` method will throw an `InvalidLiteralValueError` if the value that it is provided is not
a [member][member] of the [`EnumeratedLiterals`][instance] instance:

```ts
Fruits.assert("cucumber"); // throws an InvalidLiteralValueError
```

###### Handling Multiple Values

The [`EnumeratedLiterals`][instance] instance is also equipped with an `assertMultiple` method that
will throw an `InvalidLiteralValueError` if _any_ of the values in the provided array are not
[members][member] of the [`EnumeratedLiterals`][instance] instance:

```ts
Fruits.assertMultiple(["cucumber", "pear"]); // throws an InvalidLiteralValueError
```

##### Type Guard

The [`EnumeratedLiterals`][instance] instance is equipped with a typeguard, `contains`, that returns
whether or not the provided value is a member of the [`EnumeratedLiterals`][instance] instance:

```ts
function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  if (Fruits.contains(value)) {
    // 'value' is of type 'Fruit'
    processFruit(value);
  }
}
```

###### Handling Multiple Values

The [`EnumeratedLiterals`][instance] instance is also equipped with a typeguard, `containsMultiple`,
that can be used to determine whether or not _all_ of the provided values are [members][members] of
the [`EnumeratedLiterals`][instance] instance:

```ts
function processFruits(fruit: Fruit[]) { ... }

function process(values: string[]) {
  if (Fruits.containsMultiple(values)) {
    // 'value' is of type 'Fruit[]'
    processFruits(values);
  }
}
```

##### Parser

The `parse` method will return the provided value, typed as a [member] of the
[`EnumeratedLiterals`][instance] instance, if the provided value is in fact a [member] of the
[`EnumeratedLiterals`][instance] instance. Otherwise, it will throw an `InvalidLiteralsValueError`:

```ts
function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  // The 'parse' method will throw if the 'value' is not of type 'Fruit'.
  const f = Fruits.parse(value, {});
  processFruit(f);
}
```

If it is desired that the `parse` method should not throw an `InvalidLiteralsValueError` when the
value is not a [member] of the [`EnumeratedLiterals`][instance] instance, but to instead return
`null`, this can be accomplished by providing the `strict` option to the method:

```ts
function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  // The 'parse' method will return `null` if the 'value' is not of type 'Fruit'.
  const f = Fruits.parse(value, { strict: false });
  if (f) {
    processFruit(f);
  }
}
```

###### Handling Multiple Values

The `parse` method can also be used to parse multiple values at once by specifying the `multi`
option. In this case, it will throw an `InvalidLiteralsValueError` if _any_ of the provided values
are not [members][member] of the [`EnumeratedLiterals`][instance] instance. Otherwise, it will
return the values typed as [members][member] of the [`EnumeratedLiterals`][instance] instance:

```ts
function processFruits(fruit: Fruit[]) { ... }

function process(values: string[]) {
  // The 'parse' method will throw if any of the values in 'value' are not of type 'Fruit'.
  const f = Fruits.parse(value, { multi: true });
  processFruits(f);
}
```

If it is desired that the `parse` method should not throw an `InvalidLiteralsValueError` when any
value is not a [member] of the [`EnumeratedLiterals`][instance] instance, but to instead return just
the values that are [members][member] of the [`EnumeratedLiterals`][instance], this can be
accomplished by providing the `strict` option to the method:

```ts
function processFruits(fruit: Fruit[]) { ... }

function process(value: unknown[]) {
  // The 'parse' method will return a filtered array of the values that are of type `Fruit`
  const f = Fruits.parse(value, { strict: false, multi: true });
  processFruits(f)
}
```

### Advanced Usage

#### `EnumeratedLiteralsModel`

An [`EnumeratedLiterals`][instance] instance can be created such that its [members][member] are each
associated with other values, constants, and/or functions. These other values, constants, and/or
functions will be strongly typed and associated to each [member] of the
[`EnumeratedLiterals`][instance] instance:

```ts
const Fruits = enumeratedLiterals(
  [
    { value: "apple", description: "A red fruit", color: "red", label: "Apple" },
    { value: "banana", description: "A yellow fruit", color: "yellow", label: "Banana" },
    { value: "blueberry", description: "A blue fruit", color: "blue", label: "Blueberry" },
    { value: "orange", description: "An orange fruit", color: "orange", label: "Orange" },
  ] as const,
  {},
);

Fruits.members; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
/* Typed as readonly [
  { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; },
  { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; },
  { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; },
  { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; },
] */
Fruits.models;
```

The `models` attribute will return each [member] of the [`EnumeratedLiterals`][instance] instance in
an `object` that also contains the associated constants, values and/or functions it was instantiated
with. The [models][model] that are returned will be ordered in the same manner as the order of the
values that the [`EnumeratedLiterals`][instance] instance was created with.

##### The `EnumeratedLiteralsModel` Type

The `EnumeratedLiteralsModel` type can be used to type the [models][model] that are contained on an
[`EnumeratedLiterals`][instance] instance.

One common use case is to define a type for both the [member] and [model] of an
[`EnumeratedLiterals`][instance] instance separately, and allow the [model] to be extracted based on
the [member] type:

```ts
// "apple" | "banana" | "blueberry" | "orange"
type FruitValue = EnumeratedLiteralsMember<typeof Fruits>;

type Fruit<I extends FruitValue = FruitValue> = Extract<
  EnumeratedLiteralsModel<typeof Fruits>,
  { value: I }
>;

/*
 | { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
 | { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; }
 | { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; }
 | { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; }
*/
type AnyFruit = Fruit;

// { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
type Apple = Fruit<"apple">;
```

An [`EnumeratedLiterals`][instance] instance is equipped with the following methods that can be used
to interact with the [models][model] on an [`EnumeratedLiterals`][instance] instance:

##### Model Getters

The [`EnumeratedLiterals`][instance] instance is equipped with a method, `getModel`, that can be
used to retrieve the [model] associated with a specific [member] on the
[`EnumeratedLiterals`][instance] instance. The return type will be strongly typed, such that the
properties associated with the provided [member] will be their constant representations:

```ts
// { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
Fruits.getModel("apple");
```

The arguments to the methods are all strongly typed, such that the following code will not compile:

```ts
Fruits.getModel("cucumber");
```

Similarly, [`EnumeratedLiterals`][instance] instance is equipped with a `getModelSafe` method, that
allows the behavior of the method in the case that the provided value is not a [member] of the
[`EnumeratedLiterals`][instance] instance to be controlled.

The `getModelSafe` method accepts a `strict` option, that determines whether or not the method
should throw an `InvalidLiteralValueError` or simply return `null` in the case that the provided
value is not a [member] of the [`EnumeratedLiterals`][instance]

```ts
Fruits.getModelSafe("cucumber", { strict: true }); // Throws Error, but compiles
```

```ts
Fruits.getModelSafe("cucumber", { strict: false }); // Compiles, returns the model or null
```

##### Attribute Getters

The [`EnumeratedLiterals`][instance] instance is equipped with methods, `getAttribute` and
`getAttributes`, that can be used to access the attributes of a single [model][model] or all
[models][model] on the [`EnumeratedLiterals`][instance] instance, respectively:

```ts
Fruits.getAttribute("apple", "description"); // "A red fruit"
```

The following will not compile:

```ts
Fruits.getAttribute("cucumber", "description");
```

The `getAttributes` method can be used to return the associated attribute of all [models][model] on
the [`EnumeratedLiterals`][instance] instance, in the same order as the values or `object`(s) that
were used to instantiate the instance:

```ts
// Typed as readonly ["A red fruit", "A yellow fruit", "A blue fruit", "An orange fruit"]
Fruits.getAttributes("description");
```

#### Configuration Options

Additional, optional options can be provided to the `enumeratedLiterals` method in order to control
error messages and/or the formatting of [accessors][accessor] on the
[`EnumeratedLiterals`][instance] instance.

The optional options that can be provided to the `enumeratedLiterals` method are as follows:

1. **`invalidValueErrorMessage`**:

   A function that can be used to format the error message for the `InvalidLiteralValueError` that
   is thrown when an invalid value is encountered by the [`EnumeratedLiterals`][instance] instance.

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {
     invalidValueErrorMessage: ({ expected, received }) =>
       `The value '${received[0]}' is not in the set of fruits: ${expected.join(", ")}!`,
   });
   ```

2. **`accessorSpaceReplacement`** (`AccessorSpaceReplacement` or `"_" | "-" | "" | null`)

   The `string` value that will be used to replace single white-space characters when the
   [accessors][accessor] are either auto-generated based on the [members][member] of the
   [`EnumeratedLiterals`][instance] or when white-space characters are encountered in the `accessor`
   property of a given [model] on the [`EnumeratedLiterals`][instance].

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["red apple", "yellow banana"] as const, {
     accessorSpaceReplacement: "-",
   });

   Fruits["RED-APPLE"]; // "red apple"
   Fruits["YELLOW-BANANA"]; // "yellow banana"
   ```

   It is important to note the following:

   1. Multiple white-space characters encountered in the middle of a value or [accessor] will be
      replaced with single white-space characters:

      ###### Example

      ```ts
      const Fruits = enumeratedLiterals(["red    apple"] as const, {
        accessorSpaceReplacement: "_",
      });

      Fruits.RED_APPLE; // "red    apple"
      ```

   2. A `null` value means that white-space characters will remain and will not be replaced.
      However, if multiple consecutive white-space characters are encountered, they will still be
      replaced with a single white-space character.

   Default: `"_"`

3. **`accessorHyphenReplacement`** (`AccessorHyphenReplacement` or `"_" | "" | null`)

   The `string` value that will be used to replace hyphens (`"-"`) when the [accessors][accessor]
   are either auto-generated based on [members][member] [`EnumeratedLiterals`][instance] instance or
   when hyphen characters are encountered in the `accessor` property of a given [model] on the
   [`EnumeratedLiterals`][instance].

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["red-apple"] as const, {
     accessorHyphenReplacement: "_",
   });

   Fruits.RED_APPLE; // "red-apple"
   ```

   Note that a `null` value means that the hyphens will not be replaced but will be left in-tact.

   Default: Either `"_"` or `null`, depending on whether or not the values provided to the
   `enumeratedLiterals` method are provided as an array of `object`(s) with their own `accessor`
   properties, or a `readonly` array of strings.

4. **`accessorCase`** (`"lower" | "upper" | null`)

   Whether the [accessors][accessor] should be formatted as lowercase strings, uppercase strings, or
   neither (`null`), either auto-generated based on [members][member]
   [`EnumeratedLiterals`][instance] instance or when the `accessor` property of a given [model] on
   the [`EnumeratedLiterals`][instance] is explicitly defined.

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["RED-apple"] as const, {
     accessorCase: "lower",
   });

   Fruits.red_apple; // "RED-apple"
   ```

   Default: Either `"upper"` or `null`, depending on whether or not the values provided to the
   `enumeratedLiterals` method are provided as an array of `object`(s) with their own `accessor`
   properties, or a `readonly` array of strings.

## API

The following section describes the methods and properties on an [`EnumeratedLiterals`][instance]
instance:

#### Instance Properties

##### `values` (_property_)

The constant string literal values on the [`EnumeratedLiterals`][instance] instance.

```ts
LiteralsMembers<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
Fruits.members; // readonly ["apple", "banana", "blueberry", "orange"]

// or

const Fruits = enumeratedLiterals(
  [
    { value: "apple", accessor: "Apple" },
    { value: "banana", accessor: "Banana" },
    { value: "blueberry", accessor: "Blueberry" },
    { value: "orange", accessor: "Orange" },
  ] as const,
  {},
);

Fruits.members; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

##### `models` (_property_)

The `object`(s) associated with each value on the [`EnumeratedLiterals`][instance] instance
instance.

```ts
LiteralsModels<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
// readonly [{ value: "apple" }, { value: "banana" }, { value: "blueberry" }, { value: "orange" }]
Fruits.models;

// or

const Fruits = enumeratedLiterals(
  [
    { value: "apple", description: "A red fruit", color: "red", label: "Apple" },
    { value: "banana", description: "A yellow fruit", color: "yellow", label: "Banana" },
    { value: "blueberry", description: "A blue fruit", color: "blue", label: "Blueberry" },
    { value: "orange", description: "An orange fruit", color: "orange", label: "Orange" },
  ] as const,
  {},
);

/* readonly [
  { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; },
  { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; },
  { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; },
  { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; },
] */
Fruits.models;
```

#### Instance Methods

##### `assert` (_method_)

A type assertion that throws an `InvalidLiteralValueError` if the provided value is not in the set
of constant string literal values on the [EnumeratedLiterals instance][instance].

```ts
<L extends Literals>(value: unknown, errorMessage?: string): asserts value is LiteralsMember<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralMember<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  Fruits.assert(value, "The value is not a fruit!");
  processFruit(f);
}
```

##### `parse` (_method_)

Returns the provided value, typed as a value in the set of constant string literal values on the
[`EnumeratedLiterals`][instance] instance, if the value is indeed in that set. Otherwise, throws an
`InvalidLiteralValueError`.

```ts
(v: unknown, errorMessage?: string): LiteralsMember<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralMember<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  const f = Fruits.parse(value); // Typed as 'Fruit'
  processFruit(f);
}
```

##### `contains` (_method_)

A typeguard that returns whether or not the provided value is in the set of constant string literal
values on the [`EnumeratedLiterals`][instance] instance.

```ts
(v: unknown): v is LiteralsMember<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralMember<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  if (Fruits.contains(value)) {
    // 'value' is of type 'Fruit'
    processFruit(value);
  }
}
```

##### `getModel` (_method_)

Returns the model associated with a specific constant string literal value on the
[`EnumeratedLiterals`][instance] instance. Throws an `InvalidLiteralValueError` if the provided
value is not a specific constant string literal on the [`EnumeratedLiterals`][instance] instance -
however, the method is typed such that the compiler will fail if you attempt to provide an invalid
value.

```ts
<V extends LiteralsMember<L>>(v: V): LiteralsModel<L, V>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});

// { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
Fruits.getModel("apple");
```

##### `getModelSafe` (_method_)

Returns the model associated with a specific constant string literal value on the
[`EnumeratedLiterals`][instance] instance if that provided value is in fact on the
[EnumeratedLiterals instance][instance].

```ts
<O extends GetModelSafeOptions>(value: unknown, opts: O): GetModelSafeRT<L, O>
```

In other words, this method does not assume that the provided value is in the set of constant string
literals on the [`EnumeratedLiterals`][instance] instance, but instead will either return `null` (if
`options.strict` is `false` or not provided) or throw an `InvalidLiteralValueError` (if
`options.strict` is `true`) if the provided value is not in the set of constant string literals on
the [EnumeratedLiterals instance][instance].

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});

const v: unknown = "cucumber";

/*
 | { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
 | { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; }
 | { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; }
 | { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; }
*/
Fruits.getModelSafe(v, { strict: true });

/*
 | { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
 | { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; }
 | { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; }
 | { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; }
 | null
*/
Fruits.getModelSafe(v, { strict: false });

// Same as above
Fruits.getModelSafe(v, {});
```

##### `getAttribute` (_method_)

Returns the value of an attribute, `N`, on the model associated with a specific value on the
[`EnumeratedLiterals`][instance] instance.

```ts
<V extends LiteralsMember<L>, N extends LiteralsModelAttributeName<L>>(value: V, attribute: N): LiteralsAttributeValue<L, V, N>
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(
  [
    { value: "apple", description: "A red fruit", color: "red", label: "Apple" },
    { value: "banana", description: "A yellow fruit", color: "yellow", label: "Banana" },
    { value: "blueberry", description: "A blue fruit", color: "blue", label: "Blueberry" },
    { value: "orange", description: "An orange fruit", color: "orange", label: "Orange" },
  ] as const,
  {},
);

Fruits.getAttribute("apple", "description"); // Typed as "A red fruit"
```

##### `getAttributes` (_method_)

Returns the values for a given attribute, `N`, on each model that is associated with the
[`EnumeratedLiterals`][instance] instance.

```ts
<N extends LiteralsModelAttributeName<L>>(attribute: N): LiteralsAttributeValues<L, N>
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(
  [
    { value: "apple", description: "A red fruit", color: "red", label: "Apple" },
    { value: "banana", description: "A yellow fruit", color: "yellow", label: "Banana" },
    { value: "blueberry", description: "A blue fruit", color: "blue", label: "Blueberry" },
    { value: "orange", description: "An orange fruit", color: "orange", label: "Orange" },
  ] as const,
  {},
);

Fruits.getAttributes("label"); // readonly ["Apple", "Banana", "Blueberry", "Orange"]
```

##### `pick` (_method_)

Returns a new [`EnumeratedLiterals`][instance] instance that consists of just the values that are
provided to the method.

```ts
<T extends readonly LiteralsMembers<L>[number][], Ot extends EnumeratedLiteralsDynamicOptions<ExtractLiterals<L, T>>>(vs: T, opts?: Ot): EnumeratedLiterals<
  ExtractLiterals<L, T>,
  OptionsWithNewSet<ExtractLiterals<L, T>, Ot, L, O>
>
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
const RoundFruits = Fruits.pick(["apple", "orange"] as const);

RoundFruits.members; // readonly ["apple", "orange"]
```

##### `omit` (_method_)

Returns a new [`EnumeratedLiterals`][instance] instance that consists of just the values on the
instance exluding those that are provided to the method.

```ts
<T extends readonly LiteralsMembers<L>[number][], Ot extends EnumeratedLiteralsDynamicOptions<ExcludeLiterals<L, T>>>(vs: T, opts?: Ot): EnumeratedLiterals<
  ExcludeLiterals<L, T>,
  OptionsWithNewSet<ExcludeLiterals<L, T>, Ot, L, O>
>
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
const RoundFruits = Fruits.omit(["banana", "blueberry"] as const);

RoundFruits.members; // readonly ["apple", "orange"]
```

##### `humanize` (_method_)

Returns a human readable string representing the constant string literal values associated with the
[`EnumeratedLiterals`][instance] instance.

```ts
(options?: HumanizeListOptions<string>): string;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});

// "apple, banana, blueberry, or orange"
Fruits.humanize({ conjunction: "or" });
```

##### `throwInvalidValue` (_method_)

Throws an `InvalidLiteralValueError` with a message that is generated based on optionally provided
options to the [EnumeratedLiterals Instance] on instantiation and/or the constant string literal values
that are associated with the instance.

```ts
(v: unknown, errorMessage?: string): never;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});

// throws InvalidLiteralValueError
// "The value 'cucumber' is invalid, it must be one of 'apple', 'banana', 'blueberry' or 'orange'."
Fruits.throwInvalidValue("cucumber");
```

[instance]: #the-enumeratedliterals-instance
[member]: #the-enumeratedliterals-members
[accessor]: #the-enumeratedliterals-accessors
[model]: #the-enumeratedliterals-models
[options]: #configuration-options
