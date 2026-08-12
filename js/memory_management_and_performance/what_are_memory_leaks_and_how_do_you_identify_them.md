A memory leak occurs when a program allocates memory that it no longer needs but fails to release it, causing memory usage to grow over time. In JavaScript, memory leaks prevent the garbage collector from reclaiming objects that should be freed.

**Common causes of memory leaks**:

1. **Uncleared timers**:
```js
function startPolling() {
  setInterval(() => {
    // Large data fetched and stored
    const data = fetchLargeData();
    cache.push(data);
  }, 1000);
}
// If the component using this is destroyed, the interval keeps running
```

2. **Event listeners not removed**:
```js
element.addEventListener('click', handler);
// If element is removed from DOM but listener isn't removed,
// both the element and handler stay in memory
```

3. **Closures holding references**:
```js
function process() {
  const hugeData = new Array(1000000).fill('x');
  return function result() {
    return hugeData.length; // hugeData stays in memory
  };
}
const fn = process(); // hugeData cannot be GC'd
```

4. **Global variables**:
```js
function leak() {
  leakedVar = 'I am global now'; // accidentally global
}
```

5. **Detached DOM nodes**:
```js
const elements = [];
function addElement() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  elements.push(div); // array keeps growing
}
// Removing div from DOM is not enough if it's still in the array
```

**Identifying memory leaks**:

**Chrome DevTools**:
- **Memory tab**: Take heap snapshots before and after an action. Compare snapshots to find objects that should have been garbage collected.
- **Allocation timeline**: Record memory allocations over time to spot growing memory.
- **Performance tab**: Monitor memory usage over time; a sawtooth pattern is healthy, a continuously rising line indicates a leak.

**Node.js**:
- `process.memoryUsage()` — monitor `heapUsed` over time.
- `--inspect` flag with Chrome DevTools.
- `--trace-gc` flag to log GC events.
- Libraries like `memwatch-next` to detect leaks.

**Prevention**:
- Always clear intervals/timeouts.
- Remove event listeners when components unmount.
- Null references to large objects when done.
- Use `WeakMap` and `WeakRef` for references that should not prevent GC.
- Be careful with global caches that grow unbounded.
