`requestAnimationFrame(callback)` is a browser API that tells the browser you want to perform an animation and requests that the browser call your function before the next repaint. It synchronizes your animation with the browser's rendering cycle.

```js
function animate() {
  element.style.left = `${position}px`;
  position += 2;
  if (position < 500) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

The callback receives a high-resolution timestamp:

```js
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / 1000, 1); // 1-second animation
  element.style.left = `${progress * 500}px`;
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

**Why `requestAnimationFrame` instead of `setTimeout`**:

1. **Synchronized with the browser**: Runs before each repaint (typically 60fps = every ~16.67ms), avoiding dropped frames and visual jank.
2. **Battery efficient**: Pauses when the tab is in the background, saving CPU and battery.
3. **Optimal timing**: The browser chooses the best time to call your function, after layout but before paint.
4. **No frame skipping**: `setTimeout(fn, 16)` may fire at irregular intervals due to the event loop. `requestAnimationFrame` is always aligned to the display refresh rate.

**When to use it**:

- **Animations**: Moving elements, fading, scaling, any visual transition.
- **Canvas/WebGL rendering**: Game loops, data visualizations.
- **Scroll-linked animations**: Parallax effects, progress indicators.
- **Measuring layout**: Reading layout properties and then making changes (to avoid layout thrashing).

**Cancelling**: `requestAnimationFrame` returns an ID that can be passed to `cancelAnimationFrame()`:

```js
const id = requestAnimationFrame(animate);
cancelAnimationFrame(id);
```

**Polyfill pattern**: In Node.js or older environments, fall back to `setTimeout`:

```js
const rAF = typeof requestAnimationFrame === 'function'
  ? requestAnimationFrame
  : (cb) => setTimeout(() => cb(Date.now()), 16);
```

Do NOT use `requestAnimationFrame` for non-visual updates (data fetching, state updates). Use `setTimeout` or `queueMicrotask` for those.
