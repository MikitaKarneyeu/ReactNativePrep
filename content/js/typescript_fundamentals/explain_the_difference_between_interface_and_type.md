Interfaces and type aliases in TypeScript both define the shape of objects, but they differ in capabilities, extensibility, and use cases.

**Interface** — designed for object shapes and contracts:

```ts
interface User {
  name: string;
  age: number;
  email?: string; // optional
  readonly id: number;
}
```

**Type alias** — a more general mechanism for naming any type:

```ts
type User = {
  name: string;
  age: number;
  email?: string;
  readonly id: number;
};
```

For simple object shapes, they are interchangeable. The differences emerge in advanced use cases.

**Declaration merging**: Interfaces with the same name are automatically merged. Types cannot be redeclared.

```ts
interface User {
  name: string;
}
interface User {
  age: number;
}
// User = { name: string; age: number }

type User = { name: string };
type User = { age: number }; // Error: Duplicate identifier
```

This is useful for augmenting third-party types (e.g., extending Express `Request`).

**Extending**: Both can be extended, but with different syntax.

```ts
// Interface extending interface
interface Admin extends User {
  role: string;
}

// Type extending type
type Admin = User & { role: string };

// Interface extending type
interface Admin extends User {
  role: string;
}
```

**Type aliases can represent more types**:

```ts
// Union types — only type aliases
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// Tuple types
type Pair = [number, number];

// Mapped types
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Conditional types
type IsString<T> = T extends string ? true : false;
```

Interfaces cannot represent unions, tuples, or computed types.

**Recommendations**:
- Use `interface` for object shapes, class contracts, and when you need declaration merging.
- Use `type` for unions, intersections, tuples, mapped types, and conditional types.
- For simple object literals, either works—consistency with your team matters more than the choice.

Performance-wise, interfaces are slightly faster for the TypeScript compiler to check in some scenarios, but the difference is negligible in practice.
