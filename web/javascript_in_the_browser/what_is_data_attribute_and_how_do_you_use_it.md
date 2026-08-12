Data attributes (`data-*`) are custom HTML attributes that allow you to store extra information on any HTML element without using non-standard attributes, JavaScript hacks, or hidden inputs. They follow the `data-*` naming convention and are fully valid HTML5.

**Defining data attributes:**

```html
<article
  class="post"
  data-id="123"
  data-category="javascript"
  data-author-id="456"
  data-published="true"
  data-view-count="1520"
>
  <h2>Understanding Data Attributes</h2>
  <button data-action="delete" data-confirm="true">Delete</button>
</article>
```

**Accessing with JavaScript via the `dataset` property:**

```javascript
const article = document.querySelector('.post');

// Read data attributes (camelCase conversion: data-author-id → authorId)
console.log(article.dataset.id);          // "123"
console.log(article.dataset.category);    // "javascript"
console.log(article.dataset.authorId);    // "456" (data-author-id → authorId)
console.log(article.dataset.published);   // "true" (always a string)

// Read numeric values (must convert manually)
const viewCount = parseInt(article.dataset.viewCount, 10); // 1520

// Read boolean values (must convert manually)
const isPublished = article.dataset.published === 'true'; // true

// Set data attributes
article.dataset.views = '1521';
article.dataset.featured = 'true';

// Delete data attributes
delete article.dataset.featured;

// Check existence
if ('id' in article.dataset) { /* data-id exists */ }
```

**CSS selectors with data attributes:**

```css
/* Style based on data attributes */
[data-published="true"] {
  border-left: 3px solid green;
}

[data-category="javascript"] {
  background-color: #f7df1e10;
}

/* Attribute selectors */
[data-action="delete"] {
  color: red;
}

[data-id^="1"] {
  /* Starts with "1" */
}

[data-category~="javascript"] {
  /* Contains word "javascript" */
}
```

**Common use cases:**

1. **Storing element state:**
```html
<div data-state="open" data-loading="false">
```

2. **Configuration for JavaScript components:**
```html
<div class="carousel" data-autoplay="true" data-interval="3000" data-slides="5">
```

3. **Event delegation with action handlers:**
```javascript
document.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]');
  if (!action) return;

  switch (action.dataset.action) {
    case 'delete':
      deleteItem(action.dataset.id);
      break;
    case 'edit':
      editItem(action.dataset.id);
      break;
  }
});
```

4. **Passing server data to JavaScript:**
```html
<script>
  // Or use data attributes on a container element
  const config = document.getElementById('app').dataset;
</script>
<div id="app" data-api-url="/api/v1" data-user-id="789" data-max-items="50">
```

5. **CSS-driven animations/transitions:**
```css
[data-tooltip]::after {
  content: attr(data-tooltip);
  /* Tooltip styling */
}
```

**Best practices:**

- Data attributes are always strings — convert to numbers/booleans manually
- Use kebab-case in HTML (`data-author-id`), which becomes camelCase in JS (`authorId`)
- Don't store large amounts of data — they increase DOM size and are publicly visible in page source
- For structured data, consider JSON in a `<script type="application/json">` tag instead
- Don't use data attributes when a proper HTML attribute exists (e.g., use `value` not `data-value` for inputs)
