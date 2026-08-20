`any`, `unknown`, and `never` represent different extremes of the TypeScript type system.

**`any`** — disables type checking entirely. You can assign anything to `any`, and you can do anything with an `any` value.

```ts
let x: any = 42;
x = 'hello';    // OK
x.foo.bar;       // OK (no type checking — runtime error if not an object)
x();             // OK (no check if it's callable)
```

Use `any` sparingly—only when migrating JavaScript to TypeScript or when you genuinely do not know the type. It defeats the purpose of TypeScript.

**`unknown`** — the type-safe counterpart of `any`. You can assign anything to `unknown`, but you cannot do anything with it until you narrow the type.

```ts
let x: unknown = 42;
x = 'hello';    // OK

// x.foo;       // Error: Object is of type 'unknown'
// x + 1;       // Error: Operator '+' cannot be applied to 'unknown'

// Must narrow first
if (typeof x === 'string') {
  console.log(x.toUpperCase()); // OK — narrowed to string
}
```

`unknown` is the correct choice when you do not know the type at compile time (e.g., parsing JSON, user input, third-party data).

**`never`** — represents values that never occur. A function that never returns (throws or infinite loop) has return type `never`.

```ts
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

`never` is also the result of exhaustive type narrowing:

```ts
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    default:
      const _exhaustive: never = shape; // Error if a case is missing
      return _exhaustive;
  }
}
```

Summary:

| Type | Assignable from | Assignable to | Use case |
|------|----------------|---------------|----------|
| `any` | Everything | Everything | Escape hatch, migration |
| `unknown` | Everything | Only `unknown`/`any` | Type-safe "any" |
| `never` | Nothing | Everything | Unreachable code, exhaustive checks |

`never` is the bottom type (empty set). `unknown` is the top type (all values). `any` bypasses the type system entirely.
