Utility types are built-in generic types in TypeScript that transform existing types into new types. They reduce boilerplate and make type manipulation declarative.

**`Partial<T>`** — makes all properties optional:

```ts
interface User {
  name: string;
  age: number;
  email: string;
}

type UpdateUser = Partial<User>;
// { name?: string; age?: number; email?: string; }

function updateUser(id: string, updates: Partial<User>) {
  // Only send provided fields
}
updateUser('1', { name: 'Bob' }); // OK — partial update
```

**`Required<T>`** — makes all properties required:

```ts
interface Config {
  host?: string;
  port?: number;
}

type StrictConfig = Required<Config>;
// { host: string; port: number }
```

**`Pick<T, K>`** — creates a type with only the specified properties:

```ts
type UserPreview = Pick<User, 'name' | 'email'>;
// { name: string; email: string }

function getPreview(user: User): UserPreview {
  return { name: user.name, email: user.email };
}
```

**`Omit<T, K>`** — creates a type without the specified properties:

```ts
type CreateUser = Omit<User, 'id'>;
// { name: string; age: number; email: string }
```

**`Record<K, V>`** — constructs an object type with keys `K` and values `V`:

```ts
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
const roles: UserRoles = { alice: 'admin', bob: 'user' };

type PageMap = Record<'home' | 'about' | 'contact', React.Component>;
```

**`Readonly<T>`** — makes all properties readonly:

```ts
type FrozenUser = Readonly<User>;
const user: FrozenUser = { name: 'Alice', age: 30, email: 'a@b.com' };
user.name = 'Bob'; // Error: Cannot assign to 'name'
```

**`NonNullable<T>`** — removes `null` and `undefined`:

```ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string
```

**`ReturnType<T>`** — extracts the return type of a function:

```ts
function createUser() { return { name: 'Alice', id: 1 }; }
type User = ReturnType<typeof createUser>; // { name: string; id: number }
```

**`Parameters<T>`** — extracts parameter types as a tuple:

```ts
function greet(name: string, age: number) {}
type Params = Parameters<typeof greet>; // [string, number]
```

**`Awaited<T>`** (TS 4.5+) — unwraps Promise types:

```ts
type Result = Awaited<Promise<Promise<string>>>; // string
```

**Building custom utility types**:

```ts
type Nullable<T> = T | null;
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

Utility types are implemented using mapped types, conditional types, and the `infer` keyword under the hood. They are essential for writing DRY, maintainable TypeScript code.
