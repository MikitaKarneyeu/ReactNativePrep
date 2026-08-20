Union and intersection types are fundamental ways to combine types in TypeScript.

**Union types** (`|`): A value can be one of several types. It represents "or."

```ts
type ID = string | number;

function printId(id: ID) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase()); // narrowed to string
  } else {
    console.log(id.toFixed(2));    // narrowed to number
  }
}

printId('abc'); // OK
printId(123);   // OK
printId(true);  // Error
```

Unions are commonly used with literal types for discriminated unions:

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    case 'triangle': return 0.5 * shape.base * shape.height;
  }
}
```

**Intersection types** (`&`): A value must satisfy all combined types simultaneously. It represents "and."

```ts
type HasName = { name: string };
type HasAge = { age: number };
type HasEmail = { email: string };

type Person = HasName & HasAge & HasEmail;

const user: Person = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com'
};
```

Intersection types combine all properties from each type. This is useful for mixins:

```ts
type Serializable = { serialize(): string };
type Loggable = { log(): void };

type Model = Serializable & Loggable & { id: number };

const userModel: Model = {
  id: 1,
  serialize() { return JSON.stringify(this); },
  log() { console.log(this); }
};
```

Union vs. intersection summary:

| Feature | Union (`\|`) | Intersection (`&`) |
|---------|-------------|-------------------|
| Meaning | One of the types | All of the types |
| Properties | Only common properties (before narrowing) | All properties from all types |
| Assignability | More restrictive (fewer common props) | More restrictive (requires all props) |
| Use case | Alternatives, discriminated unions | Combining capabilities, mixins |

A common pattern combines both: a discriminated union with shared properties intersected with variant-specific properties (as shown in the Shape example).
