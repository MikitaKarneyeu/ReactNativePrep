The viewport meta tag is an HTML meta element that tells the browser how to control the page's dimensions and scaling on mobile devices. Without it, mobile browsers render pages at a virtual viewport width (typically around 980px) and then scale the result down to fit the screen, making text tiny and layouts unusable on mobile devices.

**Standard usage:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**What each part does:**

- `width=device-width` — Sets the viewport width to match the device's screen width in CSS pixels (e.g., 375px on an iPhone, not 980px virtual width). This is the single most important setting.
- `initial-scale=1.0` — Sets the initial zoom level to 100% when the page loads. Prevents the browser from zooming out to show the full 980px layout.

**Additional viewport properties:**

```html
<!-- Prevent user zooming (accessibility concern — avoid in production) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- Minimum and maximum scale -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=5.0">
```

**Why it's needed:**

1. **Mobile rendering** — Without this tag, mobile browsers assume you haven't designed for mobile and render the page at a wide virtual viewport, then shrink it. With `width=device-width`, the browser uses the actual device width, allowing your responsive CSS to work correctly.

2. **Responsive design prerequisite** — Media queries and fluid layouts depend on the viewport width being set to the device width. Without the viewport meta tag, `@media (max-width: 768px)` would never trigger on a phone because the virtual viewport is 980px.

3. **Touch interaction** — Proper viewport settings ensure that tap targets are appropriately sized and that the page doesn't require unnecessary zooming and panning.

**Common mistakes:**

```html
<!-- BAD: Prevents zooming — accessibility violation -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- BAD: Missing initial-scale on some devices -->
<meta name="viewport" content="width=device-width">

<!-- GOOD: Allows zooming, sets proper width -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Important accessibility note:** Never disable user zoom with `user-scalable=no` or `maximum-scale=1.0`. Users with low vision rely on pinch-to-zoom to read content. Disabling zoom is an accessibility failure under WCAG 2.1 Success Criterion 1.4.4 (Resize Text).

The viewport meta tag should be placed in the `<head>` of every HTML document and is required for any page that needs to work on mobile devices.
