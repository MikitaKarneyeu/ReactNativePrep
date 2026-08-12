The `alt` attribute on `<img>` elements provides alternative text that describes the image content. It serves multiple critical purposes that make it one of the most important HTML attributes.

**Accessibility**: The primary purpose of `alt` text is to make images accessible to users who cannot see them. Screen readers read the `alt` text aloud to describe the image to visually impaired users. Without it, screen readers may read the file name or skip the image entirely, leaving users with an incomplete understanding of the page content. This is a requirement under WCAG 2.1 guidelines (Success Criterion 1.1.1).

**Fallback content**: If an image fails to load due to a broken URL, network error, or slow connection, the browser displays the `alt` text in place of the image. This ensures users still understand what content was intended to appear.

**SEO**: Search engines use `alt` text to understand image content and context. Well-written `alt` text helps images appear in image search results and contributes to the page's overall relevance for related queries.

Best practices for writing `alt` text:

```html
<!-- Good: Describes the content and purpose -->
<img src="chart.png" alt="Bar chart showing Q1-Q4 revenue growth from $1M to $4M">

<!-- Good: Empty alt for decorative images -->
<img src="decorative-border.png" alt="">

<!-- Bad: Redundant or unhelpful -->
<img src="photo.jpg" alt="image">
<img src="photo.jpg" alt="photo of a picture">
```

- Be descriptive but concise (typically under 125 characters)
- Describe the function if the image is a link or button
- Don't start with "Image of..." or "Picture of..." — screen readers already announce it as an image
- Use empty `alt=""` for purely decorative images so screen readers skip them
- For complex images like charts or diagrams, provide a longer description using `aria-describedby` or a linked text description
