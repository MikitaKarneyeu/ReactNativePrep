Debouncing and throttling are techniques to control how often a function executes in response to high-frequency events like scrolling, resizing, or typing.

**Debouncing**: Delays execution until a specified time has passed since the last invocation. If the function is called again before the delay expires, the timer resets. This ensures the function only runs after the user has stopped triggering the event.

```js
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));
// Only fetches 300ms after the user stops typing
```

**Throttling**: Limits execution to at most once per specified interval. The function runs immediately on the first call, then ignores subsequent calls until the interval passes.

```js
function throttle(fn, interval) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

const handleScroll = throttle(() => {
  updateScrollIndicator();
}, 100);

window.addEventListener('scroll', handleScroll);
// Runs at most once every 100ms during scrolling
```

Key differences:

| Feature | Debounce | Throttle |
|---------|----------|----------|
| Timing | After activity stops | At regular intervals |
| First call | Delayed | Immediate |
| Use case | Search input, form validation | Scroll, resize, mouse move |
| Behavior | Resets timer on each call | Enforces minimum interval |

Use cases:
- **Debounce**: Search-as-you-type, form validation on input, window resize (when you only care about the final size), autosave.
- **Throttle**: Scroll position tracking, mouse move handlers, rate-limiting API calls, game input handling.

Libraries like Lodash provide optimized `_.debounce()` and `_.throttle()` with options for leading/trailing execution and `cancel()` methods.
