Generics allow you to write reusable code that works with multiple types while preserving type safety. They act as type parameters—placeholders for types that are specified when the function, class, or interface is used.

```ts
// Without generics — loses type information
function firstElement(arr: any[]): any {
  return arr[0];
}

// With generics — preserves type information
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]);     // number
const str = firstElement(['a', 'b']);     // string
```

**Generic functions**:

```ts
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const lengths = map(['hello', 'world'], s => s.length); // number[]
```

**Generic interfaces/classes**:

```ts
interface Repository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepo implements Repository<User> {
  findById(id: string): Promise<User> { /* ... */ }
  save(user: User): Promise<User> { /* ... */ }
  delete(id: string): Promise<void> { /* ... */ }
}
```

**Constraints** — limit what types are accepted:

```ts
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): T {
  console.log(item.length);
  return item;
}

logLength('hello');    // OK — string has length
logLength([1, 2, 3]);  // OK — array has length
logLength(42);          // Error — number has no length
```

**Default type parameters**:

```ts
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const res: ApiResponse = { data: anything, status: 200 }; // T defaults to unknown
const userRes: ApiResponse<User> = { data: user, status: 200 };
```

**When to use generics**:

- Writing utility functions that work with any type (map, filter, reduce).
- Building reusable data structures (Stack<T>, Queue<T>, LinkedList<T>).
- Defining API response types that vary by endpoint.
- Creating type-safe event systems, state managers, or form handlers.
- When you need the return type to relate to the input type.

Generics are the foundation of type-safe reusable code in TypeScript. Without them, you would either lose type information (using `any`) or need to write separate implementations for each type.
