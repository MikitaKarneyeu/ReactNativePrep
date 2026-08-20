Block-level elements occupy the full width of their parent container by default and always start on a new line. They create a "block" in the document flow. Common block elements include `<div>`, `<p>`, `<h1>` through `<h6>`, `<ul>`, `<ol>`, `<li>`, `<section>`, `<article>`, `<header>`, `<footer>`, and `<table>`.

Inline elements only take up as much width as their content requires and do not start on a new line. They flow within the surrounding text or inline content. Common inline elements include `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<input>`, `<button>`, `<label>`, and `<code>`.

Key differences include:

- **Width**: Block elements expand to fill the parent's width; inline elements shrink-wrap their content.
- **Line breaks**: Block elements force a new line before and after; inline elements do not.
- **Width/height properties**: Block elements respect `width` and `height` CSS properties. Inline elements ignore `width` and `height` (though they respect horizontal padding and margins).
- **Nesting**: Block elements can contain both block and inline elements. Inline elements should generally only contain other inline elements or text (e.g., putting a `<div>` inside an `<span>` is invalid HTML).

There is also a hybrid display type called **inline-block**. Elements with `display: inline-block` flow inline like text but respect `width`, `height`, vertical padding, and vertical margins like block elements. This is useful for creating horizontal layouts of sized elements without using flexbox or grid.

```css
.inline-block-item {
  display: inline-block;
  width: 200px;
  height: 100px;
  vertical-align: top;
}
```

Understanding the default display behavior of elements is critical for layout work. Modern CSS has moved beyond this simple binary with flexbox and grid, but the block/inline distinction remains fundamental to how the browser's normal document flow works.
