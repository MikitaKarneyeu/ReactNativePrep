JavaScript performance optimization spans several areas: code execution, rendering, network, and memory.

**Code execution**:

1. **Avoid unnecessary work**: Use memoization for expensive computations, cache DOM queries, and avoid recalculating values.
```js
// Bad
function render() {
  const items = expensiveFilter(data); // called every render
}

// Good
const cachedItems = useMemo(() => expensiveFilter(data), [data]);
```

2. **Debounce and throttle** high-frequency events (scroll, resize, input).
```js
const handleScroll = throttle(() => { /* ... */ }, 100);
window.addEventListener('scroll', handleScroll);
```

3. **Use Web Workers** for CPU-intensive tasks to keep the main thread free.
```js
const worker = new Worker('heavy-computation.js');
worker.postMessage(data);
worker.onmessage = (e) => updateUI(e.data);
```

4. **Batch DOM operations**: Minimize DOM reads/writes, use `DocumentFragment`, or let frameworks batch updates.
```js
// Bad — causes reflow on each iteration
for (const item of items) {
  list.appendChild(createElement(item));
}

// Good — single reflow
const fragment = document.createDocumentFragment();
for (const item of items) {
  fragment.appendChild(createElement(item));
}
list.appendChild(fragment);
```

**Rendering**:

5. **Use `requestAnimationFrame`** for animations instead of `setTimeout`.
6. **Minimize reflows/repaints**: Avoid reading layout properties after changing styles. Use CSS classes instead of inline styles.
7. **Use CSS `transform` and `opacity`** for animations (GPU-accelerated, no reflow).
8. **Virtualize long lists**: Only render visible items (react-window, react-virtualized).

**Network**:

9. **Code splitting**: Load only what is needed using dynamic `import()`.
10. **Lazy load images**: Use `loading="lazy"` or Intersection Observer.
11. **Cache aggressively**: Use service workers, HTTP caching headers.
12. **Compress assets**: Use gzip/brotli, minify JS/CSS.

**Memory**:

13. **Avoid memory leaks**: Clear timers, remove event listeners, null references.
14. **Use `WeakMap`/`WeakRef`** for references that should not prevent garbage collection.
15. **Pool objects** when creating and destroying many objects rapidly.

**Measurement first**: Always profile before optimizing. Use Chrome DevTools Performance tab, Lighthouse, `console.time()`, and `performance.mark()`/`performance.measure()`.
