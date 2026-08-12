Set and Array are both iterable collections in JavaScript, but they differ in uniqueness, access, and performance characteristics.

**Uniqueness**: Set only stores unique values. Adding a duplicate value has no effect. Arrays can contain duplicates.

```js
const arr = [1, 2, 2, 3, 3, 3];
const set = new Set(arr);
console.log(set); // Set { 1, 2, 3 }

[...set]; // [1, 2, 3] — common way to deduplicate an array
```

**Access**: Array elements are accessed by numeric index (`arr[0]`). Set has no index-based access—you can only check for existence.

```js
arr[0]; // 1
set.has(1); // true
// set[0]; // undefined — no index access
```

**Performance**: Set uses hash-based storage, so `has()`, `add()`, and `delete()` are O(1). Array `includes()`, `indexOf()`, and `splice()` are O(n).

```js
const largeSet = new Set(Array.from({ length: 100000 }, (_, i) => i));
largeSet.has(99999); // O(1) — fast

const largeArr = Array.from({ length: 100000 }, (_, i) => i);
largeArr.includes(99999); // O(n) — slower
```

**Iteration**: Both support `for...of`, `forEach`, and spread. Set iterates in insertion order.

```js
for (const val of set) { /* ... */ }
[...set]; // convert to array
Array.from(set); // convert to array
```

**Use cases**:

- Use **Set** when: you need unique values, you frequently check for membership, or you need set operations (union, intersection, difference).

```js
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...a, ...b]); // {1, 2, 3, 4, 5, 6}

// Intersection
const intersection = new Set([...a].filter(x => b.has(x))); // {3, 4}

// Difference
const difference = new Set([...a].filter(x => !b.has(x))); // {1, 2}
```

- Use **Array** when: you need ordered, indexed access, you need to allow duplicates, or you need array methods like `map`, `filter`, `reduce`, `sort`, `slice`.

Set does not have `map`, `filter`, or `reduce`. To use these, convert to an array first: `[...set].filter(...)`.
