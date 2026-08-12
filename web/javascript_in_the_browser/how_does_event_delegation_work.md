Event delegation is a pattern in JavaScript where you attach a single event listener to a parent element instead of attaching individual listeners to each child element. It leverages event bubbling — when an event occurs on a child element, it bubbles up through the DOM to its ancestors, where the parent's listener can catch it.

**Without delegation (inefficient):**

```javascript
// Attaching a listener to every button — expensive if there are many
const buttons = document.querySelectorAll('.item-button');
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    console.log('Clicked:', e.target.textContent);
  });
});
// Problem: 100 buttons = 100 event listeners
// New buttons added dynamically won't have listeners
```

**With delegation (efficient):**

```javascript
// Single listener on the parent
const list = document.querySelector('.item-list');
list.addEventListener('click', (e) => {
  // Check if the clicked element (or its ancestor) matches the selector
  const button = e.target.closest('.item-button');
  if (!button) return; // Click wasn't on a button
  
  console.log('Clicked:', button.textContent);
});
```

**How it works step by step:**

1. A child element is clicked
2. The event bubbles up through the DOM tree
3. The parent's event listener fires
4. `e.target` identifies the actual element clicked
5. `e.target.closest('.selector')` walks up from the target to find the matching element (handles clicks on child elements of the button, like an icon inside it)
6. If no match is found, the handler returns early

**Advantages of event delegation:**

1. **Memory efficiency** — One listener instead of many reduces memory usage
2. **Dynamic elements** — Automatically works for elements added to the DOM after the listener is attached, no need to re-bind listeners
3. **Cleaner cleanup** — Only one listener to remove instead of many
4. **Better performance** — Fewer event listeners means less setup time and memory

**Practical examples:**

```javascript
// Table row click handling
document.querySelector('table').addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (row && row.parentElement.tagName === 'TBODY') {
    const id = row.dataset.id;
    navigateToItem(id);
  }
});

// Tab navigation
document.querySelector('.tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab) return;
  
  // Deactivate all tabs
  document.querySelectorAll('[role="tab"]').forEach(t => {
    t.setAttribute('aria-selected', 'false');
  });
  
  // Activate clicked tab
  tab.setAttribute('aria-selected', 'true');
});

// Form handling
document.querySelector('form').addEventListener('input', (e) => {
  if (e.target.matches('.field')) {
    validateField(e.target);
  }
});
```

**When NOT to use delegation:**

- Events that don't bubble: `focus`, `blur`, `mouseenter`, `mouseleave` (use `focusin`/`focusout` and `mouseover`/`mouseout` as bubbling alternatives)
- When you need precise control over capture phase behavior
- When the performance benefit is negligible (few elements)
