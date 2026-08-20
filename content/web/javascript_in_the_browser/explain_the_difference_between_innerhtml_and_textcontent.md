`innerHTML` and `textContent` are properties on DOM elements that let you read or modify their content, but they handle content differently in important ways.

**`textContent`** gets or sets the text content of an element and its descendants. It treats everything as plain text — HTML tags are not parsed or rendered.

```javascript
const div = document.querySelector('#mydiv');

// Reading: returns all text, stripping HTML tags
div.textContent; // "Hello World"

// Writing: inserts as plain text, HTML is escaped
div.textContent = '<strong>Bold</strong>';
// Renders: <strong>Bold</strong> (visible as text, not bold)
```

**`innerHTML`** gets or sets the HTML content of an element. It parses the string as HTML, creating actual DOM nodes.

```javascript
const div = document.querySelector('#mydiv');

// Reading: returns the full HTML markup
div.innerHTML; // "<p>Hello <strong>World</strong></p>"

// Writing: parses and renders HTML
div.innerHTML = '<strong>Bold</strong>';
// Renders: **Bold** (actually bold)
```

**Key differences:**

| Aspect | `textContent` | `innerHTML` |
|--------|--------------|-------------|
| HTML parsing | No — treats as plain text | Yes — parses HTML |
| Security | Safe from XSS | Vulnerable to XSS |
| Performance | Faster (no parsing) | Slower (parses HTML) |
| Return value | All text content | HTML markup string |
| Whitespace | Preserves whitespace | Preserves HTML structure |
| Children | Removes all children, replaces with text | Removes all children, replaces with parsed HTML |

**Security concern — `innerHTML` is dangerous with user input:**

```javascript
// NEVER do this with user input!
const userInput = '<img src=x onerror="alert(\'XSS\')">';
element.innerHTML = userInput; // Executes malicious script!

// Safe alternatives:
element.textContent = userInput; // Renders as harmless text

// Or use DOMPurify for sanitization
element.innerHTML = DOMPurify.sanitize(userInput);
```

**When to use each:**

**Use `textContent` when:**
- Inserting user-generated content or any untrusted data
- You only need to display text, not HTML
- Performance matters (it's faster)
- You want to get all text from an element without HTML markup

**Use `innerHTML` when:**
- You need to insert HTML markup (formatting, links, elements)
- The content is trusted (from your code, not user input)
- You're rendering template content

**Other related properties:**

```javascript
element.innerText;       // Similar to textContent but:
                         // - Respects CSS styling (won't get hidden text)
                         // - Triggers reflow (slower)
                         // - Normalizes whitespace

element.outerHTML;       // Like innerHTML but includes the element itself
                         // element.outerHTML = '<span>New</span>' replaces the element

element.insertAdjacentHTML('beforeend', '<p>New</p>'); // Insert HTML without replacing existing content
// Positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
```

**Performance note:** If you need to insert large amounts of HTML, using `innerHTML` with string concatenation is faster than creating many DOM nodes individually. However, `textContent` is always the safer and faster option for plain text.
