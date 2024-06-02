# Enumerated Literals

The `enumerated-literals` package provides a strongly-typed, type-safe and convenient pattern for
defining and manage constant strings in an application.

```bash
npm install enumerated-literals
```

At it's core, the `enumerated-literals` package provides a method, `enumeratedLiterals`, that can be
used to define and group constant string literals in an `enum`-like fashion:

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

Fruits.APPLE; // Typed as "apple"
Fruits.BANANA; // Typed as "banana"

const doSomethingWithFruit = (fruit: Fruit): void;
doSomethingWithFruit("apple");
```

#### Terminology

The following terms will be referenced throughout this documentation:

##### The `EnumeratedLiterals` Instance:

The `object` that is created and returned by the `enumeratedLiterals` method (e.g. `Fruits`).

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
```

##### The `EnumeratedLiterals` Values

The constant string literal values that the `EnumeratedLiterals` instance contains (e.g. `"apple"`,
`"banana"`, `"blueberry"`, `"orange"`).

```ts
Fruits.values; // Typed as readonly ["apple", "banana", "blueberry", "orange"]
```

##### The `EnumeratedLiterals` Models

The `object`(s) associated with each `EnumeratedLiterals` value on the `EnumeratedLiterals`
instance. Each object contains the relevant `EnumeratedLiterals` value, indexed by the `value` key,
along with additional key-value pairs that are associated with each value when provided on
instantiation of the instance: `"banana"`, `"blueberry"`, `"orange"`).

```ts
// Typed as readonly [ { value: "apple" }, { value: "banana" }, { value: "blueberry" }, { value: "orange" }]
Fruits.models;
```

##### The `EnumeratedLiterals` **Accessors**

The properties of the `EnumeratedLiterals` instance that are used to access the `EnumeratedLiterals`
values on the instance (e.g. `APPLE` or `BANANA`).

```ts
Fruits.APPLE; // Typed as "apple"
```

### Motivation

The motivation for the development of this package was to provide a more convenient way to define
and manage constant string definitions in an application that blends the benefits of an `enum`
object with that of a `string` literal, while also attempting to eliminate the drawbacks of each.

#### The `enum` Object

Consider the following `enum` object:

```ts
enum Fruits {
  APPLE = "apple",
  BANANA = "banana",
  BLUEBERRY = "blueberry",
  ORANGE = "orange",
}
```

The values of the `enum` can be accessed as `Fruits.APPLE`, `Fruits.BANANA`, etc. This is
convenient, and reduces the likelihood of bugs by allowing potentially more complex strings to be
accessed by the members of the `enum` object.

For instance, in the following, the likelihood of introducing a bug due to the mispelling of a URL
is reduced when we consistently reference the URL for Google or YouTube in the application as
`ApplicationUrls.GOOGLE` and `ApplicationUrls.YOUTUBE` respectively, rather than as "magic strings",
like `"https://www.google.com"` or `"https://www.youtube.com"`:

```ts
enum ApplicationUrls {
  GOOGLE = "https://www.google.com",
  YOUTUBE = "https://www.youtube.com",
}
```

However, the `enum` object has the following drawbacks:

1.  The values of the `Fruits` `enum` object are not treated as string literals. For instance, the
    following code will not compile:

    ```ts
    function getFruitColor(fruit: Fruit): string {
      ...
    }

    const appleColor = getFruitColor("apple")
    ```

    Sometimes this is desirable behavior, but other times it is not.

2.  Associating values of the `Fruits` `enum` object with other constant values and/or definitions
    requires the addition of additional types, data structures, functions and/or definitions:

    ```ts
    const FruitColors: { [key in Fruits]: string } = {
      [Fruits.APPLE]: "red",
      [Fruits.BANANA]: "yellow",
      [Fruits.BLUEBERRY]: "blue",
      [Fruits.ORANGE]: "orange",
    };
    ```

#### String Literals

Consider the following pattern commonly used to define string literals in an application:

```ts
const Fruits = ["apple", "banana", "blueberry", "orange"] as const;
type Fruit = (typeof Fruits)[number];
```

Defining constant string literals in this manner is slightly more flexible than an `enum` object,
because a string literal (e.g. `"apple"`) satisfies the `Fruit` type. For example, the following
code will compile:

```ts
function getFruitColor(fruit: Fruit): string {
  ...
}

const appleColor = getFruitColor("apple")
```

However, defining constant string literals in this manner has the following drawbacks:

1.  The values represented by the `Fruit` type do not have `enum`-like accessors, like
    `Fruits.APPLE`, or `Fruits.BANANA`.
2.  As with the `enum` object, associating the values represented by the `Fruit` type with other
    constant values and/or definitions requires the addition of additional types, data structures
    and/or definitions.

### Usage

The following describes how the `enumerated-literals` package can be used and the various features
it offers.

#### Basic Usage

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
Fruits.assert("cucumber"); // throws an Error
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
// Typed as { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; }
Fruits.getModel("apple");
```

The method will throw an `Error` if the provided value is not in the set of constant string literals
on the instance.

The arguments to the methods are all strongly typed, such that the following code will not compile:

```ts
Fruits.getModel("cucumber");
```

Similarly, `EnumeratedLiterals` instance is equipped with a `getModelSafe` method, that allows
whether or not an `Error` should be thrown in the case that the value provided is not in the set of
constant string literals on the instance or the method should simply return `null` to be controlled
via a `strict` option:

```ts
Fruits.getModelSafe("cucumber", { strict: true }); // Throws Error, but compiles
```

```ts
Fruits.getModelSafe("apple", { strict: false }); // Compiles, returns `string | null`.
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

### API

#### Properties

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

The `object`(s) associated with each `EnumeratedLiterals` value on the `EnumeratedLiterals`
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

##### `zodSchema` (_property_)

Returns a `zod.ZodUnion` that can be used to validate a value when parsing with `zod`.

```ts
z.ZodUnion<
  readonly [z.ZodLiteral<LiteralsValues<L>[number]>, ...z.ZodLiteral<LiteralsValues<L>[number]>[]]
>;
```

###### Example

```ts
import { enumeratedLiterals } from "enumerated-literals";

const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

const MyFruitSchema = z.object({
  name: Fruits.schema,
  id: z.string(),
});
```

#### Methods

##### `assert` (_method_)

A type assertion that throws an `Error` if the provided value is not in the set of constant string
literal values on the `EnumeratedLiterals` instance.

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
`EnumeratedLiterals` instance, if the value is indeed in that set. Otherwise, throws an `Error`.

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

```ts
<V extends LiteralsValue<L>>(v: V): LiteralsModel<L, V>;
```

##### `getModelSafe` (_method_)

```ts
<O extends GetModelSafeOptions>(value: unknown, opts: O): GetModelSafeRT<L, O>
```

##### `getAttribute` (_method_)

Returns the value of an attribute, `N`, associated with a specific value on the `EnumeratedLiterals`
instance.

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

Returns the values of a given attribute, `N`, associated with a all constant string literals on the
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
