Creating and appending elements dynamically allows you to build UI components, render data from APIs, and update the page structure with JavaScript. There are several methods for creating and inserting DOM elements.

**Creating elements:**

```javascript
// createElement — creates a new element
const div = document.createElement('div');
div.textContent = 'Hello World';
div.className = 'card';
div.id = 'card-1';
div.setAttribute('data-id', '123');

// Create with properties
const button = document.createElement('button');
button.type = 'submit';
button.textContent = 'Click me';
button.disabled = false;
button.classList.add('btn', 'btn-primary');

// Create input
const input = document.createElement('input');
input.type = 'email';
input.name = 'email';
input.placeholder = 'Enter email';
input.required = true;

// Create text node
const text = document.createTextNode('Some text content');

// Create document fragment (for batch operations)
const fragment = document.createDocumentFragment();
```

**Appending elements (insertion methods):**

```javascript
const parent = document.querySelector('.container');

// appendChild — adds as last child (returns the appended node)
parent.appendChild(div);

// append — adds one or more nodes or strings (no return value useful for chaining)
parent.append(div, ' some text', anotherElement);

// prepend — adds as first child
parent.prepend(span);

// insertBefore — inserts before a reference node
const reference = parent.querySelector('.existing-child');
parent.insertBefore(newElement, reference);

// insertAdjacentElement — insert relative to target element
// Positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
element.insertAdjacentElement('beforebegin', newElement); // Before the element
element.insertAdjacentElement('afterbegin', newElement);  // Inside, as first child
element.insertAdjacentElement('beforeend', newElement);   // Inside, as last child
element.insertAdjacentElement('afterend', newElement);    // After the element

// insertAdjacentHTML — insert HTML string
element.insertAdjacentHTML('beforeend', '<div class="item">New item</div>');

// insertAdjacentText — insert text
element.insertAdjacentText('beforeend', 'Some text');
```

**Removing and replacing elements:**

```javascript
// Remove an element
element.remove();

// Remove child from parent
parent.removeChild(child);

// Replace an element
parent.replaceChild(newElement, oldElement);

// replaceWith — modern replacement method
oldElement.replaceWith(newElement);
```

**Performance — batch operations with DocumentFragment:**

```javascript
// BAD: Multiple DOM manipulations cause reflows
const list = document.querySelector('ul');
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li); // 1000 reflows!
}

// GOOD: Use DocumentFragment for batching
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li); // No reflow — fragment is not in the DOM
}
list.appendChild(fragment); // Single reflow — all elements inserted at once

// ALSO GOOD: Build HTML string and insert once
const items = Array.from({ length: 1000 }, (_, i) => `<li>Item ${i}</li>`);
list.innerHTML = items.join('');

// ALSO GOOD: Use replaceChildren to clear and insert
list.replaceChildren(...Array.from({ length: 1000 }, (_, i) => {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  return li;
}));
```

**Cloning elements:**

```javascript
const original = document.querySelector('.template');
const shallowClone = original.cloneNode(false); // Element only, no children
const deepClone = original.cloneNode(true);     // Element and all descendants

// Modify clone and insert
deepClone.id = 'new-card';
deepClone.querySelector('.title').textContent = 'New Card';
document.querySelector('.container').appendChild(deepClone);
```

**Best practices:**

1. Prefer `append()` over `appendChild()` — it accepts multiple arguments and strings
2. Use `DocumentFragment` for batch insertions to minimize reflows
3. Use `innerHTML` with sanitized content for large HTML blocks from templates
4. Remove elements with `remove()` — it's cleaner than `parentNode.removeChild()`
5. Clone templates with `cloneNode(true)` rather than creating from scratch repeatedly
