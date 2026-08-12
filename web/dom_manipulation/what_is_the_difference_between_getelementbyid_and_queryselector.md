`getElementById` and `querySelector` are both methods for selecting a single DOM element, but they differ in syntax, flexibility, return behavior, and performance characteristics.

**`getElementById`:**

```javascript
const element = document.getElementById('myId');
```

- Accepts only an ID string (without `#`)
- Returns a single `Element` or `null`
- Only works on `document` — you cannot call it on a sub-element to search within a container
- Returns a **live** reference (though for single elements this distinction is less relevant)
- Very fast — browsers optimize ID lookups internally using hash maps

**`querySelector`:**

```javascript
const element = document.querySelector('#myId');
const firstCard = document.querySelector('.card');
const submitBtn = document.querySelector('button[type="submit"]');
const complex = document.querySelector('.sidebar > nav a.active');
```

- Accepts any valid CSS selector string (with `#` for IDs)
- Returns the first matching element or `null`
- Can be called on any element to search within its subtree
- Returns a **static** snapshot of the element
- Slightly slower than `getElementById` for ID lookups (browser must parse the selector), but the difference is negligible

**Key differences:**

| Aspect | `getElementById` | `querySelector` |
|--------|-----------------|-----------------|
| Selector type | ID only | Any CSS selector |
| Argument format | `'myId'` (no `#`) | `'#myId'` (with `#`) |
| Scope | `document` only | Any element |
| Flexibility | Limited | Very flexible |
| Performance | Very fast for IDs | Slightly slower (selector parsing) |
| Return type | `Element` or `null` | `Element` or `null` |

**When to use each:**

```javascript
// getElementById — when you know the exact ID
const app = document.getElementById('app');
const form = document.getElementById('login-form');

// querySelector — for everything else
const firstError = document.querySelector('.error-message');
const activeNav = document.querySelector('nav li.active');
const submitInForm = form.querySelector('button[type="submit"]'); // Scoped search!
```

**Scoping difference is important:**

```javascript
// getElementById always searches the whole document
const globalId = document.getElementById('header'); // Works
// document.getElementById is NOT available on child elements
const child = document.querySelector('.container');
// child.getElementById('nested-id'); // TypeError!

// querySelector can be called on any element
const container = document.querySelector('.container');
const nestedElement = container.querySelector('#nested-id'); // Searches within container only
```

**Practical recommendation:** Use `querySelector` and `querySelectorAll` as your default methods. They cover all use cases with a consistent API and work with any CSS selector. Use `getElementById` when you're specifically selecting by ID and want the clearest intent and marginal performance advantage.

```javascript
// These are functionally equivalent:
document.getElementById('main');
document.querySelector('#main');

// But querySelector lets you do this:
document.querySelector('#main > .content > article:first-child');
```

The performance difference between the two for ID lookups is measured in nanoseconds and is irrelevant in real applications. Code clarity and consistency matter more.
