The Document Object Model (DOM) is a programming interface that represents an HTML document as a tree of objects (nodes). When a browser parses HTML, it constructs this tree structure where each HTML element becomes a node in the tree, connected to other nodes through parent-child and sibling relationships.

For example, this HTML:

```html
<html>
  <body>
    <h1>Hello</h1>
    <p>World</p>
  </body>
</html>
```

Becomes this DOM tree:

```
Document
└── html
    └── body
        ├── h1
        │   └── "Hello"
        └── p
            └── "World"
```

The relationship between HTML and the DOM:

- **HTML** is a markup language — a static text document with tags that describe structure.
- **The DOM** is a live, programmable representation of that document — an API that allows JavaScript to read and manipulate the page.

When the browser loads HTML, it goes through this process:
1. **Parse HTML** — tokenizes the HTML string and builds the DOM tree.
2. **Parse CSS** — builds the CSSOM (CSS Object Model) tree.
3. **Combine** DOM and CSSOM into a render tree.
4. **Layout** — calculates the position and size of each element.
5. **Paint** — renders pixels to the screen.

JavaScript interacts with the DOM through the `document` object:

```javascript
// Select elements
const heading = document.querySelector('h1');

// Read content
console.log(heading.textContent); // "Hello"

// Modify content
heading.textContent = 'New Title';

// Change styles
heading.style.color = 'blue';

// Add/remove elements
const newParagraph = document.createElement('p');
newParagraph.textContent = 'New paragraph';
document.body.appendChild(newParagraph);

// Listen for events
heading.addEventListener('click', () => {
  heading.classList.toggle('active');
});
```

Key DOM concepts:

- **Nodes** — every object in the tree is a node (element nodes, text nodes, comment nodes, document nodes)
- **Element nodes** — represent HTML tags
- **Text nodes** — represent text content inside elements
- **The DOM is live** — changes made via JavaScript immediately reflect in the page rendering
- **The DOM is language-neutral** — it can be manipulated by JavaScript, TypeScript, or any language that can access the browser's API

Understanding the DOM is essential for any front-end developer because it is the bridge between your HTML markup and the interactive, dynamic behavior JavaScript provides.
