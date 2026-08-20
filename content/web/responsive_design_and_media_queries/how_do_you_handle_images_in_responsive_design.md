Handling images in responsive design involves ensuring images scale properly, load efficiently across devices, and serve appropriate sizes for different viewports. There are several techniques and HTML/CSS features designed for this.

**Basic responsive image:**

```css
img {
  max-width: 100%;
  height: auto;
}
```

This ensures images never overflow their container and maintain their aspect ratio when scaled down.

**The `<picture>` element** allows you to serve different images based on viewport size, pixel density, or format support:

```html
<picture>
  <!-- WebP for browsers that support it -->
  <source srcset="image.webp" type="image/webp">
  <!-- AVIF for even better compression -->
  <source srcset="image.avif" type="image/avif">
  <!-- Fallback -->
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

**Art direction** — Serve completely different image crops for different screen sizes:

```html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-wide.jpg">
  <source media="(min-width: 768px)" srcset="hero-tablet.jpg">
  <img src="hero-mobile.jpg" alt="Hero image">
</picture>
```

**`srcset` and `sizes`** — Let the browser choose the best image based on viewport and pixel density:

```html
<img
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w,
          image-1600.jpg 1600w"
  sizes="(min-width: 1200px) 1200px,
         (min-width: 768px) 800px,
         100vw"
  src="image-800.jpg"
  alt="Description"
  loading="lazy"
>
```

- `srcset` lists available images with their widths (`400w`, `800w`, etc.)
- `sizes` tells the browser how wide the image will display at different viewports
- The browser calculates which image to download based on these hints and the device's pixel ratio

**Performance attributes:**

```html
<!-- Lazy loading: defer off-screen images -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Eager loading for above-the-fold images (default) -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">

<!-- Async decoding for non-critical images -->
<img src="photo.jpg" alt="Photo" decoding="async">

<!-- Explicit dimensions to prevent layout shift -->
<img src="image.jpg" alt="Description" width="800" height="600">
```

**Modern image formats with fallback:**

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

**CSS `object-fit`** — Control how images fit their container:

```css
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;      /* Crop to fill, maintain aspect ratio */
  object-position: center; /* Focus point for cropping */
}
```

**Background images:**

```css
.hero {
  background-image: url('hero-mobile.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .hero { background-image: url('hero-desktop.jpg'); }
}

/* Or use image-set() for resolution switching */
.hero {
  background-image: image-set(
    url('hero.jpg') 1x,
    url('hero-2x.jpg') 2x
  );
}
```

**Best practices:**

- Always include `width` and `height` attributes to prevent Cumulative Layout Shift (CLS)
- Use `loading="lazy"` for below-the-fold images
- Use `fetchpriority="high"` for above-the-fold hero images
- Serve modern formats (WebP, AVIF) with fallbacks
- Use responsive images (`srcset`/`sizes` or `<picture>`) to avoid downloading unnecessarily large images on mobile
- Compress images during build time with tools like Sharp, ImageOptim, or Squoosh
