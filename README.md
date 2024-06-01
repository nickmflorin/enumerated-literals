# Enumerated Literals

The `enumerated-literals` package provides a strongly-typed way to define, manage and associate
constant string literals in an application.

```ts
const Fruits = enumeratedLiterals(["apple", "banana", "blueberry", "orange"] as const, {});
type Fruit = EnumeratedLiteralType<typeof Fruits>; // "apple" | "banana" | "blueberry" | "orange"

Fruits.APPLE; // "apple"
Fruits.BANANA; // "banana"

const doSomethingWithFruit = (fruit: Fruit): void;
doSomethingWithFruit("apple");
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

### Terminology

1. **`EnumeratedLiterals` Instance**: The `object` that is created and returned by the
   `enumeratedLiterals` method.
2. **Accessors**: The properties of the `EnumeratedLiterals` instance that are used to access the
   constant string literals on the object (e.g. `Fruits.APPLE`).

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
Fruits.APPLE; // "apple"
```

The constant string literal values on the `EnumeratedLiterals` instance can be accessed as a
`readonly` array as follows:

```ts
Fruits.values; // readonly ["apple", "banana", "blueberry", "orange"]
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

Fruits.Apple; // "apple"
Fruits.values; // readonly ["apple", "banana", "blueberry", "orange"]
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
    // value
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

#### Associating Other Values

An `EnumeratedLiterals` instance can be instantiated such that the constant string literals it
contains are associated with other values, constants or functions. These other values, constants or
functions will be tied to each value of the `EnumeratedLiterals` instance in a strongly typed
fashion.

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
```

The `Fruits` instance exposes a `models` attribute, along with additional methods, that can be used
to obtain the associated values of the `EnumeratedLiterals` instance. The `models` attribute will
return the `value` of each constant string literal on the instance, along with any other associated
values, in an array of `object`(s) that is in the same order as the `values` that were used to
instantiate the instance:

```ts
Fruits.values; // readonly ["apple", "banana", "blueberry", "orange"]
/* readonly [
  { value: "apple"; description: "A red fruit"; color: "red"; label: "Apple"; },
  { value: "banana"; description: "A yellow fruit"; color: "yellow"; label: "Banana"; },
  { value: "blueberry"; description: "A blue fruit"; color: "blue"; label: "Blueberry"; },
  { value: "orange"; description: "An orange fruit"; color: "orange"; label: "Orange"; },
] */
Fruits.models;
```

### Advanced Usage

#### The `EnumeratedLiteralsModel`

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

type FruitId = EnumeratedLiteralIdType<typeof Fruits>;

type Fruit<I extends FruitId = FruitId> = Extract<
  EnumeratedLiteralsModel<typeof Fruits>,
  { value: I }
>;
```

```ts
Fruits.getModel("apple").

```

## API
