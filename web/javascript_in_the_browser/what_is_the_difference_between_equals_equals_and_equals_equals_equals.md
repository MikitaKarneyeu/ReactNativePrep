`==` (loose equality) and `===` (strict equality) are both comparison operators in JavaScript, but they differ in how they handle type coercion.

**`==` (loose equality)** compares values after converting them to a common type (type coercion). If the operands are different types, JavaScript attempts to convert one or both before comparing:

```javascript
1 == '1'         // true (string '1' is coerced to number 1)
0 == false       // true (false is coerced to 0)
null == undefined // true (special rule in the spec)
'' == 0          // true (empty string coerced to 0)
[] == false      // true (array coerced to empty string, then to 0)
[1] == 1         // true (array coerced to string '1', then to number 1)
NaN == NaN       // false (NaN is not equal to anything, including itself)
```

**`===` (strict equality)** compares both value and type without any coercion. If the operands are different types, it immediately returns `false`:

```javascript
1 === '1'         // false (different types: number vs string)
0 === false       // false (different types: number vs boolean)
null === undefined // false (different types)
'' === 0          // false (different types)
[] === false      // false (different types)
NaN === NaN       // false (NaN is not equal to anything)
```

**The coercion rules of `==` are complex and error-prone:**

1. If both operands are the same type, compare with `===`
2. If one is `null` and the other is `undefined`, return `true`
3. If one is a number and the other is a string, convert the string to a number
4. If one is a boolean, convert it to a number (true→1, false→0), then compare
5. If one is an object and the other is a primitive, convert the object to a primitive

These rules lead to surprising results:
```javascript
'' == '0'    // false (both strings, compared directly)
0 == ''      // true (empty string coerced to 0)
0 == '0'     // true (string '0' coerced to 0)
false == '0' // true (false→0, '0'→0)
```

**Best practice: Always use `===` (strict equality).** It is more predictable, avoids bugs from unexpected coercion, and makes your code's intent clear. The only exception is comparing `null` and `undefined`, where `== null` is a common shorthand:

```javascript
// Check for null or undefined
if (value == null) {
  // Equivalent to: value === null || value === undefined
}

// All other comparisons should use ===
if (age === 25) { }
if (name === 'Alice') { }
if (isActive === true) { }
```

ESLint's `eqeqeq` rule enforces strict equality usage across a codebase.
