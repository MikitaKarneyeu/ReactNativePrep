DOM traversal is the process of navigating the DOM tree by moving between parent, child, and sibling nodes. Understanding tree traversal is essential for finding and manipulating elements relative to a known element.

**Parent traversal:**

```javascript
const element = document.querySelector('.child');

// parentNode — any node type (elements, text, comments, document)
element.parentNode;           // Parent node
element.parentNode.parentNode; // Grandparent

// parentElement — only Element nodes (skips text/document nodes)
element.parentElement;        // Parent element
element.closest('.ancestor'); // Nearest ancestor matching a selector (walks up the tree)
element.closest('.card');     // Find the closest .card ancestor

// closest() includes the element itself
element.closest('.child');    // Returns element itself if it matches
```

**Child traversal:**

```javascript
const parent = document.querySelector('.parent');

// Children — Element nodes only
parent.children;              // HTMLCollection of child elements
parent.childElementCount;     // Number of child elements
parent.firstElementChild;     // First child element
parent.lastElementChild;      // Last child element

// Child nodes — all node types (elements, text, comments, whitespace)
parent.childNodes;            // NodeList of all child nodes
parent.firstChild;            // First child node (may be text/whitespace)
parent.lastChild;             // Last child node
```

**Sibling traversal:**

```javascript
const element = document.querySelector('.current');

// Element siblings
element.nextElementSibling;       // Next sibling element
element.previousElementSibling;   // Previous sibling element

// All siblings (including text nodes)
element.nextSibling;              // Next node
element.previousSibling;          // Previous node
```

**Iterating over children:**

```javascript
const list = document.querySelector('ul');

// for...of loop (HTMLCollection is iterable)
for (const child of list.children) {
  console.log(child.textContent);
}

// forEach on childNodes (NodeList supports forEach)
list.childNodes.forEach(node => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    console.log(node.textContent);
  }
});

// Convert to array for array methods
const items = Array.from(list.children);
items.filter(el => el.classList.contains('active'))
     .forEach(el => el.classList.add('highlighted'));

// Using querySelectorAll on the parent
const directChildren = list.querySelectorAll(':scope > li');
```

**Node types:**

```javascript
element.nodeType === Node.ELEMENT_NODE;       // 1
element.nodeType === Node.TEXT_NODE;           // 3
element.nodeType === Node.COMMENT_NODE;       // 8
element.nodeType === Node.DOCUMENT_NODE;      // 9
element.nodeType === Node.DOCUMENT_FRAGMENT_NODE; // 11
```

**Practical traversal examples:**

```javascript
// Find all sibling list items
const currentItem = document.querySelector('li.active');
const siblings = Array.from(currentItem.parentElement.children);
const otherSiblings = siblings.filter(li => li !== currentItem);

// Navigate to a table cell's row and then to another cell in the same row
const cell = document.querySelector('td.highlighted');
const row = cell.closest('tr');
const firstCell = row.querySelector('td:first-child');
const rowIndex = row.rowIndex;

// Walk up and find the closest interactive ancestor
const clicked = e.target;
const button = clicked.closest('button, a, [role="button"]');
if (!button) return;

// Collect all text content from nested elements
function getAllText(element) {
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      text += getAllText(node);
    }
  }
  return text;
}

// Check if element is a descendant of another
const isDescendant = ancestor.contains(descendant);
const isSame = elementA.isSameNode(elementB);
```

**TreeWalker for complex traversal:**

```javascript
// TreeWalker is efficient for traversing large DOM trees
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT, // Only element nodes
  {
    acceptNode: (node) => {
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  }
);

while (walker.nextNode()) {
  console.log(walker.currentNode);
}
```

**Best practices:**

1. Use `closest()` to walk up the tree — it's more robust than chaining `parentNode`
2. Use `parentElement` over `parentNode` when you only want elements
3. Be aware that `childNodes` includes text nodes (whitespace) — use `children` for elements only
4. Use `nextElementSibling`/`previousElementSibling` to skip text nodes between elements
