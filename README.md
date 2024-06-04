# Enumerated Literals

The `enumerated-literals` package is a _zero-dependency_ package that provides a strongly-typed,
type-safe and convenient pattern for defining, organizing and managing constant string values in an
application.

```bash
$ npm install enumerated-literals
```

## Basics

At it's core, the `enumerated-literals` package provides a method, `enumeratedLiterals`, that can be
used to define and group constant string literals in an `enum`-like fashion:

```ts
enumeratedLiterals<L extends Literals, O extends EnumeratedLiteralsOptions<L>>(literals: L, options: O): EnumeratedLiterals<L, O>
```

The first argument to the `enumeratedLiterals` method, `L` (or `Literals`), should be a `const`
(`readonly`) array of `string` values (`string[]`) or `object` values, each of which contains a
`value` key (`{ value: string }`[]). The second argument provided to the `enumeratedLiterals`
method, `O` (or `EnumeratedLiteralsOptions<L>`), should be an `object` type that contains the
options for the instance (see [Configuration Options](#configuration-options)).

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

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

Additionally, the `EnumeratedLiterals` instance offers built-in type-checking methods and strongly
typed properties, which provide a more convenient and organized way of making assertions and
type-checking values related to the constant string literals the instance is associated with (see
[Built-In Type Checking](#built-in-type-checking)).

## Terminology

The following terms will be referenced throughout this documentation:

1. **The `EnumeratedLiterals` Instance**:

   The `object` that is created and returned by the `enumeratedLiterals` method (e.g. `Fruits`).

   ```ts
   const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
   ```

2. **The `EnumeratedLiterals` Values**:

   The constant string literal values that the `EnumeratedLiterals` instance contains (e.g.
   `"apple"`, `"banana"`, `"blueberry"`, `"orange"`).

   ```ts
   Fruits.values; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
   ```

3. **The `EnumeratedLiterals` Models**:

   The `object`(s) associated with each `EnumeratedLiterals` value on the `EnumeratedLiterals`
   instance. Each object contains the relevant `EnumeratedLiterals` value, indexed by the `value`
   key, along with additional key-value pairs that are associated with each value when provided on
   instantiation of the instance: `"banana"`, `"blueberry"`, `"orange"`).

   ```ts
   // Typed as readonly [ { value: "apple" }, { value: "banana" }, { value: "blueberry" }, { value: "orange" }]
   Fruits.models;
   ```

4. **The `EnumeratedLiterals` Accessors**:

   The properties of the `EnumeratedLiterals` instance that are used to access the
   `EnumeratedLiterals` values on the instance (e.g. `APPLE` or `BANANA`).

   ```ts
   Fruits.APPLE; // Typed as "apple"
   ```

## Usage

The following describes how the `enumerated-literals` package can be used and the various features
it offers.

### Basic Usage

In its most basic form, an `EnumeratedLiterals` instance can be created as follows:

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>;
```

The constant string literals, `"apple"`, `"banana"`, `"blueberry"`, and `"orange"` can be accessed
as properties of the `Fruits` object:

```ts
Fruits.APPLE; // Typed as "apple"
```

The constant string literal values on the `EnumeratedLiterals` instance can be accessed as a
`readonly` array as follows:

```ts
Fruits.values; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

#### Custom Accessors

The attributes that are used to access the constant string literal values (termed `accessors`) can
be customized by defining an `accessor` property for each `value` corresponding to a constant string
literal in the set:

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
Fruits.values; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

#### Built-In Type Checking

An `EnumeratedLiterals` instance is equipped with the following methods that are useful for type
checking:

##### Assertion

The `assert` method will throw an error if the value that it is provided is not in the set of
constant string literals defined on the `EnumeratedLiterals` instance:

```ts
Fruits.assert("cucumber"); // throws an InvalidLiteralValueError
```

##### Type Guard

The `EnumeratedLiterals` instance is equipped with a typeguard that returns whether or not the
provided value is in the set of constant string literals defined on the `EnumeratedLiterals`
instance:

```ts
function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  if (Fruits.contains(value)) {
    // 'value' is of type 'Fruit'
    processFruit(value);
  }
}
```

##### Parser

The `parse` method will return the provided value, typed as a value of the `EnumeratedLiterals`
instance, if the value is in the set of constant string literals defined on the `EnumeratedLiterals`
instance. Otherwise, it will throw an error:

```ts
function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  const f = Fruits.parse(value);
  processFruit(f);
}
```

### Advanced Usage

#### `EnumeratedLiterals` Model

An `EnumeratedLiterals` instance can be instantiated such that the constant string literal values it
contains are associated with other values, constants and/or functions. These other values, constants
and/or functions will be tied to each value of the `EnumeratedLiterals` instance in a strongly typed
fashion:

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

Fruits.values; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
/* Typed as readonly [
  { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; },
  { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; },
  { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; },
  { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; },
] */
Fruits.models;
```

The `models` attribute will return the `value` of each constant string literal on the instance,
along with any other associated properties, in an array of `object`(s) that is in the same order as
the `values` that were used to instantiate the instance.

##### The `EnumeratedLiteralsModel` Type

The `EnumeratedLiteralsModel` type can be used to type the `models` that are contained on an
`EnumeratedLiterals` instance.

One common use case is to define a type for both the `value` and `model` of an `EnumeratedLiterals`
instance, separately, and allow the `model` to be extracted based on the `value`:

```ts
// "apple" | "banana" | "blueberry" | "orange"
type FruitValue = EnumeratedLiteralIdType<typeof Fruits>;

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

An `EnumeratedLiterals` instance is equipped with the following methods that can be used to interact
with the `EnumeratedLiterals` models:

##### Model Getters

The `EnumeratedLiterals` instance is equipped with a method, `getModel`, that can be used to
retrieve the model associated with a specific value on the `EnumeratedLiterals` instance. The return
type will be strongly typed, such that the properties associated with the provided value will be
their constant representations:

```ts
// { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
Fruits.getModel("apple");
```

The method will throw an `InvalidLiteralValueError` if the provided value is not in the set of
constant string literals on the instance.

The arguments to the methods are all strongly typed, such that the following code will not compile:

```ts
Fruits.getModel("cucumber");
```

Similarly, `EnumeratedLiterals` instance is equipped with a `getModelSafe` method, that allows
whether or not an `InvalidLiteralValueError` should be thrown in the case that the value provided is
not in the set of constant string literals on the instance or the method should simply return `null`
to be controlled via a `strict` option:

```ts
Fruits.getModelSafe("cucumber", { strict: true }); // Throws Error, but compiles
```

```ts
Fruits.getModelSafe("cucumber", { strict: false }); // Compiles, returns the model or null
```

##### Attribute Getters

The `EnumeratedLiterals` instance is equipped with a methods, `getAttribute` and `getAttributes`,
that can be used to access the attributes of a single model or all models on the
`EnumeratedLiterals` instance, respectively:

```ts
Fruits.getAttribute("apple", "description"); // Typed as "A red fruit"
```

The following will not compile:

```ts
Fruits.getAttribute("cucumber", "description");
```

The `getAttributes` method can be used to return the associated attribute of all models on the
`EnumeratedLiterals` instance, in the same order as the `values` that were used to instantiate the
instance:

```ts
// Typed as readonly ["A red fruit", "A yellow fruit", "A blue fruit", "An orange fruit"]
Fruits.getAttributes("description");
```

#### Configuration Options

Additional, optional options can be provided to the `enumeratedLiterals` method in order to control
error messages and/or the formatting of accessors on the `EnumeratedLiterals` instance.

The optional options that can be provided to the `enumeratedLiterals` method are as follows:

1. **`invalidValueErrorMessage`** (`EnumeratedLiteralsInvalidValueErrorMessage`):

   A function that can be used to format the error message for the `InvalidLiteralValueError` that
   is thrown when an invalid value is encountered by the `EnumeratedLiterals` instance.

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {
     invalidValueErrorMessage: (values, value) =>
       `The value '${value}' is not in the set of fruits: ${values.join(", ")}!`,
   });
   ```

2. **`accessorSpaceReplacement`** (`AccessorSpaceReplacement` or `"_" | "-" | ""`)

   The `string` value that will be used to replace single white-space characters when the accessors
   are either auto-generated based on the constant string literal values on the `EnumeratedLiterals`
   instance or when white-space characters are encountered in the `accessor` property of a given
   `object` provided to the `enumeratedLiterals` method:

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["red apple", "yellow banana"] as const, {
     accessorSpaceReplacement: "-",
   });

   Fruits["RED-APPLE"]; // "red apple"
   Fruits["YELLOW-BANANA"]; // "yellow banana"
   ```

   Note that multiple white-space characters encountered in the middle of a value or accessor will
   be replaced with single white-space characters:

   ###### Example

   ```ts
   const Fruits = enumeratedLiterals(["red    apple"] as const, {
     accessorSpaceReplacement: "_",
   });

   Fruits.RED_APPLE; // "red    apple"
   ```

   Default: `"_"`

3. **`accessorHyphenReplacement`** (`AccessorHyphenReplacement` or `"_" | "" | null`)

   The `string` value that will be used to replace hyphens (`"-"`) when the accessors are either
   auto-generated based on the constant string literal values on the `EnumeratedLiterals` instance
   or when hyphen characters are encountered in the `accessor` property of a given `object` provided
   to the `enumeratedLiterals` method:

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

   Whether the accessors should be formatted as lowercase strings, uppercase strings, or neither
   (`null`), when the accessors are either auto-generated based on the constant string literal
   values on the `EnumeratedLiterals` instance or when hyphen characters are encountered in the
   `accessor` property of a given `object` provided to the `enumeratedLiterals` method:

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

The following section describes the methods and properties on an `EnumeratedLiterals` instance.

#### Instance Properties

##### `values` (_property_)

The constant string literal values on the `EnumeratedLiterals` instance.

```ts
LiteralsValues<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
Fruits.values; // readonly ["apple", "banana", "blueberry", "orange"]

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

Fruits.values; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

##### `models` (_property_)

The `object`(s) associated with each value on the `EnumeratedLiterals` instance.

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
of constant string literal values on the `EnumeratedLiterals` instance.

```ts
<L extends Literals>(value: unknown, errorMessage?: string): asserts value is LiteralsValue<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  Fruits.assert(value, "The value is not a fruit!");
  processFruit(f);
}
```

##### `parse` (_method_)

Returns the provided value, typed as a value in the set of constant string literal values on the
`EnumeratedLiterals` instance, if the value is indeed in that set. Otherwise, throws an
`InvalidLiteralValueError`.

```ts
(v: unknown, errorMessage?: string): LiteralsValue<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

function processFruit(fruit: Fruit) { ... }

function process(value: unknown) {
  const f = Fruits.parse(value); // Typed as 'Fruit'
  processFruit(f);
}
```

##### `contains` (_method_)

A typeguard that returns whether or not the provided value is in the set of constant string literal
values on the `EnumeratedLiterals` instance.

```ts
(v: unknown): v is LiteralsValue<L>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

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
`EnumeratedLiterals` instance. Throws an `InvalidLiteralValueError` if the provided value is not a
specific constant string literal on the `EnumeratedLiterals` instance - however, the method is typed
such that the compiler will fail if you attempt to provide an invalid value.

```ts
<V extends LiteralsValue<L>>(v: V): LiteralsModel<L, V>;
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
`EnumeratedLiterals` instance if that provided value is in fact on the `EnumeratedLiterals`
instance.

```ts
<O extends GetModelSafeOptions>(value: unknown, opts: O): GetModelSafeRT<L, O>
```

In other words, this method does not assume that the provided value is in the set of constant string
literals on the `EnumeratedLiterals` instance, but instead will either return `null` (if
`options.strict` is `false` or not provided) or throw an `InvalidLiteralValueError` (if
`options.strict` is `true`) if the provided value is not in the set of constant string literals on
the `EnumeratedLiterals` instance.

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
`EnumeratedLiterals` instance.

```ts
<V extends LiteralsValue<L>, N extends LiteralsModelAttributeName<L>>(value: V, attribute: N): LiteralsAttributeValue<L, V, N>
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
`EnumeratedLiterals` instance.

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

Returns a new `EnumeratedLiterals` instance that consists of just the values that are provided to
the method.

```ts
<T extends readonly LiteralsValues<L>[number][], Ot extends EnumeratedLiteralsDynamicOptions<ExtractLiterals<L, T>>>(vs: T, opts?: Ot): EnumeratedLiterals<
  ExtractLiterals<L, T>,
  OptionsWithNewSet<ExtractLiterals<L, T>, Ot, L, O>
>
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
const RoundFruits = Fruits.pick(["apple", "orange"] as const);

RoundFruits.values; // readonly ["apple", "orange"]
```

##### `omit` (_method_)

Returns a new `EnumeratedLiterals` instance that consists of just the values on the instance
exluding those that are provided to the method.

```ts
<T extends readonly LiteralsValues<L>[number][], Ot extends EnumeratedLiteralsDynamicOptions<ExcludeLiterals<L, T>>>(vs: T, opts?: Ot): EnumeratedLiterals<
  ExcludeLiterals<L, T>,
  OptionsWithNewSet<ExcludeLiterals<L, T>, Ot, L, O>
>
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
const RoundFruits = Fruits.omit(["banana", "blueberry"] as const);

RoundFruits.values; // readonly ["apple", "orange"]
```

##### `humanize` (_method_)

Returns a human readable string representing the constant string literal values associated with the
`EnumeratedLiterals` instance.

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
options to the `EnumeratedLiterals` instance on instantiation and/or the constant string literal
values that are associated with the instance.

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
