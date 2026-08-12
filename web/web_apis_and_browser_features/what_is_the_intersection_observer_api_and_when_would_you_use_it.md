The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or the viewport. Instead of listening to scroll events and calculating positions (which is expensive), the browser efficiently tells you when an element enters or leaves a visible area.

**Basic usage:**

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible!');
      console.log('Visible ratio:', entry.intersectionRatio);
    } else {
      console.log('Element is not visible');
    }
  });
}, {
  root: null,         // null = viewport (or specify a scrollable ancestor)
  rootMargin: '0px',  // Margin around root (like CSS margin)
  threshold: 0.5      // Trigger when 50% of target is visible
});

const target = document.querySelector('.observe-me');
observer.observe(target);

// Stop observing
observer.unobserve(target);
observer.disconnect(); // Stop observing all targets
```

**Options explained:**

- `root` — The element used as the viewport for checking visibility. `null` means the browser viewport.
- `rootMargin` — Margin around the root, effectively growing or shrinking the intersection area. Use CSS-like syntax: `'100px 0px'` or `'-50px'` (shrink the trigger area).
- `threshold` — A number or array of numbers between 0 and 1 indicating at what percentage of visibility the callback should fire. `[0, 0.25, 0.5, 0.75, 1]` fires at every 25% visibility change.

**Common use cases:**

**1. Lazy loading images:**
```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' }); // Start loading 200px before visible

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

**2. Infinite scrolling:**
```javascript
const sentinel = document.querySelector('.sentinel');
const pageObserver = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting) {
    await loadMoreItems();
  }
});
pageObserver.observe(sentinel);
```

**3. Scroll-triggered animations:**
```javascript
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      animObserver.unobserve(entry.target); // Animate only once
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animObserver.observe(el);
});
```

**4. Sticky header detection:**
```javascript
const sentinel = document.querySelector('.header-sentinel');
const headerObserver = new IntersectionObserver((entries) => {
  document.querySelector('header').classList.toggle('sticky', !entries[0].isIntersecting);
}, { threshold: [1] });
headerObserver.observe(sentinel);
```

**The entry object properties:**

```javascript
entry.isIntersecting;    // Boolean: is target intersecting with root?
entry.intersectionRatio; // Number: 0-1, how much of target is visible
entry.boundingClientRect; // DOMRect: target's bounding rectangle
entry.rootBounds;        // DOMRect: root's bounding rectangle
entry.target;            // Element: the observed element
entry.time;              // DOMHighResTimeStamp: when the intersection was recorded
```

**Browser support:** Intersection Observer is supported in all modern browsers. For older browsers, a polyfill is available (`intersection-observer`).

The API is far more performant than scroll event listeners because the browser handles the intersection calculations off the main thread, and callbacks are batched — multiple visibility changes in the same frame are delivered in a single callback.
