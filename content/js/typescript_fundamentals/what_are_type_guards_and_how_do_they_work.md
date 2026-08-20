Type guards are expressions that narrow the type of a variable within a conditional branch. They allow TypeScript to infer a more specific type than the declared type.

**`typeof` guards** — for primitive types:

```ts
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TypeScript knows: string
  }
  return value.toFixed(2); // TypeScript knows: number
}
```

**`instanceof` guards** — for class instances:

```ts
function formatDate(input: Date | string) {
  if (input instanceof Date) {
    return input.toISOString(); // Date
  }
  return new Date(input).toISOString(); // string
}
```

**`in` guard** — for checking property existence:

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim(); // Fish
  } else {
    animal.fly();  // Bird
  }
}
```

**Equality narrowing**:

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both narrowed to string (the only common type)
    x.toUpperCase();
    y.toUpperCase();
  }
}
```

**Truthiness narrowing**:

```ts
function printName(name: string | null | undefined) {
  if (name) {
    console.log(name.toUpperCase()); // string (not null/undefined)
  }
}
```

**Custom type guards** — user-defined functions with type predicates:

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function example(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // string
  }
}
```

**Discriminated unions** — the most powerful pattern:

```ts
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handle<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data);  // T
  } else {
    console.log(result.error); // string
  }
}
```

**`asserts` type guards** — functions that throw if the condition is not met:

```ts
function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} is not defined`);
  }
}

function process(value: string | null) {
  assertDefined(value, 'value');
  console.log(value.toUpperCase()); // string — narrowed by assertion
}
```

Type guards are essential for working with union types safely. They bridge the gap between TypeScript's compile-time type system and runtime reality.
