`async` and `defer` are boolean attributes on `<script>` tags that control how external JavaScript files are downloaded and executed relative to HTML parsing. They solve the problem of parser-blocking scripts that halt HTML parsing while downloading and executing.

**Default behavior (no attribute):**
```html
<script src="app.js"></script>
```
- **Download**: Blocks HTML parsing until the script is downloaded
- **Execute**: Blocks HTML parsing, executes immediately
- **Order**: Scripts execute in the order they appear
- **DOM**: May not have access to DOM elements below the script tag

**`async` attribute:**
```html
<script async src="analytics.js"></script>
<script async src="app.js"></script>
```
- **Download**: Downloads in parallel with HTML parsing (non-blocking)
- **Execute**: Executes as soon as it finishes downloading, pausing HTML parsing
- **Order**: NOT guaranteed — whichever downloads first executes first
- **Use case**: Independent scripts like analytics, ads, or widgets

**`defer` attribute:**
```html
<script defer src="framework.js"></script>
<script defer src="app.js"></script>
```
- **Download**: Downloads in parallel with HTML parsing (non-blocking)
- **Execute**: Executes after the HTML is fully parsed (after DOMContentLoaded)
- **Order**: Guaranteed — scripts execute in the order they appear in the document
- **Use case**: Application scripts that need the DOM and depend on each other

**Timeline visualization:**

```
HTML Parsing: ████████████████████████████████████████

No attribute:
  Download:       ████ (blocks parsing)
  Execute:        ██ (blocks parsing)
  HTML resumes:         ████████████████████

async:
  Download:     ████████ (parallel)
  Execute:            ██ (pauses parsing)
  HTML:        ████████   ████████████████

defer:
  Download:     ████████ (parallel)
  Execute:                                    ██ (after parsing)
  HTML:        ████████████████████████████████
```

**Comparison table:**

| Aspect | Default | `async` | `defer` |
|--------|---------|---------|---------|
| Download | Blocks parsing | Parallel | Parallel |
| Execute | Immediately on download | On download (blocks parsing) | After DOM is parsed |
| Order | Document order | Download order | Document order |
| DOM ready | No | No | Yes |
| DOMContentLoaded | Before | Before | After |

**Practical usage:**

```html
<!-- Critical framework (needs to load first) -->
<script defer src="/js/framework.js"></script>

<!-- App code (depends on framework) -->
<script defer src="/js/app.js"></script>

<!-- Analytics (independent, doesn't need DOM) -->
<script async src="https://analytics.example.com/track.js"></script>

<!-- Third-party widgets -->
<script async src="https://widgets.example.com/widget.js"></script>
```

**Best practices:**

1. **Use `defer` for application scripts** — They load in parallel, execute in order, and have full DOM access. This is the most reliable option.
2. **Use `async` for independent scripts** — Analytics, ads, social widgets that don't depend on your app code.
3. **Avoid default (no attribute)** — Parser-blocking scripts significantly slow down page load.
4. **Inline critical scripts** — For code that must run immediately (e.g., theme detection), inline it in a `<script>` tag rather than using an external file.
5. **Module scripts are deferred by default** — `<script type="module">` is automatically deferred and also runs in strict mode.

```html
<!-- Module scripts are deferred by default -->
<script type="module" src="app.js"></script>

<!-- Equivalent to: -->
<script type="module" defer src="app.js"></script>
```

**When `defer` and `DOMContentLoaded` interact:**

Deferred scripts execute after HTML parsing is complete but before `DOMContentLoaded` fires. This means all deferred scripts run, then `DOMContentLoaded` fires — the opposite of `async` scripts, which may fire before or after `DOMContentLoaded` depending on download timing.
