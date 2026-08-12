Selecting DOM elements is the first step in any DOM manipulation. JavaScript provides multiple methods for finding elements, each with different use cases.

**Modern methods (preferred):**

```javascript
// querySelector — returns FIRST matching element (or null)
const header = document.querySelector('header');
const card = document.querySelector('.card');
const emailInput = document.querySelector('#email');
const firstItem = document.querySelector('.list > li:first-child');
const activeLink = document.querySelector('nav a.active');

// querySelectorAll — returns ALL matching elements (NodeList)
const items = document.querySelectorAll('.list-item');
const paragraphs = document.querySelectorAll('p');
const buttons = document.querySelectorAll('button[type="submit"]');

// Iterate NodeList (it's not a real array but is iterable)
items.forEach(item => {
  console.log(item.textContent);
});

// Convert to array if needed (for array methods like map, filter)
const itemsArray = Array.from(document.querySelectorAll('.item'));
const ids = itemsArray.map(el => el.id);
```

**Legacy methods (still valid, more specific):**

```javascript
// getElementById — returns single element by ID
const main = document.getElementById('main');

// getElementsByClassName — returns live HTMLCollection
const cards = document.getElementsByClassName('card');
// Live: automatically updates when DOM changes

// getElementsByTagName — returns live HTMLCollection
const divs = document.getElementsByTagName('div');
const allElements = document.getElementsByTagName('*');

// getElementsByName — returns NodeList by name attribute
const radioButtons = document.getElementsByName('gender');
```

**Live vs static collections:**

```javascript
// querySelectorAll returns a STATIC NodeList (snapshot)
const staticList = document.querySelectorAll('.item');
const container = document.querySelector('.container');
container.innerHTML += '<div class="item">New</div>';
console.log(staticList.length); // Still the old count — not updated

// getElementsByClassName returns a LIVE HTMLCollection
const liveList = document.getElementsByClassName('item');
container.innerHTML += '<div class="item">New</div>';
console.log(liveList.length); // Updated — includes the new element
```

**Scoped queries:**

```javascript
// Query within a specific element, not the whole document
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = sidebar.querySelectorAll('a');
const sidebarTitle = sidebar.querySelector('h2');

// Element methods work the same way
const cards = sidebar.getElementsByClassName('card');
```

**Advanced selectors:**

```javascript
// Attribute selectors
document.querySelectorAll('[data-role="admin"]');
document.querySelectorAll('a[href^="https"]');      // Starts with
document.querySelectorAll('input[type$="text"]');    // Ends with
document.querySelectorAll('div[class*="col"]');     // Contains

// Pseudo-selectors
document.querySelectorAll('li:nth-child(odd)');
document.querySelectorAll('input:invalid');
document.querySelectorAll('button:not([disabled])');
document.querySelectorAll(':checked');

// Comma-separated (multiple selectors)
document.querySelectorAll('h1, h2, h3');

// Combining selectors
document.querySelectorAll('.card > .card-body p:first-of-type');
```

**Best practices:**

1. Prefer `querySelector`/`querySelectorAll` — they accept any CSS selector and return static collections
2. Use `getElementById` when selecting by ID — it's slightly faster than `querySelector('#id')`
3. Cache selections in variables — don't repeatedly query the DOM
4. Use `closest()` to find an ancestor matching a selector: `element.closest('.parent')`
5. Use `matches()` to check if an element matches a selector: `element.matches('.active')`
