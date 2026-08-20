The CSS box model is a fundamental concept that describes how every HTML element is rendered as a rectangular box consisting of four concentric layers: content, padding, border, and margin. Understanding the box model is essential for controlling layout and spacing.

**The four layers (from inside to outside):**

1. **Content** — The innermost area where text, images, or other media are displayed. Its dimensions are controlled by `width` and `height`.
2. **Padding** — The space between the content and the border. It creates internal spacing within the element. Padding is transparent and shows the element's background color.
3. **Border** — A line that wraps around the padding (or content if no padding). It has width, style, and color properties.
4. **Margin** — The outermost layer that creates space between the element and its neighbors. Margins are transparent and do not inherit background colors.

```css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
}
```

**Box sizing models:**

By default, CSS uses `content-box` sizing, where `width` and `height` apply only to the content area. Padding and border are added on top, making the actual rendered size larger:

- Content: 200px
- + Padding: 20px × 2 = 40px
- + Border: 5px × 2 = 10px
- **Total width: 250px**

This often causes confusion. The `border-box` model solves this by including padding and border within the specified `width` and `height`:

```css
/* Apply border-box globally (common best practice) */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px; /* Total rendered width is now exactly 200px */
  padding: 20px;
  border: 5px solid #333;
}
```

With `border-box`, the content area automatically shrinks to accommodate padding and border, making it much easier to reason about element sizing.

**Margin collapsing** is an important box model behavior: vertical margins of adjacent block elements collapse into a single margin equal to the larger of the two. This only happens vertically, not horizontally. Margins also collapse between a parent and its first/last child if there is no border, padding, or other content separating them.

You can inspect the box model in browser DevTools by selecting any element — the box model diagram shows all four layers with their computed values.
