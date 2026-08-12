The `infer` keyword is used in conditional types to extract (infer) a type from another type. It acts as a type-level pattern match, allowing you to pull out parts of a type.

**Extracting return types**:

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type Result = ReturnType<Fn>; // string
```

Here, `infer R` matches the return type of the function and binds it to `R`.

**Extracting parameter types**:

```ts
type FirstParam<T> = T extends (first: infer P, ...args: any[]) => any ? P : never;

type Fn = (name: string, age: number) => void;
type P = FirstParam<Fn>; // string
```

**Extracting array element types**:

```ts
type ElementOf<T> = T extends (infer E)[] ? E : never;

type Arr = number[];
type El = ElementOf<Arr>; // number
```

**Extracting Promise resolved types**:

```ts
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;

type A = Unwrap<Promise<string>>;           // string
type B = Unwrap<Promise<Promise<number>>>;  // number (recursive unwrap)
```

**Extracting from generic types**:

```ts
type ValueOf<T> = T extends Map<any, infer V> ? V : never;
type KeyOf<T> = T extends Map<infer K, any> ? K : never;

type M = Map<string, number>;
type V = ValueOf<M>; // number
type K = KeyOf<M>;   // string
```

**Multiple `infer` positions**:

```ts
type Swap<T> = T extends [infer A, infer B] ? [B, A] : never;

type Result = Swap<[string, number]>; // [number, string]
```

**Real-world use case — extracting event handler types**:

```ts
type EventHandler<T> = T extends {
  onChange: (event: infer E) => void;
} ? E : never;

interface InputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type InputEvent = EventHandler<InputProps>; // React.ChangeEvent<HTMLInputElement>
```

TypeScript also has built-in utility types that use `infer`: `ReturnType<T>`, `Parameters<T>`, `ConstructorParameters<T>`, `InstanceType<T>`, and `Awaited<T>`.

The `infer` keyword can only be used in the `extends` clause of a conditional type. It is the primary mechanism for type-level programming in TypeScript.
