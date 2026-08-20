Optional chaining (`?.`) and nullish coalescing (`??`) are operators introduced in ES2020 that provide safer access to potentially `null` or `undefined` values.

**Optional chaining** short-circuits to `undefined` when the value before `?.` is `null` or `undefined`:

```js
const user = { profile: { name: 'Alice' } };

// Without optional chaining
const city = user && user.address && user.address.city; // undefined

// With optional chaining
const city = user?.address?.city; // undefined
```

It works with property access, function calls, and array indexing:

```js
const obj = { fn: () => 'hello' };
obj?.fn();              // 'hello'
obj?.missing?.();       // undefined (no error)

const arr = [1, 2, 3];
arr?.[5];               // undefined

const maybeNull = null;
maybeNull?.prop;        // undefined (no TypeError)
```

**Nullish coalescing** returns the right-hand operand when the left-hand operand is `null` or `undefined` (but NOT `0`, `''`, or `false`):

```js
const value = null ?? 'default';    // 'default'
const value2 = undefined ?? 'default'; // 'default'
const value3 = 0 ?? 'default';      // 0 — 0 is not nullish
const value4 = '' ?? 'default';     // '' — '' is not nullish
```

This differs from `||`, which treats all falsy values the same:

```js
const count = 0 || 10;  // 10 (0 is falsy)
const count2 = 0 ?? 10; // 0  (0 is not null/undefined)
```

They combine well:

```js
const user = {
  profile: {
    name: 'Alice',
    settings: {
      theme: null
    }
  }
};

const theme = user?.profile?.settings?.theme ?? 'light'; // 'light'
```

Optional chaining assignment is not supported—you cannot do `obj?.prop = value`. Both operators are widely supported in modern browsers and Node.js 14+.
